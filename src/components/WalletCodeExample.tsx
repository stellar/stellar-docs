import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {getCookie, walletDefaultLang} from "./LanguageSpecific";
import {CODE_LANGS} from "@site/config/constants";
import Translate from '@docusaurus/Translate';

// TODO: when TS docs are ready set to false
const ALLOW_EMPTY_DOCS = true;
// Set to true for local debugging
const SHOW_ALL = false;

const WALLET_LANGS = ["kt", "ts", "dart", "swift"];

type WalletCodeExampleProps = {
    children: React.ReactElement;
};

export const WalletCodeExample: React.FC<WalletCodeExampleProps> = ({children}) => <BrowserOnly fallback={getTabs(children, walletDefaultLang)}>
        {() => getTabs(children, getCookie())}
    </BrowserOnly>;

const getTabs = (children: React.ReactElement, targetLanguage: string) => {
    const defaultVal = CODE_LANGS[targetLanguage];

    const tabs = React.Children.map(children, (child, index) => {
        const codeProps = child.props.children.props;
        const {className = ''} = codeProps;

        let [, language] = className.split('-');

        if (language === "flutter") {
            language = "dart";
        }

        return (
            <TabItem
                key={language || index}
                value={CODE_LANGS[language] || language || index}
                label={CODE_LANGS[language] ||
                    <Translate
                        id='components.CodeExample.NoLanguageTabTitle'
                        description='The tab title for a code example where no programming language was specified'>
                        Example
                    </Translate>
                }
                default={defaultVal === CODE_LANGS[language]}
            >
                <CodeBlock language={language} showLineNumbers>
                    {codeProps.children}
                </CodeBlock>
            </TabItem>
        );
    });

    for (let i = 0; i < WALLET_LANGS.length; i++) {
        const language = CODE_LANGS[WALLET_LANGS[i]];

        if (tabs.filter((x) => x.props.value === language).length === 0) {
            if (ALLOW_EMPTY_DOCS) {
                tabs.push(<TabItem
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

   let toShowTabs = tabs;

   if (!SHOW_ALL) {
       for (let i = 0; i < tabs.length; i++) {
           const language = CODE_LANGS[targetLanguage];
           if (tabs[i].props.value === language) {
                toShowTabs = [tabs[i]];
           }
       }
   }

    const gid = `wallet-lang${  defaultVal}`;
    // const gid = "p-wallet" + defaultVal + Math.random()

    return (<Tabs groupId={gid}>
        {toShowTabs}
    </Tabs>);
};
