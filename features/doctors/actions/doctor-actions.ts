"use server"

import { revalidatePath } from "next/cache"
import type { DoctorProfile, DoctorProfileRequest, Department, Facility, Role, Expertise } from "../types/doctor"

// Mock data for development
const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Cardiology",
    description: "Heart and cardiovascular system",
    isActive: true,
  },
  {
    id: "dept-2",
    name: "Neurology",
    description: "Brain and nervous system",
    isActive: true,
  },
  {
    id: "dept-3",
    name: "Pediatrics",
    description: "Medical care for children",
    isActive: true,
  },
  {
    id: "dept-4",
    name: "General Medicine",
    description: "Primary healthcare services",
    isActive: true,
  },
]

const mockFacilities: Facility[] = [
  {
    id: "facility-1",
    name: "Kasa Africa Medical Center",
    address: "123 Health Street",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    isActive: true,
  },
  {
    id: "facility-2",
    name: "Kasa Africa Specialty Hospital",
    address: "456 Care Avenue",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    isActive: true,
  },
]

const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Senior Doctor",
    description: "Senior medical practitioner",
    permissions: ["diagnose", "prescribe", "schedule", "manage_patients"],
  },
  {
    id: "role-2",
    name: "Consultant",
    description: "Medical consultant",
    permissions: ["diagnose", "prescribe", "consult"],
  },
  {
    id: "role-3",
    name: "Resident Doctor",
    description: "Medical resident",
    permissions: ["diagnose", "prescribe"],
  },
]

const mockExpertise: Expertise[] = [
  {
    id: "exp-1",
    name: "General Medicine",
    description: "General medical consultation and treatment",
    category: "Primary Care",
    isActive: true,
  },
  {
    id: "exp-2",
    name: "Cardiology",
    description: "Heart and cardiovascular system specialist",
    category: "Specialty Care",
    isActive: true,
  },
  {
    id: "exp-3",
    name: "Dermatology",
    description: "Skin, hair, and nail conditions",
    category: "Specialty Care",
    isActive: true,
  },
  {
    id: "exp-4",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    category: "Specialty Care",
    isActive: true,
  },
  {
    id: "exp-5",
    name: "Neurology",
    description: "Brain and nervous system disorders",
    category: "Specialty Care",
    isActive: true,
  },
]

const mockDoctorProfile: DoctorProfile = {
  id: "doctor-1",
  adminRole: "ADMIN",
  departmentId: "dept-1",
  facilityId: "facility-1",
  roleId: "role-1",
  userProfileId: "user-1",
  licenseNumber: "MD-2024-001",
  specialization: "Cardiology",
  yearsOfExperience: 8,
  qualification: "MBBS, MD Cardiology",
  expertiseIds: ["exp-1", "exp-2"],
  bio: "Experienced cardiologist with expertise in interventional cardiology and heart disease prevention.",
  consultationFee: 150,
  followUpFee: 100,
  emergencyFee: 300,
  languages: ["English", "Yoruba", "Hausa"],
  availabilityHours: {
    monday: { start: "09:00", end: "17:00", isAvailable: true },
    tuesday: { start: "09:00", end: "17:00", isAvailable: true },
    wednesday: { start: "09:00", end: "17:00", isAvailable: true },
    thursday: { start: "09:00", end: "17:00", isAvailable: true },
    friday: { start: "09:00", end: "15:00", isAvailable: true },
    saturday: { start: "10:00", end: "14:00", isAvailable: true },
    sunday: { start: "", end: "", isAvailable: false },
  },
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  department: mockDepartments[0],
  facility: mockFacilities[0],
  role: mockRoles[0],
  expertise: [mockExpertise[0], mockExpertise[1]],
}

export async function getDoctorProfileAction(doctorId: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/doctors/${doctorId}`)
    // const data = await response.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: mockDoctorProfile,
    }
  } catch (error) {
    console.error("Error fetching doctor profile:", error)
    return {
      success: false,
      error: "Failed to fetch doctor profile",
    }
  }
}

export async function updateDoctorProfileAction(doctorId: string, profileData: Partial<DoctorProfileRequest>) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/doctors/${doctorId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profileData),
    // })
    // const data = await response.json()

    console.log("Updating doctor profile:", doctorId, profileData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    revalidatePath("/doctor/profile")

    return {
      success: true,
      data: { ...mockDoctorProfile, ...profileData },
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Error updating doctor profile:", error)
    return {
      success: false,
      error: "Failed to update doctor profile",
    }
  }
}

export async function getDepartmentsAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/departments`)
    // const data = await response.json()

    return {
      success: true,
      data: mockDepartments.filter((dept) => dept.isActive),
    }
  } catch (error) {
    console.error("Error fetching departments:", error)
    return {
      success: false,
      error: "Failed to fetch departments",
    }
  }
}

export async function getFacilitiesAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/facilities`)
    // const data = await response.json()

    return {
      success: true,
      data: mockFacilities.filter((facility) => facility.isActive),
    }
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return {
      success: false,
      error: "Failed to fetch facilities",
    }
  }
}

export async function getRolesAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/roles`)
    // const data = await response.json()

    return {
      success: true,
      data: mockRoles,
    }
  } catch (error) {
    console.error("Error fetching roles:", error)
    return {
      success: false,
      error: "Failed to fetch roles",
    }
  }
}

export async function getExpertiseAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/expertise`)
    // const data = await response.json()

    return {
      success: true,
      data: mockExpertise.filter((exp) => exp.isActive),
    }
  } catch (error) {
    console.error("Error fetching expertise:", error)
    return {
      success: false,
      error: "Failed to fetch expertise",
    }
  }
}
