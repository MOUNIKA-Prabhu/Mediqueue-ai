"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import QRCodePayment from "@/components/QRCodePayment";
import BackButton from "@/components/BackButton";
import { useVoice, speechTemplates } from "@/hooks/useVoice";

export default function PaymentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { speak } = useVoice(lang);

  const [amount, setAmount] = useState<number | null>(null);
  const [mode, setMode] = useState<"UPI" | "CASH" | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "paid" | "cash_pending">("idle");
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    fetch(`/api/appointments/${appointmentId}`)
      .then((r) => r.json())
      .then((d) => setAmount(d.consultationFee ?? 300))
      .catch(() => setAmount(300));
  }, [appointmentId]);

  const pay = async (selected: "UPI" | "CASH") => {
    setMode(selected);
    setProcessingPayment(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, mode: selected }),
      });
      const data = await res.json();
      const templates = speechTemplates(lang);

      if (selected === "UPI") {
        setQrDataUrl(data.qrDataUrl);
        setStatus("paid");
        speak(templates.paymentSuccess(data.amount));
      } else {
        setStatus("cash_pending");
        speak(templates.cashPending());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingPayment(false);
    }
  };

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      setCancelled(true);
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = !cancelled && status !== "paid";

  if (cancelled) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <GlassCard className="w-full max-w-md text-center">
          <p className="text-kiosk-base font-semibold text-red-500">{t("appointmentCancelled")}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 w-full rounded-2xl bg-brand-blue px-6 py-4 text-kiosk-base font-bold text-white shadow-lg"
          >
            {t("done")}
          </button>
        </GlassCard>
      </main>
    );
  }

  if (amount === null) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <GlassCard className="w-full max-w-md text-center p-12">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading consultation bill...</p>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <BackButton fallbackHref="/" />
      <GlassCard className="w-full max-w-md text-center">
        {confirmingCancel ? (
          <div className="flex flex-col gap-4">
            <p className="text-kiosk-base font-semibold text-slate-700">{t("cancelConfirmTitle")}</p>
            <button
              onClick={confirmCancel}
              disabled={cancelling}
              className="rounded-2xl bg-red-500 px-6 py-4 text-kiosk-base font-bold text-white shadow-lg disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : t("cancelConfirmYes")}
            </button>
            <button
              onClick={() => setConfirmingCancel(false)}
              disabled={cancelling}
              className="rounded-2xl bg-slate-200 px-6 py-4 text-kiosk-base font-bold text-slate-700 shadow"
            >
              {t("cancelConfirmNo")}
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-kiosk-lg font-bold text-slate-800">{t("payment")}</h1>
            <p className="mb-6 text-sm text-slate-500">Consultation Fee: <span className="font-bold text-slate-800">₹{amount}</span></p>

            {!mode && (
              <div className="flex flex-col gap-4">
                <button
                  disabled={processingPayment}
                  onClick={() => pay("UPI")}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-brand-blue px-6 py-5 text-kiosk-base font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-blue-600 disabled:opacity-50"
                >
                  {processingPayment ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>📲 {t("payUpi")}</span>
                  )}
                </button>

                <button
                  disabled={processingPayment}
                  onClick={() => pay("CASH")}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-kiosk-base font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-amber-600 disabled:opacity-50"
                >
                  {processingPayment ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>💵 {t("payCash")}</span>
                  )}
                </button>
              </div>
            )}

            {mode === "UPI" && qrDataUrl && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <QRCodePayment qrDataUrl={qrDataUrl} amount={amount} label={t("scanQr")} />
                <p className="text-brand-green font-semibold">{t("paymentSuccess")}</p>
              </div>
            )}

            {mode === "CASH" && status === "cash_pending" && (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 border border-amber-200">
                <p className="text-kiosk-sm font-semibold text-amber-800">{t("cashPending")}</p>
                <p className="mt-1 text-xs text-amber-600">Please pay ₹{amount} at the reception counter before consultation.</p>
              </div>
            )}

            {(status === "paid" || status === "cash_pending") && (
              <button
                onClick={() => router.push(`/receipt/${appointmentId}`)}
                className="mt-6 w-full rounded-2xl bg-brand-green px-6 py-4 text-kiosk-base font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                🖨️ {t("printReceipt")}
              </button>
            )}

            {canCancel && !mode && (
              <button
                onClick={() => setConfirmingCancel(true)}
                className="mt-6 text-xs font-semibold text-slate-400 hover:text-red-500 underline"
              >
                {t("cancelAppointment")}
              </button>
            )}
          </>
        )}
      </GlassCard>
    </main>
  );
}
