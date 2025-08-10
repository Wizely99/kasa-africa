export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  medications: PrescriptionMedication[]
  diagnosis: string
  symptoms: string[]
  treatmentPlan: string
  followUpInstructions: string
  validUntil: string
  status: "Active" | "Completed" | "Cancelled"
  createdAt: string
  updatedAt: string
}

export interface PrescriptionMedication {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
  refills: number
}

export interface LabResult {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  testName: string
  testType: string
  results: LabTestResult[]
  overallStatus: "Normal" | "Abnormal" | "Critical"
  notes: string
  testDate: string
  reportDate: string
  labName: string
  attachments?: LabAttachment[]
}

export interface LabTestResult {
  parameter: string
  value: string
  unit: string
  referenceRange: string
  status: "Normal" | "High" | "Low" | "Critical"
}

export interface LabAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  uploadedAt: string
}

export interface Diagnosis {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  symptoms: string[]
  severity: "Mild" | "Moderate" | "Severe" | "Critical"
  treatmentPlan: string
  followUpRequired: boolean
  followUpDate?: string
  notes: string
  createdAt: string
}

export interface CreatePrescriptionRequest {
  patientId: string
  appointmentId?: string
  medications: Omit<PrescriptionMedication, "id">[]
  diagnosis: string
  symptoms: string[]
  treatmentPlan: string
  followUpInstructions: string
  validityDays: number
}

export interface CreateLabResultRequest {
  patientId: string
  appointmentId?: string
  testName: string
  testType: string
  results: Omit<LabTestResult, "id">[]
  notes: string
  testDate: string
  labName: string
  attachments?: File[]
}

export interface CreateDiagnosisRequest {
  patientId: string
  appointmentId?: string
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  symptoms: string[]
  severity: "Mild" | "Moderate" | "Severe" | "Critical"
  treatmentPlan: string
  followUpRequired: boolean
  followUpDate?: string
  notes: string
}
