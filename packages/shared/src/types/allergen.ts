import type { AllergenCode } from '../constants/allergen-codes.js'

export type AllergenFamily =
  | 'legume'
  | 'nut'
  | 'dairy'
  | 'egg'
  | 'seafood'
  | 'grain'
  | 'seed'
  | 'additive'

export type SeverityProfile = 'ana' | 'var' | 'add'

export type SynonymType =
  | 'scientific_name'
  | 'common_name'
  | 'ingredient_label'
  | 'regional_name'
  | 'brand_name'
  | 'e_number'

export type CrossReactivityConfidence = 'established' | 'probable' | 'possible'

export interface Allergen {
  id: string
  code: AllergenCode
  canonicalName: string
  commonName: string
  family: AllergenFamily
  severityProfile: SeverityProfile
  isHealthCanadaPriority: boolean
  isSubAllergen: boolean
  parentAllergenCode?: AllergenCode
  cuisineRiskNotes?: string
}

export interface AllergenSynonym {
  id: string
  allergenCode: AllergenCode
  synonym: string
  synonymType: SynonymType
  languageCode: string
  regionNote?: string
}

export interface AllergenCrossReactivity {
  id: string
  allergenCodeA: AllergenCode
  allergenCodeB: AllergenCode
  confidenceLevel: CrossReactivityConfidence
  clinicalNotes?: string
}
