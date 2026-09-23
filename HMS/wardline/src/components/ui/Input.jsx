export function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 mb-3.5 flex-1 ${className}`}>
      {label && <label className="text-xs text-ink-soft">{label}</label>}
      <input
        className="border-0 border-b border-rule bg-transparent py-2 px-0.5 text-sm text-ink outline-none focus:border-blue transition-colors"
        {...props}
      />
      {error && <p className="text-brick text-xs mt-0">{error}</p>}
    </div>
  );
}

export function Select({ label, options, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 mb-3.5 flex-1 ${className}`}>
      {label && <label className="text-xs text-ink-soft">{label}</label>}
      <select
        className="border-0 border-b border-rule bg-transparent py-2 px-0.5 text-sm text-ink outline-none focus:border-blue transition-colors cursor-pointer"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
