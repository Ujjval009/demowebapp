export function StatCard({ label, value, children, danger }) {
  return (
    <div className="flex-1 py-4 px-5 border-r border-rule last:border-r-0">
      <div className="text-xs text-ink-soft mb-1.5">{label}</div>
      <div className={`text-xl font-mono font-medium ${danger ? "text-brick" : ""}`}>{value}</div>
      {children}
    </div>
  );
}

export function StatStrip({ children }) {
  return <div className="flex border border-rule mb-7">{children}</div>;
}
