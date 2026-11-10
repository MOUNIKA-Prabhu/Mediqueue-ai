"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Doctor } from "@/constants/doctors";
import { ArrowLeft, User, Clock, Users, Sparkles, CheckCircle2 } from "lucide-react";

export const RegularDoctorScreen: React.FC = () => {
  const { doctors, setSelectedDoctor, setStep, goBack, t } = useKiosk();

  // Filter General Physicians
  const generalPhysicians = doctors.filter((d) => d.department === "General Medicine");

  // Determine Doctor with shortest queue for "Best Match" tag
  const minQueueCount = Math.min(...generalPhysicians.map((d) => d.queueCount));

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep("TOKEN_SUMMARY");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      {/* Main Area */}
      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-5xl mx-auto w-full my-auto">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1E293B]">{t("recommendedDoctors")}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            General Physicians available for routine consultation
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {generalPhysicians.map((doc) => {
            const isBestMatch = doc.queueCount === minQueueCount;

            return (
              <motion.div
                key={doc.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDoctor(doc)}
                className="relative flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl border-2 border-slate-100 hover:border-[#0141AB] transition-all cursor-pointer"
              >
                {/* Best Match Tag in top-left (#216830 text on #EBF9EC bg) */}
                {isBestMatch && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#EBF9EC] px-3.5 py-1 text-xs font-black text-[#216830] border border-[#216830]/20 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#216830]" />
                    {t("bestMatch")}
                  </div>
                )}

                <div className={`flex items-start gap-4 ${isBestMatch ? "mt-7" : "mt-0"}`}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0141AB]">
                    <User className="h-9 w-9" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1E293B]">{doc.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{doc.specialty}</p>
                    <p className="text-xs font-bold text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {doc.room}
                    </p>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="my-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#0141AB]" />
                    <span>
                      Queue: <strong className="text-slate-900 text-sm">{doc.queueCount} Ahead</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#216830]" />
                    <span className="text-[#216830] font-black">{doc.availabilityTime}</span>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Consultation Fee</span>
                    <span className="text-lg font-black text-[#1E293B]">₹{doc.consultingFee}</span>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-2xl bg-[#0141AB] px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-blue-800 transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" /> {t("selectDoctor")}
                  </button>
                </div>
              </motion.div>
            );
          })}
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
