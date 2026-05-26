import Link from 'next/link'
import SearchForm from '../components/SearchForm'
import PlaceCard from '../components/PlaceCard'
import { searchPlaces } from '../lib/api'

export default async function HomePage() {
  const recent = await searchPlaces({ limit: 6 }).catch(() => ({
    places: [], total: 0, limit: 6, offset: 0,
  }))

  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-center px-5 sm:px-8 pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10">

        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute rounded-full opacity-[0.15] blur-[60px]
                          w-[180px] h-[180px] -top-12 -left-12
                          sm:w-[250px] sm:h-[250px]
                          md:w-[300px] md:h-[300px] md:-top-16 md:-left-16
                          bg-brand-green" />
          <div className="absolute rounded-full opacity-[0.15] blur-[60px]
                          w-[160px] h-[160px] -top-8 -right-8
                          sm:w-[200px] sm:h-[200px]
                          md:w-[250px] md:h-[250px] md:-top-12 md:-right-12
                          bg-brand-amber" />
          <div className="hidden sm:block absolute rounded-full opacity-[0.15] blur-[60px]
                          w-[160px] h-[160px] bottom-0 left-1/2 -translate-x-1/2
                          md:w-[200px] md:h-[200px]
                          bg-brand-orange" />
        </div>

        <div className="relative max-w-[920px] mx-auto">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip mb-5 sm:mb-6
                          bg-[#FFF0E6] border border-[#F5C9A0] text-brand-orange">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-blink" />
            <span className="font-nunito-sans font-semibold text-[12px] sm:text-[13px]">
              Live community updates
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-nunito font-black text-[28px] sm:text-[36px] md:text-[44px]
                         leading-tight tracking-[-0.5px] md:tracking-[-1px]
                         text-ink-heading mb-3 sm:mb-4">
            Find{' '}
            <span className="relative inline-block text-brand-green">
              allergy-safe
              <span
                className="absolute left-0 right-0 bottom-0.5 rounded-sm -z-10"
                style={{ height: '6px', background: '#A8EDD6' }}
              />
            </span>
            {' '}food in Toronto
          </h1>

          {/* Subtext */}
          <p className="font-nunito-sans text-[14px] sm:text-[15px] md:text-[16px]
                        text-ink-muted max-w-[440px] mx-auto mb-6 sm:mb-8 leading-relaxed">
            Community-sourced allergen information for restaurants across the city.
          </p>

          {/* Search box */}
          <div className="max-w-[680px] mx-auto bg-surface-card rounded-[20px] sm:rounded-[24px]
                          border-2 border-surface-border p-4 sm:p-5 md:p-6">
            <SearchForm />
          </div>

        </div>
      </section>

      {/* ── Recently Added ───────────────────────────────────────── */}
      {recent.places.length > 0 && (
        <section className="max-w-[920px] mx-auto px-5 sm:px-8 mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-nunito font-black text-[17px] sm:text-[18px] md:text-[20px] text-ink-heading">
              Recently added
            </h2>
            <Link
              href="/search"
              className="font-nunito-sans font-semibold text-[12px] sm:text-[13px]
                         px-[14px] py-[5px] sm:py-[8px] rounded-chip
                         bg-safe-bg text-safe-text hover:opacity-80 transition-opacity"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 gap-3 md:gap-[14px]">
            {recent.places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Strip ────────────────────────────────────────────── */}
      <section className="max-w-[920px] mx-auto px-5 sm:px-8 mt-8 sm:mt-10 mb-10 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-[14px]">

          {/* Add a place */}
          <div className="rounded-[22px] bg-brand-green p-5 sm:p-6 md:p-7">
            <div className="text-[32px] mb-3 leading-none">📍</div>
            <h3 className="font-nunito font-black text-[16px] sm:text-[17px] md:text-[19px] text-white mb-2">
              Add a restaurant
            </h3>
            <p className="font-nunito-sans text-[13px] text-white/80 mb-4 leading-relaxed">
              Share your experience and help other families find safe options.
            </p>
            <Link
              href="/places/new"
              className="inline-block font-nunito font-extrabold text-[13px]
                         px-[18px] py-[10px] sm:py-[7px] rounded-[14px] text-white
                         bg-white/20 border-2 border-white/40 hover:bg-white/35 transition-all"
            >
              Add a place
            </Link>
          </div>

          {/* Language cards */}
          <div className="rounded-[22px] bg-brand-orange p-5 sm:p-6 md:p-7">
            <div className="text-[32px] mb-3 leading-none">🌍</div>
            <h3 className="font-nunito font-black text-[16px] sm:text-[17px] md:text-[19px] text-white mb-2">
              Language cards
            </h3>
            <p className="font-nunito-sans text-[13px] text-white/80 mb-4 leading-relaxed">
              Print allergen cards in the language of your restaurant — no translation needed.
            </p>
            <Link
              href="/language-cards"
              className="inline-block font-nunito font-extrabold text-[13px]
                         px-[18px] py-[10px] sm:py-[7px] rounded-[14px] text-white
                         bg-white/20 border-2 border-white/40 hover:bg-white/35 transition-all"
            >
              Browse cards
            </Link>
          </div>

        </div>
      </section>

    </main>
  )
}
