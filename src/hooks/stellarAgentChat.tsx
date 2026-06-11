import React from "react";
import CodeBlock from "@theme/CodeBlock";

import { type CodeBlockProps } from "@site/src/agent-chat";

/**
 * Docusaurus-specific glue shared by the floating widget (`theme/Root`) and the
 * `/ai` page, kept in one place so the two consumers can't drift.
 */

/** Render assistant code fences with Docusaurus's highlighted, copyable block. */
export function DocusaurusCodeBlock({ language, children }: CodeBlockProps) {
  return <CodeBlock language={language}>{children}</CodeBlock>;
}

/** Shared copy/config so the floating widget and the `/ai` page stay in sync. */
export const AGENT_TITLE = "Ask Stellar AI";

export const AGENT_PLACEHOLDER = "Ask about Stellar…";

export const AGENT_WELCOME_MESSAGE =
  "Hi! Ask me anything about building on Stellar and I’ll answer using the docs.";

export const AGENT_SUGGESTIONS = [
  "How do I create a Stellar account?",
  "What is a trustline?",
  "How do I deploy a Soroban smart contract?",
  "How does the Stellar Disbursement Platform work?",
];
