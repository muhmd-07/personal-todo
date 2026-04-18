'use client'

import { useTransition, useState, useOptimistic } from 'react'
import Link from 'next/link'
import {
  completeTaskAction,
  uncompleteTaskAction,
  deleteTaskAction,
  rescheduleTaskAction,
} from '@/lib/actions/tasks'
import { createSubtaskAction, toggleSubtaskAction, deleteSubtaskAction, getSubtasksAction } from '@/lib/actions/subtasks'
import { TaskEditDialog } from './TaskEditDialog'
import type { Task, Subtask } from '@/lib/types/task'

const TAG_COLORS: Record<string, string> = {
  work: '#3b82f6', personal: '#8b5cf6', urgent: '#d94f4f',
  health: '#26a35a', finance: '#c8841a', learning: '#06b6d4',
}
function tagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? '#525252'
}

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
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subtasksLoaded, setSubtasksLoaded] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(!!task.completed_at)
  const overdue = isOverdue(task, optimisticCompleted)
  const completed = optimisticCompleted

  async function loadSubtasks() {
    if (!subtasksLoaded) {
      const data = await getSubtasksAction(task.id)
      setSubtasks(data as Subtask[])
      setSubtasksLoaded(true)
    }
  }

  async function handleToggleSubtasks() {
    if (!showSubtasks) await loadSubtasks()
    setShowSubtasks(s => !s)
  }

  async function handleAddSubtask() {
    if (!newSubtask.trim()) return
    const title = newSubtask.trim()
    setNewSubtask('')
    const tempId = crypto.randomUUID()
    setSubtasks(s => [...s, { id: tempId, task_id: task.id, user_id: '', title, completed_at: null, position: s.length, created_at: new Date().toISOString() }])
    const result = await createSubtaskAction(task.id, title)
    if (result.data) {
      setSubtasks(s => s.map(x => x.id === tempId ? { ...x, id: result.data!.id } : x))
    }
  }

  async function handleToggleSubtask(id: string, done: boolean) {
    setSubtasks(s => s.map(x => x.id === id ? { ...x, completed_at: done ? new Date().toISOString() : null } : x))
    await toggleSubtaskAction(id, done)
  }

  async function handleDeleteSubtask(id: string) {
    setSubtasks(s => s.filter(x => x.id !== id))
    await deleteSubtaskAction(id)
  }

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
        task-fade-in group relative flex items-center gap-3 px-1 py-3
        transition-all duration-150 cursor-default
        border-b border-zinc-900/50 last:border-b-0
        ${isPending ? 'opacity-40 pointer-events-none' : ''}
        hover:bg-zinc-950 rounded-lg
      `}
    >
      {/* Priority left-border accent */}
      {task.priority === 'high' && !completed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-orange-400" />
      )}

      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        aria-label={completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        className={`
          relative flex size-5 shrink-0 items-center justify-center rounded-full border-2
          transition-all duration-200
          ${completed
            ? 'border-white bg-white'
            : overdue
            ? 'border-orange-500/50 hover:border-orange-400'
            : task.priority === 'high'
            ? 'border-orange-500/60 hover:border-orange-400'
            : 'border-zinc-700 hover:border-zinc-400'
          }
        `}
      >
        {completed && (
          <svg aria-hidden="true" className="size-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className={`block text-sm leading-snug break-words transition-all duration-200 hover:opacity-80 ${
            completed
              ? 'line-through text-zinc-700'
              : 'text-white font-semibold'
          }`}
          tabIndex={-1}
        >
          {task.title}
        </Link>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <span
                key={tag}
                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                style={{ color: tagColor(tag), background: tagColor(tag) + '14', borderColor: tagColor(tag) + '30' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.due_date && (
          <div className={`mt-0.5 flex items-center gap-1 text-xs ${
            overdue && !completed
              ? 'text-orange-400 font-medium'
              : 'text-zinc-600'
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
            {task.recurring && task.recurring !== 'none' && (
              <span className="ml-1 text-[10px] text-white/30">↻ {task.recurring}</span>
            )}
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

        {/* Notes */}
        {task.notes && (
          <div className="mt-1">
            <button
              onClick={() => setShowNotes(s => !s)}
              className="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/50 transition-colors"
              aria-label={showNotes ? 'Hide notes' : 'Show notes'}
            >
              <svg aria-hidden="true" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              {showNotes ? 'Hide note' : 'Note'}
            </button>
            {showNotes && (
              <p className="mt-1 text-[12px] text-white/40 leading-relaxed whitespace-pre-wrap pl-0.5">
                {task.notes}
              </p>
            )}
          </div>
        )}

        {/* Subtasks */}
        {showSubtasks && (
          <div className="mt-2 pl-1 space-y-1">
            {subtasks.map(st => (
              <div key={st.id} className="flex items-center gap-2 group/st">
                <button
                  onClick={() => handleToggleSubtask(st.id, !st.completed_at)}
                  className={`size-3.5 rounded border shrink-0 flex items-center justify-center transition-all ${st.completed_at ? 'bg-white/40 border-white/40' : 'border-white/20 hover:border-white/40'}`}
                >
                  {st.completed_at && <svg fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24" className="size-2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <span className={`text-xs flex-1 ${st.completed_at ? 'line-through text-white/25' : 'text-white/55'}`}>{st.title}</span>
                <button onClick={() => handleDeleteSubtask(st.id)} className="opacity-0 group-hover/st:opacity-100 text-white/20 hover:text-red-400 transition-all">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {addingSubtask ? (
              <div className="flex items-center gap-2">
                <div className="size-3.5 rounded border border-white/10 shrink-0" />
                <input
                  autoFocus
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddSubtask(); if (e.key === 'Escape') setAddingSubtask(false) }}
                  onBlur={() => { if (!newSubtask) setAddingSubtask(false) }}
                  placeholder="Subtask title…"
                  className="flex-1 bg-transparent text-xs text-white/70 outline-none placeholder:text-white/20 border-b border-white/10 pb-0.5"
                />
              </div>
            ) : (
              <button onClick={() => setAddingSubtask(true)} className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors mt-1">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add subtask
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
            onClick={handleToggleSubtasks}
            aria-label="Toggle subtasks"
            className="flex size-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-white/8 hover:text-[var(--color-text-primary)] transition"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
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
