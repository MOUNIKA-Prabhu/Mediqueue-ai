"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import TokenDisplay from "@/components/TokenDisplay";
import BackButton from "@/components/BackButton";
import { AppointmentView } from "@/types";
import { useVoice, speechTemplates } from "@/hooks/useVoice";
import { estimateWaitMinutes } from "@/lib/queue-logic";

export default function QueuePage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { speak } = useVoice(lang);
  const [appt, setAppt] = useState<(AppointmentView & { patientsAhead: number }) | undefined>();
  const [announced, setAnnounced] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const res = await fetch(`/api/appointments/${appointmentId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (active) setAppt(data);
    };
    load();
    const interval = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [appointmentId]);

  useEffect(() => {
    if (appt && !announced) {
      const templates = speechTemplates(lang);
      speak(`${templates.registrationComplete()} ${templates.token(appt.token)}`);
      setTimeout(() => {
        speak(templates.waitTime(estimateWaitMinutes(appt.patientsAhead, appt.department)));
      }, 2500);
      setAnnounced(true);
    }
  }, [appt, announced, lang, speak]);

  if (!appt) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <BackButton fallbackHref="/" />
      <GlassCard className="w-full max-w-md text-center">
        <h2 className="mb-1 text-kiosk-base font-semibold text-slate-700">{appt.doctorName}</h2>
        <p className="mb-6 text-slate-500">{appt.department}</p>

        <TokenDisplay
          token={appt.token}
          patientsAhead={appt.patientsAhead}
          label={t("yourToken")}
          aheadLabel={t("patientsAhead")}
        />

        <button
          onClick={() => router.push(`/payment/${appointmentId}`)}
          className="mt-8 w-full rounded-2xl bg-brand-blue px-6 py-4 text-kiosk-base font-bold text-white shadow-lg"
        >
          {t("payment")}
        </button>
      </GlassCard>
    </main>
  );
}
