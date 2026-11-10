"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { useBackGracePeriod } from "@/hooks/useBackGracePeriod";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { VirtualNumpad } from "@/components/VirtualNumpad";
import { ArrowLeft, User, Phone, Calendar, Footprints, Ambulance, Clock } from "lucide-react";

export const EmergencyPatientForm: React.FC = () => {
  const { patientData, updatePatientData, savePatientRecord, setSelectedDoctor, setStep, goBack, wasBackNavigated, clearBackNavigated, t } = useKiosk();
  const [activeField, setActiveField] = useState<"name" | "age" | "phone" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const { isGracePeriodActive, secondsRemaining, completeGracePeriodEarly, markEditingStarted } = useBackGracePeriod({
    wasBackNavigated,
    clearBackNavigated,
    activeField,
  });

  const handleSelectArrival = (mode: "Came By Themself" | "Ambulance") => {
    completeGracePeriodEarly();
    const finalName = patientData.name.trim() || "Emergency Patient";
    const finalPhone = patientData.phone.trim() || "9999999999";
    const finalAge = patientData.age.trim() || "40";

    const emergencyPayload = {
      patientType: "EMERGENCY" as const,
      name: finalName,
      phone: finalPhone,
      age: finalAge,
      gender: patientData.gender || "Male",
      bloodGroup: patientData.bloodGroup || "O+",
      address: "Emergency Bay",
      arrivalMode: mode,
      visitType: "Emergency Care" as const,
    };

    updatePatientData(emergencyPayload);
    savePatientRecord(emergencyPayload);

    // Auto assign Emergency doctor record
    setSelectedDoctor({
      id: "doc-emergency",
      name: "Emergency On-Call Duty Doctor",
      department: "Emergency OPD",
      specialty: "Emergency Specialist",
      queueCount: 0,
      available: true,
      availabilityTime: "Immediate Care",
      consultingFee: mode === "Ambulance" ? 1000 : 750,
      room: "Triage / Emergency Bay 1",
      arrivalTime: "24/7 Duty",
      endTime: "24/7 Duty",
    });

    // Emergency patients skip doctor-recommendation flow and go straight to Token Summary / Payment Method
    setActiveField(null);
    setStep("TOKEN_SUMMARY");
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
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

      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-4xl mx-auto w-full my-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFEBEA] px-4 py-1.5 text-xs font-black text-[#F54901] border border-[#F54901]/30">
            <Ambulance className="h-4 w-4" /> URGENT CARE REGISTRATION
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] mt-2">{t("emergencyPatient")}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Fill basic details and select arrival mode for priority dispatch
          </p>
        </div>

        {/* Inputs Grid */}
        <div ref={containerRef} className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 bg-white/90 p-6 rounded-3xl shadow-xl border border-slate-200">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#F54901]" /> {t("fullName")}
            </label>
            <input
              type="text"
              readOnly
              value={patientData.name}
              onClick={() => setActiveField("name")}
              placeholder="e.g., Suresh Kumar"
              className={`w-full rounded-2xl px-4 py-3 text-base font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "name"
                  ? "border-[#F54901] bg-orange-50/50 ring-4 ring-orange-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-[#F54901]" /> {t("phoneNumber")}
            </label>
            <input
              type="text"
              readOnly
              value={patientData.phone}
              onClick={() => setActiveField("phone")}
              placeholder="10 Digits"
              className={`w-full rounded-2xl px-4 py-3 text-base font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "phone"
                  ? "border-[#F54901] bg-orange-50/50 ring-4 ring-orange-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#F54901]" /> {t("age")}
            </label>
            <input
              type="text"
              readOnly
              value={patientData.age}
              onClick={() => setActiveField("age")}
              placeholder="Age"
              className={`w-full rounded-2xl px-4 py-3 text-base font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "age"
                  ? "border-[#F54901] bg-orange-50/50 ring-4 ring-orange-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* Gender (Rounded-Rectangle Buttons in 1 Row) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t("gender")}
            </label>
            <div className="grid grid-cols-3 gap-3 w-full">
              {(["Male", "Female", "Other"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    markEditingStarted();
                    updatePatientData({ gender: g });
                    completeGracePeriodEarly();
                  }}
                  className={`w-full rounded-2xl py-3 px-3 text-sm font-extrabold border-2 transition-all cursor-pointer shadow-sm text-center ${
                    patientData.gender === g
                      ? "bg-[#F54901] text-white border-[#F54901] shadow-md scale-[1.02]"
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {g === "Male" ? t("male") : g === "Female" ? t("female") : t("other")}
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

        {/* Arrival Mode Selection Cards */}
        <div className="flex flex-col gap-3 w-full">
          <label className="text-sm font-extrabold uppercase tracking-wider text-slate-700 text-center">
            Select {t("arrivalMode")} (Auto-Advances to Payment)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Came By Themself (#216830) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectArrival("Came By Themself")}
              className="cursor-pointer flex items-center gap-4 rounded-3xl bg-white p-5 border-2 border-slate-200 hover:border-[#216830] shadow-md transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#216830] text-white shadow-md">
                <Footprints className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-[#1E293B]">{t("cameByThemself")}</h4>
                <p className="text-xs font-semibold text-[#216830]">{t("cameByThemselfSub")}</p>
              </div>
            </motion.div>

            {/* Ambulance (#F54901) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectArrival("Ambulance")}
              className="cursor-pointer flex items-center gap-4 rounded-3xl bg-white p-5 border-2 border-slate-200 hover:border-[#F54901] shadow-md transition-all"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F54901] text-white shadow-md">
                <Ambulance className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-[#1E293B]">{t("ambulance")}</h4>
                <p className="text-xs font-semibold text-[#F54901]">{t("ambulanceSub")}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* On-Demand Keyboard / Numpad Panel */}
        {activeField && (
          <div ref={keyboardRef} className="w-full mt-2">
            {activeField === "name" ? (
              <VirtualKeyboard
                value={patientData.name}
                onChange={(val) => updatePatientData({ name: val })}
                onDone={() => setActiveField(null)}
              />
            ) : (
              <VirtualNumpad
                value={activeField === "age" ? patientData.age : patientData.phone}
                maxLength={activeField === "phone" ? 10 : 3}
                onChange={(val) =>
                  activeField === "age"
                    ? updatePatientData({ age: val })
                    : updatePatientData({ phone: val })
                }
                onDone={() => setActiveField(null)}
              />
            )}
          </div>
        )}
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
