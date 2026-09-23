import { useState } from "react";

/* ---------------- Mock data ---------------- */

const initialPatients = [
  { id: "P-1042", name: "Meera Kulkarni", age: 34, ward: "ICU", doctor: "Dr. Sana Iyer", admitted: "Sep 2", status: "Critical" },
  { id: "P-1043", name: "Rohit Verma", age: 58, ward: "General", doctor: "Dr. Arjun Rao", admitted: "Sep 4", status: "Stable" },
  { id: "P-1044", name: "Priya Nair", age: 29, ward: "Maternity", doctor: "Dr. Leela Menon", admitted: "Sep 5", status: "Stable" },
  { id: "P-1045", name: "Devansh Gupta", age: 7, ward: "Pediatrics", doctor: "Dr. Kabir Shah", admitted: "Sep 6", status: "Stable" },
  { id: "P-1046", name: "Anita Bose", age: 71, ward: "Orthopedics", doctor: "Dr. Arjun Rao", admitted: "Sep 3", status: "Discharged" },
  { id: "P-1047", name: "Farhan Sheikh", age: 45, ward: "ICU", doctor: "Dr. Sana Iyer", admitted: "Sep 7", status: "Critical" },
];

const initialAppointments = [
  { id: 1, time: "09:00", patient: "Meera Kulkarni", doctor: "Dr. Sana Iyer", dept: "ICU rounds", day: "Mon", status: "Completed" },
  { id: 2, time: "10:30", patient: "Rohit Verma", doctor: "Dr. Arjun Rao", dept: "Cardiology", day: "Mon", status: "Completed" },
  { id: 3, time: "11:15", patient: "Priya Nair", doctor: "Dr. Leela Menon", dept: "Obstetrics", day: "Tue", status: "Scheduled" },
  { id: 4, time: "13:00", patient: "Devansh Gupta", doctor: "Dr. Kabir Shah", dept: "Pediatrics", day: "Tue", status: "Scheduled" },
  { id: 5, time: "14:45", patient: "Anita Bose", doctor: "Dr. Arjun Rao", dept: "Orthopedics follow-up", day: "Wed", status: "Cancelled" },
  { id: 6, time: "16:00", patient: "Farhan Sheikh", doctor: "Dr. Sana Iyer", dept: "ICU rounds", day: "Wed", status: "Scheduled" },
];

const initialInvoices = [
  { id: "INV-2091", patient: "Meera Kulkarni", amount: 48250, date: "Sep 2", status: "Overdue" },
  { id: "INV-2092", patient: "Rohit Verma", amount: 12600, date: "Sep 4", status: "Pending" },
  { id: "INV-2093", patient: "Priya Nair", amount: 31500, date: "Sep 5", status: "Paid" },
  { id: "INV-2094", patient: "Devansh Gupta", amount: 4200, date: "Sep 6", status: "Paid" },
  { id: "INV-2095", patient: "Anita Bose", amount: 22800, date: "Sep 3", status: "Pending" },
];

const initialMeds = [
  { name: "Amoxicillin 500mg", category: "Antibiotic", stock: 420, threshold: 150, unit: "capsules" },
  { name: "Paracetamol 650mg", category: "Analgesic", stock: 80, threshold: 200, unit: "tablets" },
  { name: "Insulin glargine", category: "Hormone", stock: 34, threshold: 40, unit: "vials" },
  { name: "Salbutamol inhaler", category: "Respiratory", stock: 56, threshold: 30, unit: "units" },
  { name: "Normal saline 500ml", category: "IV fluid", stock: 210, threshold: 100, unit: "bottles" },
  { name: "Atorvastatin 20mg", category: "Statin", stock: 18, threshold: 50, unit: "tablets" },
];

const rupee = (n) => "\u20B9" + n.toLocaleString("en-IN");

/* ---------------- Icons (small inline line icons) ---------------- */

