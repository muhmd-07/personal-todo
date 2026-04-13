'use client'

import { useState, useTransition } from 'react'
import { updateProfileAction } from '@/lib/actions/profile'

export function ProfileForm({
  initialDisplayName,
}: {
  initialDisplayName: string
}) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    setFieldErrors({})
    const formData = new FormData(e.currentTarget)
    const input = { display_name: formData.get('display_name') as string }

    startTransition(async () => {
      const result = await updateProfileAction(input)
      if (result?.error) {
        setError(result.error.message)
        setFieldErrors(result.error.fields ?? {})
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
        >
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={initialDisplayName}
          maxLength={64}
          aria-describedby={fieldErrors.display_name ? 'display-name-error' : undefined}
          aria-invalid={!!fieldErrors.display_name}
          className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 aria-invalid:border-red-400 transition"
          placeholder="Your name"
        />
        {fieldErrors.display_name && (
          <p id="display-name-error" role="alert" className="mt-1 text-xs text-red-500">
            {fieldErrors.display_name[0]}
          </p>
        )}
      </div>

      {error && !fieldErrors.display_name && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-600">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
