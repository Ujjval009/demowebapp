import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShell() {
  return (
    <div className="grid grid-cols-[220px_1fr] min-h-screen max-md:grid-cols-1">
      <Sidebar />
      <div className="py-8 px-10 pb-16 max-md:px-5 max-md:py-5">
        <Outlet />
      </div>
    </div>
  );
}
