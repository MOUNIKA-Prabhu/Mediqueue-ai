"use client";

import React, { useState, useEffect, useRef } from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { Doctor } from "@/constants/doctors";
import {
  Stethoscope,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Activity,
  LogOut,
  LayoutDashboard,
  Plus,
  Trash2,
  DollarSign,
  List,
  Calendar,
} from "lucide-react";

export type DoctorPortalTab = "DOCTOR_LIST" | "DOCTOR_AVAILABILITY" | "CONSULTING_FEES";

export const DoctorAvailabilityScreen: React.FC = () => {
  const { doctors, updateDoctor, addDoctor, removeDoctor, setAdminMode, setUserRole, setStep, userRole } = useKiosk();
  const updatePanelRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<DoctorPortalTab>("DOCTOR_AVAILABILITY");

  // Availability Tab state
  const [selectedDocId, setSelectedDocId] = useState<string>(doctors[0]?.id || "");
  const [arrivalTime, setArrivalTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [consultingFee, setConsultingFee] = useState<string>("500");
  const [isAvailable, setIsAvailable] = useState(true);
  const [reason, setReason] = useState("");
  const [updateNotice, setUpdateNotice] = useState<string | null>(null);

  // Add / Edit Doctor Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState("");
  const [docDept, setDocDept] = useState("General Medicine");
  const [docFee, setDocFee] = useState<string>("");
  const [docRoom, setDocRoom] = useState("OPD 101");
  const [docAvail, setDocAvail] = useState(true);

  // Fee Quick-Edit state map
  const [feeInputs, setFeeInputs] = useState<Record<string, string>>({});

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeDoc = doctors.find((d) => d.id === selectedDocId) || doctors[0];

  useEffect(() => {
    if (activeDoc) {
      setArrivalTime(activeDoc.arrivalTime || "09:00 AM");
      setEndTime(activeDoc.endTime || "05:00 PM");
      setConsultingFee(activeDoc.consultingFee !== undefined && activeDoc.consultingFee !== null ? String(activeDoc.consultingFee) : "");
      setIsAvailable(activeDoc.available);
      setReason(activeDoc.unavailabilityReason || "");
    }
  }, [selectedDocId, activeDoc]);

  // Sync feeInputs map whenever doctors change
  useEffect(() => {
    const initial: Record<string, string> = {};
    doctors.forEach((d) => {
      initial[d.id] = String(d.consultingFee);
    });
    setFeeInputs(initial);
  }, [doctors]);

  const handleSelectEditDoctor = (doc: Doctor) => {
    setSelectedDocId(doc.id);
    setArrivalTime(doc.arrivalTime || "09:00 AM");
    setEndTime(doc.endTime || "05:00 PM");
    setConsultingFee(doc.consultingFee !== undefined && doc.consultingFee !== null ? String(doc.consultingFee) : "");
    setIsAvailable(doc.available);
    setReason(doc.unavailabilityReason || "");
    setTimeout(() => {
      updatePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleUpdateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc) return;

    const updated: Doctor = {
      ...activeDoc,
      arrivalTime,
      endTime,
      consultingFee: Number(consultingFee) || activeDoc.consultingFee,
      available: isAvailable,
      availabilityTime: isAvailable ? "Available Now" : `Available at ${endTime}`,
      unavailabilityReason: !isAvailable ? reason : undefined,
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: `Today ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    };

    updateDoctor(updated);
    setUpdateNotice(`Updated schedule for ${activeDoc.name} successfully!`);
    setTimeout(() => setUpdateNotice(null), 3000);
  };

  const handleSaveFee = (doc: Doctor) => {
    const rawFee = feeInputs[doc.id];
    const newFee = rawFee === "" || rawFee === undefined ? doc.consultingFee : Number(rawFee);
    const updated: Doctor = {
      ...doc,
      consultingFee: newFee,
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: `Today ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    };
    updateDoctor(updated);
    setUpdateNotice(`Updated fee for ${doc.name} to ₹${newFee}!`);
    setTimeout(() => setUpdateNotice(null), 3000);
  };

  const handleAddOrEditDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    if (editingDocId) {
      const existing = doctors.find((d) => d.id === editingDocId);
      if (existing) {
        updateDoctor({
          ...existing,
          name: docName,
          department: docDept,
          specialty: docDept,
          consultingFee: Number(docFee) || 500,
          room: docRoom,
          available: docAvail,
          availabilityTime: docAvail ? "Available Now" : "Unavailable",
        });
        setUpdateNotice(`Updated doctor details for ${docName}!`);
      }
    } else {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        name: docName,
        department: docDept,
        specialty: `${docDept} Specialist`,
        queueCount: 0,
        available: docAvail,
        availabilityTime: docAvail ? "Available Now" : "Unavailable",
        consultingFee: Number(docFee) || 500,
        room: docRoom,
        arrivalTime: "09:00 AM",
        endTime: "05:00 PM",
        lastUpdatedBy: "Admin / OPD Desk",
        lastUpdatedAt: "Just Now",
      };
      addDoctor(newDoc);
      setUpdateNotice(`Added new doctor ${docName} successfully!`);
    }

    // Reset Form
    setShowAddForm(false);
    setEditingDocId(null);
    setDocName("");
    setDocFee("");
    setTimeout(() => setUpdateNotice(null), 3000);
  };

  const startEditDoctor = (doc: Doctor) => {
    setEditingDocId(doc.id);
    setDocName(doc.name);
    setDocDept(doc.department);
    setDocFee(String(doc.consultingFee));
    setDocRoom(doc.room || "OPD 101");
    setDocAvail(doc.available);
    setShowAddForm(true);
  };

  const handleRemoveDoctor = (doc: Doctor) => {
    if (confirm(`Are you sure you want to remove ${doc.name} from the system?`)) {
      removeDoctor(doc.id);
      setUpdateNotice(`Removed ${doc.name} from doctor list.`);
      setTimeout(() => setUpdateNotice(null), 3000);
    }
  };

  const totalDoctors = doctors.length;
  const availableCount = doctors.filter((d) => d.available).length;
  const unavailableCount = totalDoctors - availableCount;

  return (
    <div className="relative min-h-screen w-full bg-slate-100 select-none">
      {/* Left Sidebar (#015E66) - Fixed position with internal nav scroll */}
      <aside className="fixed top-0 left-0 h-screen w-64 md:w-72 z-30 flex flex-col justify-between bg-[#015E66] p-6 text-white shadow-2xl">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6 flex flex-col min-h-0">
            <div className="flex items-center gap-3 border-b border-teal-600/40 pb-5 shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#015E66] shadow-md">
                <Activity className="h-6 w-6 text-[#015E66]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">MediQueue</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200">
                  Doctor Portal
                </p>
              </div>
            </div>

            {/* Internal scrollable Nav list section */}
            <nav className="space-y-2 overflow-y-auto flex-1 my-2 pr-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-teal-300 px-3">
                Doctor Management
              </div>

              <div className="ml-2 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("DOCTOR_LIST")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    activeTab === "DOCTOR_LIST"
                      ? "bg-[#057E89] text-white shadow-md"
                      : "text-teal-100 hover:bg-[#057E89]/50"
                  }`}
                >
                  <List className="h-4 w-4" /> Doctor List
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("DOCTOR_AVAILABILITY")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    activeTab === "DOCTOR_AVAILABILITY"
                      ? "bg-[#057E89] text-white shadow-md"
                      : "text-teal-100 hover:bg-[#057E89]/50"
                  }`}
                >
                  <Calendar className="h-4 w-4" /> Doctor Availability
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("CONSULTING_FEES")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    activeTab === "CONSULTING_FEES"
                      ? "bg-[#057E89] text-white shadow-md"
                      : "text-teal-100 hover:bg-[#057E89]/50"
                  }`}
                >
                  <DollarSign className="h-4 w-4" /> Consulting Fees
                </button>
              </div>

              {/* "Full Dashboard" button -> links back to main Admin Dashboard (admin session only) */}
              {userRole !== "doctor_availability" && (
                <button
                  type="button"
                  onClick={() => setAdminMode("DASHBOARD")}
                  className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-teal-100 hover:bg-[#057E89]/50 hover:text-white transition-all mt-6 border-t border-teal-600/30 pt-4"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Full Dashboard
                </button>
              )}
            </nav>
          </div>

          <div className="border-t border-teal-600/40 pt-4 space-y-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setUserRole(null);
                setAdminMode("LOGIN_AS");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-900/30 py-3 text-xs font-extrabold text-rose-200 hover:bg-rose-900/60 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Exit Portal
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container beside fixed sidebar */}
      <main className="ml-64 md:ml-72 flex-1 min-h-screen p-6 md:p-10 space-y-6">
        {/* Header with Live Clock */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {activeTab === "DOCTOR_LIST" && "Doctor List & Directory"}
              {activeTab === "DOCTOR_AVAILABILITY" && "Doctor Availability Management"}
              {activeTab === "CONSULTING_FEES" && "Consulting Fees Management"}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              {activeTab === "DOCTOR_LIST" && "Add, edit, view & remove doctors in the hospital system"}
              {activeTab === "DOCTOR_AVAILABILITY" && "Manage doctor schedules, consulting fees & live availability status"}
              {activeTab === "CONSULTING_FEES" && "View and edit consultation fees independently for each doctor"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-[#015E66] block">{currentTime}</span>
            <span className="text-xs font-bold text-slate-500">{currentDate}</span>
          </div>
        </div>

        {/* Global Notice Banner */}
        {updateNotice && (
          <div className="flex items-center gap-2 rounded-2xl bg-[#EBF9EC] p-4 text-[#216830] font-black text-sm border border-[#216830]/30 shadow-md">
            <CheckCircle2 className="h-5 w-5 text-[#216830]" /> {updateNotice}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: DOCTOR LIST PAGE */}
        {/* ========================================================= */}
        {activeTab === "DOCTOR_LIST" && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-700">
                Total Registered Doctors: <span className="text-[#015E66] text-lg font-black">{doctors.length}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingDocId(null);
                  setDocName("");
                  setDocFee("");
                  setShowAddForm(!showAddForm);
                }}
                className="flex items-center gap-2 rounded-2xl bg-[#015E66] px-5 py-2.5 text-sm font-black text-white shadow-lg hover:bg-teal-800 transition-all"
              >
                <Plus className="h-4 w-4" /> {showAddForm ? "Cancel" : "Add New Doctor"}
              </button>
            </div>

            {/* Add / Edit Doctor Form Card */}
            {showAddForm && (
              <div className="rounded-3xl bg-white p-6 shadow-xl border-2 border-teal-600/30 space-y-4">
                <h3 className="text-lg font-black text-[#015E66]">
                  {editingDocId ? "Edit Doctor Information" : "Add New Doctor to Portal"}
                </h3>
                <form onSubmit={handleAddOrEditDoctorSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Dr. Anitha Ramesh"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Department</label>
                    <select
                      value={docDept}
                      onChange={(e) => setDocDept(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    >
                      {["General Medicine", "Cardiology", "Dentistry", "Nephrology", "Neurology", "Orthopedics", "Pediatrics", "Emergency OPD"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Consultation Fee (₹)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={docFee}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          setDocFee(val);
                        }
                      }}
                      placeholder="e.g. 500"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-1">OPD Room</label>
                    <input
                      type="text"
                      value={docRoom}
                      onChange={(e) => setDocRoom(e.target.value)}
                      placeholder="e.g. OPD 104"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Initial Availability</label>
                    <select
                      value={docAvail ? "1" : "0"}
                      onChange={(e) => setDocAvail(e.target.value === "1")}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    >
                      <option value="1">Available Now</option>
                      <option value="0">Unavailable</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-[#015E66] py-2.5 text-sm font-black text-white shadow-md hover:bg-teal-900 transition-all"
                    >
                      {editingDocId ? "Update Doctor" : "Save Doctor"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Doctor List Table */}
            <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Doctor Name</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Room</th>
                    <th className="px-5 py-4">Consultation Fee</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {doctors.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-4 font-black text-slate-900">{doc.name}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-600">{doc.department}</td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-700">{doc.room || "OPD Desk"}</td>
                      <td className="px-5 py-4 font-black text-slate-900">₹{doc.consultingFee}</td>
                      <td className="px-5 py-4">
                        {doc.available ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF9EC] px-3 py-1 text-xs font-black text-[#216830] border border-[#216830]/20">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEBEA] px-3 py-1 text-xs font-black text-[#CF1D1B] border border-[#CF1D1B]/30">
                            <XCircle className="h-3.5 w-3.5" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => startEditDoctor(doc)}
                          className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-black text-[#015E66] hover:bg-[#015E66] hover:text-white transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 inline mr-1" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoctor(doc)}
                          className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 inline mr-1" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DOCTOR AVAILABILITY PAGE (Original Schedule Page) */}
        {/* ========================================================= */}
        {activeTab === "DOCTOR_AVAILABILITY" && (
          <div className="space-y-6">
            {/* 4 Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Doctors</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{totalDoctors}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#015E66]">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available</p>
                  <h3 className="text-3xl font-black text-[#216830] mt-1">{availableCount}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF9EC] text-[#216830]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unavailable</p>
                  <h3 className="text-3xl font-black text-[#CF1D1B] mt-1">{unavailableCount}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFEBEA] text-[#CF1D1B]">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Updated</p>
                  <h3 className="text-base font-black text-slate-800 mt-1">Just Now</h3>
                  <span className="text-[10px] font-bold text-slate-400">By Admin / OPD Desk</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0141AB]">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Main Doctor Availability Table */}
            <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Doctor Name</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Arrival Time</th>
                    <th className="px-5 py-4">End Time</th>
                    <th className="px-5 py-4">Fee</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Last Updated</th>
                    <th className="px-5 py-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {doctors.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-4 font-black text-slate-900">{doc.name}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-600">{doc.department}</td>
                      <td className="px-5 py-4 font-mono text-xs">{doc.arrivalTime || "09:00 AM"}</td>
                      <td className="px-5 py-4 font-mono text-xs">{doc.endTime || "05:00 PM"}</td>
                      <td className="px-5 py-4 font-black text-slate-900">₹{doc.consultingFee}</td>
                      <td className="px-5 py-4">
                        {doc.available ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF9EC] px-3 py-1 text-xs font-black text-[#216830] border border-[#216830]/20">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEBEA] px-3 py-1 text-xs font-black text-[#CF1D1B] border border-[#CF1D1B]/30">
                            <XCircle className="h-3.5 w-3.5" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        <div>{doc.lastUpdatedAt || "Today"}</div>
                        <div className="text-[10px] font-bold text-slate-400">{doc.lastUpdatedBy || "Admin"}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectEditDoctor(doc)}
                          className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-black text-[#015E66] hover:bg-[#015E66] hover:text-white transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 inline mr-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Update Doctor Availability Form below table */}
            <div ref={updatePanelRef} className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-[#015E66] font-black text-lg">
                <Stethoscope className="h-6 w-6" /> Update Doctor Schedule & Timings
              </div>

              <form onSubmit={handleUpdateSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Doctor Name Dropdown */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Select Doctor Name
                    </label>
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-800 outline-none focus:border-[#015E66]"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Department (Read-Only)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={activeDoc?.department || ""}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 outline-none"
                    />
                  </div>

                  {/* Consulting Fee */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Consulting Fee (₹)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={consultingFee}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          setConsultingFee(val);
                        }
                      }}
                      placeholder="Enter consulting fee (e.g. 500)"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      placeholder="e.g. 09:00 AM"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="e.g. 05:00 PM"
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
                    />
                  </div>

                  {/* Availability Radio */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Availability Status
                    </label>
                    <div className="flex items-center gap-4 py-2">
                      <label className="flex items-center gap-2 text-sm font-black text-[#216830] cursor-pointer">
                        <input
                          type="radio"
                          name="avail"
                          checked={isAvailable === true}
                          onChange={() => setIsAvailable(true)}
                          className="h-4 w-4 text-[#216830]"
                        />
                        Available
                      </label>
                      <label className="flex items-center gap-2 text-sm font-black text-[#CF1D1B] cursor-pointer">
                        <input
                          type="radio"
                          name="avail"
                          checked={isAvailable === false}
                          onChange={() => setIsAvailable(false)}
                          className="h-4 w-4 text-[#CF1D1B]"
                        />
                        Unavailable
                      </label>
                    </div>
                  </div>
                </div>

                {!isAvailable && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#CF1D1B] block mb-1">
                      Reason for Unavailability (Optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., In Emergency Surgery / On Leave / In Rounds"
                      className="w-full rounded-2xl border-2 border-[#CF1D1B]/40 bg-[#FFEBEA] px-4 py-3 text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#015E66] px-8 py-3.5 text-base font-black text-white shadow-xl hover:bg-teal-900 active:scale-95 transition-all"
                  >
                    Update Doctor Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONSULTING FEES PAGE */}
        {/* ========================================================= */}
        {activeTab === "CONSULTING_FEES" && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-black uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Doctor Name</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Current Consultation Fee</th>
                    <th className="px-5 py-4">New Fee (₹)</th>
                    <th className="px-5 py-4 text-right">Update Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {doctors.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-4 font-black text-slate-900">{doc.name}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-600">{doc.department}</td>
                      <td className="px-5 py-4 font-black text-xl text-[#015E66]">₹{doc.consultingFee}</td>
                      <td className="px-5 py-4">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={feeInputs[doc.id] ?? String(doc.consultingFee)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*$/.test(val)) {
                              setFeeInputs({ ...feeInputs, [doc.id]: val });
                            }
                          }}
                          className="w-32 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-slate-900 outline-none focus:border-[#015E66]"
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveFee(doc)}
                          className="rounded-xl bg-[#015E66] px-4 py-2 text-xs font-black text-white hover:bg-teal-900 active:scale-95 transition-all shadow-md"
                        >
                          Save Fee
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorAvailabilityScreen;
