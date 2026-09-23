import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Tabs from "../../components/ui/Tabs";
import Pill from "../../components/ui/Pill";
import { StatCard, StatStrip } from "../../components/ui/StatCard";
import { rupee } from "../../utils/helpers";

export default function InvoiceList() {
  const { invoices, setInvoices } = useApp();
  const [filter, setFilter] = useState("All");

  const markPaid = (id) => setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: "Paid" } : i)));
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const filtered = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <div>
      <Topbar title="Billing" subtitle={`${invoices.length} invoices on record`} />

      <StatStrip>
        <StatCard label="Collected" value={rupee(collected)} />
        <StatCard label="Outstanding" value={rupee(outstanding)} danger={outstanding > 0} />
        <StatCard label="Invoices overdue" value={invoices.filter((i) => i.status === "Overdue").length} danger={invoices.filter((i) => i.status === "Overdue").length > 0} />
      </StatStrip>

      <Tabs tabs={["All", "Paid", "Pending", "Overdue"]} active={filter} onChange={setFilter} />

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["Invoice", "Patient", "Date", "Amount", "Status", ""].map((h) => (
              <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((i) => (
            <tr key={i.id}>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">
                <Link to={`/billing/${i.id}`} className="text-blue hover:underline">{i.id}</Link>
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <Link to={`/patients/${i.patientId}`} className="text-blue hover:underline">{i.patient}</Link>
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{i.date}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{rupee(i.amount)}</td>
              <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={i.status} /></td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                {i.status !== "Paid" && (
                  <button className="text-blue text-xs hover:underline bg-transparent border-none cursor-pointer" onClick={() => markPaid(i.id)}>Mark paid</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
