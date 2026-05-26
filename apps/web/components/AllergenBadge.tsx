const LEVEL_STYLES: Record<string, string> = {
  dedicated_section: 'bg-green-100 text-green-800 border-green-200',
  menu_options: 'bg-blue-100 text-blue-800 border-blue-200',
  aware: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

const LEVEL_LABELS: Record<string, string> = {
  dedicated_section: 'Dedicated section',
  menu_options: 'Menu options',
  aware: 'Staff aware',
}

type Props = {
  allergenCode: string
  accommodationLevel?: string
  notes?: string | null
  size?: 'sm' | 'md'
}

export default function AllergenBadge({ allergenCode, accommodationLevel, notes, size = 'md' }: Props) {
  const style = accommodationLevel ? (LEVEL_STYLES[accommodationLevel] ?? 'bg-gray-100 text-gray-700 border-gray-200') : 'bg-gray-100 text-gray-700 border-gray-200'
  const label = accommodationLevel ? (LEVEL_LABELS[accommodationLevel] ?? accommodationLevel) : null

  return (
    <div className={`border rounded-lg p-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-1.5">
        <span className={`font-mono font-semibold px-1.5 py-0.5 rounded text-xs ${style}`}>
          {allergenCode}
        </span>
        {label && (
          <span className={`text-gray-600 ${size === 'sm' ? 'text-xs' : 'text-xs'}`}>{label}</span>
        )}
      </div>
      {notes && size === 'md' && (
        <p className="mt-1 text-xs text-gray-500 leading-tight">{notes}</p>
      )}
    </div>
  )
}
