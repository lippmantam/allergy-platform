'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../lib/auth-context'
import { getContributor, updateContributor, type ContributorProfile } from '../../lib/api'
import TrustBadge from '../../components/TrustBadge'
import { ALLERGENS } from '../../lib/allergens'

export default function ProfilePage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ContributorProfile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [allergenProfile, setAllergenProfile] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { router.push('/auth/sign-in'); return }
    getContributor(user.id).then((p) => {
      setProfile(p)
      setDisplayName(p.displayName)
      setAllergenProfile(p.allergenProfile)
    }).catch(() => {})
  }, [user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !session?.access_token) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const updated = await updateContributor(user.id, { displayName, allergenProfile }, session.access_token)
      setProfile(updated)
      setSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function toggleAllergen(code: string) {
    setAllergenProfile((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  if (!profile) {
    return <div className="max-w-xl mx-auto px-4 py-8 text-sm text-gray-400">Loading…</div>
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Your profile</h1>
        <div className="flex items-center gap-2">
          <TrustBadge score={profile.trustScore} verifiedParent={profile.verifiedParent} />
          <Link href={`/contributors/${profile.id}`} className="text-xs text-teal-600 hover:underline">
            Public view
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-gray-900">{profile.contributionCount}</p>
          <p className="text-xs text-gray-500">Contributions</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{profile.helpfulVotes}</p>
          <p className="text-xs text-gray-500">Helpful votes</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{(profile.trustScore * 100).toFixed(0)}%</p>
          <p className="text-xs text-gray-500">Trust score</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">Profile saved.</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-gray-400 mt-1">This is the pseudonymous handle shown on your reports and reviews.</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">My allergen profile</p>
          <p className="text-xs text-gray-400 mb-3">Select the allergens that apply to you. This helps others assess your reports.</p>
          <div className="grid grid-cols-3 gap-2">
            {ALLERGENS.map((a) => {
              const selected = allergenProfile.includes(a.code)
              return (
                <button key={a.code} type="button" onClick={() => toggleAllergen(a.code)}
                  className={`text-xs px-2 py-1.5 rounded-lg border font-mono transition-colors text-left ${
                    selected
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}>
                  {a.code}
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </main>
  )
}
