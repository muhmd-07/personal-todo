'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

interface StatCardProps {
  label: string
  value: number
  sub?: string
  accent?: string
  icon: React.ReactNode
  bar?: number  // 0–100 percentage for mini progress bar
}

function StatCard({ label, value, sub, accent, icon, bar }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-4xl font-black tracking-tight leading-none ${accent ?? 'text-[var(--color-text-primary)]'}`}>
            {value}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
          {sub && <p className="text-xs text-[var(--color-text-muted)]/70 mt-0.5">{sub}</p>}
        </div>
        <div className={`flex size-9 items-center justify-center rounded-xl ${accent ? 'bg-current/10' : 'bg-white/6'}`}
          style={{ color: accent ? 'inherit' : 'var(--color-text-muted)' }}>
          {icon}
        </div>
      </div>
      {bar !== undefined && (
        <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(bar, 100)}%`,
              background: accent
                ? `color-mix(in srgb, currentColor 80%, transparent)`
                : 'var(--color-accent)',
            }}
          />
        </div>
      )}
    </div>
  )
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function WeekBar({ day, isToday }: { day: WeekDay; isToday: boolean }) {
  const d = new Date(day.date + 'T00:00:00')
  const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]
  const dateNum = d.getDate()
  const pct = day.completed > 0 ? 100 : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-8 flex items-end">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-white/6" />
        {/* Fill */}
        <div
          className={`relative w-full rounded-full transition-all duration-500 ${
            isToday ? 'bg-violet-500' : day.completed > 0 ? 'bg-violet-700' : 'bg-white/10'
          }`}
          style={{ height: `${Math.max(pct, day.completed > 0 ? 40 : 15)}%` }}
        />
      </div>
      <div className="text-center">
        <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-violet-400' : 'text-[var(--color-text-muted)]'}`}>
          {dayLabel}
        </p>
        <p className={`text-sm font-black ${isToday ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
          {dateNum}
        </p>
        {day.completed > 0 && (
          <p className="text-[9px] font-bold text-violet-400">{day.completed}</p>
        )}
      </div>
    </div>
  )
}

export function HomeClient({ greeting, displayName, stats, weekActivity, focusTasks, overdueTasks }: HomeClientProps) {
  const router = useRouter()
  const today = new Date().toLocaleDateString('en-CA')

  const todayProgressPct = stats.todayCount + stats.completedTodayCount > 0
    ? Math.round((stats.completedTodayCount / (stats.completedTodayCount + stats.todayCount)) * 100)
    : 0

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">

      {/* ── Greeting ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-[var(--color-text-muted)] mb-1">{greeting}</p>
          <h1 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
            {displayName}<span className="text-[var(--color-accent)]">.</span>
          </h1>
          <p className="mt-2 text-base text-[var(--color-text-muted)] font-medium">
            {stats.todayCount === 0 && stats.overdueCount === 0
              ? "You're all caught up. Great work."
              : stats.overdueCount > 0
              ? `${stats.overdueCount} overdue task${stats.overdueCount !== 1 ? 's' : ''} need your attention.`
              : `${stats.todayCount} task${stats.todayCount !== 1 ? 's' : ''} on your plate today.`}
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          aria-label="Refresh"
          className="flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Due today"
          value={stats.todayCount}
          sub={stats.completedTodayCount > 0 ? `${stats.completedTodayCount} done` : undefined}
          bar={todayProgressPct}
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Completed today"
          value={stats.completedTodayCount}
          accent="text-violet-400"
          bar={todayProgressPct}
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          accent={stats.overdueCount > 0 ? 'text-amber-400' : undefined}
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`size-4 ${stats.overdueCount > 0 ? 'text-amber-400' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
        />
        <StatCard
          label="High priority"
          value={stats.highPriorityCount}
          accent={stats.highPriorityCount > 0 ? 'text-orange-400' : undefined}
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`size-4 ${stats.highPriorityCount > 0 ? 'text-orange-400' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.067 1.907 2.185V19.5M4.664 4.664L19.5 19.5" /></svg>}
        />
        <StatCard
          label="Upcoming (7d)"
          value={stats.upcomingCount}
          accent="text-sky-400"
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4 text-sky-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></svg>}
        />
        <StatCard
          label="Total active"
          value={stats.totalActive}
          icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
        />
      </div>

      {/* ── Week Activity Bars ───────────────────────────── */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-base font-bold text-[var(--color-text-primary)]">Weekly activity</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{stats.weekCompletedCount} tasks completed this week</p>
          </div>
          <Link href="/dashboard/tasks" className="text-xs font-bold text-[var(--color-accent)] hover:text-violet-400 transition">
            View all →
          </Link>
        </div>
        <div className="flex items-end justify-between gap-1">
          {weekActivity.map((day) => (
            <WeekBar key={day.date} day={day} isToday={day.date === today} />
          ))}
        </div>
      </div>

      {/* ── Today's progress bar ─────────────────────────── */}
      {stats.todayCount + stats.completedTodayCount > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-[var(--color-text-primary)]">Today&apos;s progress</span>
            <span className="text-base font-black text-[var(--color-accent)]">{todayProgressPct}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
              style={{ width: `${todayProgressPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
            <span>{stats.completedTodayCount} completed</span>
            <span>{stats.todayCount} remaining</span>
          </div>
        </div>
      )}

      {/* ── Overdue ──────────────────────────────────────── */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              Overdue
            </h2>
            <Link href="/dashboard/tasks" className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
              See all →
            </Link>
          </div>
          <ul className="space-y-2">
            {overdueTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3.5">
                <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-base font-semibold text-[var(--color-text-primary)] truncate flex-1">{task.title}</span>
                <span className="text-sm text-amber-400 shrink-0 font-medium">{task.due_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Today's focus ────────────────────────────────── */}
      {focusTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-text-muted)]">
              Today&apos;s focus
            </h2>
            <Link href="/dashboard/tasks" className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
              Manage tasks →
            </Link>
          </div>
          <ul className="space-y-2">
            {focusTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 hover:border-[var(--color-border-strong)] transition group">
                <span className={`size-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-orange-400' : 'bg-[var(--color-border-strong)]'}`} />
                <span className="text-base font-semibold text-[var(--color-text-primary)] truncate flex-1">{task.title}</span>
                {task.due_time && (
                  <span className="text-sm text-[var(--color-text-muted)] shrink-0 font-medium">{task.due_time.slice(0, 5)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────── */}
      {focusTasks.length === 0 && overdueTasks.length === 0 && stats.totalActive === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-900/20 mb-5">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-8 text-violet-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-2">All clear</h3>
          <p className="text-base text-[var(--color-text-muted)] mb-6">No tasks yet. Ready to get things done?</p>
          <Link
            href="/dashboard/tasks"
            className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-6 py-3 text-base font-bold text-white hover:from-violet-400 hover:to-violet-500 transition"
          >
            Add your first task
          </Link>
        </div>
      )}
    </div>
  )
}
