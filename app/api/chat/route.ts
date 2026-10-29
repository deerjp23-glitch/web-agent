import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { model, tools } from "@/lib/ollama";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
    system:
      "You are a local coding assistant. Use project file tools when useful. Before using writeFile, ask the user to confirm the exact path and content. Never write outside the current project.",
  });

  return result.toUIMessageStreamResponse();
}
