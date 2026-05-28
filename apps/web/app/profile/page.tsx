'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../lib/auth-context'
import { getContributor, updateContributor, type ContributorProfile } from '../../lib/api'
import TrustBadge from '../../components/TrustBadge'
import { ALLERGENS } from '../../lib/allergens'

const INPUT = `w-full border-2 border-surface-border rounded-[14px] px-4 py-2.5
  font-nunito-sans font-semibold text-[16px] sm:text-[15px]
  bg-surface-bg text-ink-primary placeholder:text-ink-faint
  focus:outline-none focus:border-brand-green transition-colors`

const LABEL = 'block font-nunito-sans font-semibold text-[13px] text-ink-muted mb-1.5'

export default function ProfilePage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const [profile, setProfile]               = useState<ContributorProfile | null>(null)
  const [displayName, setDisplayName]       = useState('')
  const [allergenProfile, setAllergenProfile] = useState<string[]>([])
  const [saving, setSaving]                 = useState(false)
  const [saved, setSaved]                   = useState(false)
  const [error, setError]                   = useState<string | null>(null)

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
    setSaving(true); setError(null); setSaved(false)
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
    return (
      <div className="max-w-[640px] mx-auto px-5 py-8 font-nunito-sans text-[13px] text-ink-muted">
        Loading…
      </div>
    )
  }

  return (
    <main className="max-w-[640px] mx-auto px-5 sm:px-8 py-8 sm:py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-nunito font-black text-[24px] sm:text-[28px] text-ink-heading">
          Your profile
        </h1>
        <div className="flex items-center gap-2">
          <TrustBadge score={profile.trustScore} verifiedParent={profile.verifiedParent} />
          <Link href={`/contributors/${profile.id}`}
            className="font-nunito-sans font-semibold text-[12px] text-brand-green hover:text-brand-green-dark transition-colors">
            Public view
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-surface-card rounded-card border-2 border-surface-border p-5 mb-6
                      grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-nunito font-black text-[22px] text-ink-heading">
            {profile.contributionCount}
          </p>
          <p className="font-nunito-sans text-[12px] text-ink-muted">Contributions</p>
        </div>
        <div>
          <p className="font-nunito font-black text-[22px] text-ink-heading">
            {profile.helpfulVotes}
          </p>
          <p className="font-nunito-sans text-[12px] text-ink-muted">Helpful votes</p>
        </div>
        <div>
          <p className="font-nunito font-black text-[22px] text-brand-green">
            {(profile.trustScore * 100).toFixed(0)}%
          </p>
          <p className="font-nunito-sans text-[12px] text-ink-muted">Trust score</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-[#FFF1F0] border-2 border-[#FFCCC7] rounded-[14px] p-3.5 font-nunito-sans text-[13px] text-[#CF1322]">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-safe-bg border-2 border-brand-green-mid rounded-[14px] p-3.5 font-nunito-sans text-[13px] text-safe-text">
            Profile saved.
          </div>
        )}

        {/* Display name */}
        <div>
          <label className={LABEL}>Display name</label>
          <input type="text" value={displayName} required
            onChange={(e) => setDisplayName(e.target.value)} className={INPUT} />
          <p className="font-nunito-sans text-[12px] text-ink-subtle mt-1.5">
            This is the pseudonymous handle shown on your reports and reviews.
          </p>
        </div>

        {/* Allergen profile */}
        <div>
          <p className={LABEL}>My allergen profile</p>
          <p className="font-nunito-sans text-[12px] text-ink-subtle mb-3">
            Select the allergens that apply to you. This helps others assess your reports.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ALLERGENS.map((a) => {
              const selected = allergenProfile.includes(a.code)
              return (
                <button key={a.code} type="button" onClick={() => toggleAllergen(a.code)}
                  className={`font-nunito font-bold text-[12px] sm:text-[13px] px-3 py-1.5 rounded-chip border-2 transition-all ${
                    selected
                      ? 'bg-brand-green border-brand-green text-white'
                      : 'bg-surface-bg border-surface-border text-ink-muted hover:border-brand-green hover:text-brand-green'
                  }`}>
                  {a.name}
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all">
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </main>
  )
}
