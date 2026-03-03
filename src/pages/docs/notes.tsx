import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

function hashDateToMeetingsPath(hash: string): string | null {
  // Accept "#YYYY-MM-DD" (legacy meeting notes deep links)
  const m = /^#(\d{4})-(\d{2})-(\d{2})$/.exec(hash);
  if (!m) return null;
  const [, yyyy, mm, dd] = m;
  return `/meetings/${yyyy}/${mm}/${dd}`;
}

export default function NotesRedirect(): JSX.Element {
  useEffect(() => {
    const target = hashDateToMeetingsPath(window.location.hash) ?? '/meetings';
    window.location.replace(target);
  }, []);

  return (
    <Layout title="Redirecting…" description="Redirecting to meeting notes">
      <main style={{ padding: '3rem 1rem' }}>
        <p>Soroban documentation link redirecting…</p>
      </main>
    </Layout>
  );
}

