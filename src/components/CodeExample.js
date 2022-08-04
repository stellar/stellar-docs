import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const CODE_LANGS = {
  bash: 'bash',
  cpp: 'C++',
  curl: 'cURL',
  go: 'Go',
  html: 'html',
  java: 'Java',
  js: 'JavaScript',
  json: 'JSON',
  python: 'Python',
  scss: 'SCSS',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  yaml: 'YAML',
};

export const CodeExample = ({ children }) => {
  return (
    <Tabs groupId="programming-language">
      {React.Children.map(children, (child, index) => {
        const codeProps = child.props.children.props;
        const { className = '' } = codeProps;

        const [_, language] = className.split('-');

        return (
          <TabItem
            key={index}
            value={language || index}
            label={CODE_LANGS[language] || 'Example'}
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
