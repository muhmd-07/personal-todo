'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import type { Task } from '@/lib/types/task'

interface WeekDay { date: string; completed: number; total: number }
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
  { q: "You can do anything, but not everything.", by: "David Allen" },
  { q: "One day or day one — you decide.", by: null },
  { q: "Done is better than perfect.", by: "Sheryl Sandberg" },
  { q: "Focus on being productive instead of busy.", by: "Tim Ferriss" },
  { q: "The secret of getting ahead is getting started.", by: "Mark Twain" },
  { q: "Small daily wins lead to massive results.", by: null },
  { q: "What you do today shapes your tomorrow.", by: null },
  { q: "Your only competition is who you were yesterday.", by: null },
  { q: "Discipline is choosing what you want most over what you want now.", by: null },
  { q: "The key is to schedule your priorities, not prioritize your schedule.", by: "Stephen Covey" },
  { q: "Don't count the days — make the days count.", by: "Muhammad Ali" },
]

const DAY = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function Ring({ pct }: { pct: number }) {
  const r = 40, c = 2 * Math.PI * r
  const done = pct >= 100
  return (
    <svg width="108" height="108" viewBox="0 0 96 96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="6" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke={done ? '#4ade80' : '#38bdf8'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (Math.min(pct, 100) / 100) * c}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)', filter: done ? 'drop-shadow(0 0 8px #4ade80)' : 'drop-shadow(0 0 8px #38bdf8)' }}
      />
    </svg>
  )
}

