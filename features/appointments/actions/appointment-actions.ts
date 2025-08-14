"use server"

import { revalidatePath } from "next/cache"
import type {
  AppointmentSlot,
  CreateSlotRequest,
  PractitionerPricing,
  PractitionerPricingRequest,
  Expertise,
  BookAppointmentRequest,
  Appointment,
  AppointmentsResponse,
  Facility,
  Doctor,
} from "../types/appointment"

// Mock data for development
const mockSlots: AppointmentSlot[] = [
  {
    id: "1",
    doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    facilityId: "facility-1",
    slotDate: "2025-01-15",
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 9, minute: 30, second: 0, nano: 0 },
    isAvailable: true,
    slotType: "REGULAR",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    facilityId: "facility-1",
    slotDate: "2025-01-15",
    startTime: { hour: 10, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 10, minute: 30, second: 0, nano: 0 },
    isAvailable: false,
    slotType: "CONSULTATION",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
]

// Mock facilities data
const mockFacilities: Facility[] = [
  {
    id: "facility-1",
    name: "KasaAfrica Medical Center",
    address: "123 Health Street",
    city: "Lagos",
    state: "Lagos State",
    zipCode: "100001",
    phone: "+234-1-234-5678",
    email: "info@kasamedical.com",
    type: "Hospital",
    isActive: true,
  },
  {
    id: "facility-2",
    name: "KasaAfrica Clinic Abuja",
    address: "456 Wellness Avenue",
    city: "Abuja",
    state: "FCT",
    zipCode: "900001",
    phone: "+234-9-876-5432",
    email: "abuja@kasamedical.com",
    type: "Clinic",
    isActive: true,
  },
]

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    email: "sarah.johnson@kasamedical.com",
    phone: "+234-1-234-5679",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    reviewCount: 156,
    experience: 12,
    consultationFee: 150,
    isAvailable: true,
    bio: "Experienced cardiologist with expertise in heart disease prevention and treatment.",
    location: "Lagos",
    languages: ["English", "Yoruba"],
    nextAvailable: "2025-01-15T09:00:00Z",
  },
]

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "appointment-1",
    patientId: "patient-1",
    doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    facilityId: "facility-1",
    appointmentDate: "2025-01-15",
    startTime: { hour: 9, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 9, minute: 30, second: 0, nano: 0 },
    appointmentType: "IN_PERSON",
    status: "SCHEDULED",
    chiefComplaint: "Chest pain and shortness of breath",
    notes: "Patient reports symptoms for the past week",
    confirmationCode: "CONF123456",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    date: "2025-01-15",
    time: "09:00",
    fee: 150,
  },
  {
    id: "appointment-2",
    patientId: "patient-1",
    doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    facilityId: "facility-1",
    appointmentDate: "2025-01-10",
    startTime: { hour: 14, minute: 0, second: 0, nano: 0 },
    endTime: { hour: 14, minute: 30, second: 0, nano: 0 },
    appointmentType: "VIRTUAL",
    status: "COMPLETED",
    chiefComplaint: "Follow-up consultation",
    notes: "Regular check-up appointment",
    confirmationCode: "CONF789012",
    actualStartTime: "2025-01-10T14:05:00Z",
    actualEndTime: "2025-01-10T14:35:00Z",
    createdAt: "2024-12-28T00:00:00Z",
    updatedAt: "2025-01-10T14:35:00Z",
    date: "2025-01-10",
    time: "14:00",
    fee: 150,
  },
]

// Mock expertise data
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
]

// Mock pricing data
const mockPricings: PractitionerPricing[] = [
  {
    id: "pricing-1",
    practitionerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
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
    expertise: mockExpertise[0],
  },
  {
    id: "pricing-2",
    practitionerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    expertiseId: "exp-2",
    consultationFee: 250,
    followUpFee: 150,
    emergencyFee: 500,
    isActive: true,
    currencyCode: "USD",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    expertise: mockExpertise[1],
  },
]

export async function getDoctorSlotsAction(doctorId: string, date: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointment-slots/doctor/${doctorId}?date=${date}`)
    // const data = await response.json()

    const filteredSlots = mockSlots.filter(
      (slot) => slot.doctorId === doctorId && slot.slotDate === date && slot.isAvailable,
    )

    // Convert to legacy format for compatibility
    const legacySlots = filteredSlots.map((slot) => ({
      id: slot.id,
      doctorId: slot.doctorId,
      date: slot.slotDate,
      time: `${slot.startTime.hour.toString().padStart(2, "0")}:${slot.startTime.minute.toString().padStart(2, "0")}`,
      duration: 30, // Default duration
      isAvailable: slot.isAvailable,
      price: 150, // Default price
    }))

    return {
      success: true,
      data: legacySlots,
    }
  } catch (error) {
    console.error("Error fetching appointment slots:", error)
    return {
      success: false,
      error: "Failed to fetch appointment slots",
    }
  }
}

export async function getDoctorAppointmentSlotsAction(doctorId: string, date: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointment-slots/doctor/${doctorId}?date=${date}`)
    // const data = await response.json()

    const filteredSlots = mockSlots.filter((slot) => slot.doctorId === doctorId && slot.slotDate === date)

    return {
      success: true,
      data: {
        data: filteredSlots,
        total: filteredSlots.length,
        page: 1,
        limit: 50,
      },
    }
  } catch (error) {
    console.error("Error fetching appointment slots:", error)
    return {
      success: false,
      error: "Failed to fetch appointment slots",
    }
  }
}

