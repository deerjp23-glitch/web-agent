import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Coding Agent",
  description: "A local coding assistant powered by Ollama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
