import { AppointmentStatus, AppointmentType, TimeSlot } from "../types/appointment";
import { mockDoctors } from "../types/data";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  facilityId: string;
  appointmentDate: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint: string;
  notes: string;
  confirmationCode: string;
  actualStartTime?: string;
  actualEndTime?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  doctorName?: string;
  doctorSpecialization?: string;
  doctorAvatar?: string;
  facilityName?: string;
  facilityAddress?: string;
}

// Utility
function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

const today = new Date();

// Helper to pick random upcoming status
function getUpcomingStatus(): "SCHEDULED" | "CONFIRMED" {
  return Math.random() > 0.5 ? "SCHEDULED" : "CONFIRMED";
}

const facilities = [
  { name: "KasaAfrica Medical Center", address: "123 Health Street, Lagos, Nigeria" },
  { name: "Sunrise Clinic", address: "45 Wellness Ave, Nairobi, Kenya" },
  { name: "Greenfield Hospital", address: "78 Care Blvd, Accra, Ghana" },
  { name: "BlueSky Medical", address: "22 Healing Way, Dar es Salaam, Tanzania" },
];

const complaints = [
  "Routine check-up",
  "Follow-up for chronic illness",
  "Chest pain",
  "Headache and migraine",
  "Skin rash consultation",
  "Back pain evaluation",
  "Annual physical examination",
  "Eye check-up",
];

const notesList = [
  "Patient arrived on time and examination completed",
  "Reviewed test results and adjusted medication",
  "Patient reports mild symptoms over last 2 days",
  "Scheduled for routine examination",
  "Patient requested appointment for ongoing issues",
  "Observed improvement since last visit",
];
// Helper to pick random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
const virtualPlatforms = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
];

// Create appointment helper
function createAppointment(
  id: number,
  patientId: string,
  doctorId: string,
  date: Date,
  status: AppointmentStatus,
  type: AppointmentType,
  startHour: number,
  durationHours: number,
  _chiefComplaint: string
) {
  const endHour = startHour + durationHours;
  const doctorIndex = parseInt(doctorId.split("-")[1], 10) - 1;
  const facility = randomItem(facilities);
   // If virtual, use platform name as "facility"
  const isVirtual = type === "VIRTUAL";
  const facilityName = isVirtual ? randomItem(virtualPlatforms) : facility.name;
  const facilityAddress = isVirtual ? `Join via ${facilityName} link` : facility.address;

  // Determine status: if today, always CONFIRMED
  const todayStr = formatDate(new Date());
  const appointmentStr = formatDate(date);
  const finalStatus: AppointmentStatus = appointmentStr === todayStr ? "CONFIRMED" : status;

  return {
    id: String(id),
    patientId,
    doctorId,
    facilityId: `facility-${Math.floor(Math.random() * 10) + 1}`,
    appointmentDate: formatDate(date),
    startTime: { hour: startHour, minute: 0, second: 0, nano: 0 },
    endTime: { hour: endHour, minute: 30, second: 0, nano: 0 },
    appointmentType: type,
    status: finalStatus,
    chiefComplaint: randomItem(complaints),
    notes: randomItem(notesList),
    confirmationCode: `KA-2025-${String(id).padStart(3, "0")}`,
    actualStartTime: finalStatus !== "SCHEDULED" ? date.toISOString() : undefined,
    actualEndTime: finalStatus !== "SCHEDULED" ? addDays(date, 0).toISOString() : undefined,
    cancellationReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[doctorIndex].name,
    doctorSpecialization: mockDoctors[doctorIndex].specialization,
    doctorAvatar: mockDoctors[doctorIndex].avatar,
    facilityName,
 facilityAddress,
  } as Appointment;
}

// Generate appointments
export const mockAppointments: Appointment[] = [];

// --- Past 4 ---
[-4, -3, -2, -1].forEach((offset, idx) => {
  const date = addDays(today, offset);
  const doctorId = `doctor-${(idx % 6) + 1}`;
  mockAppointments.push(
    createAppointment(
      idx + 1,
      `patient-${idx + 1}`,
      doctorId,
      date,
      "COMPLETED",
      idx % 2 === 0 ? "IN_PERSON" : "VIRTUAL",
      9 + idx,
      1 + (idx % 2),
      "Past appointment check"
    )
  );
});

// --- This week 6 upcoming ---
[0, 0, 1, 2, 4, 4].forEach((offset, idx) => {
  const date = addDays(today, offset);
  const doctorId = `doctor-${(idx % 6) + 1}`;
  mockAppointments.push(
    createAppointment(
      idx + 5,
      `patient-${idx + 5}`,
      doctorId,
      date,
      getUpcomingStatus(),
      idx % 2 === 0 ? "IN_PERSON" : "VIRTUAL",
      10 + idx,
      1,
      "Upcoming this week"
    )
  );
});

// --- Next week 4 upcoming ---
[7, 8, 9, 10].forEach((offset, idx) => {
  const date = addDays(today, offset);
  const doctorId = `doctor-${(idx % 6) + 1}`;
  mockAppointments.push(
    createAppointment(
      idx + 11,
      `patient-${idx + 11}`,
      doctorId,
      date,
      getUpcomingStatus(),
      idx % 2 === 0 ? "IN_PERSON" : "VIRTUAL",
      9 + idx,
      1,
      "Next week appointment"
    )
  );
});

// --- Week after next 2 upcoming ---
[14, 15].forEach((offset, idx) => {
  const date = addDays(today, offset);
  const doctorId = `doctor-${(idx % 6) + 1}`;
  mockAppointments.push(
    createAppointment(
      idx + 15,
      `patient-${idx + 15}`,
      doctorId,
      date,
      getUpcomingStatus(),
      idx % 2 === 0 ? "IN_PERSON" : "VIRTUAL",
      10,
      1,
      "Week after next appointment"
    )
  );
});

console.log(mockAppointments);


