'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { updateTaskAction } from '@/lib/actions/tasks'
import type { Task } from '@/lib/types/task'

interface TaskEditDialogProps {
  task: Task
  onClose: () => void
}

export function TaskEditDialog({ task, onClose }: TaskEditDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
    return () => dialogRef.current?.close()
  }, [])

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    if (outside) onClose()
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const reminderRaw = formData.get('reminder_time') as string
    const input = {
      id: task.id,
      title: formData.get('title') as string,
      priority: (formData.get('priority') as 'high' | 'normal') || 'normal',
      due_date: (formData.get('due_date') as string) || null,
      due_time: (formData.get('due_time') as string) || null,
      notes: (formData.get('notes') as string) || null,
      reminder_time: reminderRaw ? new Date(reminderRaw).toISOString() : null,
    }

    startTransition(async () => {
      const result = await updateTaskAction(input)
      if (result?.error) {
        setError(result.error.message)
      } else {
        onClose()
      }
    })
  }

  const reminderDefault = task.reminder_time
    ? new Date(task.reminder_time).toISOString().slice(0, 16)
    : ''

  const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-[var(--color-text-muted)]"

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={onClose}
      className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl shadow-black/60 backdrop:bg-black/70 open:animate-in open:fade-in open:zoom-in-95"
      aria-label="Edit task"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            Edit task
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 transition"
          >
            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
              Title
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              defaultValue={task.title}
              required
              maxLength={500}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
              Priority
            </label>
            <div className="flex gap-2">
              {(['normal', 'high'] as const).map((p) => (
                <label key={p} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    defaultChecked={task.priority === p}
                    className="sr-only peer"
                  />
                  <span className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition peer-checked:border-violet-500/50 peer-checked:bg-violet-900/20 peer-checked:text-violet-400 border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]">
                    {p === 'high' && <span className="size-1.5 rounded-full bg-orange-400" />}
                    {p === 'normal' ? 'Normal' : 'High'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-due-date" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                Due date
              </label>
              <input
                id="edit-due-date"
                name="due_date"
                type="date"
                defaultValue={task.due_date ?? ''}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="edit-due-time" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                Time
              </label>
              <input
                id="edit-due-time"
                name="due_time"
                type="time"
                defaultValue={task.due_time?.slice(0, 5) ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-reminder" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
              Reminder <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              id="edit-reminder"
              name="reminder_time"
              type="datetime-local"
              defaultValue={reminderDefault}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
              Notes <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              rows={3}
              defaultValue={task.notes ?? ''}
              className={`${inputClass} resize-none`}
              placeholder="Add any extra details…"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-white/6 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
