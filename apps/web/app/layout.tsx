import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Allergy Travel Platform',
  description: 'Find allergy-safe food when travelling — community knowledge, real experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
