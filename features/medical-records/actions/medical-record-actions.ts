"use server"

import type {
  MedicalRecord,
  MedicalRecordFormData,
  MedicalRecordFilters,
  FileUploadResult,
  OCRResult,
  OCRNotification,
} from "../types/medical-record"

// Mock data with OCR fields
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    appointmentId: "appointment-1",
    recordType: "LAB_RESULT",
    title: "Blood Test Results",
    description: "Complete blood count and lipid panel results showing normal values across all parameters.",
    fileUrl: "/placeholder.svg?height=400&width=600&text=Blood+Test+Results",
    tags: ["blood-test", "routine", "normal"],
    isShared: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    ocrText:
      "LABORATORY REPORT\n\nPatient: John Doe\nDate: 2024-01-15\n\nCOMPLETE BLOOD COUNT:\nWhite Blood Cells: 7.2 K/uL (Normal: 4.0-11.0)\nRed Blood Cells: 4.8 M/uL (Normal: 4.2-5.4)\nHemoglobin: 14.5 g/dL (Normal: 12.0-16.0)\nHematocrit: 42.1% (Normal: 36.0-46.0)\nPlatelets: 285 K/uL (Normal: 150-450)\n\nLIPID PANEL:\nTotal Cholesterol: 185 mg/dL (Normal: <200)\nLDL Cholesterol: 110 mg/dL (Normal: <130)\nHDL Cholesterol: 55 mg/dL (Normal: >40)\nTriglycerides: 95 mg/dL (Normal: <150)\n\nCONCLUSION: All values within normal limits.",
    ocrStatus: "COMPLETED",
    ocrProcessedAt: "2024-01-15T10:35:00Z",
    ocrConfidence: 95,
  },
  {
    id: "2",
    patientId: "patient-1",
    doctorId: "doctor-2",
    recordType: "IMAGING",
    title: "Chest X-Ray",
    description: "Chest X-ray showing clear lungs with no signs of infection or abnormalities.",
    fileUrl: "/placeholder.svg?height=400&width=600&text=Chest+X-Ray",
    tags: ["x-ray", "chest", "clear"],
    isShared: false,
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
    ocrText:
      "RADIOLOGY REPORT\n\nExamination: Chest X-Ray (PA and Lateral)\nPatient: Jane Smith\nDate: 2024-01-10\n\nFINDINGS:\n- Lungs are clear bilaterally\n- No focal consolidation, pleural effusion, or pneumothorax\n- Heart size is normal\n- Mediastinal contours are normal\n- Bony structures appear intact\n\nIMPRESSION:\nNormal chest radiograph. No acute cardiopulmonary abnormalities.",
    ocrStatus: "COMPLETED",
    ocrProcessedAt: "2024-01-10T14:25:00Z",
    ocrConfidence: 92,
  },
  {
    id: "3",
    patientId: "patient-2",
    doctorId: "doctor-1",
    recordType: "PRESCRIPTION",
    title: "Hypertension Medication",
    description: "Prescribed Lisinopril 10mg daily for blood pressure management.",
    fileUrl: "/placeholder.svg?height=400&width=600&text=Prescription",
    tags: ["prescription", "hypertension", "lisinopril"],
    isShared: true,
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    ocrStatus: "PROCESSING",
  },
]

// Mock notifications
const mockNotifications: OCRNotification[] = []

export async function getMedicalRecordsAction(filters?: MedicalRecordFilters) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredRecords = [...mockMedicalRecords]

  if (filters?.patientId) {
    filteredRecords = filteredRecords.filter((record) => record.patientId === filters.patientId)
  }

  if (filters?.doctorId) {
    filteredRecords = filteredRecords.filter((record) => record.doctorId === filters.doctorId)
  }

  if (filters?.recordType) {
    filteredRecords = filteredRecords.filter((record) => record.recordType === filters.recordType)
  }

  if (filters?.isShared !== undefined) {
    filteredRecords = filteredRecords.filter((record) => record.isShared === filters.isShared)
  }

  if (filters?.ocrStatus) {
    filteredRecords = filteredRecords.filter((record) => record.ocrStatus === filters.ocrStatus)
  }

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    filteredRecords = filteredRecords.filter(
      (record) =>
        record.title.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        record.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (record.ocrText && record.ocrText.toLowerCase().includes(query)),
    )
  }

  return {
    success: true,
    data: filteredRecords,
  }
}

export async function getMedicalRecordByIdAction(recordId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const record = mockMedicalRecords.find((r) => r.id === recordId)

  if (!record) {
    return { success: false, error: "Medical record not found" }
  }

  return { success: true, data: record }
}

export async function createMedicalRecordAction(data: MedicalRecordFormData & { fileUrl: string }) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Determine OCR status based on file type
  const isTextExtractable = data.fileUrl.match(/\.(pdf|png|jpg|jpeg|gif|webp)$/i)
  const ocrStatus = isTextExtractable ? "PENDING" : "NOT_APPLICABLE"

  const newRecord: MedicalRecord = {
    id: `record-${Date.now()}`,
    ...data,
    tags: data.tags || [],
    ocrStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockMedicalRecords.unshift(newRecord)

  // Start OCR processing if applicable
  if (ocrStatus === "PENDING") {
    processOCRAsync(newRecord.id, data.patientId)
  }

  return {
    success: true,
    data: newRecord,
    message: "Medical record created successfully",
  }
}

