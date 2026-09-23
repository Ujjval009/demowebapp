import { Link } from "react-router-dom";
import { Building2, Calendar, Receipt, Pill, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-8">
      <header className="flex items-center justify-between py-6 border-b border-rule">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] bg-blue text-paper rounded-sm flex items-center justify-center font-semibold text-sm">+</div>
          <span className="font-serif font-semibold text-lg">Wardline</span>
        </div>
        <nav className="flex gap-7 text-sm text-ink">
          <a href="#features" className="hover:text-blue">Features</a>
          <a href="#testimonials" className="hover:text-blue">Testimonials</a>
          <a href="#pricing" className="hover:text-blue">Pricing</a>
        </nav>
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-sm text-blue">Sign in</Link>
          <Link to="/register" className="bg-blue text-paper px-4 py-2.5 text-sm font-medium rounded-sm hover:bg-blue-deep transition-colors">
            Start free trial
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-[1.05fr_0.95fr] gap-14 py-16 items-start max-md:grid-cols-1">
        <div>
          <div className="text-sm italic text-ink-soft border-l-2 border-amber pl-2.5 mb-5">
            Updated Sep 2026 — pharmacy module rebuilt
          </div>
          <h1 className="font-serif text-[44px] leading-[1.12] mb-5">
            One record, from admission<br />to discharge.
          </h1>
          <p className="text-ink-soft text-base max-w-[46ch] mb-7">
            Wardline keeps beds, charts, appointments, billing and pharmacy stock
            in a single ledger, so nothing about a patient's stay lives in two
            places at once.
          </p>
          <div className="flex gap-3.5 mb-5">
            <Link to="/dashboard" className="bg-blue text-paper px-5 py-2.5 text-sm font-medium rounded-sm hover:bg-blue-deep transition-colors inline-flex items-center gap-1.5">
              See it in action <ArrowRight size={15} />
            </Link>
            <a href="#features" className="border border-ink text-ink px-5 py-2.5 text-sm rounded-sm hover:bg-paper-alt transition-colors">
              View the modules
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-ink-soft">
            <span>No setup required for this demo</span>
            <span className="w-[3px] h-[3px] rounded-full bg-rule" />
            <span>Data resets each session</span>
          </div>
        </div>

        <div className="bg-paper-alt border border-rule p-5.5">
          <div className="flex justify-between items-baseline text-sm text-ink-soft mb-1.5 font-mono">
            <span>Heart rate — Bed 14</span>
            <span className="text-sage font-medium text-lg">78 <small>bpm</small></span>
          </div>
          <svg viewBox="0 0 160 40" width="100%" height="40" preserveAspectRatio="none">
            <polyline points="0,32 20,28 40,30 60,18 80,22 100,10 120,14 140,6 160,9" fill="none" stroke="#6F8B6F" strokeWidth="2" />
          </svg>
          <div className="mt-4.5">
            {[
              { label: "Beds occupied", value: "142 / 180", pct: "79%", amber: false },
              { label: "Medication due, next hour", value: "26", pct: "40%", amber: true },
              { label: "Discharges today", value: "9", pct: "22%", amber: false },
            ].map(({ label, value, pct, amber }) => (
              <div key={label} className="mb-3.5">
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-mono">{value}</span>
                </div>
                <div className="h-1 bg-rule">
                  <div className={`h-full ${amber ? "bg-amber" : "bg-blue"}`} style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-b border-rule text-center">
        <span className="text-xs text-ink-soft">Used across departments at</span>
        <div className="flex justify-center items-center gap-4 mt-3.5 flex-wrap text-sm text-ink-soft">
          <span>Apex Heart Center</span>
          <span className="w-px h-3.5 bg-rule" />
          <span>City General</span>
          <span className="w-px h-3.5 bg-rule" />
          <span>MediCare Plus</span>
          <span className="w-px h-3.5 bg-rule" />
          <span>HealthFirst Clinic</span>
          <span className="w-px h-3.5 bg-rule" />
          <span>OrthoCare</span>
        </div>
      </section>

      <section id="features" className="py-16">
        <h2 className="font-serif text-[26px] mb-7">What's on the ledger</h2>
        {[
          { icon: Building2, title: "Bed and ward tracking", desc: "See every admission, transfer and discharge as it happens, organised by ward instead of buried in a chart list." },
          { icon: Calendar, title: "Appointments across departments", desc: "One shared schedule for every doctor and department, so double-bookings show up before they become a problem." },
          { icon: Receipt, title: "Billing that matches the chart", desc: "Invoices are generated from the same record as treatment, so nothing gets billed — or missed — twice." },
          { icon: Pill, title: "Pharmacy stock, watched automatically", desc: "Reorder thresholds flag low stock before a ward runs out, not after." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="grid grid-cols-[48px_1fr] gap-4.5 py-5.5 border-t border-rule items-start">
            <div className="w-10 h-10 border border-rule flex items-center justify-center text-blue">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1.5">{title}</h3>
              <p className="text-ink-soft text-[14.5px] max-w-[60ch]">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="testimonials" className="py-14 border-t border-rule">
        <h2 className="font-serif text-[26px] mb-7">From the floor</h2>
        <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          <blockquote className="border-l-[3px] border-amber pl-4.5">
            <p className="font-serif italic text-base mb-2.5">
              "We used to keep pharmacy stock in a spreadsheet next to the actual system. Wardline is the first tool where that spreadsheet wasn't necessary."
            </p>
            <cite className="text-xs text-ink-soft not-italic">Dr. Sana Iyer, ICU lead — Apex Heart Center</cite>
          </blockquote>
          <blockquote className="border-l-[3px] border-amber pl-4.5">
            <p className="font-serif italic text-base mb-2.5">
              "Billing disputes dropped once invoices started pulling straight from the treatment record instead of a separate form."
            </p>
            <cite className="text-xs text-ink-soft not-italic">Meenal Joshi, Billing supervisor — City General</cite>
          </blockquote>
        </div>
      </section>

      <section id="pricing" className="py-14 border-t border-rule">
        <h2 className="font-serif text-[26px] mb-7">Pricing</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left py-3 px-3.5 border-b-2 border-ink font-semibold"></th>
              <th className="text-left py-3 px-3.5 border-b-2 border-ink font-semibold">Clinic</th>
              <th className="text-left py-3 px-3.5 border-b-2 border-ink font-semibold bg-paper-alt">Hospital</th>
              <th className="text-left py-3 px-3.5 border-b-2 border-ink font-semibold">Network</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Beds tracked", "Up to 40", "Up to 400", "Unlimited"],
              ["Departments", "1", "Unlimited", "Unlimited"],
              ["Billing module", "—", "Included", "Included"],
              ["Pharmacy tracking", "—", "Included", "Included"],
              ["Support", "Email", "Priority", "Dedicated"],
              ["Monthly", "\u20B99,900", "\u20B938,500", "Custom"],
            ].map(([label, clinic, hospital, network], i) => (
              <tr key={i}>
                <td className="py-3 px-3.5 border-b border-rule font-medium">{label}</td>
                <td className="py-3 px-3.5 border-b border-rule">{clinic}</td>
                <td className="py-3 px-3.5 border-b border-rule bg-paper-alt font-medium">{hospital}</td>
                <td className="py-3 px-3.5 border-b border-rule">{network}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="bg-ink text-paper py-8 px-8 -mx-8 flex justify-between items-center text-xs mt-8">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] bg-paper text-ink rounded-sm flex items-center justify-center font-semibold text-sm">+</div>
          <span className="font-serif font-semibold text-lg">Wardline</span>
        </div>
        <p className="text-gray-400">Demo build — no real patient data is stored or transmitted.</p>
      </footer>
    </div>
  );
}
