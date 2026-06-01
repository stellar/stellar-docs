import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import type { AgentChatConfig } from "@site/src/agent-chat";

/**
 * Read the Agent Studio config from Docusaurus `customFields`.
 *
 * This is the Docusaurus-specific glue; it deliberately lives outside the
 * reusable `src/agent-chat` module so that module stays host-agnostic.
 */
export function useAgentChatConfig(): AgentChatConfig {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields!.agentChat as AgentChatConfig;
}
