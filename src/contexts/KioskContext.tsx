"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Language, TRANSLATIONS } from "@/constants/translations";
import { Doctor, INITIAL_DOCTORS } from "@/constants/doctors";
import { INITIAL_TOKENS, TokenRecord, INITIAL_EXISTING_PATIENTS, PatientRecord } from "@/constants/initialData";

export type KioskStep =
  | "WELCOME"
  | "LANGUAGE"
  | "PATIENT_TYPE"
  | "NEW_PATIENT_FORM"
  | "EXISTING_PATIENT_FORM"
  | "EMERGENCY_FORM"
  | "VISIT_TYPE"
  | "REGULAR_DOCTORS"
  | "SPECIFIC_REASON"
  | "SPECIFIC_DOCTORS"
  | "TOKEN_SUMMARY"
  | "PAYMENT_METHOD"
  | "UPI_PAYMENT"
  | "CASH_PAYMENT"
  | "RECEIPT";

export type AdminView = "NONE" | "LOGIN_AS" | "DASHBOARD" | "DOCTOR_AVAILABILITY";

export interface PatientFormData {
  patientType: "NEW" | "EXISTING" | "EMERGENCY";
  name: string;
  age: string;
  address: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "";
  bloodGroup: string;
  arrivalMode: "Came By Themself" | "Ambulance";
  visitType: "Regular Check-up" | "Specific Reason" | "Emergency Care";
  symptomReason: string;
}

export interface PaymentState {
  method: "UPI" | "Cash";
  status: "PAID" | "NOT PAID";
  amount: number;
  transactionId?: string;
  tokenNumber: string;
  dateTime: string;
  personsAhead: number;
}

interface KioskContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  step: KioskStep;
  setStep: (step: KioskStep) => void;
  adminMode: AdminView;
  setAdminMode: (mode: AdminView) => void;
  userRole: "admin" | "doctor_availability" | null;
  setUserRole: (role: "admin" | "doctor_availability" | null) => void;
  patientData: PatientFormData;
  updatePatientData: (fields: Partial<PatientFormData>) => void;
  registeredPatients: PatientRecord[];
  savePatientRecord: (pData?: Partial<PatientFormData>) => Promise<void>;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doc: Doctor | null) => void;
  doctors: Doctor[];
  updateDoctor: (doc: Doctor) => void;
  addDoctor: (doc: Doctor) => void;
  removeDoctor: (docId: string) => void;
  paymentState: PaymentState | null;
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentState | null>>;
  allTokens: TokenRecord[];
  addTokenRecord: (record: TokenRecord) => void;
  updateTokenStatus: (tokenNumber: string, status: "PAID" | "NOT PAID") => void;
  goBack: () => void;
  resetToWelcome: () => void;
  wasBackNavigated: boolean;
  clearBackNavigated: () => void;
  t: (key: keyof typeof TRANSLATIONS["en"]) => string;
}

