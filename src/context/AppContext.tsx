// src/context/AppContext.tsx
// Path: src/context/AppContext.tsx
// Global state for URLs and alerts — update streamUrl/backendUrl from Settings
// and all screens will re-render automatically.

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Alert {
  id: string;
  timestamp: string;       // Human-readable, e.g. "10:45 AM"
  isoTimestamp: string;    // ISO 8601 for sorting
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface AppContextValue {
  streamUrl: string;
  backendUrl: string;
  alerts: Alert[];
  setStreamUrl: (url: string) => void;
  setBackendUrl: (url: string) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  clearAlerts: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

// ─── Seed data (replace with real API call from Settings page) ───────────────

const SEED_ALERTS: Alert[] = [
  {
    id: '1',
    timestamp: '10:45 AM',
    isoTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    description: 'Person detected walking by the bed',
    severity: 'high',
  },
  {
    id: '2',
    timestamp: '10:32 AM',
    isoTimestamp: new Date(Date.now() - 1000 * 60 * 43).toISOString(),
    description: 'Motion detected near front door',
    severity: 'medium',
  },
  {
    id: '3',
    timestamp: '10:18 AM',
    isoTimestamp: new Date(Date.now() - 1000 * 60 * 57).toISOString(),
    description: 'Shadow movement detected in hallway',
    severity: 'low',
  },
  {
    id: '4',
    timestamp: '09:55 AM',
    isoTimestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    description: 'Person detected entering living room',
    severity: 'high',
  },
  {
    id: '5',
    timestamp: '09:41 AM',
    isoTimestamp: new Date(Date.now() - 1000 * 60 * 94).toISOString(),
    description: 'Motion detected — low confidence',
    severity: 'low',
  },
];

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // Replace these defaults with your actual local IP / ngrok URL
  const [streamUrl, setStreamUrlState] = useState(
    'http://192.168.1.100:8080/video_feed'
  );
  const [backendUrl, setBackendUrlState] = useState(
    'http://192.168.1.100:5000'
  );
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS);

  const setStreamUrl = useCallback((url: string) => {
    setStreamUrlState(url.trim());
  }, []);

  const setBackendUrl = useCallback((url: string) => {
    setBackendUrlState(url.trim());
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return (
    <AppContext.Provider
      value={{
        streamUrl,
        backendUrl,
        alerts,
        setStreamUrl,
        setBackendUrl,
        addAlert,
        clearAlerts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within <AppProvider>');
  }
  return ctx;
}
