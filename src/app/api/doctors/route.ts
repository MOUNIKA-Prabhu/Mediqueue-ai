import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";
import { Department } from "@/models/Department";
import { Appointment } from "@/models/Appointment";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const departmentId = req.nextUrl.searchParams.get("departmentId");

    const query: any = {};
    if (departmentId && departmentId !== "ALL") {
      query.departmentId = departmentId;
    }

    const doctors = await Doctor.find(query).populate({ path: "departmentId", model: Department });

    // Compute live queueCount for each doctor (count of WAITING appointments)
    const doctorsWithQueue = await Promise.all(
      doctors.map(async (doc) => {
        const queueCount = await Appointment.countDocuments({
          doctorId: doc._id,
          status: "WAITING",
        });

        return {
          id: doc._id.toString(),
          name: doc.name,
          departmentId: doc.departmentId?._id?.toString() || "",
          department: (doc.departmentId as any)?.name || "General Medicine",
          specialty: doc.specialty || `${(doc.departmentId as any)?.name || "OPD"} Specialist`,
          experienceYears: doc.experienceYears || 5,
          consultingFee: doc.consultingFee,
          arrivalTime: doc.arrivalTime || "09:00 AM",
          endTime: doc.endTime || "05:00 PM",
          available: doc.isAvailable,
          availabilityTime: doc.isAvailable ? "Available Now" : `Available at ${doc.endTime || "05:00 PM"}`,
          unavailabilityReason: doc.unavailableReason,
          room: doc.room || "OPD 101",
          queueCount,
          lastUpdatedBy: doc.lastUpdatedBy || "Admin / OPD Desk",
          lastUpdatedAt: doc.lastUpdatedAt || "Today",
        };
      })
    );

    return NextResponse.json(doctorsWithQueue);
  } catch (err: any) {
    console.error("GET /api/doctors error:", err);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
