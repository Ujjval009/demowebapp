import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { hoursLabel, initialBatches } from '../../data/expiry';
import { Pill } from '../ui/Pill';

export function ExpiryView() {
  const { pushToast } = useApp();
  const [batches, setBatches] = useState(initialBatches);
  const [selected, setSelected] = useState<string | null>(null);

  const sorted = [...batches].sort((a, b) => a.expiresInHrs - b.expiresInHrs);

  const markdown = (id: string, product: string) => {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, markedDown: true } : b)));
    pushToast(`${product} marked down 30% — sold at discounted shelf price.`, 'info');
  };

  const statusPill = (b: (typeof batches)[number]) => {
    if (b.markedDown) return <Pill tone="crust">Marked ↓30%</Pill>;
    if (b.expiresInHrs <= 12) return <Pill tone="red">Expiring</Pill>;
    if (b.expiresInHrs <= 26) return <Pill tone="amber">Watch</Pill>;
    return <Pill tone="green">Fresh</Pill>;
  };

  return (
    <>
      <div className="panel">
        <h3>Batch Expiry Tracker</h3>
        <div className="desc">
          Sorted first-expire-first-out (FEFO) · rows with fewer than 12 hours flash red for auto-markdown.
        </div>
        <table>
          <thead>
            <tr>
              <th>Batch</th>
              <th>Branch</th>
              <th>Baked</th>
              <th>Expires In</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((b) => (
              <tr
                key={b.id}
                className={selected === b.id ? 'selected' : 'clickable'}
                onClick={() => setSelected(b.id === selected ? null : b.id)}
                title={selected === b.id ? 'Selected' : 'Click to select'}
              >
                <td style={{ fontWeight: 600 }}>{b.product}</td>
                <td>{b.branch}</td>
                <td>{b.baked}</td>
                <td>{hoursLabel(b.expiresInHrs)}</td>
                <td>{statusPill(b)}</td>
                <td>
                  {!b.markedDown && b.expiresInHrs <= 26 && (
                    <button
                      type="button"
                      className="markdown-btn btn btn-caramel"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        markdown(b.id, b.product);
                      }}
                    >
                      Markdown 20%
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="panel" style={{ borderLeft: '4px solid var(--caramel)' }}>
          <h3>Batch Detail</h3>
          {(() => {
            const b = batches.find((x) => x.id === selected);
            if (!b) return null;
            return (
              <div style={{ fontSize: 13.5 }}>
                <p>
                  <strong>{b.product}</strong> · baked {b.baked} at {b.branch}. Shelf life remaining:{' '}
                  <strong>{hoursLabel(b.expiresInHrs)}</strong>.
                </p>
                <p style={{ color: 'var(--muted)', marginTop: 8 }}>
                  {b.expiresInHrs <= 12
                    ? '⚠ This batch is inside the markdown window — apply a discount before close to avoid wastage.'
                    : 'This batch is within normal freshness. Continue FEFO rotation.'}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}