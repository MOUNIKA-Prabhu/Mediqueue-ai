import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Patient } from "@/models/Patient";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const phone = req.nextUrl.searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing phone search parameter" }, { status: 400 });
    }

    const patient = await Patient.findOne({ phone });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "doctorId",
        model: Doctor,
        populate: { path: "departmentId", model: Department },
      });

    const history = appointments.map((a: any) => ({
      appointmentId: a._id.toString(),
      tokenNumber: a.token,
      doctorId: a.doctorId?._id?.toString() || "",
      doctorName: a.doctorId?.name || "OPD Doctor",
      department: a.doctorId?.departmentId?.name || "General OPD",
      visitType: a.visitType,
      status: a.status,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({
      id: patient._id.toString(),
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      history,
    });
  } catch (err: any) {
    console.error("GET /api/patients/lookup error:", err);
    return NextResponse.json({ error: "Patient lookup failed" }, { status: 500 });
  }
}
