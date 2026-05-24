// Formatting utilities shared across all apps

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now  = new Date()
  const diffMs   = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30)  return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function isStale(dateString: string, thresholdDays = 365): boolean {
  const date    = new Date(dateString)
  const now     = new Date()
  const diffMs  = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > thresholdDays
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
