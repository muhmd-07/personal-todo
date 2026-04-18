'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toggleSubtaskAction, createSubtaskAction, deleteSubtaskAction } from '@/lib/actions/subtasks'
import { completeTaskAction, uncompleteTaskAction } from '@/lib/actions/tasks'
import type { Task, Subtask } from '@/lib/types/task'

interface TaskDetailClientProps {
  task: Task
  subtasks: Subtask[]
}

function formatDate(task: Task): string {
  if (!task.due_date) return ''
  const d = new Date(task.due_date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
}

const TAG_COLORS: Record<string, string> = {
  work: '#3b82f6', personal: '#8b5cf6', urgent: '#ef4444',
  health: '#22c55e', finance: '#f59e0b', learning: '#06b6d4',
}
function tagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? '#71717a'
}

export function TaskDetailClient({ task, subtasks: initialSubtasks }: TaskDetailClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks)
  const [newMilestone, setNewMilestone] = useState('')
  const [addingMilestone, setAddingMilestone] = useState(false)

  const completedCount = subtasks.filter(s => s.completed_at).length
  const total = subtasks.length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const isCompleted = !!task.completed_at

  async function handleToggleMilestone(id: string, done: boolean) {
    setSubtasks(s => s.map(x => x.id === id ? { ...x, completed_at: done ? new Date().toISOString() : null } : x))
    await toggleSubtaskAction(id, done)
  }

  async function handleAddMilestone() {
    if (!newMilestone.trim()) return
    const title = newMilestone.trim()
    setNewMilestone('')
    const tempId = crypto.randomUUID()
    setSubtasks(s => [...s, { id: tempId, task_id: task.id, user_id: '', title, completed_at: null, position: s.length, created_at: new Date().toISOString() }])
    const result = await createSubtaskAction(task.id, title)
    if (result.data) {
      setSubtasks(s => s.map(x => x.id === tempId ? { ...x, id: result.data!.id } : x))
    }
  }

  async function handleDeleteMilestone(id: string) {
    setSubtasks(s => s.filter(x => x.id !== id))
    await deleteSubtaskAction(id)
  }

  function handleToggleComplete() {
    startTransition(async () => {
      if (isCompleted) {
        await uncompleteTaskAction(task.id)
      } else {
        await completeTaskAction(task.id)
      }
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pb-44">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 h-14 bg-black/95 backdrop-blur-xl border-b border-zinc-900">
        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Tasks</span>
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-8 space-y-7">

        {/* Title + meta */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {task.priority === 'high' && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                High Priority
              </span>
            )}
            {task.tags && task.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                style={{ color: tagColor(tag), background: tagColor(tag) + '14', borderColor: tagColor(tag) + '30' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className={`text-3xl font-black tracking-tight leading-tight mb-4 ${isCompleted ? 'line-through text-zinc-600' : 'text-white'}`}>
            {task.title}
          </h1>

          {task.due_date && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
              </svg>
              <span>{formatDate(task)}</span>
              {task.due_time && <span className="text-zinc-700">· {task.due_time.slice(0, 5)}</span>}
            </div>
          )}
        </div>

        {/* Notes */}
        {task.notes && (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 block mb-3">Notes</span>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}

        {/* Milestones */}
        <div className="rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Milestones</span>
            {total > 0 && (
              <span className="text-[10px] font-bold text-zinc-600 tabular-nums">{completedCount}/{total}</span>
            )}
          </div>

          {total > 0 && (
            <div className="px-5 pt-4 pb-2">
              <div className="h-1 w-full rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-700 mt-1.5">{pct}% complete</p>
            </div>
          )}

          <ul className="divide-y divide-zinc-900/60">
            {subtasks.map(st => (
              <li key={st.id} className="flex items-center gap-3 px-5 py-3.5 group/st hover:bg-zinc-900/20 transition-colors">
                <button
                  onClick={() => handleToggleMilestone(st.id, !st.completed_at)}
                  className={`size-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                    st.completed_at
                      ? 'bg-teal-500 border-teal-500'
                      : 'border-zinc-700 hover:border-teal-500/60'
                  }`}
                >
                  {st.completed_at && (
                    <svg fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24" className="size-2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className={`text-sm flex-1 leading-snug ${st.completed_at ? 'line-through text-zinc-700' : 'text-zinc-300'}`}>
                  {st.title}
                </span>
                <button
                  onClick={() => handleDeleteMilestone(st.id)}
                  className="opacity-0 group-hover/st:opacity-100 text-zinc-700 hover:text-red-400 transition-all"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-5 py-3.5 border-t border-zinc-900/60">
            {addingMilestone ? (
              <div className="flex items-center gap-3">
                <div className="size-4 rounded border border-zinc-700 shrink-0" />
                <input
                  autoFocus
                  value={newMilestone}
                  onChange={e => setNewMilestone(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddMilestone()
                    if (e.key === 'Escape') setAddingMilestone(false)
                  }}
                  onBlur={() => { if (!newMilestone) setAddingMilestone(false) }}
                  placeholder="Add milestone…"
                  className="flex-1 bg-transparent text-sm text-white/70 outline-none placeholder:text-zinc-700 border-b border-zinc-800 pb-0.5"
                />
              </div>
            ) : (
              <button
                onClick={() => setAddingMilestone(true)}
                className="flex items-center gap-2 text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add milestone
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-black/95 backdrop-blur-xl border-t border-zinc-900 space-y-3 md:left-[220px]">
        <Link
          href={`/dashboard/focus?task=${task.id}`}
          className="flex items-center justify-center gap-3 w-full bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-teal-600/20"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-5">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
          START FOCUS SESSION
        </Link>
        <button
          onClick={handleToggleComplete}
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-500 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-40"
        >
          {isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        </button>
      </div>
    </div>
  )
}
