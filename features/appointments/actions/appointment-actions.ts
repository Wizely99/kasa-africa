"use server"

import type { Doctor, AppointmentSlot, Appointment, BookAppointmentRequest } from "../types/appointment"

// Enhanced mock data with more comprehensive doctor profiles
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Emily Carter",
    specialization: "Dermatology",
    email: "emily.carter@hospital.com",
    phone: "+1-555-0123",
    rating: 4.9,
    reviewCount: 127,
    experience: 8,
    consultationFee: 150,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=EC",
    bio: "Specializing in medical and cosmetic dermatology with expertise in skin cancer detection and treatment.",
    location: "Downtown Medical Center",
    languages: ["English", "Spanish", "French"],
    nextAvailable: "Today 2:00 PM",
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    specialization: "Cardiology",
    email: "michael.johnson@hospital.com",
    phone: "+1-555-0124",
    rating: 4.8,
    reviewCount: 203,
    experience: 12,
    consultationFee: 200,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=MJ",
    bio: "Board-certified cardiologist with extensive experience in interventional cardiology and heart disease prevention.",
    location: "Heart & Vascular Institute",
    languages: ["English", "German"],
    nextAvailable: "Tomorrow 9:00 AM",
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    specialization: "Pediatrics",
    email: "sarah.williams@hospital.com",
    phone: "+1-555-0125",
    rating: 4.7,
    reviewCount: 89,
    experience: 6,
    consultationFee: 120,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=SW",
    bio: "Dedicated pediatrician focused on comprehensive care for children from infancy through adolescence.",
    location: "Children's Medical Center",
    languages: ["English", "Mandarin"],
    nextAvailable: "Today 4:30 PM",
  },
  {
    id: "4",
    name: "Dr. James Rodriguez",
    specialization: "Orthopedics",
    email: "james.rodriguez@hospital.com",
    phone: "+1-555-0126",
    rating: 4.6,
    reviewCount: 156,
    experience: 15,
    consultationFee: 180,
    isAvailable: false,
    avatar: "/placeholder.svg?height=100&width=100&text=JR",
    bio: "Orthopedic surgeon specializing in sports medicine, joint replacement, and minimally invasive procedures.",
    location: "Sports Medicine Clinic",
    languages: ["English", "Spanish", "Portuguese"],
    nextAvailable: "Monday 10:00 AM",
  },
  {
    id: "5",
    name: "Dr. Lisa Chen",
    specialization: "Neurology",
    email: "lisa.chen@hospital.com",
    phone: "+1-555-0127",
    rating: 4.9,
    reviewCount: 94,
    experience: 10,
    consultationFee: 220,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=LC",
    bio: "Neurologist with expertise in epilepsy, stroke care, and neurodegenerative diseases.",
    location: "Neuroscience Center",
    languages: ["English", "Mandarin", "Cantonese"],
    nextAvailable: "Today 3:15 PM",
  },
  {
    id: "6",
    name: "Dr. Robert Thompson",
    specialization: "Psychiatry",
    email: "robert.thompson@hospital.com",
    phone: "+1-555-0128",
    rating: 4.5,
    reviewCount: 67,
    experience: 9,
    consultationFee: 160,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=RT",
    bio: "Psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy.",
    location: "Mental Health Center",
    languages: ["English"],
    nextAvailable: "Tomorrow 11:00 AM",
  },
  {
    id: "7",
    name: "Dr. Maria Gonzalez",
    specialization: "Oncology",
    email: "maria.gonzalez@hospital.com",
    phone: "+1-555-0129",
    rating: 4.8,
    reviewCount: 112,
    experience: 14,
    consultationFee: 250,
    isAvailable: true,
    avatar: "/placeholder.svg?height=100&width=100&text=MG",
    bio: "Medical oncologist with expertise in breast cancer, lung cancer, and immunotherapy treatments.",
    location: "Cancer Treatment Center",
    languages: ["English", "Spanish", "Italian"],
    nextAvailable: "Today 1:00 PM",
  },
  {
    id: "8",
    name: "Dr. David Kim",
    specialization: "Gynecology",
    email: "david.kim@hospital.com",
    phone: "+1-555-0130",
    rating: 4.7,
    reviewCount: 78,
    experience: 7,
    consultationFee: 140,
    isAvailable: false,
    avatar: "/placeholder.svg?height=100&width=100&text=DK",
    bio: "Gynecologist providing comprehensive women's health care including preventive care and minimally invasive surgery.",
    location: "Women's Health Center",
    languages: ["English", "Korean"],
    nextAvailable: "Wednesday 2:30 PM",
  },
]

