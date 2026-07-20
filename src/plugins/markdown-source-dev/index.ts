import fs from "fs";
import path from "path";

import type { LoadContext, Plugin } from "@docusaurus/types";

// docusaurus-markdown-source-plugin only materializes the .md files at
// postBuild, so the "Open Markdown" button 404s under `docusaurus start`.
// This dev-only middleware serves the same cleaned markdown straight from the
// docs source tree. Docs whose URL diverges from their file path (front-matter
// slug) are not resolved; they keep working in production builds.
const {
  cleanMarkdownForDisplay,
} = require("docusaurus-markdown-source-plugin/lib/clean-markdown");

const DOCS_URL_PREFIX = "/docs/";

export default function markdownSourceDevPlugin(context: LoadContext): Plugin {
  const docsRoot = path.join(context.siteDir, "docs");

  return {
    name: "stellar-docs-markdown-source-dev-plugin",

    configureWebpack(_config, isServer) {
      if (isServer || process.env.NODE_ENV === "production") {
        return {};
      }
      return {
        devServer: {
          setupMiddlewares: (middlewares, devServer) => {
            // webpack-merge replaces this function instead of composing it, so
            // re-install the middleware @docusaurus/core would have added here.
            try {
              const evalSourceMapMiddleware =
                require("@docusaurus/core/lib/commands/utils/legacy/evalSourceMapMiddleware").default;
              middlewares.unshift(evalSourceMapMiddleware(devServer));
            } catch {
              // Error-overlay source lookup unavailable; markdown serving still works.
            }

            middlewares.unshift({
              name: "markdown-source-dev",
              middleware: (req, res, next) => {
                if (req.method !== "GET" && req.method !== "HEAD") {
                  return next();
                }
                const urlPath = decodeURIComponent(req.url.split("?")[0]);
                if (
                  !urlPath.startsWith(DOCS_URL_PREFIX) ||
                  !urlPath.endsWith(".md")
                ) {
                  return next();
                }

                const rel = urlPath.slice(
                  DOCS_URL_PREFIX.length,
                  -".md".length,
                );
                const candidates = [
                  `${rel}.mdx`,
                  `${rel}.md`,
                  path.join(rel, "index.mdx"),
                  path.join(rel, "index.md"),
                ];
                for (const candidate of candidates) {
                  const abs = path.resolve(docsRoot, candidate);
                  if (!abs.startsWith(docsRoot + path.sep)) {
                    continue;
                  }
                  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
                    continue;
                  }
                  const routeDir = urlPath.replace(/[^/]+$/, "");
                  const content = fs.readFileSync(abs, "utf8");
                  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
                  res.end(cleanMarkdownForDisplay(content, routeDir));
                  return;
                }
                return next();
              },
            });
            return middlewares;
          },
        },
      };
    },
  };
}
