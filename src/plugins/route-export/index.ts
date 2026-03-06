import fs from 'fs';
import path from 'path';

import type { LoadContext, Plugin } from "@docusaurus/types";

export interface PluginOptions {
  outputDir?: string;
  outputFilename?: string;
}

/**
 * Write all route paths to a text file, to be checked in to git. This allows
 * for easier comparison of route changes, and a way to identify if nginx
 * redirects are required.
 *
 * @param context site context, provided by Docusaurus
 * @param options user-defined options
 * @returns plugin instance that will write all routes to a text file
 */
export default async function routeExportPlugin(
  context: LoadContext,
  options?: PluginOptions
): Promise<Plugin> {
  return {
    name: 'stellar-docs-route-export-plugin',

    async postBuild({ routesPaths }) {
      const { i18n } = context;
      const current = i18n?.currentLocale;
      const def = i18n?.defaultLocale;

      if (current && def && current !== def) {
        console.log(`ℹ️ Skipping route export for locale ${current} (default is ${def})`);
        return;
      }

      const routes = routesPaths.map(route => {
        // Ensure routes are relative to the site URL
        return route.startsWith('/') ? route : `/${route}`;
      });

      // Sort routes for better readability
      routes.sort();

      // Create content with one URL per line
      const content = routes.join('\n') + '\n';

      // Write to the repo root directory
      const outputPath = path.join(options.outputDir || context.siteDir, options.outputFilename || 'routes.txt');
      fs.writeFileSync(outputPath, content);

      console.log(`✅ Exported ${routes.length} routes to ${outputPath}`);
    }
  }
}
