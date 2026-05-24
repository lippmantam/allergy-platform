import type { AllergenCode } from '../constants/allergen-codes.js'
import type { VerificationMethod } from './place.js'

export type ReactionStatus = 'none' | 'near_miss' | 'reaction_occurred'
export type PartyType = 'child' | 'adult' | 'mixed'
export type SeverityLevel = 'intolerance' | 'allergy' | 'anaphylactic'
export type WouldReturn = 'yes' | 'no' | 'unsure'
export type SignalType = 'helpful' | 'confirm' | 'outdated'
export type DisputeStatus = 'open' | 'resolved' | 'dismissed'
export type TargetType = 'structured_report' | 'narrative_review'

export interface StructuredReport {
  id: string
  placeId: string
  contributorId: string
  allergensConfirmed: AllergenCode[]
  reactionStatus: ReactionStatus
  verificationMethod: VerificationMethod
  visitDate: string
  partyType: PartyType
  severityLevel: SeverityLevel
  languageUsed?: string
  createdAt: string
  deletedAt?: string
}

export interface NarrativeReview {
  id: string
  placeId: string
  contributorId: string
  experienceText: string
  safetyRating: number
  tips?: string
  photoUrls: string[]
  cuisineContext?: string
  wouldReturn: WouldReturn
  createdAt: string
  deletedAt?: string
}

export interface TrustSignal {
  id: string
  targetId: string
  targetType: TargetType
  contributorId: string
  signalType: SignalType
  createdAt: string
}

export interface Dispute {
  id: string
  targetId: string
  targetType: TargetType
  raisedBy: string
  reason: string
  status: DisputeStatus
  createdAt: string
}

export interface CreateStructuredReportInput {
  placeId: string
  allergensConfirmed: AllergenCode[]
  reactionStatus: ReactionStatus
  verificationMethod: VerificationMethod
  visitDate: string
  partyType: PartyType
  severityLevel: SeverityLevel
  languageUsed?: string
}

export interface CreateNarrativeReviewInput {
  placeId: string
  experienceText: string
  safetyRating: number
  tips?: string
  photoUrls?: string[]
  cuisineContext?: string
  wouldReturn: WouldReturn
}
