"use client";

import React from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { Banknote, CheckCircle2, Clock } from "lucide-react";

export const CashPaymentTab: React.FC = () => {
  const { allTokens, updateTokenStatus } = useKiosk();

  const cashTokens = allTokens.filter((t) => t.paymentMethod === "Cash");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md border border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-800">Reception Cash Collection Desk</h3>
          <p className="text-xs font-semibold text-slate-400">
            Confirm cash payments collected from patients at OPD Reception counter
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-[#FFEBEA] px-4 py-2 text-[#CF1D1B] font-extrabold text-sm border border-[#CF1D1B]/20">
          <Clock className="h-4 w-4" />
          Pending: {cashTokens.filter((t) => t.paymentStatus === "NOT PAID").length} Unpaid Tokens
        </div>
      </div>

      {/* Cash Tokens Table */}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Token #</th>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Doctor / Dept</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4 text-right">Confirm Cash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {cashTokens.map((item) => {
              const isPaid = item.paymentStatus === "PAID";

              return (
                <tr key={item.tokenNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-[#F54901] text-base">{item.tokenNumber}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">{item.patientName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.patientPhone}</td>
                  <td className="px-6 py-4 text-xs font-bold">
                    {item.doctorName} ({item.department})
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">₹{item.amount}</td>
                  <td className="px-6 py-4">
                    {/* Status Pill Badges (#EBF9EC/#216830 for paid, #FFEBEA/#CF1D1B for unpaid/pending) */}
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF9EC] px-3.5 py-1 text-xs font-black text-[#216830] border border-[#216830]/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PAID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEBEA] px-3.5 py-1 text-xs font-black text-[#CF1D1B] border border-[#CF1D1B]/30">
                        <Banknote className="h-3.5 w-3.5" /> UNPAID / PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isPaid ? (
                      <button
                        onClick={() => {
                          updateTokenStatus(item.tokenNumber, "PAID");
                          if ((item as any).id) {
                            fetch(`/api/payments/${(item as any).id}/confirm`, { method: "PATCH" }).catch((err) =>
                              console.warn("API payment confirm error:", err)
                            );
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#216830] px-4 py-2 text-xs font-black text-white shadow-md hover:bg-emerald-800 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Confirm Paid
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">Confirmed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
