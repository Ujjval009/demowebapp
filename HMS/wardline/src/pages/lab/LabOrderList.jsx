import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Tabs from "../../components/ui/Tabs";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { LAB_TEST_TYPES, DOCTORS } from "../../utils/constants";

export default function LabOrderList() {
  const { labTests, setLabTests, patients } = useApp();
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const updateStatus = (id, status) => {
    setLabTests(labTests.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const filtered = filter === "All" ? labTests : labTests.filter((l) => l.status === filter);
  const completed = labTests.filter((l) => l.status === "Completed").length;
  const inProgress = labTests.filter((l) => l.status === "In Progress").length;
  const scheduled = labTests.filter((l) => l.status === "Scheduled").length;
  const urgent = labTests.filter((l) => l.priority === "Urgent" && l.status !== "Completed").length;

  return (
    <div>
      <Topbar
        title="Lab Reports"
        subtitle={`${labTests.length} tests on record`}
        action={<Button onClick={() => setShowAdd(true)}>+ Order test</Button>}
      />

      <div className="flex gap-4 mb-6">
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Completed</div>
          <div className="text-xl font-mono font-medium text-sage">{completed}</div>
        </div>
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">In Progress</div>
          <div className="text-xl font-mono font-medium text-blue">{inProgress}</div>
        </div>
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Scheduled</div>
          <div className="text-xl font-mono font-medium">{scheduled}</div>
        </div>
        <div className="border border-rule p-4 flex-1">
          <div className="text-xs text-ink-soft mb-1">Urgent Pending</div>
          <div className="text-xl font-mono font-medium text-brick">{urgent}</div>
        </div>
      </div>

      <Tabs tabs={["All", "Scheduled", "In Progress", "Completed"]} active={filter} onChange={setFilter} />

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["ID", "Patient", "Test", "Doctor", "Date", "Priority", "Status", ""].map((h) => (
              <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l.id}>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{l.id}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{l.patient}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{l.test}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{l.doctor}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{l.date}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <Pill status={l.priority === "Urgent" ? "Critical" : "Stable"} />
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <Pill status={l.status === "Completed" ? "Completed" : l.status === "In Progress" ? "Pending" : "Scheduled"} />
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                {l.status === "Scheduled" && (
                  <button className="text-blue text-xs hover:underline bg-transparent border-none cursor-pointer" onClick={() => updateStatus(l.id, "In Progress")}>
                    Start
                  </button>
                )}
                {l.status === "In Progress" && (
                  <button className="text-sage text-xs hover:underline bg-transparent border-none cursor-pointer" onClick={() => updateStatus(l.id, "Completed")}>
                    Complete
                  </button>
                )}
                {l.status === "Completed" && l.results && (
                  <details className="text-xs">
                    <summary className="text-blue cursor-pointer">View Results</summary>
                    <div className="mt-2 p-3 bg-paper-alt text-xs font-mono whitespace-pre-wrap border border-rule">{l.results}</div>
                  </details>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="8" className="text-center text-ink-soft py-8 text-xs">No tests found.</td></tr>
          )}
        </tbody>
      </table>

      {showAdd && (
        <OrderTestModal
          onClose={() => setShowAdd(false)}
          patients={patients}
          onAdd={(t) => { setLabTests([...labTests, t]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

function OrderTestModal({ onClose, patients, onAdd }) {
  const [form, setForm] = useState({ patient: "", test: "", doctor: "", priority: "Normal" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.patient || !form.test) {
      setError("Select a patient and test type.");
      return;
    }
    const patient = patients.find((p) => p.name === form.patient);
    onAdd({
      id: `LAB-${Date.now().toString(36).toUpperCase().slice(-3).padStart(3, "0")}`,
      patient: form.patient,
      patientId: patient?.id || "",
      test: form.test,
      doctor: form.doctor || "Unassigned",
      date: new Date().toISOString().split("T")[0],
      status: "Scheduled",
      priority: form.priority,
      results: null,
    });
  };

  return (
    <Modal onClose={onClose} title="Order lab test">
      <Select label="Patient" options={["", ...patients.map((p) => p.name)]} value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
      <Select label="Test Type" options={["", ...LAB_TEST_TYPES]} value={form.test} onChange={(e) => setForm({ ...form, test: e.target.value })} />
      <Select label="Ordered by" options={["", ...DOCTORS.map((d) => d.name)]} value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
      <Select label="Priority" options={["Normal", "Urgent"]} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
      {error && <p className="text-brick text-xs mb-2.5">{error}</p>}
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Order Test</Button>
      </div>
    </Modal>
  );
}
