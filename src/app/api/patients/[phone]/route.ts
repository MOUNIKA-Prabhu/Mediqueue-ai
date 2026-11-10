import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Patient } from "@/models/Patient";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";
import { findInMemoryPatient } from "@/lib/patientStore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  try {
    const { phone } = await params;
    const cleanPhone = String(phone).trim();

    let patient: any = null;
    let appointments: any[] = [];

    try {
      await connectToDatabase();
      patient = await Patient.findOne({ phone: cleanPhone });

      if (patient) {
        appointments = await Appointment.find({ patientId: patient._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate({
            path: "doctorId",
            model: Doctor,
            populate: { path: "departmentId", model: Department },
          });
      }
    } catch (dbErr) {
      console.warn("GET /api/patients/[phone] DB warning:", dbErr);
    }

    if (!patient) {
      const memPatient = findInMemoryPatient(cleanPhone);
      if (memPatient) {
        return NextResponse.json({
          id: memPatient.id,
          name: memPatient.name,
          age: String(memPatient.age),
          gender: memPatient.gender,
          phone: memPatient.phone,
          address: memPatient.address,
          bloodGroup: memPatient.bloodGroup,
          history: [],
        });
      }
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

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
    console.error("GET /api/patients/[phone] error:", err);
    return NextResponse.json({ error: "Patient lookup failed" }, { status: 500 });
  }
}
