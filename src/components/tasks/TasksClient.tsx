'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TaskInput } from './TaskInput'
import { TaskList } from './TaskList'
import { CalendarView } from './CalendarView'
import { ViewToggle } from './ViewToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Task } from '@/lib/types/task'

interface TasksClientProps {
  tasks: Task[]
  initialView?: string
}

function LiveClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')

  return (
    <span className="text-[52px] font-black tabular-nums tracking-tight text-white leading-none">
      {h}<span className="animate-pulse opacity-60">:</span>{m}
    </span>
  )
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
      className={`flex size-9 items-center justify-center rounded-xl border transition-all duration-200 ${
        state === 'done'
          ? 'border-white/30 bg-white/[0.08] text-white'
          : state === 'spinning'
          ? 'border-white/20 bg-white/[0.05] text-white/60'
          : 'border-zinc-900 bg-zinc-950 text-zinc-600 hover:border-zinc-700 hover:text-white'
      }`}
    >
      {state === 'done' ? (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`size-4 ${state === 'spinning' ? 'animate-spin' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )}
    </button>
  )
}

const MOTIVATIONAL_FACTS = [
  'Monotasking increases your focus by 40% compared to rapid task switching.',
  'Writing tasks down frees up mental RAM for deeper thinking.',
  'Breaking goals into small steps reduces overwhelm by over 50%.',
  'People who review their tasks daily complete 42% more goals.',
  'Focused work for 90 minutes mirrors your brain\'s natural ultradian rhythm.',
]

export function TasksClient({ tasks, initialView }: TasksClientProps) {
  const resolvedInitial = (() => {
    if (initialView === 'calendar') return 'calendar'
    if (initialView === 'all') return 'all'
    return 'focus'
  })()

  const [view, setView] = useState<'focus' | 'calendar' | 'all'>(resolvedInitial)
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
  const today = new Date().toLocaleDateString('en-CA')

  let filteredTasks = tasks
  if (initialView === 'today') {
    filteredTasks = tasks.filter(t => t.due_date === today)
  } else if (initialView === 'upcoming') {
    filteredTasks = tasks.filter(t => t.due_date && t.due_date > today)
  } else if (initialView === 'inbox') {
    filteredTasks = tasks.filter(t => !t.due_date && !t.completed_at && !t.deleted_at)
  }

  const todayActive = activeTasks.filter(t => !t.due_date || t.due_date <= today).length
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const fact = MOTIVATIONAL_FACTS[new Date().getDay() % MOTIVATIONAL_FACTS.length]

  const isMainFocus = !initialView || initialView === 'focus'

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">

      {/* Daily Ritual header — shown on the main focus view */}
      {isMainFocus && (
        <div className="mb-8 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
                {dayOfWeek} · {monthDay}
              </p>
              <h1 className="text-2xl font-black tracking-tight text-white">Daily Ritual</h1>
            </div>
            <RefreshButton />
          </div>

          {/* Clock */}
          <div className="flex items-end gap-4">
            <LiveClock />
            <div className="pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-500 block mb-0.5">Focus Session</span>
              <span className="text-xs text-zinc-600">{todayActive} task{todayActive !== 1 ? 's' : ''} remaining</span>
            </div>
          </div>

          {/* Motivational fact */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 px-5 py-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 block mb-2">Did You Know?</span>
            <p className="text-sm text-zinc-400 leading-relaxed">{fact}</p>
          </div>
        </div>
      )}

      {/* Non-focus view header */}
      {!isMainFocus && (
        <div className="flex items-center justify-between mb-6 slide-up">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-white leading-none">
              {initialView === 'today' ? 'Today' : initialView === 'upcoming' ? 'Upcoming' : 'All Tasks'}
            </h1>
            <p className="text-[12px] text-zinc-600 mt-1.5 font-medium">
              <span className="text-white">{activeTasks.length}</span> active
              <span className="mx-1.5 text-zinc-900">·</span>
              <span className="text-green-400">{completedTasks.length}</span> completed
            </p>
          </div>
          <RefreshButton />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <TaskInput inputRef={inputRef} />

        <div className="flex items-center justify-between">
          <ViewToggle view={view} onViewChange={setView} />
          <p className="hidden sm:block text-xs text-zinc-700">
            Press <kbd className="rounded border border-zinc-900 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">/</kbd> to add
          </p>
        </div>

        {view === 'calendar' ? (
          <CalendarView tasks={filteredTasks} />
        ) : (
          <TaskList tasks={filteredTasks} view={view} />
        )}
      </div>

      {/* Teal FAB */}
      <Link
        href="/dashboard/create"
        className="fixed bottom-24 right-5 md:bottom-6 md:right-6 size-14 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-lg shadow-teal-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
        aria-label="Create new task"
      >
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </div>
  )
}
