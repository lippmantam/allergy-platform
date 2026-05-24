// Canonical allergen codes — used as foreign keys throughout the platform
// Never use raw strings where these codes are expected

export const ALLERGEN_CODES = {
  // Top-level allergens
  PNUT:  'PNUT',   // Peanut
  MILK:  'MILK',   // Milk / Dairy
  EGG:   'EGG',    // Egg
  WHEAT: 'WHEAT',  // Wheat / Triticale
  SOY:   'SOY',    // Soy
  SES:   'SES',    // Sesame
  MUST:  'MUST',   // Mustard
  FISH:  'FISH',   // Fish (finfish)
  CRUST: 'CRUST',  // Crustaceans
  MOLL:  'MOLL',   // Molluscs
  SULF:  'SULF',   // Sulphites
  GLUT:  'GLUT',   // Gluten sources

  // Tree nut sub-allergens (parent: TREE_NUT)
  TREE_NUT: 'TREE_NUT', // Parent — all tree nuts
  TN_ALM:   'TN-ALM',  // Almond
  TN_CSH:   'TN-CSH',  // Cashew
  TN_WAL:   'TN-WAL',  // Walnut
  TN_HAZ:   'TN-HAZ',  // Hazelnut
  TN_PEC:   'TN-PEC',  // Pecan
  TN_PST:   'TN-PST',  // Pistachio
  TN_BRZ:   'TN-BRZ',  // Brazil nut
  TN_MAC:   'TN-MAC',  // Macadamia
  TN_PIN:   'TN-PIN',  // Pine nut
} as const

export type AllergenCode = (typeof ALLERGEN_CODES)[keyof typeof ALLERGEN_CODES]

// Tree nut sub-allergen codes — useful for filtering
export const TREE_NUT_CODES: AllergenCode[] = [
  ALLERGEN_CODES.TN_ALM,
  ALLERGEN_CODES.TN_CSH,
  ALLERGEN_CODES.TN_WAL,
  ALLERGEN_CODES.TN_HAZ,
  ALLERGEN_CODES.TN_PEC,
  ALLERGEN_CODES.TN_PST,
  ALLERGEN_CODES.TN_BRZ,
  ALLERGEN_CODES.TN_MAC,
  ALLERGEN_CODES.TN_PIN,
]

// Health Canada priority allergen codes
export const HEALTH_CANADA_PRIORITY: AllergenCode[] = [
  ALLERGEN_CODES.PNUT,
  ALLERGEN_CODES.TREE_NUT,
  ALLERGEN_CODES.MILK,
  ALLERGEN_CODES.EGG,
  ALLERGEN_CODES.WHEAT,
  ALLERGEN_CODES.SOY,
  ALLERGEN_CODES.SES,
  ALLERGEN_CODES.MUST,
  ALLERGEN_CODES.FISH,
  ALLERGEN_CODES.CRUST,
  ALLERGEN_CODES.MOLL,
  ALLERGEN_CODES.SULF,
]
