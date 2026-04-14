'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TaskInput } from './TaskInput'
import { TaskList } from './TaskList'
import { ViewToggle } from './ViewToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Task } from '@/lib/types/task'

interface TasksClientProps {
  tasks: Task[]
}

export function TasksClient({ tasks }: TasksClientProps) {
  const [view, setView] = useState<'focus' | 'all'>('focus')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onSetView: setView,
  })

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
          Tasks
        </h1>
        <button
          onClick={() => router.refresh()}
          aria-label="Refresh tasks"
          title="Refresh tasks"
          className="flex size-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <TaskInput inputRef={inputRef} />

        <div className="flex items-center justify-between">
          <ViewToggle view={view} onViewChange={setView} />
          <p className="hidden sm:block text-xs text-[var(--color-text-muted)]">
            Press <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1 py-0.5 font-mono text-[10px] text-[var(--color-text-primary)]">/</kbd> to add task
          </p>
        </div>

        <TaskList tasks={tasks} view={view} />
      </div>
    </div>
  )
}