const mockSlots: AppointmentSlot[] = [
  // Dr. Emily Carter (Dermatology) - Available today
  {
    id: "slot-1",
    doctorId: "1",
    date: "2024-07-15",
    time: "09:00",
    duration: 30,
    isAvailable: true,
    price: 150,
  },
  {
    id: "slot-2",
    doctorId: "1",
    date: "2024-07-15",
    time: "10:00",
    duration: 30,
    isAvailable: true,
    price: 150,
  },
  {
    id: "slot-3",
    doctorId: "1",
    date: "2024-07-15",
    time: "14:00",
    duration: 30,
    isAvailable: true,
    price: 150,
  },
  {
    id: "slot-4",
    doctorId: "1",
    date: "2024-07-15",
    time: "15:30",
    duration: 30,
    isAvailable: true,
    price: 150,
  },
  // Dr. Michael Johnson (Cardiology) - Available tomorrow
  {
    id: "slot-5",
    doctorId: "2",
    date: "2024-07-16",
    time: "09:00",
    duration: 45,
    isAvailable: true,
    price: 200,
  },
  {
    id: "slot-6",
    doctorId: "2",
    date: "2024-07-16",
    time: "11:00",
    duration: 45,
    isAvailable: true,
    price: 200,
  },
  {
    id: "slot-7",
    doctorId: "2",
    date: "2024-07-16",
    time: "14:00",
    duration: 45,
    isAvailable: true,
    price: 200,
  },
  // Dr. Sarah Williams (Pediatrics) - Available today
  {
    id: "slot-8",
    doctorId: "3",
    date: "2024-07-15",
    time: "10:30",
    duration: 30,
    isAvailable: true,
    price: 120,
  },
  {
    id: "slot-9",
    doctorId: "3",
    date: "2024-07-15",
    time: "16:30",
    duration: 30,
    isAvailable: true,
    price: 120,
  },
  // Dr. Lisa Chen (Neurology) - Available today
  {
    id: "slot-10",
    doctorId: "5",
    date: "2024-07-15",
    time: "15:15",
    duration: 60,
    isAvailable: true,
    price: 220,
  },
  {
    id: "slot-11",
    doctorId: "5",
    date: "2024-07-16",
    time: "10:00",
    duration: 60,
    isAvailable: true,
    price: 220,
  },
]

export async function getAllDoctorsAction() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return { success: true, data: mockDoctors }
}

export async function searchDoctorsAction(query?: string, specialization?: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredDoctors = mockDoctors

  if (query) {
    filteredDoctors = filteredDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
        doctor.bio?.toLowerCase().includes(query.toLowerCase()),
    )
  }

  if (specialization && specialization !== "all") {
    filteredDoctors = filteredDoctors.filter(
      (doctor) => doctor.specialization.toLowerCase() === specialization.toLowerCase(),
    )
  }

  return { success: true, data: filteredDoctors }
}

export async function getDoctorSlotsAction(doctorId: string, date?: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredSlots = mockSlots.filter((slot) => slot.doctorId === doctorId)

  if (date) {
    filteredSlots = filteredSlots.filter((slot) => slot.date === date)
  }

  return { success: true, data: filteredSlots }
}

export async function bookAppointmentAction(data: BookAppointmentRequest) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const doctor = mockDoctors.find((d) => d.id === data.doctorId)
  const slot = mockSlots.find((s) => s.id === data.slotId)

  if (!doctor || !slot) {
    return { success: false, error: "Doctor or slot not found" }
  }

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    patientId: data.patientId,
    doctorId: data.doctorId,
    doctorName: doctor.name,
    date: slot.date,
    time: slot.time,
    type: data.type,
    status: "scheduled",
    notes: data.notes,
    fee: slot.price,
  }

  // Mark slot as unavailable
  slot.isAvailable = false

  return {
    success: true,
    data: newAppointment,
    message: "Appointment booked successfully!",
  }
}

export async function getPatientAppointmentsAction(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock patient appointments
  const appointments: Appointment[] = [
    {
      id: "apt-1",
      patientId,
      doctorId: "1",
      doctorName: "Dr. Emily Carter",
      date: "2024-07-20",
      time: "14:30",
      type: "consultation",
      status: "scheduled",
      fee: 150,
    },
    {
      id: "apt-2",
      patientId,
      doctorId: "2",
      doctorName: "Dr. Michael Johnson",
      date: "2024-06-15",
      time: "10:00",
      type: "check-up",
      status: "completed",
      fee: 200,
    },
  ]

  return { success: true, data: appointments }
}
