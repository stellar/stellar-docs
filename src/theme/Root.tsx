import React, { type ReactNode } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

import { AgentChatWidget } from "@site/src/agent-chat";
import { useAgentChatConfig } from "@site/src/hooks/useAgentChatConfig";
import {
  DocusaurusCodeBlock,
  AGENT_TITLE,
  AGENT_PLACEHOLDER,
  AGENT_WELCOME_MESSAGE,
  AGENT_SUGGESTIONS,
} from "@site/src/hooks/stellarAgentChat";

function StellarAgentWidget() {
  const config = useAgentChatConfig();
  return (
    <AgentChatWidget
      config={config}
      title={AGENT_TITLE}
      placeholder={AGENT_PLACEHOLDER}
      welcomeMessage={AGENT_WELCOME_MESSAGE}
      suggestions={AGENT_SUGGESTIONS}
      markdownClassName="markdown"
      codeBlock={DocusaurusCodeBlock}
    />
  );
}

/**
 * Docusaurus `Root` wraps the entire app and persists across client-side
 * navigation, so the floating chat widget stays mounted on every page.
 * Rendered inside `BrowserOnly` because the chat relies on browser-only APIs.
 */
export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      {children}
      <BrowserOnly>{() => <StellarAgentWidget />}</BrowserOnly>
    </>
  );
}
