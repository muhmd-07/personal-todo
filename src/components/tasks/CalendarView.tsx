'use client'

import { useState } from 'react'
import type { Task } from '@/lib/types/task'
import {
  completeTaskAction,
  uncompleteTaskAction,
  deleteTaskAction,
} from '@/lib/actions/tasks'
import { useTransition } from 'react'
import { TaskEditDialog } from './TaskEditDialog'

interface CalendarViewProps {
  tasks: Task[]
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CalendarTaskRow({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition()
  const [showEdit, setShowEdit] = useState(false)
  const completed = !!task.completed_at

  function handleToggle() {
    startTransition(async () => {
      if (completed) {
        await uncompleteTaskAction(task.id)
      } else {
        await completeTaskAction(task.id)
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTaskAction(task.id)
    })
  }

  return (
    <>
      <li className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
        isPending ? 'opacity-40' : ''
      } ${completed ? 'opacity-60' : 'hover:bg-white/4'}`}>
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          className={`shrink-0 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-150 ${
            completed
              ? 'border-violet-500 bg-violet-500'
              : task.priority === 'high'
              ? 'border-orange-500/60 hover:border-orange-400'
              : 'border-[var(--color-border-strong)] hover:border-violet-500'
          }`}
        >
          {completed && (
            <svg className="size-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Priority dot */}
        {task.priority === 'high' && !completed && (
          <span className="size-1.5 rounded-full bg-orange-400 shrink-0" />
        )}

        {/* Title */}
        <span className={`flex-1 text-base font-semibold leading-snug ${
          completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'
        }`}>
          {task.title}
        </span>

        {/* Time */}
        {task.due_time && (
          <span className="text-sm text-[var(--color-text-muted)] font-medium shrink-0">
            {task.due_time.slice(0, 5)}
          </span>
        )}

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setShowEdit(true)}
            className="flex size-7 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text-primary)] transition"
          >
            <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="flex size-7 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-red-950/40 hover:text-red-400 transition"
          >
            <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </li>
      {showEdit && <TaskEditDialog task={task} onClose={() => setShowEdit(false)} />}
    </>
  )
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(now.toLocaleDateString('en-CA'))

  const today = now.toLocaleDateString('en-CA')

  // Calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  // Task counts per date
  const tasksByDate = new Map<string, Task[]>()
  for (const task of tasks) {
    if (!task.deleted_at) {
      const key = task.due_date ?? 'undated'
      if (!tasksByDate.has(key)) tasksByDate.set(key, [])
      tasksByDate.get(key)!.push(task)
    }
  }

  // Tasks for selected date
  const selectedTasks = selectedDate
    ? (tasksByDate.get(selectedDate) ?? []).sort((a, b) => {
        if (a.due_time && b.due_time) return a.due_time.localeCompare(b.due_time)
        if (a.due_time) return -1
        if (b.due_time) return 1
        // high priority first
        if (a.priority === 'high' && b.priority !== 'high') return -1
        if (b.priority === 'high' && a.priority !== 'high') return 1
        return 0
      })
    : []

  const undatedTasks = tasksByDate.get('undated') ?? []

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  function formatSelectedDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    if (dateStr === today) return 'Today'
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
    if (dateStr === tomorrow.toLocaleDateString('en-CA')) return 'Tomorrow'
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="space-y-5">
      {/* ── Calendar ─────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <button
            onClick={prevMonth}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text-primary)] transition"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className="text-base font-black text-[var(--color-text-primary)]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text-primary)] transition"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="aspect-square p-1" />

            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDate
            const dayTasks = tasksByDate.get(dateStr) ?? []
            const activeDayTasks = dayTasks.filter(t => !t.completed_at)
            const completedDayTasks = dayTasks.filter(t => !!t.completed_at)
            const hasOverdue = dateStr < today && activeDayTasks.length > 0

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square p-1.5 flex flex-col items-center transition-all duration-150 ${
                  isSelected
                    ? 'bg-violet-600/20'
                    : 'hover:bg-white/4'
                } ${i % 7 !== 6 ? 'border-r border-[var(--color-border)]' : ''} ${
                  Math.floor(i / 7) < Math.floor(cells.length / 7) - 1 ? 'border-b border-[var(--color-border)]' : ''
                }`}
              >
                <span className={`flex size-7 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  isToday
                    ? 'bg-violet-600 text-white'
                    : isSelected
                    ? 'bg-violet-500/30 text-violet-300'
                    : hasOverdue
                    ? 'text-amber-400'
                    : 'text-[var(--color-text-primary)]'
                }`}>
                  {day}
                </span>
                {/* Task indicators */}
                {(activeDayTasks.length > 0 || completedDayTasks.length > 0) && (
                  <div className="mt-1 flex gap-0.5">
                    {activeDayTasks.length > 0 && (
                      <span className={`size-1.5 rounded-full ${hasOverdue ? 'bg-amber-400' : 'bg-violet-400'}`} />
                    )}
                    {completedDayTasks.length > 0 && (
                      <span className="size-1.5 rounded-full bg-[var(--color-text-muted)]/40" />
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Selected day tasks ───────────────────────── */}
      {selectedDate && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-base font-black text-[var(--color-text-primary)]">
              {formatSelectedDate(selectedDate)}
            </h3>
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">
              {selectedTasks.length === 0 ? 'No tasks' : `${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-base text-[var(--color-text-muted)]">No tasks scheduled for this day.</p>
            </div>
          ) : (
            <ul className="px-2 py-2 space-y-0.5">
              {selectedTasks.map(task => (
                <CalendarTaskRow key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Undated tasks ──────────────────────────────── */}
      {undatedTasks.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
            <h3 className="text-base font-black text-[var(--color-text-muted)]">No due date</h3>
          </div>
          <ul className="px-2 py-2 space-y-0.5">
            {undatedTasks.filter(t => !t.completed_at).map(task => (
              <CalendarTaskRow key={task.id} task={task} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
