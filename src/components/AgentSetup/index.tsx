import React, { type ReactNode } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Link from '@docusaurus/Link';

import {
  AGENT_TOOL_GROUP_ID,
  AGENT_TOOLS,
  DEFAULT_AGENT_TOOL_ID,
  type ToolInstructions,
} from '@site/src/data/agentTools';

/**
 * The Building with AI page's rendering of the shared agent setup content in
 * `src/data/agentTools`. The "For agents" panel renders the same data, so the
 * page and the panel cannot fall out of sync.
 *
 * Both use the `mcp-client` tab group, which means a tool picked in the panel
 * is already selected when the reader lands here.
 */

function Instructions({ instructions }: { instructions: ToolInstructions }): ReactNode {
  return (
    <>
      {instructions.note && <p>{instructions.note}</p>}
      {instructions.snippets.map((snippet) => (
        <CodeBlock key={snippet.code} language={snippet.language}>
          {snippet.code}
        </CodeBlock>
      ))}
      {instructions.links && (
        <p>
          {instructions.links.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 && ' · '}
              <Link to={link.href}>{link.label}</Link>
            </React.Fragment>
          ))}
        </p>
      )}
    </>
  );
}

function AgentToolTabs({
  render,
}: {
  render: (tool: (typeof AGENT_TOOLS)[number]) => ReactNode;
}): ReactNode {
  return (
    <Tabs groupId={AGENT_TOOL_GROUP_ID} defaultValue={DEFAULT_AGENT_TOOL_ID}>
      {AGENT_TOOLS.map((tool) => (
        <TabItem key={tool.id} value={tool.id} label={tool.label}>
          {render(tool)}
        </TabItem>
      ))}
    </Tabs>
  );
}

/** Per-client instructions for connecting an agent to the Raven MCP server. */
export function RavenConnectTabs(): ReactNode {
  return <AgentToolTabs render={(tool) => <Instructions instructions={tool.raven} />} />;
}

/** Per-client instructions for installing the Stellar Skills. */
export function SkillsInstallTabs(): ReactNode {
  return (
    <AgentToolTabs render={(tool) => <Instructions instructions={tool.skills.install} />} />
  );
}
