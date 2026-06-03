import { DefaultChatTransport, type UIMessage } from "ai";

import type { AgentChatConfig } from "./types";

type AnyPart = UIMessage["parts"][number];

function isToolPart(part: AnyPart): boolean {
  return part.type.startsWith("tool-") || part.type === "dynamic-tool";
}

/**
 * Agent Studio replays UI message history to the underlying LLM, but it drops
 * tool parts that never produced an output (state `output-error` from a failed
 * tool run, or `input-*` after a stopped stream) without dropping the matching
 * `tool_use` block. The LLM then rejects the whole conversation ("`tool_use`
 * ids were found without `tool_result` blocks"), and every later turn fails.
 *
 * Work around it client-side: rewrite errored tool parts so the error text
 * becomes a regular output (keeping that context for the model), and drop tool
 * parts that have no input/output to pair up at all.
 */
export function sanitizeMessages(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: message.parts
      .filter(
        (part) =>
          !isToolPart(part) ||
          ("state" in part &&
            (part.state === "output-available" ||
              part.state === "output-error")),
      )
      .map((part) => {
        if (isToolPart(part) && "state" in part && part.state === "output-error") {
          const { errorText, ...rest } = part as typeof part & {
            errorText?: string;
          };
          return {
            ...rest,
            state: "output-available",
            output: { error: errorText ?? "Tool call failed." },
          } as AnyPart;
        }
        return part;
      }),
  }));
}

/**
 * Build the Agent Studio completions endpoint URL for a given agent.
 *
 * Uses `compatibilityMode=ai-sdk-5` to match the AI SDK v5 UI message stream
 * protocol, and `stream=true` so `useChat` receives a streamable response.
 */
export function buildCompletionsUrl(config: AgentChatConfig): string {
  const host =
    config.host ?? `https://${config.appId.toLowerCase()}.algolia.net`;
  const params = new URLSearchParams({
    compatibilityMode: "ai-sdk-5",
    stream: String(config.stream ?? true),
  });
  return `${host}/agent-studio/1/agents/${config.agentId}/completions?${params.toString()}`;
}

/**
 * Create an AI SDK transport pointed at an Agent Studio agent.
 *
 * Pass the result to `useChat({ transport })` (or use the `useAgentChat` hook,
 * which does this for you).
 */
export function createAgentTransport(config: AgentChatConfig) {
  return new DefaultChatTransport({
    api: buildCompletionsUrl(config),
    headers: {
      "x-algolia-application-id": config.appId,
      "x-algolia-api-key": config.apiKey,
    },
    prepareSendMessagesRequest: ({ id, messages, body }) => ({
      body: { ...body, id, messages: sanitizeMessages(messages) },
    }),
  });
}
