"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import GlassCard from "@/components/GlassCard";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import BackButton from "@/components/BackButton";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";
import TokenDisplay from "@/components/TokenDisplay";

interface LookupResult {
  id: string;
  token: number;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  patientsAhead: number;
  estimatedWaitMinutes: number;
  doctorName: string;
  department: string;
  patientName: string;
  paymentStatus: string;
}

export default function TokenLookupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { activeField, open, close } = useVirtualKeyboard();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/appointments/lookup?query=${encodeURIComponent(query)}`);
      if (res.status === 404) {
        setError("No active token found for today matching this entry.");
        return;
      }
      if (!res.ok) throw new Error("Search failed");
      const data: LookupResult = await res.json();
      setResult(data);
    } catch (e) {
      setError("Unable to retrieve token status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <BackButton fallbackHref="/patient-type" />

      <div className="w-full max-w-md">
        <GlassCard className="text-center">
          <h1 className="mb-2 text-kiosk-lg font-bold text-slate-800">Scan / Check Token Status</h1>
          <p className="mb-6 text-sm text-slate-500">
            Enter your Token #, Phone Number, or Scan QR code below
          </p>

          <div className="flex flex-col gap-4">
            <input
              value={query}
              onFocus={() => open("query")}
              readOnly
              placeholder="e.g. 5 or 9876543210"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-kiosk-base font-bold shadow-sm"
            />

            <button
              disabled={loading || !query.trim()}
              onClick={handleSearch}
              className="rounded-2xl bg-brand-blue px-6 py-4 text-kiosk-base font-bold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? "Searching..." : "Check Status"}
            </button>
          </div>

          {error && <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>}

          {result && (
            <div className="mt-6 border-t border-slate-200 pt-6 text-left">
              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Patient: <span className="font-bold text-slate-800">{result.patientName}</span></p>
                <p className="text-xs text-slate-500">Doctor: <span className="font-bold text-slate-800">{result.doctorName}</span> ({result.department})</p>
                <p className="text-xs text-slate-500">Status: 
                  <span className={`ml-1 font-bold ${
                    result.status === "IN_PROGRESS" ? "text-emerald-600" :
                    result.status === "COMPLETED" ? "text-blue-600" :
                    result.status === "CANCELLED" ? "text-red-600" : "text-amber-600"
                  }`}>
                    {result.status === "IN_PROGRESS" ? "NOW IN CONSULTATION 🩺" : result.status}
                  </span>
                </p>
              </div>

              {result.status === "WAITING" && (
                <TokenDisplay
                  token={result.token}
                  patientsAhead={result.patientsAhead}
                  label={t("yourToken")}
                  aheadLabel={t("patientsAhead")}
                />
              )}

              {result.status === "IN_PROGRESS" && (
                <div className="rounded-2xl bg-emerald-500 p-6 text-center text-white shadow-lg">
                  <p className="text-sm uppercase font-bold tracking-wider">It's Your Turn!</p>
                  <p className="mt-2 text-4xl font-extrabold">Token #{result.token}</p>
                  <p className="mt-1 text-xs">Please proceed to {result.doctorName}'s room immediately.</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push(`/queue/${result.id}`)}
                  className="flex-1 rounded-xl bg-brand-green px-4 py-3 text-xs font-bold text-white shadow"
                >
                  View Token Page
                </button>
                <button
                  onClick={() => router.push(`/receipt/${result.id}`)}
                  className="flex-1 rounded-xl bg-slate-200 px-4 py-3 text-xs font-bold text-slate-700 shadow"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {activeField && (
        <VirtualKeyboard
          fieldLabel="Token or Phone"
          onKey={(c) => setQuery((q) => q + c)}
          onBackspace={() => setQuery((q) => q.slice(0, -1))}
          onDone={close}
        />
      )}
    </main>
  );
}
