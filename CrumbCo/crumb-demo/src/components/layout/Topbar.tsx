import { useApp } from '../../context/AppContext';
import { branchNames } from '../../data/branches';

export function Topbar() {
  const { view, setView, branch, setBranch, role, setRole, tourActive, setTourActive } = useApp();

  const titles: Record<string, [string, string]> = {
    dashboard: ['Dashboard', "Every branch, one oven's view"],
    pos: ['POS & Billing', 'Quick-add billing with offline-first support'],
    inventory: ['Inventory & Baking', 'Raw materials, recipes and production batches'],
    expiry: ['Expiry & Cold Storage', 'FEFO tracking and auto-markdown pricing'],
    analytics: ['Sales Analytics', 'Trends, best-sellers and branch comparison'],
    crm: ['CRM & Loyalty', 'Customer profiles and tiered rewards'],
    franchise: ['Franchise Management', 'Scorecards, royalties and compliance'],
  };

  const [title, sub] = titles[view];

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <div className="sub">{sub}</div>
      </div>
      <div className="picker">
        <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
          <option>Owner</option>
          <option>Manager</option>
        </select>
        <select
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setView('analytics');
          }}
          aria-label="Branch"
        >
          <option>All Branches</option>
          {branchNames.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        {!tourActive && (
          <button className="btn btn-caramel" onClick={() => setTourActive(true)}>
            ▶ Auto-play tour
          </button>
        )}
        <div className="avatar">CC</div>
      </div>
    </div>
  );
}