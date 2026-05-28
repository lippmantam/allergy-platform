type Props = { score: number; verifiedParent?: boolean }

const TIERS = [
  { min: 0.75, label: 'Highly trusted', bg: 'bg-safe-bg',        text: 'text-safe-text'   },
  { min: 0.5,  label: 'Trusted',        bg: 'bg-brand-green-light', text: 'text-brand-green-deep' },
  { min: 0.25, label: 'Active',         bg: 'bg-[#DBEAFE]',      text: 'text-brand-blue'  },
  { min: 0,    label: 'New',            bg: 'bg-surface-border',  text: 'text-ink-muted'   },
]

export default function TrustBadge({ score, verifiedParent }: Props) {
  const tier = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1]
  return (
    <span className={`inline-flex items-center gap-1 font-nunito font-bold text-[11px] px-2.5 py-1 rounded-chip ${tier.bg} ${tier.text}`}>
      {verifiedParent && <span title="Verified parent">★</span>}
      {tier.label}
    </span>
  )
}
