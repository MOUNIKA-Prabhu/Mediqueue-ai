"use client";

import React from "react";
import { KioskProvider, useKiosk } from "@/contexts/KioskContext";
import { AmbientBackground } from "@/components/AmbientBackground";

// Kiosk Screens
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { LanguageScreen } from "@/components/screens/LanguageScreen";
import { PatientTypeScreen } from "@/components/screens/PatientTypeScreen";
import { NewPatientForm } from "@/components/screens/NewPatientForm";
import { ExistingPatientForm } from "@/components/screens/ExistingPatientForm";
import { EmergencyPatientForm } from "@/components/screens/EmergencyPatientForm";
import { VisitTypeScreen } from "@/components/screens/VisitTypeScreen";
import { RegularDoctorScreen } from "@/components/screens/RegularDoctorScreen";
import { SpecificReasonScreen } from "@/components/screens/SpecificReasonScreen";
import { RecommendedDoctorScreen } from "@/components/screens/RecommendedDoctorScreen";
import { TokenSummaryScreen } from "@/components/screens/TokenSummaryScreen";
import { PaymentMethodScreen } from "@/components/screens/PaymentMethodScreen";
import { UpiPaymentScreen } from "@/components/screens/UpiPaymentScreen";
import { CashPaymentScreen } from "@/components/screens/CashPaymentScreen";
import { ReceiptScreen } from "@/components/screens/ReceiptScreen";

// Admin Screens
import { LoginAsScreen } from "@/components/admin/LoginAsScreen";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { DoctorAvailabilityScreen } from "@/components/admin/DoctorAvailabilityScreen";

function MainKioskRouter() {
  const { step, adminMode } = useKiosk();

  // Admin Portal Views
  if (adminMode === "LOGIN_AS") {
    return <LoginAsScreen />;
  }

  if (adminMode === "DASHBOARD") {
    return <AdminDashboard />;
  }

  if (adminMode === "DOCTOR_AVAILABILITY") {
    return <DoctorAvailabilityScreen />;
  }

  // Standard Patient Kiosk Flow
  return (
    <main className="relative min-h-screen w-full bg-white text-slate-800 overflow-x-hidden">
      {/* Ambient background animations for every screen after Welcome Screen */}
      {step !== "WELCOME" && <AmbientBackground />}

      {step === "WELCOME" && <WelcomeScreen />}
      {step === "LANGUAGE" && <LanguageScreen />}
      {step === "PATIENT_TYPE" && <PatientTypeScreen />}
      {step === "NEW_PATIENT_FORM" && <NewPatientForm />}
      {step === "EXISTING_PATIENT_FORM" && <ExistingPatientForm />}
      {step === "EMERGENCY_FORM" && <EmergencyPatientForm />}
      {step === "VISIT_TYPE" && <VisitTypeScreen />}
      {step === "REGULAR_DOCTORS" && <RegularDoctorScreen />}
      {step === "SPECIFIC_REASON" && <SpecificReasonScreen />}
      {step === "SPECIFIC_DOCTORS" && <RecommendedDoctorScreen />}
      {step === "TOKEN_SUMMARY" && <TokenSummaryScreen />}
      {step === "PAYMENT_METHOD" && <PaymentMethodScreen />}
      {step === "UPI_PAYMENT" && <UpiPaymentScreen />}
      {step === "CASH_PAYMENT" && <CashPaymentScreen />}
      {step === "RECEIPT" && <ReceiptScreen />}
    </main>
  );
}

export default function App() {
  return (
    <KioskProvider>
      <MainKioskRouter />
    </KioskProvider>
  );
}
