import React from "react";
import { CopyButton } from "./CopyButton";
import styles from "./CodeBlock.module.css";

export interface CodeBlockProps {
  /** The language identifier (e.g. `bash`), if known. */
  language?: string;
  /** The original `language-xxx` class from the markdown fence. */
  className?: string;
  /** The raw code text. */
  children: string;
}

/**
 * Default, host-agnostic copyable code block. Has no syntax highlighting; hosts
 * that want it (e.g. Docusaurus) can pass their own component via the
 * `codeBlock` prop on `AgentChat`.
 */
export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <div className={styles.wrapper}>
      <CopyButton
        value={children}
        className={styles.copy}
        ariaLabel="Copy code"
      />
      <pre className={styles.pre}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
