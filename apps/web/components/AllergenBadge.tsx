const LEVEL_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  dedicated_section: { bg: 'bg-safe-bg',    text: 'text-safe-text',  border: 'border-brand-green-mid', label: 'Dedicated section' },
  menu_options:      { bg: 'bg-[#DBEAFE]',  text: 'text-brand-blue', border: 'border-brand-blue/30',   label: 'Menu options' },
  aware:             { bg: 'bg-warn-bg',    text: 'text-warn-text',  border: 'border-brand-amber/30',  label: 'Staff aware' },
}

const ALLERGEN_NAMES: Record<string, string> = {
  PNUT: 'Peanut', MILK: 'Dairy', EGG: 'Egg', WHEAT: 'Wheat/Gluten',
  SOY: 'Soy', SES: 'Sesame', FISH: 'Fish', CRUST: 'Shellfish',
  MOLL: 'Molluscs', 'TN-CSH': 'Cashew', 'TN-ALM': 'Almond',
  'TN-WAL': 'Walnut', 'TN-HAZ': 'Hazelnut', MUST: 'Mustard',
  TNUT: 'Tree nuts', SULF: 'Sulphites', CEL: 'Celery', LUP: 'Lupin',
}

type Props = {
  allergenCode: string
  accommodationLevel?: string
  notes?: string | null
  size?: 'sm' | 'md'
}

export default function AllergenBadge({ allergenCode, accommodationLevel, notes, size = 'md' }: Props) {
  const style = accommodationLevel
    ? (LEVEL_STYLES[accommodationLevel] ?? { bg: 'bg-surface-border', text: 'text-ink-muted', border: 'border-surface-border', label: accommodationLevel })
    : { bg: 'bg-surface-border', text: 'text-ink-muted', border: 'border-surface-border', label: null }

  const name = ALLERGEN_NAMES[allergenCode] ?? allergenCode

  return (
    <div className={`border-2 rounded-[14px] p-3 ${style.border} ${style.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`font-nunito font-extrabold ${size === 'sm' ? 'text-[11px]' : 'text-[13px]'} ${style.text}`}>
          {name}
        </span>
        {style.label && (
          <span className={`font-nunito-sans text-[11px] ${style.text} opacity-80`}>
            · {style.label}
          </span>
        )}
      </div>
      {notes && size === 'md' && (
        <p className={`mt-1 font-nunito-sans text-[12px] leading-tight ${style.text} opacity-70`}>
          {notes}
        </p>
      )}
    </div>
  )
}
