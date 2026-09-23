import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { bestSellers, branchSales, revenueByDay } from '../../data/analytics';
import { branches } from '../../data/branches';
import { formatINR, formatINRCompact } from '../../lib/format';
import { ProgressBar } from '../ui/ProgressBar';

export function AnalyticsView() {
  const { branch } = useApp();

  const totalRevenue = useMemo(() => revenueByDay.reduce((s, d) => s + d.revenue, 0), []);
  const totalOrders = useMemo(() => revenueByDay.reduce((s, d) => s + d.orders, 0), []);

  const branchData = useMemo(() => {
    if (branch === 'All Branches') return branchSales;
    return branchSales.filter((b) => b.branch === branch);
  }, [branch]);

  const storeNames = branch === 'All Branches' ? branches.map((b) => b.name) : [branch];

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        {[
          { label: '7-DAY REVENUE', value: formatINR(totalRevenue), hint: 'all branches' },
          { label: 'ORDERS (7D)', value: String(totalOrders), hint: 'across stores' },
          { label: 'FORE CAST WINDOW', value: '₹1,12,500', hint: 'next 7 days' },
        ].map((kpi) => (
          <div key={kpi.label} className="card" style={{ cursor: 'default' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>{kpi.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: '6px 0 2px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{kpi.hint}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>Revenue — Last 7 Days</h3>
        <div className="desc">Showing {branch} · hover the chart for exact figures</div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c97b2e" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#c97b2e" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7dcc9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8a7a6b' }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => formatINRCompact(Number(v))}
                tick={{ fontSize: 12, fill: '#8a7a6b' }}
                axisLine={false}
                tickLine={false}
                width={58}
              />
              <Tooltip formatter={(value) => formatINR(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c97b2e"
                strokeWidth={2.5}
                fill="url(#rev)"
                name="Revenue"
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
        <div className="panel">
          <h3>Branch Comparison</h3>
          <div className="desc">Revenue vs monthly target (MTD)</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7dcc9" vertical={false} />
                <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#8a7a6b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => formatINRCompact(Number(v))}
                  tick={{ fontSize: 12, fill: '#8a7a6b' }}
                  axisLine={false}
                  tickLine={false}
                  width={58}
                />
                <Tooltip formatter={(value) => formatINR(Number(value))} />
                <Legend />
                <Bar dataKey="revenue" fill="#c97b2e" radius={[6, 6, 0, 0]} name="Revenue" animationDuration={700} />
                <Bar dataKey="target" fill="#f0d5a8" radius={[6, 6, 0, 0]} name="Target" animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3>Best Sellers This Week</h3>
          <div className="desc">Top products by revenue</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((p, i) => (
                <tr key={p.product}>
                  <td>
                    <span style={{ color: 'var(--muted)', marginRight: 8 }}>#{i + 1}</span>
                    {p.product}
                  </td>
                  <td>{p.units}</td>
                  <td style={{ fontWeight: 600 }}>{formatINR(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>Focus stores: {storeNames.join(', ')}</div>
        </div>
      </div>

      <div className="panel">
        <h3>Branch Performance</h3>
        <div className="desc">Revenue pacing against monthly target</div>
        <table>
          <thead>
            <tr>
              <th>Branch</th>
              <th style={{ width: '34%' }}>Target Pace</th>
              <th>Revenue (MTD)</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {branchData.map((b) => (
              <tr key={b.branch}>
                <td style={{ fontWeight: 600 }}>{b.branch}</td>
                <td>
                  <ProgressBar value={b.revenue} max={b.target} />
                </td>
                <td>{formatINR(b.revenue)}</td>
                <td>{formatINR(b.target)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}