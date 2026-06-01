# agent-chat

A small, reusable React chat UI for an
[Algolia Agent Studio](https://www.algolia.com/doc/guides/algolia-ai/agent-studio/)
agent, built on the [Vercel AI SDK](https://ai-sdk.dev/) (`useChat` +
`DefaultChatTransport`).

It is intentionally **host-agnostic**: nothing here imports Docusaurus. The
folder can be lifted into a standalone package (e.g. `@stellar/agent-chat`) by
copying it and adding a `package.json`.

## Layout

```
core/    # no React/Docusaurus deps — transport + config types
react/   # React UI: useAgentChat hook, AgentChat, AgentChatWidget, CodeBlock, CopyButton, Markdown
index.ts # public exports
theme-fallback.css  # optional CSS vars for non-Docusaurus hosts
```

## Usage

```tsx
import { AgentChat } from "@site/src/agent-chat";

<AgentChat
  config={{
    appId: "YOUR_APP_ID",
    agentId: "YOUR_AGENT_ID",
    apiKey: "YOUR_SEARCH_ONLY_KEY", // safe to expose client-side
  }}
  welcomeMessage="Ask me anything…"
  suggestions={["How do I start?"]}
/>;
```

Floating launcher variant:

```tsx
import { AgentChatWidget } from "@site/src/agent-chat";

<AgentChatWidget config={config} title="Ask AI" />;
```

## Key props (`AgentChat`)

| Prop                      | Purpose                                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`                  | `{ appId, agentId, apiKey, host?, stream? }` connection details.                                                                                                 |
| `welcomeMessage`          | Shown on the empty state.                                                                                                                                        |
| `suggestions`             | Starter prompt buttons.                                                                                                                                          |
| `placeholder`             | Input placeholder.                                                                                                                                               |
| `markdownClassName`       | Class applied to rendered answers so they inherit the host's prose styling (e.g. Docusaurus `"markdown"`).                                                       |
| `codeBlock`               | Component used for fenced code. Defaults to a built-in copyable block; pass the host's highlighter (e.g. Docusaurus `@theme/CodeBlock`) for syntax highlighting. |
| `hideStatusUntilToolCall` | Hide a streaming reply until a tool call occurs, suppressing pre-search "status" chatter. Defaults to `true`. Set `false` for agents that answer without tools.  |

`AgentChatWidget` accepts all of the above plus `title`.

## Theming

The UI reads **Infima CSS variables** (`--ifm-*`), so inside a Docusaurus site
it matches the theme (including light/dark) automatically.

- **Accent color**: set `--agent-chat-accent` and `--agent-chat-accent-contrast`
  (defaults to Stellar gold `#fdda24` on near-black). Used for the launcher,
  header, user bubbles, and send button.
- **Non-Docusaurus hosts**: import `theme-fallback.css` once to supply the
  `--ifm-*` variables, then override as needed.

## Notes for extraction into a standalone package

- Declared runtime deps: `react`, `ai`, `@ai-sdk/react`, `react-markdown`,
  `remark-gfm`, `clsx`.
- Pin `ai`/`@ai-sdk/react` to the v5 line to match the endpoint's
  `compatibilityMode=ai-sdk-5`.
- The `react/` components must run client-side (they use the clipboard and
  streaming). In SSR frameworks, render them in a browser-only boundary (e.g.
  Docusaurus `<BrowserOnly>`).
- `core/` has no React dependency and can be used on its own to build requests.
