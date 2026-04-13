'use client'

import { useState, useTransition } from 'react'
import { deleteAccountAction } from '@/lib/actions/profile'

export function DeleteAccountSection({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccountAction()
      if (result?.error) {
        setError(result.error.message)
      }
    })
  }

  if (!showConfirm) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--color-text-primary)] font-medium">
          Delete account
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Permanently delete your account and all associated data. This cannot be
          undone.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition"
        >
          Delete account
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[var(--color-text-primary)]">
        Are you sure? This will permanently delete your account.
      </p>
      <p className="text-sm text-[var(--color-text-muted)]">
        Type{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs font-mono">
          {email}
        </code>{' '}
        to confirm.
      </p>
      <input
        type="email"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition"
        placeholder={email}
        autoComplete="off"
        aria-label="Type your email to confirm account deletion"
      />
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={isPending || confirmation !== email}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Deleting…' : 'Delete my account'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false)
            setConfirmation('')
            setError(null)
          }}
          disabled={isPending}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-zinc-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
