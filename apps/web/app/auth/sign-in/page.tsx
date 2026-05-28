'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const INPUT = `w-full border-2 border-surface-border rounded-[14px] px-4 py-2.5
  font-nunito-sans font-semibold text-[16px] sm:text-[15px]
  bg-surface-bg text-ink-primary placeholder:text-ink-faint
  focus:outline-none focus:border-brand-green transition-colors`

const LABEL = 'block font-nunito-sans font-semibold text-[13px] text-ink-muted mb-1.5'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [mode, setMode]         = useState<'password' | 'magic'>('password')

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message) } else { router.push('/'); router.refresh() }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    setLoading(false)
    if (error) { setError(error.message) } else { setMagicLinkSent(true) }
  }

  if (magicLinkSent) {
    return (
      <main className="max-w-sm mx-auto px-5 py-20 text-center">
        <p className="text-3xl mb-3">✉️</p>
        <h1 className="font-nunito font-black text-[20px] text-ink-heading mb-2">Check your email</h1>
        <p className="font-nunito-sans text-[14px] text-ink-muted">
          We sent a magic link to <strong className="text-ink-primary">{email}</strong>. Click it to sign in.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-12 sm:py-16">
      <h1 className="font-nunito font-black text-[28px] text-ink-heading mb-1">Sign in</h1>
      <p className="font-nunito-sans text-[14px] text-ink-muted mb-8">
        Don&apos;t have an account?{' '}
        <Link href="/auth/sign-up" className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors">
          Sign up
        </Link>
      </p>

      {error && (
        <div className="bg-[#FFF1F0] border-2 border-[#FFCCC7] rounded-[14px] p-3.5 font-nunito-sans text-[13px] text-[#CF1322] mb-6">
          {error}
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 bg-surface-border/40 p-1 rounded-[16px]">
        {(['password', 'magic'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2 font-nunito font-bold text-[13px] rounded-[14px] transition-all ${
              mode === m
                ? 'bg-surface-card text-brand-green shadow-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            {m === 'password' ? 'Password' : 'Magic link'}
          </button>
        ))}
      </div>

      {mode === 'password' ? (
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className={LABEL}>Email</label>
            <input type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Password</label>
            <input type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} className={INPUT} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label className={LABEL}>Email</label>
            <input type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className={INPUT} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all mt-2">
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
    </main>
  )
}
