import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';

import styles from './styles.module.scss';

interface Props {
  code: string;
}

/**
 * A copyable command line. Deliberately not `@theme/CodeBlock`: inside a 400px
 * panel we want tight padding, wrapping instead of horizontal scroll, and no
 * syntax highlighting bundle.
 */
export default function CopyBlock({ code }: Props): ReactNode {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard is unavailable (insecure origin, or permission denied).
      return;
    }
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.copyBlock}>
      <pre className={styles.code}>{code}</pre>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copy}
        aria-label={
          copied
            ? translate({
                message: 'Copied',
                id: 'components.ForAgentsPanel.Copied',
                description: 'Confirmation shown after copying a command',
              })
            : translate({
                message: 'Copy command',
                id: 'components.ForAgentsPanel.Copy',
                description: 'Label for the button that copies a command',
              })
        }>
        {copied ? <CheckIcon /> : <ClipboardIcon />}
      </button>
    </div>
  );
}

function ClipboardIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v6A1.5 1.5 0 0 0 4 10.5h.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5 6.2 11.7 13 4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
