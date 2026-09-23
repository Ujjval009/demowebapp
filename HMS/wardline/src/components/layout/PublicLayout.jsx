import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 border-b border-rule max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-[26px] h-[26px] bg-blue text-paper rounded-sm flex items-center justify-center font-semibold text-sm">
            +
          </div>
          <span className="font-serif font-semibold text-lg text-ink">Wardline</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-ink hover:text-blue">Home</Link>
          <Link to="/book-appointment" className="text-ink hover:text-blue">Book Appointment</Link>
          <Link to="/login" className="text-ink hover:text-blue">Staff Login</Link>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}
