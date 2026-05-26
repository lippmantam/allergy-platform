'use client'

import { useState } from 'react'
import { createReport, type CreateReportInput } from '../lib/api'

const ALLERGEN_OPTIONS = [
  { code: 'PNUT', label: 'Peanut' },
  { code: 'MILK', label: 'Dairy' },
  { code: 'EGG', label: 'Egg' },
  { code: 'WHEAT', label: 'Wheat/Gluten' },
  { code: 'SOY', label: 'Soy' },
  { code: 'SES', label: 'Sesame' },
  { code: 'FISH', label: 'Fish' },
  { code: 'CRUST', label: 'Shellfish' },
  { code: 'MOLL', label: 'Molluscs' },
  { code: 'MUST', label: 'Mustard' },
  { code: 'TN-ALM', label: 'Almond' },
  { code: 'TN-CSH', label: 'Cashew' },
  { code: 'TN-WAL', label: 'Walnut' },
]

type Props = {
  placeId: string
  token: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ReportForm({ placeId, token, onSuccess, onCancel }: Props) {
  const [allergensConfirmed, setAllergensConfirmed] = useState<Set<string>>(new Set())
  const [reactionStatus, setReactionStatus] = useState('none')
  const [verificationMethod, setVerificationMethod] = useState('staff_conversation')
  const [visitDate, setVisitDate] = useState('')
  const [partyType, setPartyType] = useState('adult')
  const [severityLevel, setSeverityLevel] = useState('allergy')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleAllergen(code: string) {
    setAllergensConfirmed((prev) => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!visitDate) { setError('Visit date is required'); return }
    setError(null)
    setSaving(true)
    try {
      await createReport({
        placeId,
        allergensConfirmed: [...allergensConfirmed],
        reactionStatus,
        verificationMethod,
        visitDate,
        partyType,
        severityLevel,
      }, token)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit report')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Allergens confirmed safe on this visit</p>
        <div className="flex flex-wrap gap-1.5">
          {ALLERGEN_OPTIONS.map(({ code, label }) => {
            const on = allergensConfirmed.has(code)
            return (
              <button key={code} type="button" onClick={() => toggleAllergen(code)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${on ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-600 hover:border-teal-400'}`}>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reaction status</label>
          <select value={reactionStatus} onChange={(e) => setReactionStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="none">No reaction</option>
            <option value="near_miss">Near miss</option>
            <option value="reaction_occurred">Reaction occurred</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How did you verify?</label>
          <select value={verificationMethod} onChange={(e) => setVerificationMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="staff_conversation">Spoke with staff</option>
            <option value="chef_conversation">Spoke with chef</option>
            <option value="menu_review">Reviewed menu</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visit date</label>
          <input type="date" required value={visitDate} onChange={(e) => setVisitDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Who visited?</label>
          <select value={partyType} onChange={(e) => setPartyType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="adult">Adult</option>
            <option value="child">Child</option>
            <option value="mixed">Mixed (adult + child)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity level</label>
          <select value={severityLevel} onChange={(e) => setSeverityLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="intolerance">Intolerance / sensitivity</option>
            <option value="allergy">Allergy</option>
            <option value="anaphylactic">Anaphylactic risk</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:border-gray-400 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors text-sm">
          {saving ? 'Submitting…' : 'Submit report'}
        </button>
      </div>
    </form>
  )
}
