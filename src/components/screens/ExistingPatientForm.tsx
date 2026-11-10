"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKiosk } from "@/contexts/KioskContext";
import { HeaderKiosk } from "@/components/HeaderKiosk";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { VirtualNumpad } from "@/components/VirtualNumpad";
import { INITIAL_EXISTING_PATIENTS } from "@/constants/initialData";
import { useBackGracePeriod } from "@/hooks/useBackGracePeriod";
import { ArrowLeft, User, Phone, CheckCircle2, FileText, AlertCircle, UserPlus, Search, Clock } from "lucide-react";

export const ExistingPatientForm: React.FC = () => {
  const { patientData, updatePatientData, savePatientRecord, registeredPatients, setStep, goBack, wasBackNavigated, clearBackNavigated, t } = useKiosk();
  const [activeField, setActiveField] = useState<"name" | "phone" | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [recordFound, setRecordFound] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [lastVisitDate, setLastVisitDate] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const { isGracePeriodActive, secondsRemaining } = useBackGracePeriod({
    wasBackNavigated,
    clearBackNavigated,
    activeField,
  });

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      keyboardRef.current &&
      !keyboardRef.current.contains(e.target as Node)
    ) {
      setActiveField(null);
    }
  };

  const canSearch = patientData.phone.trim().length === 10;

  const performLookup = async () => {
    if (!canSearch || isSearching) return;
    setIsSearching(true);
    setRecordFound(false);
    setNotFound(false);

    try {
      // 1. Try real backend API route
      const res = await fetch(`/api/patients/${patientData.phone}`);
      if (res.ok) {
        const data = await res.json();
        const rawGender = String(data.gender || "").toUpperCase();
        const normGender: "Male" | "Female" | "Other" = rawGender.includes("FEMALE")
          ? "Female"
          : rawGender.includes("OTHER")
          ? "Other"
          : "Male";

        const updatedFields = {
          name: data.name || patientData.name || "Existing Patient",
          age: String(data.age || "35"),
          gender: normGender,
          bloodGroup: data.bloodGroup || "O+",
          address: data.address || "Chennai",
        };

        updatePatientData(updatedFields);
        savePatientRecord(updatedFields);

        if (data.history && data.history.length > 0) {
          setLastVisitDate(new Date(data.history[0].createdAt).toLocaleDateString());
        } else {
          setLastVisitDate("Previous Visit Record");
        }
        setRecordFound(true);
        setIsSearching(false);
        return;
      }
    } catch {
      // API call failed/unavailable, fallback to stored patient list
    }

    // 2. Check stored/in-memory patient database list
    const existing = (registeredPatients || []).find(
      (p) => p.phone === patientData.phone
    );

    if (existing) {
      const updatedFields = {
        name: existing.name,
        age: String(existing.age),
        gender: existing.gender,
        bloodGroup: existing.bloodGroup,
        address: existing.address,
      };
      updatePatientData(updatedFields);
      savePatientRecord(updatedFields);
      setLastVisitDate(existing.lastVisit);
      setRecordFound(true);
    } else {
      // 3. Record NOT found — display clear error banner
      setNotFound(true);
    }
    setIsSearching(false);
  };

  // Auto-trigger lookup when 10 phone digits are typed
  useEffect(() => {
    if (patientData.phone.trim().length === 10 && !recordFound && !notFound && !isSearching) {
      performLookup();
    }
  }, [patientData.phone]);

  // Auto-advance to VISIT_TYPE when record is found without requiring any manual button tap
  useEffect(() => {
    if (recordFound && !isGracePeriodActive) {
      setActiveField(null);
      savePatientRecord();
      const timer = setTimeout(() => {
        setStep("VISIT_TYPE");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [recordFound, isGracePeriodActive, setStep, savePatientRecord]);

  const handleRegisterAsNew = () => {
    updatePatientData({
      patientType: "NEW",
      phone: patientData.phone,
      name: patientData.name,
    });
    setStep("NEW_PATIENT_FORM");
  };

  const handleProceedToVisit = () => {
    savePatientRecord();
    setStep("VISIT_TYPE");
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 select-none z-10"
    >
      <HeaderKiosk />

      <div className="flex flex-1 flex-col items-center justify-start gap-6 max-w-2xl mx-auto w-full my-auto">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#1E293B]">{t("existingPatient")} — Search</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Enter your Mobile Number to fetch your medical records
          </p>
        </div>

        {/* Inputs */}
        <div ref={containerRef} className="w-full space-y-4 bg-white/90 p-6 rounded-3xl shadow-xl border border-slate-200">
          {/* Phone Number (Primary Key) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-[#216830]" /> {t("phoneNumber")} (10 Digits) *
            </label>
            <input
              type="text"
              readOnly
              value={patientData.phone}
              onClick={() => setActiveField("phone")}
              placeholder="Tap to enter 10-digit mobile number"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "phone"
                  ? "border-[#216830] bg-emerald-50/50 ring-4 ring-emerald-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* Optional Full Name filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#216830]" /> {t("fullName")} (Optional)
            </label>
            <input
              type="text"
              readOnly
              value={patientData.name}
              onClick={() => setActiveField("name")}
              placeholder="e.g., Karthik Subramanian"
              className={`w-full rounded-2xl px-4 py-3.5 text-lg font-bold outline-none border-2 transition-all cursor-pointer ${
                activeField === "name"
                  ? "border-[#216830] bg-emerald-50/50 ring-4 ring-emerald-100"
                  : "border-slate-200 bg-slate-50"
              }`}
            />
          </div>

          {/* Manual Search Button */}
          <button
            type="button"
            disabled={!canSearch || isSearching}
            onClick={performLookup}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#216830] py-3.5 text-base font-extrabold text-white shadow-lg hover:bg-emerald-800 disabled:opacity-50 active:scale-95 transition-all"
          >
            <Search className="h-5 w-5" /> {isSearching ? t("fetchingRecords") : "Search Records"}
          </button>
        </div>

        {/* Back Navigation Grace Period Active Alert */}
        {isGracePeriodActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-amber-50 px-6 py-2.5 text-xs font-extrabold text-amber-800 border border-amber-300 shadow-sm"
          >
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            Re-editing mode active ({secondsRemaining}s grace period). Tap any field to make changes before auto-advancing.
          </motion.div>
        )}

        {/* Status Messages & Results */}
        <AnimatePresence mode="wait">
          {/* 1. Searching Spinner */}
          {isSearching && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#EBF9EC] p-4 text-[#216830] border border-[#216830]/30 shadow-md"
            >
              <CheckCircle2 className="h-6 w-6 animate-spin text-[#216830]" />
              <span className="text-base font-bold">{t("fetchingRecords")}</span>
            </motion.div>
          )}

          {/* 2. Found Record Summary Card */}
          {recordFound && (
            <motion.div
              key="found"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex w-full flex-col gap-4 rounded-3xl bg-[#EBF9EC] p-6 text-[#216830] border-2 border-[#216830]/40 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-lg">
                  <FileText className="h-6 w-6 text-[#216830]" />
                  {t("recordsFound")}
                </div>
                {lastVisitDate && (
                  <span className="text-xs font-bold text-slate-500 bg-white/80 px-3 py-1 rounded-full border">
                    Last Visit: {lastVisitDate}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-2xl text-slate-800 text-sm font-semibold">
                <div>
                  <span className="text-slate-500 block text-xs uppercase">Patient Name</span>
                  <span className="font-extrabold text-slate-900">{patientData.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs uppercase">Age / Gender</span>
                  {patientData.age} Yrs / {patientData.gender}
                </div>
                <div>
                  <span className="text-slate-500 block text-xs uppercase">Blood Group</span>
                  <span className="font-bold text-[#216830]">{patientData.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs uppercase">Stored Address</span>
                  {patientData.address}
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToVisit}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#216830] py-3.5 text-base font-extrabold text-white shadow-md hover:bg-emerald-800 active:scale-95 transition-all"
              >
                Proceed to Select Visit Type →
              </button>
            </motion.div>
          )}

          {/* 3. Record NOT Found Error Card */}
          {notFound && (
            <motion.div
              key="notfound"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex w-full flex-col gap-4 rounded-3xl bg-rose-50 p-6 text-rose-900 border-2 border-rose-200 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-rose-600 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-black text-rose-900">No Previous Record Found</h4>
                  <p className="text-xs font-semibold text-rose-700 mt-0.5">
                    No matching hospital history was found for mobile number <strong>{patientData.phone}</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRegisterAsNew}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0141AB] py-3.5 text-base font-extrabold text-white shadow-lg hover:bg-blue-800 active:scale-95 transition-all"
                >
                  <UserPlus className="h-5 w-5" /> Register as a New Patient
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* On-Demand Virtual Keyboard / Numpad Panel */}
        {activeField && (
          <div ref={keyboardRef} className="w-full mt-2">
            {activeField === "name" ? (
              <VirtualKeyboard
                value={patientData.name}
                onChange={(val) => updatePatientData({ name: val })}
                onDone={() => setActiveField(null)}
              />
            ) : (
              <VirtualNumpad
                value={patientData.phone}
                maxLength={10}
                onChange={(val) => updatePatientData({ phone: val })}
                onDone={() => setActiveField(null)}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Row: Back button + Language Toggle */}
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto pt-2 pb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-700 shadow-md hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="h-5 w-5" /> {t("back")}
        </button>

        <LanguageToggle />
      </div>
    </div>
  );
};
