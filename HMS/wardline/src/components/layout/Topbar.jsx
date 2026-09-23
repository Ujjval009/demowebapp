export default function Topbar({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-ink-soft text-sm mt-1" dangerouslySetInnerHTML={{ __html: subtitle }} />}
      </div>
      {action}
    </div>
  );
}
