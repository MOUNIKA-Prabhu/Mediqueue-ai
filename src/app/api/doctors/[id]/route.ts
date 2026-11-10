import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { verifyAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    if (body.consultingFee !== undefined) doctor.consultingFee = Number(body.consultingFee);
    if (body.arrivalTime !== undefined) doctor.arrivalTime = body.arrivalTime;
    if (body.endTime !== undefined) doctor.endTime = body.endTime;
    if (body.isAvailable !== undefined) doctor.isAvailable = Boolean(body.isAvailable);
    if (body.available !== undefined) doctor.isAvailable = Boolean(body.available);
    if (body.unavailableReason !== undefined) doctor.unavailableReason = body.unavailableReason;
    if (body.room !== undefined) doctor.room = body.room;
    if (body.specialty !== undefined) doctor.specialty = body.specialty;

    doctor.lastUpdatedBy = body.lastUpdatedBy || `Admin (${session.username})`;
    doctor.lastUpdatedAt = `Today ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

    await doctor.save();

    return NextResponse.json({ success: true, doctor });
  } catch (err: any) {
    console.error("PATCH /api/doctors/[id] error:", err);
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}
