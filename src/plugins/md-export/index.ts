import fs from "fs";
import path from "path";

import type { LoadContext, Plugin } from "@docusaurus/types";

// Lazily-initialized processor (dynamic imports handle ESM-only remark packages)
let _processor: ReturnType<(typeof import("unified"))["unified"]> | null = null;

async function getProcessor() {
  if (_processor) return _processor;

  const [
    { unified },
    { default: remarkParse },
    { default: remarkMdx },
    { default: remarkFrontmatter },
    { default: remarkStringify },
    { visit, SKIP },
  ] = await Promise.all([
    import("unified"),
    import("remark-parse"),
    import("remark-mdx"),
    import("remark-frontmatter"),
    import("remark-stringify"),
    import("unist-util-visit"),
  ]);

  function stripMdxNodes() {
    return (tree: Parameters<typeof visit>[0]) => {
      visit(tree, (node: any, index, parent: any) => {
        if (index === undefined || !parent) return;

        // Remove import/export statements
        if (node.type === "mdxjsEsm") {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        // Block/inline JSX: keep children, discard the component wrapper
        if (
          node.type === "mdxJsxFlowElement" ||
          node.type === "mdxJsxTextElement"
        ) {
          if (node.children?.length > 0) {
            parent.children.splice(index, 1, ...node.children);
          } else {
            parent.children.splice(index, 1);
          }
          return [SKIP, index];
        }

        // Remove MDX expressions like {variable} or {foo()}
        if (
          node.type === "mdxFlowExpression" ||
          node.type === "mdxTextExpression"
        ) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }
      });
    };
  }

  _processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(stripMdxNodes)
    .use(remarkStringify);

  return _processor;
}

async function renderToMarkdown(source: string): Promise<string> {
  const processor = await getProcessor();
  const file = await processor.process(source);
  return String(file);
}

export default async function mdExportPlugin(
  context: LoadContext,
): Promise<Plugin> {
  return {
    name: "stellar-docs-md-export-plugin",

    async postBuild({ outDir }) {
      const docsSourceDir = path.join(context.siteDir, "docs");
      const docsOutputDir = path.join(outDir, "docs");
      let count = 0;

      await processMdFiles(docsSourceDir, docsOutputDir, () => count++);
      console.log(
        `✅ md-export: rendered ${count} markdown files to build output`,
      );
    },
  };
}

async function processMdFiles(
  sourceDir: string,
  destDir: string,
  onProcess: () => void,
): Promise<void> {
  if (!fs.existsSync(sourceDir)) return;
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        await processMdFiles(
          srcPath,
          path.join(destDir, entry.name),
          onProcess,
        );
        return;
      }

      if (!/\.(md|mdx)$/.test(entry.name)) return;

      // Always output as .md (MDX rendered to plain Markdown)
      const destName = entry.name.replace(/\.mdx$/, ".md");
      const dstPath = path.join(destDir, destName);

      const source = fs.readFileSync(srcPath, "utf-8");
      let markdown: string;
      try {
        markdown = await renderToMarkdown(source);
      } catch {
        // Fall back to raw source if MDX parsing fails (e.g. invalid JS expressions)
        markdown = source;
      }
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.writeFileSync(dstPath, markdown, "utf-8");
      onProcess();
    }),
  );
}
