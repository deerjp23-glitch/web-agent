import { readdir, readFile as readFileFromDisk, realpath, writeFile as writeFileToDisk } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([".git", ".next", "node_modules"]);

async function workspacePath(filePath: string): Promise<string> {
  const root = await realpath(process.cwd());
  const target = path.resolve(root, filePath);
  const relativePath = path.relative(root, target);

  if (
    path.isAbsolute(filePath) ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`)
  ) {
    throw new Error("File paths must stay inside the project directory.");
  }

  return target;
}

async function assertWorkspaceLocation(target: string): Promise<void> {
  const root = await realpath(process.cwd());
  const location = await realpath(target);
  const relativePath = path.relative(root, location);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("File paths must stay inside the project directory.");
  }
}

/**
 * Reads a UTF-8 file from the project directory.
 */
export async function readFile(filePath: string): Promise<string> {
  const target = await workspacePath(filePath);
  await assertWorkspaceLocation(target);
  return readFileFromDisk(target, "utf8");
}

/**
 * Lists project files recursively, excluding generated and dependency folders.
 */
export async function listFiles(directory = "."): Promise<string[]> {
  const root = await realpath(process.cwd());
  const target = await workspacePath(directory);
  await assertWorkspaceLocation(target);

  async function walk(currentDirectory: string): Promise<string[]> {
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;

      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          files.push(...(await walk(entryPath)));
        }
      } else if (entry.isFile()) {
        files.push(path.relative(root, entryPath));
      }
    }

    return files;
  }

  return walk(target);
}

/**
 * Writes UTF-8 content to an existing project directory.
 */
export async function writeFile(
  filePath: string,
  content: string,
): Promise<string> {
  const target = await workspacePath(filePath);
  const parentDirectory = await realpath(path.dirname(target));
  await assertWorkspaceLocation(parentDirectory);

  try {
    await assertWorkspaceLocation(target);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  await writeFileToDisk(target, content, "utf8");
  return `Wrote ${path.relative(process.cwd(), target)}`;
}
