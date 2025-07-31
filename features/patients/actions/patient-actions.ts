"use server"

import type { Patient, PatientSearchFilters } from "../types/patient"

// Mock patient data - replace with actual API calls
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    age: 34,
    gender: "Female",
    bloodType: "A+",
    address: "123 Main St, New York, NY 10001",
    status: "Active",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-25",
    condition: "Hypertension",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    medicalHistory: [
      {
        date: "2024-01-15",
        diagnosis: "Hypertension",
        treatment: "Prescribed Lisinopril 10mg daily",
        doctor: "Dr. Smith",
      },
      {
        date: "2023-12-10",
        diagnosis: "Annual Checkup",
        treatment: "All vitals normal, continue current medications",
        doctor: "Dr. Smith",
      },
    ],
    prescriptions: [
      {
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        status: "Active",
      },
    ],
    vitals: {
      bloodPressure: "140/90",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "165 lbs",
      height: "5'6\"",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    age: 42,
    gender: "Male",
    bloodType: "O-",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    status: "Active",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-02-01",
    condition: "Diabetes Type 2",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    medicalHistory: [
      {
        date: "2024-01-12",
        diagnosis: "Diabetes Type 2 - Follow up",
        treatment: "Adjusted Metformin dosage, dietary counseling",
        doctor: "Dr. Johnson",
      },
    ],
    prescriptions: [
      {
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2024-01-12",
        endDate: "2024-07-12",
        status: "Active",
      },
    ],
    vitals: {
      bloodPressure: "130/85",
      heartRate: "68 bpm",
      temperature: "98.4°F",
      weight: "180 lbs",
      height: "5'10\"",
    },
  },
]

export async function getPatientsAction(filters?: PatientSearchFilters) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredPatients = mockPatients

  if (filters?.query) {
    const query = filters.query.toLowerCase()
    filteredPatients = filteredPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query),
    )
  }

  if (filters?.status && filters.status !== "All") {
    filteredPatients = filteredPatients.filter((patient) => patient.status === filters.status)
  }

  return {
    success: true,
    data: filteredPatients,
  }
}

export async function getPatientByIdAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const patient = mockPatients.find((p) => p.id === patientId)

  if (!patient) {
    return { success: false, error: "Patient not found" }
  }

  return { success: true, data: patient }
}

export async function updatePatientStatusAction(patientId: string, status: "Active" | "Inactive") {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const patientIndex = mockPatients.findIndex((p) => p.id === patientId)

  if (patientIndex === -1) {
    return { success: false, error: "Patient not found" }
  }

  mockPatients[patientIndex].status = status

  return {
    success: true,
    data: mockPatients[patientIndex],
    message: `Patient status updated to ${status}`,
  }
}
