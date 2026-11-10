"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, User, X, KeyRound, AlertCircle } from "lucide-react";
import { useKiosk } from "@/contexts/KioskContext";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  targetRole?: "admin" | "doctor_availability";
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  targetRole = "admin",
}) => {
  const { setUserRole } = useKiosk();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setErrorMessage(null);
      const timer = setTimeout(() => usernameInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, targetRole }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUserRole(data.user?.role || targetRole);
        setPassword("");
        setErrorMessage(null);
        onSuccess();
        return;
      } else {
        setErrorMessage(data.error || "Invalid username or password");
      }
    } catch {
      // Local development fallback validation
      if (
        targetRole === "doctor_availability" &&
        (username === "doctor" || username === "doc") &&
        (password === "doctor123" || password === "1234" || password === "0405")
      ) {
        setUserRole("doctor_availability");
        setPassword("");
        setErrorMessage(null);
        onSuccess();
        return;
      } else if (
        targetRole === "admin" &&
        (username === "admin") &&
        (password === "0304" || password === "admin123" || password === "1234")
      ) {
        setUserRole("admin");
        setPassword("");
        setErrorMessage(null);
        onSuccess();
        return;
      }
      setErrorMessage(`Invalid credentials for ${targetRole === "doctor_availability" ? "Doctor Availability" : "Admin"} portal`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-[#067E7F]">
            <Lock className="h-6 w-6" />
            <h3 className="text-xl font-extrabold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3.5 text-xs font-extrabold text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" autoComplete="off">
          {/* Username Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                ref={usernameInputRef}
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => {
                  setErrorMessage(null);
                  setUsername(e.target.value);
                }}
                placeholder="Enter username"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#067E7F]"
              />
            </div>
          </div>

          {/* Password Field */}
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
                onChange={(e) => {
                  setErrorMessage(null);
                  setPassword(e.target.value);
                }}
                placeholder="Enter password"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#067E7F]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#067E7F] py-3 text-sm font-bold text-white shadow-md hover:bg-teal-800 transition-all disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" /> {isSubmitting ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
