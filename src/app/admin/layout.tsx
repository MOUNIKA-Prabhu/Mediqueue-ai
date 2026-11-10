"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/doctors", label: "Doctors" },
  { href: "/admin/patients", label: "Patients" },
  { href: "/admin/queue", label: "Live Queue Control" },
  { href: "/display", label: "📺 Live Display Board" },
  { href: "/admin/payments", label: "Cash Payments" },
  { href: "/admin/reports", label: "Reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-[#015E66]">MediQueue Admin</span>
          <nav className="hidden gap-4 text-sm font-medium text-slate-600 sm:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-[#015E66]">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
