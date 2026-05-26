import Link from 'next/link'
import type { Place } from '../lib/api'

// Cuisine type → top stripe color (spec §3)
const CUISINE_STRIPE: [string, string][] = [
  ['vegan',          '#2BAE82'],
  ['plant-based',    '#2BAE82'],
  ['thai',           '#E85D26'],
  ['spicy',          '#E85D26'],
  ['indian',         '#F5A623'],
  ['south asian',    '#F5A623'],
  ['café',           '#E879A0'],
  ['cafe',           '#E879A0'],
  ['brunch',         '#E879A0'],
  ['coffee',         '#E879A0'],
  ['mediterranean',  '#0EA5E9'],
  ['middle eastern', '#0EA5E9'],
  ['greek',          '#0EA5E9'],
]

function stripeColor(cuisineType: string): string {
  const lower = cuisineType.toLowerCase()
  const match = CUISINE_STRIPE.find(([key]) => lower.includes(key))
  return match ? match[1] : '#3B82F6'
}

// Cuisine type → emoji
const CUISINE_EMOJI: [string, string][] = [
  ['italian',        '🍝'],
  ['thai',           '🍜'],
  ['japanese',       '🍣'],
  ['sushi',          '🍱'],
  ['chinese',        '🥢'],
  ['korean',         '🍜'],
  ['vietnamese',     '🍜'],
  ['indian',         '🍛'],
  ['south asian',    '🍛'],
  ['mediterranean',  '🫒'],
  ['greek',          '🫒'],
  ['middle eastern', '🧆'],
  ['mexican',        '🌮'],
  ['american',       '🍔'],
  ['burger',         '🍔'],
  ['pizza',          '🍕'],
  ['french',         '🥐'],
  ['vegan',          '🌱'],
  ['plant-based',    '🌱'],
  ['café',           '☕'],
  ['cafe',           '☕'],
  ['coffee',         '☕'],
  ['brunch',         '🥞'],
]

function cuisineEmoji(cuisineType: string): string {
  const lower = cuisineType.toLowerCase()
  const match = CUISINE_EMOJI.find(([key]) => lower.includes(key))
  return match ? match[1] : '🍽️'
}

// Allergen code → readable name
const ALLERGEN_NAME: Record<string, string> = {
  PNUT:    'Peanut',
  MILK:    'Dairy',
  EGG:     'Egg',
  WHEAT:   'Wheat/Gluten',
  SOY:     'Soy',
  SES:     'Sesame',
  FISH:    'Fish',
  CRUST:   'Shellfish',
  MOLL:    'Molluscs',
  'TN-CSH': 'Cashew',
  'TN-ALM': 'Almond',
  'TN-WAL': 'Walnut',
  MUST:    'Mustard',
  TNUT:    'Tree nuts',
  SULF:    'Sulphites',
  CEL:     'Celery',
  LUP:     'Lupin',
}

// accommodation level → safe (green ✓) or warn (amber ⚠)
function isSafe(level: string): boolean {
  return level === 'dedicated_section' || level === 'menu_options'
}

type Props = { place: Place }

export default function PlaceCard({ place }: Props) {
  const stripe  = stripeColor(place.cuisineType)
  const emoji   = cuisineEmoji(place.cuisineType)
  const visibleAllergens = place.allergens.slice(0, 6)

  return (
    <Link
      href={`/places/${place.id}`}
      className="block bg-surface-card rounded-card border-2 border-surface-border overflow-hidden
                 hover:border-[#C8C0B0] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                 transition-all duration-200"
    >
      {/* Cuisine stripe */}
      <div className="h-[5px] w-full rounded-t-card" style={{ background: stripe }} />

      <div className="p-4 sm:p-[1.1rem_1.15rem_1rem]">

        {/* Cuisine emoji */}
        <div className="text-[28px] leading-none mb-1.5" aria-hidden="true">{emoji}</div>

        {/* Name */}
        <h3 className="font-nunito font-extrabold text-[14px] sm:text-[15px] text-ink-heading leading-[1.3] mb-0.5">
          {place.name}
        </h3>

        {/* Cuisine type */}
        <p className="font-nunito-sans font-semibold text-[12px] text-ink-subtle mb-0.5">
          {place.cuisineType}
        </p>

        {/* Address */}
        <p className="font-nunito-sans text-[11.5px] text-ink-faint truncate">
          {place.address}
        </p>

        {/* Allergen tags */}
        {visibleAllergens.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dashed border-[#F0EAD6]">
            <div className="flex flex-wrap gap-[5px]">
              {visibleAllergens.map((a) => {
                const safe = isSafe(a.accommodationLevel)
                return (
                  <span
                    key={a.allergenCode}
                    className={`inline-flex items-center font-nunito font-bold text-[11px]
                                px-[9px] py-[2px] rounded-tag
                                ${safe
                                  ? 'bg-safe-bg text-safe-text'
                                  : 'bg-warn-bg text-warn-text'
                                }`}
                  >
                    {safe ? '✓' : '⚠'}{' '}
                    {ALLERGEN_NAME[a.allergenCode] ?? a.allergenCode}
                  </span>
                )
              })}
              {place.allergens.length > 6 && (
                <span className="font-nunito-sans text-[11px] text-ink-subtle self-center">
                  +{place.allergens.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </Link>
  )
}