export async function getDoctorAllSlotsAction(doctorId: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointment-slots/doctor/${doctorId}`)
    // const data = await response.json()

    const filteredSlots = mockSlots.filter((slot) => slot.doctorId === doctorId)

    return {
      success: true,
      data: {
        data: filteredSlots,
        total: filteredSlots.length,
        page: 1,
        limit: 50,
      },
    }
  } catch (error) {
    console.error("Error fetching all appointment slots:", error)
    return {
      success: false,
      error: "Failed to fetch appointment slots",
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

export async function getDoctorsAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/doctors`)
    // const data = await response.json()

    return {
      success: true,
      data: mockDoctors.filter((doctor) => doctor.isAvailable),
    }
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return {
      success: false,
      error: "Failed to fetch doctors",
    }
  }
}

export async function bookAppointmentAction(appointmentData: BookAppointmentRequest) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointmentData),
    // })
    // const data = await response.json()

    console.log("Booking appointment:", appointmentData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create new appointment
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      ...appointmentData,
      confirmationCode: `CONF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data
    mockAppointments.push(newAppointment)

    // Mark slot as unavailable
    const slotIndex = mockSlots.findIndex(
      (slot) =>
        slot.doctorId === appointmentData.doctorId &&
        slot.slotDate === appointmentData.appointmentDate &&
        slot.startTime.hour === appointmentData.startTime.hour &&
        slot.startTime.minute === appointmentData.startTime.minute,
    )

    if (slotIndex !== -1) {
      mockSlots[slotIndex].isAvailable = false
    }

    revalidatePath("/patient/appointments")
    revalidatePath("/patient/book-appointment")

    return {
      success: true,
      data: newAppointment,
      message: "Appointment booked successfully",
    }
  } catch (error) {
    console.error("Error booking appointment:", error)
    return {
      success: false,
      error: "Failed to book appointment",
    }
  }
}

export async function getPatientAppointmentsAction(patientId: string, page = 0, size = 10) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointments/patient/${patientId}?page=${page}&size=${size}`)
    // const data = await response.json()

    const patientAppointments = mockAppointments.filter((appointment) => appointment.patientId === patientId)

    // Sort by appointment date and time (newest first)
    patientAppointments.sort((a, b) => {
      const dateA = new Date(
        `${a.appointmentDate}T${a.startTime.hour.toString().padStart(2, "0")}:${a.startTime.minute.toString().padStart(2, "0")}:00`,
      )
      const dateB = new Date(
        `${b.appointmentDate}T${b.startTime.hour.toString().padStart(2, "0")}:${b.startTime.minute.toString().padStart(2, "0")}:00`,
      )
      return dateB.getTime() - dateA.getTime()
    })

    // Paginate results
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedAppointments = patientAppointments.slice(startIndex, endIndex)

    const response: AppointmentsResponse = {
      totalElements: patientAppointments.length,
      totalPages: Math.ceil(patientAppointments.length / size),
      pageable: {
        unpaged: false,
        pageNumber: page,
        paged: true,
        pageSize: size,
        offset: startIndex,
        sort: {
          sorted: true,
          empty: false,
          unsorted: false,
        },
      },
      numberOfElements: paginatedAppointments.length,
      size: size,
      content: paginatedAppointments,
      number: page,
      sort: {
        sorted: true,
        empty: false,
        unsorted: false,
      },
      first: page === 0,
      last: page >= Math.ceil(patientAppointments.length / size) - 1,
      empty: paginatedAppointments.length === 0,
    }

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("Error fetching patient appointments:", error)
    return {
      success: false,
      error: "Failed to fetch appointments",
    }
  }
}

