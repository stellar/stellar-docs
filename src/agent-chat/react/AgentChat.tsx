import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { UIMessage } from "ai";

import { useAgentChat } from "./useAgentChat";
import { Markdown, type CodeBlockComponent } from "./Markdown";
import { CopyButton } from "./CopyButton";
import { textParts, visibleAnswer } from "./messageParts";
import type { AgentChatConfig } from "../core/types";
import styles from "./AgentChat.module.css";

export interface AgentChatProps {
  /** Agent Studio connection config. */
  config: AgentChatConfig;
  /** Extra class on the root container. */
  className?: string;
  /** Placeholder for the input. */
  placeholder?: string;
  /** Message shown before the conversation starts. */
  welcomeMessage?: string;
  /** Optional starter prompts shown on the empty state. */
  suggestions?: string[];
  /**
   * Class applied to rendered assistant markdown so it can inherit the host
   * site's prose styling (e.g. Docusaurus's `markdown` class). Host-agnostic:
   * pass nothing for unstyled output.
   */
  markdownClassName?: string;
  /**
   * Component used to render fenced code blocks. Defaults to a built-in
   * copyable block; pass a host component (e.g. Docusaurus `@theme/CodeBlock`)
   * for syntax highlighting that matches the site.
   */
  codeBlock?: CodeBlockComponent;
  /**
   * While an assistant message is streaming, hide its text until a tool call
   * has occurred. This suppresses the "Let me find that…" status chatter that
   * tool-using agents emit before each search. Defaults to `true`.
   *
   * Set to `false` for agents that answer **without** calling tools, otherwise
   * their reply won't appear until streaming finishes.
   */
  hideStatusUntilToolCall?: boolean;
}

function Message({
  message,
  markdownClassName,
  codeBlock,
  streaming,
  hideStatusUntilToolCall,
}: {
  message: UIMessage;
  markdownClassName?: string;
  codeBlock?: CodeBlockComponent;
  streaming: boolean;
  hideStatusUntilToolCall: boolean;
}) {
  const isUser = message.role === "user";
  const segments = isUser
    ? textParts(message)
    : visibleAnswer(message, streaming, hideStatusUntilToolCall);
  if (segments.length === 0) {
    return null;
  }
  return (
    <div
      className={clsx(
        styles.message,
        isUser ? styles.userMessage : styles.assistantMessage,
      )}
    >
      <div className={styles.bubble}>
        {isUser ? (
          segments.join("\n\n")
        ) : (
          <>
            <div className={clsx(styles.prose, markdownClassName)}>
              {segments.map((segment, index) => (
                <Markdown key={index} codeBlock={codeBlock}>
                  {segment}
                </Markdown>
              ))}
            </div>
            {!streaming && (
              <div className={styles.bubbleActions}>
                <CopyButton
                  value={segments.join("\n\n")}
                  ariaLabel="Copy response"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Headless-ish chat UI for an Agent Studio agent. Renders a scrollable message
 * list and an input. Styling is driven by Infima CSS variables so it adapts to
 * the host site's light/dark theme automatically.
 */
export function AgentChat({
  config,
  className,
  placeholder = "Ask a question…",
  welcomeMessage,
  suggestions,
  markdownClassName,
  codeBlock,
  hideStatusUntilToolCall = true,
}: AgentChatProps) {
  const { messages, sendMessage, status, error, stop, regenerate } =
    useAgentChat(config);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Whether the user was at the bottom of the log before the latest update.
  const atBottomRef = useRef(true);

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  // Always log the underlying error so bug reports include the real cause;
  // the visible banner stays generic for users.
  useEffect(() => {
    if (error) {
      console.error("[agent-chat] Chat request failed:", error);
    }
  }, [error]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      atBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    }
  };

  // Auto-scroll on new content, but only if the user hasn't scrolled up to
  // read earlier messages.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && atBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, status]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) {
      return;
    }
    sendMessage({ text: trimmed });
    setInput("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(input);
    }
  };

  // The last assistant message is the one actively streaming while busy.
  const last = messages[messages.length - 1];
  const streamingId =
    isBusy && last && last.role === "assistant" ? last.id : undefined;

  // Show a thinking indicator while in flight and no answer text is visible yet
  // (covers: awaiting first token, and running tools before the answer starts).
  const showThinking =
    isBusy &&
    (!last ||
      last.role === "user" ||
      visibleAnswer(last, true, hideStatusUntilToolCall).length === 0);

  return (
    <div className={clsx(styles.container, className)}>
      <div
        className={styles.messages}
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
      >
        {isEmpty && (
          <div className={styles.empty}>
            {welcomeMessage && (
              <p className={styles.welcome}>{welcomeMessage}</p>
            )}
            {suggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={styles.suggestion}
                    onClick={() => submit(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            markdownClassName={markdownClassName}
            codeBlock={codeBlock}
            streaming={message.id === streamingId}
            hideStatusUntilToolCall={hideStatusUntilToolCall}
          />
        ))}

        {showThinking && (
          <div className={clsx(styles.message, styles.assistantMessage)}>
            <div className={clsx(styles.bubble, styles.thinking)}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            <span>Something went wrong.</span>
            <button
              type="button"
              className={styles.retry}
              onClick={() => regenerate()}
            >
              Retry
            </button>
            {process.env.NODE_ENV !== "production" && (
              <pre className={styles.errorDetail}>
                {error.message || String(error)}
              </pre>
            )}
          </div>
        )}
      </div>

      <form
        className={styles.inputRow}
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <textarea
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label="Message"
        />
        {isBusy ? (
          <button
            type="button"
            className={styles.sendButton}
            onClick={() => stop()}
            aria-label="Stop"
          >
            ◼
          </button>
        ) : (
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim()}
            aria-label="Send"
          >
            ↑
          </button>
        )}
      </form>
    </div>
  );
}
