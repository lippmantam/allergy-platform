import type { Allergen, AllergenSynonym } from '../types/allergen.js'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

export const ALLERGENS: Allergen[] = [
  {
    id: '1', code: ALLERGEN_CODES.PNUT, canonicalName: 'Peanut',
    commonName: 'Peanut', family: 'legume', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Prevalent in satay sauce, mole, pad thai, and many Asian cuisines.',
  },
  {
    id: '2', code: ALLERGEN_CODES.MILK, canonicalName: 'Milk',
    commonName: 'Dairy / Milk', family: 'dairy', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Hidden in processed foods, sauces, and baked goods. Ghee contains milk protein.',
  },
  {
    id: '3', code: ALLERGEN_CODES.EGG, canonicalName: 'Egg',
    commonName: 'Egg', family: 'egg', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Found in glazed pastries, pasta, ice cream, marshmallows.',
  },
  {
    id: '4', code: ALLERGEN_CODES.WHEAT, canonicalName: 'Wheat',
    commonName: 'Wheat / Triticale', family: 'grain', severityProfile: 'var',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Spelt and kamut are ancient wheat varieties — not safe for wheat allergy.',
  },
  {
    id: '5', code: ALLERGEN_CODES.SOY, canonicalName: 'Soy',
    commonName: 'Soy / Soya', family: 'legume', severityProfile: 'var',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Found extensively in processed foods. Tamari and miso are soy-derived.',
  },
  {
    id: '6', code: ALLERGEN_CODES.SES, canonicalName: 'Sesame',
    commonName: 'Sesame', family: 'seed', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Pervasive in Middle Eastern and Asian cuisine. Sesame oil is highly allergenic.',
  },
  {
    id: '7', code: ALLERGEN_CODES.MUST, canonicalName: 'Mustard',
    commonName: 'Mustard', family: 'seed', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Found in dressings, marinades, spice blends, deli meats, pickles.',
  },
  {
    id: '8', code: ALLERGEN_CODES.FISH, canonicalName: 'Fish',
    commonName: 'Fish (finfish)', family: 'seafood', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Fish sauce is a base ingredient in many Southeast and East Asian cuisines.',
  },
  {
    id: '9', code: ALLERGEN_CODES.CRUST, canonicalName: 'Crustaceans',
    commonName: 'Crustaceans (shrimp, crab, lobster)', family: 'seafood', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Shrimp paste is a base in many Southeast Asian curry pastes.',
  },
  {
    id: '10', code: ALLERGEN_CODES.MOLL, canonicalName: 'Molluscs',
    commonName: 'Molluscs (clams, oysters, squid)', family: 'seafood', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Oyster sauce is common in Chinese cooking.',
  },
  {
    id: '11', code: ALLERGEN_CODES.SULF, canonicalName: 'Sulphites',
    commonName: 'Sulphites', family: 'additive', severityProfile: 'add',
    isHealthCanadaPriority: true, isSubAllergen: false,
    cuisineRiskNotes: 'Found in wine, beer, dried fruit, deli meats, pickled foods.',
  },
  {
    id: '12', code: ALLERGEN_CODES.GLUT, canonicalName: 'Gluten sources',
    commonName: 'Gluten (barley, oats, rye, wheat)', family: 'grain', severityProfile: 'add',
    isHealthCanadaPriority: false, isSubAllergen: false,
    cuisineRiskNotes: 'Oats are inherently gluten-free but frequently cross-contaminated.',
  },
  // Tree nut parent
  {
    id: '13', code: ALLERGEN_CODES.TREE_NUT, canonicalName: 'Tree nuts',
    commonName: 'Tree nuts (all)', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: false,
  },
  // Tree nut sub-allergens
  {
    id: '14', code: ALLERGEN_CODES.TN_ALM, canonicalName: 'Almond',
    commonName: 'Almond', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Marzipan, frangipane, amaretto, and orgeat syrup are almond-derived.',
  },
  {
    id: '15', code: ALLERGEN_CODES.TN_CSH, canonicalName: 'Cashew',
    commonName: 'Cashew', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Strong cross-reactivity with pistachios (same family).',
  },
  {
    id: '16', code: ALLERGEN_CODES.TN_WAL, canonicalName: 'Walnut',
    commonName: 'Walnut', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Strong cross-reactivity with pecans (same family).',
  },
  {
    id: '17', code: ALLERGEN_CODES.TN_HAZ, canonicalName: 'Hazelnut',
    commonName: 'Hazelnut / Filbert', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Found in gianduja chocolate, Nutella-type spreads, pralines.',
  },
  {
    id: '18', code: ALLERGEN_CODES.TN_PEC, canonicalName: 'Pecan',
    commonName: 'Pecan', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Strong cross-reactivity with walnuts. Found in baked goods and pralines.',
  },
  {
    id: '19', code: ALLERGEN_CODES.TN_PST, canonicalName: 'Pistachio',
    commonName: 'Pistachio', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Found in baklava, Middle Eastern sweets, ice cream, ras el hanout.',
  },
  {
    id: '20', code: ALLERGEN_CODES.TN_BRZ, canonicalName: 'Brazil nut',
    commonName: 'Brazil nut', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'One of the most potent nut allergens. Often found in mixed nut products.',
  },
  {
    id: '21', code: ALLERGEN_CODES.TN_MAC, canonicalName: 'Macadamia nut',
    commonName: 'Macadamia', family: 'nut', severityProfile: 'ana',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Found in cookies, chocolate confections, and tropical cuisine.',
  },
  {
    id: '22', code: ALLERGEN_CODES.TN_PIN, canonicalName: 'Pine nut',
    commonName: 'Pine nut / Pignolia', family: 'nut', severityProfile: 'var',
    isHealthCanadaPriority: true, isSubAllergen: true, parentAllergenCode: ALLERGEN_CODES.TREE_NUT,
    cuisineRiskNotes: 'Found in traditional pesto. Pine nut syndrome (bitter taste) is not an allergic reaction.',
  },
]

