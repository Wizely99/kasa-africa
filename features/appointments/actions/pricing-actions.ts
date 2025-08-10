"use server"

import type {
  PractitionerPricing,
  Expertise,
  CreatePricingRequest,
  UpdatePricingRequest,
} from "../types/pricing"

// Mock data
const mockExpertise: Expertise[] = [
  {
    id: "exp-1",
    name: "General Medicine",
    description: "Primary care and general health consultations",
    category: "Primary Care",
  },
  {
    id: "exp-2",
    name: "Cardiology",
    description: "Heart and cardiovascular system specialist",
    category: "Specialty Care",
  },
  {
    id: "exp-3",
    name: "Dermatology",
    description: "Skin, hair, and nail conditions",
    category: "Specialty Care",
  },
  {
    id: "exp-4",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    category: "Specialty Care",
  },
  {
    id: "exp-5",
    name: "Orthopedics",
    description: "Musculoskeletal system and injuries",
    category: "Specialty Care",
  },
]

const mockPricings: PractitionerPricing[] = [
  {
    id: "pricing-1",
    practitionerId: "current-doctor",
    expertiseId: "exp-1",
    consultationFee: 150,
    followUpFee: 100,
    emergencyFee: 300,
    isActive: true,
    currencyCode: "USD",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "pricing-2",
    practitionerId: "current-doctor",
    expertiseId: "exp-2",
    consultationFee: 200,
    followUpFee: 150,
    emergencyFee: 400,
    isActive: true,
    currencyCode: "USD",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
]

export async function getExpertiseListAction() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
    data: mockExpertise,
  }
}

export async function getPractitionerPricingAction(practitionerId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const pricings = mockPricings.filter((p) => p.practitionerId === practitionerId)

  return {
    success: true,
    data: pricings,
  }
}

export async function createPricingAction(data: CreatePricingRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newPricing: PractitionerPricing = {
    id: `pricing-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockPricings.push(newPricing)

  return {
    success: true,
    data: newPricing,
    message: "Pricing configuration created successfully",
  }
}

export async function updatePricingAction(data: UpdatePricingRequest) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = mockPricings.findIndex((p) => p.id === data.id)
  if (index === -1) {
    return {
      success: false,
      message: "Pricing configuration not found",
    }
  }

  const updatedPricing: PractitionerPricing = {
    ...mockPricings[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  mockPricings[index] = updatedPricing

  return {
    success: true,
    data: updatedPricing,
    message: "Pricing configuration updated successfully",
  }
}

export async function deletePricingAction(pricingId: string) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = mockPricings.findIndex((p) => p.id === pricingId)
  if (index === -1) {
    return {
      success: false,
      message: "Pricing configuration not found",
    }
  }

  mockPricings.splice(index, 1)

  return {
    success: true,
    message: "Pricing configuration deleted successfully",
  }
}
