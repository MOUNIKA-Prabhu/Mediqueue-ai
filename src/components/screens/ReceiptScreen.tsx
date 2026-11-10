"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Printer, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export const ReceiptScreen: React.FC = () => {
  const {
    patientData,
    selectedDoctor,
    paymentState,
    resetToWelcome,
    t,
  } = useKiosk();

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 600);
  };

  const isPaid = paymentState?.status === "PAID";
  const isCash = paymentState?.method === "Cash";

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <div className="print:hidden">
        <HeaderKiosk />
      </div>

      {/* Main Center Receipt Box */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 max-w-3xl mx-auto w-full my-auto">
        <motion.div
          id="printable-receipt"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full rounded-3xl bg-white p-8 shadow-2xl border-2 border-slate-200"
        >
          {/* Receipt Top Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-dashed border-slate-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0141AB] text-white shadow-md print:bg-[#0141AB] print:text-white shrink-0">
                <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">{t("hospitalName")}</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {t("receiptTitle")}
                </p>
              </div>
            </div>

            {/* Token Badge */}
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-xs font-extrabold text-slate-400 uppercase">Token Number</span>
              <span className="text-3xl font-black text-[#0141AB]">
                {paymentState?.tokenNumber || "TK-104"}
              </span>
            </div>
          </div>

          {/* 2-Column Receipt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b-2 border-dashed border-slate-200">
            {/* Left: Patient Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                {t("patientDetails")}
              </h4>
              <div>
                <span className="text-xs font-bold text-slate-400 block">{t("fullName")}</span>
                <span className="text-base font-extrabold text-slate-800">
                  {patientData.name || "Karthik Subramanian"}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Age / Gender</span>
                <span className="text-sm font-bold text-slate-800">
                  {patientData.age || "38"} Yrs / {patientData.gender || "Male"}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">{t("phoneNumber")}</span>
                <span className="text-sm font-bold text-slate-800">
                  {patientData.phone || "9876543210"}
                </span>
              </div>
            </div>

            {/* Right: Payment Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                Appointment & Payment Details
              </h4>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Assigned Doctor</span>
                <span className="text-base font-extrabold text-slate-800">
                  {selectedDoctor?.name || "Dr. Rajesh Sharma"}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">Department / Room</span>
                <span className="text-sm font-bold text-slate-800">
                  {selectedDoctor?.department || "General Medicine"} ({selectedDoctor?.room || "OPD 101"})
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4 pt-1">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Payment Status</span>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF9EC] px-3.5 py-1 text-xs font-black text-[#216830] border border-[#216830]/20">
                      <CheckCircle2 className="h-4 w-4" /> {t("statusPaid")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEBEA] px-3.5 py-1 text-xs font-black text-[#F54901] border border-[#F54901]/30">
                      <AlertTriangle className="h-4 w-4" /> {t("statusNotPaid")}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block">Payment Mode</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {isCash ? "Cash at Reception" : "UPI App"}
                  </span>
                </div>
              </div>

              {/* OMIT TRANSACTION ID ROW ENTIRELY FOR CASH / UNPAID */}
              {isPaid && paymentState?.transactionId && (
                <div>
                  <span className="text-xs font-bold text-slate-400 block">{t("transactionId")}</span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {paymentState.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="flex items-center justify-between pt-4 text-xs font-bold text-slate-500">
            <span>Date & Time: {paymentState?.dateTime || "Today"}</span>
            <span>Amount: ₹{paymentState?.amount || 500}</span>
          </div>
        </motion.div>

        {/* Green "Print Receipt" Button (#216830) and Done */}
        <div className="flex items-center gap-4 w-full print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#216830] py-4 text-lg font-black text-white shadow-xl hover:bg-emerald-800 active:scale-95 transition-all"
          >
            <Printer className="h-6 w-6" /> {isPrinting ? "Printing..." : t("printReceipt")}
          </button>

          <button
            type="button"
            onClick={resetToWelcome}
            className="rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>

      {/* Bottom Language Toggle */}
      <div className="flex justify-end pb-2 print:hidden">
        <LanguageToggle />
      </div>
    </div>
  );
};
