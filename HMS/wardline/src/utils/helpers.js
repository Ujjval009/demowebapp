export const rupee = (n) => "\u20B9" + n.toLocaleString("en-IN");

export const generateId = (prefix = "ID") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}`;

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

export const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${hr12}:${m} ${ampm}`;
};
