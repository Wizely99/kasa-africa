export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: "Male" | "Female" | "Other"
  bloodType: string
  address: string
  status: "Active" | "Inactive"
  lastVisit: string
  nextAppointment?: string
  condition: string
  avatar?: string
  medicalHistory: MedicalRecord[]
  prescriptions: Prescription[]
  vitals: VitalSigns
}

export interface MedicalRecord {
  date: string
  diagnosis: string
  treatment: string
  doctor: string
  notes?: string
}

export interface Prescription {
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  status?: "Active" | "Completed" | "Discontinued"
}

export interface VitalSigns {
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  height: string
  respiratoryRate?: string
  oxygenSaturation?: string
}

export interface PatientSearchFilters {
  query?: string
  status?: "All" | "Active" | "Inactive"
  condition?: string
  ageRange?: {
    min: number
    max: number
  }
}
