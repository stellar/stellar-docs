import React, { type ReactNode } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { CODE_LANGS } from "@site/config/constants";
import Translate from '@docusaurus/Translate';

export function CodeExample({ children }): ReactNode {
  return (
    <Tabs groupId="programming-language">
      {React.Children.map(children, (child, index) => {
        const codeProps = child.props.children.props;
        const { className = '' } = codeProps;

        const [, language] = className.split('-');

        return (
          <TabItem
            key={language || index}
            value={language || index}
            label={CODE_LANGS[language] ||
              <Translate
                id='components.CodeExample.NoLanguageTabTitle'
                description='The tab title for a code example where no programming language was specified'>
                Example
              </Translate>
            }
          >
            <CodeBlock language={language} showLineNumbers>
              {codeProps.children}
            </CodeBlock>
          </TabItem>
        );
      })}
    </Tabs>
  );
};
