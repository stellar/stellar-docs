import React, { type ReactNode } from 'react';

import ForAgentsPanel from '@site/src/components/ForAgentsPanel';

interface Props {
  children: ReactNode;
}

/**
 * `Root` wraps the whole app above the router, so anything rendered here
 * survives client-side navigation. That is what the "For agents" panel needs:
 * one instance for the entire site rather than one per page (#2586).
 */
export default function Root({ children }: Props): ReactNode {
  return (
    <>
      {children}
      <ForAgentsPanel />
    </>
  );
}
