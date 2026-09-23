import { useParams, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/Button";
import { Star, Phone, Mail } from "lucide-react";

export default function DoctorProfile() {
  const { id } = useParams();
  const { doctors, patients, appointments } = useApp();
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-soft mb-4">Doctor not found.</p>
        <Link to="/doctors"><Button variant="ghost">Back to Doctors</Button></Link>
      </div>
    );
  }

  const doctorPatients = patients.filter((p) => p.doctor === doctor.name);
  const doctorAppts = appointments.filter((a) => a.doctorId === id);

  return (
    <div>
      <Link to="/doctors" className="text-xs text-blue hover:underline">&larr; Back to Doctors</Link>

      <div className="flex items-start gap-6 mt-4 mb-8">
        <div className="w-20 h-20 bg-blue-deep text-paper rounded-full flex items-center justify-center font-serif text-3xl font-semibold flex-shrink-0">
          {doctor.name.split(" ").slice(-1)[0][0]}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold">{doctor.name}</h1>
          <p className="text-ink-soft text-sm">{doctor.dept} · {doctor.qualification}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><Star size={14} className="text-amber fill-amber" /> {doctor.rating}</span>
            <span className="flex items-center gap-1 text-ink-soft"><Phone size={14} /> {doctor.phone}</span>
            <span className="flex items-center gap-1 text-ink-soft"><Mail size={14} /> {doctor.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8 max-md:grid-cols-2">
        {[
          { label: "Experience", value: `${doctor.experience} years` },
          { label: "Consultation Fee", value: `\u20B9${doctor.fees}` },
          { label: "Active Patients", value: doctorPatients.length },
          { label: "Schedule", value: doctor.schedule },
        ].map(({ label, value }) => (
          <div key={label} className="border border-rule p-4">
            <div className="text-xs text-ink-soft mb-1">{label}</div>
            <div className="text-sm font-medium font-mono">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <div className="border border-rule p-4">
          <h3 className="text-sm font-semibold mb-3">Assigned Patients</h3>
          {doctorPatients.length === 0 ? (
            <p className="text-xs text-ink-soft py-4 text-center">No patients assigned</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead><tr><th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">ID</th><th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Name</th><th className="text-left py-2 px-2.5 border-b-2 border-ink font-semibold text-xs">Ward</th></tr></thead>
              <tbody>
                {doctorPatients.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-2.5 border-b border-rule font-mono">{p.id}</td>
                    <td className="py-2.5 px-2.5 border-b border-rule">{p.name}</td>
                    <td className="py-2.5 px-2.5 border-b border-rule">{p.ward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border border-rule p-4">
          <h3 className="text-sm font-semibold mb-3">Availability</h3>
          <div className="grid grid-cols-6 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={`text-center py-2 text-xs rounded-sm ${
                  doctor.availability.includes(day)
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
