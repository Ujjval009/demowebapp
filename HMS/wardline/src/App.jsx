import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import PublicLayout from "./components/layout/PublicLayout";
import AppShell from "./components/layout/AppShell";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BookAppointment from "./pages/public/BookAppointment";
import BookingSuccess from "./pages/public/BookingSuccess";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/patients/PatientList";
import PatientDetail from "./pages/patients/PatientDetail";
import DoctorList from "./pages/doctors/DoctorList";
import DoctorProfile from "./pages/doctors/DoctorProfile";
import AppointmentList from "./pages/appointments/AppointmentList";
import InvoiceList from "./pages/billing/InvoiceList";
import InvoiceDetail from "./pages/billing/InvoiceDetail";
import MedicineList from "./pages/pharmacy/MedicineList";
import LabOrderList from "./pages/lab/LabOrderList";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PublicLayout />}>
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Route>

          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/billing" element={<InvoiceList />} />
            <Route path="/billing/:id" element={<InvoiceDetail />} />
            <Route path="/pharmacy" element={<MedicineList />} />
            <Route path="/lab" element={<LabOrderList />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
