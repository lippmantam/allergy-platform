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
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No places found.</p>
        <p className="text-sm mt-2">Try a different search or fewer allergen filters.</p>
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
      <p className="text-sm text-gray-500 mb-4">
        {result.total} place{result.total !== 1 ? 's' : ''} found
        {q ? ` for "${q}"` : ''}
        {allergens.length > 0 ? ` · filtering for ${allergens.join(', ')}` : ''}
      </p>

      <div className="space-y-3">
        {result.places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {result.total > 20 && (
        <div className="flex justify-between mt-6">
          {offset > 0 ? (
            <a href={buildUrl(prevOffset)} className="text-sm text-teal-600 hover:underline">
              ← Previous
            </a>
          ) : <span />}
          {nextOffset < result.total && (
            <a href={buildUrl(nextOffset)} className="text-sm text-teal-600 hover:underline">
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
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Search places</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8">
        <SearchForm initialQ={q} initialAllergens={allergens} />
      </div>

      <Suspense fallback={<p className="text-gray-400 text-sm">Loading…</p>}>
        <Results q={q} allergens={allergens} offset={offset} />
      </Suspense>
    </main>
  )
}
