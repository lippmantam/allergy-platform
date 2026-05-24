import { z } from 'zod'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

const allergenCodeValues = Object.values(ALLERGEN_CODES) as [string, ...string[]]
const allergenCodeEnum   = z.enum(allergenCodeValues)

// --- Structured report ---

export const CreateStructuredReportSchema = z.object({
  placeId:            z.string().uuid(),
  allergensConfirmed: z.array(allergenCodeEnum).min(1),
  reactionStatus:     z.enum(['none', 'near_miss', 'reaction_occurred']),
  verificationMethod: z.enum(['menu_review', 'staff_conversation', 'chef_conversation']),
  visitDate:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  partyType:          z.enum(['child', 'adult', 'mixed']),
  severityLevel:      z.enum(['intolerance', 'allergy', 'anaphylactic']),
  languageUsed:       z.string().max(100).optional(),
})

// --- Narrative review ---

export const CreateNarrativeReviewSchema = z.object({
  placeId:        z.string().uuid(),
  experienceText: z.string().min(20).max(5000),
  safetyRating:   z.number().int().min(1).max(5),
  tips:           z.string().max(2000).optional(),
  photoUrls:      z.array(z.string().url()).max(10).default([]),
  cuisineContext: z.string().max(1000).optional(),
  wouldReturn:    z.enum(['yes', 'no', 'unsure']),
})

// --- Trust signal ---

export const CreateTrustSignalSchema = z.object({
  targetId:   z.string().uuid(),
  targetType: z.enum(['structured_report', 'narrative_review']),
  signalType: z.enum(['helpful', 'confirm', 'outdated']),
})

// --- Dispute ---

export const CreateDisputeSchema = z.object({
  targetId:   z.string().uuid(),
  targetType: z.enum(['structured_report', 'narrative_review']),
  reason:     z.string().min(20).max(2000),
})

export type CreateStructuredReportInput = z.infer<typeof CreateStructuredReportSchema>
export type CreateNarrativeReviewInput  = z.infer<typeof CreateNarrativeReviewSchema>
export type CreateTrustSignalInput      = z.infer<typeof CreateTrustSignalSchema>
export type CreateDisputeInput          = z.infer<typeof CreateDisputeSchema>
