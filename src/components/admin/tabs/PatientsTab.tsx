"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PatientRecord, INITIAL_EXISTING_PATIENTS } from "@/constants/initialData";
import { Search, Eye, RotateCw, Loader2 } from "lucide-react";

export const PatientsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_EXISTING_PATIENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const loadPatients = useCallback(async (queryStr: string = "") => {
    setIsLoading(true);
    try {
      const url = queryStr
        ? `/api/patients?search=${encodeURIComponent(queryStr)}`
        : "/api/patients";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPatients(data);
        }
      }
    } catch (err) {
      console.warn("Failed to load live patients, fallback to initial data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Live fetch on mount and whenever search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, loadPatients]);

  return (
    <div className="space-y-6 select-none">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md border border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-800">Patient Database Records</h3>
          <p className="text-xs font-semibold text-slate-400">
            Live search active and past registered hospital patients
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name or Mobile..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#067E7F]"
            />
          </div>

          <button
            onClick={() => loadPatients(searchQuery)}
            title="Refresh patient list"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCw className={`h-5 w-5 ${isLoading ? "animate-spin text-[#067E7F]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Patients Results Table */}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Mobile Number</th>
              <th className="px-6 py-4">Age / Gender</th>
              <th className="px-6 py-4">Blood Group</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {isLoading && patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-[#067E7F]" />
                    <span className="font-bold">Fetching latest database records...</span>
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No patient records found matching {searchQuery ? `"${searchQuery}"` : "search criteria"}.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id || patient.phone} className="hover:bg-teal-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-900">{patient.name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">{patient.phone}</td>
                  <td className="px-6 py-4">{patient.age} Yrs / {patient.gender}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-[#067E7F] hover:bg-[#067E7F] hover:text-white transition-colors"
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-[#067E7F]">Patient Medical Profile</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Name</span>
                  <span className="font-extrabold text-slate-900 text-base">{selectedPatient.name}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Phone</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Age / Gender</span>
                  <span className="font-bold text-slate-800">{selectedPatient.age} Yrs / {selectedPatient.gender}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Blood Group</span>
                  <span className="font-black text-rose-600">{selectedPatient.bloodGroup}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Address</span>
                <span className="font-bold text-slate-800">{selectedPatient.address || "Chennai"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
