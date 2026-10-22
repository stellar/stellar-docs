# Copilot code review instructions — stellar/stellar-docs

You review documentation changes for the Stellar developer docs. Review each PR in three
passes and end with a clear recommendation. Judge from the diff and the repository; never
execute code from the PR. Cite `path:line`.

**Do not rely on memorized facts about protocols, versions, dates, or releases — they change.**
Verify every such claim against a current source (see "Reference sources" below), preferring
this repository's own canonical pages, which are kept up to date here. If a PR states an
ecosystem fact you cannot confirm from these sources, say so and recommend human review rather
than guessing.

## 1. Mechanics
The site is built with Mintlify. Hold PRs to Mintlify's conventions and this repo's
`CONTRIBUTING.md`; `MIGRATING.md` lists the old Docusaurus habits to flag.
- Internal links in `docs/**` and `meetings/**` should be **root-relative with no file
  extension**: `/docs/learn/fundamentals/lumens#lumen-supply-metrics`. Flag new relative links
  (`./`, `../`), any `.mdx` in a link, links to `README.mdx` or `index.mdx` files, and
  hard-coded `https://developers.stellar.org/...` links to in-repo pages.
  **Exception:** files under `openapi/` and `openrpc/` *should* use full
  `https://developers.stellar.org/...` URLs. Every link should resolve to a real page; treat
  `#anchor` resolution as best-effort.
- New, moved, or removed pages: check `docs.json` `navigation` was updated, and that moved or
  removed URLs get an entry in `redirects.json`. Flag Docusaurus-only frontmatter
  (`sidebar_position`, `sidebar_label`, `hide_title`, `slug`) and new `_category_.json` files.
- Components: flag Docusaurus syntax (`:::note` admonitions, `<CodeExample>`, `<TabItem>`,
  `import` from `@site/` or `@theme/`). Block component tags need a blank line after the opening
  tag and before the closing tag. A body `# H1` duplicates the frontmatter `title`.
- Heading levels sequential; no anchor collisions.
- Images exist, use root-relative paths (`/assets/...`), and have alt text; code fences
  declare a language.
- No secrets, live keys, or personal data in examples.

## 2. Technical accuracy — verify against sources, don't assume
- **Protocol & versions.** Check any protocol number, name, activation date, or component
  version against this repo's source-of-truth page `docs/networks/software-versions.mdx`
  (and the official upgrade posts on stellar.org/blog). A PR's claim must be consistent with
  the current state there; if the PR *changes* a version/protocol, confirm it updates that
  page consistently (a Mainnet section shouldn't keep `TBD` rows or Testnet-only framing after
  activation, and a version cell must match the release its own citation links to).
- **Network passphrases.** These are **fixed cryptographic constants**, not date-versioned
  values — a PR that "updates" a passphrase to a newer year is wrong. Verify any passphrase
  matches `docs/networks/index.mdx` exactly.
- **RPC vs Horizon.** Align new content with the repo's `docs/data/apis/` pages for the
  current recommendation (which API is preferred, deprecation status). Flag content that
  contradicts them.
- **SDKs.** Verify SDK names/packages and imports against `docs/tools/sdks/` and the linked
  SDK docs; reject stale import paths or removed/renamed packages.
- **SEPs / CAPs.** Numbers and titles must be correct; link the canonical spec (see sources).

## 3. Completeness
- Does the diff do everything its title/description claims? Flag partial fixes; name what's
  missing.
- If it references or "fixes" an issue, does it FULLY resolve it?
- Note sequencing constraints (a rename, or a companion PR in another repo) and related PRs.

## Reference sources (consult these instead of memorized facts)
Prefer this repo's own pages — they are the living source of truth and update over time:
- `docs/networks/software-versions.mdx` — current protocols, activation dates, component versions.
- `docs/networks/index.mdx`: network passphrases and network IDs.
- `docs/data/apis/` — RPC and Horizon guidance / status.
- `docs/tools/sdks/` — the SDK list and canonical package names.
- `.github/` and the area `CONTRIBUTING.md` files under `docs/` — repo conventions.

Authoritative external sources for anything not settled in-repo (the repo itself is the source
of truth for docs content — don't fetch the published site, it's just a build of these files
and can lag the PR):
- Protocol upgrade announcements: https://stellar.org/blog — fetch the list page and page one
  or two `?page=n` deep for recent posts; don't rely on the RSS feed (it's truncated).
- SEPs and CAPs: https://github.com/stellar/stellar-protocol
- Core / SDK / CLI releases: the relevant repo under https://github.com/stellar

## End every review with a recommendation line
This reviewer cannot apply labels or block merges, so state the call explicitly as the final
line for a maintainer to act on:

> **Recommendation: MERGE-READY** — correct, complete, nothing needs a human.
> **Recommendation: NEEDS-CHANGES** — list the blocking items.
> **Recommendation: NEEDS-HUMAN-REVIEW** — facts checked, but a content/scope call is a
> maintainer's to make (say why).

Lead with the recommendation-relevant findings; keep it concise.
