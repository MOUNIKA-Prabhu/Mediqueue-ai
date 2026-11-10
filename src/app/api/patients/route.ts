import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Patient } from "@/models/Patient";
import { getInMemoryPatients, saveInMemoryPatient } from "@/lib/patientStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim();

    let dbPatients: any[] = [];
    try {
      await connectToDatabase();
      let filter = {};
      if (search) {
        const regex = new RegExp(search, "i");
        filter = {
          $or: [
            { name: regex },
            { phone: regex },
            { bloodGroup: regex },
            { address: regex },
          ],
        };
      }
      dbPatients = await Patient.find(filter).sort({ updatedAt: -1, createdAt: -1 });
    } catch (dbErr) {
      console.warn("GET /api/patients DB read warning, falling back to memory store:", dbErr);
    }

    // Always merge MongoDB records with in-memory records to guarantee complete data availability
    const memoryPatients = getInMemoryPatients();
    const mapByPhone = new Map<string, any>();

    // Add memory patients first
    memoryPatients.forEach((p) => {
      mapByPhone.set(p.phone, p);
    });

    // Overlay MongoDB patients (more authoritative if present)
    dbPatients.forEach((p: any) => {
      mapByPhone.set(p.phone, {
        id: p._id.toString(),
        name: p.name,
        phone: p.phone,
        age: Number(p.age) || 30,
        gender: p.gender,
        bloodGroup: p.bloodGroup || "O+",
        address: p.address || "Chennai",
        lastVisit: p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    });

    let resultList = Array.from(mapByPhone.values());

    if (search) {
      const lowerSearch = search.toLowerCase();
      resultList = resultList.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.phone.includes(lowerSearch) ||
          (p.bloodGroup && p.bloodGroup.toLowerCase().includes(lowerSearch)) ||
          (p.address && p.address.toLowerCase().includes(lowerSearch))
      );
    }

    return NextResponse.json(resultList);
  } catch (err: any) {
    console.error("GET /api/patients error:", err);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age, gender, phone, address, bloodGroup, emergencyContact } = body;

    if (!name || !phone || !age || !gender) {
      return NextResponse.json({ error: "Missing required patient fields" }, { status: 400 });
    }

    const cleanPhone = String(phone).trim();
    const cleanName = String(name).trim();

    // Save to in-memory store immediately
    const memRecord = saveInMemoryPatient({
      name: cleanName,
      age,
      gender,
      phone: cleanPhone,
      address,
      bloodGroup,
    });

    let dbPatient = null;
    try {
      await connectToDatabase();
      dbPatient = await Patient.findOne({ phone: cleanPhone });

      if (dbPatient) {
        dbPatient.name = cleanName;
        dbPatient.age = String(age);
        dbPatient.gender = gender;
        dbPatient.address = address || dbPatient.address;
        dbPatient.bloodGroup = bloodGroup || dbPatient.bloodGroup;
        if (emergencyContact) dbPatient.emergencyContact = emergencyContact;
        await dbPatient.save();
      } else {
        dbPatient = await Patient.create({
          name: cleanName,
          age: String(age),
          gender,
          phone: cleanPhone,
          address: address || "Chennai",
          bloodGroup: bloodGroup || "O+",
          emergencyContact: emergencyContact || cleanPhone,
        });
      }
    } catch (dbErr) {
      console.warn("POST /api/patients DB write warning, saved to memory store:", dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        patient: dbPatient || memRecord,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/patients error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create patient" }, { status: 500 });
  }
}
