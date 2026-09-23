export default function Alert({ type = "warning", children }) {
  const styles = {
    warning: "bg-amber-50 text-amber-800 border-amber",
    error: "bg-red-50 text-red-800 border-brick",
    success: "bg-green-50 text-green-800 border-sage",
    info: "bg-blue-50 text-blue-800 border-blue",
  };
  return (
    <div className={`border px-4 py-3 text-sm mb-5 ${styles[type]}`}>
      {children}
    </div>
  );
}
