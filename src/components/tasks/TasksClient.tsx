'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TaskInput } from './TaskInput'
import { TaskList } from './TaskList'
import { CalendarView } from './CalendarView'
import { ViewToggle } from './ViewToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Task } from '@/lib/types/task'

interface TasksClientProps {
  tasks: Task[]
}

function RefreshButton() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'spinning' | 'done'>('idle')

  const handleRefresh = useCallback(() => {
    if (state !== 'idle') return
    setState('spinning')
    router.refresh()
    setTimeout(() => setState('done'), 900)
    setTimeout(() => setState('idle'), 1500)
  }, [router, state])

  return (
    <button
      onClick={handleRefresh}
      aria-label="Refresh tasks"
      title="Refresh tasks"
      className={`flex size-10 items-center justify-center rounded-xl border transition-all duration-200 ${
        state === 'done'
          ? 'border-violet-500/60 bg-violet-900/30 text-violet-400'
          : state === 'spinning'
          ? 'border-violet-500/40 bg-violet-900/20 text-violet-400'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {state === 'done' ? (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`size-4.5 ${state === 'spinning' ? 'animate-spin' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )}
    </button>
  )
}

export function TasksClient({ tasks }: TasksClientProps) {
  const [view, setView] = useState<'focus' | 'calendar' | 'all'>('focus')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onSetView: (v) => {
      if (v === 'focus' || v === 'calendar' || v === 'all') setView(v)
    },
  })

  const activeTasks = tasks.filter(t => !t.completed_at && !t.deleted_at)
  const completedTasks = tasks.filter(t => !!t.completed_at && !t.deleted_at)

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">Tasks</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 font-medium">
            {activeTasks.length} active · {completedTasks.length} completed
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-col gap-4">
        <TaskInput inputRef={inputRef} />

        <div className="flex items-center justify-between">
          <ViewToggle view={view} onViewChange={setView} />
          <p className="hidden sm:block text-sm text-[var(--color-text-muted)]">
            Press <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text-primary)]">/</kbd> to focus
          </p>
        </div>

        {view === 'calendar' ? (
          <CalendarView tasks={tasks} />
        ) : (
          <TaskList tasks={tasks} view={view} />
        )}
      </div>
    </div>
  )
}
