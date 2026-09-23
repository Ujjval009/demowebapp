export const DEPARTMENTS = [
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Obstetrics",
  "Neurology",
  "Dermatology",
  "ENT",
  "Ophthalmology",
  "ICU",
];

export const WARDS = [
  "General",
  "ICU",
  "Maternity",
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Neurology",
];

export const DOCTORS = [
  { id: "D-001", name: "Dr. Sana Iyer", dept: "Cardiology", qualification: "MD, DM Cardiology", experience: 12, phone: "9876543210", availability: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  { id: "D-002", name: "Dr. Arjun Rao", dept: "Orthopedics", qualification: "MS Ortho", experience: 15, phone: "9876543211", availability: ["Mon", "Wed", "Fri"] },
  { id: "D-003", name: "Dr. Leela Menon", dept: "Obstetrics", qualification: "MS, DNB Obs", experience: 10, phone: "9876543212", availability: ["Mon", "Tue", "Thu"] },
  { id: "D-004", name: "Dr. Kabir Shah", dept: "Pediatrics", qualification: "MD Pediatrics", experience: 8, phone: "9876543213", availability: ["Tue", "Wed", "Thu", "Fri"] },
  { id: "D-005", name: "Dr. Nisha Kapoor", dept: "Neurology", qualification: "DM Neurology", experience: 14, phone: "9876543214", availability: ["Mon", "Tue", "Wed"] },
  { id: "D-006", name: "Dr. Ravi Deshmukh", dept: "General Medicine", qualification: "MD Internal Med", experience: 20, phone: "9876543215", availability: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  { id: "D-007", name: "Dr. Priya Chopra", dept: "Dermatology", qualification: "MD Dermatology", experience: 6, phone: "9876543216", availability: ["Mon", "Thu", "Fri"] },
  { id: "D-008", name: "Dr. Amit Verma", dept: "ENT", qualification: "MS ENT", experience: 9, phone: "9876543217", availability: ["Tue", "Wed", "Fri"] },
  { id: "D-009", name: "Dr. Kavita Joshi", dept: "Ophthalmology", qualification: "MS Ophthalmology", experience: 11, phone: "9876543218", availability: ["Mon", "Wed", "Thu"] },
  { id: "D-010", name: "Dr. Rajesh Mehta", dept: "ICU", qualification: "MD, FCCM", experience: 18, phone: "9876543219", availability: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
];

export const STATUS_COLORS = {
  Stable: "sage",
  Critical: "brick",
  Discharged: "grey",
  Admitted: "blue",
  Paid: "sage",
  Pending: "amber",
  Overdue: "brick",
  Scheduled: "blue",
  Completed: "sage",
  Cancelled: "grey",
  Adequate: "sage",
  Low: "amber",
  "Critical stock": "brick",
  "In Progress": "blue",
  Processing: "amber",
};

export const LAB_TEST_TYPES = [
  "Complete Blood Count (CBC)",
  "Blood Sugar (Fasting)",
  "Blood Sugar (Post Prandial)",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (TSH)",
  "Urinalysis",
  "ECG",
  "Chest X-Ray",
  "MRI Brain",
  "CT Scan Abdomen",
  "Echocardiography",
  "Pulmonary Function Test",
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
