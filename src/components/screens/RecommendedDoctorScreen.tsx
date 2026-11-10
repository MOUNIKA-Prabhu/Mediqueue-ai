"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Doctor } from "@/constants/doctors";
import { matchSpecialtyFromReason } from "@/constants/initialData";
import { ArrowLeft, User, Clock, Users, Sparkles, CheckCircle2, Tag } from "lucide-react";

export const RecommendedDoctorScreen: React.FC = () => {
  const { patientData, doctors, setSelectedDoctor, setStep, goBack, t } = useKiosk();

  const reason = patientData.symptomReason.trim() || "Chest Pain";
  const matched = matchSpecialtyFromReason(reason);

  // Filter doctors by matched department/specialty or fallback to available specialists
  let filteredDocs = doctors.filter((d) => d.department === matched.department);
  if (filteredDocs.length === 0) {
    filteredDocs = doctors.slice(2, 5); // Fallback specialist list
  }

  const minQueueCount = Math.min(...filteredDocs.map((d) => d.queueCount));

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep("TOKEN_SUMMARY");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10">
      <HeaderKiosk />

      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-5xl mx-auto w-full my-auto">
        {/* Symptom Tag Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-base font-extrabold text-[#F54901] border border-orange-200 shadow-sm">
            <Tag className="h-5 w-5" />
            {t("youEntered")}: "{reason}"
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] mt-1">{t("recommendedSpecialists")}</h2>
          <p className="text-sm font-semibold text-[#0141AB]">
            Matched Specialization: {matched.department} ({matched.specialty})
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => {
            const isBestMatch = doc.queueCount === minQueueCount;

            return (
              <motion.div
                key={doc.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDoctor(doc)}
                className="relative flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xl border-2 border-slate-100 hover:border-[#F54901] transition-all cursor-pointer"
              >
                {isBestMatch && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#EBF9EC] px-3.5 py-1 text-xs font-black text-[#216830] border border-[#216830]/20 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-[#216830]" />
                    {t("bestMatch")}
                  </div>
                )}

                <div className={`flex items-start gap-4 ${isBestMatch ? "mt-7" : "mt-0"}`}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#F54901]">
                    <User className="h-9 w-9" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1E293B]">{doc.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{doc.specialty}</p>
                    <p className="text-xs font-bold text-orange-700 bg-orange-50/80 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {doc.room}
                    </p>
                  </div>
                </div>

                <div className="my-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#F54901]" />
                    <span>
                      Queue: <strong className="text-slate-900 text-sm">{doc.queueCount} Ahead</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#216830]" />
                    <span className="text-[#216830] font-black">{doc.availabilityTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Consultation Fee</span>
                    <span className="text-lg font-black text-[#1E293B]">₹{doc.consultingFee}</span>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-2xl bg-[#F54901] px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-orange-700 transition-all"
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
