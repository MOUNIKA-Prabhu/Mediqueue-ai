import { prisma } from "./prisma";

/** Average consultation duration used only for the voice-agent's spoken
 * estimate. Per spec, this number is never shown on screen. */
const AVG_MINUTES_PER_PATIENT = 8;

const DEPARTMENT_AVG_MINUTES: Record<string, number> = {
  Cardiology: 15,
  "General Surgery": 15,
  "Oral Surgery": 12,
  Ophthalmology: 10,
  ENT: 10,
  Periodontics: 10,
  "General Dentistry": 8,
  "General Medicine": 8,
};

export async function getNextToken(doctorId: string): Promise<number> {
  const last = await prisma.appointment.findFirst({
    where: { doctorId },
    orderBy: { token: "desc" },
  });
  return (last?.token ?? 0) + 1;
}

export async function getQueuePosition(doctorId: string): Promise<number> {
  const waitingCount = await prisma.appointment.count({
    where: { doctorId, status: "WAITING" },
  });
  return waitingCount + 1;
}

export async function getWaitingCount(doctorId: string): Promise<number> {
  return prisma.appointment.count({ where: { doctorId, status: "WAITING" } });
}

export function estimateWaitMinutes(patientsAhead: number, departmentName?: string): number {
  const avg = (departmentName && DEPARTMENT_AVG_MINUTES[departmentName]) || AVG_MINUTES_PER_PATIENT;
  return patientsAhead * avg;
}

/**
 * For NEW patients only: if the chosen doctor has a much longer queue than
 * a peer in the same department, suggest (never force) the less busy doctor.
 */
export async function findLessBusyAlternative(doctorId: string, departmentId: string) {
  const chosenCount = await getWaitingCount(doctorId);

  const peers = await prisma.doctor.findMany({
    where: { departmentId, isAvailable: true, id: { not: doctorId } },
  });

  let best: { id: string; name: string; count: number } | null = null;
  for (const peer of peers) {
    const count = await getWaitingCount(peer.id);
    if (count < chosenCount - 3 && (!best || count < best.count)) {
      best = { id: peer.id, name: peer.name, count };
    }
  }

  return best;
}
