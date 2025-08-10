export interface Department {
  id: string
  name: string
  description?: string
  isActive: boolean
}

export interface Facility {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  isActive: boolean
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  address?: string
  city?: string
  state?: string
  country?: string
  profilePicture?: string
}

export interface Expertise {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
}

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "STAFF"

export interface DoctorProfile {
  id?: string
  adminRole: AdminRole
  departmentId: string
  facilityId: string
  roleId: string
  userProfileId: string
  licenseNumber: string
  specialization: string
  yearsOfExperience: number
  qualification: string
  expertiseIds: string[]

  // Additional doctor-specific fields
  bio?: string
  consultationFee?: number
  followUpFee?: number
  emergencyFee?: number
  languages?: string[]
  availabilityHours?: {
    monday?: { start: string; end: string; isAvailable: boolean }
    tuesday?: { start: string; end: string; isAvailable: boolean }
    wednesday?: { start: string; end: string; isAvailable: boolean }
    thursday?: { start: string; end: string; isAvailable: boolean }
    friday?: { start: string; end: string; isAvailable: boolean }
    saturday?: { start: string; end: string; isAvailable: boolean }
    sunday?: { start: string; end: string; isAvailable: boolean }
  }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string

  // Related data
  department?: Department
  facility?: Facility
  role?: Role
  userProfile?: UserProfile
  expertise?: Expertise[]
}

export interface DoctorProfileRequest {
  adminRole: AdminRole
  departmentId: string
  facilityId: string
  roleId: string
  userProfileId: string
  licenseNumber: string
  specialization: string
  yearsOfExperience: number
  qualification: string
  expertiseIds: string[]
  bio?: string
  consultationFee?: number
  followUpFee?: number
  emergencyFee?: number
  languages?: string[]
  availabilityHours?: {
    monday?: { start: string; end: string; isAvailable: boolean }
    tuesday?: { start: string; end: string; isAvailable: boolean }
    wednesday?: { start: string; end: string; isAvailable: boolean }
    thursday?: { start: string; end: string; isAvailable: boolean }
    friday?: { start: string; end: string; isAvailable: boolean }
    saturday?: { start: string; end: string; isAvailable: boolean }
    sunday?: { start: string; end: string; isAvailable: boolean }
  }
}
