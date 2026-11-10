"use client";

import { useEffect, useState } from "react";

interface PaymentRow {
  id: string;
  amount: number;
  status: string;
  appointment: { token: number; patient: { name: string; phone: string } };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);

  const load = () => fetch("/api/admin/payments").then((r) => r.json()).then(setPayments);

  useEffect(() => {
    load();
  }, []);

  const confirm = async (id: string) => {
    await fetch(`/api/payments/${id}/confirm`, { method: "PATCH" });
    load();
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3">Token</th>
            <th className="p-3">Patient</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">#{p.appointment.token}</td>
              <td className="p-3">
                {p.appointment.patient.name} ({p.appointment.patient.phone})
              </td>
              <td className="p-3">₹{p.amount}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3">
                {p.status === "CASH_PENDING" && (
                  <button
                    onClick={() => confirm(p.id)}
                    className="rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white"
                  >
                    Confirm Received
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
