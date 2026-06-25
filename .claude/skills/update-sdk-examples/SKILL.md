---
name: update-sdk-examples
description: Use when checking whether Stellar SDKs listed in the docs have new releases, or when code examples in docs/ may use outdated, renamed, or deprecated SDK syntax. Runs per-release on a schedule, or as a full standing-correctness audit on demand.
---

# Update SDK Examples

Check for new releases of the Stellar SDKs listed in our documentation, and update
any code examples that use outdated or deprecated syntax.

## Context

- SDK source-of-truth pages: `docs/tools/sdks/contract-sdks.mdx` and
  `docs/tools/sdks/client-sdks.mdx`
- Release state file: `~/.claude/stellar-sdk-release-state.json`
  (maps repo/package URL → last-seen release tag)
- Additional packages with examples in `docs/` but **not** on the SDK listing
  pages (so step 1 discovery misses them — include them in scope manually):
  - npm: `@x402/stellar`, `@stellar/mpp`  (used by the agentic-payments examples)

  These packages aren't vouched for by a listing page. Before using one as an
  API source-of-truth, confirm its npm publisher/linked repo is the genuine
  project (guards against typosquat names). Note `@x402/` is **not** the
  `@stellar` org — verify it's the real x402 package, not a lookalike.

## Two modes

Decide which mode you're in before starting:

- **Release-diff (default, routine/scheduled runs).** Compare each SDK against
  the state file and only inspect examples for SDKs with a _new_ release since
  last seen. Cheap and fast.
- **Full audit (first run, and periodically — e.g. monthly, or on request).**
  Inspect _every_ SDK's examples against its **current** released API, ignoring
  the state-file comparison. The state file only records "last tag seen for
  release-diff purposes" — it does **not** certify that the existing examples
  were ever correct. Most real staleness (package renames, repo relocations,
  ancient version pins) predates any baseline you record, so a release-diff run
  will never surface it. Do a full audit when first adopting the skill and on a
  slower cadence thereafter. A full audit fans out well across parallel agents
  (one per SDK/language) — but treat their findings as candidates, not edits
  (see step 3.3).

Steps 3–5 are identical in both modes once you have the set of SDKs to inspect;
only _how you choose that set_ differs.

## Steps

1. **Discover SDKs.** Read the two source-of-truth pages and extract every
   SDK/crate/package along with its GitHub repository link (or package-registry
   link, e.g. crates.io, if no repo is linked). Do not use a hardcoded list —
   these pages are the inventory. **Then add the "Additional packages" listed
   in Context** — these have examples in `docs/` but are intentionally absent
   from the SDK listing pages, so discovery alone misses them. Treat them
   identically from step 2 onward.

2. **Check releases.** Confirm the working tree is clean and that you're working
   from a current `upstream/main` — the canonical `stellar/stellar-docs` (if you
   cloned the official repo directly rather than a fork, that's your
   `origin/main`). For each SDK, fetch the latest release
   tag (`gh api repos/<owner>/<repo>/releases/latest`, falling back to the
   newest semver tag for repos without GitHub Releases, or the registry's
   latest version for registry-only entries). Compare against the state file.
   If the state file is missing an entry, record the current latest tag as the
   baseline and do not treat it as new.

3. **For each SDK in scope** (a new release in release-diff mode; _every_ SDK in
   full-audit mode) — process one SDK at a time, starting each from a fresh
   `upstream/main`:
   1. Read the release notes/changelog (every version between last-seen and
      latest in release-diff mode; the recent major-version history in full
      audit). Note breaking changes, deprecations, renames, and newly
      recommended patterns. **Also check for relocations**, not just version
      bumps: repo/org moves, renamed package coordinates, and changed
      import/module paths. These never show up as a version diff but are the
      most common source of broken examples (e.g. the JS package rename
      `stellar-sdk` → `@stellar/stellar-sdk`, the Java group-id move to
      `network.lightsail`, the Go RPC client moving into `go-stellar-sdk`).
   2. Find the examples. Once you know the specific stale token (an import
      string, a coordinate, a class name), `grep` the **entire** `docs/` tree
      for it directly — do not rely on a partial file list, including one
      produced by an audit sub-agent, which routinely both misses occurrences
      and includes false matches. Scope edits to `docs/` only: the `i18n/`
      translations mirror `docs/`, lag behind (they may still show APIs you've
      already migrated), and are an unused holdover from previous translation
      processes - ignore the `i18n/` directory altogether.
   3. **Verify each candidate against the current source before editing.**
      Changelogs and audit sub-agents over- and under-report. Confirm the API
      against the actual released source/registry: e.g. is the symbol really
      gone, or just re-exported elsewhere? Is the "stale" snippet actually part
      of a third-party library's tutorial rather than this SDK? When the new
      import path/package name differs from the old identifier used in the code
      body, preserve the body by aliasing rather than rewriting it.
   4. If verified examples use removed, renamed, relocated, deprecated, or
      now-discouraged APIs, create a branch `chore/sdk-examples-<language>-<version>`
      (use the current latest version) off `upstream/main`
      (`git switch -c chore/… upstream/main`) and update them. Only make changes
      the facts justify — never restyle or rewrite examples that are still
      correct.
   5. Commit with a message summarizing the SDK, the version (or relocation),
      and what changed. Do NOT push — branches are pushed manually after review.
   6. Update the state file entry to the latest tag. Start the next SDK's branch
      from `upstream/main` again — do not check out a local `main` branch (it may
      be checked out in another worktree, e.g. the scheduled runner's, and git
      forbids the same branch in two worktrees).