function Refresh() {
  const router = useRouter()
  const [s, setS] = useState<'idle' | 'spin' | 'ok'>('idle')
  const go = useCallback(() => {
    if (s !== 'idle') return
    setS('spin'); router.refresh()
    setTimeout(() => setS('ok'), 900); setTimeout(() => setS('idle'), 1600)
  }, [router, s])
  return (
    <button onClick={go} aria-label="Refresh" className="flex size-9 items-center justify-center rounded-xl border transition-all" style={{ borderColor: '#0a2040', background: '#041428', color: '#3d6080' }}>
      {s === 'ok'
        ? <svg fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        : <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`size-4 ${s === 'spin' ? 'animate-spin' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
      }
    </button>
  )
}

export function HomeClient({ greeting, displayName, stats, weekActivity, focusTasks, overdueTasks }: HomeClientProps) {
  const today = new Date().toLocaleDateString('en-CA')
  const total = stats.completedTodayCount + stats.todayCount
  const pct = total > 0 ? Math.round((stats.completedTodayCount / total) * 100) : 0
  const q = QUOTES[(new Date().getDate() + new Date().getMonth() * 7) % QUOTES.length]
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#020c1e' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0a2040' }}>
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '40px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative mx-auto" style={{ maxWidth: '720px', padding: '2.5rem 1.5rem 2rem' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#3d6080' }}>
              {dateStr}
            </p>
            <Refresh />
          </div>

          {/* Hero row */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            {/* Text */}
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#38bdf8', marginBottom: '8px', letterSpacing: '0.02em' }}>
                {greeting} 👋
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#cfe3ff',
                marginBottom: '12px',
              }}>
                {displayName}
                <span style={{ color: '#38bdf8' }}>.</span>
              </h1>

              <p style={{ fontSize: '15px', color: '#3d6080', lineHeight: 1.6, maxWidth: '380px', marginBottom: '24px' }}>
                {stats.overdueCount > 0
                  ? `${stats.overdueCount} task${stats.overdueCount !== 1 ? 's' : ''} overdue — clear them to stay on track.`
                  : total > 0
                  ? `${stats.completedTodayCount} of ${total} tasks done today. Keep the momentum.`
                  : stats.totalActive > 0
                  ? `All clear today. ${stats.totalActive} tasks waiting when you're ready.`
                  : `Clean slate. What do you want to achieve today?`}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard/tasks?v=today" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(14,165,233,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}>
                  Today&apos;s tasks
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>

                {stats.overdueCount > 0 && (
                  <Link href="/dashboard/tasks" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                    background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)',
                    color: '#fb923c', textDecoration: 'none',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fb923c', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    {stats.overdueCount} overdue
                  </Link>
                )}

                <Link href="/dashboard/tasks" style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  background: 'rgba(56,189,248,0.06)', border: '1px solid #0a2040',
                  color: '#3d6080', textDecoration: 'none',
                }}>
                  All tasks
                </Link>
              </div>
            </div>

            {/* Progress ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ position: 'relative', width: '108px', height: '108px' }}>
                <Ring pct={pct} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px', fontWeight: 800,
                    color: pct >= 100 ? '#4ade80' : '#cfe3ff',
                    lineHeight: 1,
                  }}>
                    {pct}%
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3d6080' }}>
                {pct >= 100 ? '✓ Done' : 'Today'}
              </p>
            </div>
          </div>

          {/* Quote banner */}
          <div style={{
            marginTop: '28px',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(56,189,248,0.04)',
            border: '1px solid rgba(56,189,248,0.12)',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}>
            <span style={{ fontSize: '22px', color: 'rgba(56,189,248,0.4)', fontFamily: 'Georgia, serif', lineHeight: 1, marginTop: '-2px', flexShrink: 0 }}>&ldquo;</span>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#7fb9d8', lineHeight: 1.6, fontStyle: 'italic' }}>{q.q}</p>
              {q.by && <p style={{ marginTop: '4px', fontSize: '12px', color: '#3d6080' }}>— {q.by}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS ROW ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { n: stats.todayCount, l: 'Due Today', c: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.15)' },
            { n: stats.overdueCount, l: 'Overdue', c: stats.overdueCount > 0 ? '#fb923c' : '#3d6080', bg: stats.overdueCount > 0 ? 'rgba(251,146,60,0.08)' : 'rgba(56,189,248,0.03)', border: stats.overdueCount > 0 ? 'rgba(251,146,60,0.2)' : '#0a2040' },
            { n: stats.totalActive, l: 'Total Active', c: '#cfe3ff', bg: 'rgba(56,189,248,0.03)', border: '#0a2040' },
            { n: stats.weekCompletedCount, l: 'Done This Week', c: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)' },
          ].map((s) => (
            <div key={s.l} style={{
              padding: '16px 14px', borderRadius: '16px',
              background: s.bg, border: `1px solid ${s.border}`,
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: '6px' }}>{s.n}</p>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3d6080' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.25rem 1.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Today progress bar */}
        {total > 0 && (
          <div style={{ borderRadius: '16px', border: '1px solid #0a2040', background: '#041428', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#cfe3ff' }}>Today&apos;s Progress</p>
                <p style={{ fontSize: '12px', color: '#3d6080', marginTop: '2px' }}>
                  {stats.completedTodayCount} completed · {stats.todayCount} remaining
                </p>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: pct >= 100 ? '#4ade80' : '#38bdf8' }}>{pct}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(56,189,248,0.08)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                width: `${pct}%`,
                background: pct >= 100
                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                  : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                boxShadow: pct >= 100 ? '0 0 10px rgba(74,222,128,0.5)' : '0 0 10px rgba(56,189,248,0.5)',
              }} />
            </div>
            {pct >= 100 && (
              <p style={{ marginTop: '10px', fontSize: '13px', fontWeight: 600, color: '#4ade80' }}>
                🎉 All done for today. Excellent work!
              </p>
            )}
          </div>
        )}

        {/* Two-column: tasks + chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '16px' }}>

          {/* Tasks column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Overdue */}
            {overdueTasks.length > 0 && (
              <div style={{ borderRadius: '16px', border: '1px solid rgba(251,146,60,0.2)', background: 'rgba(251,146,60,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(251,146,60,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#fb923c', boxShadow: '0 0 6px #fb923c' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fb923c' }}>Overdue</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#fb923c', background: 'rgba(251,146,60,0.15)', borderRadius: '99px', padding: '1px 8px' }}>{overdueTasks.length}</span>
                  </div>
                  <Link href="/dashboard/tasks" style={{ fontSize: '12px', fontWeight: 600, color: '#3d6080', textDecoration: 'none' }}>See all →</Link>
                </div>
                {overdueTasks.map((t, i) => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 16px',
                    borderBottom: i < overdueTasks.length - 1 ? '1px solid rgba(251,146,60,0.08)' : 'none',
                  }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(251,146,60,0.4)', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#cfe3ff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    <span style={{ fontSize: '11px', color: '#fb923c', flexShrink: 0 }}>{t.due_date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Focus tasks */}
            {focusTasks.length > 0 && (
              <div style={{ borderRadius: '16px', border: '1px solid #0a2040', background: '#041428', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #0a2040' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3d6080' }}>Today&apos;s Focus</span>
                  <Link href="/dashboard/tasks?v=today" style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8', textDecoration: 'none' }}>Manage →</Link>
                </div>
                {focusTasks.map((t, i) => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '11px 16px',
                    borderBottom: i < focusTasks.length - 1 ? '1px solid #0a2040' : 'none',
                  }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${t.priority === 'high' ? '#fb923c' : '#123058'}`,
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#cfe3ff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    {t.priority === 'high' && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fb923c', background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '99px', padding: '2px 8px', flexShrink: 0 }}>HIGH</span>
                    )}
                    {t.due_time && <span style={{ fontSize: '11px', color: '#3d6080', flexShrink: 0 }}>{t.due_time.slice(0, 5)}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {focusTasks.length === 0 && overdueTasks.length === 0 && (
              <div style={{ borderRadius: '16px', border: '1px solid #0a2040', background: '#041428', padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg fill="none" stroke="#38bdf8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#cfe3ff', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>All clear</p>
                <p style={{ fontSize: '13px', color: '#3d6080', marginBottom: '20px' }}>Nothing here. Start building momentum.</p>
                <Link href="/dashboard/tasks" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
                }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Add a task
                </Link>
              </div>
            )}
          </div>

          {/* Weekly chart */}
          <div style={{ borderRadius: '16px', border: '1px solid #0a2040', background: '#041428', padding: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3d6080', marginBottom: '4px' }}>This Week</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>{stats.weekCompletedCount} <span style={{ fontSize: '12px', fontWeight: 500, color: '#3d6080' }}>done</span></p>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', height: '72px' }}>
              {weekActivity.map((day) => {
                const d = new Date(day.date + 'T00:00:00')
                const label = DAY[d.getDay() === 0 ? 6 : d.getDay() - 1]
                const isToday = day.date === today
                const h = day.completed > 0 ? Math.min(24 + day.completed * 16, 72) : 8
                return (
                  <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <div style={{ width: '100%', height: '72px', borderRadius: '8px', background: 'rgba(56,189,248,0.05)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                      <div style={{
                        width: '100%', borderRadius: '6px',
                        height: `${h}px`,
                        background: isToday
                          ? 'linear-gradient(to top, #0ea5e9, #38bdf8)'
                          : day.completed > 0 ? 'rgba(56,189,248,0.35)' : 'transparent',
                        boxShadow: isToday ? '0 0 8px rgba(56,189,248,0.5)' : 'none',
                        transition: 'height 0.6s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: isToday ? '#38bdf8' : '#3d6080' }}>{label}</span>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #0a2040', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { l: 'Upcoming', v: stats.upcomingCount, c: '#7dd3fc' },
                { l: 'High priority', v: stats.highPriorityCount, c: stats.highPriorityCount > 0 ? '#fb923c' : '#3d6080' },
              ].map(i => (
                <div key={i.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#3d6080' }}>{i.l}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: i.c, fontFamily: 'var(--font-display)' }}>{i.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
