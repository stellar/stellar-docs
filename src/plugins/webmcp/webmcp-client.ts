// Registers a WebMCP `search_docs` tool so in-browser AI agents can search
// these docs (https://webmachinelearning.github.io/webmcp/). WebMCP is
// per-page browser tooling — client-side JS, not a network MCP server. The
// API only exists behind an experimental flag (Chrome EPP / W3C draft), so in
// every other browser this module must be a silent no-op.

type AlgoliaCredentials = {
  appId: string;
  apiKey: string;
  indexName: string;
};

type WebMcpWindow = Window & {
  // Injected by the plugin (src/plugins/webmcp/index.ts) from themeConfig.
  __webMcpAlgolia?: AlgoliaCredentials;
};

type AlgoliaHit = {
  hierarchy?: Record<string, string | null>;
  url?: string;
  content?: string | null;
  _snippetResult?: { content?: { value?: string } };
};

type ToolContent = { content: Array<{ type: 'text'; text: string }> };

type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: { query?: unknown }) => Promise<ToolContent>;
};

// The draft spec has moved between navigator.modelContext and
// document.modelContext, and between registerTool() and provideContext().
// Chrome's EPP (and the scanners that grade agent-readiness) use
// navigator.modelContext.registerTool; the current W3C draft says
// document.modelContext. Probe every surface so the tool registers wherever
// the running browser put the API.
type ModelContext = {
  registerTool?: (tool: ModelContextTool) => unknown;
  provideContext?: (context: { tools: ModelContextTool[] }) => unknown;
};

function textResult(text: string): ToolContent {
  return { content: [{ type: 'text', text }] };
}

// Strip markup to a fixpoint so overlapping fragments like `<scr<script>ipt>`
// can't survive a single pass (CodeQL js/incomplete-multi-character-sanitization).
function stripMarkup(value: string): string {
  let text = value;
  let previous;
  do {
    previous = text;
    text = text.replace(/<[^>]*>/g, '');
  } while (text !== previous);
  return text;
}

async function searchDocs(
  query: string,
  algolia: AlgoliaCredentials,
): Promise<string> {
  // Same contextual facets DocSearch uses on this site: English records from
  // the docs plugin plus untagged (default) pages, excluding blog-index noise.
  const language = document.documentElement.lang?.split('-')[0] || 'en';
  const params = new URLSearchParams({
    query,
    hitsPerPage: '8',
    attributesToRetrieve: JSON.stringify(['hierarchy', 'url', 'content']),
    attributesToSnippet: JSON.stringify(['content:40']),
    snippetEllipsisText: '…',
    highlightPreTag: '',
    highlightPostTag: '',
    facetFilters: JSON.stringify([
      `language:${language}`,
      ['docusaurus_tag:default', 'docusaurus_tag:docs-default-current'],
    ]),
  });

  const response = await fetch(
    `https://${algolia.appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(algolia.indexName)}/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-Application-Id': algolia.appId,
        'X-Algolia-API-Key': algolia.apiKey,
      },
      body: JSON.stringify({ params: params.toString() }),
    },
  );
  if (!response.ok) {
    throw new Error(`Algolia search returned HTTP ${response.status}`);
  }

  const data = (await response.json()) as { nbHits?: number; hits?: AlgoliaHit[] };
  const results = (data.hits ?? []).map((hit) => {
    const hierarchy = hit.hierarchy ?? {};
    const title =
      [hierarchy.lvl0, hierarchy.lvl1, hierarchy.lvl2, hierarchy.lvl3]
        .filter(Boolean)
        .join(' › ') || hit.url || '';
    // Snippets come back with highlight markup even with empty highlight
    // tags on some index configs — strip any leftover tags for plain text.
    const snippet = stripMarkup(
      hit._snippetResult?.content?.value ?? hit.content ?? '',
    );
    return { title, url: hit.url ?? '', snippet };
  });

  return JSON.stringify({ query, totalHits: data.nbHits ?? results.length, results });
}

const searchDocsTool: ModelContextTool = {
  name: 'search_docs',
  description:
    'Search the Stellar developer documentation (developers.stellar.org) and ' +
    'return matching pages and sections as JSON — title, url, and a ' +
    'plain-text snippet for each result.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'Plain-text search query, e.g. "soroban contract deployment".',
      },
    },
    required: ['query'],
  },
  annotations: { readOnlyHint: true },
  async execute(input) {
    try {
      const query = typeof input?.query === 'string' ? input.query.trim() : '';
      if (!query) {
        return textResult('Error: `query` must be a non-empty string.');
      }
      const algolia = (window as WebMcpWindow).__webMcpAlgolia;
      if (!algolia) {
        return textResult('Error: search is not configured on this page.');
      }
      return textResult(await searchDocs(query, algolia));
    } catch (error) {
      return textResult(`Error searching docs: ${String(error)}`);
    }
  },
};

if (typeof window !== 'undefined') {
  const surfaces = [
    (navigator as Navigator & { modelContext?: ModelContext }).modelContext,
    (document as Document & { modelContext?: ModelContext }).modelContext,
  ];
  // Register once per distinct surface (they alias in a real implementation).
  const seen = new Set<ModelContext>();
  for (const modelContext of surfaces) {
    if (!modelContext || seen.has(modelContext)) {
      continue;
    }
    seen.add(modelContext);
    try {
      if (typeof modelContext.registerTool === 'function') {
        modelContext.registerTool(searchDocsTool);
      } else if (typeof modelContext.provideContext === 'function') {
        modelContext.provideContext({ tools: [searchDocsTool] });
      }
    } catch {
      // Experimental API — registration must never break the page.
    }
  }
}

export {};
