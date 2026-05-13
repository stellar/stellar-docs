import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const roots = [
  "docs/data/apis/horizon/api-reference",
  "docs/platforms/anchor-platform/api-reference/callbacks",
  "docs/platforms/anchor-platform/api-reference/platform/transactions",
  "docs/platforms/stellar-disbursement-platform/api-reference",
];

await Promise.all(
  roots.map(async (root) => {
    let entries;

    try {
      entries = await readdir(root);
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }

    await Promise.all(
      entries
        .filter((entry) => entry.endsWith(".info.mdx"))
        .map((entry) => rm(path.join(root, entry), { force: true }))
    );
  })
);