// Key hidden names — ingredient labels that must trigger warnings
// Full synonym table lives in the database; this is the critical subset
export const KEY_HIDDEN_NAMES: Record<string, string[]> = {
  [ALLERGEN_CODES.PNUT]:   ['arachis oil', 'arachis hypogaea', 'groundnut', 'groundnut oil', 'monkey nuts'],
  [ALLERGEN_CODES.MILK]:   ['casein', 'caseinate', 'whey', 'lactalbumin', 'lactoglobulin', 'ghee', 'lactulose'],
  [ALLERGEN_CODES.EGG]:    ['albumin', 'ovalbumin', 'ovomucoid', 'lysozyme', 'mayonnaise', 'meringue'],
  [ALLERGEN_CODES.WHEAT]:  ['semolina', 'spelt', 'kamut', 'einkorn', 'emmer', 'durum', 'triticale', 'seitan'],
  [ALLERGEN_CODES.SOY]:    ['edamame', 'miso', 'tofu', 'tempeh', 'tamari', 'shoyu', 'textured vegetable protein', 'tvp'],
  [ALLERGEN_CODES.SES]:    ['tahini', 'tahina', 'gingelly oil', 'til', 'teel', 'benne', 'gomashio'],
  [ALLERGEN_CODES.MUST]:   ['mustard seed', 'mustard flour', 'mustard oil', 'sinapis'],
  [ALLERGEN_CODES.FISH]:   ['worcestershire sauce', 'fish sauce', 'nam pla', 'nuoc mam', 'isinglass', 'anchovies'],
  [ALLERGEN_CODES.CRUST]:  ['shrimp paste', 'belacan', 'kapi', 'terasi', 'prawn crackers'],
  [ALLERGEN_CODES.MOLL]:   ['oyster sauce', 'squid ink'],
  [ALLERGEN_CODES.TN_ALM]: ['marzipan', 'frangipane', 'amaretto', 'orgeat'],
  [ALLERGEN_CODES.TN_CSH]: ['kaju', 'anacardium'],
  [ALLERGEN_CODES.TN_HAZ]: ['filbert', 'cobnut', 'gianduja', 'praline'],
}

export function getAllergenByCode(code: string): Allergen | undefined {
  return ALLERGENS.find((a) => a.code === code)
}

export function getTreeNutAllergens(): Allergen[] {
  return ALLERGENS.filter((a) => a.isSubAllergen && a.parentAllergenCode === ALLERGEN_CODES.TREE_NUT)
}

export function expandAllergenCodes(codes: string[]): string[] {
  const expanded = new Set(codes)
  if (expanded.has(ALLERGEN_CODES.TREE_NUT)) {
    getTreeNutAllergens().forEach((a) => expanded.add(a.code))
  }
  return Array.from(expanded)
}
