"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/contexts/PatientContext";
import GlassCard from "@/components/GlassCard";
import DoctorCard from "@/components/DoctorCard";
import BackButton from "@/components/BackButton";
import { DoctorView } from "@/types";
import { useVoice, speechTemplates } from "@/hooks/useVoice";

function DoctorsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, lang } = useLanguage();
  const { patient, updatePatient } = usePatient();
  const { speak } = useVoice(lang);

  const [doctors, setDoctors] = useState<DoctorView[]>([]);
  const [previousDoctorId, setPreviousDoctorId] = useState<string | null>(null);
  const [alternative, setAlternative] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const department = params.get("department") ?? "";
  const isNew = params.get("isNew") ?? "1";

  useEffect(() => {
    if (!patient) {
      router.replace("/patient/new");
      return;
    }
    const qs = new URLSearchParams({
      department,
      isNew,
      ...(patient.patientId ? { patientId: patient.patientId } : {}),
    });
    fetch(`/api/doctors?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setDoctors(data.doctors);
        setPreviousDoctorId(data.previousDoctorId);
        setAlternative(data.alternative);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, isNew]);

  if (!patient) return null;

  const handleSelect = async (doctor: DoctorView) => {
    speak(speechTemplates(lang).doctorSelected(doctor.name));

    let patientId = patient.patientId;
    if (!patientId) {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patient.name,
          age: Number(patient.age),
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address,
          bloodGroup: patient.bloodGroup,
          emergencyContact: patient.emergencyContact,
        }),
      });
      const created = await res.json();
      patientId = created.id;
      updatePatient({ patientId });
    }

    const apptRes = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        doctorId: doctor.id,
        visitType: patient.visitType,
        symptomText: patient.symptomText,
        aiDepartment: patient.aiDepartment,
        aiRelated: patient.aiRelated?.join(", "),
      }),
    });
    const appt = await apptRes.json();
    router.push(`/queue/${appt.id}`);
  };

  const sorted = [...doctors].sort((a, b) => {
    if (a.id === previousDoctorId) return -1;
    if (b.id === previousDoctorId) return 1;
    return 0;
  });

  return (
    <main className="min-h-screen px-4 py-10">
      <BackButton fallbackHref="/patient/new/visit-type" />
      <div className="mx-auto max-w-4xl">
        <GlassCard>
          <h1 className="mb-2 text-kiosk-lg font-bold text-slate-800">
            {t("recommendedDepartment")}: {department}
          </h1>
          {patient.aiRelated && patient.aiRelated.length > 0 && (
            <p className="mb-6 text-slate-500">
              {t("relatedDepartments")}: {patient.aiRelated.join(", ")}
            </p>
          )}

          {loading ? (
            <p className="text-slate-400">...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {sorted.map((doc) => (
                <div key={doc.id}>
                  {doc.id === previousDoctorId && (
                    <p className="mb-1 text-sm font-semibold text-brand-blue">
                      {t("previousDoctor")}
                    </p>
                  )}
                  <DoctorCard
                    doctor={doc}
                    recommended={alternative?.id === doc.id}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsContent />
    </Suspense>
  );
}
