import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from "../../utils/constants";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    reason: "",
  });
  const [error, setError] = useState("");

  const filteredDoctors = form.department
    ? DOCTORS.filter((d) => d.dept === form.department || form.department === "General Medicine")
    : [];

  const availableSlots = form.date && form.doctor
    ? TIME_SLOTS.filter((s) => !["11:00", "14:30"].includes(s))
    : [];

  const handleNext = () => {
    if (step === 1 && !form.department) {
      setError("Please select a department.");
      return;
    }
    if (step === 2 && !form.doctor) {
      setError("Please select a doctor.");
      return;
    }
    if (step === 3 && (!form.date || !form.time)) {
      setError("Please select a date and time.");
      return;
    }
    if (step === 4 && (!form.name || !form.phone)) {
      setError("Please fill in your name and phone number.");
      return;
    }
    setError("");
    if (step < 4) setStep(step + 1);
    else {
      navigate("/booking-success");
    }
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <h1 className="font-serif text-3xl font-semibold mb-2">Book an Appointment</h1>
      <p className="text-ink-soft mb-8">Schedule a visit with our specialists. No login required.</p>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
              s < step ? "bg-sage text-white border-sage" :
              s === step ? "bg-blue text-paper border-blue" :
              "bg-transparent text-ink-soft border-rule"
            }`}>
              {s < step ? "\u2713" : s}
            </div>
            {s < 4 && <div className={`w-12 h-[2px] ${s < step ? "bg-sage" : "bg-rule"}`} />}
          </div>
        ))}
      </div>
      <div className="text-xs text-ink-soft mb-6">
        {["Select Department", "Choose Doctor", "Pick Date & Time", "Your Details"][step - 1]}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              className={`p-4 border text-left text-sm cursor-pointer transition-colors ${
                form.department === dept
                  ? "border-blue bg-blue-5 text-blue font-medium"
                  : "border-rule hover:border-ink"
              }`}
              onClick={() => setForm({ ...form, department: dept, doctor: "" })}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          {filteredDoctors.length === 0 ? (
            <p className="text-ink-soft text-sm">No doctors available for this department.</p>
          ) : (
            filteredDoctors.map((doc) => (
              <button
                key={doc.id}
                className={`w-full p-4 border text-left cursor-pointer transition-colors ${
                  form.doctor === doc.name
                    ? "border-blue bg-blue-5"
                    : "border-rule hover:border-ink"
                }`}
                onClick={() => setForm({ ...form, doctor: doc.name })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{doc.qualification}</p>
                    <p className="text-xs text-ink-soft">{doc.experience} years experience · {doc.dept}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium font-mono">{'\u20B9'}{doc.fees}</p>
                    <p className="text-xs text-sage">{doc.availability.join(", ")}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <Input label="Preferred Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          {form.date && (
            <div>
              <label className="text-xs text-ink-soft mb-2 block">Available Time Slots</label>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`py-2 px-3 border text-sm font-mono cursor-pointer transition-colors ${
                      form.time === slot
                        ? "border-blue bg-blue text-paper"
                        : "border-rule hover:border-ink"
                    }`}
                    onClick={() => setForm({ ...form, time: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-1">
          <Input label="Full Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone Number" placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email (optional)" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Reason for visit" placeholder="e.g., Annual checkup, Back pain..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </div>
      )}

      {error && <p className="text-brick text-xs mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => { setStep(step - 1); setError(""); }}>Back</Button>
        ) : <div />}
        <Button onClick={handleNext}>
          {step === 4 ? "Confirm Booking" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