const I = {
  bed: (p) => <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 18v-7a2 2 0 0 1 2-2h6M3 18h18M21 18v-4a2 2 0 0 0-2-2h-8v6M3 11V6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  cal: (p) => <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" /></svg>,
  receipt: (p) => <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" strokeLinejoin="round" /><path d="M9 8h6M9 12h6M9 16h3" strokeLinecap="round" /></svg>,
  pill: (p) => <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3.5" y="8" width="17" height="8" rx="4" transform="rotate(-30 12 12)" /><path d="M12 8.5 15.5 15.5" strokeLinecap="round" /></svg>,
  grid: (p) => <svg viewBox="0 0 24 24" width={p.s || 18} height={p.s || 18} fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3.5" y="3.5" width="7" height="7" /><rect x="13.5" y="3.5" width="7" height="7" /><rect x="3.5" y="13.5" width="7" height="7" /><rect x="13.5" y="13.5" width="7" height="7" /></svg>,
  search: (p) => <svg viewBox="0 0 24 24" width={p.s || 16} height={p.s || 16} fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20 15 15" strokeLinecap="round" /></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" width={p.s || 16} height={p.s || 16} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width={p.s || 16} height={p.s || 16} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width={p.s || 16} height={p.s || 16} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>,
  exit: (p) => <svg viewBox="0 0 24 24" width={p.s || 16} height={p.s || 16} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" /><path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

/* ---------------- Shared bits ---------------- */

function Pill({ status }) {
  const map = {
    Stable: "sage", Critical: "brick", Discharged: "grey",
    Paid: "sage", Pending: "amber", Overdue: "brick",
    Scheduled: "blue", Completed: "sage", Cancelled: "grey",
    Adequate: "sage", Low: "amber", "Critical stock": "brick",
  };
  return <span className={`pill pill-${map[status] || "grey"}`}>{status}</span>;
}

function Sparkline() {
  return (
    <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
      <polyline points="0,32 20,28 40,30 60,18 80,22 100,10 120,14 140,6 160,9" fill="none" stroke="#6F8B6F" strokeWidth="2" />
    </svg>
  );
}

/* ---------------- Landing page ---------------- */

function LandingPage({ onEnter }) {
  return (
    <div className="hp-landing">
      <header className="nav">
        <div className="brand">
          <span className="brand-mark">+</span>
          <span className="brand-word">Wardline</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="nav-actions">
          <button className="link-btn" onClick={onEnter}>Sign in</button>
          <button className="btn btn-primary" onClick={onEnter}>Start free trial</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge-note">Updated Sep 2026 &mdash; pharmacy module rebuilt</div>
          <h1 className="hp-serif hero-h1">
            One record, from admission<br />to discharge.
          </h1>
          <p className="hero-sub">
            Wardline keeps beds, charts, appointments, billing and pharmacy stock
            in a single ledger, so nothing about a patient's stay lives in two
            places at once.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={onEnter}>
              See it in action <I.arrow s={15} />
            </button>
            <a className="btn btn-ghost" href="#features">View the modules</a>
          </div>
          <div className="hero-notes">
            <span>No setup required for this demo</span>
            <span className="dot-sep" />
            <span>Data resets each session</span>
          </div>
        </div>

        <div className="hero-panel" aria-hidden="true">
          <div className="hp-mono panel-row-lead">
            <span>Heart rate &mdash; Bed 14</span>
            <span className="lead-value">78 <small>bpm</small></span>
          </div>
          <Sparkline />
          <div className="panel-ledger">
            <div className="panel-line">
              <span>Beds occupied</span>
              <span className="hp-mono">142 / 180</span>
            </div>
            <div className="bar"><div className="bar-fill" style={{ width: "79%" }} /></div>
            <div className="panel-line">
              <span>Medication due, next hour</span>
              <span className="hp-mono">26</span>
            </div>
            <div className="bar"><div className="bar-fill amber" style={{ width: "40%" }} /></div>
            <div className="panel-line">
              <span>Discharges today</span>
              <span className="hp-mono">9</span>
            </div>
            <div className="bar"><div className="bar-fill" style={{ width: "22%" }} /></div>
          </div>
        </div>
      </section>

      <section className="trusted">
        <span className="trusted-label">Used across departments at</span>
        <div className="trusted-row">
          <span>Apex Heart Center</span><span className="rule-sep" />
          <span>City General</span><span className="rule-sep" />
          <span>MediCare Plus</span><span className="rule-sep" />
          <span>HealthFirst Clinic</span><span className="rule-sep" />
          <span>OrthoCare</span>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="hp-serif section-h">What's on the ledger</h2>
        <div className="feature-row">
          <div className="feature-icon"><I.bed /></div>
          <div>
            <h3>Bed and ward tracking</h3>
            <p>See every admission, transfer and discharge as it happens, organised by ward instead of buried in a chart list.</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-icon"><I.cal /></div>
          <div>
            <h3>Appointments across departments</h3>
            <p>One shared schedule for every doctor and department, so double-bookings show up before they become a problem.</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-icon"><I.receipt /></div>
          <div>
            <h3>Billing that matches the chart</h3>
            <p>Invoices are generated from the same record as treatment, so nothing gets billed &mdash; or missed &mdash; twice.</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-icon"><I.pill /></div>
          <div>
            <h3>Pharmacy stock, watched automatically</h3>
            <p>Reorder thresholds flag low stock before a ward runs out, not after.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2 className="hp-serif section-h">From the floor</h2>
        <div className="quote-grid">
          <blockquote className="quote-block">
            <p>"We used to keep pharmacy stock in a spreadsheet next to the actual system. Wardline is the first tool where that spreadsheet wasn't necessary."</p>
            <cite>Dr. Sana Iyer, ICU lead &mdash; Apex Heart Center</cite>
          </blockquote>
          <blockquote className="quote-block">
            <p>"Billing disputes dropped once invoices started pulling straight from the treatment record instead of a separate form."</p>
            <cite>Meenal Joshi, Billing supervisor &mdash; City General</cite>
          </blockquote>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <h2 className="hp-serif section-h">Pricing</h2>
        <table className="price-table">
          <thead>
            <tr><th></th><th>Clinic</th><th className="highlight-col">Hospital</th><th>Network</th></tr>
          </thead>
          <tbody>
            <tr><td>Beds tracked</td><td>Up to 40</td><td className="highlight-col">Up to 400</td><td>Unlimited</td></tr>
            <tr><td>Departments</td><td>1</td><td className="highlight-col">Unlimited</td><td>Unlimited</td></tr>
            <tr><td>Billing module</td><td>&mdash;</td><td className="highlight-col">Included</td><td>Included</td></tr>
            <tr><td>Pharmacy tracking</td><td>&mdash;</td><td className="highlight-col">Included</td><td>Included</td></tr>
            <tr><td>Support</td><td>Email</td><td className="highlight-col">Priority</td><td>Dedicated</td></tr>
            <tr><td>Monthly</td><td>{rupee(9900)}</td><td className="highlight-col">{rupee(38500)}</td><td>Custom</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="footer">
        <div className="brand">
          <span className="brand-mark brand-mark-dark">+</span>
          <span className="brand-word brand-word-dark">Wardline</span>
        </div>
        <p>Demo build &mdash; no real patient data is stored or transmitted.</p>
      </footer>
    </div>
  );
}

/* ---------------- App shell ---------------- */

function Sidebar({ section, setSection, onExit }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: I.grid },
    { key: "patients", label: "Patients", icon: I.bed },
    { key: "appointments", label: "Appointments", icon: I.cal },
    { key: "billing", label: "Billing", icon: I.receipt },
    { key: "pharmacy", label: "Pharmacy", icon: I.pill },
  ];
  return (
    <aside className="sidebar">
      <div className="brand sidebar-brand">
        <span className="brand-mark brand-mark-dark">+</span>
        <span className="brand-word brand-word-dark">Wardline</span>
      </div>
      <nav className="sidebar-nav">
        {items.map((it) => (
          <button
            key={it.key}
            className={"sidebar-link" + (section === it.key ? " active" : "")}
            onClick={() => setSection(it.key)}
          >
            <it.icon s={17} /> {it.label}
          </button>
        ))}
      </nav>
      <button className="sidebar-link exit" onClick={onExit}>
        <I.exit s={17} /> Back to site
      </button>
    </aside>
  );
}