const initialPatientData: PatientFormData = {
  patientType: "NEW",
  name: "",
  age: "",
  address: "",
  phone: "",
  gender: "",
  bloodGroup: "",
  arrivalMode: "Came By Themself",
  visitType: "Regular Check-up",
  symptomReason: "",
};

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStepState] = useState<KioskStep>("WELCOME");
  const [adminMode, setAdminMode] = useState<AdminView>("NONE");
  const [userRole, setUserRole] = useState<"admin" | "doctor_availability" | null>(null);
  const [patientData, setPatientData] = useState<PatientFormData>(initialPatientData);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [allTokens, setAllTokens] = useState<TokenRecord[]>(INITIAL_TOKENS);
  const [wasBackNavigated, setWasBackNavigated] = useState<boolean>(false);

  const setStep = useCallback((newStep: KioskStep) => {
    setWasBackNavigated(false);
    setStepState(newStep);
  }, []);

  const clearBackNavigated = useCallback(() => {
    setWasBackNavigated(false);
  }, []);

  const t = useCallback(
    (key: keyof typeof TRANSLATIONS["en"]) => {
      return TRANSLATIONS[language][key] || TRANSLATIONS["en"][key] || key;
    },
    [language]
  );

  const [registeredPatients, setRegisteredPatients] = useState<PatientRecord[]>(INITIAL_EXISTING_PATIENTS);

  const savePatientRecord = useCallback(async (pData?: Partial<PatientFormData>) => {
    setPatientData((prev) => {
      const full = { ...prev, ...(pData || {}) };
      if (full.phone && full.phone.trim().length === 10) {
        const record: PatientRecord = {
          id: `pat-${Date.now()}`,
          name: full.name || "Patient",
          phone: full.phone,
          age: Number(full.age) || 30,
          gender: (full.gender as "Male" | "Female" | "Other") || "Male",
          bloodGroup: full.bloodGroup || "O+",
          address: full.address || "Chennai",
          lastVisit: new Date().toISOString().split("T")[0],
        };

        setRegisteredPatients((rPrev) => {
          const exists = rPrev.some((p) => p.phone === record.phone);
          if (exists) {
            return rPrev.map((p) => (p.phone === record.phone ? { ...p, ...record } : p));
          }
          return [record, ...rPrev];
        });

        // Async API post
        fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: record.name,
            age: record.age,
            gender: record.gender,
            phone: record.phone,
            address: record.address,
            bloodGroup: record.bloodGroup,
            emergencyContact: record.phone,
          }),
        }).catch((err) => console.warn("API patient save fallback warning:", err));
      }
      return full;
    });
  }, []);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      })
      .catch((err) => console.warn("Doctor initial fetch fallback warning:", err));
  }, []);

  const updateDoctor = useCallback((updatedDoc: Doctor) => {
    setDoctors((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    fetch(`/api/doctors/${updatedDoc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDoc),
    }).catch((err) => console.warn("API doctor update warning:", err));
  }, []);

  const addDoctor = useCallback((newDoc: Doctor) => {
    setDoctors((prev) => [...prev, newDoc]);
  }, []);

  const removeDoctor = useCallback((docId: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  const addTokenRecord = useCallback((record: TokenRecord) => {
    setAllTokens((prev) => [record, ...prev]);
  }, []);

  const updateTokenStatus = useCallback((tokenNumber: string, status: "PAID" | "NOT PAID") => {
    setAllTokens((prev) =>
      prev.map((tok) => (tok.tokenNumber === tokenNumber ? { ...tok, paymentStatus: status } : tok))
    );
  }, []);

  const resetToWelcome = useCallback(() => {
    setStepState("WELCOME");
    setAdminMode("NONE");
    setUserRole(null);
    setPatientData(initialPatientData);
    setSelectedDoctor(null);
    setPaymentState(null);
    setWasBackNavigated(false);
  }, []);

  // Ensure form state is completely reset whenever landing on the WELCOME screen by any path
  useEffect(() => {
    if (step === "WELCOME") {
      setPatientData(initialPatientData);
      setSelectedDoctor(null);
      setPaymentState(null);
      setWasBackNavigated(false);
    }
  }, [step]);

  // Back Navigation Logic
  const goBack = useCallback(() => {
    setWasBackNavigated(true);
    switch (step) {
      case "LANGUAGE":
        setStepState("WELCOME");
        break;
      case "PATIENT_TYPE":
        setStepState("LANGUAGE");
        break;
      case "NEW_PATIENT_FORM":
      case "EXISTING_PATIENT_FORM":
      case "EMERGENCY_FORM":
        setStepState("PATIENT_TYPE");
        break;
      case "VISIT_TYPE":
        if (patientData.patientType === "EXISTING") setStepState("EXISTING_PATIENT_FORM");
        else setStepState("NEW_PATIENT_FORM");
        break;
      case "REGULAR_DOCTORS":
      case "SPECIFIC_REASON":
        setStepState("VISIT_TYPE");
        break;
      case "SPECIFIC_DOCTORS":
        setStepState("SPECIFIC_REASON");
        break;
      case "TOKEN_SUMMARY":
        if (patientData.patientType === "EMERGENCY") {
          setStepState("EMERGENCY_FORM");
        } else if (patientData.visitType === "Specific Reason") {
          setStepState("SPECIFIC_DOCTORS");
        } else {
          setStepState("REGULAR_DOCTORS");
        }
        break;
      case "PAYMENT_METHOD":
        setStepState("TOKEN_SUMMARY");
        break;
      case "UPI_PAYMENT":
      case "CASH_PAYMENT":
        setStepState("PAYMENT_METHOD");
        break;
      default:
        break;
    }
  }, [step, patientData.patientType, patientData.visitType]);

  // App-wide 60-Second Idle Timeout Logic with Throttled Mousemove (Excludes UPI_PAYMENT screen)
  useEffect(() => {
    if ((step === "WELCOME" && adminMode === "NONE") || step === "UPI_PAYMENT") {
      return;
    }

    let idleTimer: NodeJS.Timeout;
    let lastMouseMoveTime = 0;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        resetToWelcome();
      }, 60000); // 60 seconds (1 minute) idle timeout
    };

    const handleThrottledMouseMove = () => {
      const now = Date.now();
      if (now - lastMouseMoveTime > 1000) {
        lastMouseMoveTime = now;
        resetIdleTimer();
      }
    };

    // Initial timer start
    resetIdleTimer();

    // Discrete interaction events
    const discreteEvents = ["mousedown", "keypress", "keydown", "scroll", "touchstart", "click", "pointerdown"];
    discreteEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer));

    // Throttled mousemove
    window.addEventListener("mousemove", handleThrottledMouseMove);

    return () => {
      clearTimeout(idleTimer);
      discreteEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      window.removeEventListener("mousemove", handleThrottledMouseMove);
    };
  }, [step, adminMode, resetToWelcome]);

  const updatePatientData = useCallback((fields: Partial<PatientFormData>) => {
    setPatientData((prev) => ({ ...prev, ...fields }));
  }, []);

  return (
    <KioskContext.Provider
      value={{
        language,
        setLanguage,
        step,
        setStep,
        adminMode,
        setAdminMode,
        userRole,
        setUserRole,
        patientData,
        updatePatientData,
        registeredPatients,
        savePatientRecord,
        selectedDoctor,
        setSelectedDoctor,
        doctors,
        updateDoctor,
        addDoctor,
        removeDoctor,
        paymentState,
        setPaymentState,
        allTokens,
        addTokenRecord,
        updateTokenStatus,
        goBack,
        resetToWelcome,
        wasBackNavigated,
        clearBackNavigated,
        t,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error("useKiosk must be used within a KioskProvider");
  }
  return context;
};
