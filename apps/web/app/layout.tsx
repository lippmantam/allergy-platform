import type { Metadata } from 'next'
import './globals.css'
import Nav from '../components/Nav'
import { AuthProvider } from '../lib/auth-context'

export const metadata: Metadata = {
  title:       'AllergyNav Toronto',
  description: 'Find allergy-safe food in Toronto — community knowledge, real experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
