export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-3.5 py-1.5 text-sm cursor-pointer border rounded-sm transition-colors ${
            active === tab
              ? "bg-ink text-paper border-ink"
              : "bg-transparent text-ink-soft border-rule hover:bg-paper-alt"
          }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
