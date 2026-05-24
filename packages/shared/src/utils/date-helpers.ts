// Date helpers shared across all apps

export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function todayISOString(): string {
  return toISODateString(new Date())
}

export function monthsAgo(months: number): Date {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date
}
