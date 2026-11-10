import { INITIAL_EXISTING_PATIENTS, PatientRecord } from "@/constants/initialData";

declare global {
  // eslint-disable-next-line no-var
  var inMemoryPatientStore: PatientRecord[] | undefined;
}

if (!global.inMemoryPatientStore) {
  global.inMemoryPatientStore = [...INITIAL_EXISTING_PATIENTS];
}

export function getInMemoryPatients(): PatientRecord[] {
  return global.inMemoryPatientStore || [];
}

export function saveInMemoryPatient(patient: {
  id?: string;
  name: string;
  phone: string;
  age: number | string;
  gender: "Male" | "Female" | "Other" | string;
  bloodGroup?: string;
  address?: string;
  lastVisit?: string;
}): PatientRecord {
  const store = getInMemoryPatients();
  const phone = String(patient.phone).trim();
  const existingIdx = store.findIndex((p) => p.phone === phone);

  const formattedRecord: PatientRecord = {
    id: patient.id || (existingIdx >= 0 ? store[existingIdx].id : `pat-${Date.now()}`),
    name: String(patient.name).trim(),
    phone,
    age: Number(patient.age) || 30,
    gender: (String(patient.gender).includes("Female") ? "Female" : String(patient.gender).includes("Other") ? "Other" : "Male") as any,
    bloodGroup: patient.bloodGroup || (existingIdx >= 0 ? store[existingIdx].bloodGroup : "O+"),
    address: patient.address || (existingIdx >= 0 ? store[existingIdx].address : "Chennai"),
    lastVisit: patient.lastVisit || new Date().toISOString().split("T")[0],
  };

  if (existingIdx >= 0) {
    store[existingIdx] = formattedRecord;
  } else {
    store.unshift(formattedRecord);
  }

  global.inMemoryPatientStore = store;
  return formattedRecord;
}

export function findInMemoryPatient(phone: string): PatientRecord | undefined {
  const store = getInMemoryPatients();
  const cleanPhone = String(phone).trim();
  return store.find((p) => p.phone === cleanPhone);
}
