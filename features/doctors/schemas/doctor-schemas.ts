import { z } from "zod"

export const adminRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"])

export const availabilityHoursSchema = z.object({
  monday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  tuesday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  wednesday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  thursday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  friday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  saturday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
  sunday: z
    .object({
      start: z.string(),
      end: z.string(),
      isAvailable: z.boolean(),
    })
    .optional(),
})

export const doctorProfileSchema = z.object({
  adminRole: adminRoleSchema,
  departmentId: z.string().uuid("Invalid department ID"),
  facilityId: z.string().uuid("Invalid facility ID"),
  roleId: z.string().uuid("Invalid role ID"),
  userProfileId: z.string().uuid("Invalid user profile ID"),
  licenseNumber: z.string().min(1, "License number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or greater"),
  qualification: z.string().min(1, "Qualification is required"),
  expertiseIds: z.array(z.string().uuid()).min(1, "At least one expertise is required"),
  bio: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
  followUpFee: z.number().min(0).optional(),
  emergencyFee: z.number().min(0).optional(),
  languages: z.array(z.string()).optional(),
  availabilityHours: availabilityHoursSchema.optional(),
})

export const updateDoctorProfileSchema = doctorProfileSchema.partial()

export type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>
export type UpdateDoctorProfileFormData = z.infer<typeof updateDoctorProfileSchema>
