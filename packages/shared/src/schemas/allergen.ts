import { z } from 'zod'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

const allergenCodeValues = Object.values(ALLERGEN_CODES) as [string, ...string[]]

export const AllergenCodeSchema = z.enum(allergenCodeValues)

export type AllergenCodeInput = z.infer<typeof AllergenCodeSchema>
