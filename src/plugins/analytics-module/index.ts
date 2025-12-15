import type { LoadContext, Plugin } from "@docusaurus/types";

export default function analyticsModulePlugin(context: LoadContext): Plugin {
  return {
    name: 'stellar-docs-analytics-module-plugin',

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
