import Link from 'next/link'
import { LANGUAGES } from '../../lib/language-cards'

export default function LanguageCardsIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Allergy language cards</h1>
        <p className="mt-2 text-gray-500">
          Print or show these cards to communicate your allergy at restaurants in any language.
          Each card includes the allergy phrase, local names, and common hidden sources.
        </p>
        <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          These translations are for guidance only. Verify with a native speaker before relying on them for a severe allergy.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {LANGUAGES.map((lang) => (
          <Link
            key={lang.code}
            href={`/language-cards/${lang.code}`}
            className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all"
          >
            <div className="text-3xl mb-3">{lang.flag}</div>
            <p className="font-semibold text-gray-900 group-hover:text-teal-700">{lang.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">{lang.nativeName}</p>
            <p className="text-xs text-gray-400 mt-3">{lang.cards.length} allergens</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