4. **Hands off the SDK pages.** `contract-sdks.mdx` and `client-sdks.mdx` must
   never gain release notes, version callouts, or deprecation warnings. Only
   edit them if a link or short description is factually wrong, and match each
   page's existing formatting exactly.

5. **Report.** End with a summary: the mode you ran, SDKs checked, new releases
   or relocations found, branches created (with files touched), and SDKs that
   needed no doc changes. Also list candidates you deliberately did **not** edit
   and why (false positives, still-correct examples, third-party tutorials), so
   the human reviewer can second-guess those calls. If nothing needed changing,
   confirm briefly.

## Running unattended

On scheduled runs (e.g. the Monday-morning launchd job) there is **no human in
the loop**, so adjust accordingly:

- **Don't ask questions.** When a candidate edit is uncertain — ambiguous
  changelog, a snippet that might belong to a third-party library, a version pin
  that might be intentional — **skip it and note it in the report** rather than
  guessing. A missed edit is recoverable on review; a wrong unattended edit is
  not.
- **Commit, never push.** Leave each `chore/…` branch for a human to review and
  push. Pushing or opening PRs is out of scope.
- **Expect a throwaway, detached checkout.** The runner puts you on a detached
  `upstream/main` in a dedicated worktree — branch from `upstream/main`, never
  check out a local `main`, and don't assume a clean interactive repo.
- **SSH is unavailable** (see the gotcha below) — use HTTPS / `gh api`, and
  don't treat the SSH failure as a blocker.
- **Always produce the report**, even when nothing changed — it's the only
  signal the run happened and what it decided.

(How the schedule itself is wired up — launchd, cron, CI, etc. — is a
per-machine deployment concern, not part of this skill.)

## Gotchas (learned from real runs)

- crates.io's API returns nulls without a `User-Agent` header — pass one, e.g.
  `curl -s -A "stellar-docs-sdk-check" https://crates.io/api/v1/crates/<name>`,
  and read `.crate.max_stable_version`. Crate names use hyphens even when docs
  write them with underscores (`stellar_axelar_std_derive` →
  `stellar-axelar-std-derive`).
- Some repos have neither GitHub Releases nor tags (e.g. the Stellar Router
  SDK). Record `"none"` in the state file and treat the first tag that ever
  appears as a new release.
- The Go SDK section links an RPC client that used to live in
  `stellar/stellar-rpc` but **moved into `stellar/go-stellar-sdk`**
  (`clients/rpcclient` + `protocols/rpc`) as of go-stellar-sdk v0.6.0 /
  stellar-rpc v27 — the old `stellar-rpc/{client,protocol}` import paths now
  404. `stellar/stellar-rpc` is still a real repo (the RPC server binary), so
  keep tracking it, but its Go _client_ packages are gone. Treat repo/path
  relocations like this as breaking changes even when the version number barely
  moved.
- When run headlessly from launchd, the SSH agent is unavailable, so
  `git fetch`/`git pull` over SSH fail. Verify `main` is current by comparing
  local HEAD against `gh api repos/stellar/stellar-docs/commits/main` instead,
  and don't treat the SSH failure as a blocker. Note `origin` may be a personal
  fork that lags upstream — branch off `upstream/main` (`stellar/stellar-docs`),
  not a stale `origin/main`.
- Applying edits: prefer the Edit tool, or `perl -i -pe 's|old|new|g' <file>`
  with `|` delimiters — `perl`'s `s{}{}` form breaks on snippets containing
  literal `{` (Cargo.toml tables, Go imports). In zsh, `for f in $files` does
  **not** word-split an unquoted variable; list the files literally or use an
  array (`files=(a b c)`). macOS BSD `sed -i` requires an explicit backup-suffix
  argument (`sed -i ''`), which differs from GNU `sed` — `perl -i` sidesteps the
  difference.
