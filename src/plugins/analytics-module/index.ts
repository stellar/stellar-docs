import path from 'path';

import type { Plugin } from '@docusaurus/types';

export default function analyticsModulePlugin(): Plugin {
  return {
    name: 'stellar-docs-analytics-module-plugin',

    getClientModules() {
      return [path.join(__dirname, 'gtag-stub.ts')];
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            innerHTML: `
              if (typeof window.ga === "function") {
                window.ga("require", "linker");
                window.ga("linker:autolink", ["www.stellar.org", "stellar.org"]);
              }
            `,
          },
        ],
      };
    },
  };
}
