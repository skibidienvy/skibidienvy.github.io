'use client';

import { useEffect, useState } from 'react';

export function SystemBar() {
  const [time, setTime] = useState('');
  const [visits, setVisits] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  // Clock set in an effect (not render) so server and client markup match.
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Visitor count via Abacus (free hit counter). Static site has no backend of its
  // own. ponytail: external service — if it dies, swap the URL or self-host a counter.
  useEffect(() => {
    fetch('https://abacus.jasoncameron.dev/hit/enviouss-org/visits')
      .then((response) => response.json() as Promise<{ value: number }>)
      .then((data) => setVisits(data.value))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="system-bar" aria-label="status bar">
      <span>enviouss.org</span>
      <span className="system-bar-right">
        <span>visits {failed ? '—' : visits ?? '…'}</span>
        <span>{time || '--:--:--'}</span>
      </span>
    </div>
  );
}
