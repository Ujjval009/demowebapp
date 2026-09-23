import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";

export default function PatientDetail() {
  const { id } = useParams();
  const { patients, appointments, invoices, labTests } = useApp();
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-soft mb-4">Patient not found.</p>
        <Link to="/patients"><Button variant="ghost">Back to Patients</Button></Link>
      </div>
    );
  }

  const patientAppts = appointments.filter((a) => a.patientId === id);
  const patientInvoices = invoices.filter((i) => i.patientId === id);
  const patientLabs = labTests.filter((l) => l.patientId === id);

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <Link to="/patients" className="text-xs text-blue hover:underline">&larr; Back to Patients</Link>
          <h1 className="font-serif text-2xl font-semibold mt-1">{patient.name}</h1>
          <p className="text-ink-soft text-sm">{patient.id} · {patient.age} years · {patient.gender} · {patient.bloodGroup}</p>
        </div>
        <Pill status={patient.status} />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
        <div className="border border-rule p-4">
          <h3 className="text-xs text-ink-soft mb-3 font-semibold uppercase tracking-wide">Admission Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Ward</span><span>{patient.ward}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Doctor</span><span>{patient.doctor}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Admitted</span><span className="font-mono">{patient.admitted}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Diagnosis</span><span>{patient.diagnosis || "—"}</span></div>
          </div>
        </div>
        <div className="border border-rule p-4">
          <h3 className="text-xs text-ink-soft mb-3 font-semibold uppercase tracking-wide">Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Phone</span><span className="font-mono">{patient.phone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Email</span><span>{patient.email || "—"}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Address</span><span className="text-right max-w-[200px]">{patient.address || "—"}</span></div>
          </div>
        </div>
        <div className="border border-rule p-4">
          <h3 className="text-xs text-ink-soft mb-3 font-semibold uppercase tracking-wide">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Appointments</span><span className="font-mono">{patientAppts.length}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Invoices</span><span className="font-mono">{patientInvoices.length}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Lab Tests</span><span className="font-mono">{patientLabs.length}</span></div>
          </div>
        </div>
      </div>

      {patientAppts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3">Appointment History</h3>
          <table className="w-full border-collapse text-sm">
            <thead><tr>{["Date", "Time", "Doctor", "Department", "Reason", "Status"].map((h) => <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>)}</tr></thead>
            <tbody>
              {patientAppts.map((a) => (
                <tr key={a.id}>
                  <td className="py-2.5 px-2.5 border-b border-rule font-mono">{a.date}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule font-mono">{a.time}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{a.doctor}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{a.dept}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule">{a.reason}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {patientLabs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3">Lab Results</h3>
          <table className="w-full border-collapse text-sm">
            <thead><tr>{["Test", "Date", "Priority", "Status"].map((h) => <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>)}</tr></thead>
            <tbody>
              {patientLabs.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5 px-2.5 border-b border-rule">{l.test}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule font-mono">{l.date}</td>
                  <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={l.priority === "Urgent" ? "Critical" : "Stable"} /></td>
                  <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={l.status === "Completed" ? "Completed" : l.status === "In Progress" ? "Pending" : "Scheduled"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
