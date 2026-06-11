import React from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";

import { AgentChat } from "@site/src/agent-chat";
import { useAgentChatConfig } from "@site/src/hooks/useAgentChatConfig";
import {
  DocusaurusCodeBlock,
  AGENT_PLACEHOLDER,
  AGENT_WELCOME_MESSAGE,
  AGENT_SUGGESTIONS,
} from "@site/src/hooks/stellarAgentChat";
import styles from "./ai.module.css";

function Panel() {
  const config = useAgentChatConfig();
  return (
    <AgentChat
      config={config}
      className={styles.panel}
      placeholder={AGENT_PLACEHOLDER}
      welcomeMessage={AGENT_WELCOME_MESSAGE}
      suggestions={AGENT_SUGGESTIONS}
      markdownClassName="markdown"
      codeBlock={DocusaurusCodeBlock}
    />
  );
}

export default function AiPage(): React.ReactElement {
  return (
    <Layout
      title="Ask AI"
      description="Chat with the Stellar Docs AI assistant, powered by Algolia Agent Studio."
    >
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.heading}>Ask Stellar AI</h1>
          <p className={styles.subheading}>
            Get answers about building on Stellar, grounded in the official
            documentation.
          </p>
        </div>
        <div className={styles.chatFrame}>
          <BrowserOnly
            fallback={<div className={styles.loading}>Loading assistant…</div>}
          >
            {() => <Panel />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
