"use client";

import React, { useState, useEffect, useRef } from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { Activity } from "lucide-react";

interface HeaderKioskProps {
  showDateTime?: boolean;
  enableDoubleTapAdmin?: boolean;
  enableTripleTapAdmin?: boolean; // Kept for backwards compatibility
}

export const HeaderKiosk: React.FC<HeaderKioskProps> = ({
  showDateTime = true,
  enableDoubleTapAdmin = false,
  enableTripleTapAdmin = false,
}) => {
  const { setAdminMode } = useKiosk();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const tapTimestampsRef = useRef<number[]>([]);

  const isTapEnabled = enableDoubleTapAdmin || enableTripleTapAdmin;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDoubleTap = () => {
    if (!isTapEnabled) return;
    const now = Date.now();
    // Keep taps within the last 2000ms (2 seconds)
    const recentTaps = [...tapTimestampsRef.current, now].filter((t) => now - t <= 2000);
    tapTimestampsRef.current = recentTaps;

    // Trigger admin login-as screen on 2 taps
    if (recentTaps.length >= 2) {
      tapTimestampsRef.current = [];
      setAdminMode("LOGIN_AS");
    }
  };

  return (
    <header className="relative z-20 flex w-full items-center justify-between px-6 py-4 md:px-12 md:py-6">
      {/* Invisible 100x100px Double-Tap/Click Area for Admin Login-As on Language Screen */}
      {isTapEnabled && (
        <div
          onClick={handleDoubleTap}
          className="fixed top-0 left-0 w-[100px] h-[100px] cursor-pointer select-none opacity-0 z-[9999]"
          title="Admin Access (Double Click / Tap)"
        />
      )}

      {/* MediQueue Logo Top-Left */}
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0141AB] to-[#216830] text-white shadow-md">
          <Activity className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#1E293B] md:text-2xl">
            Medi<span className="text-[#0141AB]">Queue</span>
          </h1>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Smart Hospital Kiosk
          </p>
        </div>
      </div>

      {/* Right Controls: Date/Time */}
      <div className="flex items-center gap-4 md:gap-6 select-none">
        {showDateTime && (
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold text-[#1E293B]">{currentTime}</div>
            <div className="text-xs font-medium text-slate-500">{currentDate}</div>
          </div>
        )}
      </div>
    </header>
  );
};

