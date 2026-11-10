"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { PasswordModal } from "./PasswordModal";
import { User, ShieldCheck, Stethoscope, ArrowRight, ArrowLeft, Activity } from "lucide-react";

export const LoginAsScreen: React.FC = () => {
  const { setStep, setAdminMode, setUserRole } = useKiosk();
  const [modalTarget, setModalTarget] = useState<"DASHBOARD" | "DOCTOR_AVAILABILITY" | null>(null);

  const handleUserLogin = () => {
    setUserRole(null);
    setAdminMode("NONE");
    setStep("PATIENT_TYPE");
  };

  const handleModalSuccess = () => {
    if (modalTarget === "DASHBOARD") {
      setAdminMode("DASHBOARD");
    } else if (modalTarget === "DOCTOR_AVAILABILITY") {
      setAdminMode("DOCTOR_AVAILABILITY");
    }
    setModalTarget(null);
  };

  const handleBackToKiosk = () => {
    setUserRole(null);
    setAdminMode("NONE");
    setStep("LANGUAGE");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-white p-6 md:p-12 select-none">
      {/* Centered MediQueue Logo */}
      <div className="flex flex-col items-center gap-3 text-center pt-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#067E7F] to-[#015E66] text-white shadow-xl">
          <Activity className="h-9 w-9 text-white" />
        </div>
        <h1 className="text-3xl font-black text-[#1E293B]">
          Medi<span className="text-[#067E7F]">Queue</span>
        </h1>
        <span className="text-xs font-extrabold tracking-widest text-[#067E7F] uppercase bg-teal-50 px-4 py-1 rounded-full border border-teal-200">
          Admin Portal Select
        </span>
      </div>

      {/* 3 Solid Teal (#067E7F) Cards in a row */}
      <div className="mx-auto w-full max-w-5xl my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: User */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUserLogin}
            className="cursor-pointer flex flex-col justify-between rounded-3xl bg-[#067E7F] p-8 text-white shadow-2xl transition-all"
          >
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#067E7F] shadow-lg">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black mt-6">User / Kiosk Mode</h3>
              <p className="text-sm font-medium text-teal-100 mt-2">
                Return to standard patient kiosk registration flow
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-full bg-white px-6 py-3.5 text-[#067E7F] font-bold shadow-md hover:bg-slate-50">
              <span>Login</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>

          {/* Card 2: Admin */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalTarget("DASHBOARD")}
            className="cursor-pointer flex flex-col justify-between rounded-3xl bg-[#067E7F] p-8 text-white shadow-2xl transition-all"
          >
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#067E7F] shadow-lg">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black mt-6">Admin Control</h3>
              <p className="text-sm font-medium text-teal-100 mt-2">
                Access OPD Dashboard, Queue controls & Financial reports
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-full bg-white px-6 py-3.5 text-[#067E7F] font-bold shadow-md hover:bg-slate-50">
              <span>Login</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>

          {/* Card 3: Doctors Availability */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalTarget("DOCTOR_AVAILABILITY")}
            className="cursor-pointer flex flex-col justify-between rounded-3xl bg-[#067E7F] p-8 text-white shadow-2xl transition-all"
          >
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#067E7F] shadow-lg">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black mt-6">Doctors Availability</h3>
              <p className="text-sm font-medium text-teal-100 mt-2">
                Manage doctor schedules, consulting fees & active status
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-full bg-white px-6 py-3.5 text-[#067E7F] font-bold shadow-md hover:bg-slate-50">
              <span>Login</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Small "← Back" Pill Button below */}
      <div className="flex justify-center pb-4">
        <button
          onClick={handleBackToKiosk}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> ← Back to Language Selection
        </button>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={Boolean(modalTarget)}
        onClose={() => setModalTarget(null)}
        onSuccess={handleModalSuccess}
        targetRole={modalTarget === "DASHBOARD" ? "admin" : "doctor_availability"}
        title={
          modalTarget === "DASHBOARD" ? "Admin Dashboard Login" : "Doctor Availability Portal Login"
        }
      />
    </div>
  );
};
