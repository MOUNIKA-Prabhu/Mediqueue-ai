import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Patient } from "@/models/Patient";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const appointment = await Appointment.findById(id)
      .populate({ path: "patientId", model: Patient })
      .populate({ path: "doctorId", model: Doctor, populate: { path: "departmentId", model: Department } });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Count patients ahead with WAITING status created before this appointment for the same doctor
    const patientsAhead = await Appointment.countDocuments({
      doctorId: appointment.doctorId._id,
      status: "WAITING",
      createdAt: { $lt: appointment.createdAt },
    });

    const currentQueuePosition = patientsAhead + 1;

    return NextResponse.json({
      id: appointment._id.toString(),
      token: appointment.token,
      tokenNumber: appointment.token,
      status: appointment.status,
      visitType: appointment.visitType,
      symptomText: appointment.symptomText,
      queuePosition: currentQueuePosition,
      patientsAhead,
      patient: appointment.patientId,
      doctor: appointment.doctorId,
      createdAt: appointment.createdAt,
    });
  } catch (err: any) {
    console.error("GET /api/appointments/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (body.status) {
      appointment.status = body.status;
    }

    await appointment.save();

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    console.error("PATCH /api/appointments/[id] error:", err);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
