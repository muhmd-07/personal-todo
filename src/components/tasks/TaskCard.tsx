'use client'

import { useTransition, useState, useOptimistic } from 'react'
import {
  completeTaskAction,
  uncompleteTaskAction,
  deleteTaskAction,
  rescheduleTaskAction,
} from '@/lib/actions/tasks'
import { TaskEditDialog } from './TaskEditDialog'
import type { Task } from '@/lib/types/task'

interface TaskCardProps {
  task: Task
}

function isOverdue(task: Task, completed: boolean): boolean {
  if (!task.due_date || completed) return false
  const today = new Date().toLocaleDateString('en-CA')
  return task.due_date < today
}

function formatDueDate(task: Task): string {
  if (!task.due_date) return ''
  const today = new Date().toLocaleDateString('en-CA')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA')

  if (task.due_date === today) {
    return task.due_time ? `Today · ${task.due_time.slice(0, 5)}` : 'Today'
  }
  if (task.due_date === tomorrowStr) {
    return task.due_time ? `Tomorrow · ${task.due_time.slice(0, 5)}` : 'Tomorrow'
  }

  const date = new Date(task.due_date + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return task.due_time ? `${formatted} · ${task.due_time.slice(0, 5)}` : formatted
}

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(!!task.completed_at)
  const overdue = isOverdue(task, optimisticCompleted)
  const completed = optimisticCompleted

  function handleToggleComplete() {
    startTransition(async () => {
      setOptimisticCompleted(!completed)
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
      setShowDeleteConfirm(false)
    })
  }

  function handleRescheduleToday() {
    const today = new Date().toLocaleDateString('en-CA')
    startTransition(async () => {
      await rescheduleTaskAction(task.id, today)
    })
  }

  return (
    <li
      className={`
        task-fade-in group relative flex items-center gap-3 px-2 py-[9px] rounded-lg
        transition-colors duration-150 cursor-default
        ${isPending ? 'opacity-40 pointer-events-none' : ''}
        ${overdue && !completed
          ? 'hover:bg-amber-950/20'
          : 'hover:bg-white/[0.04]'
        }
      `}
    >
      {/* Priority left-border accent */}
      {task.priority === 'high' && !completed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-orange-400 opacity-80" />
      )}

      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        aria-label={completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        className={`
          relative flex size-[18px] shrink-0 items-center justify-center rounded-full border-2
          transition-all duration-200
          ${completed
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : overdue
            ? 'border-amber-500/50 hover:border-amber-400 hover:bg-amber-950/30'
            : task.priority === 'high'
            ? 'border-orange-500/60 hover:border-orange-400 hover:bg-orange-950/20'
            : 'border-[var(--color-border-strong)] hover:border-violet-500 hover:bg-violet-900/20'
          }
        `}
      >
        {completed && (
          <svg
            aria-hidden="true"
            className="size-2.5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug break-words transition-all duration-200 ${
            completed
              ? 'line-through text-[var(--color-text-muted)]'
              : 'text-[var(--color-text-primary)] font-medium'
          }`}
        >
          {task.title}
        </p>

        {task.due_date && (
          <div className={`mt-0.5 flex items-center gap-1 text-xs ${
            overdue && !completed
              ? 'text-[var(--color-overdue)] font-medium'
              : 'text-[var(--color-text-muted)]'
          }`}>
            {overdue && !completed ? (
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            )}
            <span>{formatDueDate(task)}</span>
            {overdue && !completed && (
              <button
                onClick={handleRescheduleToday}
                className="ml-1 text-[10px] font-medium text-amber-500/70 hover:text-amber-300 hover:underline underline-offset-2 transition"
              >
                → Today
              </button>
            )}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-red-950/40 border border-red-900/30 px-3 py-1.5">
            <span className="text-xs text-[var(--color-text-muted)]">Delete this task?</span>
            <button onClick={handleDelete} className="text-xs font-semibold text-red-400 hover:text-red-300">
              Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Actions — hover only on desktop, always visible on mobile */}
      {!showDeleteConfirm && (
        <div className="shrink-0 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition duration-150">
          <button
            onClick={() => setShowEdit(true)}
            aria-label={`Edit "${task.title}"`}
            className="flex size-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text-primary)] transition"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete "${task.title}"`}
            className="flex size-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-red-950/40 hover:text-red-400 transition"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      )}

      {showEdit && (
        <TaskEditDialog task={task} onClose={() => setShowEdit(false)} />
      )}
    </li>
  )
}
