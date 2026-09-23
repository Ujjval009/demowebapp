export default function EmptyState({ icon, title, description }) {
  return (
    <div className="text-center py-12 text-ink-soft">
      {icon && <div className="text-4xl mb-3 opacity-30">{icon}</div>}
      <p className="text-sm font-medium mb-1">{title}</p>
      {description && <p className="text-xs">{description}</p>}
    </div>
  );
}
