import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {CODE_LANGS} from "../constants";

export const CodeFromFileExample = ({path, showLineNumbers, children}) => {
  const codeExample = require(`@site/static/assets/${path}`);
  return (

      <Tabs groupId="programming-language">
        {React.Children.map(children, (child, index) => {

          const codeProps = child.props.children.props;
          const {className = ''} = codeProps;

          const [, language] = className.split('-');
          return (
              <TabItem
                  key={language || index}
                  value={language || index}
                  label={CODE_LANGS[language] || 'Example'}
              >
                <CodeBlock language={language} showLineNumbers={showLineNumbers}>
                  {language === 'json' ? JSON.stringify(codeExample, null, "  ") : JSON.stringify(codeExample)}
                </CodeBlock>
              </TabItem>
          );
        })}
      </Tabs>
  );
};
