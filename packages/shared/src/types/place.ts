import type { AllergenCode } from '../constants/allergen-codes.js'

export type AllergenAwareStatus = 'yes' | 'no' | 'unknown'

export type AccommodationLevel =
  | 'aware'
  | 'menu_options'
  | 'dedicated_section'

export type StaffTrainingLevel = 'none' | 'basic' | 'trained' | 'certified'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

export type VerificationMethod =
  | 'menu_review'
  | 'staff_conversation'
  | 'chef_conversation'

export interface PlaceAllergen {
  id: string
  placeId: string
  allergenCode: AllergenCode
  accommodationLevel: AccommodationLevel
  dedicatedKitchen: boolean
  sharedFryerRisk: boolean
  staffTrainingLevel: StaffTrainingLevel
  confidenceLevel?: ConfidenceLevel
  notes?: string
}

export interface Place {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  cuisineType: string
  phone?: string
  website?: string
  hours?: string
  allergenAware: AllergenAwareStatus
  dateAdded: string
  addedByContributorId: string
  lastVerified?: string
  verificationMethod?: VerificationMethod
  verifiedByContributorId?: string
  communityConfirmations: number
  completenessScore: number
  allergens?: PlaceAllergen[]
}

export interface PlaceSearchParams {
  latitude: number
  longitude: number
  radiusKm: number
  allergenCodes: AllergenCode[]
  cuisineType?: string
  limit?: number
  offset?: number
}

export interface PlaceSearchResult {
  places: Place[]
  total: number
  disclaimerRequired: true
}
