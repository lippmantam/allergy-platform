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
  { code: 'PNUT',   label: 'Peanut' },
  { code: 'MILK',   label: 'Dairy/Milk' },
  { code: 'EGG',    label: 'Egg' },
  { code: 'WHEAT',  label: 'Wheat/Gluten' },
  { code: 'SOY',    label: 'Soy' },
  { code: 'SES',    label: 'Sesame' },
  { code: 'FISH',   label: 'Fish' },
  { code: 'CRUST',  label: 'Shellfish' },
  { code: 'MOLL',   label: 'Molluscs' },
  { code: 'MUST',   label: 'Mustard' },
  { code: 'SULF',   label: 'Sulphites' },
  { code: 'TN-ALM', label: 'Almond' },
  { code: 'TN-CSH', label: 'Cashew' },
  { code: 'TN-WAL', label: 'Walnut' },
  { code: 'TN-HAZ', label: 'Hazelnut' },
]

const INPUT = `w-full border-2 border-surface-border rounded-[14px] px-4 py-2.5
  font-nunito-sans font-semibold text-[16px] sm:text-[15px]
  bg-surface-bg text-ink-primary placeholder:text-ink-faint
  focus:outline-none focus:border-brand-green transition-colors`

const SELECT = `w-full border-2 border-surface-border rounded-[14px] px-4 py-2.5
  font-nunito-sans font-semibold text-[15px] bg-surface-bg text-ink-primary
  focus:outline-none focus:border-brand-green transition-colors`

const LABEL = 'block font-nunito-sans font-semibold text-[13px] text-ink-muted mb-1.5'

type AllergenEntry = { allergenCode: string; accommodationLevel: string; notes: string }

