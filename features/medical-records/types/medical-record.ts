export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  recordType: RecordType
  title: string
  description: string
  fileUrl: string
  tags: string[]
  isShared: boolean
  createdAt: string
  updatedAt: string
  // OCR-related fields
  ocrText?: string
  ocrStatus: OCRStatus
  ocrProcessedAt?: string
  ocrConfidence?: number
}

export type RecordType =
  | "LAB_RESULT"
  | "PRESCRIPTION"
  | "DIAGNOSIS"
  | "IMAGING"
  | "VACCINATION"
  | "SURGERY"
  | "CONSULTATION_NOTE"
  | "DISCHARGE_SUMMARY"
  | "REFERRAL"
  | "ALLERGY_RECORD"

export type OCRStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "NOT_APPLICABLE"

export interface MedicalRecordFormData {
  patientId: string
  doctorId: string
  appointmentId?: string
  recordType: RecordType
  title: string
  description: string
  tags: string[]
  isShared: boolean
  file?: File
}

export interface MedicalRecordFilters {
  patientId?: string
  doctorId?: string
  recordType?: RecordType
  isShared?: boolean
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
  ocrStatus?: OCRStatus
}

export interface FileUploadResult {
  success: boolean
  fileUrl?: string
  error?: string
}

export interface OCRResult {
  success: boolean
  text?: string
  confidence?: number
  error?: string
}

export interface OCRNotification {
  id: string
  patientId: string
  recordId: string
  recordTitle: string
  status: OCRStatus
  message: string
  createdAt: string
  isRead: boolean
}
