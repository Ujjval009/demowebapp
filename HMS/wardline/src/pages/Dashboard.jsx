import { useApp } from "../context/AppContext";
import { StatCard, StatStrip } from "../components/ui/StatCard";
import { rupee } from "../utils/helpers";
import Pill from "../components/ui/Pill";
import Topbar from "../components/layout/Topbar";

export default function Dashboard() {
  const { patients, appointments, meds, invoices } = useApp();
  const active = patients.filter((p) => p.status !== "Discharged").length;
  const critical = patients.filter((p) => p.status === "Critical").length;
  const lowStock = meds.filter((m) => m.stock <= m.threshold).length;
  const todayAppts = appointments.filter((a) => a.day === "Mon");
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Today &mdash; Monday, Sep 8" />

      <StatStrip>
        <StatCard label="Beds occupied" value="142 / 180" />
        <StatCard label="Active patients" value={active} />
        <StatCard label="Revenue today" value={rupee(collected)}>
          <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
            <polyline points="0,32 20,28 40,30 60,18 80,22 100,10 120,14 140,6 160,9" fill="none" stroke="#6F8B6F" strokeWidth="2" />
          </svg>
        </StatCard>
        <StatCard label="Low-stock medications" value={lowStock} danger={lowStock > 0} />
      </StatStrip>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <div className="border border-rule p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2.5">
            Recent admissions
            {critical > 0 && <span className="text-xs bg-brick text-red-50 px-2 py-0.5 rounded-sm font-medium">{critical} critical</span>}
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">ID</th>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Patient</th>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Ward</th>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.filter((p) => p.status !== "Discharged").slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 px-2.5 border-b border-rule font-mono">{p.id}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{p.name}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{p.ward}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-rule p-4">
          <h3 className="text-sm font-semibold mb-3">Today's appointments</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Time</th>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Patient</th>
                <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Department</th>
              </tr>
            </thead>
            <tbody>
              {todayAppts.map((a) => (
                <tr key={a.id}>
                  <td className="py-2.5 px-2.5 border-b border-rule font-mono">{a.time}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{a.patient}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{a.dept}</td>
                </tr>
              ))}
              {todayAppts.length === 0 && (
                <tr><td colSpan="3" className="text-center text-ink-soft py-6 text-xs">No appointments today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
