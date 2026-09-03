// src/hooks/useAlertPoller.ts
// Polls the Python backend /alerts endpoint every N seconds
// and pushes new alerts into global context.

import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const POLL_INTERVAL_MS = 5000; // 5 seconds

export function useAlertPoller() {
  const { backendUrl, addAlert } = useAppContext();
  const lastSeenRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!backendUrl) return;

    const poll = async () => {
      try {
        const res = await fetch(`${backendUrl}/alerts`);
        if (!res.ok) return;

        const data: Array<{
          timestamp: string;
          description: string;
          severity?: 'low' | 'medium' | 'high';
        }> = await res.json();

        if (!Array.isArray(data) || data.length === 0) return;

        const latest = data[0];
        if (latest.timestamp === lastSeenRef.current) return;

        lastSeenRef.current = latest.timestamp;

        const date = new Date(latest.timestamp);
        const humanTime = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        addAlert({
          timestamp: humanTime,
          isoTimestamp: latest.timestamp,
          description: latest.description,
          severity: latest.severity ?? 'medium',
        });
      } catch {
        // Silently ignore network errors — backend may be offline
      }
    };

    // Kick off immediately then repeat
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [backendUrl, addAlert]);
}
