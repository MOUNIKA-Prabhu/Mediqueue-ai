import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { Appointment } from "@/models/Appointment";
import { Patient } from "@/models/Patient";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    await connectToDatabase();

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({
        path: "appointmentId",
        model: Appointment,
        populate: { path: "patientId", model: Patient },
      });

    return NextResponse.json(payments);
  } catch (err: any) {
    console.error("GET /api/admin/payments error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
