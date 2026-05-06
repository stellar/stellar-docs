import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {getCookie, walletDefaultLang} from "./LanguageSpecific";
import {CODE_LANGS} from "@site/config/constants";
import Translate, { translate } from '@docusaurus/Translate';
type TabItemPropsLocal = {
  children: React.ReactNode;
  value: string;
  default?: boolean;
  label?: string;
};

// TODO: when TS docs are ready set to false
const ALLOW_EMPTY_DOCS = true;
// Set to true for local debugging
const SHOW_ALL = false;

const WALLET_LANGS = ["kt", "ts", "dart", "swift"];

type WalletCodeExampleProps = {
  children: React.ReactNode;
};

export const WalletCodeExample: React.FC<WalletCodeExampleProps> = ({children}) => <BrowserOnly fallback={getTabs(children, walletDefaultLang)}>
    {() => getTabs(children, getCookie())}
  </BrowserOnly>;

const getTabs = (children: React.ReactNode, targetLanguage: string) => {
  const defaultVal = CODE_LANGS[targetLanguage];

  const tabs = React.Children.map(children, (child, index): React.ReactElement<TabItemPropsLocal> | null => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childProps = child.props as { children?: React.ReactNode };
    if (!React.isValidElement(childProps.children)) {
      return null;
    }

    const codeProps = (childProps.children.props ?? {}) as { className?: string; children?: React.ReactNode };
    const {className = ''} = codeProps;

    let [, language] = className.split('-');

    if (language === "flutter") {
      language = "dart";
    }

    const label =
      CODE_LANGS[language] ??
      translate({
        id: "components.CodeExample.NoLanguageTabTitle",
        message: "Example",
        description:
          "The tab title for a code example where no programming language was specified",
      });

    return (
      <TabItem
        key={language || index}
        value={String(CODE_LANGS[language] ?? language ?? index)}
        label={label}
        default={defaultVal === CODE_LANGS[language]}
      >
        <CodeBlock language={language} showLineNumbers>
          {codeProps.children}
        </CodeBlock>
      </TabItem>
    );
  });

  const tabsList = (tabs ?? []).filter(Boolean) as React.ReactElement<TabItemPropsLocal>[];

  for (let i = 0; i < WALLET_LANGS.length; i++) {
    const language = String(CODE_LANGS[WALLET_LANGS[i]]);

    if (tabsList.filter((x) => x.props.value === language).length === 0) {
      if (ALLOW_EMPTY_DOCS) {
        tabsList.push(<TabItem
          key={language}
          value={language}
          label={language}
          default={defaultVal === language}
        >
          <CodeBlock language={language} showLineNumbers>
            <Translate
              id="components.CodeExample.MissingCodeExample"
              description='In the Wallet-SDK code example component, this message will display when the selected programming language has no accompanying example'
              values={{language: language}}>
              {'// There is no code example for {language} yet'}
            </Translate>
          </CodeBlock>
        </TabItem>);
      } else {
        throw Error(`Missing ${  language  } documentation`);
      }
    }
  }

   let toShowTabs = tabsList;

   if (!SHOW_ALL) {
     for (let i = 0; i < tabsList.length; i++) {
       const language = String(CODE_LANGS[targetLanguage]);
       if (tabsList[i].props.value === language) {
        toShowTabs = [tabsList[i]];
       }
     }
   }

  const gid = `wallet-lang${  defaultVal}`;
  // const gid = "p-wallet" + defaultVal + Math.random()

  return (<Tabs groupId={gid}>
    {toShowTabs}
  </Tabs>);
};
