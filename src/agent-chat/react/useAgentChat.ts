import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";

import { createAgentTransport } from "../core/createAgentTransport";
import type { AgentChatConfig } from "../core/types";

/**
 * Thin wrapper over the AI SDK `useChat` hook that wires up an Agent Studio
 * transport from a plain config object. Returns the full `useChat` result
 * (`messages`, `sendMessage`, `status`, `error`, `stop`, `regenerate`, ...).
 */
export function useAgentChat(config: AgentChatConfig) {
  const transport = useMemo(
    () => createAgentTransport(config),
    [config.appId, config.agentId, config.apiKey, config.host, config.stream],
  );

  return useChat({ transport });
}
