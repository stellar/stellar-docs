/**
 * Single source of truth for "how do I point my AI agent at Stellar" content.
 *
 * Consumed by both:
 *  - the "For agents" panel (`src/components/ForAgentsPanel`), and
 *  - the Building with AI page (`docs/build/building-with-ai.mdx`), via
 *    `src/components/AgentSetup`.
 *
 * Keep this file free of JSX so either consumer can render it its own way.
 * Notes are plain text; anything that needs to be clickable goes in `links`.
 */

/**
 * Shared with the `<Tabs>` on the Building with AI page. Docusaurus persists a
 * tab group's choice under `docusaurus.tab.<groupId>`, so the panel reads and
 * writes that same key: pick Codex in the panel and the page's tabs follow.
 */
export const AGENT_TOOL_GROUP_ID = 'mcp-client';

export const AGENT_TOOL_STORAGE_KEY = `docusaurus.tab.${AGENT_TOOL_GROUP_ID}`;

export interface Snippet {
  /** Prism language for the docs page; the panel renders snippets unstyled. */
  language: string;
  code: string;
}

export interface ExternalLink {
  label: string;
  href: string;
}

export interface ToolInstructions {
  /** Short prose above the snippets. Plain text: this has to fit a 400px panel. */
  note?: string;
  snippets: Snippet[];
  links?: ExternalLink[];
}

export interface AgentTool {
  /** Also the `<TabItem>` value, so panel and page selections line up. */
  id: string;
  label: string;
  raven: ToolInstructions;
  skills: {
    install: ToolInstructions;
    tryWithoutInstalling: ToolInstructions;
  };
}

const RAVEN_MCP_URL = 'https://raven.stellar.buzz/mcp';
const SKILL_REPO_URL = 'https://github.com/stellar/stellar-dev-skill';

/** Every tool that has no first-party skills CLI installs through `npx skills`. */
const npxSkillsInstall: ToolInstructions = {
  note: 'Works with any tool that supports the Agent Skills standard.',
  snippets: [
    {
      language: 'bash',
      code: `npx skills add ${SKILL_REPO_URL}`,
    },
  ],
};

/**
 * Skills work without installing anything: point the agent at the website and
 * it reads the skills it needs. Same for every tool.
 */
const browseSkillsInstead: ToolInstructions = {
  note: 'Tell your agent:',
  snippets: [
    {
      language: 'text',
      code: 'Read skills.stellar.org before you start building on Stellar.',
    },
  ],
};

export const AGENT_TOOLS: AgentTool[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    raven: {
      snippets: [
        {
          language: 'bash',
          code: `claude mcp add --transport http stellar-raven "${RAVEN_MCP_URL}"\n# then run /mcp -> Authenticate -> sign in in your browser`,
        },
      ],
    },
    skills: {
      install: {
        note: 'Adds the skill to your tool permanently.',
        snippets: [
          { language: 'bash', code: '/plugin marketplace add stellar/stellar-dev-skill' },
          { language: 'bash', code: '/plugin install stellar-dev@stellar-dev' },
        ],
      },
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
  {
    id: 'codex',
    label: 'Codex',
    raven: {
      snippets: [
        {
          language: 'bash',
          code: `codex mcp add stellar-raven --url "${RAVEN_MCP_URL}"\ncodex mcp login stellar-raven  # opens your browser`,
        },
      ],
    },
    skills: {
      install: {
        note: 'Codex reads skills from ~/.codex/skills/.',
        snippets: [
          {
            language: 'bash',
            code: `git clone ${SKILL_REPO_URL} ~/.codex/skills/stellar-dev-skill`,
          },
        ],
      },
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
  {
    id: 'vscode',
    label: 'VS Code',
    raven: {
      snippets: [
        {
          language: 'bash',
          code: `code --add-mcp '{"name":"stellar-raven","type":"http","url":"${RAVEN_MCP_URL}"}'`,
        },
      ],
    },
    skills: {
      install: npxSkillsInstall,
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
  {
    id: 'cursor',
    label: 'Cursor',
    raven: {
      note: 'Add to ~/.cursor/mcp.json (or .cursor/mcp.json per project). Cursor runs the OAuth sign-in on first use.',
      snippets: [
        {
          language: 'json',
          code: `{\n  "mcpServers": {\n    "stellar-raven": { "url": "${RAVEN_MCP_URL}" }\n  }\n}`,
        },
      ],
    },
    skills: {
      install: npxSkillsInstall,
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
  {
    id: 'claude-desktop',
    label: 'Claude desktop',
    raven: {
      note: 'Go to Settings -> Connectors -> Add custom connector, paste the endpoint, and approve the browser sign-in.',
      snippets: [{ language: 'text', code: RAVEN_MCP_URL }],
    },
    skills: {
      install: npxSkillsInstall,
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
  {
    id: 'other',
    label: 'Other clients',
    raven: {
      note: 'For clients without native remote or OAuth support, bridge with mcp-remote.',
      snippets: [
        {
          language: 'json',
          code: `{\n  "mcpServers": {\n    "stellar-raven": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "mcp-remote@latest",\n        "${RAVEN_MCP_URL}",\n        "--transport",\n        "http-only"\n      ]\n    }\n  }\n}`,
        },
      ],
      links: [{ label: 'mcp-remote', href: 'https://github.com/geelen/mcp-remote' }],
    },
    skills: {
      install: npxSkillsInstall,
      tryWithoutInstalling: browseSkillsInstead,
    },
  },
];

export const DEFAULT_AGENT_TOOL_ID = AGENT_TOOLS[0].id;

export function getAgentTool(id: string | null | undefined): AgentTool {
  return AGENT_TOOLS.find((tool) => tool.id === id) ?? AGENT_TOOLS[0];
}

/** Section copy, shared so the panel and the page cannot drift apart. */
export const AGENT_SECTIONS = {
  raven: {
    title: 'Raven MCP Server',
    description: 'Connect your AI agent to Stellar data and tooling.',
    guide: { label: 'Full guide', href: '/docs/build/building-with-ai' },
    links: [
      { label: 'Try in chat', href: 'https://raven.stellar.buzz/playground' },
      { label: 'View source', href: 'https://github.com/kalepail/stellar-raven' },
    ] satisfies ExternalLink[],
  },
  skills: {
    title: 'Stellar Skills',
    description: 'Stellar context for your agent before it writes code.',
    home: { label: 'skills.stellar.org', href: 'https://skills.stellar.org/' },
    modes: [
      { id: 'install', label: 'Install' },
      { id: 'tryWithoutInstalling', label: 'Try without installing' },
    ],
  },
  llmsTxt: {
    title: 'llms.txt',
    href: '/llms.txt',
    description: 'Machine-readable overview of the Stellar docs.',
  },
} as const;

export type SkillsMode = 'install' | 'tryWithoutInstalling';
