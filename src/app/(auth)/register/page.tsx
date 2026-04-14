'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { registerAction } from '@/lib/actions/auth'

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [emailSent, setEmailSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const input = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    startTransition(async () => {
      const result = await registerAction(input)
      if (result?.error) {
        setError(result.error.message)
        setFieldErrors(result.error.fields ?? {})
      } else if (result?.data?.needsEmailVerification) {
        setEmailSent(true)
      }
    })
  }

  const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/10 transition-all duration-150"

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-900/30 mx-auto">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-6 text-violet-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Check your email</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          We&apos;ve sent a confirmation link to your email address. Click it to activate your account.
        </p>
        <Link href="/login" className="block text-sm font-semibold text-[var(--color-accent)] hover:text-violet-400 hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create your account</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Start capturing tasks instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
            Email
          </label>
          <input
            id="email" name="email" type="email" autoComplete="email" required
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            aria-invalid={!!fieldErrors.email}
            className={`${inputClass} aria-invalid:border-red-500/60`}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
            Password
          </label>
          <input
            id="password" name="password" type="password" autoComplete="new-password" required
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            aria-invalid={!!fieldErrors.password}
            className={`${inputClass} aria-invalid:border-red-500/60`}
            placeholder="At least 8 characters"
          />
          {fieldErrors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.password[0]}</p>
          )}
        </div>

        {error && !fieldErrors.email && !fieldErrors.password && (
          <p role="alert" className="text-sm text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit" disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:from-violet-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isPending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[var(--color-accent)] hover:text-violet-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
