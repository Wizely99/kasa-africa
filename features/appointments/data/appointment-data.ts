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

// Mock data for demonstration

// Utility to get upcoming Friday from today
function getUpcomingFriday() {
  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const diff = (5 - day + 7) % 7; // 5 = Friday
  const friday = new Date(today);
  friday.setDate(today.getDate() + diff);
  return friday;
}

// Generate dates between today and Friday
function generateDateBetweenTodayAndFriday(index: number) {
  const today = new Date();
  const friday = getUpcomingFriday();
  const diffDays = Math.ceil((friday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const date = new Date(today);
  date.setDate(today.getDate() + Math.min(index, diffDays));
  return date.toISOString().split("T")[0];
}

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "patient-1",
    doctorId: mockDoctors[0].id,
    facilityId: "facility-1",
    appointmentDate: generateDateBetweenTodayAndFriday(0),
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 10, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "COMPLETED",
    chiefComplaint: "Routine blood pressure check",
    notes: "Patient arrived on time and examination completed",
    confirmationCode: "KA-2025-001",
    actualStartTime: new Date().toISOString(),
    actualEndTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[0].name,
    doctorSpecialization: mockDoctors[0].specialization,
    doctorAvatar: mockDoctors[0].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "2",
    patientId: "patient-2",
    doctorId: mockDoctors[1].id,
    facilityId: "facility-2",
    appointmentDate: generateDateBetweenTodayAndFriday(1),
    startTime: { hour: 8, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 9, minute: 15, second: 0, nano: 0 },
    appointmentType: "VIRTUAL",
    status: "COMPLETED",
    chiefComplaint: "Follow-up for diabetes management",
    notes: "Reviewed blood sugar levels and adjusted medication",
    confirmationCode: "KA-2025-002",
    actualStartTime: new Date().toISOString(),
    actualEndTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[1].name,
    doctorSpecialization: mockDoctors[1].specialization,
    doctorAvatar: mockDoctors[1].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "3",
    patientId: "patient-3",
    doctorId: mockDoctors[2].id,
    facilityId: "facility-1",
    appointmentDate: generateDateBetweenTodayAndFriday(2),
    startTime: { hour: 11, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 13, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "CONFIRMED",
    chiefComplaint: "Chest pain and shortness of breath",
    notes: "Patient reports mild pain over last 2 days",
    confirmationCode: "KA-2025-003",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[2].name,
    doctorSpecialization: mockDoctors[2].specialization,
    doctorAvatar: mockDoctors[2].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "4",
    patientId: "patient-4",
    doctorId: mockDoctors[3].id,
    facilityId: "facility-2",
    appointmentDate: generateDateBetweenTodayAndFriday(3),
    startTime: { hour: 13, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 18, minute: 30, second: 0, nano: 0 },
    appointmentType: "VIRTUAL",
    status: "CONFIRMED",
    chiefComplaint: "Annual physical examination",
    notes: "Patient scheduled for routine annual checkup",
    confirmationCode: "KA-2025-004",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[3].name,
    doctorSpecialization: mockDoctors[3].specialization,
    doctorAvatar: mockDoctors[3].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "5",
    patientId: "patient-5",
    doctorId: mockDoctors[4].id,
    facilityId: "facility-1",
    appointmentDate: generateDateBetweenTodayAndFriday(4),
    startTime: { hour: 15, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 17, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "SCHEDULED",
    chiefComplaint: "Consultation for migraine headaches",
    notes: "Patient requested appointment for ongoing headache issues",
    confirmationCode: "KA-2025-005",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[4].name,
    doctorSpecialization: mockDoctors[4].specialization,
    doctorAvatar: mockDoctors[4].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
   {
    id: "6",
    patientId: "patient-6",
    doctorId: mockDoctors[5].id,
    facilityId: "facility-1",
    appointmentDate: generateDateBetweenTodayAndFriday(0),
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 10, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "SCHEDULED",
    chiefComplaint: "Skin rash consultation",
    notes: "Patient wants evaluation of persistent rash",
    confirmationCode: "KA-2025-006",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[5].name,
    doctorSpecialization: mockDoctors[5].specialization,
    doctorAvatar: mockDoctors[5].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "7",
    patientId: "patient-7",
    doctorId: mockDoctors[1].id,
    facilityId: "facility-2",
    appointmentDate: generateDateBetweenTodayAndFriday(2),
    startTime: { hour: 11, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 13, minute: 30, second: 0, nano: 0 },
    appointmentType: "VIRTUAL",
    status: "SCHEDULED",
    chiefComplaint: "Eye check-up",
    notes: "Patient scheduled for routine eye examination",
    confirmationCode: "KA-2025-007",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[1].name,
    doctorSpecialization: mockDoctors[1].specialization,
    doctorAvatar: mockDoctors[1].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "8",
    patientId: "patient-8",
    doctorId: mockDoctors[3].id,
    facilityId: "facility-1",
    appointmentDate: generateDateBetweenTodayAndFriday(1),
    startTime: { hour: 15, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 17, minute: 0, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "COMPLETED",
    chiefComplaint: "Back pain consultation",
    notes: "Patient experiencing chronic lower back pain",
    confirmationCode: "KA-2025-008",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    doctorName: mockDoctors[3].name,
    doctorSpecialization: mockDoctors[3].specialization,
    doctorAvatar: mockDoctors[1].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  }
];
