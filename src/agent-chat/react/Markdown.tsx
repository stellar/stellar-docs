import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock, type CodeBlockProps } from "./CodeBlock";

export type CodeBlockComponent = React.ComponentType<CodeBlockProps>;

export interface MarkdownProps {
  children: string;
  /** Component used to render fenced code blocks. Defaults to {@link CodeBlock}. */
  codeBlock?: CodeBlockComponent;
}

/**
 * Render assistant markdown (GitHub-flavored) to HTML. Links open in a new tab;
 * fenced code blocks render through `codeBlock` (copyable). The surrounding
 * container decides prose styling, so this component stays host-agnostic.
 */
export function Markdown({ children, codeBlock }: MarkdownProps) {
  const Code = codeBlock ?? CodeBlock;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => {
          const href = props.href ?? "";
          const isExternal = /^https?:\/\//.test(href);
          return (
            <a
              {...props}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            />
          );
        },
        // Unwrap the default <pre>; the code component renders the block itself.
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className ?? "");
          const raw = String(children ?? "").replace(/\n$/, "");
          const isBlock = match != null || raw.includes("\n");
          if (isBlock) {
            return (
              <Code language={match?.[1]} className={className}>
                {raw}
              </Code>
            );
          }
          return <code className={className}>{children}</code>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
