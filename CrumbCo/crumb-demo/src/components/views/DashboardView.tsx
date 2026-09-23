import { useApp } from '../../context/AppContext';
import { StatCounter } from '../ui/StatCounter';
import { formatINR } from '../../lib/format';
import type { ModuleCard } from '../../types';

const MODULE_CARDS: ModuleCard[] = [
  { key: 'pos', icon: '✎', title: 'POS & Billing', desc: 'Quick-add product buttons, GST billing, multi-payment, offline-first.', tone: 1 },
  { key: 'inventory', icon: '▣', title: 'Inventory & Baking', desc: 'Raw materials, recipes, production batches, inter-branch transfers.', tone: 2 },
  { key: 'expiry', icon: '◷', title: 'Expiry & Cold Storage', desc: 'FEFO tracking, traffic-light alerts, auto-markdown pricing.', tone: 3 },
  { key: 'analytics', icon: '▤', title: 'Sales Analytics', desc: 'Best-sellers, branch comparison, demand forecasting.', tone: 4 },
  { key: 'crm', icon: '♥', title: 'CRM & Loyalty', desc: 'Customer profiles, tiered points, purchase history.', tone: 5 },
  { key: 'franchise', icon: '▦', title: 'Franchise Mgmt', desc: 'Branch scorecards, royalty tracking, document vault.', tone: 6 },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardView() {
  const { role, branch, setView } = useApp();

  return (
    <>
      <section className="hero">
        <span className="hero-loaf" aria-hidden="true">🥐</span>
        <span className="badge">{role}</span>
        <h2>{greeting()}, Crumb & Co.</h2>
<div className="sub">
          Complete overview of all 5 branches across Coimbatore
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">
              <StatCounter value={84320} format={formatINR} />
            </div>
            <div className="lbl">TODAY'S REVENUE</div>
          </div>
          <div className="hero-stat">
            <div className="num">
              <StatCounter value={612} format={(n) => String(n)} />
            </div>
            <div className="lbl">BILLS TODAY</div>
          </div>
          <div className="hero-stat">
            <div className="num">4/5</div>
            <div className="lbl">ACTIVE BRANCHES</div>
          </div>
          <div className="hero-stat">
            <div className="num">
              <StatCounter value={238} format={(n) => String(n)} />
            </div>
            <div className="lbl">LOYALTY MEMBERS</div>
          </div>
        </div>
      </section>

      <div className="section-label">
        <h3>Your Modules</h3>
        <span className="count">6 modules accessible · showing {branch}</span>
      </div>
      <div className="grid">
        {MODULE_CARDS.map((m, i) => (
          <div
            key={m.key}
            className="card"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => setView(m.key)}
          >
            <div className={`ic-tile tone-${m.tone}`}>{m.icon}</div>
            <h4>{m.title}</h4>
            <p>{m.desc}</p>
            <div className="go">Open →</div>
          </div>
        ))}
      </div>
    </>
  );
}