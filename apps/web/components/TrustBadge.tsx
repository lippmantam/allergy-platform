type Props = { score: number; verifiedParent?: boolean }

const TIERS = [
  { min: 0.75, label: 'Highly trusted', bg: 'bg-green-100', text: 'text-green-800' },
  { min: 0.5,  label: 'Trusted',        bg: 'bg-teal-100',  text: 'text-teal-800'  },
  { min: 0.25, label: 'Active',         bg: 'bg-blue-100',  text: 'text-blue-800'  },
  { min: 0,    label: 'New',            bg: 'bg-gray-100',  text: 'text-gray-600'  },
]

export default function TrustBadge({ score, verifiedParent }: Props) {
  const tier = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tier.bg} ${tier.text}`}>
      {verifiedParent && <span title="Verified parent">★</span>}
      {tier.label}
    </span>
  )
}
