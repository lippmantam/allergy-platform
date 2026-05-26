'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const COMMON_ALLERGENS = [
  { code: 'PNUT', label: 'Peanut' },
  { code: 'MILK', label: 'Dairy' },
  { code: 'EGG', label: 'Egg' },
  { code: 'WHEAT', label: 'Wheat/Gluten' },
  { code: 'SOY', label: 'Soy' },
  { code: 'SES', label: 'Sesame' },
  { code: 'FISH', label: 'Fish' },
  { code: 'CRUST', label: 'Shellfish' },
  { code: 'MOLL', label: 'Molluscs' },
  { code: 'TN-CSH', label: 'Cashew' },
  { code: 'TN-ALM', label: 'Almond' },
  { code: 'TN-WAL', label: 'Walnut' },
  { code: 'MUST', label: 'Mustard' },
]

type Props = {
  initialQ?: string
  initialAllergens?: string[]
}

export default function SearchForm({ initialQ = '', initialAllergens = [] }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
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
      <div className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Restaurant name, cuisine, neighbourhood…"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Search
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Filter — must accommodate all selected allergens
        </p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ALLERGENS.map(({ code, label }) => {
            const on = selected.has(code)
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggle(code)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  on
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-teal-400'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </form>
  )
}
