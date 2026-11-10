"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Activity, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 select-none">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#015E66] text-white shadow-md">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">MediQueue Admin</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Control Desk Login
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-xs font-extrabold text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#015E66]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#015E66] py-3.5 text-sm font-black text-white shadow-lg hover:bg-teal-800 active:scale-98 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Sign In to Admin Desk"}
          </button>
        </form>
      </div>
    </main>
  );
}