export async function updateMedicalRecordAction(recordId: string, data: Partial<MedicalRecordFormData>) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const recordIndex = mockMedicalRecords.findIndex((r) => r.id === recordId)

  if (recordIndex === -1) {
    return { success: false, error: "Medical record not found" }
  }

  mockMedicalRecords[recordIndex] = {
    ...mockMedicalRecords[recordIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return {
    success: true,
    data: mockMedicalRecords[recordIndex],
    message: "Medical record updated successfully",
  }
}

export async function updateOCRTextAction(recordId: string, ocrText: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const recordIndex = mockMedicalRecords.findIndex((r) => r.id === recordId)

  if (recordIndex === -1) {
    return { success: false, error: "Medical record not found" }
  }

  mockMedicalRecords[recordIndex] = {
    ...mockMedicalRecords[recordIndex],
    ocrText,
    updatedAt: new Date().toISOString(),
  }

  return {
    success: true,
    data: mockMedicalRecords[recordIndex],
    message: "OCR text updated successfully",
  }
}

export async function deleteMedicalRecordAction(recordId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const recordIndex = mockMedicalRecords.findIndex((r) => r.id === recordId)

  if (recordIndex === -1) {
    return { success: false, error: "Medical record not found" }
  }

  mockMedicalRecords.splice(recordIndex, 1)

  return {
    success: true,
    message: "Medical record deleted successfully",
  }
}

export async function toggleRecordSharingAction(recordId: string, isShared: boolean) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const recordIndex = mockMedicalRecords.findIndex((r) => r.id === recordId)

  if (recordIndex === -1) {
    return { success: false, error: "Medical record not found" }
  }

  mockMedicalRecords[recordIndex].isShared = isShared
  mockMedicalRecords[recordIndex].updatedAt = new Date().toISOString()

  return {
    success: true,
    data: mockMedicalRecords[recordIndex],
    message: `Record ${isShared ? "shared" : "made private"} successfully`,
  }
}

export async function uploadMedicalFileAction(file: FormData): Promise<FileUploadResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock file upload - in real implementation, upload to cloud storage
  const fileName = file.get("file") as File
  if (!fileName) {
    return { success: false, error: "No file provided" }
  }

  // Simulate file upload and return mock URL
  const mockFileUrl = `/uploads/medical-records/${Date.now()}-${fileName.name}`

  return {
    success: true,
    fileUrl: mockFileUrl,
  }
}

export async function processOCRAction(recordId: string): Promise<OCRResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate OCR processing time

  const record = mockMedicalRecords.find((r) => r.id === recordId)
  if (!record) {
    return { success: false, error: "Medical record not found" }
  }

  // Update status to processing
  const recordIndex = mockMedicalRecords.findIndex((r) => r.id === recordId)
  mockMedicalRecords[recordIndex].ocrStatus = "PROCESSING"

  // Simulate OCR processing
  const mockOCRTexts = [
    "MEDICAL REPORT\n\nPatient Information:\nName: [Patient Name]\nDate: [Date]\n\nDiagnosis:\n[Extracted diagnosis text]\n\nTreatment Plan:\n[Extracted treatment information]\n\nPhysician Notes:\n[Additional notes and observations]",
    "LABORATORY RESULTS\n\nTest Results:\n- Parameter 1: Normal\n- Parameter 2: Elevated\n- Parameter 3: Within range\n\nRecommendations:\n[Doctor recommendations based on results]",
    "PRESCRIPTION\n\nMedication: [Drug name]\nDosage: [Amount and frequency]\nDuration: [Treatment period]\n\nInstructions:\n[Special instructions for patient]",
  ]

  const randomText = mockOCRTexts[Math.floor(Math.random() * mockOCRTexts.length)]
  const confidence = Math.floor(Math.random() * 20) + 80 // 80-100% confidence

  // Update record with OCR results
  mockMedicalRecords[recordIndex] = {
    ...mockMedicalRecords[recordIndex],
    ocrText: randomText,
    ocrStatus: "COMPLETED",
    ocrProcessedAt: new Date().toISOString(),
    ocrConfidence: confidence,
    updatedAt: new Date().toISOString(),
  }

  // Create notification for patient
  const notification: OCRNotification = {
    id: `notif-${Date.now()}`,
    patientId: record.patientId,
    recordId: recordId,
    recordTitle: record.title,
    status: "COMPLETED",
    message: `OCR processing completed for "${record.title}". Text is now available for review.`,
    createdAt: new Date().toISOString(),
    isRead: false,
  }

  mockNotifications.unshift(notification)

  return {
    success: true,
    text: randomText,
    confidence: confidence,
  }
}

export async function getOCRNotificationsAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const patientNotifications = mockNotifications.filter((n) => n.patientId === patientId)

  return {
    success: true,
    data: patientNotifications,
  }
}

export async function markNotificationAsReadAction(notificationId: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const notificationIndex = mockNotifications.findIndex((n) => n.id === notificationId)

  if (notificationIndex === -1) {
    return { success: false, error: "Notification not found" }
  }

  mockNotifications[notificationIndex].isRead = true

  return {
    success: true,
    message: "Notification marked as read",
  }
}

// Async function to simulate OCR processing in background
async function processOCRAsync(recordId: string, patientId: string) {
  // Simulate processing delay
  setTimeout(async () => {
    await processOCRAction(recordId)
  }, 3000) // Process after 3 seconds
}
