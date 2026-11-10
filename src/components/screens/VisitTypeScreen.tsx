"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { useBackGracePeriod } from "@/hooks/useBackGracePeriod";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Stethoscope, ClipboardList, ArrowLeft, Clock } from "lucide-react";

export const VisitTypeScreen: React.FC = () => {
  const { patientData, setStep, updatePatientData, goBack, wasBackNavigated, clearBackNavigated, t } = useKiosk();

  const { isGracePeriodActive, secondsRemaining, completeGracePeriodEarly } = useBackGracePeriod({
    wasBackNavigated,
    clearBackNavigated,
  });

  const handleSelectVisitType = (type: "Regular Check-up" | "Specific Reason") => {
    completeGracePeriodEarly();
    updatePatientData({ visitType: type });
    if (type === "Regular Check-up") {
      setStep("REGULAR_DOCTORS");
    } else {
      setStep("SPECIFIC_REASON");
    }
  };

  // Auto-advance after 30s if grace period elapses and visitType was already set from before
  useEffect(() => {
    if (wasBackNavigated && !isGracePeriodActive && patientData.visitType) {
      if (patientData.visitType === "Regular Check-up") {
        setStep("REGULAR_DOCTORS");
      } else if (patientData.visitType === "Specific Reason") {
        setStep("SPECIFIC_REASON");
      }
    }
  }, [wasBackNavigated, isGracePeriodActive, patientData.visitType, setStep]);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 my-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight">
            {t("visitTypeTitle")}
          </h2>
          <p className="mt-2 text-lg text-slate-500 font-medium">
            Choose the option that best describes your consultation today
          </p>
        </div>

        {/* Grace Period Active Indicator */}
        {isGracePeriodActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-amber-50 px-6 py-2.5 text-xs font-extrabold text-amber-800 border border-amber-300 shadow-sm"
          >
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            Re-editing mode active ({secondsRemaining}s grace period). Select a visit type to proceed.
          </motion.div>
        )}

        {/* 2 Large Cards */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Regular Check-up Card (#0141AB) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectVisitType("Regular Check-up")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#0141AB] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0141AB] text-white shadow-lg shadow-[#0141AB]/30 group-hover:scale-110 transition-transform">
              <Stethoscope className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("regularCheckup")}</h3>
              <p className="text-sm font-semibold text-[#0141AB]">{t("regularCheckupSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#0141AB] py-4 text-base font-bold text-white shadow-md">
              Select
            </div>
          </motion.div>

          {/* Specific Reason Card (#F54901) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectVisitType("Specific Reason")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#F54901] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F54901] text-white shadow-lg shadow-[#F54901]/30 group-hover:scale-110 transition-transform">
              <ClipboardList className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("specificReason")}</h3>
              <p className="text-sm font-semibold text-[#F54901]">{t("specificReasonSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#F54901] py-4 text-base font-bold text-white shadow-md">
              Select
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Controls Row: Back button + Language Toggle */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto pt-2 pb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-md hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="h-5 w-5" /> {t("back")}
        </button>

        <LanguageToggle />
      </div>
    </div>
  );
};