export async function cancelAppointmentAction(appointmentId: string, reason: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointments/${appointmentId}/cancel`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ reason }),
    // })

    console.log("Cancelling appointment:", appointmentId, reason)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update appointment status
    const appointmentIndex = mockAppointments.findIndex((appt) => appt.id === appointmentId)
    if (appointmentIndex !== -1) {
      mockAppointments[appointmentIndex].status = "CANCELLED"
      mockAppointments[appointmentIndex].cancellationReason = reason
      mockAppointments[appointmentIndex].updatedAt = new Date().toISOString()

      // Make slot available again
      const appointment = mockAppointments[appointmentIndex]
      const slotIndex = mockSlots.findIndex(
        (slot) =>
          slot.doctorId === appointment.doctorId &&
          slot.slotDate === appointment.appointmentDate &&
          slot.startTime.hour === appointment.startTime.hour &&
          slot.startTime.minute === appointment.startTime.minute,
      )

      if (slotIndex !== -1) {
        mockSlots[slotIndex].isAvailable = true
      }
    }

    revalidatePath("/patient/appointments")

    return {
      success: true,
      message: "Appointment cancelled successfully",
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return {
      success: false,
      error: "Failed to cancel appointment",
    }
  }
}

export async function createBulkSlotsAction(slots: CreateSlotRequest[]) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/appointment-slots/bulk`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(slots),
    // })
    // const data = await response.json()

    // Mock success response
    console.log("Creating bulk slots:", slots)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    revalidatePath("/doctor/schedule")

    return {
      success: true,
      data: {
        created: slots.length,
        message: `Successfully created ${slots.length} appointment slots`,
      },
    }
  } catch (error) {
    console.error("Error creating bulk slots:", error)
    return {
      success: false,
      error: "Failed to create appointment slots",
    }
  }
}

// Practitioner pricing actions
export async function getPractitionerPricingAction(practitionerId: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/practitioner-pricing?practitionerId=${practitionerId}`)
    // const data = await response.json()

    const filteredPricings = mockPricings.filter((pricing) => pricing.practitionerId === practitionerId)

    return {
      success: true,
      data: {
        data: filteredPricings,
        total: filteredPricings.length,
        page: 1,
        limit: 50,
      },
    }
  } catch (error) {
    console.error("Error fetching practitioner pricing:", error)
    return {
      success: false,
      error: "Failed to fetch practitioner pricing",
    }
  }
}

export async function getExpertiseListAction() {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/expertise`)
    // const data = await response.json()

    return {
      success: true,
      data: mockExpertise.filter((exp) => exp.isActive),
    }
  } catch (error) {
    console.error("Error fetching expertise list:", error)
    return {
      success: false,
      error: "Failed to fetch expertise list",
    }
  }
}

export async function createPractitionerPricingAction(pricingData: PractitionerPricingRequest) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/practitioner-pricing`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(pricingData),
    // })
    // const data = await response.json()

    console.log("Creating practitioner pricing:", pricingData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add to mock data
    const newPricing: PractitionerPricing = {
      id: `pricing-${Date.now()}`,
      ...pricingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expertise: mockExpertise.find((exp) => exp.id === pricingData.expertiseId),
    }

    mockPricings.push(newPricing)

    revalidatePath("/doctor/schedule")

    return {
      success: true,
      data: newPricing,
      message: "Pricing created successfully",
    }
  } catch (error) {
    console.error("Error creating practitioner pricing:", error)
    return {
      success: false,
      error: "Failed to create practitioner pricing",
    }
  }
}

export async function updatePractitionerPricingAction(
  pricingId: string,
  pricingData: Partial<PractitionerPricingRequest>,
) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/practitioner-pricing/${pricingId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(pricingData),
    // })
    // const data = await response.json()

    console.log("Updating practitioner pricing:", pricingId, pricingData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update mock data
    const pricingIndex = mockPricings.findIndex((p) => p.id === pricingId)
    if (pricingIndex !== -1) {
      mockPricings[pricingIndex] = {
        ...mockPricings[pricingIndex],
        ...pricingData,
        updatedAt: new Date().toISOString(),
      }
    }

    revalidatePath("/doctor/schedule")

    return {
      success: true,
      data: mockPricings[pricingIndex],
      message: "Pricing updated successfully",
    }
  } catch (error) {
    console.error("Error updating practitioner pricing:", error)
    return {
      success: false,
      error: "Failed to update practitioner pricing",
    }
  }
}

export async function deletePractitionerPricingAction(pricingId: string) {
  try {
    // In production, replace with actual API call
    // const response = await fetch(`${process.env.API_URL}/api/v1/practitioner-pricing/${pricingId}`, {
    //   method: 'DELETE',
    // })

    console.log("Deleting practitioner pricing:", pricingId)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Remove from mock data
    const pricingIndex = mockPricings.findIndex((p) => p.id === pricingId)
    if (pricingIndex !== -1) {
      mockPricings.splice(pricingIndex, 1)
    }

    revalidatePath("/doctor/schedule")

    return {
      success: true,
      message: "Pricing deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting practitioner pricing:", error)
    return {
      success: false,
      error: "Failed to delete practitioner pricing",
    }
  }
}
