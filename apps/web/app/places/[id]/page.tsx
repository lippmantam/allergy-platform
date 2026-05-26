import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPlace, getReports, getReviews } from '../../../lib/api'
import AllergenBadge from '../../../components/AllergenBadge'
import CommunitySection from '../../../components/CommunitySection'

const AWARE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  yes: { bg: 'bg-green-100', text: 'text-green-800', label: 'Allergen aware' },
  no: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not allergen aware' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Awareness unknown' },
}

const ACCOMMODATION_ORDER = ['dedicated_section', 'menu_options', 'aware']

type Props = { params: Promise<{ id: string }> }

export default async function PlaceDetailPage({ params }: Props) {
  const { id } = await params
  const [place, reportsData, reviewsData] = await Promise.all([
    getPlace(id).catch(() => null),
    getReports(id).catch(() => ({ reports: [], total: 0 })),
    getReviews(id).catch(() => ({ reviews: [], total: 0 })),
  ])

  if (!place) notFound()

  const aware = AWARE_BADGE[place.allergenAware] ?? AWARE_BADGE.unknown

  const sortedAllergens = [...place.allergens].sort(
    (a, b) =>
      ACCOMMODATION_ORDER.indexOf(a.accommodationLevel) -
      ACCOMMODATION_ORDER.indexOf(b.accommodationLevel),
  )

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/search" className="text-sm text-teal-600 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{place.name}</h1>
            <p className="text-gray-500 mt-1">{place.address}</p>
            <p className="text-sm text-gray-400 mt-0.5">{place.cuisineType}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${aware.bg} ${aware.text}`}>
            {aware.label}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
          {place.hours && (
            <div>
              <span className="font-medium text-gray-900">Hours</span>
              <p>{place.hours}</p>
            </div>
          )}
          {place.phone && (
            <div>
              <span className="font-medium text-gray-900">Phone</span>
              <p>
                <a href={`tel:${place.phone}`} className="text-teal-600 hover:underline">
                  {place.phone}
                </a>
              </p>
            </div>
          )}
          {place.website && (
            <div>
              <span className="font-medium text-gray-900">Website</span>
              <p>
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                  Visit website
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Allergen accommodations */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Allergen accommodations</h2>
          <span className="text-xs text-gray-400">{place.allergens.length} tracked</span>
        </div>

        {sortedAllergens.length === 0 ? (
          <p className="text-sm text-gray-400">No allergen data recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sortedAllergens.map((a) => (
              <AllergenBadge
                key={a.allergenCode}
                allergenCode={a.allergenCode}
                accommodationLevel={a.accommodationLevel}
                notes={a.notes}
              />
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-gray-100 pt-4 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-green-300" /> Dedicated section
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-blue-300" /> Menu options
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-yellow-300" /> Staff aware
          </span>
        </div>
      </section>

      {/* Community reports & reviews */}
      <CommunitySection
        placeId={place.id}
        initialReports={reportsData.reports}
        initialReviews={reviewsData.reviews}
      />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Always verify directly with the restaurant.</strong> This information is
        community-sourced and may be outdated. Cross-contamination risk varies. Do not rely solely
        on this platform for life-threatening allergies.
      </div>

      {/* Add to this place */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Know something we don&apos;t?</p>
        <Link
          href={`/places/${place.id}/edit`}
          className="text-sm text-teal-600 hover:underline"
        >
          Suggest an update
        </Link>
      </div>
    </main>
  )
}
