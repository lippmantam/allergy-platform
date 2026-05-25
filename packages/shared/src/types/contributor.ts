import type { AllergenCode } from '../constants/allergen-codes.js'

export interface Contributor {
  id: string
  displayName: string
  allergenProfile: AllergenCode[]
  contributionCount: number
  trustScore: number
  verifiedParent: boolean
  memberSince: string
}

export interface ContributorPublicProfile {
  id: string
  displayName: string
  contributionCount: number
  trustScore: number
  verifiedParent: boolean
  memberSince: string
}
