'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-700 transition-colors"
    >
      Print cards
    </button>
  )
}
