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

export default function SignUpPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    setLoading(false)
    if (error) { setError(error.message) } else { setConfirmSent(true) }
  }

  if (confirmSent) {
    return (
      <main className="max-w-sm mx-auto px-5 py-20 text-center">
        <p className="text-3xl mb-3">✉️</p>
        <h1 className="font-nunito font-black text-[20px] text-ink-heading mb-2">Confirm your email</h1>
        <p className="font-nunito-sans text-[14px] text-ink-muted">
          We sent a confirmation link to <strong className="text-ink-primary">{email}</strong>.
          Click it to activate your account.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-12 sm:py-16">
      <h1 className="font-nunito font-black text-[28px] text-ink-heading mb-1">Create an account</h1>
      <p className="font-nunito-sans text-[14px] text-ink-muted mb-8">
        Already have one?{' '}
        <Link href="/auth/sign-in" className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors">
          Sign in
        </Link>
      </p>

      {error && (
        <div className="bg-[#FFF1F0] border-2 border-[#FFCCC7] rounded-[14px] p-3.5 font-nunito-sans text-[13px] text-[#CF1322] mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Display name</label>
          <input type="text" required value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. PeanutFreeParent_TO" className={INPUT} />
          <p className="font-nunito-sans text-[12px] text-ink-subtle mt-1.5">
            Pseudonymous — shown on your contributions
          </p>
        </div>
        <div>
          <label className={LABEL}>Email</label>
          <input type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Password</label>
          <input type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters" className={INPUT} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white font-nunito font-extrabold text-[15px] py-3 rounded-[14px] transition-all mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </main>
  )
}
