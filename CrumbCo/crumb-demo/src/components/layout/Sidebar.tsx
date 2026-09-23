import { useApp } from '../../context/AppContext';
import type { NavItem, ViewKey } from '../../types';

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '◆' },
];

const MODULES: NavItem[] = [
  { key: 'pos', label: 'POS & Billing', icon: '✎' },
  { key: 'inventory', label: 'Inventory & Baking', icon: '▣' },
  { key: 'expiry', label: 'Expiry & Cold Storage', icon: '◷', badge: 4 },
  { key: 'analytics', label: 'Sales Analytics', icon: '▤' },
  { key: 'crm', label: 'CRM & Loyalty', icon: '♥' },
  { key: 'franchise', label: 'Franchise Mgmt', icon: '▦' },
];

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: (v: ViewKey) => void }) {
  return (
    <button
      type="button"
      className={`nav-item${active ? ' active' : ''}`}
      data-view={item.key}
      onClick={() => onClick(item.key)}
    >
      <span className="ic">{item.icon}</span>
      <span className="label">{item.label}</span>
      {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
    </button>
  );
}

export function Sidebar() {
  const { view, setView } = useApp();
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="mark">🥖</span>
        <span className="name">Crumb & Co.</span>
      </div>
      <div className="tagline">Franchise Ops — Demo</div>

      <div className="nav-group-label">Main</div>
      {NAV.map((item) => (
        <NavButton key={item.key} item={item} active={view === item.key} onClick={setView} />
      ))}

      <div className="nav-group-label">Modules</div>
      {MODULES.map((item) => (
        <NavButton key={item.key} item={item} active={view === item.key} onClick={setView} />
      ))}

      <div className="sidebar-footer">Demo mode — sample data, nothing is processed for real.</div>
    </aside>
  );
}