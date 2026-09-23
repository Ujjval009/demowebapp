import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { rupee } from "../../utils/helpers";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";

export default function InvoiceDetail() {
  const { id } = useParams();
  const { invoices, setInvoices } = useApp();
  const invoice = invoices.find((i) => i.id === id);

  if (!invoice) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-soft mb-4">Invoice not found.</p>
        <Link to="/billing"><Button variant="ghost">Back to Billing</Button></Link>
      </div>
    );
  }

  const markPaid = () => {
    setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: "Paid" } : i)));
  };

  return (
    <div>
      <Link to="/billing" className="text-xs text-blue hover:underline">&larr; Back to Billing</Link>

      <div className="flex justify-between items-end mt-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold">{invoice.id}</h1>
          <p className="text-ink-soft text-sm">Issued {invoice.date}</p>
        </div>
        <div className="flex items-center gap-4">
          <Pill status={invoice.status} />
          {invoice.status !== "Paid" && <Button onClick={markPaid}>Mark as Paid</Button>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 max-md:grid-cols-1">
        <div className="border border-rule p-5">
          <h3 className="text-xs text-ink-soft mb-3 font-semibold uppercase tracking-wide">Patient Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Patient</span><Link to={`/patients/${invoice.patientId}`} className="text-blue">{invoice.patient}</Link></div>
            <div className="flex justify-between"><span className="text-ink-soft">Doctor</span><span>{invoice.doctor}</span></div>
          </div>
        </div>
        <div className="border border-rule p-5">
          <h3 className="text-xs text-ink-soft mb-3 font-semibold uppercase tracking-wide">Amount</h3>
          <div className="text-3xl font-mono font-medium">{rupee(invoice.amount)}</div>
        </div>
      </div>

      <div className="border border-rule p-5">
        <h3 className="text-sm font-semibold mb-3">Line Items</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">#</th>
              <th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Description</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 px-2.5 border-b border-rule font-mono text-ink-soft">{i + 1}</td>
                <td className="py-2.5 px-2.5 border-b border-rule">{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
