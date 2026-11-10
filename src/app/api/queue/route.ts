import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const departmentId = searchParams.get("departmentId");

  if (doctorId) {
    const [serving, waiting, completedCount] = await Promise.all([
      prisma.appointment.findFirst({
        where: { doctorId, status: "IN_PROGRESS" },
        include: { patient: true, doctor: { include: { department: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.appointment.findMany({
        where: { doctorId, status: "WAITING" },
        orderBy: { token: "asc" },
        include: { patient: true, doctor: { include: { department: true } } },
      }),
      prisma.appointment.count({
        where: {
          doctorId,
          status: "COMPLETED",
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    return NextResponse.json({
      serving,
      queue: waiting,
      completedCount,
    });
  }

  // All doctors live queue view (for display board or admin summary)
  const doctors = await prisma.doctor.findMany({
    where: departmentId ? { departmentId, isAvailable: true } : { isAvailable: true },
    include: { department: true },
    orderBy: { name: "asc" },
  });

  const liveData = await Promise.all(
    doctors.map(async (doc) => {
      const serving = await prisma.appointment.findFirst({
        where: { doctorId: doc.id, status: "IN_PROGRESS" },
        include: { patient: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
      });

      const nextUp = await prisma.appointment.findMany({
        where: { doctorId: doc.id, status: "WAITING" },
        orderBy: { token: "asc" },
        take: 5,
        select: { id: true, token: true, patient: { select: { name: true } } },
      });

      const waitingCount = await prisma.appointment.count({
        where: { doctorId: doc.id, status: "WAITING" },
      });

      return {
        doctor: {
          id: doc.id,
          name: doc.name,
          department: doc.department.name,
        },
        serving: serving
          ? {
              id: serving.id,
              token: serving.token,
              patientName: serving.patient.name,
            }
          : null,
        nextUp,
        waitingCount,
      };
    })
  );

  return NextResponse.json({ liveQueues: liveData });
}