export default function NewPlacePage() {
  const router = useRouter()
  const [step, setStep]   = useState<'info' | 'allergens'>('info')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const [name, setName]               = useState('')
  const [address, setAddress]         = useState('')
  const [latitude, setLatitude]       = useState('')
  const [longitude, setLongitude]     = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [phone, setPhone]             = useState('')
  const [website, setWebsite]         = useState('')
  const [hours, setHours]             = useState('')
  const [allergenAware, setAllergenAware] = useState('unknown')

  const [allergens, setAllergens]         = useState<AllergenEntry[]>([])
  const [createdPlaceId, setCreatedPlaceId] = useState<string | null>(null)

  function addAllergen(code: string) {
    if (allergens.find((a) => a.allergenCode === code)) return
    setAllergens((prev) => [...prev, { allergenCode: code, accommodationLevel: 'aware', notes: '' }])
  }

  function removeAllergen(code: string) {
    setAllergens((prev) => prev.filter((a) => a.allergenCode !== code))
  }

  function updateAllergen(code: string, field: keyof AllergenEntry, value: string) {
    setAllergens((prev) => prev.map((a) => (a.allergenCode === code ? { ...a, [field]: value } : a)))
  }

  async function submitInfo(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const place = await createPlace({
        name, address,
        latitude: Number(latitude), longitude: Number(longitude),
        cuisineType,
        phone: phone || undefined, website: website || undefined,
        hours: hours || undefined, allergenAware,
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
            dedicatedKitchen: false, sharedFryerRisk: false,
            staffTrainingLevel: 'none', confidenceLevel: 'low',
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
    <main className="max-w-[680px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
      <h1 className="font-nunito font-black text-[24px] sm:text-[28px] text-ink-heading mb-1">
        Add a place
      </h1>
      <p className="font-nunito-sans text-[14px] text-ink-muted mb-8">
        Help the community by recording a restaurant&apos;s allergen accommodations.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['info', 'allergens'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            {i > 0 && <div className="w-8 h-[2px] bg-surface-border" />}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-nunito font-black text-[13px] ${
              step === s
                ? 'bg-brand-green text-white'
                : createdPlaceId
                  ? 'bg-safe-bg text-safe-text'
                  : 'bg-surface-border text-ink-subtle'
            }`}>
              {i + 1}
            </div>
            <span className={`font-nunito-sans font-semibold text-[13px] ${
              step === s ? 'text-ink-primary' : 'text-ink-subtle'
            }`}>
              {s === 'info' ? 'Place info' : 'Allergens'}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-[#FFF1F0] border-2 border-[#FFCCC7] rounded-[14px] p-3.5 font-nunito-sans text-[13px] text-[#CF1322] mb-6">
          {error}
        </div>
      )}

      {step === 'info' && (
        <form onSubmit={submitInfo} className="space-y-5">
          <div>
            <label className={LABEL}>Restaurant name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Trattoria Napoli" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Full address *</label>
            <input required value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 593 College St, Toronto, ON M6G 1B2" className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Latitude *</label>
              <input required type="number" step="any" value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="43.6532" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Longitude *</label>
              <input required type="number" step="any" value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-79.3832" className={INPUT} />
            </div>
          </div>
          <p className="font-nunito-sans text-[12px] text-ink-subtle -mt-2">
            Find coordinates at maps.google.com → right-click the location.
          </p>

          <div>
            <label className={LABEL}>Cuisine type *</label>
            <select required value={cuisineType} onChange={(e) => setCuisineType(e.target.value)}
              className={SELECT}>
              <option value="">Select cuisine…</option>
              {CUISINE_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL}>Allergen awareness</label>
            <select value={allergenAware} onChange={(e) => setAllergenAware(e.target.value)}
              className={SELECT}>
              <option value="unknown">Unknown</option>
              <option value="yes">Yes — staff are trained and aware</option>
              <option value="no">No — no allergen accommodations</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="416-555-0100" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://…" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Hours</label>
            <input value={hours} onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. Daily 11am–10pm" className={INPUT} />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all">
            {saving ? 'Saving…' : 'Continue to allergens →'}
          </button>
        </form>
      )}

      {step === 'allergens' && (
        <form onSubmit={submitAllergens} className="space-y-6">
          <div>
            <p className="font-nunito-sans font-semibold text-[13px] text-ink-muted mb-3">
              Which allergens does this place accommodate?
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ALLERGEN_OPTIONS.map(({ code, label }) => {
                const added = allergens.some((a) => a.allergenCode === code)
                return (
                  <button key={code} type="button"
                    onClick={() => (added ? removeAllergen(code) : addAllergen(code))}
                    className={`font-nunito font-bold text-[12px] sm:text-[13px] px-3 py-1.5 rounded-chip border-2 transition-all ${
                      added
                        ? 'bg-brand-green border-brand-green text-white'
                        : 'bg-surface-bg border-surface-border text-ink-muted hover:border-brand-green hover:text-brand-green'
                    }`}>
                    {label}
                  </button>
                )
              })}
            </div>

            {allergens.length > 0 && (
              <div className="space-y-3">
                {allergens.map((a) => (
                  <div key={a.allergenCode}
                    className="bg-surface-bg border-2 border-surface-border rounded-[14px] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-nunito font-extrabold text-[14px] text-ink-primary">
                        {a.allergenCode}
                      </span>
                      <button type="button" onClick={() => removeAllergen(a.allergenCode)}
                        className="font-nunito-sans text-[12px] text-ink-subtle hover:text-brand-orange transition-colors">
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <select value={a.accommodationLevel}
                        onChange={(e) => updateAllergen(a.allergenCode, 'accommodationLevel', e.target.value)}
                        className={SELECT}>
                        <option value="aware">Staff aware</option>
                        <option value="menu_options">Menu options available</option>
                        <option value="dedicated_section">Dedicated allergen-free section</option>
                      </select>
                      <input value={a.notes}
                        onChange={(e) => updateAllergen(a.allergenCode, 'notes', e.target.value)}
                        placeholder="Optional notes…" className={INPUT} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button"
              onClick={() => router.push(`/places/${createdPlaceId}`)}
              className="flex-1 border-2 border-surface-border text-ink-muted font-nunito font-bold text-[14px] py-3 rounded-[14px] hover:border-ink-subtle transition-colors">
              Skip — add later
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all">
              {saving ? 'Saving…' : 'Save place'}
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
