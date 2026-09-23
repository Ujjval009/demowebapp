import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Topbar from "../../components/layout/Topbar";
import Tabs from "../../components/ui/Tabs";
import SearchBox from "../../components/ui/SearchBox";
import { Star } from "lucide-react";

export default function DoctorList() {
  const { doctors } = useApp();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");

  const departments = ["All", ...new Set(doctors.map((d) => d.dept))];
  const filtered = doctors.filter((d) => {
    const matchesQ = (d.name + d.id + d.dept + d.qualification).toLowerCase().includes(q.toLowerCase());
    const matchesD = dept === "All" || d.dept === dept;
    return matchesQ && matchesD;
  });

  return (
    <div>
      <Topbar title="Doctors" subtitle={`${doctors.length} doctors on staff`} />
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, department..." />
        <Tabs tabs={departments} active={dept} onChange={setDept} />
      </div>
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
        {filtered.map((doc) => (
          <Link
            key={doc.id}
            to={`/doctors/${doc.id}`}
            className="border border-rule p-4 hover:border-blue transition-colors no-underline text-ink block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-blue-deep text-paper rounded-full flex items-center justify-center font-serif text-lg font-semibold">
                {doc.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="text-amber fill-amber" />
                <span className="font-mono">{doc.rating}</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-0.5">{doc.name}</h3>
            <p className="text-xs text-ink-soft mb-2">{doc.dept} · {doc.qualification}</p>
            <div className="flex justify-between text-xs text-ink-soft">
              <span>{doc.experience} yrs exp</span>
              <span>{doc.patients} patients</span>
            </div>
            <div className="mt-2 text-xs text-sage">{doc.availability.join(" · ")}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
