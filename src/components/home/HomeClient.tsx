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

  const heroSubtext = stats.overdueCount > 0
    ? `You have ${stats.overdueCount} overdue task${stats.overdueCount !== 1 ? 's' : ''} that need attention.`
    : stats.todayCount > 0
    ? `${stats.todayCount} task${stats.todayCount !== 1 ? 's' : ''} scheduled for today. Let's get them done.`
    : "You're all caught up. Ready to plan what's next?"

  return (
    <div className="min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        {/* Background gradient mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute -top-16 right-0 size-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-indigo-600/6 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 py-14 pb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Eyebrow */}
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300 tracking-wide uppercase">
                <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
                {greeting}
              </p>

              {/* Headline */}
              <h1 className="text-5xl font-black tracking-tight leading-[1.1] text-[var(--color-text-primary)]">
                Hey,{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  {displayName}
                </span>
                .
              </h1>

              {/* Sub */}
              <p className="mt-4 text-lg text-[var(--color-text-muted)] max-w-md leading-relaxed font-medium">
                {heroSubtext}
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/tasks?v=today"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  View today&apos;s tasks
                </Link>
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-border-strong)] transition-all duration-200"
                >
                  All tasks
                </Link>
              </div>
            </div>

            <RefreshButton />
          </div>

          {/* ── Big stat callouts — Atlassian style ── */}
          <div className="mt-10 grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)]">
            <div className="flex flex-col items-center justify-center gap-1 bg-[var(--color-surface)] px-4 py-5 text-center">
              <p className={`text-4xl font-black tracking-tight leading-none ${stats.todayCount > 0 ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                {stats.todayCount}
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Due today</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 bg-[var(--color-surface)] px-4 py-5 text-center">
              <p className={`text-4xl font-black tracking-tight leading-none ${stats.overdueCount > 0 ? 'text-amber-400' : 'text-[var(--color-text-muted)]'}`}>
                {stats.overdueCount}
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Overdue</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 bg-[var(--color-surface)] px-4 py-5 text-center">
              <p className="text-4xl font-black tracking-tight leading-none text-violet-400">
                {stats.weekCompletedCount}
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Done this week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">

        {/* ── Today's progress ──────────────────────────────────────────── */}
        {stats.todayCount + stats.completedTodayCount > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text-primary)]">Today&apos;s progress</h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                    {stats.completedTodayCount} of {stats.completedTodayCount + stats.todayCount} tasks complete
                  </p>
                </div>
                <span className={`text-3xl font-black tracking-tight ${todayProgressPct === 100 ? 'text-green-400' : 'text-violet-400'}`}>
                  {todayProgressPct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    todayProgressPct === 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-400'
                  }`}
                  style={{ width: `${todayProgressPct}%` }}
                />
              </div>
            </div>
            {todayProgressPct === 100 && (
              <div className="border-t border-[var(--color-border)] bg-green-950/20 px-6 py-3 flex items-center gap-2">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-400">All done for today — great work!</span>
              </div>
            )}
          </section>
        )}

        {/* ── Two-column: Stats cards + Week activity ───────────────────── */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Stat cards */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
            <div className="px-5 py-4">
              <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Overview</h2>
            </div>
            {[
              {
                label: 'Total active tasks',
                value: stats.totalActive,
                icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
                color: 'text-[var(--color-text-primary)]',
              },
              {
                label: 'High priority',
                value: stats.highPriorityCount,
                icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.067 1.907 2.185V19.5M4.664 4.664L19.5 19.5" /></svg>,
                color: stats.highPriorityCount > 0 ? 'text-orange-400' : 'text-[var(--color-text-muted)]',
              },
              {
                label: 'Upcoming (next 7 days)',
                value: stats.upcomingCount,
                icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></svg>,
                color: 'text-sky-400',
              },
              {
                label: 'Completed today',
                value: stats.completedTodayCount,
                icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                color: 'text-violet-400',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-text-muted)]">{item.icon}</span>
                  <span className="text-sm font-medium text-[var(--color-text-muted)]">{item.label}</span>
                </div>
                <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </section>

          {/* Week activity */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Weekly activity</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{stats.weekCompletedCount} completed</p>
              </div>
              <Link href="/dashboard/tasks" className="text-xs font-bold text-[var(--color-accent)] hover:text-violet-300 transition">
                View all →
              </Link>
            </div>
            <div className="flex items-end justify-between gap-1 flex-1">
              {weekActivity.map((day) => {
                const d = new Date(day.date + 'T00:00:00')
                const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]
                const dateNum = d.getDate()
                const isToday = day.date === today
                return (
                  <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative w-full flex items-end" style={{ height: '72px' }}>
                      <div className="absolute inset-x-[20%] inset-0 rounded-full bg-white/[0.04]" />
                      <div
                        className={`relative inset-x-[20%] w-full rounded-full transition-all duration-500 ${
                          isToday ? 'bg-violet-500' : day.completed > 0 ? 'bg-violet-700/70' : 'bg-white/[0.06]'
                        }`}
                        style={{ height: `${Math.max(day.completed > 0 ? 45 : 12, 12)}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${isToday ? 'text-violet-400' : 'text-[var(--color-text-muted)]'}`}>
                        {dayLabel}
                      </p>
                      <p className={`text-xs font-black ${isToday ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                        {dateNum}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* ── Overdue tasks ─────────────────────────────────────────────── */}
        {overdueTasks.length > 0 && (
          <section className="rounded-2xl border border-amber-900/40 bg-amber-950/10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/30">
              <div className="flex items-center gap-2.5">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-amber-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h2 className="text-sm font-bold text-amber-400">Overdue</h2>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  {overdueTasks.length}
                </span>
              </div>
              <Link href="/dashboard/tasks" className="text-xs font-bold text-amber-500/70 hover:text-amber-400 transition">
                See all →
              </Link>
            </div>
            <ul className="divide-y divide-amber-900/20">
              {overdueTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-950/20 transition-colors">
                  <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1">{task.title}</span>
                  <span className="text-xs font-medium text-amber-500 shrink-0 tabular-nums">{task.due_date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Today's focus ─────────────────────────────────────────────── */}
        {focusTasks.length > 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-violet-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Today&apos;s focus</h2>
              </div>
              <Link href="/dashboard/tasks?v=today" className="text-xs font-bold text-[var(--color-accent)] hover:text-violet-300 transition">
                Manage →
              </Link>
            </div>
            <ul className="divide-y divide-[var(--color-border)]">
              {focusTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
                  <span className={`size-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-orange-400' : 'bg-[var(--color-border-strong)]'}`} />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1 group-hover:text-white transition-colors">
                    {task.title}
                  </span>
                  {task.due_time && (
                    <span className="text-xs font-medium text-[var(--color-text-muted)] shrink-0 tabular-nums">
                      {task.due_time.slice(0, 5)}
                    </span>
                  )}
                  {task.priority === 'high' && (
                    <span className="shrink-0 rounded-full bg-orange-400/15 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                      High
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {focusTasks.length === 0 && overdueTasks.length === 0 && stats.totalActive === 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-900/20 mb-5 border border-violet-800/30">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-8 text-violet-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">All clear</h3>
            <p className="text-base text-[var(--color-text-muted)] mb-7 max-w-xs">
              No tasks yet. Start adding things you want to get done.
            </p>
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 transition-all"
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
