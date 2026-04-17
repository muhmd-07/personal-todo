'use client'

import Link from 'next/link'
import type { Task } from '@/lib/types/task'

interface WeekDay { date: string; completed: number; total: number }
interface Props {
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

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const card = 'rounded-xl border border-zinc-900 bg-zinc-950 p-5'
const label = 'text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block'

export function HomeClient({ greeting, displayName, stats, weekActivity, focusTasks, overdueTasks }: Props) {
  const today = new Date().toLocaleDateString('en-CA')
  const done  = stats.completedTodayCount
  const total = done + stats.todayCount
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hasWork = focusTasks.length > 0 || overdueTasks.length > 0

  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: 'var(--font-public-sans, var(--font-sans))' }}>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-900 px-6 py-10 max-w-5xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">{dateStr}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-2">
          {greeting},<br />{displayName}.
        </h1>
        <p className="text-zinc-500 font-medium text-sm mt-3">
          {stats.totalActive === 0
            ? 'All clear — ready for new tasks.'
            : stats.overdueCount > 0
              ? `${stats.overdueCount} overdue task${stats.overdueCount !== 1 ? 's' : ''} need attention.`
              : `${stats.todayCount} task${stats.todayCount !== 1 ? 's' : ''} queued for today.`}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* ── Stat bento grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Due Today',     value: stats.todayCount,          accent: 'white' },
            { label: 'Overdue',       value: stats.overdueCount,        accent: stats.overdueCount > 0 ? 'orange' : 'dim' },
            { label: 'Total Active',  value: stats.totalActive,         accent: 'dim' },
            { label: 'Done This Week',value: stats.weekCompletedCount,  accent: 'green' },
          ].map(({ label: lbl, value, accent }) => (
            <div key={lbl} className={`${card} flex flex-col justify-between min-h-[110px]`}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{lbl}</span>
              <span className={`text-[48px] font-extrabold tabular-nums leading-none mt-2 ${
                accent === 'white'  ? 'text-white' :
                accent === 'orange' ? 'text-orange-400' :
                accent === 'green'  ? 'text-green-400' :
                'text-zinc-700'
              }`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_260px] gap-4">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Progress bar */}
            {total > 0 && (
              <div className={card}>
                <span className={label}>Today&apos;s Progress</span>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">{done} of {total} completed</span>
                  <span className="text-sm font-bold text-white">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Overdue tasks */}
            {overdueTasks.length > 0 && (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.03] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-orange-500/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Overdue · {overdueTasks.length}</span>
                  <Link href="/dashboard/tasks" className="text-[11px] text-zinc-600 hover:text-white transition-colors">View all →</Link>
                </div>
                {overdueTasks.map((t, i) => (
                  <div key={t.id} className={`flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors ${i < overdueTasks.length - 1 ? 'border-b border-zinc-900' : ''}`}>
                    <div className="size-3 rounded-full border border-orange-500/40 shrink-0" />
                    <span className="text-sm text-zinc-400 flex-1 truncate">{t.title}</span>
                    <span className="text-xs text-orange-500/50 shrink-0">{t.due_date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Today's tasks */}
            {focusTasks.length > 0 && (
              <div className="rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900">
                  <span className={label} style={{ marginBottom: 0 }}>Today&apos;s Focus</span>
                  <Link href="/dashboard/tasks?v=today" className="text-[11px] text-zinc-600 hover:text-white transition-colors">Manage →</Link>
                </div>
                {focusTasks.map((t, i) => (
                  <div key={t.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${i < focusTasks.length - 1 ? 'border-b border-zinc-900/50' : ''}`}>
                    <div className={`size-3.5 rounded-full border shrink-0 ${t.priority === 'high' ? 'border-orange-500/50' : 'border-zinc-800'}`} />
                    <span className="text-sm text-zinc-300 flex-1 truncate">{t.title}</span>
                    {t.priority === 'high' && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 shrink-0">High</span>
                    )}
                    {t.due_time && <span className="text-xs text-zinc-700 shrink-0">{t.due_time.slice(0, 5)}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!hasWork && (
              <div className={`${card} flex flex-col items-center text-center py-12`}>
                <div className="size-14 rounded-xl border border-green-500/20 bg-green-500/[0.06] flex items-center justify-center mb-5">
                  <svg fill="none" stroke="#22c55e" strokeWidth="1.75" viewBox="0 0 24 24" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-white mb-1">All clear</h3>
                <p className="text-sm text-zinc-600 mb-7">No tasks due today. Add something to get started.</p>
                <Link href="/dashboard/create"
                  className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Task
                </Link>
              </div>
            )}

            {/* CTA */}
            {hasWork && (
              <Link href="/dashboard/create"
                className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-xl text-sm tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                ADD TASK
              </Link>
            )}
          </div>

          {/* ── Right column ─────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Week activity */}
            <div className={card}>
              <div className="flex items-center justify-between mb-5">
                <span className={label} style={{ marginBottom: 0 }}>Activity · 7 Days</span>
                <span className="text-sm font-bold text-green-400">{stats.weekCompletedCount} done</span>
              </div>
              <div className="flex items-end justify-between gap-1.5" style={{ height: 80 }}>
                {weekActivity.map((day) => {
                  const d = new Date(day.date + 'T00:00:00')
                  const lbl = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
                  const isToday = day.date === today
                  const maxH = 60
                  const h = day.completed > 0 ? Math.min(12 + day.completed * 14, maxH) : 4
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full rounded-md overflow-hidden flex flex-col justify-end bg-zinc-900" style={{ height: `${maxH}px` }}>
                        <div className="w-full rounded-md transition-all duration-500"
                          style={{
                            height: `${h}px`,
                            background: isToday ? '#ffffff' : day.completed > 0 ? 'rgba(255,255,255,0.25)' : 'transparent',
                          }} />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wide ${isToday ? 'text-white' : 'text-zinc-800'}`}>{lbl}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900 overflow-hidden">
              {[
                { label: 'High Priority', value: stats.highPriorityCount,    color: stats.highPriorityCount > 0 ? 'text-orange-400' : 'text-zinc-700' },
                { label: 'Next 7 Days',   value: stats.upcomingCount,        color: 'text-zinc-400' },
                { label: 'Done Today',    value: stats.completedTodayCount,  color: 'text-green-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4">
                  <span className="text-xs text-zinc-600 font-medium">{item.label}</span>
                  <span className={`text-2xl font-extrabold tabular-nums ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/dashboard/focus', label: 'Focus Mode' },
                { href: '/dashboard/ai',   label: 'AI Assistant' },
              ].map(({ href, label: lbl }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-3.5 text-xs font-semibold text-zinc-500 hover:border-zinc-700 hover:text-white transition-all">
                  {lbl}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
