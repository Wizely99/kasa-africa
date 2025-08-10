export type BloodType =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say"

export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed" | "Other"

export interface PatientProfile {
  id?: string
  userProfileId: string

  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  address: string
  city: string
  state: string
  zipCode: string

  // Medical Information
  bloodType: BloodType
  height: string
  weight: string

  // Emergency Contact
  emergencyContact: string
  emergencyPhone: string
  emergencyRelationship: string

  // Insurance Information
  insuranceProvider: string
  insuranceNumber: string
  insurancePolicyHolder: string

  // Medical Details
  allergies: string[]
  medications: string[]
  medicalHistory: string[]
  familyHistory: string[]

  // Lifestyle Information
  smokingStatus: "Never" | "Former" | "Current"
  alcoholConsumption: "Never" | "Occasionally" | "Regularly"
  exerciseFrequency: "Never" | "Rarely" | "Sometimes" | "Often" | "Daily"

  // Preferences
  preferredLanguage: string
  communicationPreferences: string[]

  // System fields
  createdAt?: string
  updatedAt?: string
}

export interface PatientProfileFormData extends Omit<PatientProfile, "id" | "createdAt" | "updatedAt"> {}
