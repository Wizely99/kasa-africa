import { z } from "zod"

export const recordTypeSchema = z.enum([
  "LAB_RESULT",
  "PRESCRIPTION",
  "DIAGNOSIS",
  "IMAGING",
  "VACCINATION",
  "SURGERY",
  "CONSULTATION_NOTE",
  "DISCHARGE_SUMMARY",
  "REFERRAL",
  "ALLERGY_RECORD",
])

export const ocrStatusSchema = z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "NOT_APPLICABLE"])

export const medicalRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  recordType: recordTypeSchema,
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fileUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
  isShared: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  ocrText: z.string().optional(),
  ocrStatus: ocrStatusSchema.default("PENDING"),
  ocrProcessedAt: z.string().optional(),
  ocrConfidence: z.number().min(0).max(100).optional(),
})

export const createMedicalRecordSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  appointmentId: z.string().uuid().optional(),
  recordType: recordTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  tags: z.array(z.string()).default([]),
  isShared: z.boolean().default(true),
})

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial().extend({
  id: z.string().uuid(),
})

export const updateOCRTextSchema = z.object({
  recordId: z.string().uuid(),
  ocrText: z.string().min(1, "OCR text cannot be empty"),
})

export const medicalRecordFiltersSchema = z.object({
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
  recordType: recordTypeSchema.optional(),
  isShared: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  searchQuery: z.string().optional(),
  ocrStatus: ocrStatusSchema.optional(),
})

export type MedicalRecordFormData = z.infer<typeof createMedicalRecordSchema>
export type MedicalRecordFilters = z.infer<typeof medicalRecordFiltersSchema>
export type UpdateOCRTextData = z.infer<typeof updateOCRTextSchema>