function Topbar({ title, subtitle, action }) {
  return (
    <div className="topbar">
      <div>
        <h1 className="hp-serif topbar-title">{title}</h1>
        {subtitle && <p className="topbar-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function DashboardPage({ patients, appointments, meds }) {
  const active = patients.filter((p) => p.status !== "Discharged").length;
  const critical = patients.filter((p) => p.status === "Critical").length;
  const lowStock = meds.filter((m) => m.stock <= m.threshold).length;
  const today = appointments.filter((a) => a.day === "Mon");

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Today &mdash; Monday, Sep 8" />
      <div className="stat-strip">
        <div className="stat-block">
          <div className="stat-label">Beds occupied</div>
          <div className="stat-value hp-mono">142 / 180</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Active patients</div>
          <div className="stat-value hp-mono">{active}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Revenue today</div>
          <div className="stat-value hp-mono">{rupee(214600)}</div>
          <Sparkline />
        </div>
        <div className="stat-block">
          <div className="stat-label">Low-stock medications</div>
          <div className="stat-value hp-mono" style={{ color: lowStock ? "#9E4B44" : "inherit" }}>{lowStock}</div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3 className="panel-h">Recent admissions {critical > 0 && <span className="flag">{critical} critical</span>}</h3>
          <table className="table-ledger">
            <thead><tr><th>ID</th><th>Patient</th><th>Ward</th><th>Status</th></tr></thead>
            <tbody>
              {patients.filter((p) => p.status !== "Discharged").slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td className="hp-mono">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.ward}</td>
                  <td><Pill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3 className="panel-h">Today's appointments</h3>
          <table className="table-ledger">
            <thead><tr><th>Time</th><th>Patient</th><th>Department</th></tr></thead>
            <tbody>
              {today.map((a) => (
                <tr key={a.id}>
                  <td className="hp-mono">{a.time}</td>
                  <td>{a.patient}</td>
                  <td>{a.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Patients ---------------- */

function AddPatientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", age: "", ward: "General", doctor: "", status: "Stable" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.age) {
      setError("Enter a name and age first.");
      return;
    }
    onAdd({
      id: "P-" + (1048 + Math.floor(Math.random() * 900)),
      name: form.name.trim(),
      age: Number(form.age),
      ward: form.ward,
      doctor: form.doctor.trim() || "Unassigned",
      admitted: "Sep 8",
      status: form.status,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="hp-serif">Admit patient</h3>
          <button className="icon-btn" onClick={onClose}><I.close /></button>
        </div>
        <div className="field"><label>Full name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Patient name" /></div>
        <div className="field-row">
          <div className="field"><label>Age</label><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" /></div>
          <div className="field">
            <label>Ward</label>
            <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })}>
              <option>General</option><option>ICU</option><option>Maternity</option><option>Pediatrics</option><option>Orthopedics</option>
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field"><label>Attending doctor</label><input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. name" /></div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Stable</option><option>Critical</option>
            </select>
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Admit patient</button>
        </div>
      </div>
    </div>
  );
}

function PatientsPage({ patients, setPatients }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const cycleStatus = (id) => {
    const order = ["Stable", "Critical", "Discharged"];
    setPatients(patients.map((p) => p.id === id ? { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] } : p));
  };

  const filtered = patients.filter((p) => {
    const matchesQ = (p.name + p.id + p.ward).toLowerCase().includes(q.toLowerCase());
    const matchesF = filter === "All" || p.status === filter;
    return matchesQ && matchesF;
  });

  return (
    <div>
      <Topbar title="Patients" subtitle={`${patients.length} on record`} action={
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><I.plus s={15} /> Admit patient</button>
      } />
      <div className="toolbar">
        <div className="search-box"><I.search /><input placeholder="Search name, ID or ward" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="tabs">
          {["All", "Stable", "Critical", "Discharged"].map((f) => (
            <button key={f} className={"tab" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <table className="table-ledger">
        <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Ward</th><th>Doctor</th><th>Admitted</th><th>Status</th></tr></thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td className="hp-mono">{p.id}</td>
              <td>{p.name}</td>
              <td className="hp-mono">{p.age}</td>
              <td>{p.ward}</td>
              <td>{p.doctor}</td>
              <td className="hp-mono">{p.admitted}</td>
              <td><button className="pill-btn" onClick={() => cycleStatus(p.id)}><Pill status={p.status} /></button></td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan="7" className="empty-row">No patients match this search.</td></tr>}
        </tbody>
      </table>
      <p className="hint-text">Click a status pill to cycle it &mdash; stable, critical, discharged.</p>
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onAdd={(p) => { setPatients([p, ...patients]); setShowAdd(false); }} />}
    </div>
  );
}

/* ---------------- Appointments ---------------- */

function AddAppointmentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ time: "", patient: "", doctor: "", dept: "", day: "Mon" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.time || !form.patient.trim()) {
      setError("Enter a time and patient name first.");
      return;
    }
    onAdd({ id: Date.now(), ...form, status: "Scheduled" });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="hp-serif">Book appointment</h3>
          <button className="icon-btn" onClick={onClose}><I.close /></button>
        </div>
        <div className="field-row">
          <div className="field"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
          <div className="field">
            <label>Day</label>
            <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option>
            </select>
          </div>
        </div>
        <div className="field"><label>Patient</label><input value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} placeholder="Patient name" /></div>
        <div className="field-row">
          <div className="field"><label>Doctor</label><input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. name" /></div>
          <div className="field"><label>Department</label><input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} placeholder="Department" /></div>
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Book appointment</button>
        </div>
      </div>
    </div>
  );
}

