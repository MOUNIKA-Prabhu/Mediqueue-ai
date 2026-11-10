"use client";

import React, { useState, useEffect, useRef } from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { useBackGracePeriod } from "@/hooks/useBackGracePeriod";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { ArrowLeft, Stethoscope, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const SpecificReasonScreen: React.FC = () => {
  const { patientData, updatePatientData, setStep, goBack, wasBackNavigated, clearBackNavigated, t } = useKiosk();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const activeField = isKeyboardOpen ? "symptom" : null;
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const { isGracePeriodActive, secondsRemaining, completeGracePeriodEarly } = useBackGracePeriod({
    wasBackNavigated,
    clearBackNavigated,
    activeField,
  });

  const handleNext = () => {
    completeGracePeriodEarly();
    if (!patientData.symptomReason.trim()) {
      updatePatientData({ symptomReason: "Chest Pain" });
    }
    setStep("SPECIFIC_DOCTORS");
  };

  // Auto-advance after 30s if grace period elapses and symptomReason was already set
  useEffect(() => {
    if (wasBackNavigated && !isGracePeriodActive && patientData.symptomReason.trim()) {
      setStep("SPECIFIC_DOCTORS");
    }
  }, [wasBackNavigated, isGracePeriodActive, patientData.symptomReason, setStep]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      keyboardRef.current &&
      !keyboardRef.current.contains(e.target as Node)
    ) {
      setIsKeyboardOpen(false);
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10"
    >
      <HeaderKiosk />

      {/* Main Area */}
      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-3xl mx-auto w-full my-auto">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1E293B]">{t("enterReasonTitle")}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Type your health issue below (Supports English, தமிழ் & Tanglish)
          </p>
        </div>

        {/* Grace Period Active Alert */}
        {isGracePeriodActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-amber-50 px-6 py-2.5 text-xs font-extrabold text-amber-800 border border-amber-300 shadow-sm"
          >
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            Re-editing mode active ({secondsRemaining}s grace period). Tap field to edit, or click Find Specialists.
          </motion.div>
        )}

        {/* Large Text Field */}
        <div ref={containerRef} className="w-full space-y-3">
          <div className="relative flex items-center">
            <Stethoscope className="absolute left-5 h-7 w-7 text-[#F54901]" />
            <input
              type="text"
              readOnly
              value={patientData.symptomReason}
              onClick={() => setIsKeyboardOpen(true)}
              placeholder={t("enterReasonPlaceholder")}
              className="w-full rounded-3xl border-2 border-[#F54901]/40 bg-white py-5 pl-16 pr-6 text-xl md:text-2xl font-bold text-slate-800 shadow-xl outline-none ring-4 ring-orange-100 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F54901] py-4 text-xl font-black text-white shadow-xl hover:bg-orange-700 active:scale-98 transition-all"
          >
            Find Specialists <ArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* On-Demand Virtual Keyboard */}
        {isKeyboardOpen && (
          <div ref={keyboardRef} className="w-full mt-2">
            <VirtualKeyboard
              value={patientData.symptomReason}
              onChange={(val) => updatePatientData({ symptomReason: val })}
              onDone={() => setIsKeyboardOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls Row: Back button + Language Toggle */}
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto pt-2 pb-4">
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
