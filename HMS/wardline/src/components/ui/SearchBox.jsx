export default function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 border-b border-ink py-1.5 px-1 text-ink-soft min-w-[240px]">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M20 20 15 15" strokeLinecap="round" />
      </svg>
      <input
        className="border-none bg-transparent outline-none flex-1 text-sm text-ink"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
