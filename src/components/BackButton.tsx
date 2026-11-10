"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BackButton({ fallbackHref }: { fallbackHref?: string }) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleBack = () => {
    if (fallbackHref) {
      router.push(fallbackHref);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="no-print fixed left-4 top-4 z-40 flex items-center gap-2 rounded-2xl bg-white/80 px-5 py-3 text-kiosk-sm font-semibold text-slate-700 shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:left-6 sm:top-6"
    >
      <span className="text-xl leading-none">←</span>
      {t("back")}
    </button>
  );
}
