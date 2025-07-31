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

export interface AppointmentSlot {
  id: string
  doctorId: string
  date: string
  time: string
  duration: number
  isAvailable: boolean
  price: number
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "consultation" | "follow-up" | "check-up"
  status: "scheduled" | "completed" | "cancelled" | "pending"
  notes?: string
  fee: number
}

export interface BookAppointmentRequest {
  doctorId: string
  slotId: string
  patientId: string
  type: "consultation" | "follow-up" | "check-up"
  notes?: string
}
