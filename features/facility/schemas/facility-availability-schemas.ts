import { z } from "zod"

export const dayOfWeekSchema = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])

export const timeObjectSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  second: z.number().min(0).max(59).default(0),
  nano: z.number().min(0).max(999999999).default(0),
})

export const facilityAvailabilitySchema = z
  .object({
    id: z.string().uuid(),
    facilityId: z.string().uuid(),
    days: z.array(dayOfWeekSchema).min(1, "At least one day must be selected"),
    startTime: timeObjectSchema,
    endTime: timeObjectSchema,
  })
  .refine(
    (data) => {
      const startMinutes = data.startTime.hour * 60 + data.startTime.minute
      const endMinutes = data.endTime.hour * 60 + data.endTime.minute
      return endMinutes > startMinutes
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )

export const createFacilityAvailabilitySchema = z
  .object({
    facilityId: z.uuid("Please select a facility"),
    days: z.array(dayOfWeekSchema).min(1, "At least one day must be selected"),
    startTime: timeObjectSchema,
    endTime: timeObjectSchema,
  })
  .refine(
    (data) => {
      const startMinutes = data.startTime.hour * 60 + data.startTime.minute
      const endMinutes = data.endTime.hour * 60 + data.endTime.minute
      return endMinutes > startMinutes
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )

export const updateFacilityAvailabilitySchema = createFacilityAvailabilitySchema.partial().extend({
  id: z.uuid(),
})
