"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { QrCode, Banknote, XCircle, ArrowLeft } from "lucide-react";

export const PaymentMethodScreen: React.FC = () => {
  const { patientData, setStep, goBack, t } = useKiosk();

  const handleSelectPayment = (method: "UPI" | "Cash" | "CANCEL") => {
    if (method === "UPI") {
      setStep("UPI_PAYMENT");
    } else if (method === "Cash") {
      setStep("CASH_PAYMENT");
    } else {
      // Cancel returns to doctor recommendation screen (6A / 7), NOT the welcome screen
      if (patientData.visitType === "Specific Reason") {
        setStep("SPECIFIC_DOCTORS");
      } else {
        setStep("REGULAR_DOCTORS");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 my-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight">
            {t("paymentMethodTitle")}
          </h2>
          <p className="mt-2 text-lg text-slate-500 font-medium">
            Please choose your preferred method to complete OPD booking
          </p>
        </div>

        {/* 3 Large Cards Side-by-Side */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {/* UPI Payment Card (#216830) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectPayment("UPI")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#216830] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#216830] text-white shadow-lg shadow-[#216830]/30 group-hover:scale-110 transition-transform">
              <QrCode className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("upiPayment")}</h3>
              <p className="text-sm font-semibold text-[#216830]">{t("upiSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#216830] py-4 text-base font-bold text-white shadow-md">
              Pay via UPI
            </div>
          </motion.div>

          {/* Cash Payment Card (#F54901) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectPayment("Cash")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#F54901] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F54901] text-white shadow-lg shadow-[#F54901]/30 group-hover:scale-110 transition-transform">
              <Banknote className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("cashPayment")}</h3>
              <p className="text-sm font-semibold text-[#F54901]">{t("cashSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#F54901] py-4 text-base font-bold text-white shadow-md">
              Pay at Desk
            </div>
          </motion.div>

          {/* Cancel Card (#CF1D1B) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectPayment("CANCEL")}
            className="group cursor-pointer flex flex-col items-center justify-between rounded-3xl bg-white p-8 text-center shadow-xl border-2 border-slate-100 hover:border-[#CF1D1B] transition-all"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#CF1D1B] text-white shadow-lg shadow-[#CF1D1B]/30 group-hover:scale-110 transition-transform">
              <XCircle className="h-12 w-12" />
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <h3 className="text-2xl font-black text-[#1E293B]">{t("cancelPayment")}</h3>
              <p className="text-sm font-semibold text-[#CF1D1B]">{t("cancelSub")}</p>
            </div>
            <div className="mt-8 w-full rounded-2xl bg-[#CF1D1B] py-4 text-base font-bold text-white shadow-md">
              Cancel & Change
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
