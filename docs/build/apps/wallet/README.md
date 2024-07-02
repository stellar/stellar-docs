## Contributing guide

Thank you for contributing to the Stellar Wallet documentation! To get started,
please first read [main README](../../../README.md) guide.

This documentation is mainly for the Wallet SDK and it's usages to integrate
with various SEPs.

The document is structured to be language-agnostic, but with the components
listed below we can add language-specific logic into the document.

Generally, text should be applicable to all of supported programming languages,
but for differences special `<LanguageSpecific/>` component can be used (read
more below)

### Wallet guide components

#### Header

Header is a special .mdx file that should be included on all pages. It contains:

- Language buttons
- A general guide on using this buttons
- Optional warning for languages in progress

On all new pages, Header should be the first element. Optionally, provide list
of languages that are work in progress:

```mdxjs
<Header WIPLangs={["ts", "dart"]}/>
```

#### LanguageButtons

This component is a part of the header. It allows to switch between programming
languages. Current language is stored as a cookie.

#### WalletGuideWarn

This component puts a warning if language is in progress for this section.
Please use `WIPLangs` property to enable it for a language for the page.

#### WalletCodeExample

This is improved `CodeExample` component. It currently supports dynamic
switching between TypeScript, Kotlin and Flutter code snippets (depending on the
user selected language). It will also generate placeholder if code snippet is
missing. Here's an example on how to use it:

````mdxjs
<CodeExample>

​```kotlin
// Kotlin example here
​```


​```ts
// TypeScript example here
​```

// Flutter example is replaced with an auto-generated notice

</CodeExample>
````

For a regular code examples (non Wallet SDK) please use vanilla `CodeExample`
component.

#### LanguageSpecific

This component allows to render parts of documentation based on selected code.
To get started, crete 2 files in `component` directory:

```md
// ./component/kt/hello.mdx Hello, Kotlin!
```

```md
// ./component/ts/hello.mdx Hello, TypeScript!
```

Then, in the main document import both files and LanguageSpecific component:

```mdxjs
// main.mdx
import {LanguageSpecific} from "@site/src/components/LanguageSpecific";
import KtHello from "./component/kt/hello.mdx";
import TsHello from "./component/ts/hello.mdx";

<LanguageSpecific kt={<KtHello/>} ts={<TsHello/>} /
```

When user selects Kotlin, "Hello, Kotlin!" is going to be rendered, when
TypeScript is selected — "Hello, TypeScript!". Finally, for Flutter, nothing
would be rendered.
