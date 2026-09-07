import { useCallback, useState } from 'react';
import { useStorageSlot } from '@docusaurus/theme-common';

import {
  AGENT_TOOL_STORAGE_KEY,
  AGENT_TOOLS,
  DEFAULT_AGENT_TOOL_ID,
} from '@site/src/data/agentTools';

/**
 * The reader's chosen AI tool, stored under the same key Docusaurus uses for
 * the `mcp-client` tab group. Choosing a tool in the "For agents" panel picks
 * it on the Building with AI page too, and vice versa.
 *
 * This goes through Docusaurus' own storage slot rather than `localStorage`
 * directly, for two reasons: the slot applies the site's storage namespace, and
 * its `set` dispatches a synthetic `storage` event. Writing raw `localStorage`
 * would leave an already-open page's `<Tabs>` on the previous tool until the
 * next navigation, because native storage events only fire in *other* windows.
 */
export default function useSelectedAgentTool(): [string, (id: string) => void] {
  const [storedValue, storageSlot] = useStorageSlot(AGENT_TOOL_STORAGE_KEY);

  // Storage can be a no-op (incognito, iframes, strict privacy settings). Local
  // state keeps the picker working for the current page view when it is.
  const [fallbackToolId, setFallbackToolId] = useState(DEFAULT_AGENT_TOOL_ID);

  const toolId = AGENT_TOOLS.some((tool) => tool.id === storedValue)
    ? (storedValue as string)
    : fallbackToolId;

  const selectTool = useCallback(
    (id: string) => {
      setFallbackToolId(id);
      storageSlot.set(id);
    },
    [storageSlot],
  );

  return [toolId, selectTool];
}
