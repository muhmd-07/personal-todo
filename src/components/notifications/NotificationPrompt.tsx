'use client'

import { useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

interface NotificationPromptProps {
  onDismiss: () => void
}

export function NotificationPrompt({ onDismiss }: NotificationPromptProps) {
  const { subscribe, isLoading, permission } = usePushNotifications()
  const [enabled, setEnabled] = useState(false)

  if (enabled || permission === 'denied' || permission === 'unsupported') {
    return null
  }

  async function handleEnable() {
    await subscribe()
    setEnabled(true)
    onDismiss()
  }

  return (
    <div
      role="dialog"
      aria-labelledby="notif-prompt-title"
      className="rounded-xl border border-violet-200 bg-violet-50 p-4 flex items-start gap-3"
    >
      <div
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100"
      >
        <svg
          className="size-4 text-violet-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p
          id="notif-prompt-title"
          className="text-sm font-medium text-violet-900"
        >
          Get reminded on time
        </p>
        <p className="mt-0.5 text-xs text-violet-700">
          Enable notifications to receive reminders for this task.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleEnable}
            disabled={isLoading}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Enabling…' : 'Enable notifications'}
          </button>
          <button
            onClick={onDismiss}
            className="text-xs text-violet-600 hover:underline"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
