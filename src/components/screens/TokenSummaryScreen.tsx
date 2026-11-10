"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ArrowLeft, User, Stethoscope, Ticket, ArrowRight, ShieldCheck } from "lucide-react";

export const TokenSummaryScreen: React.FC = () => {
  const { patientData, selectedDoctor, setStep, goBack, t } = useKiosk();

  const tokenNum = useMemo(() => {
    return `TK-${Math.floor(100 + Math.random() * 900)}`;
  }, []);

  const personsAhead = selectedDoctor ? selectedDoctor.queueCount : 2;

  const handleProceed = () => {
    setStep("PAYMENT_METHOD");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-4xl mx-auto w-full my-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1 text-xs font-black text-[#0141AB]">
            <ShieldCheck className="h-4 w-4" /> CONFIRMATION SUMMARY
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] mt-2">{t("tokenSummaryTitle")}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Please review your appointment details before proceeding to payment
          </p>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Patient Details */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-extrabold text-[#0141AB] text-lg">
                <User className="h-6 w-6 text-[#0141AB]" />
                {t("patientDetails")}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">{t("fullName")}</span>
                  <span className="text-lg font-black text-slate-800">{patientData.name || "Karthik Subramanian"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Age / Gender</span>
                  <span className="text-base font-bold text-slate-800">
                    {patientData.age || "38"} Yrs / {patientData.gender || "Male"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">{t("phoneNumber")}</span>
                  <span className="text-base font-bold text-slate-800">{patientData.phone || "9876543210"}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Visit Type</span>
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[#0141AB] border border-blue-200 mt-1">
                    {patientData.visitType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Details */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-extrabold text-[#216830] text-lg">
                <Stethoscope className="h-6 w-6 text-[#216830]" />
                {t("doctorDetails")}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Assigned Doctor</span>
                  <span className="text-lg font-black text-slate-800">
                    {selectedDoctor?.name || "Dr. Rajesh Sharma"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Specialization / Dept</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedDoctor?.specialty || "General Physician"} ({selectedDoctor?.department || "General Medicine"})
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">OPD Room</span>
                  <span className="text-base font-bold text-emerald-800">
                    {selectedDoctor?.room || "OPD Room 101"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">{t("consultationFee")}</span>
                  <span className="text-2xl font-black text-[#1E293B]">
                    ₹{selectedDoctor?.consultingFee || 500}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Strip in Soft Orange Tint with #F54901 text */}
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="flex w-full flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-[#FFF3EE] p-6 border-2 border-[#F54901]/40 shadow-lg text-[#F54901]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F54901] text-white shadow-md">
              <Ticket className="h-9 w-9" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block opacity-90">
                Generated {t("tokenNumber")}
              </span>
              <span className="text-4xl font-black tracking-tight">{tokenNum}</span>
            </div>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#F54901]/20 pt-3 sm:pt-0 sm:pl-6">
            <span className="text-xs font-extrabold uppercase tracking-wider block opacity-90">
              Queue Position
            </span>
            <span className="text-2xl font-black">
              {personsAhead} {t("peopleAheadNotice")}
            </span>
          </div>
        </motion.div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleProceed}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0141AB] py-5 text-xl font-black text-white shadow-xl hover:bg-blue-800 active:scale-98 transition-all"
        >
          {t("proceedToPayment")} <ArrowRight className="h-6 w-6" />
        </button>
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
