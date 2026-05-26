import SearchForm from '../components/SearchForm'
import { searchPlaces } from '../lib/api'

export default async function HomePage() {
  const recent = await searchPlaces({ limit: 6 }).catch(() => ({ places: [], total: 0, limit: 6, offset: 0 }))

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Find allergy-safe food in Toronto
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Community-sourced allergen information for restaurants across the city.
          Search by cuisine or filter by your allergens.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-12">
        <SearchForm />
      </div>

      {recent.places.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Recently added
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recent.places.map((place) => (
              <a
                key={place.id}
                href={`/places/${place.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-900 truncate">{place.name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{place.cuisineType}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{place.address}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border-t border-gray-100 pt-12">
        {[
          { n: '25', label: 'Places listed' },
          { n: '13', label: 'Allergens tracked' },
          { n: 'Free', label: 'Always' },
        ].map(({ n, label }) => (
          <div key={label}>
            <p className="text-2xl font-bold text-teal-700">{n}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
