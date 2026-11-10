"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Banknote, AlertCircle, Printer, XCircle } from "lucide-react";

export const CashPaymentScreen: React.FC = () => {
  const { patientData, selectedDoctor, setPaymentState, addTokenRecord, setStep, t } = useKiosk();

  const amount = selectedDoctor?.consultingFee || 500;

  const handleConfirmCash = () => {
    const tokenNum = `TK-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const newPayState = {
      method: "Cash" as const,
      status: "NOT PAID" as const,
      amount,
      tokenNumber: tokenNum,
      dateTime: nowStr,
      personsAhead: selectedDoctor?.queueCount || 2,
    };

    setPaymentState(newPayState);

    // Record token in DB with Cash & NOT PAID status
    addTokenRecord({
      tokenNumber: tokenNum,
      patientName: patientData.name || "Karthik Subramanian",
      patientPhone: patientData.phone || "9876543210",
      ageGender: `${patientData.age || 38} / ${patientData.gender || "Male"}`,
      visitType: patientData.visitType,
      doctorName: selectedDoctor?.name || "Dr. Rajesh Sharma",
      department: selectedDoctor?.department || "General Medicine",
      consultationFee: amount,
      amount,
      personsAhead: selectedDoctor?.queueCount || 2,
      paymentMethod: "Cash",
      paymentStatus: "NOT PAID",
      dateTime: nowStr,
      statusInQueue: "Waiting",
    });

    setStep("RECEIPT");
  };

  const handleCancel = () => {
    setStep("PAYMENT_METHOD");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 max-w-xl mx-auto w-full my-auto text-center">
        {/* Cash Card Icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F54901] text-white shadow-2xl ring-4 ring-orange-100"
        >
          <Banknote className="h-14 w-14" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#1E293B]">Payment at Reception</h2>
          <p className="text-2xl font-black text-[#F54901]">
            Amount to Pay: <span className="text-4xl">₹{amount}</span>
          </p>
        </div>

        {/* Note Box */}
        <div className="flex flex-col gap-2 rounded-3xl bg-[#FFEBEA] p-6 text-left border-2 border-[#CF1D1B]/30 shadow-md">
          <div className="flex items-center gap-2 text-[#CF1D1B] font-black text-base">
            <AlertCircle className="h-6 w-6 text-[#CF1D1B]" />
            Important Notice
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {t("cashNote")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#CF1D1B] py-4 text-lg font-black text-white shadow-lg hover:bg-red-800 active:scale-95 transition-all"
          >
            <XCircle className="h-5 w-5" /> Cancel Payment
          </button>

          <button
            type="button"
            onClick={handleConfirmCash}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#F54901] py-4 text-lg font-black text-white shadow-lg hover:bg-orange-700 active:scale-95 transition-all"
          >
            <Printer className="h-5 w-5" /> Issue Token Receipt
          </button>
        </div>
      </div>

      {/* Bottom Language Toggle */}
      <div className="flex justify-end pb-2">
        <LanguageToggle />
      </div>
    </div>
  );
};
