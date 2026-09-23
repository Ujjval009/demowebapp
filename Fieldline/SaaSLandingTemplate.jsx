import { useState } from "react";
import { Calendar, Receipt, MessageSquare, Package, Check, Menu, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Fieldline — a reusable SaaS landing page template.
// Swap the copy in the CONTENT object below to reuse this for a different
// product; the layout, tokens, and structure will carry over.
// ---------------------------------------------------------------------------

const CONTENT = {
  brand: "Fieldline",
  nav: ["Product", "Pricing", "Customers"],
  hero: {
    headline: "Run your service business from one screen.",
    sub: "Fieldline keeps scheduling, invoicing, and crew updates in one place, so nothing falls through email threads or sticky notes on the dash.",
    ctaPrimary: "Start free trial",
    ctaSecondary: "Watch a 2 minute demo",
  },
  logos: ["Ruiz Electrical", "Harbor HVAC", "Kessler Plumbing", "Vantage Roofing", "Delgado Mechanical"],
  features: [
    { icon: Calendar, title: "Scheduling and dispatch", body: "Drag a job onto a crew's day and everyone's phone updates before you've put the coffee down." },
    { icon: Receipt, title: "Invoicing and payments", body: "Turn a finished job into an invoice in two taps. Get paid by card or bank transfer, no separate app." },
    { icon: MessageSquare, title: "Crew messaging", body: "Photos, notes, and questions from the job site land on the right thread, not a group text." },
    { icon: Package, title: "Materials and job costing", body: "Log what a job actually cost as you go, so the estimate for the next one is closer to right." },
  ],
  schedule: [
    { time: "8:00", client: "Ruiz residence", task: "Panel upgrade", status: "In progress", crew: "Marco" },
    { time: "10:30", client: "Harbor Cafe", task: "Outlet repair", status: "Scheduled", crew: "Dana" },
    { time: "1:00", client: "Kessler unit 4B", task: "Leak inspection", status: "Scheduled", crew: "Marco" },
    { time: "3:30", client: "Vantage HQ", task: "Wiring estimate", status: "Unassigned", crew: "—" },
  ],
  testimonial: {
    quote: "We used to lose an hour a day just figuring out who was where. Now the whole crew looks at one screen before they leave the shop.",
    name: "Dana Ruiz",
    role: "Owner, Ruiz Electrical",
  },
  pricing: [
    { name: "Starter", price: "$29", period: "/month", desc: "For one crew getting off paper.", features: ["Up to 3 users", "Scheduling and dispatch", "Basic invoicing"], cta: "Start free trial" },
    { name: "Team", price: "$79", period: "/month", desc: "For businesses running multiple crews.", features: ["Up to 15 users", "Everything in Starter", "Job costing", "Crew messaging"], cta: "Start free trial", featured: true },
    { name: "Business", price: "Talk to us", period: "", desc: "For larger operations with custom needs.", features: ["Unlimited users", "Everything in Team", "Priority support", "Custom reporting"], cta: "Contact sales" },
  ],
  ctaBand: {
    headline: "Get your crew on the same page.",
    sub: "Set up takes about ten minutes. No credit card needed to try it.",
  },
};

const statusColor = {
  "In progress": "text-amber-400",
  "Scheduled": "text-stone-300",
  "Unassigned": "text-stone-500",
};

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-stone-800 bg-stone-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight text-stone-50">{CONTENT.brand}</span>
        <nav className="hidden gap-8 md:flex">
          {CONTENT.nav.map((item) => (
            <a key={item} href="#" className="text-sm text-stone-300 hover:text-stone-50">{item}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href="#" className="text-sm text-stone-300 hover:text-stone-50">Log in</a>
          <a href="#" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-stone-950 hover:bg-amber-400">
            {CONTENT.hero.ctaPrimary}
          </a>
        </div>
        <button className="md:hidden text-stone-200" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-stone-800 px-6 py-4 md:hidden">
          {CONTENT.nav.map((item) => (
            <a key={item} href="#" className="text-sm text-stone-300">{item}</a>
          ))}
          <a href="#" className="text-sm text-stone-300">Log in</a>
          <a href="#" className="rounded-md bg-amber-500 px-4 py-2 text-center text-sm font-medium text-stone-950">
            {CONTENT.hero.ctaPrimary}
          </a>
        </div>
      )}
    </header>
  );
}

