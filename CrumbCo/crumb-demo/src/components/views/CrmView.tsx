import { useMemo, useState } from 'react';
import { customers, nextTierPoints } from '../../data/analytics';
import { formatINR } from '../../lib/format';
import { Pill } from '../ui/Pill';
import type { CustomerTier } from '../../types';

const TIERS: Array<CustomerTier | 'All'> = ['All', 'Gold', 'Silver', 'Bronze'];

export function CrmView() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<CustomerTier | 'All'>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.tier.toLowerCase().includes(q);
      const matchesTier = tier === 'All' || c.tier === tier;
      return matchesQuery && matchesTier;
    });
  }, [query, tier]);

  const selected = customers.find((c) => c.id === selectedId);

  return (
    <>
      <div className="panel">
        <h3>Loyalty Members</h3>
        <div className="desc">Tier-based points program — search, filter and inspect any customer</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <input
            id="crm-search"
            type="search"
            className="input"
            placeholder="Search by name or tier…"
            style={{ maxWidth: 260 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              className={`btn${tier === t ? ' btn-caramel' : ''}`}
              style={{ padding: '7px 14px', fontSize: 12.5 }}
              onClick={() => setTier(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Tier</th>
              <th>Points</th>
              <th>Total Spend</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '22px 0' }}>
                  No members match your search.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                className={selectedId === c.id ? 'selected' : 'clickable'}
                onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
              >
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>
                  <Pill tone={c.tier === 'Gold' ? 'amber' : c.tier === 'Silver' ? 'green' : 'crust'}>{c.tier}</Pill>
                </td>
                <td>{c.points.toLocaleString('en-IN')}</td>
                <td>{formatINR(c.totalSpend)}</td>
                <td>{c.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="panel" style={{ borderLeft: '4px solid var(--caramel)' }}>
          <h3>{selected.name}</h3>
          <div className="desc">{selected.email} · {selected.phone}</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 4 }}>
            {[
              { label: 'Loyalty Tier', value: selected.tier },
              { label: 'Points', value: selected.points.toLocaleString('en-IN') },
              { label: 'Total Spend', value: formatINR(selected.totalSpend) },
              { label: 'Visits', value: String(selected.visits) },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
            <span style={{ fontWeight: 600, color: 'var(--caramel-deep)' }}>
              {nextTierPoints(selected.tier) - selected.points}
            </span>{' '}
            points to reach the next tier threshold.
          </div>
        </div>
      )}
    </>
  );
}