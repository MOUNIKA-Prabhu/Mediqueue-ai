"use client";

import { useEffect, useState } from "react";

interface DoctorRow {
  id: string;
  name: string;
  department: { name: string };
  experienceYears: number;
  consultationFee: number;
  isAvailable: boolean;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);

  const load = () => fetch("/api/admin/doctors").then((r) => r.json()).then(setDoctors);

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string, isAvailable: boolean) => {
    await fetch("/api/doctors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isAvailable: !isAvailable }),
    });
    load();
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Experience</th>
            <th className="p-3">Fee</th>
            <th className="p-3">Availability</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-3 font-medium">{d.name}</td>
              <td className="p-3">{d.department.name}</td>
              <td className="p-3">{d.experienceYears} yrs</td>
              <td className="p-3">₹{d.consultationFee}</td>
              <td className="p-3">
                <button
                  onClick={() => toggle(d.id, d.isAvailable)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    d.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {d.isAvailable ? "Available" : "Unavailable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
