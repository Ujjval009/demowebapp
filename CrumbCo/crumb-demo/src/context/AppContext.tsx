import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Toast, ToastType, ViewKey } from '../types';

interface AppContextValue {
  view: ViewKey;
  setView: (view: ViewKey) => void;
  branch: string;
  setBranch: (branch: string) => void;
  role: string;
  setRole: (role: string) => void;
  toasts: Toast[];
  pushToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: number) => void;
  tourActive: boolean;
  setTourActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const TOAST_TTL = 3600;

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [branch, setBranch] = useState('All Branches');
  const [role, setRole] = useState('Owner');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tourActive, setTourActive] = useState(false);
  const nextId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      window.setTimeout(() => dismissToast(id), TOAST_TTL);
    },
    [dismissToast],
  );

  useEffect(() => {
    document.title = `${view === 'dashboard' ? 'Dashboard' : view.toUpperCase()} · Crumb & Co.`;
  }, [view]);

  const value = useMemo<AppContextValue>(
    () => ({
      view,
      setView,
      branch,
      setBranch,
      role,
      setRole,
      toasts,
      pushToast,
      dismissToast,
      tourActive,
      setTourActive,
    }),
    [view, branch, role, toasts, pushToast, dismissToast, tourActive],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}