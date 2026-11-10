"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface DraftPatient {
  patientId?: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  visitType?: "REGULAR_CHECKUP" | "SPECIFIC_REASON";
  symptomText?: string;
  aiDepartment?: string;
  aiRelated?: string[];
  isExisting?: boolean;
}

interface PatientContextValue {
  patient: DraftPatient | null;
  setPatient: (p: DraftPatient | null) => void;
  updatePatient: (patch: Partial<DraftPatient>) => void;
}

const PatientContext = createContext<PatientContextValue | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<DraftPatient | null>(null);

  const updatePatient = (patch: Partial<DraftPatient>) => {
    setPatient((prev) => (prev ? { ...prev, ...patch } : (patch as DraftPatient)));
  };

  return (
    <PatientContext.Provider value={{ patient, setPatient, updatePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    return {
      patient: null,
      setPatient: () => {},
      updatePatient: () => {},
    };
  }
  return ctx;
}
