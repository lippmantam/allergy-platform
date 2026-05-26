'use client'

import { useState } from 'react'
import { createReview } from '../lib/api'

type Props = {
  placeId: string
  token: string
  onSuccess: () => void
  onCancel: () => void
}

const RATINGS = [1, 2, 3, 4, 5]
const RATING_LABELS: Record<number, string> = {
  1: 'Not safe',
  2: 'Poor',
  3: 'Acceptable',
  4: 'Good',
  5: 'Very safe',
}

export default function ReviewForm({ placeId, token, onSuccess, onCancel }: Props) {
  const [experienceText, setExperienceText] = useState('')
  const [safetyRating, setSafetyRating] = useState(0)
  const [tips, setTips] = useState('')
  const [wouldReturn, setWouldReturn] = useState('yes')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (safetyRating === 0) { setError('Please select a safety rating'); return }
    if (experienceText.length < 20) { setError('Please write at least 20 characters'); return }
    setError(null)
    setSaving(true)
    try {
      await createReview({
        placeId,
        experienceText,
        safetyRating,
        tips: tips || undefined,
        wouldReturn,
      }, token)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
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
        <p className="text-sm font-medium text-gray-700 mb-2">Allergy safety rating</p>
        <div className="flex gap-2">
          {RATINGS.map((r) => (
            <button key={r} type="button" onClick={() => setSafetyRating(r)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                safetyRating === r
                  ? r >= 4 ? 'bg-green-600 border-green-600 text-white'
                  : r === 3 ? 'bg-yellow-500 border-yellow-500 text-white'
                  : 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}>
              {r}
            </button>
          ))}
        </div>
        {safetyRating > 0 && (
          <p className="text-xs text-gray-500 mt-1 text-center">{RATING_LABELS[safetyRating]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your experience <span className="text-gray-400 font-normal">(min 20 characters)</span>
        </label>
        <textarea
          required
          value={experienceText}
          onChange={(e) => setExperienceText(e.target.value)}
          rows={4}
          placeholder="Describe how the restaurant handled your allergy, what you ordered, any concerns…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-0.5 text-right">{experienceText.length} chars</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tips for others <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          rows={2}
          placeholder="What to ask, what to order, what to avoid…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Would you return?</label>
        <div className="flex gap-2">
          {(['yes', 'unsure', 'no'] as const).map((v) => (
            <button key={v} type="button" onClick={() => setWouldReturn(v)}
              className={`flex-1 py-2 rounded-lg border text-sm capitalize transition-colors ${
                wouldReturn === v
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-teal-400'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:border-gray-400 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors text-sm">
          {saving ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}
