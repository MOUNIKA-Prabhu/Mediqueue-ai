"use client";

import { useEffect, useState } from "react";

interface ReportRow {
  token: number;
  patientName: string;
  doctorName: string;
  department: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminReportsPage() {
  const [rows, setRows] = useState<ReportRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/reports").then((r) => r.json()).then(setRows);
  }, []);

  const exportCsv = () => {
    const header = "Token,Patient,Doctor,Department,Status,Payment,Date\n";
    const body = rows
      .map(
        (r) =>
          `${r.token},${r.patientName},${r.doctorName},${r.department},${r.status},${r.paymentStatus},${r.createdAt}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todays-patients.csv";
    a.click();
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700">Today&apos;s Patients</h2>
        <button onClick={exportCsv} className="rounded-xl bg-brand-blue px-4 py-2 text-sm text-white">
          Export CSV
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-2">Token</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Doctor</th>
            <th className="p-2">Dept</th>
            <th className="p-2">Status</th>
            <th className="p-2">Payment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">#{r.token}</td>
              <td className="p-2">{r.patientName}</td>
              <td className="p-2">{r.doctorName}</td>
              <td className="p-2">{r.department}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">{r.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
