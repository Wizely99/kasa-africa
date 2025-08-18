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
  chiefComplaint: string
) {
  const endHour = startHour + durationHours;
  const doctorIndex = parseInt(doctorId.split("-")[1], 10) - 1;

  return {
    id: String(id),
    patientId,
    doctorId,
    facilityId: "facility-1",
    appointmentDate: formatDate(date),
    startTime: { hour: startHour, minute: 0, second: 0, nano: 0 },
    endTime: { hour: endHour, minute: 30, second: 0, nano: 0 },
    appointmentType: type,
    status,
    chiefComplaint,
    notes: "Mock appointment",
    confirmationCode: `KA-2025-${String(id).padStart(3, "0")}`,
    actualStartTime: status !== "SCHEDULED" ? date.toISOString() : undefined,
    actualEndTime: status !== "SCHEDULED" ? addDays(date, 0).toISOString() : undefined,
    cancellationReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[doctorIndex].name,
    doctorSpecialization: mockDoctors[doctorIndex].specialization,
    doctorAvatar: mockDoctors[doctorIndex].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
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
      "SCHEDULED",
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
      "SCHEDULED",
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
      "SCHEDULED",
      idx % 2 === 0 ? "IN_PERSON" : "VIRTUAL",
      10,
      1,
      "Week after next appointment"
    )
  );
});

console.log(mockAppointments);

