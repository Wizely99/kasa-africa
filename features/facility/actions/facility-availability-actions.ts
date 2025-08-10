"use server"

import type {
  FacilityAvailability,
  CreateFacilityAvailabilityRequest,
  UpdateFacilityAvailabilityRequest,
  Facility,
} from "../types/facility-availability"

// Mock data for facilities
const mockFacilities: Facility[] = [
  {
    id: "f1e2d3c4-b5a6-9788-1234-567890abcdef",
    name: "Kasa Africa Main Hospital",
    address: "123 Health Street, Medical District",
    phone: "+1-555-0101",
    email: "main@kasaafrica.com",
    type: "Hospital",
  },
  {
    id: "f2e3d4c5-b6a7-9899-2345-678901bcdefg",
    name: "Kasa Africa Clinic North",
    address: "456 Care Avenue, North Side",
    phone: "+1-555-0102",
    email: "north@kasaafrica.com",
    type: "Clinic",
  },
  {
    id: "f3e4d5c6-b7a8-9900-3456-789012cdefgh",
    name: "Kasa Africa Emergency Center",
    address: "789 Emergency Blvd, Downtown",
    phone: "+1-555-0103",
    email: "emergency@kasaafrica.com",
    type: "Emergency Center",
  },
]

// Mock data for facility availability
const mockFacilityAvailability: FacilityAvailability[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    facilityId: "f1e2d3c4-b5a6-9788-1234-567890abcdef",
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    startTime: { hour: 8, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 18, minute: 0, second: 0, nano: 0 },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "a2b3c4d5-e6f7-8901-2345-678901bcdefg",
    facilityId: "f1e2d3c4-b5a6-9788-1234-567890abcdef",
    days: ["SATURDAY"],
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 14, minute: 0, second: 0, nano: 0 },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "a3b4c5d6-e7f8-9012-3456-789012cdefgh",
    facilityId: "f2e3d4c5-b6a7-9899-2345-678901bcdefg",
    days: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 17, minute: 0, second: 0, nano: 0 },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
]

export async function getFacilities(): Promise<Facility[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockFacilities
}

export async function getFacilityAvailability(): Promise<FacilityAvailability[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockFacilityAvailability
}

export async function getFacilityAvailabilityById(id: string): Promise<FacilityAvailability | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockFacilityAvailability.find((availability) => availability.id === id) || null
}

export async function createFacilityAvailability(
  data: CreateFacilityAvailabilityRequest,
): Promise<{ success: boolean; data?: FacilityAvailability; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if facility exists
    const facility = mockFacilities.find((f) => f.id === data.facilityId)
    if (!facility) {
      return { success: false, error: "Facility not found" }
    }

    // Create new availability
    const newAvailability: FacilityAvailability = {
      id: `a${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockFacilityAvailability.push(newAvailability)

    return { success: true, data: newAvailability }
  } catch (error) {
    return { success: false, error: "Failed to create facility availability" }
  }
}

export async function updateFacilityAvailability(
  data: UpdateFacilityAvailabilityRequest,
): Promise<{ success: boolean; data?: FacilityAvailability; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = mockFacilityAvailability.findIndex((availability) => availability.id === data.id)
    if (index === -1) {
      return { success: false, error: "Facility availability not found" }
    }

    // Update availability
    const updatedAvailability: FacilityAvailability = {
      ...mockFacilityAvailability[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    mockFacilityAvailability[index] = updatedAvailability

    return { success: true, data: updatedAvailability }
  } catch (error) {
    return { success: false, error: "Failed to update facility availability" }
  }
}

export async function deleteFacilityAvailability(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = mockFacilityAvailability.findIndex((availability) => availability.id === id)
    if (index === -1) {
      return { success: false, error: "Facility availability not found" }
    }

    mockFacilityAvailability.splice(index, 1)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete facility availability" }
  }
}
