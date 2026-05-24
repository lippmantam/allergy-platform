import { z } from 'zod'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

const allergenCodeValues = Object.values(ALLERGEN_CODES) as [string, ...string[]]

export const UpdateContributorSchema = z.object({
  displayName:    z.string().min(2).max(50).optional(),
  allergenProfile: z.array(z.enum(allergenCodeValues)).optional(),
  verifiedParent: z.boolean().optional(),
})

export type UpdateContributorInput = z.infer<typeof UpdateContributorSchema>
