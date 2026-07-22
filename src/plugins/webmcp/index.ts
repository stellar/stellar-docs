import path from 'path';

import type { LoadContext, Plugin } from '@docusaurus/types';

type AlgoliaCredentials = {
  appId: string;
  apiKey: string;
  indexName: string;
};

export default function webMcpPlugin(context: LoadContext): Plugin {
  const algolia = context.siteConfig.themeConfig.algolia as
    | AlgoliaCredentials
    | undefined;

  return {
    name: 'stellar-docs-webmcp-plugin',

    getClientModules() {
      return [path.join(__dirname, 'webmcp-client.ts')];
    },

    injectHtmlTags() {
      if (!algolia) {
        return {};
      }
      // The client module can't read themeConfig, so hand it the search
      // credentials via a global. These are the search-only Algolia keys that
      // every DocSearch request already ships to the browser — nothing here is
      // secret.
      return {
        preBodyTags: [
          {
            tagName: 'script',
            innerHTML: `window.__webMcpAlgolia = ${JSON.stringify({
              appId: algolia.appId,
              apiKey: algolia.apiKey,
              indexName: algolia.indexName,
            })};`,
          },
        ],
      };
    },
  };
}
