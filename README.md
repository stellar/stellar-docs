# Stellar Documentation and API Reference 🌌 <!-- omit in toc -->

[![Apache 2.0 licensed](https://img.shields.io/badge/license-apache%202.0-blue.svg)](LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/stellar/stellar-docs)

Welcome to the official home repository for [Documentation][docs] for the [Stellar network][stellar].

## Table of Contents <!-- omit in toc -->

- [Contributing](#contributing)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
- [Repository Structure](#repository-structure)
- [Writing Content](#writing-content)
  - [Markdown Basics](#markdown-basics)
  - [Mintlify Components](#mintlify-components)
    - [Code Groups](#code-groups)

## Contributing

Contributions are more than welcome! Thank you! 🎉

Before diving in, please read our [Stellar Contribution Guide][contrib] for
details on contributing to Stellar's various repositories. Please take special
note of the [code of conduct][coc]. Then read this repo's
[CONTRIBUTING.md](CONTRIBUTING.md) for how we work and the conventions we hold
the content to.

Our documentation site is built with [Mintlify][mintlify]. The content is
written in [MDX][mdx], which is Markdown with components mixed in. Even if
you're unfamiliar with Markdown, do not fear! It's easy to learn, and you can
always help fix typos, spelling, and broken links, too.

> [!IMPORTANT]
> **Contributed here before October 2026?** The site moved from Docusaurus to
> Mintlify, and a few long-standing habits changed. The one you'll notice most:
> we now write internal links as root-relative paths with no extension
> (`[fees](/docs/learn/fundamentals/fees-resource-limits-metering)`), not
> relative `.mdx` paths. [MIGRATING.md](MIGRATING.md)
> has the full "we used to do X, now do Y" list.

You can contribute to the docs in several ways:

- See something that needs to be fixed in the docs, like an error in the code or a typo? File a [pull request (PR)](https://github.com/stellar/stellar-docs/pulls) proposing to correct the error;
- Think there is helpful content missing from the docs, like a specific how-to guide or piece of explanatory content? File an [issue](https://github.com/stellar/stellar-docs/issues) explaining what you’d like to see (be sure to search existing issues to avoid duplication);
- Have an idea that could make the docs better, like a structural change or a new section idea? File an [issue](https://github.com/stellar/stellar-docs/issues) explaining what you’d like to see (these will be added to the Ideas section on the [Dev Docs board](https://github.com/orgs/stellar/projects/56/views/1) for discussion);
- Want to complete an existing issue? Search through the issues to find something to work on! Issues without an assignee and labeled as a “Good First Issue” or with “Help Wanted” are great places to start! Once you’ve selected an issue to work on, file a PR with your proposed fix.

No matter what you contribute, whether a PR or an issue, you can expect to receive a response from docs maintainers within one week.

- PRs need to be reviewed and approved before merging. Look for either an approval or a follow-up question.
- Issues will be prioritized, labeled, and assigned (if possible). You can check the status of your issue on the Dev Docs board. The status of issues according to the column is:
  - Ideas: these issues are being actively discussed. Ideas will either be discarded or repurposed into an actionable issue and added to the queue within three weeks.
  - Backlog: these issues are not prioritized or actively being worked on.
  - To Do: these issues are prioritized and will be worked on soon.
  - In Progress: these issues are currently being worked on.
  - Blocked: these issues are being worked on but are blocked for some reason and need attention.
  - Done: these issues have been completed and can be closed.

If you have questions, feel free to ask in the [Stellar Developer Discord](https://discord.gg/stellardev).

## Quick Start

[![Open in Codespaces](https://github.com/codespaces/badge.svg)][open-in-github-codespaces]

[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)][open-in-code-anywhere]

### Prerequisites

To work on the documentation, you'll need:

- Node.js (v24, or higher): see https://nodejs.org/en/download/package-manager for details for your system
- pnpm: e.g., `corepack enable pnpm`

### Development

Once the prerequisites are installed, run:

```bash
git clone https://github.com/stellar/stellar-docs
cd stellar-docs
pnpm install
pnpm start
```

`pnpm start` runs the Mintlify development server ([`mint dev`][mint-cli]) at
`http://localhost:3000`, and reloads as you save changes. The first run takes a
little longer, because it downloads Mintlify's preview client.

Before you open a PR, fix formatting and run the checks CI runs:

```bash
pnpm format:mdx   # fix formatting (and the blank lines around component tags)
pnpm check        # formatting, component padding, and `mint validate`
pnpm check:links  # broken links, anchors, redirects, and snippets
```

A pre-commit hook runs the formatting checks for you. Mintlify also builds a
preview deployment for PRs to `main`, and a bot comments on the PR with the
link. For PRs from forks, a maintainer approves the preview first.

## Repository Structure

- `docs/` contains the documentation pages. If you're contributing to the
  content, rather than the site itself, this is where you want to be.
  - A page's URL is its path: `docs/learn/fundamentals/lumens.mdx` is served at
    `/docs/learn/fundamentals/lumens`. A folder's landing page is its
    `index.mdx`.
  - **All filenames use dashes for spaces**, not spaces or underscores.
- `meetings/` contains the developer meeting notes, laid out as
  `meetings/YYYY/MM/DD.mdx`, and the changelog-style index page
  (`meetings/index.mdx`).
- `docs.json` is the site configuration: theme, navigation (the sidebar and
  tabs), SEO, integrations, and so on. **Every page needs an entry in
  `navigation`** to appear in the sidebar.
- `redirects.json` holds the redirect rules (referenced from `docs.json`). If you
  find a broken link out in the wilds of the internet, and there's no way for it
  to be changed, a redirect could be a useful tool. (Note our aim isn't to
  _completely_ avoid 404 pages for a user. That would be impossible and
  impractical. Redirects are evaluated on a case-by-case basis.)
- `snippets/` contains reusable content (`.mdx`) and custom components (`.jsx`)
  that pages import. Snippets are never published as pages.
- `assets/` and `img/` contain images and other static files. Files are served
  from their path in the repo, so `assets/guestbook/foo.png` is at
  `/assets/guestbook/foo.png`.
- `openapi/` and `openrpc/` contain the API specifications that the Horizon,
  Anchor Platform, Stellar Disbursement Platform, and Stellar RPC reference
  pages are built from. See [CONTRIBUTING.md](CONTRIBUTING.md#site-code-and-infrastructure).
- `style.css`, `sds-*.css`, and the `.js` files at the root are site-wide
  styling and scripts. Mintlify loads every `.css` and `.js` file in the repo on
  every page.
- `.mintignore` lists files Mintlify should never publish (drafts, tooling,
  and contributor docs).
- `scripts/` and `tools/` contain repository tooling.

## Writing Content

### Markdown Basics

If you're unfamiliar with Markdown, there are **loads** of good tutorials and
cheat sheets out there. Check out some of these resources to get a handle on the
basics:

- [CommonMark cheat sheet and tutorial][commonmark]
- [Interactive markdown tutorial][tutorial]
- [The markdown guide][guide]

### Mintlify Components

Pages use Mintlify's built-in components, such as callouts (`<Note>`, `<Tip>`,
`<Warning>`), `<Tabs>`, `<CodeGroup>`, `<Accordion>`, `<Steps>`, and
`<Card>`. No imports are needed. The [Mintlify components
documentation][mintlify-components] covers every component and its options.

**Leave a blank line after every opening component tag and before every closing
one.** Without it, a closing tag right after a list can get swallowed into the
last list item, and the build fails. `pnpm format:mdx` adds the blank lines for
you. For example,

```markdown
<Note>

Callouts don't take a title. Put a **bold first line** in the body instead.

</Note>
```

#### Code Groups

When you want the same example in more than one language, use `<CodeGroup>`.
Each fenced code block gets a title right after its language, which becomes the
tab label. If you're only showing a _single language_, stick with a normal
fenced code block.

````markdown
<CodeGroup>

```js JavaScript
// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
const pair = StellarSdk.Keypair.random();

pair.secret();
// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
pair.publicKey();
// GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
```

```python Python
# stellar-sdk >= 2.0.0 required
# create a completely new and unique pair of keys
# see more about KeyPair objects: https://stellar-sdk.readthedocs.io/en/latest/api.html#keypair
from stellar_sdk import Keypair

pair = Keypair.random()
print(f"Secret: {pair.secret}")
# Secret: SCMDRX7A7OVRPAGXLUVRNIYTWBLCS54OV7UH2TF5URSG4B4JQMUADCYU
print(f"Public Key: {pair.public_key}")
# Public Key: GAG7SXULMNWCW6LX42JKZOZRA2JJXQT23LYY32OXA6XECUQG7RZTQJHO
```

</CodeGroup>
````

Code groups with the same tab titles stay in sync across a page, so a reader
who picks Python sees Python everywhere. See Mintlify's [code block
documentation][mintlify-code] for titles, line highlighting, and other options.

**Remember that this is a community; we build together! 🫱🏻‍🫲🏽 Our code of conduct is [here](https://stellar.org/community/code-of-conduct) and our Privacy Policy is [here](https://stellar.org/privacy-policy).**

[docs]: https://developers.stellar.org/docs
[stellar]: https://stellar.org
[contrib]: https://github.com/stellar/.github/blob/master/CONTRIBUTING.md
[coc]: https://github.com/stellar/.github/blob/master/CODE_OF_CONDUCT.md
[mintlify]: https://www.mintlify.com/docs
[mint-cli]: https://www.mintlify.com/docs/cli/commands
[mintlify-components]: https://www.mintlify.com/docs/components/callouts
[mintlify-code]: https://www.mintlify.com/docs/create/code
[mdx]: https://mdxjs.com
[commonmark]: https://commonmark.org/help/
[tutorial]: https://www.markdowntutorial.com/
[guide]: https://www.markdownguide.org/
[open-in-github-codespaces]: https://github.com/codespaces/new?repo=stellar/stellar-docs&editor=web
[open-in-code-anywhere]: https://app.codeanywhere.com/#https://github.com/stellar/stellar-docs
