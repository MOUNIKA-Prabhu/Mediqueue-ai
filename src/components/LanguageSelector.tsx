"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-kiosk-sm font-medium text-slate-600">{t("selectLanguage")}</p>
      <div className="flex gap-4">
        <button
          onClick={() => setLang("en")}
          className={cn(
            "rounded-2xl px-8 py-4 text-kiosk-base font-semibold shadow-md transition-all",
            lang === "en"
              ? "bg-brand-blue text-white scale-105"
              : "bg-white text-slate-700 hover:scale-105"
          )}
        >
          English
        </button>
        <button
          onClick={() => setLang("ta")}
          className={cn(
            "rounded-2xl px-8 py-4 text-kiosk-base font-semibold shadow-md transition-all",
            lang === "ta"
              ? "bg-brand-green text-white scale-105"
              : "bg-white text-slate-700 hover:scale-105"
          )}
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}
