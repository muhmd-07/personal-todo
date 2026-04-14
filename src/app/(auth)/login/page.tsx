'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const input = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    startTransition(async () => {
      const result = await loginAction(input)
      if (result?.error) {
        setError(result.error.message)
        setFieldErrors(result.error.fields ?? {})
      }
    })
  }

  const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/10 transition-all duration-150"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5"
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
            className={`${inputClass} aria-invalid:border-red-500/60 aria-invalid:ring-red-500/10`}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-[var(--color-accent)] hover:text-violet-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            aria-invalid={!!fieldErrors.password}
            className={`${inputClass} aria-invalid:border-red-500/60 aria-invalid:ring-red-500/10`}
            placeholder="Your password"
          />
          {fieldErrors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-400">
              {fieldErrors.password[0]}
            </p>
          )}
        </div>

        {error && !fieldErrors.email && !fieldErrors.password && (
          <p role="alert" className="text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-400 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--color-accent)] hover:text-violet-400 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
