export type Lang = "en" | "ta";

export interface DoctorView {
  id: string;
  name: string;
  department: string;
  departmentTa?: string | null;
  experienceYears: number;
  consultationFee: number;
  isAvailable: boolean;
  queueCount: number;
}

export interface SymptomAnalysisResult {
  department: string;
  relatedDepartments: string[];
  confidence: "high" | "medium" | "low";
  source: "gemini" | "fallback";
}

export interface AppointmentView {
  id: string;
  token: number;
  queuePosition: number;
  doctorName: string;
  department: string;
  consultationFee: number;
  status: string;
}
