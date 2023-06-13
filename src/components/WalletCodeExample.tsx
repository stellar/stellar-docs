import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {getCookie, walletDefaultLang} from "./LanguageSpecific";
import BrowserOnly from '@docusaurus/BrowserOnly';
import {CODE_LANGS} from "./CodeExample";
import {Exception} from "sass";

// TODO: when TS docs are ready set to false
const ALLOW_EMPTY_DOCS = true

const WALLET_LANGS = ["kt", "ts"]

type WalletCodeExampleProps = {
    children: React.ReactElement
}

export const WalletCodeExample: React.FC<WalletCodeExampleProps> = ({children}) => {
    return <BrowserOnly fallback={getTabs(children, walletDefaultLang)}>
        {() => getTabs(children, getCookie())}
    </BrowserOnly>
}

const getTabs = (children: React.ReactElement, lang: String) => {
    const defaultVal = CODE_LANGS[lang]

    const tabs = React.Children.map(children, (child, index) => {
        const codeProps = child.props.children.props;
        const {className = ''} = codeProps;

        const [, language] = className.split('-');

        return (
            <TabItem
                key={language || index}
                value={CODE_LANGS[language] || language || index}
                label={CODE_LANGS[language] || 'Example'}
                default={defaultVal === CODE_LANGS[language]}
            >
                <CodeBlock language={language} showLineNumbers>
                    {codeProps.children}
                </CodeBlock>
            </TabItem>
        );
    })

    for (let i = 0; i < WALLET_LANGS.length; i++) {
        const language = CODE_LANGS[WALLET_LANGS[i]]

        if (tabs.filter((x) => x.props.value === language).length === 0) {
            if (ALLOW_EMPTY_DOCS) {

                tabs.push(<TabItem
                    key={language}
                    value={language}
                    label={language}
                    default={defaultVal === language}
                >
                    <CodeBlock language={language} showLineNumbers>
                        // There is no code example for {language} yet
                    </CodeBlock>
                </TabItem>)
            } else {
                throw Error("Missing " + language + " documentation")
            }
        }
    }

    const gid = "wallet-lang" + defaultVal
    // const gid = "p-wallet" + defaultVal + Math.random()

    return (<Tabs groupId={gid}>
        {tabs}
    </Tabs>)
}
