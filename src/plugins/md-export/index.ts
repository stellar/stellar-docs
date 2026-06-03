import fs from 'fs';
import path from 'path';

import type { LoadContext, Plugin } from "@docusaurus/types";

export default async function mdExportPlugin(
  context: LoadContext,
): Promise<Plugin> {
  return {
    name: 'stellar-docs-md-export-plugin',

    async postBuild({ outDir }) {
      const docsSourceDir = path.join(context.siteDir, 'docs');
      const docsOutputDir = path.join(outDir, 'docs');
      let count = 0;

      copyMdFiles(docsSourceDir, docsOutputDir, () => count++);
      console.log(`✅ md-export: copied ${count} source files to build output`);
    },
  };
}

function copyMdFiles(
  sourceDir: string,
  destDir: string,
  onCopy: () => void,
): void {
  if (!fs.existsSync(sourceDir)) return;
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(sourceDir, entry.name);
    const dstPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyMdFiles(srcPath, dstPath, onCopy);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.copyFileSync(srcPath, dstPath);
      onCopy();
    }
  }
}
