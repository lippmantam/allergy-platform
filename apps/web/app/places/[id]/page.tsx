import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPlace, getReports, getReviews } from '../../../lib/api'
import AllergenBadge from '../../../components/AllergenBadge'
import CommunitySection from '../../../components/CommunitySection'

const AWARE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  yes:     { bg: 'bg-safe-bg',    text: 'text-safe-text',   label: 'Allergen aware' },
  no:      { bg: 'bg-warn-bg',    text: 'text-warn-text',   label: 'Not allergen aware' },
  unknown: { bg: 'bg-surface-border', text: 'text-ink-muted', label: 'Awareness unknown' },
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
    <main className="max-w-[720px] mx-auto px-5 sm:px-8 py-8 sm:py-10">

      <Link
        href="/search"
        className="inline-block font-nunito-sans font-semibold text-[13px] text-brand-green hover:text-brand-green-dark mb-6 transition-colors"
      >
        ← Back to search
      </Link>

      {/* Header card */}
      <div className="bg-surface-card rounded-card border-2 border-surface-border p-5 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-nunito font-black text-[22px] sm:text-[26px] text-ink-heading leading-tight">
              {place.name}
            </h1>
            <p className="font-nunito-sans text-[14px] text-ink-muted mt-1">{place.address}</p>
            <p className="font-nunito-sans text-[13px] text-ink-subtle mt-0.5">{place.cuisineType}</p>
          </div>
          <span className={`font-nunito font-bold text-[12px] px-3 py-1.5 rounded-chip ${aware.bg} ${aware.text}`}>
            {aware.label}
          </span>
        </div>

        {(place.hours || place.phone || place.website) && (
          <div className="mt-5 pt-4 border-t border-dashed border-surface-nav flex flex-wrap gap-5 font-nunito-sans text-[13px] text-ink-muted">
            {place.hours && (
              <div>
                <span className="font-semibold text-ink-primary block">Hours</span>
                {place.hours}
              </div>
            )}
            {place.phone && (
              <div>
                <span className="font-semibold text-ink-primary block">Phone</span>
                <a href={`tel:${place.phone}`} className="text-brand-green hover:text-brand-green-dark transition-colors">
                  {place.phone}
                </a>
              </div>
            )}
            {place.website && (
              <div>
                <span className="font-semibold text-ink-primary block">Website</span>
                <a href={place.website} target="_blank" rel="noopener noreferrer"
                  className="text-brand-green hover:text-brand-green-dark transition-colors">
                  Visit website
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Allergen accommodations */}
      <div className="bg-surface-card rounded-card border-2 border-surface-border p-5 sm:p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-nunito font-black text-[16px] text-ink-heading">
            Allergen accommodations
          </h2>
          <span className="font-nunito-sans text-[12px] text-ink-subtle">
            {place.allergens.length} tracked
          </span>
        </div>

        {sortedAllergens.length === 0 ? (
          <p className="font-nunito-sans text-[13px] text-ink-muted">No allergen data recorded yet.</p>
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

        <div className="mt-4 pt-4 border-t border-dashed border-surface-nav flex flex-wrap gap-4 font-nunito-sans text-[12px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-safe-bg border border-safe-text/30" /> Dedicated section
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#DBEAFE] border border-brand-blue/30" /> Menu options
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-warn-bg border border-warn-text/30" /> Staff aware
          </span>
        </div>
      </div>

      {/* Community reports & reviews */}
      <CommunitySection
        placeId={place.id}
        initialReports={reportsData.reports}
        initialReviews={reviewsData.reviews}
      />

      {/* Safety disclaimer */}
      <div className="bg-warn-bg border-2 border-brand-amber/40 rounded-[14px] p-4 font-nunito-sans text-[13px] text-warn-text mt-4">
        <strong className="font-bold">Always verify directly with the restaurant.</strong>{' '}
        This information is community-sourced and may be outdated. Cross-contamination risk varies.
        Do not rely solely on this platform for life-threatening allergies.
      </div>

      {/* Suggest update */}
      <div className="mt-6 text-center">
        <p className="font-nunito-sans text-[13px] text-ink-muted mb-1.5">Know something we don&apos;t?</p>
        <Link
          href={`/places/${place.id}/edit`}
          className="font-nunito-sans font-semibold text-[13px] text-brand-green hover:text-brand-green-dark transition-colors"
        >
          Suggest an update
        </Link>
      </div>

    </main>
  )
}
