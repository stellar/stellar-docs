/**
 * Configuration for connecting to an Algolia Agent Studio agent.
 *
 * This module is framework-agnostic on purpose: nothing here imports React or
 * Docusaurus, so the whole `agent-chat` folder can be lifted into a standalone
 * package (e.g. `@stellar/agent-chat`) later without changes.
 */
export interface AgentChatConfig {
  /** Algolia application ID (e.g. `VNSJF5AWIZ`). */
  appId: string;
  /** Published Agent Studio agent ID. */
  agentId: string;
  /** Search-only API key. Safe to expose client-side. */
  apiKey: string;
  /**
   * Override the Algolia host. Defaults to `https://{appId}.algolia.net`.
   * Useful for testing or non-standard clusters.
   */
  host?: string;
  /**
   * Stream responses token-by-token. Defaults to `true`, which is required for
   * the AI SDK `useChat` transport to read a UI message stream.
   */
  stream?: boolean;
}
