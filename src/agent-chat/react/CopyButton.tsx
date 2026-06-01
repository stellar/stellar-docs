import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./CopyButton.module.css";

export interface CopyButtonProps {
  /** Text to copy to the clipboard. */
  value: string;
  /** Extra class for positioning/styling. */
  className?: string;
  /** Idle label. */
  label?: string;
  /** Label shown briefly after copying. */
  copiedLabel?: string;
  /** Accessible label. */
  ariaLabel?: string;
}

/** Small button that copies `value` to the clipboard with brief feedback. */
export function CopyButton({
  value,
  className,
  label = "Copy",
  copiedLabel = "Copied",
  ariaLabel = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); ignore.
    }
  };

  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      onClick={onCopy}
      aria-label={ariaLabel}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
