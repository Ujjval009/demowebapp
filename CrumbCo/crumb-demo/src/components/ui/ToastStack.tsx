import { useApp } from '../../context/AppContext';

const ICONS: Record<string, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '!',
};

export function ToastStack() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => dismissToast(t.id)}>
          <span style={{ fontWeight: 700 }}>{ICONS[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}