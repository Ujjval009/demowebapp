import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RESTOCK_AMOUNT, rawMaterials } from '../../data/inventory';
import { ProgressBar } from '../ui/ProgressBar';
import { Pill } from '../ui/Pill';

export function InventoryView() {
  const { pushToast } = useApp();
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries(rawMaterials.map((m) => [m.id, m.stock])),
  );
  const [restocked, setRestocked] = useState<Record<string, boolean>>({});

  const statusOf = (stockQty: number, reorderLevel: number): { pill: 'green' | 'amber' | 'red'; label: string; tone: 'green' | 'amber' | 'red' } => {
    if (stockQty <= reorderLevel * 0.5) return { pill: 'red', label: 'Reorder', tone: 'red' };
    if (stockQty < reorderLevel) return { pill: 'amber', label: 'Low', tone: 'amber' };
    return { pill: 'green', label: 'Healthy', tone: 'green' };
  };

  const reorder = (id: string, name: string) => {
    const amount = RESTOCK_AMOUNT[id];
    setStock((prev) => ({ ...prev, [id]: prev[id] + amount }));
    setRestocked((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => setRestocked((prev) => ({ ...prev, [id]: false })), 2000);
    pushToast(`${name} restocked (+${amount}) — inventory updated.`, 'success');
  };

  return (
    <div className="panel">
      <h3>Raw Materials</h3>
      <div className="desc">Stock across the Anna Nagar central kitchen · tap Reorder to restock</div>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th style={{ width: '24%' }}>Stock vs Level</th>
            <th>Stock</th>
            <th>Reorder Level</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rawMaterials.map((m) => {
            const qty = stock[m.id];
            const status = statusOf(qty, m.reorderLevel);
            return (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>
                  <ProgressBar value={qty} max={m.reorderLevel * 1.5} tone={status.tone} />
                </td>
                <td>
                  {qty} {m.unit}
                </td>
                <td>
                  {m.reorderLevel} {m.unit}
                </td>
                <td>
                  <Pill tone={status.pill}>{status.label}</Pill>
                </td>
                <td>
                  <button
                    type="button"
                    className={`btn${status.pill === 'red' ? ' btn-caramel' : ''}`}
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => reorder(m.id, m.name)}
                  >
                    {restocked[m.id] ? '✓ Restocked' : 'Reorder'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}