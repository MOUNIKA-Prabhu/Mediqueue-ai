"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CheckCircle2, ShieldCheck, XCircle, Sparkles, Clock } from "lucide-react";

export const UpiPaymentScreen: React.FC = () => {
  const { patientData, selectedDoctor, setPaymentState, addTokenRecord, setStep, t } = useKiosk();
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID">("PENDING");
  const [txnId, setTxnId] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(120);

  const amount = selectedDoctor?.consultingFee || 500;

  // 2-Minute (120s) Countdown Timer: Return to Payment Method screen on 00:00 timeout
  useEffect(() => {
    if (paymentStatus === "PAID") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep("PAYMENT_METHOD");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentStatus, setStep]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Generate real scannable UPI QR Code with VPA, Payee Name, Transaction Ref, Amount & Currency
  useEffect(() => {
    const txnRef = `MQ${Date.now()}`;
    const upiUri = `upi://pay?pa=mediqueue@upi&pn=MediQueue+Hospital&tr=${txnRef}&am=${amount}.00&cu=INR&tn=MediQueue+OPD+Token`;
    QRCode.toDataURL(upiUri, { width: 280, margin: 2, color: { dark: "#0F172A", light: "#FFFFFF" } })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Failed to generate QR code", err));
  }, [amount]);

  // Simulate UPI Payment Approval after 4.5 seconds
  useEffect(() => {
    const generatedTxn = `TXN-${Math.floor(10000 + Math.random() * 90000)}-UPI`;
    const timer = setTimeout(() => {
      setTxnId(generatedTxn);
      setPaymentStatus("PAID");

      const tokenNum = `TK-${Math.floor(100 + Math.random() * 900)}`;
      const nowStr = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const newPayState = {
        method: "UPI" as const,
        status: "PAID" as const,
        amount,
        transactionId: generatedTxn,
        tokenNumber: tokenNum,
        dateTime: nowStr,
        personsAhead: selectedDoctor?.queueCount || 2,
      };

      setPaymentState(newPayState);

      // Record to admin token database
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
        paymentMethod: "UPI",
        paymentStatus: "PAID",
        transactionId: generatedTxn,
        dateTime: nowStr,
        statusInQueue: "Waiting",
      });

      // Auto-advance to Receipt after brief success highlight
      setTimeout(() => {
        setStep("RECEIPT");
      }, 1500);
    }, 4500);

    return () => clearTimeout(timer);
  }, [amount, selectedDoctor, patientData, setPaymentState, addTokenRecord, setStep]);

  const handleCancel = () => {
    setStep("PAYMENT_METHOD");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 max-w-xl mx-auto w-full my-auto text-center">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF9EC] px-4 py-1 text-xs font-black text-[#216830] border border-[#216830]/20">
              <ShieldCheck className="h-4 w-4" /> SECURE UPI PAYMENTS
            </div>
            {paymentStatus === "PENDING" && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1 text-xs font-extrabold text-amber-800 border border-amber-300 shadow-sm">
                <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                Time remaining: <span className="font-mono text-sm font-black text-amber-900">{formattedTime}</span>
              </div>
            )}
          </div>
          <h2 className="text-3xl font-black text-[#1E293B]">{t("scanQrToPay")}</h2>
        </div>

        {/* QR Code Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex flex-col items-center rounded-3xl bg-white p-8 shadow-2xl border-2 border-slate-200"
        >
          {/* Real Generated QR Image */}
          <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-inner border border-slate-200">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="UPI Payment QR Code" className="h-full w-full object-contain rounded-xl" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-bold">
                Generating QR...
              </div>
            )}

            {/* Scanning line animation if PENDING */}
            {paymentStatus === "PENDING" && (
              <motion.div
                animate={{ y: [-110, 110, -110] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 right-4 h-1.5 rounded-full bg-[#22C55E] shadow-lg shadow-[#22C55E]"
              />
            )}
          </div>

          {/* Amount Display */}
          <div className="mt-6 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Consultation Amount</span>
            <span className="text-4xl font-black text-[#216830]">₹{amount}</span>
          </div>

          {/* Payment Status indicator */}
          {paymentStatus === "PAID" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 flex items-center gap-2 rounded-full bg-[#EBF9EC] px-6 py-2 text-base font-black text-[#216830] border border-[#216830]/30 shadow-md"
            >
              <CheckCircle2 className="h-6 w-6 text-[#216830]" />
              Payment Confirmed! {txnId && `ID: ${txnId}`}
            </motion.div>
          )}
        </motion.div>

        {/* Checklist */}
        <div className="w-full rounded-2xl bg-blue-50/80 p-4 text-xs font-bold text-slate-700 space-y-2 border border-blue-200">
          <div className="flex items-center justify-center gap-2 text-[#0141AB]">
            <Sparkles className="h-4 w-4" />
            <span>{t("paymentInstructions")}</span>
          </div>
        </div>

        {/* Cancel Payment Button (#CF1D1B) */}
        {paymentStatus === "PENDING" && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-2xl bg-[#CF1D1B] px-8 py-3.5 text-base font-extrabold text-white shadow-lg hover:bg-red-800 active:scale-95 transition-all"
          >
            <XCircle className="h-5 w-5" /> Cancel Payment
          </button>
        )}
      </div>

      {/* Bottom Language Toggle */}
      <div className="flex justify-end pb-2">
        <LanguageToggle />
      </div>
    </div>
  );
};
