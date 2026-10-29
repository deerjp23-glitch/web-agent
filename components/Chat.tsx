"use client";

import { useChat } from "@ai-sdk/react";
import { FormEvent, useState } from "react";

export default function Chat() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    setInput("");
  }

  return (
    <>
      <header className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-100">本地助手</h2>
        <p className="mt-1 text-xs text-zinc-500">Ollama · qwen3-coder-14b-16k</p>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm leading-6 text-zinc-500">
            发送消息开始对话。你可以让助手查看项目文件。
          </p>
        )}

        {messages.map((message) => (
          <article key={message.id} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {message.role === "user" ? "你" : "助手"}
            </p>
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <p
                    key={`${message.id}-${index}`}
                    className="whitespace-pre-wrap text-sm leading-6 text-zinc-200"
                  >
                    {part.text}
                  </p>
                );
              }

              if (part.type.startsWith("tool-")) {
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className="rounded-md border border-white/10 bg-[#1b1c20] p-3 text-xs"
                  >
                    <p className="font-medium text-sky-300">
                      工具调用：{part.type.slice(5)}
                    </p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-zinc-400">
                      {JSON.stringify(part, null, 2)}
                    </pre>
                  </div>
                );
              }

              return null;
            })}
          </article>
        ))}

        {error && (
          <p role="alert" className="text-sm text-red-400">
            请求失败：{error.message}
          </p>
        )}
      </div>

      <form onSubmit={submitMessage} className="border-t border-white/10 p-4">
        <label htmlFor="chat-input" className="sr-only">
          输入消息
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="给本地助手发送消息…"
          rows={3}
          className="w-full resize-none rounded-lg border border-white/10 bg-[#1b1c20] p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-500/60"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? "生成中…" : "发送"}
          </button>
        </div>
      </form>
    </>
  );
}
