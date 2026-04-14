'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Task } from '@/lib/types/task'

interface HomeClientProps {
  greeting: string
  displayName: string
  stats: {
    todayCount: number
    completedTodayCount: number
    overdueCount: number
    highPriorityCount: number
    totalActive: number
  }
  focusTasks: Task[]
  overdueTasks: Task[]
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
      <p className={`text-3xl font-black tracking-tight ${accent ?? 'text-[var(--color-text-primary)]'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
    </div>
  )
}

export function HomeClient({ greeting, displayName, stats, focusTasks, overdueTasks }: HomeClientProps) {
  const router = useRouter()
  const progressPct = stats.todayCount + stats.completedTodayCount > 0
    ? Math.round((stats.completedTodayCount / (stats.completedTodayCount + stats.todayCount)) * 100)
    : 0

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
            {greeting},<br />
            <span className="text-[var(--color-accent)]">{displayName}.</span>
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            {stats.todayCount === 0 && stats.overdueCount === 0
              ? "You're all caught up. Great work."
              : stats.overdueCount > 0
              ? `You have ${stats.overdueCount} overdue task${stats.overdueCount !== 1 ? 's' : ''} to clear.`
              : `${stats.todayCount} task${stats.todayCount !== 1 ? 's' : ''} on your plate today.`}
          </p>
        </div>
        <button
          onClick={() => router.refresh()}
          aria-label="Refresh"
          className="flex size-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Today" value={stats.todayCount} />
        <StatCard label="Done today" value={stats.completedTodayCount} accent="text-violet-400" />
        <StatCard label="Overdue" value={stats.overdueCount} accent={stats.overdueCount > 0 ? 'text-[var(--color-overdue)]' : undefined} />
        <StatCard label="High priority" value={stats.highPriorityCount} accent={stats.highPriorityCount > 0 ? 'text-orange-400' : undefined} />
      </div>

      {/* Progress bar */}
      {stats.todayCount + stats.completedTodayCount > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Today&apos;s progress</span>
            <span className="text-sm font-black text-[var(--color-accent)]">{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {stats.completedTodayCount} of {stats.completedTodayCount + stats.todayCount} tasks completed
          </p>
        </div>
      )}

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-overdue)]">
              Overdue
            </h2>
            <Link href="/dashboard/tasks" className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
              See all →
            </Link>
          </div>
          <ul className="space-y-2">
            {overdueTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-amber-900/40 bg-amber-950/20 px-4 py-3"
              >
                <span className="size-1.5 rounded-full bg-[var(--color-overdue)] shrink-0" />
                <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1">
                  {task.title}
                </span>
                <span className="text-xs text-[var(--color-overdue)] shrink-0">
                  {task.due_date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Today's focus */}
      {focusTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Today&apos;s focus
            </h2>
            <Link href="/dashboard/tasks" className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
              Manage tasks →
            </Link>
          </div>
          <ul className="space-y-2">
            {focusTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 hover:border-[var(--color-border-strong)] transition"
              >
                {task.priority === 'high' && (
                  <span className="size-1.5 rounded-full bg-orange-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate flex-1">
                  {task.title}
                </span>
                {task.due_time && (
                  <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                    {task.due_time.slice(0, 5)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {focusTasks.length === 0 && overdueTasks.length === 0 && stats.totalActive === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-900/20 mb-4">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-7 text-violet-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">All clear</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-5">No tasks yet. Ready to get things done?</p>
          <Link
            href="/dashboard/tasks"
            className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:from-violet-400 hover:to-violet-500 transition"
          >
            Add your first task
          </Link>
        </div>
      )}
    </div>
  )
}
