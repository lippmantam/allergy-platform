'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ALLERGENS = [
  { code: 'PNUT',   label: 'Peanut',       emoji: '🥜' },
  { code: 'MILK',   label: 'Dairy',        emoji: '🥛' },
  { code: 'EGG',    label: 'Egg',          emoji: '🥚' },
  { code: 'WHEAT',  label: 'Wheat/Gluten', emoji: '🌾' },
  { code: 'SOY',    label: 'Soy',          emoji: '🫘' },
  { code: 'SES',    label: 'Sesame',       emoji: '🌿' },
  { code: 'FISH',   label: 'Fish',         emoji: '🐟' },
  { code: 'CRUST',  label: 'Shellfish',    emoji: '🦐' },
  { code: 'TN-CSH', label: 'Cashew',       emoji: '🌰' },
  { code: 'TN-ALM', label: 'Almond',       emoji: '🌰' },
  { code: 'TN-WAL', label: 'Walnut',       emoji: '🌰' },
  { code: 'MUST',   label: 'Mustard',      emoji: '🌻' },
]

type Props = {
  initialQ?:        string
  initialAllergens?: string[]
}

export default function SearchForm({ initialQ = '', initialAllergens = [] }: Props) {
  const router = useRouter()
  const [q, setQ]           = useState(initialQ)
  const [selected, setSelected] = useState<Set<string>>(new Set(initialAllergens))

  function toggle(code: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (selected.size) params.set('allergens', [...selected].join(','))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="space-y-4">

      {/* Input + button row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Restaurant name, cuisine, neighbourhood…"
          className="flex-1 border-2 border-surface-border rounded-[14px] px-4
                     py-2.5 text-[16px] sm:text-[15px] font-nunito-sans font-semibold
                     bg-surface-bg text-ink-primary placeholder:text-ink-faint
                     focus:outline-none focus:border-brand-green transition-colors"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-dark
                     text-white font-nunito font-extrabold text-[15px]
                     px-6 py-3 sm:py-2.5 rounded-[14px]
                     hover:scale-[1.02] transition-all"
        >
          Let&apos;s go!
        </button>
      </div>

      {/* Allergen chips */}
      <div>
        <p className="font-nunito-sans font-bold text-[11px] uppercase tracking-[1.2px]
                      text-ink-subtle mb-2.5">
          Filter — must accommodate all selected
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {ALLERGENS.map(({ code, label, emoji }) => {
            const on = selected.has(code)
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggle(code)}
                className={`
                  flex items-center gap-1.5
                  font-nunito font-bold text-[12px] sm:text-[13px]
                  px-[10px] sm:px-[13px] py-[6px] sm:py-[5px] rounded-chip
                  border-2 transition-all
                  ${on
                    ? 'bg-brand-green border-brand-green text-white scale-[1.04]'
                    : 'bg-surface-bg border-surface-border text-ink-muted hover:border-brand-green hover:text-brand-green hover:scale-[1.04]'
                  }
                `}
              >
                <span className="text-[15px] sm:text-[16px] leading-none" aria-hidden="true">
                  {emoji}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

    </form>
  )
}
