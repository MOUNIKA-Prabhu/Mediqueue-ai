"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { Language } from "@/constants/translations";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const LanguageScreen: React.FC = () => {
  const { language, setLanguage, setStep, goBack, t } = useKiosk();
  const [justSelected, setJustSelected] = useState<boolean>(false);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setJustSelected(true);
    setTimeout(() => {
      setStep("PATIENT_TYPE");
    }, 400); // Smooth auto-advance after brief confirmation
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      {/* Top Header with invisible double tap enabled */}
      <HeaderKiosk enableDoubleTapAdmin={true} />

      {/* Main Center Area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight">
            {t("chooseLanguage")}
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            மொழியைத் தேர்ந்தெடுக்கவும் / Select your preferred language
          </p>
        </motion.div>

        {/* Large Kiosk-Friendly Pill Toggle Switch */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex w-full max-w-lg items-center rounded-full bg-slate-100 p-2 shadow-inner border border-slate-300"
        >
          {/* Active Slider indicator */}
          <div
            className={`absolute top-2 bottom-2 w-[calc(50%-8px)] rounded-full bg-[#0141AB] shadow-lg transition-all duration-300 ${
              language === "en" ? "left-2" : "left-[calc(50%+4px)]"
            }`}
          />

          <button
            type="button"
            onClick={() => handleSelectLanguage("en")}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-6 text-2xl md:text-3xl font-extrabold transition-colors ${
              language === "en" ? "text-white" : "text-slate-700"
            }`}
          >
            English
            {language === "en" && justSelected && <CheckCircle2 className="h-7 w-7 text-emerald-300" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectLanguage("ta")}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-6 text-2xl md:text-3xl font-extrabold transition-colors ${
              language === "ta" ? "text-white" : "text-slate-700"
            }`}
          >
            தமிழ்
            {language === "ta" && justSelected && <CheckCircle2 className="h-7 w-7 text-emerald-300" />}
          </button>
        </motion.div>
      </div>

      {/* Bottom Centered Back Button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-md hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="h-5 w-5" /> {t("back")}
        </button>
      </div>
    </div>
  );
};
