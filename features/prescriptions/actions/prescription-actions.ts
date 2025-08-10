"use server"

import type {
  Prescription,
  LabResult,
  Diagnosis,
  CreatePrescriptionRequest,
  CreateLabResultRequest,
  CreateDiagnosisRequest,
  LabAttachment,
} from "../types/prescription"

// Mock data
const mockPrescriptions: Prescription[] = [
  {
    id: "rx-1",
    patientId: "1",
    doctorId: "doc-1",
    appointmentId: "apt-1",
    medications: [
      {
        id: "med-1",
        medicationName: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food in the morning",
        quantity: 30,
        refills: 2,
      },
    ],
    diagnosis: "Hypertension",
    symptoms: ["High blood pressure", "Headaches"],
    treatmentPlan: "Monitor blood pressure daily, follow low-sodium diet",
    followUpInstructions: "Return in 4 weeks for blood pressure check",
    validUntil: "2024-04-15",
    status: "Active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]

const mockLabResults: LabResult[] = [
  {
    id: "lab-1",
    patientId: "1",
    doctorId: "doc-1",
    appointmentId: "apt-1",
    testName: "Complete Blood Count",
    testType: "Blood Test",
    results: [
      {
        parameter: "White Blood Cells",
        value: "7.2",
        unit: "K/uL",
        referenceRange: "4.0-11.0",
        status: "Normal",
      },
      {
        parameter: "Red Blood Cells",
        value: "4.8",
        unit: "M/uL",
        referenceRange: "4.2-5.4",
        status: "Normal",
      },
      {
        parameter: "Hemoglobin",
        value: "14.2",
        unit: "g/dL",
        referenceRange: "12.0-16.0",
        status: "Normal",
      },
    ],
    overallStatus: "Normal",
    notes: "All parameters within normal limits",
    testDate: "2024-01-14",
    reportDate: "2024-01-15",
    labName: "City Medical Lab",
    attachments: [
      {
        id: "att-1",
        fileName: "CBC_Report_Jan2024.pdf",
        fileType: "application/pdf",
        fileSize: 245760,
        fileUrl: "/uploads/lab-reports/CBC_Report_Jan2024.pdf",
        uploadedAt: "2024-01-15T10:00:00Z",
      },
    ],
  },
]

const mockDiagnoses: Diagnosis[] = [
  {
    id: "diag-1",
    patientId: "1",
    doctorId: "doc-1",
    appointmentId: "apt-1",
    primaryDiagnosis: "Essential Hypertension",
    secondaryDiagnoses: ["Mild anxiety"],
    symptoms: ["Elevated blood pressure", "Occasional headaches", "Mild fatigue"],
    severity: "Moderate",
    treatmentPlan: "Antihypertensive medication, lifestyle modifications, stress management",
    followUpRequired: true,
    followUpDate: "2024-02-15",
    notes: "Patient responds well to ACE inhibitors. Continue current treatment plan.",
    createdAt: "2024-01-15T10:00:00Z",
  },
]

// Mock file upload function
async function uploadFile(file: File): Promise<LabAttachment> {
  // Simulate file upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  return {
    id: `att-${Date.now()}`,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: `/uploads/lab-reports/${file.name}`,
    uploadedAt: new Date().toISOString(),
  }
}

export async function createPrescriptionAction(data: CreatePrescriptionRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newPrescription: Prescription = {
    id: `rx-${Date.now()}`,
    patientId: data.patientId,
    doctorId: "current-doctor", // In real app, get from session
    appointmentId: data.appointmentId,
    medications: data.medications.map((med, index) => ({
      ...med,
      id: `med-${Date.now()}-${index}`,
    })),
    diagnosis: data.diagnosis,
    symptoms: data.symptoms,
    treatmentPlan: data.treatmentPlan,
    followUpInstructions: data.followUpInstructions,
    validUntil: new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockPrescriptions.push(newPrescription)

  return {
    success: true,
    data: newPrescription,
    message: "Prescription created successfully",
  }
}

export async function createLabResultAction(data: CreateLabResultRequest) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Handle file uploads if provided
  let attachments: LabAttachment[] = []
  if (data.attachments && data.attachments.length > 0) {
    attachments = await Promise.all(
      data.attachments.map(file => uploadFile(file))
    )
  }

  const overallStatus = data.results.some((r) => r.status === "Critical")
    ? "Critical"
    : data.results.some((r) => r.status === "High" || r.status === "Low")
      ? "Abnormal"
      : "Normal"

  const newLabResult: LabResult = {
    id: `lab-${Date.now()}`,
    patientId: data.patientId,
    doctorId: "current-doctor",
    appointmentId: data.appointmentId,
    testName: data.testName,
    testType: data.testType,
    results: data.results,
    overallStatus,
    notes: data.notes,
    testDate: data.testDate,
    reportDate: new Date().toISOString().split("T")[0],
    labName: data.labName,
    attachments,
  }

  mockLabResults.push(newLabResult)

  return {
    success: true,
    data: newLabResult,
    message: "Lab results uploaded successfully",
  }
}

export async function createDiagnosisAction(data: CreateDiagnosisRequest) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const newDiagnosis: Diagnosis = {
    id: `diag-${Date.now()}`,
    patientId: data.patientId,
    doctorId: "current-doctor",
    appointmentId: data.appointmentId,
    primaryDiagnosis: data.primaryDiagnosis,
    secondaryDiagnoses: data.secondaryDiagnoses,
    symptoms: data.symptoms,
    severity: data.severity,
    treatmentPlan: data.treatmentPlan,
    followUpRequired: data.followUpRequired,
    followUpDate: data.followUpDate,
    notes: data.notes,
    createdAt: new Date().toISOString(),
  }

  mockDiagnoses.push(newDiagnosis)

  return {
    success: true,
    data: newDiagnosis,
    message: "Diagnosis recorded successfully",
  }
}

export async function getPatientPrescriptionsAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const prescriptions = mockPrescriptions.filter((p) => p.patientId === patientId)

  return {
    success: true,
    data: prescriptions,
  }
}

export async function getPatientLabResultsAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const labResults = mockLabResults.filter((l) => l.patientId === patientId)

  return {
    success: true,
    data: labResults,
  }
}

export async function getPatientDiagnosesAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const diagnoses = mockDiagnoses.filter((d) => d.patientId === patientId)

  return {
    success: true,
    data: diagnoses,
  }
}
