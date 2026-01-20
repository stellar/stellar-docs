import React, { useEffect, type ReactNode } from 'react';

export function RedirectPage({ to }: { to: string }): ReactNode {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return null;
}

export default RedirectPage;
