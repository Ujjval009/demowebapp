import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Tabs from "../../components/ui/Tabs";
import Pill from "../../components/ui/Pill";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { DAYS_OF_WEEK, TIME_SLOTS, DOCTORS, DEPARTMENTS } from "../../utils/constants";

export default function AppointmentList() {
  const { appointments, setAppointments } = useApp();
  const [day, setDay] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const days = ["All", ...DAYS_OF_WEEK];

  const cancel = (id) =>
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)));

  const complete = (id) =>
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "Completed" } : a)));

  const filtered = (day === "All" ? appointments : appointments.filter((a) => a.day === day))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <Topbar
        title="Appointments"
        subtitle="Shared schedule across departments"
        action={<Button onClick={() => setShowAdd(true)}>+ Book appointment</Button>}
      />
      <Tabs tabs={days} active={day} onChange={setDay} />
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["Day", "Time", "Patient", "Doctor", "Department", "Status", ""].map((h) => (
              <th key={h} className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id}>
              <td className="py-2.5 px-2.5 border-b border-rule">{a.day}</td>
              <td className="py-2.5 px-2.5 border-b border-rule font-mono">{a.time}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{a.patient}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{a.doctor}</td>
              <td className="py-2.5 px-2.5 border-b border-rule">{a.dept}</td>
              <td className="py-2.5 px-2.5 border-b border-rule"><Pill status={a.status} /></td>
              <td className="py-2.5 px-2.5 border-b border-rule">
                {a.status === "Scheduled" && (
                  <div className="flex gap-2">
                    <button className="text-blue text-xs hover:underline bg-transparent border-none cursor-pointer" onClick={() => complete(a.id)}>Complete</button>
                    <button className="text-brick text-xs hover:underline bg-transparent border-none cursor-pointer" onClick={() => cancel(a.id)}>Cancel</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" className="text-center text-ink-soft py-8 text-xs">No appointments for this day.</td></tr>
          )}
        </tbody>
      </table>

      {showAdd && (
        <AddAppointmentModal
          onClose={() => setShowAdd(false)}
          onAdd={(a) => { setAppointments([...appointments, a]); setShowAdd(false); }}
        />
      )}
    </div>
  );
}

function AddAppointmentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ time: "", patient: "", doctor: "", dept: "", day: "Mon", date: "", reason: "" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.time || !form.patient.trim()) {
      setError("Enter a time and patient name first.");
      return;
    }
    onAdd({ id: `A-${Date.now().toString(36).toUpperCase()}`, ...form, patientId: "", doctorId: "", status: "Scheduled" });
  };

  return (
    <Modal onClose={onClose} title="Book appointment">
      <div className="flex gap-4">
        <Select label="Day" options={DAYS_OF_WEEK} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
        <Select label="Time" options={["", ...TIME_SLOTS]} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
      </div>
      <Input label="Patient name" placeholder="Patient name" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
      <div className="flex gap-4">
        <Select label="Doctor" options={["", ...DOCTORS.map((d) => d.name)]} value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
        <Select label="Department" options={["", ...DEPARTMENTS]} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
      </div>
      <Input label="Reason" placeholder="Reason for visit" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
      {error && <p className="text-brick text-xs mb-2.5">{error}</p>}
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Book appointment</Button>
      </div>
    </Modal>
  );
}
