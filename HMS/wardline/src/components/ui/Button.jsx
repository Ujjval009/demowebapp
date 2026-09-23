export function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center gap-1.5 cursor-pointer border font-medium transition-colors";
  const variants = {
    primary: "bg-blue text-paper border-blue hover:bg-blue-deep",
    ghost: "bg-transparent text-ink border-ink hover:bg-paper-alt",
    danger: "bg-brick text-white border-brick hover:bg-red-700",
    subtle: "bg-transparent text-blue border-transparent hover:underline",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
