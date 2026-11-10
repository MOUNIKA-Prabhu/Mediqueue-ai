"use client";

import { DoctorView } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function DoctorCard({
  doctor,
  recommended,
  onSelect,
}: {
  doctor: DoctorView;
  recommended?: boolean;
  onSelect: (doctor: DoctorView) => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white/80 p-5 shadow-md backdrop-blur transition-transform hover:scale-[1.02]",
        recommended ? "border-brand-green ring-2 ring-brand-green/40" : "border-slate-200"
      )}
    >
      {recommended && (
        <span className="absolute -top-3 left-4 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white shadow">
          {t("recommendedAlternative")}
        </span>
      )}
      <h3 className="text-kiosk-base font-bold text-slate-800">{doctor.name}</h3>
      <p className="text-slate-500">{doctor.department}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
        <div>
          {t("experience")}: {doctor.experienceYears} {t("years")}
        </div>
        <div>
          {t("consultationFee")}: ₹{doctor.consultationFee}
        </div>
        <div>
          {t("currentQueue")}: {doctor.queueCount}
        </div>
        <div className={doctor.isAvailable ? "text-brand-green font-semibold" : "text-red-500 font-semibold"}>
          {doctor.isAvailable ? t("available") : t("unavailable")}
        </div>
      </div>

      <button
        disabled={!doctor.isAvailable}
        onClick={() => onSelect(doctor)}
        className={cn(
          "mt-4 w-full rounded-xl py-3 text-kiosk-sm font-semibold text-white shadow transition-all",
          doctor.isAvailable ? "bg-brand-blue hover:bg-brand-blueDark" : "bg-slate-300"
        )}
      >
        {t("selectDoctor")}
      </button>
    </div>
  );
}
