"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import BackButton from "@/components/BackButton";

export default function PatientTypePage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <BackButton fallbackHref="/" />
      <div className="relative z-10 w-full max-w-2xl">
        <GlassCard className="flex flex-col items-center gap-8">
          <h1 className="text-kiosk-lg font-bold text-slate-800">{t("hospitalName")}</h1>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              onClick={() => router.push("/patient/new")}
              className="rounded-3xl bg-brand-blue px-6 py-10 text-kiosk-lg font-bold text-white shadow-xl transition-transform hover:scale-105"
            >
              {t("newPatient")}
            </button>
            <button
              onClick={() => router.push("/patient/existing")}
              className="rounded-3xl bg-brand-green px-6 py-10 text-kiosk-lg font-bold text-white shadow-xl transition-transform hover:scale-105"
            >
              {t("existingPatient")}
            </button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
