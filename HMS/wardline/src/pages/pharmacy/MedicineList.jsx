import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { rupee } from "../../utils/helpers";

export default function MedicineList() {
  const { meds, setMeds } = useApp();
  const [category, setCategory] = useState("All");

  const restock = (name) =>
    setMeds(meds.map((m) => (m.name === name ? { ...m, stock: m.stock + 100 } : m)));

  const lowCount = meds.filter((m) => m.stock <= m.threshold).length;
  const categories = ["All", ...new Set(meds.map((m) => m.category))];
  const filtered = category === "All" ? meds : meds.filter((m) => m.category === category);

  const stockStatus = (m) => {
    if (m.stock <= m.threshold * 0.5) return "Critical stock";
    if (m.stock <= m.threshold) return "Low";
    return "Adequate";
  };

  const totalValue = meds.reduce((s, m) => s + m.stock * m.price, 0);

  return (
    <div>
      <Topbar title="Pharmacy" subtitle="Stock levels across all wards" />

      {lowCount > 0 && (
        <Alert type="warning">
          <strong>{lowCount}</strong> medication{lowCount > 1 ? "s are" : " is"} at or below its reorder threshold.
        </Alert>
      )}

      <div className="flex gap-4 mb-6">
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Total Medications</div>
          <div className="text-xl font-mono font-medium">{meds.length}</div>
        </div>
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Low Stock Items</div>
          <div className="text-xl font-mono font-medium text-amber">{lowCount}</div>
        </div>
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Inventory Value</div>
          <div className="text-xl font-mono font-medium">{rupee(totalValue)}</div>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3.5 py-1.5 text-sm cursor-pointer border rounded-sm transition-colors ${
              category === cat
                ? "bg-ink text-paper border-ink"
                : "bg-transparent text-ink-soft border-rule hover:bg-paper-alt"
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["Medication", "Category", "Stock", "Threshold", "Price/unit", "Status", ""].map((h) => (
              <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.name}>
              <td className="py-2.5 px-2.5 border-b border-rule font-medium">{m.name}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{m.category}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{m.stock} {m.unit}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{m.threshold}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{rupee(m.price)}</td>
              <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={stockStatus(m)} /></td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <button
                  className="text-blue text-xs hover:underline bg-transparent border-none cursor-pointer"
                  onClick={() => restock(m.name)}
                >
                  Restock +100
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
