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

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Check your email
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          We&apos;ve sent a confirmation link to your email address. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="block text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Start capturing tasks instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            aria-invalid={!!fieldErrors.email}
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 aria-invalid:border-red-400 aria-invalid:ring-red-400/20 transition"
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            aria-invalid={!!fieldErrors.password}
            className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 aria-invalid:border-red-400 aria-invalid:ring-red-400/20 transition"
            placeholder="At least 8 characters"
          />
          {fieldErrors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-500">
              {fieldErrors.password[0]}
            </p>
          )}
        </div>

        {error && !fieldErrors.email && !fieldErrors.password && (
          <p role="alert" className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
