# Stellar Documentation and API Reference <!-- omit in toc -->

Welcome to the official home repository for [Documentation][docs] and
[API Reference][api] for the [Stellar Network][stellar].

# Table of Contents <!-- omit in toc -->

- [Contributing](#contributing)
- [Quick Start](#quick-start)
- [Repository Structure](#repository-structure)
- [Using Markdown](#using-markdown)
  - [Markdown Basics](#markdown-basics)
  - [Custom Markdown](#custom-markdown)
    - [Alert](#alert)
    - [Code Example](#code-example)

# Contributing

Contributions are more than welcome! Thank you! 🎉

Before diving in, please read our [Stellar Contribution Guide][contrib] for
details on contributing to Stellar's various repositories. Please take special
note of the [code of conduct][coc].

Our documentation site is built using [Docusaurus][docusaurus]. The content is
written in [MDX][mdx], which adds a lot of cool possibilities. Even if you're
unfamiliar with plain markdown, do not fear! You can still contribute in a
helpful and meaningful way. Markdown is super easy to learn, and will come quite
naturally after only a bit of practice. You can always help fix typos, spelling,
and broken links, too.

All static images are stored in the git via [git lfs](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage). If you haven't installed it yet, please follow this [link](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage)

# Quick Start
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)][codespaces]  
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][gitpod]

To begin development on the documentation, you will first need [yarn][yarn]
installed on your system. Once it is, you can run the following commands:

```bash
git clone https://github.com/stellar/stellar-docs
cd stellar-docs
yarn install
npx docusaurus start
```

This will begin the development server, and open a browser window/tab pointing
to `http://localhost:3000/docs/`. This development server will auto-reload when
it detects changes to the repository.

After you've made your changes, please use `prettier` to ensure consistent
formatting throughout the repository:

```bash
npm run check:mdx # this will search for problems in the MDX files
npm run format:mdx # this will fix any problems that were found
```

# Repository Structure

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

# Using Markdown

## Markdown Basics

If you're unfamiliar with Markdown, there are **loads** of good tutorials and
cheat sheets out there. Check out some of these resources to get a handle on the
basics:

- [CommonMark cheat sheet and tutorial][commonmark]
- [Interactive markdown tutorial][tutorial]
- [The markdown guide][guide]

## Custom Markdown

Our repository uses some custom React components that can be used inside the
`MDX` documents. Use them as follows:

**Make sure that there is an empty line within the wrapper.** For example,

```
<Alert>
<!-- EMPTY LINE AFTER THE COMPONENT'S OPENING TAG IS REQUIRED -->

Note: the testnet is reset every three months, so when building on it, make sure you have a plan to recreate necessary accounts and other data. For more info, check out the [best practices for using the testnet](../../fundamentals-and-concepts/testnet-and-pubnet).

<!-- EMPTY LINE BEFORE THE COMPONENT'S CLOSING TAG IS REQUIRED -->
</Alert>
```

### Alert

![Testnet reset alert](./readme-imgs/alert.png)

`<Alert />` is used to convey hints, warnings, etc. For example,
[Build a SEP-31 Anchor on Testnet][alert-example]

```markdown
import { Alert } from "@site/src/components/Alert";

<Alert>

Note: the testnet is reset every three months, so when building on it, make sure you have a plan to recreate necessary accounts and other data. For more info, check out the [best practices for using the testnet](../../fundamentals-and-concepts/testnet-and-pubnet).

</Alert>
```

### Code Example

![Create account code example](./readme-imgs/code-example.png)

`<CodeExample />` is a code snippet component. You can include snippets for more
than one language. See an example including a snippet for `JavaScript` and
`Python` below. It is using [Prism React Renderer][prism] for syntax
highlighting.

````markdown
import { CodeExample } from "@site/src/components/CodeExample";

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
// https://github.com/stellar/stellar-docs/blob/main/src/components/CodeExample.js

const CODE_LANGS = {
  bash: 'bash',
  cpp: 'C++',
  curl: 'cURL',
  go: 'Go',
  html: 'html',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  json5: 'JSON5',
  python: 'Python',
  scss: 'SCSS',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
};
```

[docs]: https://developers.stellar.org/docs
[api]: https://developers.stellar.org/api
[stellar]: https://stellar.org
[contrib]: https://github.com/stellar/.github/blob/master/CONTRIBUTING.md
[coc]: https://github.com/stellar/.github/blob/master/CODE_OF_CONDUCT.md
[docusaurus]: https://docusaurus.io
[mdx]: https://mdxjs.com
[yarn]: https://yarnpkg.com/
[commonmark]: https://commonmark.org/help/
[tutorial]: https://www.markdowntutorial.com/
[guide]: https://www.markdownguide.org/
[alert-example]: https://developers.stellar.org/docs/anchoring-assets/enabling-cross-border-payments/setting-up-test-server
[prism]: https://github.com/FormidableLabs/prism-react-renderer
[codespaces]: https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=521307729&machine=basicLinux32gb&devcontainer_path=.devcontainer%2Fdevcontainer.json&location=EastUs
[gitpod]: https://gitpod.io/#https://github.com/stellar/stellar-docs
