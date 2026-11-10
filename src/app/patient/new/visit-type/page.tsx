"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/contexts/PatientContext";
import GlassCard from "@/components/GlassCard";
import BackButton from "@/components/BackButton";

export default function VisitTypePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { patient, updatePatient } = usePatient();

  useEffect(() => {
    if (!patient) {
      router.replace("/patient/new");
    }
  }, [patient, router]);

  if (!patient) {
    return null;
  }

  const isNewFlag = patient.isExisting ? "0" : "1";

  const choose = (visitType: "REGULAR_CHECKUP" | "SPECIFIC_REASON") => {
    updatePatient({ visitType });
    if (visitType === "REGULAR_CHECKUP") {
      router.push(`/doctors?department=General%20Medicine&isNew=${isNewFlag}`);
    } else {
      router.push("/patient/new/symptoms");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <BackButton fallbackHref="/patient-type" />
      <GlassCard className="w-full max-w-xl">
        <h1 className="mb-8 text-center text-kiosk-lg font-bold text-slate-800">
          {t("visitType")}
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <button
            onClick={() => choose("REGULAR_CHECKUP")}
            className="rounded-3xl bg-brand-blue px-6 py-10 text-kiosk-base font-bold text-white shadow-xl transition-transform hover:scale-105"
          >
            {t("regularCheckup")}
          </button>
          <button
            onClick={() => choose("SPECIFIC_REASON")}
            className="rounded-3xl bg-brand-yellow px-6 py-10 text-kiosk-base font-bold text-white shadow-xl transition-transform hover:scale-105"
          >
            {t("specificReason")}
          </button>
        </div>
      </GlassCard>
    </main>
  );
}
