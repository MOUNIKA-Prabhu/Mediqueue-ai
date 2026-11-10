"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const navItems = [
    { href: "/", label: lang === "ta" ? "முகப்பு" : "Kiosk Home" },
    { href: "/patient-type", label: lang === "ta" ? "பதிவு" : "New Booking" },
    { href: "/display", label: lang === "ta" ? "வரிசை திரை" : "Live Display" },
    { href: "/doctors", label: lang === "ta" ? "மருத்துவர்கள்" : "Doctors" },
    { href: "/admin", label: lang === "ta" ? "நிர்வாகி" : "Admin Panel" },
  ];

  return (
    <nav className="bg-slate-800/90 text-white border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
