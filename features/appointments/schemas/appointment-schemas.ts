import { z } from "zod"

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  slotId: z.string().min(1, "Please select a time slot"),
  type: z.enum(["consultation", "follow-up", "check-up"]),
  notes: z.string().optional(),
})

export const searchDoctorSchema = z.object({
  query: z.string().optional(),
  specialization: z.string().optional(),
  availability: z.string().optional(),
})

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>
export type SearchDoctorFormData = z.infer<typeof searchDoctorSchema>
