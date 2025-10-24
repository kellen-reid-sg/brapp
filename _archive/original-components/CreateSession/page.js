'use client';

import CreateSessionPage from './CreateSessionPage';

export default function Page() {
  return <CreateSessionPage />;
}

// This prevents the page from being pre-rendered at build time
export const dynamic = 'force-dynamic';