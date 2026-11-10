"use client";

import React from "react";
import { useKiosk } from "@/contexts/KioskContext";
import { Users, UserCheck, Calendar, Banknote } from "lucide-react";

export const OverviewTab: React.FC = () => {
  const { doctors, allTokens } = useKiosk();

  const totalArrived = allTokens.length + 24;
  const availableDocs = doctors.filter((d) => d.available).length;
  const pendingCash = allTokens.filter((t) => t.paymentMethod === "Cash" && t.paymentStatus === "NOT PAID").length;

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Patients Arrived Today</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalArrived}</h3>
            <span className="text-xs font-bold text-emerald-600">↑ +14% vs yesterday</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#067E7F]">
            <Users className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Doctors Available Today</p>
            <h3 className="text-3xl font-black text-[#216830] mt-1">{availableDocs} / {doctors.length}</h3>
            <span className="text-xs font-bold text-slate-500">Active OPD Roster</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF9EC] text-[#216830]">
            <UserCheck className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Appointments</p>
            <h3 className="text-3xl font-black text-[#0141AB] mt-1">{allTokens.length} Tokens</h3>
            <span className="text-xs font-bold text-blue-600">Issued via Kiosk</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0141AB]">
            <Calendar className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Cash</p>
            <h3 className="text-3xl font-black text-[#F54901] mt-1">{pendingCash} Unpaid</h3>
            <span className="text-xs font-bold text-[#F54901]">Requires desk collection</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFEBEA] text-[#F54901]">
            <Banknote className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Patient Arrival Times */}
        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-lg font-black text-slate-800">Patient Arrival Frequency (Hourly)</h4>
              <p className="text-xs font-semibold text-slate-400">Today's Patient Volume Distribution</p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-[#015E66] border border-teal-200">
              Live Roster
            </span>
          </div>

          {/* Dynamic Hourly Aggregation */}
          {(() => {
            const baseHours = [
              { time: "08 AM", base: 12, hour: 8 },
              { time: "09 AM", base: 28, hour: 9 },
              { time: "10 AM", base: 42, hour: 10 },
              { time: "11 AM", base: 35, hour: 11 },
              { time: "12 PM", base: 18, hour: 12 },
              { time: "01 PM", base: 14, hour: 13 },
              { time: "02 PM", base: 24, hour: 14 },
              { time: "03 PM", base: 16, hour: 15 },
              { time: "04 PM", base: 20, hour: 16 },
            ];

            const currentHour = new Date().getHours();

            // Count live tokens per hour
            const extraByHour: Record<number, number> = {};
            (allTokens || []).forEach((t) => {
              const h = t.dateTime ? new Date(t.dateTime).getHours() : currentHour;
              if (!isNaN(h)) {
                extraByHour[h] = (extraByHour[h] || 0) + 1;
              }
            });

            const hourlyData = baseHours.map((bh) => ({
              time: bh.time,
              count: bh.base + (extraByHour[bh.hour] || 0),
            }));

            const maxCount = Math.max(...hourlyData.map((d) => d.count), 1);

            return (
              <div className="my-4 flex h-52 items-end justify-between gap-2 sm:gap-3 px-2">
                {hourlyData.map((bar) => {
                  const pct = Math.round((bar.count / maxCount) * 100);
                  return (
                    <div key={bar.time} className="flex flex-1 flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-black text-[#015E66] mb-1.5 transition-all group-hover:scale-110">
                        {bar.count}
                      </span>
                      <div className="relative w-full flex-1 max-w-[36px] bg-slate-100/90 rounded-2xl flex items-end overflow-hidden p-1 shadow-inner border border-slate-200/60">
                        <div
                          style={{ height: `${Math.max(pct, 10)}%` }}
                          className="w-full rounded-xl bg-gradient-to-t from-[#015E66] via-[#057E89] to-[#0141AB] group-hover:from-[#0141AB] group-hover:to-blue-400 transition-all duration-500 shadow-sm"
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-2 whitespace-nowrap">
                        {bar.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Pie/Donut Chart: Patients by Department */}
        <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-lg font-black text-slate-800">Patients by Department</h4>
            <span className="text-xs font-bold text-slate-400">Distribution</span>
          </div>

          <div className="my-4 flex items-center justify-around gap-4">
            {/* SVG Donut Chart */}
            <div className="relative h-44 w-44">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* General Medicine 45% */}
                <path className="text-[#0141AB]" strokeDasharray="45, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Cardiology 25% */}
                <path className="text-[#216830]" strokeDasharray="25, 100" strokeDashoffset="-45" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Emergency 15% */}
                <path className="text-[#F54901]" strokeDasharray="15, 100" strokeDashoffset="-70" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                {/* Others 15% */}
                <path className="text-[#067E7F]" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Breakdown</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0141AB]" />
                <span className="text-slate-700">General Medicine (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#216830]" />
                <span className="text-slate-700">Cardiology (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#F54901]" />
                <span className="text-slate-700">Emergency Care (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#067E7F]" />
                <span className="text-slate-700">Other Specialties (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
