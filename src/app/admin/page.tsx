import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [patientCount, doctorCount, todayAppointments, pendingCash] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.payment.count({ where: { status: "CASH_PENDING" } }),
  ]);

  const cards = [
    { label: "Total Patients", value: patientCount },
    { label: "Doctors", value: doctorCount },
    { label: "Today's Appointments", value: todayAppointments },
    { label: "Pending Cash Confirmations", value: pendingCash },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">{c.label}</p>
          <p className="mt-2 text-3xl font-bold text-brand-blueDark">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
