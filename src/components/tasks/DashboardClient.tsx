'use client'

import { useState, useRef, useCallback } from 'react'
import { TaskInput } from './TaskInput'
import { TaskList } from './TaskList'
import { ViewToggle } from './ViewToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Task } from '@/lib/types/task'

interface DashboardClientProps {
  tasks: Task[]
  email: string
}

export function DashboardClient({ tasks, email }: DashboardClientProps) {
  const [view, setView] = useState<'focus' | 'calendar' | 'all'>('focus')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onSetView: setView,
  })

  const today = new Date().toLocaleDateString('en-CA')
  const activeTasks = tasks.filter((t) => !t.completed_at && !t.deleted_at)
  const totalToday = activeTasks.filter((t) => !t.due_date || t.due_date <= today).length
  const completedToday = tasks.filter((t) => {
    if (!t.completed_at) return false
    const completedDate = new Date(t.completed_at).toLocaleDateString('en-CA')
    return completedDate === today
  }).length
  const progressPct = totalToday > 0 ? Math.round((completedToday / (completedToday + totalToday)) * 100) : 0
  const showProgress = completedToday + totalToday > 0

  return (
    <div className="flex flex-col gap-6">
      <TaskInput inputRef={inputRef} />

      {showProgress && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              {completedToday === 0
                ? `${totalToday} task${totalToday !== 1 ? 's' : ''} remaining today`
                : totalToday === 0
                ? 'All done for today'
                : `${completedToday} of ${completedToday + totalToday} completed`}
            </span>
            <span className="text-xs font-bold text-white/70">{progressPct}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <ViewToggle view={view} onViewChange={setView} />
        <p className="hidden sm:block text-xs text-[var(--color-text-muted)]">
          Press <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 font-mono text-[10px]">/</kbd> to add task
        </p>
      </div>

      <TaskList tasks={tasks} view={view} />
    </div>
  )
}
