import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { estimateWaitMinutes } from "@/lib/queue-logic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  // Find appointment by exact appointment ID, token number (for today), or patient phone
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

  let appt = await prisma.appointment.findFirst({
    where: {
      OR: [
        { id: query },
        {
          token: !isNaN(Number(query)) ? Number(query) : -1,
          createdAt: { gte: todayStart },
        },
        {
          patient: { phone: query },
          createdAt: { gte: todayStart },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { doctor: { include: { department: true } }, patient: true, payment: true },
  });

  if (!appt) {
    return NextResponse.json({ error: "No active appointment found for today" }, { status: 404 });
  }

  const patientsAhead = await prisma.appointment.count({
    where: {
      doctorId: appt.doctorId,
      status: "WAITING",
      token: { lt: appt.token },
    },
  });

  return NextResponse.json({
    id: appt.id,
    token: appt.token,
    status: appt.status,
    patientsAhead,
    estimatedWaitMinutes: estimateWaitMinutes(patientsAhead, appt.doctor.department.name),
    doctorName: appt.doctor.name,
    department: appt.doctor.department.name,
    consultationFee: appt.doctor.consultationFee,
    patientName: appt.patient.name,
    phone: appt.patient.phone,
    paymentStatus: appt.payment?.status || "NOT_PAID",
  });
}
