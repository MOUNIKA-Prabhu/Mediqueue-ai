import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "mediqueue";
const ADMIN_DEFAULT_USERNAME = process.env.ADMIN_DEFAULT_USERNAME || "admin";
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
const DOCTOR_AVAIL_DEFAULT_USERNAME = process.env.DOCTOR_AVAIL_DEFAULT_USERNAME || "doctor";
const DOCTOR_AVAIL_DEFAULT_PASSWORD = process.env.DOCTOR_AVAIL_DEFAULT_PASSWORD || "doctor123";

// Simple Schemas for seed script to avoid Next.js module import resolution issues
const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameTa: { type: String },
}, { timestamps: true });

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  experienceYears: { type: Number, default: 5 },
  consultingFee: { type: Number, required: true, default: 500 },
  arrivalTime: { type: String, default: "09:00 AM" },
  endTime: { type: String, default: "05:00 PM" },
  isAvailable: { type: Boolean, default: true },
  unavailableReason: { type: String },
  room: { type: String, default: "OPD 101" },
  specialty: { type: String, default: "General Specialist" },
  lastUpdatedBy: { type: String, default: "Admin / OPD Desk" },
  lastUpdatedAt: { type: String, default: "Just Now" },
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "SUPER_ADMIN" },
}, { timestamps: true });

const Department = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);
const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI is not set in .env.local!");
    process.exit(1);
  }

  console.log(`⏳ Connecting to MongoDB Atlas (${MONGODB_DB_NAME})...`);
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("✅ Connected to MongoDB Atlas.");

  // Clear existing collections for clean seed
  await Department.deleteMany({});
  await Doctor.deleteMany({});
  await Admin.deleteMany({});

  console.log("🌱 Seeding Departments...");
  const departmentsData = [
    { name: "General Medicine", nameTa: "பொது மருத்துவம்" },
    { name: "Cardiology", nameTa: "இதயவியல்" },
    { name: "Neurology", nameTa: "நரம்பியல்" },
    { name: "Nephrology", nameTa: "சிறுநீரகவியல்" },
    { name: "Pediatrics", nameTa: "குழந்தை மருத்துவம்" },
    { name: "Orthopedics", nameTa: "எலும்பியல்" },
    { name: "Dentistry", nameTa: "பல் மருத்துவம்" },
    { name: "Emergency OPD", nameTa: "அவசர பிரிவு" },
  ];

  const createdDepartments = await Department.insertMany(departmentsData);
  const deptMap: Record<string, mongoose.Types.ObjectId> = {};
  createdDepartments.forEach((d) => {
    deptMap[d.name] = d._id as mongoose.Types.ObjectId;
  });

  console.log("🌱 Seeding Doctors...");
  const doctorsData = [
    {
      name: "Dr. Rajesh Sharma",
      departmentId: deptMap["General Medicine"],
      experienceYears: 14,
      consultingFee: 500,
      arrivalTime: "09:00 AM",
      endTime: "05:00 PM",
      isAvailable: true,
      room: "OPD 101",
      specialty: "General Medicine Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 09:00 AM",
    },
    {
      name: "Dr. Priya Ananth",
      departmentId: deptMap["General Medicine"],
      experienceYears: 10,
      consultingFee: 500,
      arrivalTime: "10:00 AM",
      endTime: "06:00 PM",
      isAvailable: true,
      room: "OPD 102",
      specialty: "General Medicine Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 10:00 AM",
    },
    {
      name: "Dr. Arunkumar Natarajan",
      departmentId: deptMap["Cardiology"],
      experienceYears: 18,
      consultingFee: 800,
      arrivalTime: "09:30 AM",
      endTime: "04:30 PM",
      isAvailable: true,
      room: "OPD 204",
      specialty: "Cardiology Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 09:30 AM",
    },
    {
      name: "Dr. Meenakshi Sundaram",
      departmentId: deptMap["Neurology"],
      experienceYears: 15,
      consultingFee: 900,
      arrivalTime: "11:00 AM",
      endTime: "05:00 PM",
      isAvailable: true,
      room: "OPD 301",
      specialty: "Neurology Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 11:00 AM",
    },
    {
      name: "Dr. Vikram Sethi",
      departmentId: deptMap["Nephrology"],
      experienceYears: 12,
      consultingFee: 850,
      arrivalTime: "10:00 AM",
      endTime: "04:00 PM",
      isAvailable: true,
      room: "OPD 305",
      specialty: "Nephrology Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 10:00 AM",
    },
    {
      name: "Dr. Anita Deshmukh",
      departmentId: deptMap["Pediatrics"],
      experienceYears: 11,
      consultingFee: 600,
      arrivalTime: "09:00 AM",
      endTime: "03:00 PM",
      isAvailable: true,
      room: "OPD 108",
      specialty: "Pediatrics Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 09:00 AM",
    },
    {
      name: "Dr. Sanjay Verma",
      departmentId: deptMap["Orthopedics"],
      experienceYears: 16,
      consultingFee: 700,
      arrivalTime: "10:30 AM",
      endTime: "05:30 PM",
      isAvailable: true,
      room: "OPD 202",
      specialty: "Orthopedics Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 10:30 AM",
    },
    {
      name: "Dr. Karthik Subramanian",
      departmentId: deptMap["Dentistry"],
      experienceYears: 9,
      consultingFee: 400,
      arrivalTime: "09:00 AM",
      endTime: "02:00 PM",
      isAvailable: true,
      room: "OPD 105",
      specialty: "Dental Specialist",
      lastUpdatedBy: "Admin / OPD Desk",
      lastUpdatedAt: "Today 09:00 AM",
    },
  ];

  await Doctor.insertMany(doctorsData);

  console.log("🌱 Seeding Admin & Doctor Availability Users...");
  const adminPasswordHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);
  await Admin.create({
    username: ADMIN_DEFAULT_USERNAME,
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  const doctorPasswordHash = await bcrypt.hash(DOCTOR_AVAIL_DEFAULT_PASSWORD, 10);
  await Admin.create({
    username: DOCTOR_AVAIL_DEFAULT_USERNAME,
    passwordHash: doctorPasswordHash,
    role: "doctor_availability",
  });

  console.log(`✅ Database Seeded Successfully!`);
  console.log(`👤 Admin Username: ${ADMIN_DEFAULT_USERNAME}`);
  console.log(`👤 Doctor Availability Username: ${DOCTOR_AVAIL_DEFAULT_USERNAME}`);
  console.log(`🔑 Credentials configured in .env.local`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed Script Error:", err);
  process.exit(1);
});
