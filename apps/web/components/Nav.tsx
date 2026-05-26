'use client'

import Link from 'next/link'
import { useAuth } from '../lib/auth-context'

export default function Nav() {
  const { user, loading, signOut } = useAuth()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-teal-700 tracking-tight">
          AllergyNav <span className="text-gray-400 font-normal text-sm">Toronto</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" className="text-gray-600 hover:text-teal-700 transition-colors">
            Search
          </Link>
          <Link href="/language-cards" className="text-gray-600 hover:text-teal-700 transition-colors">
            Language cards
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/places/new" className="text-gray-600 hover:text-teal-700 transition-colors">
                    Add a place
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-teal-700 transition-colors">
                    Profile
                  </Link>
                  <button onClick={() => signOut()} className="text-gray-500 hover:text-gray-700 transition-colors">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in" className="text-gray-600 hover:text-teal-700 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
