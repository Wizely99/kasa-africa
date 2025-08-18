"use server"

import type { PatientProfile, PatientProfileFormData } from "../types/patient-profile"

// Mock data for development
const mockPatientProfile: PatientProfile = {
  id: "patient-123",
  userProfileId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",

  // Personal Information
  firstName: "Alice M.",
  lastName: "Ndabiye",
  email: "alice.ndabiye@gmail.com",
  phone: "+255 755 123 456", // TZ phone format
  dateOfBirth: "1990-05-15",
  gender: "Female",
  maritalStatus: "Single",
  address: "Goldstar Street, Bagamoyo Road",
  city: "Dar es Salaam",
  state: "Dar es Salaam",
  zipCode: "14128",

  // Medical Information
  bloodType: "A_POSITIVE",
  height: "167 cm", // TZ uses metric
  weight: "63 kg",

  // Emergency Contact
  emergencyContact: "Neema Ndabiye",
  emergencyPhone: "+255 754 987 654",
  emergencyRelationship: "Sister",

  // Insurance Information
  insuranceProvider: "NHIF Tanzania", // National Health Insurance Fund
  insuranceNumber: "TZ-NHIF-123456",
  insurancePolicyHolder: "Alice M. Ndabiye",

  // Medical Details
  allergies: ["Penicillin", "Peanuts"],
  medications: ["Metformin 500mg", "Lisinopril 10mg"],
  medicalHistory: ["Type 2 Diabetes", "Hypertension"],
  familyHistory: ["Hypertension (Father)", "Diabetes (Mother)"],

  // Lifestyle Information
  smokingStatus: "Never",
  alcoholConsumption: "Rarely",
  exerciseFrequency: "Occasionally",

  // Preferences
  preferredLanguage: "Swahili",
  communicationPreferences: ["Email", "SMS"],

  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z",
};


export async function getPatientProfile(userProfileId: string): Promise<PatientProfile | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data for now
  return mockPatientProfile
}

export async function updatePatientProfile(
  data: PatientProfileFormData,
): Promise<{ success: boolean; message: string; data?: PatientProfile }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful update
    const updatedProfile: PatientProfile = {
      ...mockPatientProfile,
      ...data,
      id: mockPatientProfile.id,
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: "Patient profile updated successfully",
      data: updatedProfile,
    }
  } catch (error) {
    console.error("Error updating patient profile:", error)
    return {
      success: false,
      message: "Failed to update patient profile. Please try again.",
    }
  }
}

export async function createPatientProfile(
  data: PatientProfileFormData,
): Promise<{ success: boolean; message: string; data?: PatientProfile }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate successful creation
    const newProfile: PatientProfile = {
      ...data,
      id: `patient-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      message: "Patient profile created successfully",
      data: newProfile,
    }
  } catch (error) {
    console.error("Error creating patient profile:", error)
    return {
      success: false,
      message: "Failed to create patient profile. Please try again.",
    }
  }
}
