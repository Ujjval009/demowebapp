import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Receipt,
  Pill,
  FlaskConical,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/pharmacy", label: "Pharmacy", icon: Pill },
  { to: "/lab", label: "Lab Reports", icon: FlaskConical },
];

export default function Sidebar({ onExit }) {
  return (
    <aside className="bg-blue-deep text-paper flex flex-col py-5 px-3.5 min-h-screen">
      <div className="flex items-center gap-2 px-2 pb-6">
        <div className="w-[26px] h-[26px] bg-paper text-blue-deep rounded-sm flex items-center justify-center font-semibold text-sm">
          +
        </div>
        <span className="font-serif font-semibold text-lg">Wardline</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-sm text-sm transition-colors ${
                isActive
                  ? "bg-white/12 text-paper"
                  : "text-blue-200 hover:bg-white/6 hover:text-paper"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/"
        className="flex items-center gap-2.5 px-2.5 py-2.5 text-sm text-gray-400 hover:text-paper transition-colors mt-4"
      >
        <LogOut size={17} />
        Back to site
      </NavLink>
    </aside>
  );
}
