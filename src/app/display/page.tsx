"use client";

import { useEffect, useState, useRef } from "react";

interface LiveQueueDoctor {
  doctor: {
    id: string;
    name: string;
    department: string;
  };
  serving: {
    id: string;
    token: number;
    patientName: string;
  } | null;
  nextUp: Array<{
    id: string;
    token: number;
    patientName: string;
  }>;
  waitingCount: number;
}

export default function PublicLiveDisplayPage() {
  const [queues, setQueues] = useState<LiveQueueDoctor[]>([]);
  const [time, setTime] = useState<string>("");
  const previousServingMap = useRef<Record<string, number | null>>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLiveData = async () => {
    try {
      const res = await fetch("/api/queue");
      if (!res.ok) return;
      const data = await res.json();
      const liveData: LiveQueueDoctor[] = data.liveQueues || [];

      // Check if any doctor's serving token changed to announce
      liveData.forEach((q) => {
        const docId = q.doctor.id;
        const currentToken = q.serving ? q.serving.token : null;
        const prevToken = previousServingMap.current[docId];

        if (currentToken !== null && currentToken !== prevToken && prevToken !== undefined) {
          // Announce token
          if ("speechSynthesis" in window) {
            const msg = new SpeechSynthesisUtterance(
              `Token number ${currentToken}, please proceed to ${q.doctor.name}, ${q.doctor.department}`
            );
            window.speechSynthesis.speak(msg);
          }
        }
        previousServingMap.current[docId] = currentToken;
      });

      setQueues(liveData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-blue selection:text-white flex flex-col">
      {/* Header Bar */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-8 py-5 backdrop-blur shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl text-slate-950 font-black shadow-lg">
            ✚
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">MediQueue General Hospital</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Live "Now Serving" Patient Queue Display
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 border border-emerald-500/20">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Real-time Live</span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold text-white tracking-wider">{time || "--:--:--"}</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.map((item) => {
          const isServing = !!item.serving;

          return (
            <div
              key={item.doctor.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur relative overflow-hidden group hover:border-slate-700 transition"
            >
              {/* Doctor & Dept Header */}
              <div className="border-b border-slate-800 pb-4 mb-4">
                <span className="inline-block rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {item.doctor.department}
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-white">{item.doctor.name}</h2>
              </div>

              {/* Now Serving Big Display */}
              <div className="my-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Now Serving
                </p>
                {isServing ? (
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-xl text-white animate-pulse">
                    <div>
                      <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Token Number</p>
                      <p className="text-5xl font-black tracking-tight mt-1">#{item.serving!.token}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-emerald-100">Patient</p>
                      <p className="text-lg font-bold text-white max-w-[140px] truncate">{item.serving!.patientName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center">
                    <p className="text-lg font-semibold text-slate-500">Doctor Available</p>
                    <p className="text-xs text-slate-600 mt-1">Ready for next patient</p>
                  </div>
                )}
              </div>

              {/* Next Up Tokens */}
              <div className="mt-2 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Up</p>
                  <p className="text-xs text-slate-500">{item.waitingCount} in line</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.nextUp.length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No upcoming patients</span>
                  ) : (
                    item.nextUp.map((next) => (
                      <span
                        key={next.id}
                        className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-teal-300 border border-slate-700/50"
                      >
                        #{next.token}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-8 py-3 text-center text-xs text-slate-500">
        MediQueue AI Hospital Management System · Automated Live Queue Display
      </footer>
    </div>
  );
}
