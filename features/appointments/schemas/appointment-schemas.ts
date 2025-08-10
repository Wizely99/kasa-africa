import { z } from "zod"

// Time schema matching the API format
export const timeSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  second: z.number().min(0).max(59).default(0),
  nano: z.number().min(0).default(0),
})

// Appointment type enum
export const appointmentTypeSchema = z.enum(["IN_PERSON", "VIRTUAL", "PHONE_CONSULTATION"])

// Appointment status enum
export const appointmentStatusSchema = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
])

// Slot type enum
export const slotTypeSchema = z.enum(["REGULAR", "CONSULTATION", "FOLLOW_UP", "EMERGENCY"])

// Book appointment schema
export const bookAppointmentSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  facilityId: z.string().uuid("Invalid facility ID"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  startTime: timeSchema,
  endTime: timeSchema,
  appointmentType: appointmentTypeSchema,
  status: appointmentStatusSchema.default("SCHEDULED"),
  chiefComplaint: z.string().min(1, "Chief complaint is required").max(500, "Chief complaint too long"),
  notes: z.string().max(1000, "Notes too long").optional(),
})

// Recurrence "Ends" schema
export const recurrenceEndsSchema = z
  .object({
    mode: z.enum(["date", "count"]).default("date"),
    endDate: z.date().optional(),
    count: z.number().int().min(1).max(2000).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === "date") {
      if (!val.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required when 'Ends' is set to 'On date'",
          path: ["endDate"],
        })
      }
    }
    if (val.mode === "count") {
      if (typeof val.count !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occurrences count is required when 'Ends' is set to 'After count'",
          path: ["count"],
        })
      }
    }
  })

// Single appointment slot schema
export const appointmentSlotSchema = z.object({
  doctorId: z.string().uuid(),
  facilityId: z.string().uuid(),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  startTime: timeSchema,
  endTime: timeSchema,
  isAvailable: z.boolean().default(true),
  slotType: slotTypeSchema,
})

// Bulk slot creation schema with weekly recurrence
export const bulkSlotCreationSchema = z
  .object({
    doctorId: z.string().uuid(),
    facilityId: z.string().uuid(),
    startDate: z.date(),
    endDate: z.date(),
    workingDays: z.array(z.number().min(0).max(6)), // 0 = Sunday, 6 = Saturday
    repeatEveryWeeks: z.number().int().min(1).max(12).default(1),
    ends: recurrenceEndsSchema.default({ mode: "date" }),
    excludedDates: z.array(z.date()).default([]),
    timeSlots: z
      .array(
        z.object({
          startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
          endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
          slotType: slotTypeSchema,
          duration: z.number().min(15).max(480).default(30), // Duration in minutes
        }),
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    // Base date range sanity
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      })
    }

    // Ends mode constraints
    if (data.ends.mode === "date") {
      if (!data.ends.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required when 'Ends' is set to 'On date'",
          path: ["ends", "endDate"],
        })
      } else if (data.ends.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be on or after the start date",
          path: ["ends", "endDate"],
        })
      }
    }

    if (data.ends.mode === "count") {
      if (!data.ends.count || data.ends.count < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occurrences must be at least 1",
          path: ["ends", "count"],
        })
      }
    }
  })

// Practitioner pricing schema
export const practitionerPricingSchema = z
  .object({
    practitionerId: z.string().uuid("Invalid practitioner ID"),
    expertiseId: z.string().uuid("Invalid expertise ID"),
    consultationFee: z.number().min(0, "Consultation fee must be positive"),
    followUpFee: z.number().min(0, "Follow-up fee must be positive"),
    emergencyFee: z.number().min(0, "Emergency fee must be positive"),
    isActive: z.boolean().default(true),
    currencyCode: z.string().min(3).max(3, "Currency code must be 3 characters"),
    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  })
  .refine((data) => new Date(data.effectiveTo) >= new Date(data.effectiveFrom), {
    message: "Effective to date must be after effective from date",
    path: ["effectiveTo"],
  })

// Types
export type TimeSlot = z.infer<typeof timeSchema>
export type AppointmentType = z.infer<typeof appointmentTypeSchema>
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>
export type SlotType = z.infer<typeof slotTypeSchema>
export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>
export type AppointmentSlotInput = z.infer<typeof appointmentSlotSchema>
export type RecurrenceEnds = z.infer<typeof recurrenceEndsSchema>
export type BulkSlotCreationInput = z.infer<typeof bulkSlotCreationSchema>
export type PractitionerPricingInput = z.infer<typeof practitionerPricingSchema>
