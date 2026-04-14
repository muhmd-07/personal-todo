'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import type { Task } from '@/lib/types/task'

interface WeekDay {
  date: string
  completed: number
  total: number
}

interface HomeClientProps {
  greeting: string
  displayName: string
  stats: {
    todayCount: number
    completedTodayCount: number
    overdueCount: number
    highPriorityCount: number
    totalActive: number
    upcomingCount: number
    weekCompletedCount: number
  }
  weekActivity: WeekDay[]
  focusTasks: Task[]
  overdueTasks: Task[]
}

const QUOTES = [
  { text: "You can do anything, but not everything.", author: "David Allen" },
  { text: "One day or day one. You decide.", author: null },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your future self will thank you for what you do today.", author: null },
  { text: "Small daily improvements lead to staggering long-term results.", author: null },
  { text: "What you do today is what matters most.", author: null },
  { text: "Don't count the days — make the days count.", author: "Muhammad Ali" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: null },
  { text: "The key is not to prioritize your schedule, but to schedule your priorities.", author: "Stephen Covey" },
]

const DAY_ABBR = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function ProgressRing({ percent, size = 96 }: { percent: number; size?: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(percent, 100) / 100) * circ
  const isComplete = percent >= 100

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      className="-rotate-90"
      aria-hidden="true"
    >
      <circle cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-white/[0.06]" />
      <circle
        cx="44" cy="44" r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={isComplete ? 0 : offset}
        className="transition-all duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isComplete ? '#34d399' : '#6366f1'} />
          <stop offset="100%" stopColor={isComplete ? '#10b981' : '#a5b4fc'} />
        </linearGradient>
      </defs>
    </svg>
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
      aria-label="Refresh"
      className={`flex size-9 items-center justify-center rounded-xl border transition-all duration-200 ${
        state === 'done'
          ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400'
          : state === 'spinning'
          ? 'border-indigo-500/20 bg-indigo-950/20 text-indigo-400'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {state === 'done' ? (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-[15px]">
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

export function HomeClient({ greeting, displayName, stats, weekActivity, focusTasks, overdueTasks }: HomeClientProps) {
  const today = new Date().toLocaleDateString('en-CA')
  const todayTotal = stats.completedTodayCount + stats.todayCount
  const todayPct = todayTotal > 0 ? Math.round((stats.completedTodayCount / todayTotal) * 100) : 0

  const quote = QUOTES[(new Date().getDate() + new Date().getMonth()) % QUOTES.length]

  const longDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[var(--color-background)]">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* Glow mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 size-[500px] rounded-full bg-indigo-600/[0.12] blur-[130px]" />
          <div className="absolute top-10 -right-20 size-[300px] rounded-full bg-violet-700/[0.08] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-9">

          {/* Top row: date + refresh */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
              {longDate}
            </p>
            <RefreshButton />
          </div>

          {/* Main hero row: text + ring */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">{greeting}</p>
              <h1 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
                {displayName}
                <span className="text-[var(--color-accent)]">.</span>
              </h1>
              <p className="mt-3 text-base text-[var(--color-text-muted)] leading-relaxed max-w-sm">
                {stats.overdueCount > 0
                  ? `${stats.overdueCount} task${stats.overdueCount !== 1 ? 's' : ''} overdue. Clear them first to stay on track.`
                  : todayTotal > 0
                  ? `${stats.completedTodayCount} of ${todayTotal} tasks done today. Keep going.`
                  : stats.totalActive > 0
                  ? `All clear today — ${stats.totalActive} task${stats.totalActive !== 1 ? 's' : ''} ready when you are.`
                  : "No tasks yet. Add something and start building momentum."}
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  href="/dashboard/tasks?v=today"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-indigo-950/60 hover:bg-indigo-500 transition-colors"
                >
                  Today&apos;s tasks
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                {stats.overdueCount > 0 && (
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-950/20 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-950/40 transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
                    {stats.overdueCount} overdue
                  </Link>
                )}
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors"
                >
                  All tasks
                </Link>
              </div>
            </div>

            {/* Progress ring */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="relative">
                <ProgressRing percent={todayPct} size={100} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold tabular-nums leading-none ${todayPct >= 100 ? 'text-emerald-400' : 'text-[var(--color-text-primary)]'}`}>
                    {todayPct}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                {todayPct >= 100 ? 'Complete' : 'Today'}
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
            <span className="text-xl leading-none text-indigo-400/50 font-serif select-none">&ldquo;</span>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">
                {quote.text}
              </p>
              {quote.author && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">— {quote.author}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ROW ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Due today', value: stats.todayCount, color: 'text-indigo-300', bg: 'bg-indigo-950/40 border-indigo-900/40' },
            { label: 'Overdue', value: stats.overdueCount, color: stats.overdueCount > 0 ? 'text-orange-400' : 'text-[var(--color-text-muted)]', bg: stats.overdueCount > 0 ? 'bg-orange-950/20 border-orange-900/30' : 'bg-[var(--color-surface)] border-[var(--color-border)]' },
            { label: 'Active', value: stats.totalActive, color: 'text-[var(--color-text-primary)]', bg: 'bg-[var(--color-surface)] border-[var(--color-border)]' },
            { label: 'This week', value: stats.weekCompletedCount, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/30' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border px-4 py-4 text-center ${s.bg}`}>
              <p className={`text-3xl font-bold tabular-nums leading-none ${s.color}`}>{s.value}</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-5 space-y-4">

        {/* Two-column: task lists + weekly chart */}
        <div className="grid md:grid-cols-[1fr_200px] gap-4">

          {/* Left: overdue + focus tasks */}
          <div className="space-y-3">

            {/* Overdue */}
            {overdueTasks.length > 0 && (
              <div className="rounded-2xl border border-orange-900/30 bg-[var(--color-surface)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-orange-900/20">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Overdue</span>
                    <span className="rounded-full bg-orange-400/15 px-1.5 text-[10px] font-bold text-orange-400">{overdueTasks.length}</span>
                  </div>
                  <Link href="/dashboard/tasks" className="text-[11px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">See all →</Link>
                </div>
                <ul>
                  {overdueTasks.map((task, i) => (
                    <li key={task.id} className={`flex items-center gap-3 px-5 py-3 ${i < overdueTasks.length - 1 ? 'border-b border-[var(--color-border)]' : ''} hover:bg-white/[0.02] transition-colors`}>
                      <div className="size-4 rounded-full border-2 border-orange-500/40 shrink-0" />
                      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate flex-1">{task.title}</span>
                      <span className="text-[11px] font-semibold text-orange-500/70 shrink-0 tabular-nums">{task.due_date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Today's focus */}
            {focusTasks.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Today&apos;s focus</span>
                  <Link href="/dashboard/tasks?v=today" className="text-[11px] font-semibold text-[var(--color-accent)] hover:text-indigo-300 transition">Manage →</Link>
                </div>
                <ul>
                  {focusTasks.map((task, i) => (
                    <li key={task.id} className={`flex items-center gap-3 px-5 py-3 ${i < focusTasks.length - 1 ? 'border-b border-[var(--color-border)]' : ''} hover:bg-white/[0.02] transition-colors group`}>
                      <div className={`size-4 rounded-full border-2 shrink-0 ${task.priority === 'high' ? 'border-orange-400/60' : 'border-[var(--color-border-strong)]'}`} />
                      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate flex-1 group-hover:text-white transition-colors">
                        {task.title}
                      </span>
                      {task.priority === 'high' && (
                        <span className="shrink-0 text-[10px] font-bold text-orange-400 border border-orange-400/20 rounded-full px-2 py-0.5 bg-orange-950/20">High</span>
                      )}
                      {task.due_time && (
                        <span className="text-[11px] text-[var(--color-text-muted)] shrink-0 tabular-nums">{task.due_time.slice(0, 5)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty state */}
            {focusTasks.length === 0 && overdueTasks.length === 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 flex flex-col items-center text-center">
                <div className="size-14 rounded-2xl bg-indigo-950/50 border border-indigo-900/30 flex items-center justify-center mb-4">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-7 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-[var(--color-text-primary)] mb-1">All clear</p>
                <p className="text-sm text-[var(--color-text-muted)] mb-5 max-w-xs">
                  Nothing here. Add your first task and start making progress.
                </p>
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-950/50"
                >
                  Add a task
                </Link>
              </div>
            )}
          </div>

          {/* Right: weekly chart */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Week</p>
              <p className="text-[11px] font-bold text-indigo-400">{stats.weekCompletedCount} done</p>
            </div>

            <div className="flex items-end justify-between gap-1 flex-1 mt-4" style={{ minHeight: '80px' }}>
              {weekActivity.map((day) => {
                const d = new Date(day.date + 'T00:00:00')
                const label = DAY_ABBR[d.getDay() === 0 ? 6 : d.getDay() - 1]
                const isToday = day.date === today
                const fillH = day.completed > 0 ? Math.min(30 + day.completed * 18, 100) : 8
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full rounded-md overflow-hidden bg-white/[0.04]" style={{ height: '64px' }}>
                      <div
                        className={`w-full rounded-md mt-auto transition-all duration-700 ${
                          isToday
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                            : day.completed > 0
                            ? 'bg-indigo-800/60'
                            : ''
                        }`}
                        style={{ height: `${fillH}%`, marginTop: `${100 - fillH}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-bold ${isToday ? 'text-indigo-400' : 'text-[var(--color-text-muted)]'}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Divider + mini stats */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border)] space-y-2">
              {[
                { label: 'Upcoming', value: stats.upcomingCount, color: 'text-sky-400' },
                { label: 'High priority', value: stats.highPriorityCount, color: stats.highPriorityCount > 0 ? 'text-orange-400' : 'text-[var(--color-text-muted)]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-muted)]">{item.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
