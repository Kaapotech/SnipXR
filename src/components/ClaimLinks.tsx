'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function ClaimLinks() {
  const { data: session, status } = useSession();
  const claimed = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || claimed.current) return;

    const codes = JSON.parse(localStorage.getItem('anon_links') ?? '[]');
    if (codes.length === 0) return;

    claimed.current = true;
    fetch('/api/links/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes }),
    }).then(() => {
      localStorage.removeItem('anon_links');
    });
  }, [status, session]);

  return null;
}
