"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-4 px-6 border-t border-slate-800 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>
          {lang === "ta"
            ? "அமைப்புகள் இயல்பாக இயங்குகின்றன"
            : "MediQueue Systems Operational"}
        </span>
      </div>
      <div>
        {lang === "ta"
          ? "அவசர உதவி: 108 | மருத்துவமனை வரவேற்பு: 0422-290090"
          : "Emergency: 108 | Reception: 0422-290090"}
      </div>
      <div>
        &copy; {new Date().getFullYear()} MediQueue AI. All rights reserved.
      </div>
    </footer>
  );
}
