import type { AllergenCrossReactivity } from '../types/allergen.js'
import { ALLERGEN_CODES } from '../constants/allergen-codes.js'

export const CROSS_REACTIVITIES: AllergenCrossReactivity[] = [
  {
    id: '1',
    allergenCodeA: ALLERGEN_CODES.TN_CSH,
    allergenCodeB: ALLERGEN_CODES.TN_PST,
    confidenceLevel: 'established',
    clinicalNotes: 'Both are in the Anacardiaceae family. Cross-reactivity is well documented.',
  },
  {
    id: '2',
    allergenCodeA: ALLERGEN_CODES.TN_WAL,
    allergenCodeB: ALLERGEN_CODES.TN_PEC,
    confidenceLevel: 'established',
    clinicalNotes: 'Both are in the Juglandaceae family. Cross-reactivity is well documented.',
  },
  {
    id: '3',
    allergenCodeA: ALLERGEN_CODES.PNUT,
    allergenCodeB: ALLERGEN_CODES.SOY,
    confidenceLevel: 'probable',
    clinicalNotes: 'Both are legumes. Cross-reactivity is possible but not universal.',
  },
  {
    id: '4',
    allergenCodeA: ALLERGEN_CODES.MUST,
    allergenCodeB: ALLERGEN_CODES.SOY,
    confidenceLevel: 'possible',
    clinicalNotes: 'Health Canada notes possible cross-reactivity with canola proteins.',
  },
  {
    id: '5',
    allergenCodeA: ALLERGEN_CODES.FISH,
    allergenCodeB: ALLERGEN_CODES.CRUST,
    confidenceLevel: 'possible',
    clinicalNotes: 'Species-dependent. Allergy to one does not guarantee allergy to the other.',
  },
]

export function getCrossReactivitiesForAllergen(code: string): AllergenCrossReactivity[] {
  return CROSS_REACTIVITIES.filter(
    (cr) => cr.allergenCodeA === code || cr.allergenCodeB === code
  )
}
