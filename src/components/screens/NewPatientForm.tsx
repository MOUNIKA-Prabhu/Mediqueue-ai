"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { useBackGracePeriod } from "@/hooks/useBackGracePeriod";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { VirtualNumpad } from "@/components/VirtualNumpad";
import { ArrowLeft, User, Calendar, MapPin, Phone, CheckCircle, Clock } from "lucide-react";

export const NewPatientForm: React.FC = () => {
  const { patientData, updatePatientData, savePatientRecord, setStep, goBack, wasBackNavigated, clearBackNavigated, t } = useKiosk();
  const [activeField, setActiveField] = useState<"name" | "age" | "address" | "phone" | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const { isGracePeriodActive, secondsRemaining, completeGracePeriodEarly, markEditingStarted } = useBackGracePeriod({
    wasBackNavigated,
    clearBackNavigated,
    activeField,
  });

  const handleFieldEdit = (fields: Partial<typeof patientData>) => {
    markEditingStarted();
    updatePatientData(fields);
  };

  const handleGenderSelect = (g: "Male" | "Female" | "Other") => {
    handleFieldEdit({ gender: g });
    completeGracePeriodEarly();
  };

  const handleBloodGroupSelect = (bg: string) => {
    handleFieldEdit({ bloodGroup: bg });
    completeGracePeriodEarly();
  };

  const isFormValid =
    patientData.name.trim().length >= 2 &&
    patientData.age.trim().length >= 1 &&
    patientData.address.trim().length >= 3 &&
    patientData.phone.trim().length === 10 &&
    patientData.gender !== "" &&
    patientData.bloodGroup !== "";

  // Auto-advance when all fields are valid and not suspended by Back grace period
  useEffect(() => {
    if (isFormValid && !isGracePeriodActive) {
      savePatientRecord();
      setActiveField(null); // Auto-dismiss virtual keyboard when advancing
      const timer = setTimeout(() => {
        setStep("VISIT_TYPE");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isFormValid, isGracePeriodActive, setStep, savePatientRecord]);

  // Close keyboard when tapping outside inputs & keyboard area
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (
      formRef.current &&
      !formRef.current.contains(e.target as Node) &&
      keyboardRef.current &&
      !keyboardRef.current.contains(e.target as Node)
    ) {
      setActiveField(null);
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10"
    >
      <HeaderKiosk />

      {/* Main Container */}
      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-5xl mx-auto w-full my-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1E293B]">{t("newPatient")} — Registration</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Tap any field to open the touchscreen virtual keyboard
          </p>
        </div>

        {/* 2-Column Horizontal Form Grid */}
        <div
          ref={formRef}
          className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-200"
        >
          {/* 1. Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#0141AB]" /> {t("fullName")} *
            </label>
            <input
              type="text"
              readOnly
              value={patientData.name}
              onClick={() => setActiveField("name")}
              placeholder="Tap to enter full name"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "name"
                  ? "border-[#0141AB] bg-blue-50/50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* 2. Age */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0141AB]" /> {t("age")} *
            </label>
            <input
              type="text"
              readOnly
              value={patientData.age}
              onClick={() => setActiveField("age")}
              placeholder="e.g., 34"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "age"
                  ? "border-[#0141AB] bg-blue-50/50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* 3. Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#0141AB]" /> {t("address")} *
            </label>
            <input
              type="text"
              readOnly
              value={patientData.address}
              onClick={() => setActiveField("address")}
              placeholder="Tap to enter address"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "address"
                  ? "border-[#0141AB] bg-blue-50/50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* 4. Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-[#0141AB]" /> {t("phoneNumber")} (10 Digits) *
            </label>
            <input
              type="text"
              readOnly
              value={patientData.phone}
              onClick={() => setActiveField("phone")}
              placeholder="9876543210"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "phone"
                  ? "border-[#0141AB] bg-blue-50/50 ring-4 ring-blue-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* 5. Gender (Rounded-Rectangle Buttons in 1 Row) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t("gender")} *
            </label>
            <div className="grid grid-cols-3 gap-3 w-full">
              {(["Male", "Female", "Other"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`w-full rounded-2xl py-3.5 px-4 text-base font-extrabold border-2 transition-all cursor-pointer shadow-sm text-center ${
                    patientData.gender === g
                      ? "bg-[#0141AB] text-white border-[#0141AB] shadow-md scale-[1.02]"
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {g === "Male" ? t("male") : g === "Female" ? t("female") : t("other")}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Blood Group (Rounded-Rectangle Button Grid) */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t("bloodGroup")} *
            </label>
            <div className="flex flex-wrap gap-2.5 w-full">
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"].map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => handleBloodGroupSelect(bg)}
                  className={`min-w-[76px] flex-1 sm:flex-none rounded-2xl py-3 px-4 text-base font-extrabold border-2 transition-all cursor-pointer shadow-sm text-center ${
                    patientData.bloodGroup === bg
                      ? "bg-[#0141AB] text-white border-[#0141AB] shadow-md scale-[1.02]"
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back Navigation Grace Period Active Alert */}
        {isGracePeriodActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-amber-50 px-6 py-2.5 text-xs font-extrabold text-amber-800 border border-amber-300 shadow-sm"
          >
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            Re-editing mode active ({secondsRemaining}s grace period). Tap any field to make changes before auto-advancing.
          </motion.div>
        )}

        {/* Auto-Advance Validation Status Strip */}
        {isFormValid && !isGracePeriodActive && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 rounded-full bg-[#EBF9EC] px-6 py-2 text-sm font-bold text-[#216830] border border-[#216830]/20 shadow-sm"
          >
            <CheckCircle className="h-5 w-5 text-[#216830]" />
            Form complete! Auto-advancing to Visit Type...
          </motion.div>
        )}

        {/* On-Demand Virtual Keyboard / Numpad Panel */}
        <div ref={keyboardRef} className="w-full mt-2">
          <AnimatePresence mode="wait">
            {(activeField === "name" || activeField === "address") && (
              <motion.div
                key="keyboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <VirtualKeyboard
                  value={activeField === "name" ? patientData.name : patientData.address}
                  onChange={(val) =>
                    activeField === "name"
                      ? handleFieldEdit({ name: val })
                      : handleFieldEdit({ address: val })
                  }
                  onDone={() => setActiveField(null)}
                />
              </motion.div>
            )}

            {(activeField === "age" || activeField === "phone") && (
              <motion.div
                key="numpad"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <VirtualNumpad
                  value={activeField === "age" ? patientData.age : patientData.phone}
                  maxLength={activeField === "phone" ? 10 : 3}
                  onChange={(val) =>
                    activeField === "age"
                      ? handleFieldEdit({ age: val })
                      : handleFieldEdit({ phone: val })
                  }
                  onDone={() => setActiveField(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls Row: Back button + Language Toggle */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto pt-2 pb-4">
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
