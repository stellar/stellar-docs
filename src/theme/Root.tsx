import React, { type ReactNode } from 'react';
import Root from '@theme-original/Root';

import ForAgentsPanel from '@site/src/components/ForAgentsPanel';

interface Props {
  children: ReactNode;
}

/**
 * `Root` wraps the whole app above the router, so anything rendered here
 * survives client-side navigation. That is what the "For agents" panel needs:
 * one instance for the entire site rather than one per page (#2586).
 *
 * This must WRAP `@theme-original/Root`, not replace it:
 * `docusaurus-markdown-source-plugin` ships its own Root, which injects the
 * "Open Markdown" dropdown and the hash-scroll behavior on docs pages. A
 * user-land Root shadows it outright, which is exactly the regression that
 * removed the button site-wide (#2712).
 */
export default function RootWrapper({ children }: Props): ReactNode {
  return (
    <Root>
      {children}
      <ForAgentsPanel />
    </Root>
  );
}
