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

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "patient-1",
    doctorId: mockDoctors[0].id,
    facilityId: "facility-1",
    appointmentDate: "2025-08-15",
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 9, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "CONFIRMED",
    chiefComplaint: "Chest pain and shortness of breath",
    notes: "Patient reports symptoms for the past week",
    confirmationCode: "KA-2025-001",
    createdAt: "2025-08-09T08:37:28.347Z",
    updatedAt: "2025-08-09T08:37:28.347Z",
    doctorName: mockDoctors[0].name,
    doctorSpecialization: mockDoctors[0].specialization,
    doctorAvatar: mockDoctors[0].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  },
  {
    id: "2",
    patientId: "patient-1",
    doctorId: mockDoctors[1].id,
    facilityId: "facility-2",
    appointmentDate: "2025-08-20",
    startTime: { hour: 14, minute: 30, second: 0, nano: 0 },
    endTime: { hour: 15, minute: 0, second: 0, nano: 0 },
    appointmentType: "VIRTUAL",
    status: "SCHEDULED",
    chiefComplaint: "Follow-up consultation for diabetes management",
    notes: "Regular check-up and medication review",
    confirmationCode: "KA-2025-002",
    createdAt: "2025-08-09T08:37:28.347Z",
    updatedAt: "2025-08-09T08:37:28.347Z",
    doctorName: mockDoctors[1].name,
    doctorSpecialization: mockDoctors[1].specialization,
    doctorAvatar: mockDoctors[1].avatar,
  },
  {
    id: "3",
    patientId: "patient-1",
    doctorId: mockDoctors[2].id,
    facilityId: "facility-1",
    appointmentDate: "2025-07-25",
    startTime: { hour: 10, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 10, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "COMPLETED",
    chiefComplaint: "Annual physical examination",
    notes: "Routine health check-up",
    confirmationCode: "KA-2025-003",
    actualStartTime: "2025-07-25T10:05:00.000Z",
    actualEndTime: "2025-07-25T10:35:00.000Z",
    createdAt: "2025-07-20T08:37:28.347Z",
    updatedAt: "2025-07-25T10:35:28.347Z",
    doctorName: mockDoctors[2].name,
    doctorSpecialization: mockDoctors[2].specialization,
    doctorAvatar: mockDoctors[2].avatar,
    facilityName: "KasaAfrica Medical Center",
    facilityAddress: "123 Health Street, Lagos, Nigeria",
  }
];
