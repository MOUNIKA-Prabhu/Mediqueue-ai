"use client";

import React, { useState } from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { Stethoscope, Bell, CheckCircle2, Users, Clock } from "lucide-react";

export const LiveQueueTab: React.FC = () => {
  const { doctors, allTokens } = useKiosk();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || "");
  const [calledToken, setCalledToken] = useState<string | null>(null);

  const activeDoc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const docTokens = allTokens.filter(
    (t) => t.doctorName === activeDoc?.name || t.department === activeDoc?.department
  );

  const waitingQueue = docTokens.filter((t) => t.statusInQueue === "Waiting");
  const servedToday = docTokens.filter((t) => t.statusInQueue === "Completed" || t.statusInQueue === "Serving");

  const handleCallNow = (tokenNum: string) => {
    setCalledToken(tokenNum);
    setTimeout(() => {
      setCalledToken(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Selection Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#067E7F]">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Live OPD Queue Dispatcher</h3>
            <p className="text-xs font-semibold text-slate-400">Select doctor room to manage active queue</p>
          </div>
        </div>

        <div className="w-full sm:w-80">
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full rounded-2xl border-2 border-[#067E7F] bg-slate-50 px-4 py-3 text-base font-extrabold text-slate-800 outline-none cursor-pointer"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Called Alert Notification */}
      {calledToken && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#216830] p-4 text-white shadow-xl animate-pulse">
          <Bell className="h-6 w-6 text-yellow-300" />
          <span className="text-base font-black">
            Calling Token #{calledToken} to {activeDoc?.room || "OPD Room"} now!
          </span>
        </div>
      )}

      {/* 3 Stat Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Serving</p>
            <h3 className="text-3xl font-black text-[#0141AB] mt-1">
              {waitingQueue[0]?.tokenNumber || "TK-101"}
            </h3>
            <span className="text-xs font-bold text-slate-500">Inside Room</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0141AB]">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Waiting in Queue</p>
            <h3 className="text-3xl font-black text-[#F54901] mt-1">{waitingQueue.length} Patients</h3>
            <span className="text-xs font-bold text-slate-500">In Waiting Area</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFEBEA] text-[#F54901]">
            <Users className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Served Today</p>
            <h3 className="text-3xl font-black text-[#216830] mt-1">{servedToday.length + 18} Completed</h3>
            <span className="text-xs font-bold text-emerald-600">Consultation Finished</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF9EC] text-[#216830]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Waiting Queue Table */}
      <div className="space-y-3">
        <h4 className="text-lg font-black text-slate-800">Active Waiting Queue</h4>
        <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Token #</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Call Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {waitingQueue.length > 0 ? (
                waitingQueue.map((item) => (
                  <tr key={item.tokenNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-[#0141AB] text-base">{item.tokenNumber}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{item.patientName}</td>
                    <td className="px-6 py-4">{item.ageGender}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.paymentStatus === "PAID"
                            ? "bg-[#EBF9EC] text-[#216830]"
                            : "bg-[#FFEBEA] text-[#CF1D1B]"
                        }`}
                      >
                        {item.paymentStatus} ({item.paymentMethod})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCallNow(item.tokenNumber)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#067E7F] px-4 py-2 text-xs font-black text-white shadow-md hover:bg-teal-800 active:scale-95 transition-all"
                      >
                        <Bell className="h-4 w-4" /> Call Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-bold">
                    No waiting patients in queue for {activeDoc?.name}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
