# Stellar Documentation and API Reference 🌌 <!-- omit in toc -->

[![Apache 2.0 licensed](https://img.shields.io/badge/license-apache%202.0-blue.svg)](LICENSE)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/stellar/stellar-docs)

Welcome to the official home repository for [Documentation](https://developers.stellar.org/docs) for the [Stellar network](https://en.wikipedia.org/wiki/Stellar_(payment_network)).

## Table of Contents <!-- omit in toc -->

- [Contributing](#contributing)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
- [Repository Structure](#repository-structure)
- [Using Markdown](#using-markdown)
  - [Markdown Basics](#markdown-basics)
  - [Custom Markdown](#custom-markdown)

## Contributing

Contributions are more than welcome! Thank you! 🎉

Before diving in, please read our [Stellar Contribution Guide](https://github.com/stellar/.github/blob/master/CONTRIBUTING.md) for
details on contributing to Stellar's various repositories. Please take special
note of the [code of conduct](https://github.com/stellar/.github/blob/master/CODE_OF_CONDUCT.md).

Our documentation site is built using [Docusaurus](https://docusaurus.io). The content is
written in [MDX](https://mdxjs.com), which adds a lot of cool possibilities. Even if you're
unfamiliar with plain markdown, do not fear! You can still contribute in a
helpful and meaningful way. Markdown is super easy to learn, and will come quite
naturally after only a bit of practice. You can always help fix typos, spelling,
and broken links, too.

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

[![Open in Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?repo=stellar/stellar-docs&editor=web)

[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/stellar/stellar-docs)

### Prerequisites

To begin development on the documentation, you will first need to install the following:

- Node.js (v22, or higher): see https://nodejs.org/en/download/package-manager for details for your system
- npm: e.g. `sudo apt install npm` on Ubuntu
- yarn: `npm install yarn`
  - If you're getting dependency errors, try using `npm install yarn --legacy-peer-deps`
  - After `install` command succeeds run `corepack enable && corepack prepare yarn@stable --activate` to actually get yarn

### Development

Once all the prerequisites have been installed, you can run the following commands:

```bash
git clone https://github.com/stellar/stellar-docs
cd stellar-docs
yarn install
npx docusaurus start
```

This will begin the development server, and open a browser window/tab pointing
to `http://localhost:3000/docs/`. This development server will auto-reload when
it detects changes to the repository.

After you've made your changes, use the following commands to ensure the consistent
MDX file formatting and style across the repository:

```bash
npm run check:mdx # this will search for problems in the MDX files
npm run format:mdx # this will fix any problems that were found
```

After that you need to build the `routes.txt` file, to do that run the next command

```bash
yarn build
```

## Repository Structure

- `/docs/` Contains all the documentation content. If you're contributing to the
  actual documentation, rather than site functionality, this is likely where you
  will want to be.
  - `/docs/<subdirectory>/` Each subdirectory inside the `docs` directory
    contains content documents relating to a common idea (asset issuance, or
    running a validator node, for example). There can also be subdirectories
    nested even further, which will follow the same rules. The location of a
    document within this directory structure will have a direct impact on the
    URL given to the document on the site (unless there is metadata or front
    matter that overrides these defaults.)
  - `/docs/<subdirectory>/_category_.json` This file contains information that
    determines the directory's location and position within the site's sidebar.
  - `/docs/<subdirectory>/<filename>.mdx` The actual documents live in these
    files (written in Markdown), and also contains "front matter" which can
    specify configuration parameter for the document's display, URL, etc. **All
    filenames must use dashes for spaces instead of spaces or underscores**
- `/src/` Contains non-documentation files like custom React components and
  styling.
- `/static/` Contains static assets. Anything in this directory will be copied
  to the root of the final `build` directory.
- `/nginx/` Contains configuration used to deploy and host the docs site. Unless
  you're part of Stellar's IT Ops team, you probably don't need to do anything
  with this. *Exception*:
  - `/nginx/includes/redirects.conf` Contains redirect rules to avoid broken
    links. If you find a broken link somewhere out in the wilds of the internet,
    and there's no way for it to be changed, a redirect could be a useful tool.
    (Note our aim isn't to *completely* avoid 404 pages for a user. That would
    be impossible and impractical. These redirects are evaluated on a
    case-by-case basis, and it may be determined that a redirect isn't the right
    approach in some instances.)

## Using Markdown

### Markdown Basics

If you're unfamiliar with Markdown, there are **loads** of good tutorials and
cheat sheets out there. Check out some of these resources to get a handle on the
basics:

- [CommonMark cheat sheet and tutorial](https://commonmark.org/help/)
- [Interactive markdown tutorial](https://www.markdowntutorial.com/)
- [The markdown guide](https://www.markdownguide.org/)

### Custom Markdown

Our repository uses some custom React components that can be used inside the
`MDX` documents. Use them as follows:

**Make sure that there is an empty line within the wrapper.** For example,

```text
<CodeExample>
<!-- EMPTY LINE AFTER THE COMPONENT'S OPENING TAG IS REQUIRED -->

```javascript
console.log("hello world");
```

```python
print("hello world")
```

<!-- EMPTY LINE BEFORE THE COMPONENT'S CLOSING TAG IS REQUIRED -->
</CodeExample>
```

#### Code Example

![Create account code example](./readme-imgs/code-example.png)

`<CodeExample />` is a code snippet component. You can use this component when
you want to include snippets for more than one language. See an example
including a snippet for `JavaScript` and `Python` below. It is using [Prism
React Renderer](https://github.com/FormidableLabs/prism-react-renderer) for syntax highlighting. If you're only making a code
snippet for a _single programming language_, you should just stick with a
"normal" markdown code fence using backticks.

> [!NOTE]
> The `CodeExample` component has been added to the list of globally available
> components, in `/src/theme/MDXComponents.ts`. This means it's not required to
> `import { CodeExample } ...` in a page if you're planning to use it. It's just
> always available in MDX file.

````markdown
<CodeExample>

```js
// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
const pair = StellarSdk.Keypair.random();

pair.secret();
// SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
pair.publicKey();
// GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB
```

```python
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

</CodeExample>
````

Languages that are currently being used in Documentation and API Reference are
below:

```js
// https://github.com/stellar/stellar-docs/blob/main/config/constants.ts

export const CODE_LANGS = {
  bash: 'bash',
  cpp: 'C++',
  curl: 'cURL',
  dart: 'Flutter',
  flutter: 'Flutter',
  swift: 'Swift',
  docker: 'Dockerfile',
  go: 'Go',
  html: 'html',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  json5: 'JSON5',
  python: 'Python',
  scss: 'SCSS',
  sql: 'SQL',
  rust: 'Rust',
  php: 'PHP',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
};
```

**Remember that this is a community; we build together! 🫱🏻‍🫲🏽 Our code of conduct is [here](https://www.stellar.org/community/code-of-conduct) and our Privacy Policy is [here](https://www.stellar.org/privacy-policy).**
