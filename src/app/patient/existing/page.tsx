"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/contexts/PatientContext";
import GlassCard from "@/components/GlassCard";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import BackButton from "@/components/BackButton";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";

export default function ExistingPatientPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setPatient } = usePatient();
  const { activeField, open, close } = useVirtualKeyboard();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/patients/${phone}`);
      if (res.status === 404) {
        setError(t("noRecordFound"));
        return;
      }
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      setPatient({
        patientId: data.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
        emergencyContact: data.emergencyContact,
        isExisting: true,
      });

      router.push(`/patient/new/visit-type?existing=1&history=${encodeURIComponent(JSON.stringify(data.history || []))}`);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <BackButton fallbackHref="/patient-type" />
      <GlassCard className="w-full max-w-md text-center">
        <h1 className="mb-6 text-kiosk-lg font-bold text-slate-800">{t("existingPatient")}</h1>
        <input
          value={phone}
          onFocus={() => open("phone")}
          readOnly
          placeholder={t("searchByPhone")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-kiosk-base shadow-sm"
        />
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button
          disabled={loading || phone.length < 10}
          onClick={search}
          className="mt-6 w-full rounded-2xl bg-brand-blue px-6 py-4 text-kiosk-base font-bold text-white shadow-lg disabled:opacity-50"
        >
          {t("search")}
        </button>
      </GlassCard>

      {activeField && (
        <VirtualKeyboard
          fieldLabel={t("phone")}
          onKey={(c) => /[0-9]/.test(c) && setPhone((p) => (p + c).slice(0, 10))}
          onBackspace={() => setPhone((p) => p.slice(0, -1))}
          onDone={close}
        />
      )}
    </main>
  );
}
