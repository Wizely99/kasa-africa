"use server"

import type { PatientProfile, PatientProfileFormData } from "../types/patient-profile"

// Mock data for development
const mockPatientProfile: PatientProfile = {
  id: "patient-123",
  userProfileId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",

  // Personal Information
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phone: "(555) 123-4567",
  dateOfBirth: "1990-05-15",
  gender: "Female",
  maritalStatus: "Single",
  address: "123 Health Street",
  city: "Wellness City",
  state: "California",
  zipCode: "90210",

  // Medical Information
  bloodType: "A_POSITIVE",
  height: "5'6\"",
  weight: "140 lbs",

  // Emergency Contact
  emergencyContact: "John Doe",
  emergencyPhone: "(555) 987-6543",
  emergencyRelationship: "Brother",

  // Insurance Information
  insuranceProvider: "Blue Cross Blue Shield",
  insuranceNumber: "BC123456789",
  insurancePolicyHolder: "Jane Doe",

  // Medical Details
  allergies: ["Penicillin", "Peanuts"],
  medications: ["Lisinopril 10mg", "Metformin 500mg"],
  medicalHistory: ["Type 2 Diabetes", "Hypertension"],
  familyHistory: ["Heart Disease (Father)", "Diabetes (Mother)"],

  // Lifestyle Information
  smokingStatus: "Never",
  alcoholConsumption: "Occasionally",
  exerciseFrequency: "Often",

  // Preferences
  preferredLanguage: "English",
  communicationPreferences: ["Email", "SMS"],

  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z",
}

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
