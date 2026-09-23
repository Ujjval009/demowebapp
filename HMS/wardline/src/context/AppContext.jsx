import { createContext, useContext, useState } from "react";
import { initialPatients } from "../data/patients";
import { initialAppointments } from "../data/appointments";
import { initialInvoices } from "../data/invoices";
import { initialMeds } from "../data/medications";
import { initialLabTests } from "../data/labTests";
import { initialDoctors } from "../data/doctors";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [meds, setMeds] = useState(initialMeds);
  const [labTests, setLabTests] = useState(initialLabTests);
  const [doctors] = useState(initialDoctors);

  return (
    <AppContext.Provider
      value={{
        patients, setPatients,
        appointments, setAppointments,
        invoices, setInvoices,
        meds, setMeds,
        labTests, setLabTests,
        doctors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
