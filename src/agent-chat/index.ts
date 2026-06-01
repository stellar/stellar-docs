/**
 * Reusable Algolia Agent Studio chat module.
 *
 * Designed to be host-agnostic: the `core/` layer has no React/Docusaurus
 * dependency, and the `react/` layer only depends on React + the AI SDK. To
 * reuse elsewhere, copy this folder and add a `package.json`.
 */
export {
  buildCompletionsUrl,
  createAgentTransport,
} from "./core/createAgentTransport";
export type { AgentChatConfig } from "./core/types";

export { useAgentChat } from "./react/useAgentChat";
export { AgentChat, type AgentChatProps } from "./react/AgentChat";
export {
  AgentChatWidget,
  type AgentChatWidgetProps,
} from "./react/AgentChatWidget";
export {
  Markdown,
  type MarkdownProps,
  type CodeBlockComponent,
} from "./react/Markdown";
export { CodeBlock, type CodeBlockProps } from "./react/CodeBlock";
export { CopyButton, type CopyButtonProps } from "./react/CopyButton";
