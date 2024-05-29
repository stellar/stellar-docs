# Stellar Documentation and API Reference <!-- omit in toc -->

Welcome to the official home repository for [Documentation][docs] for the [Stellar network][stellar].

If you're here for the Deep Dive Docs Bounty, please navigate to the bottom of this page for all relevant information: [Deep Dive Docs Bounty](#welcome-to-the-deep-dive-docs-bounty).

## Table of Contents <!-- omit in toc -->

- [Contributing](#contributing)
- [Quick Start](#quick-start)
- [Repository Structure](#repository-structure)
- [Using Markdown](#using-markdown)
  - [Markdown Basics](#markdown-basics)
  - [Custom Markdown](#custom-markdown)
    - [Alert](#alert)
    - [Code Example](#code-example)
- [Deep Dive Docs Bounty](#welcome-to-the-deep-dive-docs-bounty)

## Contributing

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

- [CommonMark cheat sheet and tutorial][commonmark]
- [Interactive markdown tutorial][tutorial]
- [The markdown guide][guide]

### Custom Markdown

Our repository uses some custom React components that can be used inside the
`MDX` documents. Use them as follows:

**Make sure that there is an empty line within the wrapper.** For example,

```text
<Alert>
<!-- EMPTY LINE AFTER THE COMPONENT'S OPENING TAG IS REQUIRED -->

Note: the testnet is reset every three months, so when building on it, make sure you have a plan to recreate necessary accounts and other data. For more info, check out the [best practices for using the testnet](../../learn/fundamentals/networks.mdx).

<!-- EMPTY LINE BEFORE THE COMPONENT'S CLOSING TAG IS REQUIRED -->
</Alert>
```

#### Alert

![Testnet reset alert](./readme-imgs/alert.png)

`<Alert />` is used to convey hints, warnings, etc. For example,
[Build a SEP-31 Anchor on Testnet][alert-example]

```markdown
import { Alert } from "@site/src/components/Alert";

<Alert>

Note: the testnet is reset every three months, so when building on it, make sure you have a plan to recreate necessary accounts and other data. For more info, check out the [best practices for using the testnet](../../fundamentals-and-concepts/testnet-and-pubnet).

</Alert>
```

#### Code Example

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
## Welcome to the Deep Dive Docs Bounty 🐙!

If you’re here to participate in the Deep Dive Docs Bounty (it’s rid-doc-ulous!), you’ve come to the right place!

Between May 29th and August 7th, 2024, you can earn awards for contributing to and creating content for [Stellar Developer Documentation](https://developers.stellar.org/). The goal of this bounty is to encourage the community to contribute to Stellar projects and to help create a best-in-class developer experience by improving Stellar developer documentation.

Each submission can earn awards between $100 and $1,000 worth of XLM, depending on the complexity of the individual issue and the quality of the submission. More on award allocation is below.

### Submission process

If you haven't already, check out the [Stellar docs](https://developers.stellar.org/) to get oriented! When you’re ready to get started, follow these instructions:

- Navigate to the [Stellar Developer Docs issues](https://github.com/stellar/stellar-docs/issues) on GitHub
- Look through the open issues marked with the `Docs Bounty` label and pick one you’d like to work on
- Comment and tag `briwylde08` on the issue you'd like to work on and she will mark your chosen issue as “In Progress” in the Projects - Status section and assign you to the issue
- When you’re ready, open a [pull request (PR)](https://github.com/stellar/stellar-docs/pulls) in the Stellar Developer Docs GitHub and link to the corresponding issue in the PR description
- When you’ve completed your work on the PR, comment on the PR tagging `briwylde08` to let her know the PR is ready for review
- Bri will respond to your PR within three days of it being submitted and will mark the corresponding issue as “In Review” 

We will review your submission within three weeks and reply on your submission thread to let you know if your submission qualifies to earn an award! If so, we will ask you to complete a form to collect the info necessary to validate and deliver an award.

If your submission did not qualify, we may provide you with feedback on what's missing or on how you can improve your submission so it qualifies. Once you have made the requested revisions, we will re-review your submission and let you know if your updated submission qualifies for an award. 	

### What makes a good submission

The Stellar Development Foundation (“SDF”) will review submissions as they come in, and all Deep Dive Docs Bounty awards are contingent upon the review and approval of the submission by SDF at its sole discretion.

Your submission should adequately solve its corresponding issue. Each issue will include the amount of XLM it’s worth based on its complexity and say, “Get up to $__ worth of XLM for this issue.” Exact awards are then based on the quality of the submission (is it well-written, well-crafted, and easy to follow?) and thoroughness (is it comprehensive and well-documented?).

Here are some existing guides to help you get an idea of what we’re looking for: 

- [Build a Payment App with the JS SDK](https://developers.stellar.org/docs/building-apps/example-application-tutorial/payment): Payment Tutorial: something like this guide would get the full award allocation because it provides an introduction that defines how payments work, information about the user experience, and a detailed code walkthrough.
- [Deploy a Contract from Installed Wasm Bytecode How-To Guide](https://developers.stellar.org/docs/smart-contracts/guides/cli/deploy-contract): something like this would be eligible for a lower award amount because it only provides the code implementation without any explanatory material.

**Note:** SDF is under no obligation to make any awards if there are no eligible submissions or Eligible Individuals (as defined below) or if Eligible Individuals do not successfully complete the compliance and tax obligations set forth below.

## Helpful resources

Here are some resources that may be helpful to get you started:

- [Existing smart contract How-To Guides](https://developers.stellar.org/docs/smart-contracts/guides): many open issues involve creating new How-To Guides, so check out our existing guides in the docs to get a feel for the format and the content.
- [Stellar Developer Discord](https://discord.gg/stellardev): if you’re stuck on an issue, the Stellar Developer Discord is a great place to get guidance from the ecosystem. 

## Deep Dive Docs Bounty Eligibility Guidelines

### Submission Guidelines
- All submission materials should be in English or, if not in English, include an English translation. 
- Do not submit:
  - Submissions that point to ongoing asset sales, ICOs, referral programs, or affiliate links.
  - Speculative submissions, price or price prediction submissions, or “why X should buy Y” articles.
  - Submissions attacking others. Please adhere to the SDF Code of Conduct.
  - Other people’s work - no plagiarizing or infringing on a third party’s rights.
- All submissions must be original works, and the author should own all rights, title, and interest in the submission. If third-party licensed content is included in a submission, all necessary rights must be fully sub-licensable to SDF. Submissions should not include any content that is unlawful, breaches any third-party rights, or is otherwise in violation of or contrary to applicable laws or regulations. 

### Award Eligibility Guidelines

While anyone may make a submission, only Eligible Individuals will be considered for XLM awards. For purposes of Deep Dive Docs Bounty, an “Eligible Individual'' is a natural person who:

1. Is 18 years of age or older;
2. Is not an individual on the U.S. Department of Treasury’s Office of Foreign Assets Control (OFAC) Specially Designated Nationals and Blocked Persons List or otherwise under sanction by OFAC (or an immediate family member - spouses, parent, child, sibling, grandparent, and “step” child - of such individual) or be employed by or affiliated with an entity sanctioned by OFAC; 
3. Is not a resident of any country, state, province or territory subject to comprehensive OFAC sanctions, including Cuba, Iran, North Korea, Syria or any Russian-controlled region of Ukraine; and
4. Does not reside in a jurisdiction where the transfer and holding of cryptocurrency is illegal or would require a special license or authorization that the such person does not possess.

SDF reserves the right, in its absolute discretion, to disqualify any participant or submission, without warning, from Deep Dive Docs Bounty, and to ban them from future programs funded by the Soroban adoption fund if they act in a way that violates these guidelines, is inappropriate, or not in the best interests or spirit of the program.

### License to Submissions

By posting a submission, you will be granting to SDF and its assigns, licensees, and successors a royalty-free, irrevocable, non-exclusive and unlimited right and permission to use your submission, name, picture, statements, project name, likeness, and voice, and any material based thereon or derived therefrom (collectively, the “Content”), in any form, media, or technology now known or later developed, and to use, edit, modify, duplicate, distribute, publish, publicize and/or create derivative works from the Content (or any portion thereof), throughout the world, in perpetuity, without limitation and without payment of any royalties or compensation, consideration, notice or permission, except where prohibited by law, for the purpose of creating educational, informational, and promotional materials or creative assets (any such materials or assets that feature the Content are referred to herein as “Assets”), including, without limitation, on social media, or on any website owned or affiliated with SDF. You will have no right of approval, no claim to any compensation, and no claim arising out of the use, alteration, or distortion or use in any composite form of the Content. 

### Legal Terms and Acknowledgements

Deep Dive Docs Bounty is governed by the [SDF Terms of Service](https://www.stellar.org/terms-of-service?locale=en) and the guidelines described herein (the “Deep Dive Docs Bounty Eligibility Guidelines”). SDF may collect personal information from you in connection with your submission, and such information is subject to the [SDF Privacy Policy](https://www.stellar.org/privacy-policy?locale=en).  SDF reserves the right, in its sole discretion, to cancel, suspend and/or modify all or any part of Deep Dive Docs Bounty at any time for any reason. The terms and conditions of Deep Dive Docs Bounty are subject to change at any time, including the rights or obligations of the Participants and SDF. 

XLM is a highly risky and volatile asset, and SDF does not provide any representations, warranties, or guarantees of its value. You will be required to provide certain information to facilitate receipt of any XLM award, including completing and submitting any tax or other forms necessary for compliance with applicable withholding and reporting requirements. You are responsible for reporting the receipt of any XLM award to relevant government departments or agencies, where applicable, and paying all applicable taxes in your jurisdiction of residence. SDF reserves the right to withhold a portion of any award amount to comply with the tax laws of the United States or other relevant jurisdictions. You should inform yourself as to any legal and tax requirements or consequences applicable to you in respect of the acquisition, holding, and disposition of XLM. You are also responsible for complying with any applicable foreign exchange and banking regulations relating to any XLM award received hereunder.

To determine the number of XLM equal to the USD value of any Award, the USD valuation of XLM shall be calculated using the CF Stellar Lumens-Dollar Settlement Price as administered, maintained, and reported by the cryptocurrency index provider CF Benchmarks Ltd. (using the ticker “XLMUSD_RR”) (available at https://www.cfbenchmarks.com/indices/XLMUSD_RR), or, if such settlement price is unavailable or reasonably suspected by SDF to be unreliable, the settlement price as reported on a substantially similar and equally reputable cryptocurrency index provider as determined by the SDF in its discretion. The USD valuation of XLM for any particular Award shall be calculated using the CF Stellar Lumens-Dollar Settlement Price (or other agreed upon settlement price) reported on the day such Award is scheduled to be paid. The Participants acknowledge and understand that XLM is a highly risky and volatile asset, and that SDF does not provide any representations, warranties, or guarantees of its value.

SDF’s failure to enforce any of these terms or guidelines shall not constitute a waiver of that provision. Should any provision of these Sorobanathon Eligibility Guidelines be or become illegal or unenforceable in any jurisdiction whose laws or regulations may apply to a participant or submission, such illegality or unenforceability shall leave the remainder of these Sorobanathon Eligibility Guidelines to the fullest extent permitted by law, unaffected and valid. The illegal or unenforceable provision shall be replaced by a valid and enforceable provision that comes closest and best reflects the SDF’s intention in a legal and enforceable manner with respect to the invalid or unenforceable provision.

**Remember that this is a community we build together 💪! Our code of conduct is [here](https://www.stellar.org/community/code-of-conduct) and our Privacy Policy is [here](https://www.stellar.org/privacy-policy).**

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
