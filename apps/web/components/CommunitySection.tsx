'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '../lib/auth-context'
import {
  getReports, getReviews, castTrustSignal,
  type StructuredReport, type NarrativeReview,
} from '../lib/api'
import TrustBadge from './TrustBadge'
import ReportForm from './ReportForm'
import ReviewForm from './ReviewForm'

const REACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  none:              { bg: 'bg-green-50',  text: 'text-green-700',  label: 'No reaction'       },
  near_miss:         { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Near miss'          },
  reaction_occurred: { bg: 'bg-red-50',    text: 'text-red-700',    label: 'Reaction occurred'  },
}

const WOULD_RETURN_LABEL: Record<string, string> = {
  yes: 'Would return', no: 'Would not return', unsure: 'Unsure',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isStale(iso: string) {
  return Date.now() - new Date(iso).getTime() > 365 * 24 * 60 * 60 * 1000
}

type Props = {
  placeId: string
  initialReports: StructuredReport[]
  initialReviews: NarrativeReview[]
}

export default function CommunitySection({ placeId, initialReports, initialReviews }: Props) {
  const { user, session } = useAuth()
  const [reports, setReports] = useState(initialReports)
  const [reviews, setReviews] = useState(initialReviews)
  const [activeForm, setActiveForm] = useState<'report' | 'review' | null>(null)
  const [tab, setTab] = useState<'reports' | 'reviews'>('reports')
  const [voted, setVoted] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    const [r, v] = await Promise.all([getReports(placeId), getReviews(placeId)])
    setReports(r.reports)
    setReviews(v.reviews)
  }, [placeId])

  function handleSuccess() {
    setActiveForm(null)
    refresh()
  }

  async function handleVote(targetId: string, targetType: string, signalType: string) {
    if (!session?.access_token || voted.has(targetId)) return
    try {
      await castTrustSignal({ targetId, targetType, signalType }, session.access_token)
      setVoted((prev) => new Set(prev).add(targetId))
      refresh()
    } catch {
      // 409 = already voted — mark locally anyway
      setVoted((prev) => new Set(prev).add(targetId))
    }
  }

  const token = session?.access_token

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-semibold text-gray-900">Community experiences</h2>
        {user ? (
          <div className="flex gap-2">
            <button onClick={() => setActiveForm(activeForm === 'report' ? null : 'report')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${activeForm === 'report' ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-600 hover:border-teal-400'}`}>
              + Add report
            </button>
            <button onClick={() => setActiveForm(activeForm === 'review' ? null : 'review')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${activeForm === 'review' ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-600 hover:border-teal-400'}`}>
              + Write review
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            <Link href="/auth/sign-in" className="text-teal-600 hover:underline">Sign in</Link> to contribute
          </p>
        )}
      </div>

      {/* Inline forms */}
      {activeForm === 'report' && token && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Structured report</h3>
          <ReportForm placeId={placeId} token={token} onSuccess={handleSuccess} onCancel={() => setActiveForm(null)} />
        </div>
      )}
      {activeForm === 'review' && token && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Narrative review</h3>
          <ReviewForm placeId={placeId} token={token} onSuccess={handleSuccess} onCancel={() => setActiveForm(null)} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-100">
        {(['reports', 'reviews'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${tab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t} ({t === 'reports' ? reports.length : reviews.length})
          </button>
        ))}
      </div>

      {/* Reports list */}
      {tab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No reports yet. Be the first to contribute.</p>
          ) : reports.map((r) => {
            const reaction = REACTION_STYLES[r.reactionStatus] ?? REACTION_STYLES.none
            const alreadyVoted = voted.has(r.id)
            const isOwn = user?.id === r.contributorId
            return (
              <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${reaction.bg} ${reaction.text}`}>
                      {reaction.label}
                    </span>
                    {r.allergensConfirmed.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {r.allergensConfirmed.map((code) => (
                          <span key={code} className="text-xs font-mono bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(r.visitDate)}
                    {isStale(r.visitDate) && <span className="ml-1 text-amber-500">· may be outdated</span>}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span>{r.verificationMethod.replace(/_/g, ' ')}</span>
                  <span>·</span>
                  <span>{r.partyType}</span>
                  <span>·</span>
                  <span>{r.severityLevel}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/contributors/${r.contributor.id}`} className="text-xs text-gray-500 hover:text-teal-600">
                      {r.contributor.displayName}
                    </Link>
                    <TrustBadge score={r.contributor.trustScore} />
                  </div>
                  <div className="flex items-center gap-2">
                    {r.helpfulCount > 0 && (
                      <span className="text-xs text-gray-400">{r.helpfulCount} helpful</span>
                    )}
                    {user && !isOwn && (
                      <>
                        <button
                          onClick={() => handleVote(r.id, 'structured_report', 'helpful')}
                          disabled={alreadyVoted}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${alreadyVoted ? 'border-teal-300 text-teal-600 bg-teal-50' : 'border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600'}`}>
                          Helpful
                        </button>
                        <button
                          onClick={() => handleVote(r.id, 'structured_report', 'outdated')}
                          disabled={alreadyVoted}
                          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors disabled:opacity-40">
                          Outdated
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reviews list */}
      {tab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to share your experience.</p>
          ) : reviews.map((v) => {
            const alreadyVoted = voted.has(v.id)
            const isOwn = user?.id === v.contributorId
            return (
              <div key={v.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={s <= v.safetyRating ? 'text-teal-600' : 'text-gray-200'}>●</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{WOULD_RETURN_LABEL[v.wouldReturn]}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(v.createdAt)}
                    {isStale(v.createdAt) && <span className="ml-1 text-amber-500">· may be outdated</span>}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{v.experienceText}</p>
                {v.tips && (
                  <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <span className="font-medium text-gray-700">Tip: </span>{v.tips}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/contributors/${v.contributor.id}`} className="text-xs text-gray-500 hover:text-teal-600">
                      {v.contributor.displayName}
                    </Link>
                    <TrustBadge score={v.contributor.trustScore} />
                  </div>
                  <div className="flex items-center gap-2">
                    {v.helpfulCount > 0 && (
                      <span className="text-xs text-gray-400">{v.helpfulCount} helpful</span>
                    )}
                    {user && !isOwn && (
                      <>
                        <button
                          onClick={() => handleVote(v.id, 'narrative_review', 'helpful')}
                          disabled={alreadyVoted}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${alreadyVoted ? 'border-teal-300 text-teal-600 bg-teal-50' : 'border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600'}`}>
                          Helpful
                        </button>
                        <button
                          onClick={() => handleVote(v.id, 'narrative_review', 'outdated')}
                          disabled={alreadyVoted}
                          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-colors disabled:opacity-40">
                          Outdated
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
