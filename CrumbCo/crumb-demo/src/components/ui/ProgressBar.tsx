export function ProgressBar({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone?: 'green' | 'amber' | 'red';
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress" role="presentation">
      <div className={`fill ${tone ?? (pct >= 90 ? 'red' : pct >= 60 ? 'amber' : 'green')}`} style={{ width: `${pct}%` }} />
    </div>
  );
}