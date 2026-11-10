import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const departments = [
    { name: "General Medicine", nameTa: "பொது மருத்துவம்" },
    { name: "General Dentistry", nameTa: "பொது பல் மருத்துவம்" },
    { name: "Periodontics", nameTa: "பீரியோடான்டிக்ஸ்" },
    { name: "Oral Surgery", nameTa: "வாய் அறுவை சிகிச்சை" },
    { name: "Cardiology", nameTa: "இதயவியல்" },
    { name: "Ophthalmology", nameTa: "கண் மருத்துவம்" },
    { name: "ENT", nameTa: "காது மூக்கு தொண்டை" },
    { name: "General Surgery", nameTa: "பொது அறுவை சிகிச்சை" },
  ];

  const createdDepts: Record<string, string> = {};
  for (const d of departments) {
    let dept = await prisma.department.findUnique({
      where: { name: d.name },
    });
    if (!dept) {
      dept = await prisma.department.create({ data: d });
    }
    createdDepts[d.name] = dept.id;
  }

  const doctors = [
    { name: "Dr. Anitha Raman", dept: "General Medicine", exp: 12, fee: 300 },
    { name: "Dr. Karthik Subramanian", dept: "General Medicine", exp: 6, fee: 250 },
    { name: "Dr. Priya Venkataraman", dept: "General Dentistry", exp: 9, fee: 400 },
    { name: "Dr. Suresh Kumar", dept: "Periodontics", exp: 15, fee: 600 },
    { name: "Dr. Meena Iyer", dept: "Oral Surgery", exp: 8, fee: 700 },
    { name: "Dr. Ramesh Chandran", dept: "Cardiology", exp: 20, fee: 800 },
    { name: "Dr. Lakshmi Narayanan", dept: "Ophthalmology", exp: 10, fee: 450 },
    { name: "Dr. Vijay Anand", dept: "ENT", exp: 7, fee: 350 },
    { name: "Dr. Divya Shankar", dept: "General Surgery", exp: 14, fee: 900 },
  ];

  for (const doc of doctors) {
    const existingDoc = await prisma.doctor.findFirst({
      where: { name: doc.name, departmentId: createdDepts[doc.dept] },
    });
    if (!existingDoc) {
      await prisma.doctor.create({
        data: {
          name: doc.name,
          departmentId: createdDepts[doc.dept],
          experienceYears: doc.exp,
          consultationFee: doc.fee,
          isAvailable: true,
        },
      });
    }
  }

  const existingPatient = await prisma.patient.findUnique({
    where: { phone: "9876543210" },
  });
  if (!existingPatient) {
    await prisma.patient.create({
      data: {
        name: "Demo Patient",
        age: 34,
        gender: Gender.MALE,
        phone: "9876543210",
        address: "12 Anna Nagar, Sathyamangalam",
        bloodGroup: "O+",
        emergencyContact: "9123456780",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
