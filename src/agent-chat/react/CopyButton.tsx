import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./CopyButton.module.css";

export interface CopyButtonProps {
  /** Text to copy to the clipboard. */
  value: string;
  /** Extra class for positioning/styling. */
  className?: string;
  /** Tooltip / accessible label while idle. */
  label?: string;
  /** Tooltip / accessible label shown briefly after copying. */
  copiedLabel?: string;
  /** Accessible label. Falls back to `label`. */
  ariaLabel?: string;
}

/*
 * Same glyphs as Docusaurus's `@theme/Icon/Copy` and `@theme/Icon/Success`
 * (MIT), inlined so this module stays host-agnostic — importing `@theme/*`
 * here would couple it to Docusaurus. `currentColor` keeps them correct in
 * both light and dark mode.
 */
function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
      />
    </svg>
  );
}

function IconSuccess(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
      />
    </svg>
  );
}

/** Small icon button that copies `value` to the clipboard with brief feedback. */
export function CopyButton({
  value,
  className,
  label = "Copy",
  copiedLabel = "Copied",
  ariaLabel,
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

  const title = copied ? copiedLabel : (ariaLabel ?? label);

  return (
    <button
      type="button"
      className={clsx(styles.button, copied && styles.copied, className)}
      onClick={onCopy}
      aria-label={title}
      title={title}
    >
      {copied ? (
        <IconSuccess className={styles.icon} />
      ) : (
        <IconCopy className={styles.icon} />
      )}
    </button>
  );
}
