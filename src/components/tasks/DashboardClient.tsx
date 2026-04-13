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
  const [view, setView] = useState<'focus' | 'all'>('focus')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onSetView: setView,
  })

  return (
    <div className="flex flex-col gap-4">
      <TaskInput inputRef={inputRef} />

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
