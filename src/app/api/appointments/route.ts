import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { Patient } from "@/models/Patient";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { patientId, phone, doctorId, visitType, symptomText } = body;

    let targetPatientId = patientId;

    if (!targetPatientId && phone) {
      const patient = await Patient.findOne({ phone });
      if (patient) {
        targetPatientId = patient._id;
      }
    }

    if (!targetPatientId || !doctorId) {
      return NextResponse.json({ error: "Missing patientId or doctorId" }, { status: 400 });
    }

    // Determine start of today for sequential token generation
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get max token for this doctor created today
    const latestDocAppointment = await Appointment.findOne({
      doctorId,
      createdAt: { $gte: startOfToday },
    }).sort({ token: -1 });

    const nextToken = latestDocAppointment ? latestDocAppointment.token + 1 : 1;

    // Count WAITING appointments for queue position
    const waitingCount = await Appointment.countDocuments({
      doctorId,
      status: "WAITING",
    });

    const queuePosition = waitingCount + 1;

    const appointment = await Appointment.create({
      token: nextToken,
      patientId: targetPatientId,
      doctorId,
      visitType: visitType || "REGULAR_CHECKUP",
      symptomText,
      status: "WAITING",
      queuePosition,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({ path: "patientId", model: Patient })
      .populate({ path: "doctorId", model: Doctor, populate: { path: "departmentId", model: Department } });

    return NextResponse.json({ success: true, appointment: populatedAppointment }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate({ path: "patientId", model: Patient })
      .populate({ path: "doctorId", model: Doctor, populate: { path: "departmentId", model: Department } });

    return NextResponse.json(appointments);
  } catch (err: any) {
    console.error("GET /api/appointments error:", err);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
