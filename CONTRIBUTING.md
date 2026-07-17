# Contributing to the Stellar Docs

Thank you for helping make the [Stellar developer docs](https://developers.stellar.org) better! 🎉

This document covers how we work: what makes a PR easy to merge, the conventions we hold the content to, and the policies we apply to changes to the site itself. For environment setup, repository structure, and our custom markdown features, see the [README](README.md).

Before diving in, please read the org-wide [Stellar Contribution Guide](https://github.com/stellar/.github/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/stellar/.github/blob/master/CODE_OF_CONDUCT.md).

## Table of Contents <!-- omit in toc -->

- [Contributing to the Stellar Docs](#contributing-to-the-stellar-docs)
  - [Ways to Contribute](#ways-to-contribute)
  - [Before You Open a PR](#before-you-open-a-pr)
  - [Development Quickstart](#development-quickstart)
  - [Content Conventions](#content-conventions)
    - [Links](#links)
    - [Page metadata](#page-metadata)
    - [Images](#images)
    - [Code examples](#code-examples)
    - [Terminology and style](#terminology-and-style)
  - [Site Code and Infrastructure](#site-code-and-infrastructure)
    - [API reference pages are generated](#api-reference-pages-are-generated)
    - [URLs are forever](#urls-are-forever)
    - [Patches and swizzles are a last resort](#patches-and-swizzles-are-a-last-resort)
    - [Tooling, editor config, and build settings](#tooling-editor-config-and-build-settings)
  - [Review Process](#review-process)

## Ways to Contribute

- **Fix something small** (typos, broken links, code errors): open a PR directly.
- **Suggest missing content or structural changes**: open an [issue](https://github.com/stellar/stellar-docs/issues) first — search existing issues to avoid duplicates.
- **Pick up existing work**: issues labeled `good first issue` or `help wanted` are great entry points. Comment on the issue before starting so we can assign it.
- **Not sure?** Ask in the [Stellar Developer Discord](https://discord.gg/stellardev). There's even a [`#docs`](https://discord.com/channels/897514728459468821/1331985629290168351) channel!

## Before You Open a PR

These guidelines exist because they're the difference between a PR that merges in days and one that sits for months.

- **One concern per PR.** A PR should do one describable thing. "Fix the broken links on the Hubble pages" merges fast; "clean up various things across 900 files" cannot be reviewed at all. If your change is mechanical and large, propose it in an issue first so we can agree on the approach (and possibly split it) before you do the work.
- **Branch from current `main`, and don't stack.** Don't base a PR on another unmerged PR, and don't submit changes that depend on anchors, pages, or components that only exist in your other open PRs. Every PR must stand alone against `main`.
- **Discuss before building, for anything non-trivial.** New components, styling that affects the whole site, tooling/config changes, restructured URLs — open an issue and get a nod before writing code. This protects your time more than ours.
- **Keep a reasonable number of PRs in flight.** A handful of focused, active PRs gets better review attention than dozens of parallel ones.

## Development Quickstart

We use [pnpm](https://pnpm.io/). See the [README](README.md#quick-start) for full setup.

```bash
pnpm install        # install dependencies
pnpm start          # dev server with live reload
pnpm build          # full production build (catches broken internal links)
pnpm format:mdx     # prettier-format all md/mdx content
```

A husky pre-commit hook runs the prettier check; if it fails, run `pnpm format:mdx` and re-commit. CI runs the same check, plus a full site build.

## Content Conventions

### Links

- **Internal links are relative file paths, including the `.mdx` extension**: `[fees](../../learn/fundamentals/fees-resource-limits-metering.mdx#inclusion-fee)`. Docusaurus resolves these at build time, so a broken path fails the build instead of shipping a 404.
- Section index pages live at `parent/README.mdx` — if you're linking to a subsection's landing page, that's usually the file you want.
- External links to other Stellar properties use `https://stellar.org/...` (no `www`).
- SEP references use the canonical shortlinks (`https://stellar.org/protocol/sep-10`), not raw GitHub URLs.

### Page metadata

- Sidebar ordering is declared with `sidebar_position` in each page's frontmatter.
- **Prefer the `README.mdx` convention over `_category_.json` for category metadata.** A category's index `README.mdx` frontmatter drives its title, sidebar label, and position, so do as much as possible there. Add a `_category_.json` file only when something genuinely can't be expressed in `README.mdx` — e.g., overriding `collapsible`/`collapsed`, or setting a category `description` (which isn't hoisted from the `README.mdx` frontmatter) — and include only those necessary keys.
- Every page should have a frontmatter `title` and `description` (used for SEO and link previews).

### Images

- Prefer placing new images in `static/assets/` and referencing them by absolute path: `![alt text](/assets/section/image.png)`. Legacy images may live in `static/img/` and be referenced via `/img/...`. Avoid introducing new MDX image imports or `useBaseUrl` usage unless you need MDX-specific behavior (e.g., custom sizing).
- Always include meaningful alt text.

### Code examples

- Multi-language examples use the `<CodeExample>` component: a blank line after the opening tag, one fenced code block per language, a blank line before the closing tag.
- In multi-part guides, show imports and shared setup in the first snippet; later snippets on the same page may assume them.
- Generic example assets are `astroDollar` (and use a second clearly named non-native asset when you need two).

### Terminology and style

- "Stellar network" — lowercase *network*. Likewise *asset* and *anchor* are not capitalized.
- Meeting notes (in `meeting-notes/`) use the date as the title (`2026-05-07`), uniformly across the series.

## Site Code and Infrastructure

The bar for changes to the site itself (components, theme, config, dependencies) is deliberately higher than for content.

### API reference pages are generated

The Horizon, Anchor Platform, and Stellar Disbursement Platform API reference pages are generated from the OpenAPI specs in `openapi/`. **Edit the spec sources, then regenerate** (`pnpm api`) and commit both together. PRs that hand-edit generated `*.api.mdx` files will be closed — the next regeneration would erase them.

The same is true for Stellar RPC, and a subset of Anchor Platform functionality. They are generated from spec files in `openrpc/`. **Edit the spec sources, then regenerate** (`pnpm rpcspec:build`) and commit both together. PRs that hand-edit generated `*.openrpc.json` files only will be closed.

### URLs are forever

To the extent possible, anything that changes a page's URL needs redirect coverage (`routes.txt` participates in CI route checking; server-side redirects live in `nginx/`). If your PR moves or renames pages, call it out explicitly in the description.

### Patches and swizzles are a last resort

We keep the fork-surface of this site as small as possible. When something in a dependency is broken, work down this list and stop at the first rung that works:

1. **Fix it upstream** — file an issue/PR against the dependency.
2. **Configure around it** — plugin options, CSS, config.
3. **Guard in our own code** — a client module or wrapper component we own.
4. **`pnpm patch`** — only with an upstream issue filed, linked in a comment in the patch, and stated criteria for when the patch can be removed.
5. **Swizzling ejected internals** — effectively never; "wrap"-style swizzles are considered case by case.

PRs that add patches or swizzles without prior discussion in an issue will generally be closed with a request to follow this ladder.

### Tooling, editor config, and build settings

Don't commit editor configuration (`.vscode/`, etc.) or machine-specific build settings. If the build genuinely needs a change (and CI demonstrates it), propose it in an issue.

## Review Process

- You can expect a first response from a docs maintainer **within one week** (usually faster).
- PRs need maintainer approval to merge. CI must pass: prettier check, full site build, and route-removal check.
- If we ask for changes and the conversation goes quiet for a long stretch, we may close the PR to keep the queue honest — closed is not rejected, and you're welcome to reopen when you're ready to continue.
- We close PRs that don't fit the conventions above, and we try to always say why and what a mergeable version would look like. Policy closes are about the change, never about you.

---

*This guide was seeded in part by conventions proposed in [#1044](https://github.com/stellar/stellar-docs/pull/1044) — thanks to the community members who pushed for written standards.*
