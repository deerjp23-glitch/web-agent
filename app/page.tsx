import Chat from "@/components/Chat";
import { listFiles } from "@/lib/tools/file";

const panelClass = "min-h-0 border-white/10 bg-[#151619]";

export default async function Home() {
  const files = await listFiles();

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#101113] lg:grid-cols-[240px_minmax(0,1fr)_400px]">
      <aside className={`${panelClass} border-b p-5 lg:border-b-0 lg:border-r`}>
        <h1 className="text-sm font-semibold tracking-wide text-white">
          WORKSPACE
        </h1>
        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-zinc-500">
          文件
        </p>
        <nav aria-label="项目文件" className="mt-3 space-y-1">
          {files.map((file) => (
            <p
              key={file}
              className="truncate rounded px-2 py-1.5 font-mono text-xs text-zinc-400"
              title={file}
            >
              {file}
            </p>
          ))}
          {files.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-zinc-500">暂无文件</p>
          )}
        </nav>
      </aside>

      <section
        aria-label="代码编辑器占位区域"
        className={`${panelClass} flex min-h-64 flex-col items-center justify-center border-b p-8 text-center lg:border-b-0 lg:border-r`}
      >
        <div className="rounded-lg border border-white/10 bg-[#1b1c20] px-5 py-4">
          <p className="text-sm font-medium text-zinc-300">编辑器</p>
          <p className="mt-1 text-xs text-zinc-500">选择文件后在此查看代码</p>
        </div>
      </section>

      <section className={`${panelClass} flex min-h-[70vh] flex-col lg:min-h-screen`}>
        <Chat />
      </section>
    </main>
  );
}
