import { useState } from 'react';
import { branches } from '../../data/branches';
import { formatINR, formatINRCompact, percentOf } from '../../lib/format';
import { Pill } from '../ui/Pill';

export function FranchiseView() {
  const [selectedId, setSelectedId] = useState<string>(branches[0].id);
  const selected = branches.find((b) => b.id === selectedId) ?? branches[0];

  return (
    <>
      <div className="panel">
        <h3>Branch Scorecards</h3>
        <div className="desc">Select a branch to view its franchise scorecard</div>
        <table>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Revenue (MTD)</th>
              <th>Royalty Due</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr
                key={b.id}
                className={selectedId === b.id ? 'selected' : 'clickable'}
                onClick={() => setSelectedId(b.id)}
              >
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td>{formatINR(b.revenueMtd)}</td>
                <td>{formatINR(b.royalty)}</td>
                <td>
                  <Pill tone={b.compliance === 'Up to date' ? 'green' : 'amber'}>{b.compliance}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel" style={{ borderLeft: '4px solid var(--caramel)' }}>
        <h3>{selected.name} — Scorecard</h3>
        <div className="desc">Franchise health snapshot</div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 18 }}>
          {[
            { label: 'Revenue (MTD)', value: formatINR(selected.revenueMtd) },
            { label: 'Royalty Due (5%)', value: formatINR(selected.royalty) },
            { label: 'Target Pace', value: `${percentOf(selected.revenueMtd, 560000)}%` },
            { label: 'Compliance', value: selected.compliance },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 90 }}>
          {[62, 71, 55, 78, 84, 73, 90].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: i === 6 ? 'var(--caramel)' : 'var(--caramel-light)',
                borderRadius: '6px 6px 0 0',
                transition: 'height .4s var(--ease)',
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>
          Weekly revenue trend · {formatINRCompact(selected.revenueMtd)} MTD
        </div>
        {selected.compliance === 'Audit due' && (
          <div className="pill amber" style={{ marginTop: 14 }}>
            ⚠ Quarterly audit is due for this location — flagged for the franchise owner.
          </div>
        )}
      </div>
    </>
  );
}