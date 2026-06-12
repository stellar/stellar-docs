---
name: update-sdk-examples
description: Use when checking whether Stellar SDKs listed in the docs have new releases, or when code examples in docs/ may use outdated, renamed, or deprecated SDK syntax. Run on a schedule or on demand.
---

# Update SDK Examples

Check for new releases of the Stellar SDKs listed in our documentation, and update
any code examples that use outdated or deprecated syntax.

## Context

- SDK source-of-truth pages: `docs/tools/sdks/contract-sdks.mdx` and
  `docs/tools/sdks/client-sdks.mdx`
- Release state file: `~/.claude/stellar-sdk-release-state.json`
  (maps repo/package URL → last-seen release tag)

## Steps

1. **Discover SDKs.** Read the two source-of-truth pages and extract every
   SDK/crate/package along with its GitHub repository link (or package-registry
   link, e.g. crates.io, if no repo is linked). Do not use a hardcoded list —
   these pages are the inventory.

2. **Check releases.** Confirm the working tree is clean and `main` is up to
   date with the remote before starting. For each SDK, fetch the latest release
   tag (`gh api repos/<owner>/<repo>/releases/latest`, falling back to the
   newest semver tag for repos without GitHub Releases, or the registry's
   latest version for registry-only entries). Compare against the state file.
   If the state file is missing an entry, record the current latest tag as the
   baseline and do not treat it as new.

3. **For each SDK with a new release** — process one SDK at a time, returning
   to `main` between SDKs:
   1. Read the release notes/changelog for every version between last-seen and
      latest. Note breaking changes, deprecations, renames, and newly
      recommended patterns.
   2. Search the entire `docs/` directory for examples using that SDK: fenced
      code blocks in its language, import/use/require statements, dependency
      snippets, etc.
   3. If any examples use removed, renamed, deprecated, or now-discouraged
      APIs, create a branch `chore/sdk-examples-<language>-<version>` off
      `main` and update them. Only make changes the release notes justify —
      never restyle or rewrite examples that are still correct.
   4. Commit with a message summarizing the SDK, the version range, and what
      changed. Do NOT push — branches are pushed manually after review.
   5. Return to `main` and update the state file entry to the latest tag.

4. **Hands off the SDK pages.** `contract-sdks.mdx` and `client-sdks.mdx` must
   never gain release notes, version callouts, or deprecation warnings. Only
   edit them if a link or short description is factually wrong, and match each
   page's existing formatting exactly.

5. **Report.** End with a summary: SDKs checked, new releases found, branches
   created (with files touched), and SDKs whose new release required no doc
   changes. If nothing new was found, confirm briefly.

## Gotchas (learned from real runs)

- crates.io's API returns nulls without a `User-Agent` header — pass one, e.g.
  `curl -s -A "stellar-docs-sdk-check" https://crates.io/api/v1/crates/<name>`,
  and read `.crate.max_stable_version`. Crate names use hyphens even when docs
  write them with underscores (`stellar_axelar_std_derive` →
  `stellar-axelar-std-derive`).
- Some repos have neither GitHub Releases nor tags (e.g. the Stellar Router
  SDK). Record `"none"` in the state file and treat the first tag that ever
  appears as a new release.
- The Go SDK section also links the RPC client living in
  `stellar/stellar-rpc` — track that repo too.
- When run headlessly from launchd, the SSH agent is unavailable, so
  `git fetch`/`git pull` over SSH fail. Verify `main` is current by comparing
  local HEAD against `gh api repos/stellar/stellar-docs/commits/main` instead,
  and don't treat the SSH failure as a blocker.
