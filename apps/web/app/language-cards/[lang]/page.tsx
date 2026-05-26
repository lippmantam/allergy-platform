import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLanguage, SEVERITY_STYLES, LANGUAGES } from '../../../lib/language-cards'
import PrintButton from './PrintButton'

type Props = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ lang: l.code }))
}

export default async function LanguageCardsPage({ params }: Props) {
  const { lang } = await params
  const language = getLanguage(lang)
  if (!language) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header — hidden when printing */}
      <div className="print:hidden mb-6">
        <Link href="/language-cards" className="text-sm text-teal-600 hover:underline mb-4 inline-block">
          ← All languages
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{language.flag}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{language.name}</h1>
              <p className="text-gray-400">{language.nativeName}</p>
            </div>
          </div>
          <PrintButton />
        </div>
        <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Verify with a native speaker before relying on these for a severe allergy. Show the card — don't rely on verbal pronunciation alone.
        </p>
      </div>

      {/* Print header — only shown when printing */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <p className="text-lg font-bold">Allergy Cards — {language.name} {language.flag}</p>
        <p className="text-xs text-gray-500 mt-1">AllergyNav Toronto · allergy-platform.ca · Verify with a native speaker</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
        {language.cards.map((card) => {
          const style = SEVERITY_STYLES[card.severity]
          return (
            <div
              key={card.code}
              className={`border-2 ${style.border} ${style.bg} rounded-2xl p-5 print:rounded-xl print:border print:p-4 print:break-inside-avoid`}
            >
              {/* Allergen header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-wide">{card.code}</p>
                  <p className="text-sm font-medium text-gray-600">{card.englishName}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              {/* Local name */}
              <div className="mb-4">
                <p className={`text-2xl font-bold text-gray-900 leading-tight ${language.scriptType === 'cjk' || language.scriptType === 'hangul' ? 'text-3xl' : ''}`}>
                  {card.localName}
                </p>
                {card.romanization && (
                  <p className="text-sm text-gray-500 italic mt-0.5">{card.romanization}</p>
                )}
              </div>

              {/* Allergy phrase — the main show-to-server text */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Show to your server:</p>
                <p className={`font-medium text-gray-900 leading-relaxed ${language.scriptType === 'cjk' || language.scriptType === 'thai' || language.scriptType === 'hangul' ? 'text-lg' : 'text-sm'}`}>
                  {card.phrase}
                </p>
                {card.phraseRomanization && (
                  <p className="text-xs text-gray-400 italic mt-1.5 leading-relaxed">{card.phraseRomanization}</p>
                )}
              </div>

              {/* Hidden names */}
              {card.hiddenNames.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Watch for on menus / labels:</p>
                  <div className="flex flex-wrap gap-1">
                    {card.hiddenNames.map((name) => (
                      <span key={name} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-6 text-center text-xs text-gray-400 border-t pt-4">
        Community-sourced · Always verify directly · Not medical advice
      </div>
    </main>
  )
}
