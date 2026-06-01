import React, { useState } from "react";
import clsx from "clsx";

import { AgentChat, type AgentChatProps } from "./AgentChat";
import styles from "./AgentChatWidget.module.css";

export interface AgentChatWidgetProps extends AgentChatProps {
  /** Title shown in the panel header. */
  title?: string;
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconMaximize = () => (
  <svg {...iconProps}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

const IconMinimize = () => (
  <svg {...iconProps}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

const IconClose = () => (
  <svg {...iconProps}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * Floating launcher button (bottom-right) that opens a Messenger-style chat
 * panel. Renders the shared `AgentChat` UI inside the panel.
 */
export function AgentChatWidget({
  title = "Ask AI",
  ...chatProps
}: AgentChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const close = () => {
    setOpen(false);
    setFullscreen(false);
  };

  return (
    <>
      {open ? (
        <div
          className={clsx(styles.panel, fullscreen && styles.panelFullscreen)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
            }
          }}
        >
          <header className={styles.header}>
            <span className={styles.title}>{title}</span>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.headerButton}
                onClick={() => setFullscreen((value) => !value)}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? <IconMinimize /> : <IconMaximize />}
              </button>
              <button
                type="button"
                className={styles.headerButton}
                onClick={close}
                aria-label="Close chat"
                title="Close"
              >
                <IconClose />
              </button>
            </div>
          </header>
          <div className={styles.body}>
            <AgentChat {...chatProps} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.fab}
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          aria-expanded={false}
        >
          💬
        </button>
      )}
    </>
  );
}
