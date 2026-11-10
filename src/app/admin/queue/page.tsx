"use client";

import { useEffect, useState, useCallback } from "react";

interface DoctorRow {
  id: string;
  name: string;
  department: { name: string };
}

interface AppointmentItem {
  id: string;
  token: number;
  visitType: string;
  symptomText?: string | null;
  status: string;
  patient: {
    id: string;
    name: string;
    phone: string;
    age: number;
  };
}

export default function AdminQueuePage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [serving, setServing] = useState<AppointmentItem | null>(null);
  const [queue, setQueue] = useState<AppointmentItem[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/admin/doctors")
      .then((r) => r.json())
      .then((docs) => {
        setDoctors(docs);
        if (docs.length > 0 && !selectedDoctor) {
          setSelectedDoctor(docs[0].id);
        }
      });
  }, []);

  const loadQueue = useCallback(() => {
    if (!selectedDoctor) return;
    fetch(`/api/queue?doctorId=${selectedDoctor}`)
      .then((r) => r.json())
      .then((d) => {
        setServing(d.serving || null);
        setQueue(d.queue || []);
        setCompletedCount(d.completedCount || 0);
      });
  }, [selectedDoctor]);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 4000);
    return () => clearInterval(interval);
  }, [loadQueue]);

  const callNext = async () => {
    if (!selectedDoctor) return;
    setLoadingAction(true);
    try {
      await fetch("/api/queue/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: selectedDoctor }),
      });
      loadQueue();
    } finally {
      setLoadingAction(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
    setLoadingAction(true);
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadQueue();
    } finally {
      setLoadingAction(false);
    }
  };

  const selectedDocObj = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Doctor Selector */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Queue & Reception Dashboard</h1>
          <p className="text-sm text-slate-500">Manage live patient tokens, call next, and update statuses</p>
        </div>
        <div className="w-full sm:w-80">
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Select Doctor Queue</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Currently Serving</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700">
            {serving ? `#${serving.token}` : "None"}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {serving ? `${serving.patient.name} (${serving.patient.phone})` : "Waiting for next patient"}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Waiting in Queue</p>
          <p className="mt-2 text-3xl font-extrabold text-blue-700">{queue.length}</p>
          <p className="mt-1 text-xs text-blue-600">Patients waiting in line</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-purple-600">Served Today</p>
          <p className="mt-2 text-3xl font-extrabold text-purple-700">{completedCount}</p>
          <p className="mt-1 text-xs text-purple-600">Appointments completed</p>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Queue Actions for {selectedDocObj?.name ?? "Selected Doctor"}
          </h2>
          <p className="text-xs text-slate-500">Call the next waiting patient or manage active consultations</p>
        </div>
        <button
          disabled={loadingAction || queue.length === 0}
          onClick={callNext}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-emerald-500 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <span>📢 Call Next Patient</span>
        </button>
      </div>

      {/* Currently Serving Detailed Card */}
      {serving && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-white shadow">
                #{serving.token}
              </div>
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                  IN CONSULTATION
                </span>
                <h3 className="text-xl font-bold text-slate-800">{serving.patient.name}</h3>
                <p className="text-xs text-slate-500">
                  Age: {serving.patient.age} · Phone: {serving.patient.phone} · Type: {serving.visitType}
                </p>
                {serving.symptomText && (
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    Reason/Symptoms: <span className="italic">{serving.symptomText}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                disabled={loadingAction}
                onClick={() => updateStatus(serving.id, "COMPLETED")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
              >
                ✓ Mark Served (Complete)
              </button>
              <button
                disabled={loadingAction}
                onClick={() => updateStatus(serving.id, "CANCELLED")}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                ✕ No Show / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waiting List Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="border-b px-6 py-4">
          <h3 className="font-bold text-slate-800">Waiting Patients Queue ({queue.length})</h3>
        </div>

        {queue.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No patients waiting in queue for this doctor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3">Token #</th>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Visit Details</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-brand-blue/10 px-3 py-1 font-extrabold text-brand-blueDark">
                        #{q.token}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{q.patient.name}</td>
                    <td className="px-6 py-4 text-slate-600">{q.patient.phone}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{q.visitType}</div>
                      {q.symptomText && (
                        <span className="text-xs text-slate-400 truncate max-w-xs block">
                          {q.symptomText}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={loadingAction}
                          onClick={() => updateStatus(q.id, "IN_PROGRESS")}
                          className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-600 disabled:opacity-50"
                        >
                          Call Now
                        </button>
                        <button
                          disabled={loadingAction}
                          onClick={() => updateStatus(q.id, "CANCELLED")}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                        >
                          No Show / Skip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
