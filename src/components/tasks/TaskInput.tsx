'use client'

import { useState, useRef, useTransition, useCallback } from 'react'
import type { RefObject } from 'react'
import { parseTaskInput } from '@/lib/nlp/parser'
import { createTaskAction } from '@/lib/actions/tasks'
import { NlpPreview } from '@/components/nlp/NlpPreview'
import { NotificationPrompt } from '@/components/notifications/NotificationPrompt'
import type { ParsedTask } from '@/lib/types/task'

// Debounce helper
function useDebounce<T>(fn: (arg: T) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  return useCallback(
    (arg: T) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => fn(arg), delay)
    },
    [fn, delay],
  )
}

interface TaskInputProps {
  inputRef?: RefObject<HTMLInputElement | null>
}

export function TaskInput({ inputRef: externalRef }: TaskInputProps = {}) {
  const [value, setValue] = useState('')
  const [parsed, setParsed] = useState<ParsedTask>({ title: '', dueDate: null, reminderTime: null })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showNotifPrompt, setShowNotifPrompt] = useState(false)
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = externalRef ?? internalRef

  const debouncedParse = useDebounce((text: string) => {
    setParsed(parseTaskInput(text))
  }, 150)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    debouncedParse(e.target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    setError(null)

    const final = parseTaskInput(value)
    const input = {
      title: final.title || value.trim(),
      due_date: final.dueDate
        ? final.dueDate.toISOString().slice(0, 10)
        : null,
      due_time:
        final.dueDate && (final.dueDate.getHours() !== 0 || final.dueDate.getMinutes() !== 0)
          ? final.dueDate.toTimeString().slice(0, 5)
          : null,
      reminder_time: final.reminderTime ? final.reminderTime.toISOString() : null,
    }

    const hasDueTime = !!input.due_time || !!input.reminder_time

    startTransition(async () => {
      const result = await createTaskAction(input)
      if (result?.error) {
        setError(result.error.message)
      } else {
        setValue('')
        setParsed({ title: '', dueDate: null, reminderTime: null })
        inputRef.current?.focus()
        if (hasDueTime && typeof Notification !== 'undefined' && Notification.permission === 'default') {
          setShowNotifPrompt(true)
        }
      }
    })
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-violet-500/60 focus-within:ring-3 focus-within:ring-violet-500/10 transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Add a task… try 'Call dentist tomorrow at 3pm'"
            aria-label="New task"
            autoComplete="off"
            spellCheck
            className="flex-1 bg-transparent px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] placeholder:font-normal outline-none"
          />
          <button
            type="submit"
            disabled={isPending || !value.trim()}
            aria-label="Add task"
            className="mr-2 flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-sm hover:from-violet-400 hover:to-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isPending ? (
              <svg aria-hidden="true" className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        </div>

        {parsed.dueDate && <NlpPreview parsed={parsed} />}

        {!value && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['tomorrow', 'at 3pm', 'next week', 'remind me'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  const newVal = value ? `${value} ${chip}` : chip
                  setValue(newVal)
                  debouncedParse(newVal)
                  inputRef.current?.focus()
                }}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-muted)] hover:border-violet-500/40 hover:text-violet-400 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </form>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}

      {showNotifPrompt && (
        <div className="mt-3">
          <NotificationPrompt onDismiss={() => setShowNotifPrompt(false)} />
        </div>
      )}
    </div>
  )
}
