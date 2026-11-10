import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { doctorId } = await req.json();
    if (!doctorId) {
      return NextResponse.json({ error: "doctorId required" }, { status: 400 });
    }

    // 1. Mark existing IN_PROGRESS appointment as COMPLETED
    await prisma.appointment.updateMany({
      where: { doctorId, status: "IN_PROGRESS" },
      data: { status: "COMPLETED" },
    });

    // 2. Find next WAITING appointment
    const nextAppt = await prisma.appointment.findFirst({
      where: { doctorId, status: "WAITING" },
      orderBy: { token: "asc" },
      include: { patient: true, doctor: { include: { department: true } } },
    });

    if (!nextAppt) {
      return NextResponse.json({ message: "No patients waiting in queue", called: null });
    }

    // 3. Update status to IN_PROGRESS
    const updated = await prisma.appointment.update({
      where: { id: nextAppt.id },
      data: { status: "IN_PROGRESS" },
      include: { patient: true, doctor: { include: { department: true } } },
    });

    return NextResponse.json({ message: "Next patient called", called: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to call next patient" }, { status: 500 });
  }
}
