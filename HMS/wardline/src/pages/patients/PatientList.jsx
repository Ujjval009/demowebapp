import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Tabs from "../../components/ui/Tabs";
import SearchBox from "../../components/ui/SearchBox";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { WARDS } from "../../utils/constants";

export default function PatientList() {
  const { patients, setPatients } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const cycleStatus = (id) => {
    const order = ["Admitted", "Stable", "Critical", "Discharged"];
    setPatients(patients.map((p) =>
      p.id === id ? { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] } : p
    ));
  };

  const filtered = patients.filter((p) => {
    const matchesQ = (p.name + p.id + p.ward + p.doctor).toLowerCase().includes(q.toLowerCase());
    const matchesF = filter === "All" || p.status === filter;
    return matchesQ && matchesF;
  });

  return (
    <div>
      <Topbar
        title="Patients"
        subtitle={`${patients.length} on record`}
        action={<Button onClick={() => setShowAdd(true)}>+ Admit patient</Button>}
      />
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, ID, ward or doctor..." />
        <Tabs tabs={["All", "Admitted", "Stable", "Critical", "Discharged"]} active={filter} onChange={setFilter} />
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["ID", "Name", "Age", "Ward", "Doctor", "Admitted", "Status"].map((h) => (
              <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">
                <Link to={`/patients/${p.id}`} className="text-blue hover:underline">{p.id}</Link>
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <Link to={`/patients/${p.id}`} className="text-blue hover:underline">{p.name}</Link>
              </td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{p.age}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{p.ward}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{p.doctor}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{p.admitted}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                <button className="bg-transparent border-none cursor-pointer p-0" onClick={() => cycleStatus(p.id)}>
                  <Pill status={p.status} />
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" className="text-center text-ink-soft py-8 text-xs">No patients match this search.</td></tr>
          )}
        </tbody>
      </table>
      <p className="text-xs text-ink-soft mt-2.5">Click a status pill to cycle through states.</p>

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onAdd={(p) => { setPatients([p, ...patients]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

function AddPatientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", ward: "General", doctor: "", phone: "", bloodGroup: "O+" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.age) {
      setError("Enter a name and age first.");
      return;
    }
    onAdd({
      id: "P-" + (1054 + Math.floor(Math.random() * 900)),
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone,
      email: "",
      ward: form.ward,
      doctor: form.doctor.trim() || "Unassigned",
      admitted: new Date().toISOString().split("T")[0],
      status: "Admitted",
      bloodGroup: form.bloodGroup,
      diagnosis: "",
      address: "",
    });
  };

  return (
    <Modal onClose={onClose} title="Admit patient">
      <Input label="Full name" placeholder="Patient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <div className="flex gap-4">
        <Input label="Age" type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <Select label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
      </div>
      <div className="flex gap-4">
        <Select label="Ward" options={WARDS} value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
        <Select label="Blood Group" options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]} value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
      </div>
      <Input label="Phone" placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Attending doctor" placeholder="Dr. name" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
      {error && <p className="text-brick text-xs mb-2.5">{error}</p>}
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Admit patient</Button>
      </div>
    </Modal>
  );
}
