// constants.ts
export const TIME_SLOTS = [
  { start: "09:00", end: "09:30" },
  { start: "10:00", end: "10:30" },
  { start: "11:00", end: "11:30" },
  { start: "14:00", end: "14:30" },
  { start: "15:00", end: "15:30" },
  { start: "16:00", end: "16:30" },
];

export const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation", price: 30000 },
  { value: "follow-up", label: "Follow-up", price: 20000 },
  { value: "check-up", label: "General Check-up", price: 25000 },
];

export const STEPS = ["Select Time", "Choose Type", "Payment", "Confirmation"];

// types.ts
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

export type AppointmentType = typeof APPOINTMENT_TYPES[0];