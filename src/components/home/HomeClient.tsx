'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
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
  { text: "Small steps every day add up to big results.", author: "Anonymous" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on progress, not perfection.", author: "Anonymous" },
  { text: "One task at a time. That's all it takes.", author: "Anonymous" },
  { text: "You don't need more time — you need more focus.", author: "Anonymous" },
  { text: "Every completed task is a step closer to your goal.", author: "Anonymous" },
  { text: "Your future self will thank you for what you do today.", author: "Anonymous" },
]

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
      title="Refresh"
      className={`flex size-9 items-center justify-center rounded-xl border transition-all duration-200 ${
        state === 'done'
          ? 'border-blue-500/50 bg-blue-900/30 text-blue-400'
          : state === 'spinning'
          ? 'border-blue-500/30 bg-blue-900/20 text-blue-400'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {state === 'done' ? (
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
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

  const todayProgressPct = stats.todayCount + stats.completedTodayCount > 0
    ? Math.round((stats.completedTodayCount / (stats.completedTodayCount + stats.todayCount)) * 100)
    : 0

  // Pick a daily quote (changes each day, stable per session)
  const [quoteIndex] = useState(() => {
    const seed = new Date().getDate() + new Date().getMonth() * 31
    return seed % QUOTES.length
  })
  const quote = QUOTES[quoteIndex]

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-20 size-[480px] rounded-full bg-blue-700/12 blur-[120px]" />
          <div className="absolute top-0 right-0 size-[320px] rounded-full bg-indigo-700/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">

              {/* Date line */}
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                {todayDate}
              </p>

              {/* Greeting + name */}
              <h1 className="text-[2.6rem] font-extrabold tracking-tight leading-[1.1] text-[var(--color-text-primary)]">
                {greeting},{' '}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>

              {/* Status line */}
              <p className="mt-3 text-base text-[var(--color-text-muted)] font-medium">
                {stats.overdueCount > 0
                  ? `${stats.overdueCount} overdue task${stats.overdueCount !== 1 ? 's' : ''} need your attention.`
                  : stats.todayCount > 0
                  ? `You have ${stats.todayCount} task${stats.todayCount !== 1 ? 's' : ''} for today. You've got this.`
                  : stats.totalActive > 0
                  ? `All caught up today — ${stats.totalActive} active task${stats.totalActive !== 1 ? 's' : ''} in your list.`
                  : "Nothing on the plate. Add your first task below."}
              </p>

              {/* Quote strip */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-4 text-blue-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed italic">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  {quote.author !== 'Anonymous' && (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">— {quote.author}</p>
                  )}
                </div>
              </div>

              {/* CTA row */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/dashboard/tasks?v=today"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all duration-200"
                >
                  Today&apos;s tasks
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                {stats.overdueCount > 0 && (
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-600/40 bg-amber-950/20 px-4 py-2.5 text-sm font-bold text-amber-400 hover:bg-amber-950/40 transition-all duration-200"
                  >
                    {stats.overdueCount} overdue
                  </Link>
                )}
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-200"
                >
                  All tasks
                </Link>
              </div>
            </div>

            <RefreshButton />
          </div>
        </div>

        {/* ── Stat bar ── */}
        <div className="relative mx-auto max-w-3xl px-6 pb-8">
          <div className="grid grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)]">
            {[
              { label: 'Due today', value: stats.todayCount, color: stats.todayCount > 0 ? 'text-blue-300' : 'text-[var(--color-text-muted)]' },
              { label: 'Overdue', value: stats.overdueCount, color: stats.overdueCount > 0 ? 'text-amber-400' : 'text-[var(--color-text-muted)]' },
              { label: 'Done today', value: stats.completedTodayCount, color: 'text-green-400' },
              { label: 'This week', value: stats.weekCompletedCount, color: 'text-indigo-400' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 bg-[var(--color-surface)] px-3 py-4 text-center">
                <p className={`text-3xl font-extrabold leading-none tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-7 space-y-5">

        {/* ── Today's progress ── */}
        {stats.todayCount + stats.completedTodayCount > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">Today&apos;s progress</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {stats.completedTodayCount} done · {stats.todayCount} remaining
                  </p>
                </div>
                <span className={`text-2xl font-extrabold tabular-nums ${todayProgressPct === 100 ? 'text-green-400' : 'text-blue-400'}`}>
                  {todayProgressPct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    todayProgressPct === 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-400'
                  }`}
                  style={{ width: `${todayProgressPct}%` }}
                />
              </div>
            </div>
            {todayProgressPct === 100 && (
              <div className="border-t border-green-900/30 bg-green-950/20 px-5 py-2.5 flex items-center gap-2">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4 text-green-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-400">All done for today — great work!</span>
              </div>
            )}
          </section>
        )}

        {/* ── Two-column: stats + weekly activity ── */}
        <div className="grid md:grid-cols-5 gap-4">

          {/* Stats (narrower) */}
          <section className="md:col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Your tasks</p>
            </div>
            {[
              { icon: '📋', label: 'Total active', value: stats.totalActive, color: 'text-[var(--color-text-primary)]' },
              { icon: '🔥', label: 'High priority', value: stats.highPriorityCount, color: stats.highPriorityCount > 0 ? 'text-orange-400' : 'text-[var(--color-text-muted)]' },
              { icon: '📅', label: 'Next 7 days', value: stats.upcomingCount, color: 'text-blue-400' },
              { icon: '✅', label: 'Done today', value: stats.completedTodayCount, color: 'text-green-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] last:border-b-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)]">{item.label}</span>
                </div>
                <span className={`text-base font-extrabold tabular-nums ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </section>

          {/* Weekly activity (wider) */}
          <section className="md:col-span-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Week activity</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {stats.weekCompletedCount} task{stats.weekCompletedCount !== 1 ? 's' : ''} completed
                </p>
              </div>
              <Link href="/dashboard/tasks" className="text-xs font-bold text-[var(--color-accent)] hover:text-blue-300 transition">
                View all →
              </Link>
            </div>
            <div className="flex items-end justify-between gap-1 flex-1">
              {weekActivity.map((day) => {
                const d = new Date(day.date + 'T00:00:00')
                const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]
                const dateNum = d.getDate()
                const isToday = day.date === today
                const fillPct = day.completed > 0 ? Math.min(20 + day.completed * 20, 100) : 10
                return (
                  <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="relative w-full flex items-end rounded-lg overflow-hidden bg-white/[0.04]" style={{ height: '64px' }}>
                      <div
                        className={`w-full rounded-lg transition-all duration-700 ${
                          isToday
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                            : day.completed > 0
                            ? 'bg-blue-800/70'
                            : 'bg-white/[0.03]'
                        }`}
                        style={{ height: `${fillPct}%` }}
                      />
                    </div>
                    <p className={`text-[9px] font-bold uppercase tracking-wide ${isToday ? 'text-blue-400' : 'text-[var(--color-text-muted)]'}`}>
                      {dayLabel}
                    </p>
                    <p className={`text-[11px] font-extrabold leading-none ${isToday ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                      {dateNum}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* ── Overdue ── */}
        {overdueTasks.length > 0 && (
          <section className="rounded-2xl border border-amber-800/30 bg-amber-950/10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-800/20">
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm font-bold text-amber-400">Overdue</p>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">{overdueTasks.length}</span>
              </div>
              <Link href="/dashboard/tasks" className="text-xs font-semibold text-amber-500/60 hover:text-amber-400 transition">
                See all →
              </Link>
            </div>
            <ul className="divide-y divide-amber-900/15">
              {overdueTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-amber-950/15 transition-colors">
                  <span className="size-1.5 rounded-full bg-amber-500/60 shrink-0" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1">{task.title}</span>
                  <span className="text-xs font-medium text-amber-500/80 shrink-0 tabular-nums">{task.due_date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Today's focus ── */}
        {focusTasks.length > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">Today&apos;s focus</p>
              </div>
              <Link href="/dashboard/tasks?v=today" className="text-xs font-bold text-[var(--color-accent)] hover:text-blue-300 transition">
                Manage →
              </Link>
            </div>
            <ul className="divide-y divide-[var(--color-border)]">
              {focusTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group">
                  <span className={`size-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-orange-400' : 'bg-[var(--color-border-strong)]'}`} />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1">
                    {task.title}
                  </span>
                  {task.due_time && (
                    <span className="text-xs font-medium text-[var(--color-text-muted)] shrink-0 tabular-nums">
                      {task.due_time.slice(0, 5)}
                    </span>
                  )}
                  {task.priority === 'high' && (
                    <span className="shrink-0 rounded-full bg-orange-400/12 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                      High
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Empty state ── */}
        {focusTasks.length === 0 && overdueTasks.length === 0 && stats.totalActive === 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 flex flex-col items-center text-center">
            <div className="text-4xl mb-5">🎉</div>
            <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Clean slate</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-1 max-w-xs">
              No tasks yet. Start by adding something you want to accomplish.
            </p>
            <p className="text-xs text-[var(--color-text-muted)]/60 italic mb-7 max-w-xs">
              &ldquo;A goal without a plan is just a wish.&rdquo;
            </p>
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add your first task
            </Link>
          </section>
        )}

      </div>
    </div>
  )
}