function SchedulePanel() {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5 shadow-xl shadow-black/30">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-stone-200">Today, Thursday</p>
        <span className="rounded-full bg-stone-800 px-2.5 py-1 font-mono text-xs text-stone-400">4 jobs</span>
      </div>
      <div className="divide-y divide-stone-800">
        {CONTENT.schedule.map((row) => (
          <div key={row.time} className="flex items-center gap-3 py-3">
            <span className="w-12 shrink-0 font-mono text-xs text-stone-500">{row.time}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-stone-100">{row.task}</p>
              <p className="truncate text-xs text-stone-500">{row.client} · {row.crew}</p>
            </div>
            <span className={`shrink-0 text-xs font-medium ${statusColor[row.status]}`}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-stone-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-50 md:text-5xl">
            {CONTENT.hero.headline}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stone-400">
            {CONTENT.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#" className="rounded-md bg-amber-500 px-5 py-3 text-sm font-medium text-stone-950 hover:bg-amber-400">
              {CONTENT.hero.ctaPrimary}
            </a>
            <a href="#" className="text-sm font-medium text-stone-300 hover:text-stone-50">
              {CONTENT.hero.ctaSecondary}
            </a>
          </div>
        </div>
        <SchedulePanel />
      </div>
    </section>
  );
}

function Logos() {
  return (
    <div className="border-y border-stone-800 bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        {CONTENT.logos.map((name) => (
          <span key={name} className="text-sm text-stone-600">{name}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
          Everything the job needs, nothing it doesn't.
        </h2>
        <div className="mt-10 divide-y divide-stone-200 border-t border-stone-200">
          {CONTENT.features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="grid gap-4 py-6 md:grid-cols-[220px_1fr] md:items-start">
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-amber-600" />
                <p className="font-medium text-stone-900">{title}</p>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-stone-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="bg-stone-950 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xl leading-relaxed text-stone-100 md:text-2xl">
          "{CONTENT.testimonial.quote}"
        </p>
        <p className="mt-6 text-sm text-stone-500">
          {CONTENT.testimonial.name} — {CONTENT.testimonial.role}
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">Pricing that scales with your crew.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CONTENT.pricing.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? "flex flex-col rounded-2xl bg-stone-900 p-7 text-stone-50"
                  : "flex flex-col rounded-2xl border border-stone-200 bg-white p-7"
              }
            >
              <p className={tier.featured ? "text-sm text-stone-400" : "text-sm text-stone-500"}>{tier.name}</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">{tier.price}</span>
                <span className={tier.featured ? "text-sm text-stone-400" : "text-sm text-stone-500"}>{tier.period}</span>
              </p>
              <p className={tier.featured ? "mt-2 text-sm text-stone-400" : "mt-2 text-sm text-stone-500"}>{tier.desc}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className={tier.featured ? "mt-0.5 shrink-0 text-amber-400" : "mt-0.5 shrink-0 text-amber-600"} />
                    <span className={tier.featured ? "text-stone-200" : "text-stone-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={
                  tier.featured
                    ? "mt-8 rounded-md bg-amber-500 px-4 py-2.5 text-center text-sm font-medium text-stone-950 hover:bg-amber-400"
                    : "mt-8 rounded-md border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-900 hover:bg-stone-100"
                }
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="bg-stone-950 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-50 md:text-3xl">{CONTENT.ctaBand.headline}</h2>
          <p className="mt-2 text-sm text-stone-400">{CONTENT.ctaBand.sub}</p>
        </div>
        <a href="#" className="shrink-0 rounded-md bg-amber-500 px-6 py-3 text-sm font-medium text-stone-950 hover:bg-amber-400">
          {CONTENT.hero.ctaPrimary}
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-stone-500 md:flex-row md:justify-between">
        <span>{CONTENT.brand}</span>
        <span>© 2026 {CONTENT.brand}. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default function SaaSLandingTemplate() {
  return (
    <div className="min-h-screen bg-stone-950 font-sans">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <Testimonial />
      <Pricing />
      <CtaBand />
      <Footer />
    </div>
  );
}
