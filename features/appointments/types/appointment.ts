export interface Doctor {
  id: string
  name: string
  specialization: string
  email: string
  phone: string
  avatar?: string
  rating: number
  reviewCount: number
  experience: number
  consultationFee: number
  isAvailable: boolean
  bio?: string
  location?: string
  languages?: string[]
  nextAvailable?: string
}

export interface Facility {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  type: string
  isActive: boolean
}

export interface TimeSlot {
  hour: number
  minute: number
  second: number
  nano: number
}

export type AppointmentType = "IN_PERSON" | "VIRTUAL" | "PHONE_CONSULTATION"
export type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW"

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  facilityId: string
  appointmentDate: string // YYYY-MM-DD format
  startTime: TimeSlot
  endTime: TimeSlot
  appointmentType: AppointmentType
  status: AppointmentStatus
  chiefComplaint: string
  notes?: string
  confirmationCode?: string
  actualStartTime?: string // ISO string
  actualEndTime?: string // ISO string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export interface BookAppointmentRequest {
  patientId: string
  doctorId: string
  facilityId: string
  appointmentDate: string // YYYY-MM-DD format
  startTime: TimeSlot
  endTime: TimeSlot
  appointmentType: AppointmentType
  status: AppointmentStatus
  chiefComplaint: string
  notes?: string
}

export interface Pageable {
  unpaged: boolean
  pageNumber: number
  paged: boolean
  pageSize: number
  offset: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
}

export interface AppointmentsResponse {
  totalElements: number
  totalPages: number
  pageable: Pageable
  numberOfElements: number
  size: number
  content: Appointment[]
  number: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  first: boolean
  last: boolean
  empty: boolean
}

export interface AppointmentSlot {
  id: string
  doctorId: string
  facilityId: string
  slotDate: string // YYYY-MM-DD format
  startTime: TimeSlot
  endTime: TimeSlot
  isAvailable: boolean
  slotType: SlotType
  createdAt: string
  updatedAt: string
}

export type SlotType = "REGULAR" | "CONSULTATION" | "FOLLOW_UP" | "EMERGENCY"

export interface CreateSlotRequest {
  doctorId: string
  facilityId: string
  slotDate: string
  startTime: TimeSlot
  endTime: TimeSlot
  isAvailable: boolean
  slotType: SlotType
}

export interface BulkCreateSlotsRequest extends Array<CreateSlotRequest> {}

export interface AppointmentSlotsResponse {
  data: AppointmentSlot[]
  total: number
  page: number
  limit: number
}

// Practitioner pricing types
export interface Expertise {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
}

export interface PractitionerPricing {
  id: string
  practitionerId: string
  expertiseId: string
  consultationFee: number
  followUpFee: number
  emergencyFee: number
  isActive: boolean
  currencyCode: string
  effectiveFrom: string
  effectiveTo: string
  createdAt: string
  updatedAt: string
  expertise?: Expertise
}

export interface PractitionerPricingRequest {
  practitionerId: string
  expertiseId: string
  consultationFee: number
  followUpFee: number
  emergencyFee: number
  isActive: boolean
  currencyCode: string
  effectiveFrom: string
  effectiveTo: string
}

export interface PractitionerPricingResponse {
  data: PractitionerPricing[]
  total: number
  page: number
  limit: number
}

// Legacy interface for backward compatibility
export interface LegacyAppointmentSlot {
  id: string
  doctorId: string
  date: string
  time: string
  duration: number
  isAvailable: boolean
  price: number
}
