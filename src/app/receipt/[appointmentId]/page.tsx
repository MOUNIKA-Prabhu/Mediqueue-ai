"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice, speechTemplates } from "@/hooks/useVoice";
import { formatDate } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { Activity } from "lucide-react";

interface ReceiptData {
  id: string;
  token: number;
  doctorName: string;
  department: string;
  consultationFee: number;
  patient: { name: string; age: number; phone: string; bloodGroup: string };
  payment: { mode: string; status: string; upiTransactionId: string | null; createdAt: string } | null;
}

export default function ReceiptPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { speak } = useVoice(lang);
  const [data, setData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    fetch(`/api/appointments/${appointmentId}`)
      .then((r) => r.json())
      .then((d) =>
        setData({
          id: d.id,
          token: d.token,
          doctorName: d.doctorName,
          department: d.department,
          consultationFee: d.consultationFee,
          patient: d.patient ?? { name: "", age: 0, phone: "", bloodGroup: "" },
          payment: d.payment,
        })
      );
  }, [appointmentId]);

  useEffect(() => {
    if (data) speak(speechTemplates(lang).printing());
  }, [data, lang, speak]);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="no-print mb-6 flex justify-end gap-3">
          <BackButton fallbackHref="/" />
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white shadow"
          >
            {t("printReceipt")}
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 shadow"
          >
            {t("done")}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 p-8 shadow-sm print:border-0 print:shadow-none">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-black text-brand-blueDark">{t("hospitalName")}</h1>
              <p className="text-sm text-slate-500">{t("receipt")}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0141AB] text-white shadow-md print:bg-[#0141AB] print:text-white shrink-0">
              <Activity className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h2 className="mb-2 font-bold text-slate-700">{t("patientDetails")}</h2>
              <p>{t("name")}: {data.patient.name}</p>
              <p>{t("age")}: {data.patient.age}</p>
              <p>{t("phone")}: {data.patient.phone}</p>
              <p>{t("bloodGroup")}: {data.patient.bloodGroup}</p>
            </div>
            <div>
              <h2 className="mb-2 font-bold text-slate-700">{t("doctorDetails")}</h2>
              <p>{t("name")}: {data.doctorName}</p>
              <p>{t("department")}: {data.department}</p>
              <p>{t("token")}: {data.token}</p>
              <p>{t("consultationFee")}: ₹{data.consultationFee}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 border-t pt-4 text-sm">
            <p>{t("paymentMode")}: {data.payment?.mode ?? "-"}</p>
            <p>{t("paymentStatus")}: {data.payment?.status ?? "-"}</p>
            <p>{t("date")}: {data.payment ? formatDate(new Date(data.payment.createdAt)) : "-"}</p>
            <p>{t("transactionId")}: {data.payment?.upiTransactionId ?? "-"}</p>
          </div>

          <p className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 print:bg-white">
            {t("instructions")}
          </p>

          <div className="mt-8 border-t pt-4 text-center text-xs text-slate-400">
            {t("hospitalName")} · Sathyamangalam, Tamil Nadu · This is a computer-generated receipt
          </div>
        </div>
      </div>
    </main>
  );
}
