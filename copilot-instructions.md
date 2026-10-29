# 项目说明：本地 AI 编码 Agent

## 目标
做一个本地跑的 AI 编程助手前端：连 PC 上 Ollama（192.168.2.3:11434），
用 Qwen3-Coder-14B 做代码生成，支持流式输出、工具调用、RAG。

## 技术栈
- Next.js 15（App Router）+ TypeScript（strict）
- Vercel AI SDK（ai / @ai-sdk/ollama）
- 模型后端：本地 Ollama，不接任何云端
- 样式：Tailwind CSS
- 状态：前端 hooks，不引 Redux

## 目录约定
- app/            路由与页面
- app/api/chat/  流式对话接口（POST，SSE）
- lib/ollama.ts  模型配置、工具定义
- lib/tools/     文件读写、列表、搜索工具
- components/     聊天框、文件树、diff 视图

## 编码规范
- 函数式优先，禁止 class 除非必要
- 所有导出函数写 JSDoc
- 不硬编码 IP/密钥，配置放 lib/config.ts
- 工具执行前必须确认，不自动写文件到项目外

## 构建与校验（每次改完必须跑）
- npm install
- npm run build
- npm run lint
- npm run dev 手动验证页面能发消息

## Agent 行为约束
- 先读再写，不瞎编文件结构
- 改多文件前先列计划
- 工具调用只限 read/write/list/search
- 不主动加新依赖，要加先说明原因