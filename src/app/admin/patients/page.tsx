"use client";

import { useState } from "react";

interface PatientRow {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
}

export default function AdminPatientsPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PatientRow | null>(null);
  const [notFound, setNotFound] = useState(false);

  const search = async () => {
    setNotFound(false);
    const res = await fetch(`/api/patients/${phone}`);
    if (res.status === 404) {
      setResult(null);
      setNotFound(true);
      return;
    }
    setResult(await res.json());
  };

  return (
    <div className="max-w-md rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-bold text-slate-700">Search Patients</h2>
      <div className="flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2"
        />
        <button onClick={search} className="rounded-xl bg-brand-blue px-4 py-2 text-white">
          Search
        </button>
      </div>
      {notFound && <p className="mt-4 text-red-500">No patient found.</p>}
      {result && (
        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>Name: {result.name}</p>
          <p>Age: {result.age}</p>
          <p>Gender: {result.gender}</p>
          <p>Blood Group: {result.bloodGroup}</p>
        </div>
      )}
    </div>
  );
}
