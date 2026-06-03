import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import type { LoadContext, Plugin } from '@docusaurus/types';

export default function markdownSourceServerPlugin(
  context: LoadContext
): Plugin {
  return {
    name: 'stellar-docs-markdown-source-server-plugin',

    configureWebpack() {
      return {
        devServer: {
          setupMiddlewares(middlewares, devServer) {
            devServer.app.get(/.*\.md$/, (req, res, next) => {
              const requestPath = req.path;

              // Only handle /docs/* requests
              if (!requestPath.startsWith('/docs/')) {
                return next();
              }

              // Map the request path to a file in the docs directory
              // /docs/build/smart-contracts/getting-started/setup.md -> docs/build/smart-contracts/getting-started/setup.{md,mdx}
              let filePath = path.join(
                context.siteDir,
                'docs',
                requestPath.replace(/^\/docs/, '').replace(/\.md$/, '')
              );

              // Try .mdx first, then .md
              let fullPath = filePath + '.mdx';
              if (!fs.existsSync(fullPath)) {
                fullPath = filePath + '.md';
              }

              if (fs.existsSync(fullPath)) {
                res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                const content = fs.readFileSync(fullPath, 'utf-8');
                res.send(content);
              } else {
                next();
              }
            });

            return middlewares;
          },
        },
      };
    },

    async postBuild({ outDir }) {
      // Copy markdown files to build directory so they can be served statically
      const docsDir = path.join(context.siteDir, 'docs');
      const pattern = path.join(docsDir, '**', '*.{md,mdx}');

      const files = globSync(pattern);

      for (const file of files) {
        // Get the relative path from docs directory
        const relativePath = path.relative(docsDir, file);
        const outputPath = path.join(outDir, 'docs', relativePath);

        // Create output directory if it doesn't exist
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Copy the file
        fs.copyFileSync(file, outputPath);
      }

      console.log(`✅ Copied markdown source files to build directory`);
    },
  };
}
