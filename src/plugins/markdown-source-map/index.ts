import fs from 'fs';
import path from 'path';

import type { LoadContext, Plugin } from '@docusaurus/types';

// Flatten nested Docusaurus route tree into a flat array
function flattenRoutes(routes: any[]): any[] {
  return routes.flatMap((route) => [
    route,
    ...(route.routes ? flattenRoutes(route.routes) : []),
  ]);
}

// Strip baseUrl prefix from a URL path to get build-relative path
function stripBaseUrl(urlPath: string, baseUrl: string): string {
  if (baseUrl !== '/' && urlPath.startsWith(baseUrl)) {
    return urlPath.slice(baseUrl.length);
  }
  return urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
}

/**
 * Companion to docusaurus-markdown-source-plugin: dumps the mapping from
 * each generated `.md` twin back to its source file, for
 * scripts/rewrite_md_code_examples.mjs (the `postbuild` npm hook) to consume.
 *
 * The regeneration itself cannot live in this plugin: Docusaurus runs all
 * plugins' postBuild hooks concurrently, so there is no way to reliably run
 * after docusaurus-markdown-source-plugin has written the twins. Writing the
 * map is order-independent; the npm `postbuild` hook is guaranteed to run
 * after the whole build.
 *
 * @param context site context, provided by Docusaurus
 * @returns plugin instance that writes the twin-to-source map
 */
export default function markdownSourceMapPlugin(context: LoadContext): Plugin {
  return {
    name: 'stellar-docs-markdown-source-map-plugin',

    async postBuild({ outDir, routes, baseUrl }) {
      const entries = flattenRoutes(routes)
        .filter((route) => {
          const src = route.metadata?.sourceFilePath;
          return src && (src.endsWith('.md') || src.endsWith('.mdx'));
        })
        .map((route) => {
          const markdownUrl = route.path.endsWith('/')
            ? route.path + 'index.md'
            : route.path + '.md';
          return {
            routePath: route.path,
            sourceFilePath: route.metadata.sourceFilePath,
            twinRelPath: stripBaseUrl(markdownUrl, baseUrl),
          };
        });

      const outputPath = path.join(outDir, '.md-source-map.json');
      fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
      console.log(
        `[markdown-source-map] Wrote ${entries.length} twin-to-source entries to ${path.relative(context.siteDir, outputPath)}`,
      );
    },
  };
}