function AppointmentsPage({ appointments, setAppointments }) {
  const [day, setDay] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const days = ["All", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const cancel = (id) => setAppointments(appointments.map((a) => a.id === id ? { ...a, status: "Cancelled" } : a));
  const filtered = day === "All" ? appointments : appointments.filter((a) => a.day === day);

  return (
    <div>
      <Topbar title="Appointments" subtitle="Shared schedule across departments" action={
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><I.plus s={15} /> Book appointment</button>
      } />
      <div className="tabs">
        {days.map((d) => <button key={d} className={"tab" + (day === d ? " active" : "")} onClick={() => setDay(d)}>{d}</button>)}
      </div>
      <table className="table-ledger">
        <thead><tr><th>Day</th><th>Time</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {filtered.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
            <tr key={a.id}>
              <td>{a.day}</td>
              <td className="hp-mono">{a.time}</td>
              <td>{a.patient}</td>
              <td>{a.doctor}</td>
              <td>{a.dept}</td>
              <td><Pill status={a.status} /></td>
              <td>{a.status === "Scheduled" && <button className="link-btn small" onClick={() => cancel(a.id)}>Cancel</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && <AddAppointmentModal onClose={() => setShowAdd(false)} onAdd={(a) => { setAppointments([...appointments, a]); setShowAdd(false); }} />}
    </div>
  );
}

/* ---------------- Billing ---------------- */

function BillingPage({ invoices, setInvoices }) {
  const [filter, setFilter] = useState("All");
  const markPaid = (id) => setInvoices(invoices.map((i) => i.id === id ? { ...i, status: "Paid" } : i));
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const filtered = filter === "All" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <div>
      <Topbar title="Billing" subtitle={`${invoices.length} invoices on record`} />
      <div className="stat-strip">
        <div className="stat-block"><div className="stat-label">Collected</div><div className="stat-value hp-mono">{rupee(collected)}</div></div>
        <div className="stat-block"><div className="stat-label">Outstanding</div><div className="stat-value hp-mono" style={{ color: outstanding ? "#9E4B44" : "inherit" }}>{rupee(outstanding)}</div></div>
        <div className="stat-block"><div className="stat-label">Invoices overdue</div><div className="stat-value hp-mono">{invoices.filter((i) => i.status === "Overdue").length}</div></div>
      </div>
      <div className="tabs">
        {["All", "Paid", "Pending", "Overdue"].map((f) => <button key={f} className={"tab" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <table className="table-ledger">
        <thead><tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {filtered.map((i) => (
            <tr key={i.id}>
              <td className="hp-mono">{i.id}</td>
              <td>{i.patient}</td>
              <td className="hp-mono">{i.date}</td>
              <td className="hp-mono">{rupee(i.amount)}</td>
              <td><Pill status={i.status} /></td>
              <td>{i.status !== "Paid" && <button className="link-btn small" onClick={() => markPaid(i.id)}>Mark paid</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Pharmacy ---------------- */

function stockStatus(m) {
  if (m.stock <= m.threshold * 0.5) return "Critical stock";
  if (m.stock <= m.threshold) return "Low";
  return "Adequate";
}

function PharmacyPage({ meds, setMeds }) {
  const restock = (name) => setMeds(meds.map((m) => m.name === name ? { ...m, stock: m.stock + 100 } : m));
  const lowCount = meds.filter((m) => m.stock <= m.threshold).length;

  return (
    <div>
      <Topbar title="Pharmacy" subtitle="Stock levels across all wards" />
      {lowCount > 0 && (
        <div className="banner-warning">
          <strong>{lowCount}</strong> medication{lowCount > 1 ? "s are" : " is"} at or below its reorder threshold.
        </div>
      )}
      <table className="table-ledger">
        <thead><tr><th>Medication</th><th>Category</th><th>Stock</th><th>Threshold</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {meds.map((m) => (
            <tr key={m.name}>
              <td>{m.name}</td>
              <td>{m.category}</td>
              <td className="hp-mono">{m.stock} {m.unit}</td>
              <td className="hp-mono">{m.threshold}</td>
              <td><Pill status={stockStatus(m)} /></td>
              <td><button className="link-btn small" onClick={() => restock(m.name)}>Restock +100</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- App root ---------------- */

export default function App() {
  const [view, setView] = useState("landing");
  const [section, setSection] = useState("dashboard");
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [meds, setMeds] = useState(initialMeds);

  return (
    <div className="hp">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .hp { --ink:#14213D; --ink-soft:#5C6478; --paper:#F7F5F0; --paper-alt:#EFEBE2; --blue:#2B4C7E; --blue-deep:#1B3357; --amber:#E8871E; --sage:#6F8B6F; --brick:#9E4B44; --rule:#D8D2C4; --grey:#8A8A82;
          font-family:'IBM Plex Sans',system-ui,sans-serif; color:var(--ink); background:var(--paper); line-height:1.55; }
        .hp * { box-sizing:border-box; }
        .hp h1,.hp h2,.hp h3 { font-weight:600; margin:0; }
        .hp p { margin:0; }
        .hp-serif { font-family:'Source Serif 4',Georgia,serif; }
        .hp-mono { font-family:'IBM Plex Mono',monospace; }
        .hp button, .hp input, .hp select { font-family:inherit; font-size:14px; }
        .hp a { color:var(--blue); }
        .hp button:focus-visible, .hp input:focus-visible, .hp select:focus-visible, .hp a:focus-visible { outline:2px solid var(--blue); outline-offset:2px; }

        .btn { display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:2px; font-size:14px; font-weight:500; cursor:pointer; border:1px solid transparent; text-decoration:none; }
        .btn-primary { background:var(--blue); color:var(--paper); }
        .btn-primary:hover { background:var(--blue-deep); }
        .btn-ghost { background:transparent; color:var(--ink); border-color:var(--ink); }
        .btn-ghost:hover { background:var(--paper-alt); }
        .link-btn { background:none; border:none; color:var(--blue); cursor:pointer; padding:0; font-size:14px; }
        .link-btn.small { font-size:13px; }
        .icon-btn { background:none; border:none; cursor:pointer; color:var(--ink-soft); padding:4px; }

        /* Landing */
        .hp-landing { max-width:1080px; margin:0 auto; padding:0 32px; }
        .nav { display:flex; align-items:center; justify-content:space-between; padding:24px 0; border-bottom:1px solid var(--rule); }
        .brand { display:flex; align-items:center; gap:8px; }
        .brand-mark { width:26px; height:26px; background:var(--blue); color:var(--paper); border-radius:2px; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:16px; }
        .brand-word { font-family:'Source Serif 4',serif; font-weight:600; font-size:18px; }
        .nav-links { display:flex; gap:28px; }
        .nav-links a { color:var(--ink); text-decoration:none; font-size:14px; }
        .nav-actions { display:flex; align-items:center; gap:20px; }

        .hero { display:grid; grid-template-columns:1.05fr 0.95fr; gap:56px; padding:64px 0 56px; align-items:start; }
        .badge-note { font-size:13px; font-style:italic; color:var(--ink-soft); border-left:2px solid var(--amber); padding-left:10px; margin-bottom:20px; }
        .hero-h1 { font-size:44px; line-height:1.12; margin-bottom:20px; }
        .hero-sub { font-size:16px; color:var(--ink-soft); max-width:46ch; margin-bottom:28px; }
        .hero-ctas { display:flex; gap:14px; margin-bottom:20px; }
        .hero-notes { display:flex; align-items:center; gap:10px; font-size:13px; color:var(--ink-soft); }
        .dot-sep { width:3px; height:3px; border-radius:50%; background:var(--rule); }

        .hero-panel { background:var(--paper-alt); border:1px solid var(--rule); padding:22px; }
        .panel-row-lead { display:flex; justify-content:space-between; align-items:baseline; font-size:13px; color:var(--ink-soft); margin-bottom:6px; }
        .lead-value { font-size:20px; color:var(--sage); font-weight:500; }
        .panel-ledger { margin-top:18px; }
        .panel-line { display:flex; justify-content:space-between; font-size:14px; margin-bottom:4px; }
        .bar { height:4px; background:var(--rule); margin-bottom:16px; }
        .bar-fill { height:100%; background:var(--blue); }
        .bar-fill.amber { background:var(--amber); }

        .trusted { padding:32px 0; border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); text-align:center; }
        .trusted-label { font-size:13px; color:var(--ink-soft); }
        .trusted-row { display:flex; justify-content:center; align-items:center; gap:16px; margin-top:14px; flex-wrap:wrap; font-size:14px; color:var(--ink-soft); }
        .rule-sep { width:1px; height:14px; background:var(--rule); }

        .section-h { font-size:26px; margin-bottom:28px; }
        .features { padding:64px 0; }
        .feature-row { display:grid; grid-template-columns:48px 1fr; gap:18px; padding:22px 0; border-top:1px solid var(--rule); align-items:start; }
        .feature-icon { width:40px; height:40px; border:1px solid var(--rule); display:flex; align-items:center; justify-content:center; color:var(--blue); }
        .feature-row h3 { font-size:17px; margin-bottom:6px; }
        .feature-row p { color:var(--ink-soft); font-size:14.5px; max-width:60ch; }

        .testimonials { padding:56px 0; border-top:1px solid var(--rule); }
        .quote-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
        .quote-block { border-left:3px solid var(--amber); padding-left:18px; }
        .quote-block p { font-family:'Source Serif 4',serif; font-style:italic; font-size:16px; margin-bottom:10px; }
        .quote-block cite { font-style:normal; font-size:13px; color:var(--ink-soft); }

        .pricing { padding:56px 0 72px; border-top:1px solid var(--rule); }
        .price-table { width:100%; border-collapse:collapse; font-size:14px; }
        .price-table th, .price-table td { padding:12px 14px; border-bottom:1px solid var(--rule); text-align:left; }
        .price-table thead th { font-weight:600; border-bottom:2px solid var(--ink); }
        .highlight-col { background:var(--paper-alt); font-weight:500; }

        .footer { background:var(--ink); color:var(--paper); padding:32px; display:flex; justify-content:space-between; align-items:center; margin:0 -32px; font-size:13px; }
        .brand-mark-dark { background:var(--paper); color:var(--ink); }
        .brand-word-dark { color:var(--paper); }
        .footer p { color:#B9BECB; }

        /* App shell */
        .app-shell { display:grid; grid-template-columns:220px 1fr; min-height:100vh; }
        .sidebar { background:var(--blue-deep); color:var(--paper); display:flex; flex-direction:column; padding:20px 14px; }
        .sidebar-brand { padding:6px 8px 24px; }
        .sidebar-nav { display:flex; flex-direction:column; gap:2px; flex:1; }
        .sidebar-link { display:flex; align-items:center; gap:10px; background:none; border:none; color:#CBD3E1; padding:10px 10px; text-align:left; cursor:pointer; border-radius:2px; }
        .sidebar-link:hover { background:rgba(255,255,255,0.06); color:var(--paper); }
        .sidebar-link.active { background:rgba(255,255,255,0.12); color:var(--paper); }
        .sidebar-link.exit { color:#9AA3B8; }

        .main-col { padding:32px 40px 60px; }
        .topbar { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; }
        .topbar-title { font-size:26px; }
        .topbar-sub { color:var(--ink-soft); font-size:14px; margin-top:4px; }

        .stat-strip { display:flex; border:1px solid var(--rule); margin-bottom:28px; }
        .stat-block { flex:1; padding:16px 20px; border-right:1px solid var(--rule); }
        .stat-block:last-child { border-right:none; }
        .stat-label { font-size:13px; color:var(--ink-soft); margin-bottom:6px; }
        .stat-value { font-size:22px; font-weight:500; }

        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .panel { border:1px solid var(--rule); padding:18px; }
        .panel-h { font-size:15px; font-weight:600; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .flag { font-size:12px; background:var(--brick); color:#FBEAF0; padding:2px 8px; border-radius:2px; font-weight:500; }

        .table-ledger { width:100%; border-collapse:collapse; font-size:14px; margin-top:4px; }
        .table-ledger th { text-align:left; padding:8px 10px; border-bottom:2px solid var(--ink); font-weight:600; font-size:13px; }
        .table-ledger td { padding:10px; border-bottom:1px solid var(--rule); }
        .empty-row { text-align:center; color:var(--ink-soft); padding:24px; }

        .toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:16px; flex-wrap:wrap; }
        .search-box { display:flex; align-items:center; gap:8px; border-bottom:1px solid var(--ink); padding:6px 4px; color:var(--ink-soft); min-width:240px; }
        .search-box input { border:none; background:none; outline:none; flex:1; color:var(--ink); }
        .tabs { display:flex; gap:4px; margin-bottom:16px; }
        .tab { background:none; border:1px solid var(--rule); padding:6px 14px; cursor:pointer; color:var(--ink-soft); border-radius:2px; }
        .tab.active { background:var(--ink); color:var(--paper); border-color:var(--ink); }

        .pill { display:inline-block; padding:3px 10px; border-radius:999px; font-size:12.5px; font-weight:500; border:1px solid transparent; }
        .pill-sage { background:#EAF1E7; color:#3E5238; }
        .pill-brick { background:#F3E4E1; color:#6E2E28; }
        .pill-amber { background:#FBEAD5; color:#8A4E0C; }
        .pill-blue { background:#E4EBF3; color:#1E3A5F; }
        .pill-grey { background:#EDEBE4; color:#5C5C54; }
        .pill-btn { background:none; border:none; cursor:pointer; padding:0; }
        .hint-text { font-size:13px; color:var(--ink-soft); margin-top:10px; }

        .banner-warning { background:#FBEAD5; color:#8A4E0C; border:1px solid #E8871E; padding:12px 16px; font-size:14px; margin-bottom:20px; }

        .modal-backdrop { position:fixed; inset:0; background:rgba(20,33,61,0.45); display:flex; align-items:center; justify-content:center; z-index:50; }
        .modal-panel { background:var(--paper); border:1px solid var(--rule); padding:26px; width:420px; max-width:90vw; }
        .modal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
        .field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; flex:1; }
        .field label { font-size:12.5px; color:var(--ink-soft); }
        .field input, .field select { border:none; border-bottom:1px solid var(--rule); padding:7px 2px; background:none; outline:none; }
        .field input:focus, .field select:focus { border-bottom-color:var(--blue); }
        .field-row { display:flex; gap:16px; }
        .modal-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:8px; }
        .error-text { color:var(--brick); font-size:13px; margin-bottom:10px; }

        @media (max-width: 900px) {
          .hero { grid-template-columns:1fr; }
          .two-col { grid-template-columns:1fr; }
          .quote-grid { grid-template-columns:1fr; }
          .nav-links { display:none; }
        }
        @media (max-width: 720px) {
          .app-shell { grid-template-columns:1fr; }
          .sidebar { flex-direction:row; overflow-x:auto; align-items:center; }
          .sidebar-nav { flex-direction:row; }
          .sidebar-brand { display:none; }
          .main-col { padding:20px; }
          .stat-strip { flex-wrap:wrap; }
          .stat-block { flex:1 1 45%; border-bottom:1px solid var(--rule); }
        }
      `}</style>

      {view === "landing" ? (
        <LandingPage onEnter={() => { setView("app"); setSection("dashboard"); }} />
      ) : (
        <div className="app-shell">
          <Sidebar section={section} setSection={setSection} onExit={() => setView("landing")} />
          <div className="main-col">
            {section === "dashboard" && <DashboardPage patients={patients} appointments={appointments} meds={meds} />}
            {section === "patients" && <PatientsPage patients={patients} setPatients={setPatients} />}
            {section === "appointments" && <AppointmentsPage appointments={appointments} setAppointments={setAppointments} />}
            {section === "billing" && <BillingPage invoices={invoices} setInvoices={setInvoices} />}
            {section === "pharmacy" && <PharmacyPage meds={meds} setMeds={setMeds} />}
          </div>
        </div>
      )}
    </div>
  );
}
