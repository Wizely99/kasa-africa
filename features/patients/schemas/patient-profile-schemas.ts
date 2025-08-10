import { z } from "zod"

export const bloodTypeSchema = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
])

export const genderSchema = z.enum(["Male", "Female", "Other", "Prefer not to say"])

export const maritalStatusSchema = z.enum(["Single", "Married", "Divorced", "Widowed", "Other"])

export const patientProfileSchema = z.object({
  userProfileId: z.string().uuid("Invalid user profile ID"),

  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: genderSchema,
  maritalStatus: maritalStatusSchema,
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),

  // Medical Information
  bloodType: bloodTypeSchema,
  height: z.string().optional(),
  weight: z.string().optional(),

  // Emergency Contact
  emergencyContact: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency phone must be at least 10 digits"),
  emergencyRelationship: z.string().min(1, "Emergency contact relationship is required"),

  // Insurance Information
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  insurancePolicyHolder: z.string().optional(),

  // Medical Details
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  medicalHistory: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),

  // Lifestyle Information
  smokingStatus: z.enum(["Never", "Former", "Current"]).default("Never"),
  alcoholConsumption: z.enum(["Never", "Occasionally", "Regularly"]).default("Never"),
  exerciseFrequency: z.enum(["Never", "Rarely", "Sometimes", "Often", "Daily"]).default("Sometimes"),

  // Preferences
  preferredLanguage: z.string().default("English"),
  communicationPreferences: z.array(z.string()).default([]),
})

export type PatientProfileFormData = z.infer<typeof patientProfileSchema>
