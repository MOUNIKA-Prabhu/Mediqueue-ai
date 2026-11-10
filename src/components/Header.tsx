"use client";

import React from "react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { lang } = useLanguage();

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
          +
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {lang === "ta" ? "மெடிகியூ AI மருத்துவமனை" : "MediQueue AI Hospital"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === "ta" ? "தன்னியக்க சேவை மையம்" : "Smart Self-Service Kiosk"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSelector />
      </div>
    </header>
  );
}
