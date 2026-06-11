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
  const config = siteConfig.customFields?.agentChat as
    | AgentChatConfig
    | undefined;

  if (!config?.appId || !config?.agentId || !config?.apiKey) {
    throw new Error(
      "Agent Studio config is missing. Set `customFields.agentChat` " +
        "({ appId, agentId, apiKey }) in docusaurus.config.ts.",
    );
  }

  return config;
}
