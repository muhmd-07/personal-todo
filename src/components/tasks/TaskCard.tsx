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
    return task.due_time ? `Today at ${task.due_time.slice(0, 5)}` : 'Today'
  }
  if (task.due_date === tomorrowStr) {
    return task.due_time ? `Tomorrow at ${task.due_time.slice(0, 5)}` : 'Tomorrow'
  }

  const date = new Date(task.due_date + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  return task.due_time ? `${formatted} at ${task.due_time.slice(0, 5)}` : formatted
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
        group flex items-start gap-3 rounded-xl border px-4 py-3 transition
        ${overdue
          ? 'border-amber-200 bg-[var(--color-overdue-bg)]'
          : 'border-[var(--color-border)] bg-white'
        }
        ${completed ? 'opacity-60' : ''}
        ${isPending ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Checkbox — min 44×44px touch target */}
      <button
        onClick={handleToggleComplete}
        aria-label={completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        className={`
          mt-0.5 flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border-2 transition
          ${completed
            ? 'border-[var(--color-success)] bg-[var(--color-success)]'
            : overdue
            ? 'border-amber-400 hover:border-amber-500'
            : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
          }
        `}
      >
        {completed && (
          <svg
            aria-hidden="true"
            className="size-3 text-white"
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
          className={`text-sm text-[var(--color-text-primary)] break-words ${
            completed ? 'line-through text-[var(--color-text-muted)]' : ''
          }`}
        >
          {task.title}
        </p>

        {task.due_date && (
          <p
            className={`mt-0.5 text-xs ${
              overdue
                ? 'text-[var(--color-overdue)] font-medium'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            {overdue && '⚠ Overdue · '}
            {formatDueDate(task)}
          </p>
        )}

        {/* Reschedule button for overdue tasks */}
        {overdue && !completed && (
          <button
            onClick={handleRescheduleToday}
            className="mt-1.5 text-xs font-medium text-amber-700 hover:underline"
          >
            Move to today
          </button>
        )}
      </div>

      {/* Edit + Delete */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition">
        {!showDeleteConfirm && (
          <button
            onClick={() => setShowEdit(true)}
            aria-label={`Edit "${task.title}"`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        {showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs text-[var(--color-text-muted)] hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete "${task.title}"`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-zinc-100 hover:text-zinc-700 transition"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
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
