import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    await connectToDatabase();

    const doctors = await Doctor.find()
      .populate({ path: "departmentId", model: Department })
      .sort({ name: 1 });

    return NextResponse.json(doctors);
  } catch (err: any) {
    console.error("GET /api/admin/doctors error:", err);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
