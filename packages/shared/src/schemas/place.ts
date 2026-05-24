import { z } from 'zod'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

const allergenCodeValues = Object.values(ALLERGEN_CODES) as [string, ...string[]]

export const PlaceSearchParamsSchema = z.object({
  latitude:     z.number().min(-90).max(90),
  longitude:    z.number().min(-180).max(180),
  radiusKm:     z.number().min(0.1).max(50).default(2),
  allergenCodes: z.array(z.enum(allergenCodeValues)).min(1),
  cuisineType:  z.string().optional(),
  limit:        z.number().int().min(1).max(100).default(20),
  offset:       z.number().int().min(0).default(0),
})

export const CreatePlaceSchema = z.object({
  name:          z.string().min(1).max(200),
  address:       z.string().min(1).max(500),
  latitude:      z.number().min(-90).max(90),
  longitude:     z.number().min(-180).max(180),
  cuisineType:   z.string().min(1).max(100),
  phone:         z.string().max(30).optional(),
  website:       z.string().url().optional(),
  hours:         z.string().max(200).optional(),
  allergenAware: z.enum(['yes', 'no', 'unknown']).default('unknown'),
})

export const UpdatePlaceSchema = CreatePlaceSchema.partial()

export type PlaceSearchParamsInput  = z.infer<typeof PlaceSearchParamsSchema>
export type CreatePlaceInput        = z.infer<typeof CreatePlaceSchema>
export type UpdatePlaceInput        = z.infer<typeof UpdatePlaceSchema>
