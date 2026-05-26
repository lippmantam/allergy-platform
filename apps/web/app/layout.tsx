import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'
import Nav from '../components/Nav'
import { AuthProvider } from '../lib/auth-context'

const nunito = Nunito({
  subsets:  ['latin'],
  variable: '--font-nunito',
  weight:   ['400', '600', '700', '800', '900'],
  display:  'swap',
})

const nunitoSans = Nunito_Sans({
  subsets:  ['latin'],
  variable: '--font-nunito-sans',
  weight:   ['300', '400', '600'],
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'AllergyNav Toronto',
  description: 'Find allergy-safe food in Toronto — community knowledge, real experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <body className="bg-surface-bg min-h-screen font-nunito-sans text-ink-primary">
        <AuthProvider>
          <Nav />
          <div className="page-root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
