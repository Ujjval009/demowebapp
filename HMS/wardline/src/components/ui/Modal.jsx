export default function Modal({ children, onClose, title, wide }) {
  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-paper border border-rule p-6 ${wide ? "w-[560px]" : "w-[420px]"} max-w-[90vw] max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-serif text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-ink-soft hover:text-ink p-1 cursor-pointer bg-transparent border-none text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
