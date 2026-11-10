"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UserPlus, UserCheck, Ambulance, ArrowLeft } from "lucide-react";

export const PatientTypeScreen: React.FC = () => {
  const { setStep, updatePatientData, goBack, t } = useKiosk();

  const handleSelectType = (type: "NEW" | "EXISTING" | "EMERGENCY") => {
    updatePatientData({
      patientType: type,
      name: "",
      age: "",
      address: "",
      phone: "",
      gender: "",
      bloodGroup: "",
      symptomReason: "",
    });
    if (type === "NEW") {
      setStep("NEW_PATIENT_FORM");
    } else if (type === "EXISTING") {
      setStep("EXISTING_PATIENT_FORM");
    } else {
      setStep("EMERGENCY_FORM");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      {/* Main Container */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 my-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight">
            {t("patientTypeTitle")}
          </h2>
          <p className="mt-2 text-lg text-slate-500 font-medium">
            {t("patientTypeSubtitle")}
          </p>
        </div>

        {/* 3 Large Cards Side-by-Side */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {/* New Patient Card (#0141AB) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectType("NEW")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#0141AB] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0141AB] text-white shadow-lg shadow-[#0141AB]/30 group-hover:scale-110 transition-transform">
              <UserPlus className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("newPatient")}</h3>
              <p className="text-base font-semibold text-[#0141AB]">{t("newPatientSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#0141AB] py-4 text-base font-bold text-white shadow-md">
              Select
            </div>
          </motion.div>

          {/* Existing Patient Card (#216830) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectType("EXISTING")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#216830] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#216830] text-white shadow-lg shadow-[#216830]/30 group-hover:scale-110 transition-transform">
              <UserCheck className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("existingPatient")}</h3>
              <p className="text-base font-semibold text-[#216830]">{t("existingPatientSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#216830] py-4 text-base font-bold text-white shadow-md">
              Select
            </div>
          </motion.div>

          {/* Emergency Patient Card (#F54901) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectType("EMERGENCY")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#F54901] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F54901] text-white shadow-lg shadow-[#F54901]/30 group-hover:scale-110 transition-transform">
              <Ambulance className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("emergencyPatient")}</h3>
              <p className="text-base font-semibold text-[#F54901]">{t("emergencyPatientSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#F54901] py-4 text-base font-bold text-white shadow-md">
              Select
            </div>
          </motion.div>
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
