import { tool } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from "@/lib/config";
import {
  listFiles as listProjectFiles,
  readFile as readProjectFile,
  writeFile as writeProjectFile,
} from "@/lib/tools/file";

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: `${OLLAMA_BASE_URL}/v1`,
});

export const model = ollama.chatModel(OLLAMA_MODEL);

export const tools = {
  readFile: tool({
    description: "Read a UTF-8 file inside the current project.",
    inputSchema: z.object({
      path: z.string().describe("Project-relative file path"),
    }),
    execute: ({ path }) => readProjectFile(path),
  }),
  listFiles: tool({
    description: "List files inside the current project.",
    inputSchema: z.object({
      directory: z
        .string()
        .optional()
        .describe("Project-relative directory; defaults to the project root"),
    }),
    execute: ({ directory }) => listProjectFiles(directory),
  }),
  writeFile: tool({
    description:
      "Write UTF-8 content to a file inside the current project. Ask the user to confirm the exact path and content before calling this tool.",
    inputSchema: z.object({
      path: z.string().describe("Project-relative file path"),
      content: z.string().describe("Complete UTF-8 file content"),
    }),
    execute: ({ path, content }) => writeProjectFile(path, content),
  }),
};
