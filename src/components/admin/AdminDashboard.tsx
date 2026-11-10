"use client";

import React, { useState } from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { OverviewTab } from "./tabs/OverviewTab";
import { PatientsTab } from "./tabs/PatientsTab";
import { LiveQueueTab } from "./tabs/LiveQueueTab";
import { CashPaymentTab } from "./tabs/CashPaymentTab";
import { ReportTab } from "./tabs/ReportTab";
import {
  LayoutDashboard,
  Users,
  Activity,
  Banknote,
  FileBarChart,
  Stethoscope,
  LogOut,
} from "lucide-react";

export type AdminTab = "DASHBOARD" | "PATIENTS" | "LIVE_QUEUE" | "CASH_PAYMENT" | "REPORT";

export const AdminDashboard: React.FC = () => {
  const { setAdminMode, setUserRole } = useKiosk();
  const [activeTab, setActiveTab] = useState<AdminTab>("DASHBOARD");

  const navItems = [
    { id: "DASHBOARD" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "PATIENTS" as const, label: "Patients", icon: Users },
    { id: "LIVE_QUEUE" as const, label: "Live Queue Control", icon: Activity },
    { id: "CASH_PAYMENT" as const, label: "Cash Payment", icon: Banknote },
    { id: "REPORT" as const, label: "Report", icon: FileBarChart },
  ];

  const handleExitAdmin = () => {
    setUserRole(null);
    setAdminMode("LOGIN_AS");
  };

  const handleGoToDoctorAvailability = () => {
    setAdminMode("DOCTOR_AVAILABILITY");
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-100 select-none">
      {/* Left Sidebar: Dark Teal #015E66 - Fixed position with internal nav scroll */}
      <aside className="fixed top-0 left-0 h-screen w-64 md:w-72 z-30 flex flex-col justify-between bg-[#015E66] p-6 text-white shadow-2xl">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6 flex flex-col min-h-0">
            {/* Top Logo */}
            <div className="flex items-center gap-3 border-b border-teal-600/40 pb-5 shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#015E66] shadow-md">
                <Activity className="h-6 w-6 text-[#015E66]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">MediQueue</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200">
                  Admin Control Desk
                </p>
              </div>
            </div>

            {/* Internal scrollable Nav Items */}
            <nav className="space-y-2 overflow-y-auto flex-1 my-2 pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-extrabold transition-all ${
                      isActive
                        ? "bg-[#057E89] text-white shadow-lg shadow-[#057E89]/40 ring-1 ring-white/20"
                        : "text-teal-100 hover:bg-[#057E89]/50 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}

              <button
                onClick={handleGoToDoctorAvailability}
                className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-teal-100 hover:bg-[#057E89]/50 hover:text-white transition-all mt-4 border-t border-teal-600/30 pt-4"
              >
                <Stethoscope className="h-5 w-5" />
                Doctor Availability
              </button>
            </nav>
          </div>

          {/* Sidebar Footer: Logged-in Role */}
          <div className="border-t border-teal-600/40 pt-4 space-y-3 shrink-0">
            <div className="flex items-center gap-3 bg-[#057E89]/60 p-3 rounded-2xl border border-white/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#015E66] font-black text-sm">
                OPD
              </div>
              <div>
                <p className="text-xs font-black text-white">Receptionist</p>
                <p className="text-[10px] font-semibold text-teal-200">OPD Reception</p>
              </div>
            </div>

            <button
              onClick={handleExitAdmin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-900/30 py-3 text-xs font-extrabold text-rose-200 hover:bg-rose-900/60 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Exit Admin Mode
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View Area beside fixed sidebar */}
      <main className="ml-64 md:ml-72 flex-1 min-h-screen p-6 md:p-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Hospital OPD Kiosk Admin Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold text-[#015E66] border border-teal-200">
              Live System Active
            </span>
          </div>
        </div>

        {/* Render Tab Contents */}
        {activeTab === "DASHBOARD" && <OverviewTab />}
        {activeTab === "PATIENTS" && <PatientsTab />}
        {activeTab === "LIVE_QUEUE" && <LiveQueueTab />}
        {activeTab === "CASH_PAYMENT" && <CashPaymentTab />}
        {activeTab === "REPORT" && <ReportTab />}
      </main>
    </div>
  );
};
