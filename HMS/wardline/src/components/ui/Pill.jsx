import { STATUS_COLORS } from "../../utils/constants";

export default function Pill({ status }) {
  const color = STATUS_COLORS[status] || "grey";
  const colorMap = {
    sage: "bg-green-50 text-green-800 border-green-200",
    brick: "bg-red-50 text-red-800 border-red-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    grey: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[color]}`}>
      {status}
    </span>
  );
}
