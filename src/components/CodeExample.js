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

export const CodeExample = ({ children }) => (
    // console.log(children),

    <Tabs groupId="programming-language">
      {React.Children.map(children, (child, index) => {
        const codeProps = child.props.children.props;
        const { className = '' } = codeProps;

        const [, language] = className.split('-');

        return (
          <TabItem
            key={language || index}
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
