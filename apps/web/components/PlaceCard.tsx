import Link from 'next/link'
import type { Place } from '../lib/api'

const AWARE_STYLES: Record<string, { dot: string; label: string }> = {
  yes: { dot: 'bg-green-500', label: 'Allergen aware' },
  no: { dot: 'bg-red-400', label: 'Not allergen aware' },
  unknown: { dot: 'bg-gray-400', label: 'Unknown' },
}

const LEVEL_COLORS: Record<string, string> = {
  dedicated_section: 'bg-green-100 text-green-800',
  menu_options: 'bg-blue-100 text-blue-800',
  aware: 'bg-yellow-100 text-yellow-800',
}

type Props = { place: Place }

export default function PlaceCard({ place }: Props) {
  const aware = AWARE_STYLES[place.allergenAware] ?? AWARE_STYLES.unknown

  return (
    <Link
      href={`/places/${place.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
          <p className="text-sm text-gray-500 truncate">{place.address}</p>
        </div>
        <span className="shrink-0 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {place.cuisineType}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${aware.dot}`} />
        <span className="text-xs text-gray-600">{aware.label}</span>
        {place.hours && (
          <span className="ml-auto text-xs text-gray-400 truncate">{place.hours}</span>
        )}
      </div>

      {place.allergens.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {place.allergens.slice(0, 6).map((a) => (
            <span
              key={a.allergenCode}
              className={`text-xs font-mono px-1.5 py-0.5 rounded ${LEVEL_COLORS[a.accommodationLevel] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {a.allergenCode}
            </span>
          ))}
          {place.allergens.length > 6 && (
            <span className="text-xs text-gray-400">+{place.allergens.length - 6} more</span>
          )}
        </div>
      )}
    </Link>
  )
}
