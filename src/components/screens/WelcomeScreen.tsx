"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { Activity, Pointer } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const { setStep, t } = useKiosk();

  const handleTouchAnywhere = () => {
    try {
      if (typeof document !== "undefined" && document.fullscreenEnabled && !document.fullscreenElement) {
        const req = document.documentElement.requestFullscreen();
        if (req && typeof req.catch === "function") {
          req.catch(() => {
            // Ignore fullscreen rejection silently
          });
        }
      }
    } catch {
      // Fail silently if not supported or disallowed
    }
    setStep("LANGUAGE");
  };

  return (
    <div
      onClick={handleTouchAnywhere}
      className="relative flex min-h-screen w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#00112B] px-6 py-12 select-none"
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#0141AB]/20 to-[#22C55E]/10 blur-3xl pointer-events-none" />

      {/* Top Header Placeholder spacing */}
      <div className="w-full text-center">
        <span className="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-400 uppercase backdrop-blur-sm border border-white/10">
          MediQueue Hospital Kiosk System
        </span>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-xl">
        {/* Logo with ECG line */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0141AB] to-[#216830] shadow-2xl ring-4 ring-white/10"
        >
          <Activity className="h-16 w-16 text-white" />
        </motion.div>

        {/* Hospital Titles */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("hospitalName")}
          </h1>
          <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-slate-400 uppercase">
            {t("kioskSubtitle")}
          </h2>
        </div>

        {/* Pulsing Touch Icon & Action Text in #22C55E */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 flex flex-col items-center gap-4"
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E]/40 text-[#22C55E] shadow-lg shadow-[#22C55E]/20">
            <span className="absolute inset-0 rounded-full bg-[#22C55E]/30 animate-ping opacity-75" />
            <Pointer className="relative z-10 h-10 w-10 text-[#22C55E] -rotate-12" />
          </div>
          <p className="text-xl md:text-2xl font-black tracking-wider text-[#22C55E]">
            {t("touchToBegin")}
          </p>
        </motion.div>
      </div>

      {/* Bottom Animated ECG Line in #22C55E */}
      <div className="relative z-10 w-full overflow-hidden opacity-90 py-4">
        <motion.div
          className="flex w-[200%]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <svg className="h-14 w-1/2" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M 0 50 L 300 50 L 320 20 L 335 90 L 350 10 L 370 70 L 385 50 L 700 50 L 720 20 L 735 90 L 750 10 L 770 70 L 785 50 L 1000 50"
              fill="none"
              stroke="#22C55E"
              strokeWidth="4"
            />
          </svg>
          <svg className="h-14 w-1/2" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M 0 50 L 300 50 L 320 20 L 335 90 L 350 10 L 370 70 L 385 50 L 700 50 L 720 20 L 735 90 L 750 10 L 770 70 L 785 50 L 1000 50"
              fill="none"
              stroke="#22C55E"
              strokeWidth="4"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
