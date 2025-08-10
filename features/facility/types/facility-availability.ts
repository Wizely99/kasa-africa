export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

export interface TimeObject {
  hour: number
  minute: number
  second: number
  nano: number
}

export interface FacilityAvailability {
  id: string
  facilityId: string
  days: DayOfWeek[]
  startTime: TimeObject
  endTime: TimeObject
  createdAt?: string
  updatedAt?: string
}

export interface CreateFacilityAvailabilityRequest {
  facilityId: string
  days: DayOfWeek[]
  startTime: TimeObject
  endTime: TimeObject
}

export interface UpdateFacilityAvailabilityRequest {
  id: string
  facilityId?: string
  days?: DayOfWeek[]
  startTime?: TimeObject
  endTime?: TimeObject
}

export interface Facility {
  id: string
  name: string
  address: string
  phone: string
  email: string
  type: string
}
