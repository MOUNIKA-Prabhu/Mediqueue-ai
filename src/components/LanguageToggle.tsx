"use client";

import React from "react";
import { useKiosk } from "@/contexts/KioskContext";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useKiosk();

  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 shadow-inner border border-slate-200 select-none">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-4 py-1.5 text-xs md:text-sm font-extrabold transition-all duration-200 ${
          language === "en"
            ? "bg-[#0141AB] text-white shadow-md"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ta")}
        className={`rounded-full px-4 py-1.5 text-xs md:text-sm font-extrabold transition-all duration-200 ${
          language === "ta"
            ? "bg-[#0141AB] text-white shadow-md"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageToggle;
