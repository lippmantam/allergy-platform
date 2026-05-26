'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPlace, upsertPlaceAllergen } from '../../../lib/api'

const CUISINE_TYPES = [
  'American', 'Burgers/American', 'Café/Brunch', 'Canadian', 'Canadian Gastropub',
  'Chinese/Dim Sum', 'Greek', 'Indian', 'Indian Vegan', 'Italian', 'Italian Pizza',
  'Japanese', 'Japanese Ramen', 'Lebanese', 'Mexican', 'Mexican Taqueria',
  'Middle Eastern', 'Modern Middle Eastern', 'North Indian', 'Plant-Based Fine Dining',
  'Seafood/Mediterranean', 'Thai', 'Tibetan/Nepali', 'Vegan Fast-Casual',
  'Vegetarian/Vegan', 'Vietnamese', 'Vietnamese/Fusion', 'Other',
]

const ALLERGEN_OPTIONS = [
  { code: 'PNUT', label: 'Peanut' },
  { code: 'MILK', label: 'Dairy/Milk' },
  { code: 'EGG', label: 'Egg' },
  { code: 'WHEAT', label: 'Wheat/Gluten' },
  { code: 'SOY', label: 'Soy' },
  { code: 'SES', label: 'Sesame' },
  { code: 'FISH', label: 'Fish' },
  { code: 'CRUST', label: 'Crustacean/Shellfish' },
  { code: 'MOLL', label: 'Molluscs' },
  { code: 'MUST', label: 'Mustard' },
  { code: 'SULF', label: 'Sulphites' },
  { code: 'TN-ALM', label: 'Almond' },
  { code: 'TN-CSH', label: 'Cashew' },
  { code: 'TN-WAL', label: 'Walnut' },
  { code: 'TN-HAZ', label: 'Hazelnut' },
]

type AllergenEntry = {
  allergenCode: string
  accommodationLevel: string
  notes: string
}

export default function NewPlacePage() {
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'allergens' | 'done'>('info')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 fields
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [hours, setHours] = useState('')
  const [allergenAware, setAllergenAware] = useState('unknown')

  // Step 2 allergens
  const [allergens, setAllergens] = useState<AllergenEntry[]>([])
  const [createdPlaceId, setCreatedPlaceId] = useState<string | null>(null)

  function addAllergen(code: string) {
    if (allergens.find((a) => a.allergenCode === code)) return
    setAllergens((prev) => [
      ...prev,
      { allergenCode: code, accommodationLevel: 'aware', notes: '' },
    ])
  }

  function removeAllergen(code: string) {
    setAllergens((prev) => prev.filter((a) => a.allergenCode !== code))
  }

  function updateAllergen(code: string, field: keyof AllergenEntry, value: string) {
    setAllergens((prev) =>
      prev.map((a) => (a.allergenCode === code ? { ...a, [field]: value } : a)),
    )
  }

  async function submitInfo(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const place = await createPlace({
        name,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        cuisineType,
        phone: phone || undefined,
        website: website || undefined,
        hours: hours || undefined,
        allergenAware,
      })
      setCreatedPlaceId(place.id)
      setStep('allergens')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save place')
    } finally {
      setSaving(false)
    }
  }

  async function submitAllergens(e: React.FormEvent) {
    e.preventDefault()
    if (!createdPlaceId) return
    setError(null)
    setSaving(true)
    try {
      await Promise.all(
        allergens.map((a) =>
          upsertPlaceAllergen(createdPlaceId, {
            allergenCode: a.allergenCode,
            accommodationLevel: a.accommodationLevel,
            dedicatedKitchen: false,
            sharedFryerRisk: false,
            staffTrainingLevel: 'none',
            confidenceLevel: 'low',
            notes: a.notes || null,
          }),
        ),
      )
      router.push(`/places/${createdPlaceId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save allergens')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a place</h1>
      <p className="text-gray-500 text-sm mb-8">
        Help the community by recording a restaurant's allergen accommodations.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(['info', 'allergens'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-gray-200" />}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === s
                  ? 'bg-teal-600 text-white'
                  : createdPlaceId
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${step === s ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {s === 'info' ? 'Place info' : 'Allergens'}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {step === 'info' && (
        <form onSubmit={submitInfo} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Trattoria Napoli"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full address *</label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 593 College St, Toronto, ON M6G 1B2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
              <input
                required
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="43.6532"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
              <input
                required
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="-79.3832"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 -mt-2">Find coordinates at maps.google.com → right-click the location.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine type *</label>
            <select
              required
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">Select cuisine…</option>
              {CUISINE_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergen awareness</label>
            <select
              value={allergenAware}
              onChange={(e) => setAllergenAware(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="unknown">Unknown</option>
              <option value="yes">Yes — staff are trained and aware</option>
              <option value="no">No — no allergen accommodations</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="416-555-0100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="https://…"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Daily 11am–10pm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : 'Continue to allergens →'}
          </button>
        </form>
      )}

      {step === 'allergens' && (
        <form onSubmit={submitAllergens} className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Which allergens does this place accommodate?
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ALLERGEN_OPTIONS.map(({ code, label }) => {
                const added = allergens.some((a) => a.allergenCode === code)
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => (added ? removeAllergen(code) : addAllergen(code))}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      added
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-teal-400'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {allergens.length > 0 && (
              <div className="space-y-3">
                {allergens.map((a) => (
                  <div key={a.allergenCode} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-semibold text-gray-800">{a.allergenCode}</span>
                      <button
                        type="button"
                        onClick={() => removeAllergen(a.allergenCode)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={a.accommodationLevel}
                        onChange={(e) => updateAllergen(a.allergenCode, 'accommodationLevel', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="aware">Staff aware</option>
                        <option value="menu_options">Menu options available</option>
                        <option value="dedicated_section">Dedicated allergen-free section</option>
                      </select>
                      <input
                        value={a.notes}
                        onChange={(e) => updateAllergen(a.allergenCode, 'notes', e.target.value)}
                        placeholder="Optional notes…"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push(`/places/${createdPlaceId}`)}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:border-gray-400 transition-colors"
            >
              Skip — add later
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save place'}
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
