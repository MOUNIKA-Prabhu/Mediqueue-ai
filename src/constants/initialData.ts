export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  lastVisit: string;
}

export interface TokenRecord {
  tokenNumber: string;
  patientName: string;
  patientPhone: string;
  ageGender: string;
  visitType: "Regular Check-up" | "Specific Reason" | "Emergency Care";
  doctorName: string;
  department: string;
  consultationFee: number;
  amount: number;
  personsAhead: number;
  paymentMethod: "UPI" | "Cash";
  paymentStatus: "PAID" | "NOT PAID";
  transactionId?: string;
  dateTime: string;
  statusInQueue: "Waiting" | "Serving" | "Completed";
  arrivalMode?: "Came By Themself" | "Ambulance";
}

export const INITIAL_EXISTING_PATIENTS: PatientRecord[] = [
  {
    id: "pat-101",
    name: "Karthik Subramanian",
    phone: "9876543210",
    age: 38,
    gender: "Male",
    bloodGroup: "O+",
    address: "42 Anna Salai, Chennai",
    lastVisit: "2026-06-12",
  },
  {
    id: "pat-102",
    name: "Lakshmi Narayanan",
    phone: "9840123456",
    age: 52,
    gender: "Female",
    bloodGroup: "A+",
    address: "15 T. Nagar, Chennai",
    lastVisit: "2026-07-04",
  },
  {
    id: "pat-103",
    name: "Ramesh Babu",
    phone: "9123456789",
    age: 45,
    gender: "Male",
    bloodGroup: "B+",
    address: "8 Gandhi Road, Velachery",
    lastVisit: "2026-05-20",
  },
  {
    id: "pat-104",
    name: "Divya Krishnan",
    phone: "9789012345",
    age: 29,
    gender: "Female",
    bloodGroup: "AB+",
    address: "24 Beach Road, Ecr",
    lastVisit: "2026-07-18",
  },
];

export const INITIAL_TOKENS: TokenRecord[] = [
  {
    tokenNumber: "TK-101",
    patientName: "Karthik Subramanian",
    patientPhone: "9876543210",
    ageGender: "38 / Male",
    visitType: "Regular Check-up",
    doctorName: "Dr. Rajesh Sharma",
    department: "General Medicine",
    consultationFee: 500,
    amount: 500,
    personsAhead: 0,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    transactionId: "TXN-98214-UPI",
    dateTime: "2026-08-03 09:15 AM",
    statusInQueue: "Serving",
  },
  {
    tokenNumber: "TK-102",
    patientName: "Lakshmi Narayanan",
    patientPhone: "9840123456",
    ageGender: "52 / Female",
    visitType: "Specific Reason",
    doctorName: "Dr. Arunkumar Natarajan",
    department: "Cardiology",
    consultationFee: 800,
    amount: 800,
    personsAhead: 1,
    paymentMethod: "Cash",
    paymentStatus: "PAID",
    dateTime: "2026-08-03 09:40 AM",
    statusInQueue: "Waiting",
  },
  {
    tokenNumber: "TK-103",
    patientName: "Suresh Kumar",
    patientPhone: "9444112233",
    ageGender: "41 / Male",
    visitType: "Emergency Care",
    doctorName: "Emergency On-Call Duty",
    department: "Emergency OPD",
    consultationFee: 1000,
    amount: 1000,
    personsAhead: 0,
    paymentMethod: "Cash",
    paymentStatus: "NOT PAID",
    dateTime: "2026-08-03 10:05 AM",
    statusInQueue: "Waiting",
    arrivalMode: "Ambulance",
  },
  {
    tokenNumber: "TK-104",
    patientName: "Divya Krishnan",
    patientPhone: "9789012345",
    ageGender: "29 / Female",
    visitType: "Regular Check-up",
    doctorName: "Dr. Rajesh Sharma",
    department: "General Medicine",
    consultationFee: 500,
    amount: 500,
    personsAhead: 2,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    transactionId: "TXN-77341-UPI",
    dateTime: "2026-08-03 10:20 AM",
    statusInQueue: "Waiting",
  },
];

// Symptom to Specialty Matching Helper
export function matchSpecialtyFromReason(reason: string): { department: string; specialty: string } {
  const lower = reason.toLowerCase();
  if (lower.includes("chest") || lower.includes("heart") || lower.includes("cardio") || lower.includes("நெஞ்சு") || lower.includes("nenju")) {
    return { department: "Cardiology", specialty: "Cardiologist" };
  }
  if (lower.includes("tooth") || lower.includes("teeth") || lower.includes("dental") || lower.includes("பல்") || lower.includes("pal")) {
    return { department: "Dentistry", specialty: "Dental Surgeon" };
  }
  if (lower.includes("kidney") || lower.includes("renal") || lower.includes("urine") || lower.includes("சிறுநீரகம்")) {
    return { department: "Nephrology", specialty: "Nephrologist" };
  }
  if (lower.includes("brain") || lower.includes("neuro") || lower.includes("headache") || lower.includes("மண்டையிடி") || lower.includes("thalaiyidi")) {
    return { department: "Neurology", specialty: "Neurologist" };
  }
  if (lower.includes("bone") || lower.includes("fracture") || lower.includes("joint") || lower.includes("எலும்பு") || lower.includes("kai kaal")) {
    return { department: "Orthopedics", specialty: "Orthopedic Surgeon" };
  }
  if (lower.includes("child") || lower.includes("baby") || lower.includes("pediatric") || lower.includes("குழந்தை")) {
    return { department: "Pediatrics", specialty: "Pediatrician" };
  }
  return { department: "General Medicine", specialty: "General Physician" };
}
