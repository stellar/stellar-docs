import { useCallback, useEffect, useState } from 'react';

import {
  AGENT_TOOL_STORAGE_KEY,
  AGENT_TOOLS,
  DEFAULT_AGENT_TOOL_ID,
} from '@site/src/data/agentTools';

const isKnownTool = (id: string | null): boolean =>
  !!id && AGENT_TOOLS.some((tool) => tool.id === id);

function read(): string | null {
  try {
    return localStorage.getItem(AGENT_TOOL_STORAGE_KEY);
  } catch {
    // Private browsing, or storage is disabled. Fall back to the default tool.
    return null;
  }
}

/**
 * The reader's chosen AI tool, persisted under the same storage key Docusaurus
 * uses for the `mcp-client` tab group. Choosing a tool in the "For agents"
 * panel therefore also picks it on the Building with AI page, and vice versa.
 *
 * Reads happen in an effect rather than during render so the value cannot
 * differ between the server-rendered HTML and the first client render.
 */
export default function useSelectedAgentTool(): [string, (id: string) => void] {
  const [toolId, setToolId] = useState<string>(DEFAULT_AGENT_TOOL_ID);

  useEffect(() => {
    const stored = read();
    if (isKnownTool(stored)) {
      setToolId(stored as string);
    }
  }, []);

  // Keep multiple tabs (and the docs page's own `<Tabs>`) in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === AGENT_TOOL_STORAGE_KEY && isKnownTool(event.newValue)) {
        setToolId(event.newValue as string);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selectTool = useCallback((id: string) => {
    setToolId(id);
    try {
      localStorage.setItem(AGENT_TOOL_STORAGE_KEY, id);
    } catch {
      // Selection still applies for this page view, it just will not persist.
    }
  }, []);

  return [toolId, selectTool];
}
