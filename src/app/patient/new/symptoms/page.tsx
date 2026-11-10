"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/contexts/PatientContext";
import GlassCard from "@/components/GlassCard";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import BackButton from "@/components/BackButton";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";
import { SymptomAnalysisResult } from "@/types";

export default function SymptomsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { patient, updatePatient } = usePatient();
  const { activeField, open, close } = useVirtualKeyboard();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patient) {
      router.replace("/patient/new");
    }
  }, [patient, router]);

  if (!patient) {
    return null;
  }

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/symptoms/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptomText: text }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const result: SymptomAnalysisResult = await res.json();

      updatePatient({
        symptomText: text,
        aiDepartment: result.department,
        aiRelated: result.relatedDepartments,
      });

      router.push(
        `/doctors?department=${encodeURIComponent(result.department)}&isNew=${
          patient.isExisting ? "0" : "1"
        }`
      );
    } catch (e) {
      setError("Could not analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <BackButton fallbackHref="/patient/new/visit-type" />
      <GlassCard className="w-full max-w-xl">
        <h1 className="mb-4 text-kiosk-lg font-bold text-slate-800">{t("describeSymptoms")}</h1>
        <textarea
          value={text}
          onFocus={() => open("symptoms")}
          readOnly
          rows={4}
          placeholder={t("symptomsPlaceholder")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-kiosk-sm shadow-sm"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          disabled={loading || !text.trim()}
          onClick={analyze}
          className="mt-6 w-full rounded-2xl bg-brand-green px-6 py-4 text-kiosk-base font-bold text-white shadow-lg disabled:opacity-50"
        >
          {loading ? t("analyzing") : t("next")}
        </button>
      </GlassCard>

      {activeField && (
        <VirtualKeyboard
          fieldLabel={t("describeSymptoms")}
          onKey={(c) => setText((prev) => prev + c)}
          onBackspace={() => setText((prev) => prev.slice(0, -1))}
          onDone={close}
        />
      )}
    </main>
  );
}
