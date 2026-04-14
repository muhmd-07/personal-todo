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
            className="w-full rounded-xl border border-[var(--color-border)] bg-gray-50/50 px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-500/10 focus:bg-white aria-invalid:border-red-400 aria-invalid:ring-red-400/20 transition-all duration-150"
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-[var(--color-accent)] hover:underline"
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
            className="w-full rounded-xl border border-[var(--color-border)] bg-gray-50/50 px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-500/10 focus:bg-white aria-invalid:border-red-400 aria-invalid:ring-red-400/20 transition-all duration-150"
            placeholder="Your password"
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
          className="w-full rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-600 hover:to-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
