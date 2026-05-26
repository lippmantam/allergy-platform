'use client'

import Link from 'next/link'
import { useAuth } from '../lib/auth-context'
import { usePathname } from 'next/navigation'

const LOGO = (
  <span className="font-nunito font-black text-[22px] leading-none tracking-tight">
    <span className="text-brand-orange">A</span>
    <span className="text-brand-amber">l</span>
    <span className="text-brand-green">l</span>
    <span className="text-brand-blue">e</span>
    <span className="text-ink-primary">rgyNav</span>
  </span>
)

const LOCATION_PILL = (
  <span className="font-nunito-sans font-extrabold text-[11px] px-2 py-0.5 rounded-chip bg-[#FFF0E6] text-brand-orange">
    Toronto
  </span>
)

const BOTTOM_TABS = [
  { href: '/search',         label: 'Search',        icon: '🔍' },
  { href: '/language-cards', label: 'Language',       icon: '🌍' },
  { href: '/places/new',     label: 'Add a place',   icon: '➕', alwaysOrange: true },
  { href: '/profile',        label: 'Profile',        icon: '👤' },
]

export default function Nav() {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="bg-surface-card border-b-2 border-surface-nav">
        <div className="max-w-[920px] mx-auto px-8 py-4 flex items-center justify-between">

          {/* Logo + location pill */}
          <Link href="/" className="flex items-center gap-2">
            {LOGO}
            {LOCATION_PILL}
          </Link>

          {/* Desktop nav — hidden below 640px */}
          <nav className="hidden sm:flex items-center gap-1 font-nunito-sans font-semibold text-[14px] text-[#6B6358]">
            <Link
              href="/search"
              className="px-3 py-1.5 rounded-chip hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
            >
              Search
            </Link>
            <Link
              href="/language-cards"
              className="px-3 py-1.5 rounded-chip hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
            >
              Language cards
            </Link>

            {!loading && (
              user ? (
                <>
                  <Link
                    href="/places/new"
                    className="px-3 py-1.5 rounded-chip hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
                  >
                    Add a place
                  </Link>
                  <Link
                    href="/profile"
                    className="px-3 py-1.5 rounded-chip hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 rounded-chip text-ink-muted hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    className="px-3 py-1.5 rounded-chip hover:bg-[#F5F0E8] hover:text-ink-primary transition-all"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="px-[18px] py-[7px] rounded-chip font-black text-[14px] text-white bg-brand-orange hover:bg-brand-orange-dark transition-all"
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </header>

      {/* ── Mobile bottom tab bar — hidden at 640px+ ────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-card border-t-2 border-surface-nav flex justify-around items-center"
        style={{
          height: '60px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {BOTTOM_TABS.map(({ href, label, icon, alwaysOrange }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          const color = alwaysOrange
            ? 'text-brand-orange'
            : active
              ? 'text-brand-green'
              : 'text-ink-subtle'
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-[3px] min-w-[44px] min-h-[44px] justify-center ${color}`}
            >
              <span className="text-[22px] leading-none">{icon}</span>
              <span className="font-nunito-sans font-semibold text-[10px]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
