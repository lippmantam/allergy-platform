import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContributor } from '../../../lib/api'
import TrustBadge from '../../../components/TrustBadge'

type Props = { params: Promise<{ id: string }> }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

const REACTION_LABEL: Record<string, string> = {
  none: 'No reaction',
  near_miss: 'Near miss',
  reaction_occurred: 'Reaction occurred',
}

export default async function ContributorProfilePage({ params }: Props) {
  const { id } = await params
  const contributor = await getContributor(id).catch(() => null)
  if (!contributor) notFound()

  const memberSinceDate = formatDate(contributor.memberSince)
  const totalContributions = contributor.reports.length + contributor.reviews.length

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/search" className="text-sm text-teal-600 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{contributor.displayName}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Member since {memberSinceDate}</p>
          </div>
          <TrustBadge score={contributor.trustScore} verifiedParent={contributor.verifiedParent} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{contributor.contributionCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Contributions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{contributor.helpfulVotes}</p>
            <p className="text-xs text-gray-500 mt-0.5">Helpful votes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{(contributor.trustScore * 100).toFixed(0)}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Trust score</p>
          </div>
        </div>

        {contributor.allergenProfile.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Allergen profile</p>
            <div className="flex flex-wrap gap-1.5">
              {contributor.allergenProfile.map((code) => (
                <span key={code} className="text-xs font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent reports */}
      {contributor.reports.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Recent reports <span className="text-gray-400 font-normal text-sm">({contributor.reports.length})</span>
          </h2>
          <div className="space-y-3">
            {contributor.reports.map((r) => (
              <Link key={r.id} href={`/places/${r.placeId}`}
                className="flex items-center justify-between gap-2 p-3 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors group">
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">{r.place.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{REACTION_LABEL[r.reactionStatus] ?? r.reactionStatus}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{formatDate(r.visitDate)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent reviews */}
      {contributor.reviews.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Recent reviews <span className="text-gray-400 font-normal text-sm">({contributor.reviews.length})</span>
          </h2>
          <div className="space-y-3">
            {contributor.reviews.map((v) => (
              <Link key={v.id} href={`/places/${v.placeId}`}
                className="block p-3 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors group">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">{v.place.name}</p>
                  <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`text-xs ${s <= v.safetyRating ? 'text-teal-600' : 'text-gray-200'}`}>●</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.experienceText}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {contributor.reports.length === 0 && contributor.reviews.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No contributions yet.</p>
      )}
    </main>
  )
}
