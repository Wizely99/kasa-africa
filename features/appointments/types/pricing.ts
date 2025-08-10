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
  createdAt?: string
  updatedAt?: string
}

export interface Expertise {
  id: string
  name: string
  description: string
  category: string
}

export interface CreatePricingRequest {
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

export interface UpdatePricingRequest extends CreatePricingRequest {
  id: string
}

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
] as const

export type CurrencyCode = typeof CURRENCY_OPTIONS[number]['code']
