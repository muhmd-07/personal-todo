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
        task-fade-in group flex items-start gap-3.5 rounded-2xl border px-4 py-3.5
        transition-all duration-200 hover:shadow-sm
        ${overdue
          ? 'border-amber-200 bg-amber-50/60'
          : completed
          ? 'border-[var(--color-border)] bg-gray-50/80'
          : 'border-[var(--color-border)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
        }
        ${isPending ? 'opacity-50 pointer-events-none' : ''}
      `}
      style={{ willChange: isPending ? 'opacity' : 'auto' }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        aria-label={completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        className={`
          mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border-2
          transition-all duration-200 min-h-[44px] min-w-[44px] -ml-[11px] -mt-[11px] p-[11px]
          ${completed
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : overdue
            ? 'border-amber-400 hover:border-amber-500 hover:bg-amber-50'
            : 'border-gray-300 hover:border-[var(--color-accent)] hover:bg-violet-50'
          }
        `}
      >
        {completed && (
          <svg
            aria-hidden="true"
            className="size-3 text-white animate-[task-fade-in_150ms_ease-out]"
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
      <div className="min-w-0 flex-1 pt-0.5">
        <p
          className={`text-sm font-medium leading-snug break-words transition-all duration-200 ${
            completed
              ? 'line-through text-gray-400'
              : 'text-[var(--color-text-primary)]'
          }`}
        >
          {task.title}
        </p>

        {task.due_date && (
          <div className={`mt-1 flex items-center gap-1 text-xs ${
            overdue ? 'text-amber-700 font-medium' : 'text-[var(--color-text-muted)]'
          }`}>
            {overdue ? (
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            )}
            <span>{overdue ? 'Overdue · ' : ''}{formatDueDate(task)}</span>
          </div>
        )}

        {overdue && !completed && (
          <button
            onClick={handleRescheduleToday}
            className="mt-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline underline-offset-2"
          >
            Move to today →
          </button>
        )}

        {showDeleteConfirm && (
          <div className="mt-2.5 flex items-center gap-3 rounded-lg bg-red-50 px-3 py-2">
            <span className="text-xs text-gray-600">Delete this task?</span>
            <button onClick={handleDelete} className="text-xs font-semibold text-red-600 hover:text-red-700">
              Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Actions — always visible on mobile, hover on desktop */}
      <div className="shrink-0 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition duration-150">
        {!showDeleteConfirm && (
          <button
            onClick={() => setShowEdit(true)}
            aria-label={`Edit "${task.title}"`}
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition min-h-[44px] min-w-[44px]"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        {!showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete "${task.title}"`}
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition min-h-[44px] min-w-[44px]"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        )}
      </div>

      {showEdit && (
        <TaskEditDialog task={task} onClose={() => setShowEdit(false)} />
      )}
    </li>
  )
}
