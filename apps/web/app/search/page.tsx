import { Suspense } from 'react'
import SearchForm from '../../components/SearchForm'
import PlaceCard from '../../components/PlaceCard'
import { searchPlaces } from '../../lib/api'

type Props = {
  searchParams: Promise<{ q?: string; allergens?: string; offset?: string }>
}

async function Results({ q, allergens, offset }: { q: string; allergens: string[]; offset: number }) {
  const result = await searchPlaces({ q, allergens, offset, limit: 20 })

  if (result.places.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-nunito font-black text-[18px] text-ink-heading mb-2">No places found</p>
        <p className="font-nunito-sans text-[14px] text-ink-muted">
          Try a different search or fewer allergen filters.
        </p>
      </div>
    )
  }

  const prevOffset = Math.max(offset - 20, 0)
  const nextOffset = offset + 20

  const buildUrl = (o: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (allergens.length) params.set('allergens', allergens.join(','))
    params.set('offset', String(o))
    return `/search?${params.toString()}`
  }

  return (
    <div>
      <p className="font-nunito-sans text-[13px] text-ink-muted mb-4">
        {result.total} place{result.total !== 1 ? 's' : ''} found
        {q ? ` for "${q}"` : ''}
        {allergens.length > 0 ? ` · filtering for ${allergens.join(', ')}` : ''}
      </p>

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 gap-3 md:gap-[14px]">
        {result.places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {result.total > 20 && (
        <div className="flex justify-between mt-8">
          {offset > 0 ? (
            <a href={buildUrl(prevOffset)}
              className="font-nunito-sans font-semibold text-[13px] text-brand-green hover:text-brand-green-dark transition-colors">
              ← Previous
            </a>
          ) : <span />}
          {nextOffset < result.total && (
            <a href={buildUrl(nextOffset)}
              className="font-nunito-sans font-semibold text-[13px] text-brand-green hover:text-brand-green-dark transition-colors">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const q = params.q ?? ''
  const allergens = params.allergens ? params.allergens.split(',').filter(Boolean) : []
  const offset = Number(params.offset ?? '0')

  return (
    <main className="max-w-[920px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
      <h1 className="font-nunito font-black text-[20px] sm:text-[24px] text-ink-heading mb-6">
        Search places
      </h1>

      <div className="bg-surface-card rounded-[20px] sm:rounded-[24px] border-2 border-surface-border p-4 sm:p-5 md:p-6 mb-8">
        <SearchForm initialQ={q} initialAllergens={allergens} />
      </div>

      <Suspense fallback={
        <p className="font-nunito-sans text-[13px] text-ink-muted">Loading…</p>
      }>
        <Results q={q} allergens={allergens} offset={offset} />
      </Suspense>
    </main>
  )
}
