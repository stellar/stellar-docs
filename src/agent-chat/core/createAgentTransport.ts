import { DefaultChatTransport } from "ai";

import type { AgentChatConfig } from "./types";

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
  });
}
