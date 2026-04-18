'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { parseTaskInput } from '@/lib/nlp/parser'
import { createTaskAction } from '@/lib/actions/tasks'

const CATEGORIES = ['Work', 'Personal', 'Health', 'Finance', 'Learning'] as const

const PRIORITY_OPTIONS = [
  { label: 'Low',    value: 'normal' },
  { label: 'Medium', value: 'normal' },
  { label: 'High',   value: 'high' },
  { label: 'Urgent', value: 'high' },
] as const

export function CreateTaskPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high'>('normal')
  const [priorityLabel, setPriorityLabel] = useState('Medium')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  const parsed = title ? parseTaskInput(title) : null
  const nlpDate = parsed?.dueDate ? parsed.dueDate.toISOString().slice(0, 10) : null

  function toggleCategory(cat: string) {
    const lower = cat.toLowerCase()
    setSelectedTags(prev =>
      prev.includes(lower) ? prev.filter(t => t !== lower) : [...prev, lower]
    )
  }

  function handlePriority(label: string, value: 'normal' | 'high') {
    setPriorityLabel(label)
    setPriority(value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setError(null)

    const final = parseTaskInput(title)
    const resolvedDate = dueDate || nlpDate
    const resolvedTime =
      final.dueDate && !dueDate && (final.dueDate.getHours() !== 0 || final.dueDate.getMinutes() !== 0)
        ? final.dueDate.toTimeString().slice(0, 5)
        : null
    const resolvedTags = [...new Set([...selectedTags, ...(final.tags ?? [])])]
    const resolvedPriority = final.priority === 'high' ? 'high' : priority

    startTransition(async () => {
      const result = await createTaskAction({
        title: final.title || title.trim(),
        due_date: resolvedDate || null,
        due_time: resolvedTime,
        priority: resolvedPriority,
        tags: resolvedTags,
        reminder_time: final.reminderTime ? final.reminderTime.toISOString() : null,
      })
      if (result?.error) {
        setError(result.error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-24">
      <div className="max-w-lg mx-auto px-6 pt-10 pb-8">

        {/* Hero heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">Create Task</h1>
          <p className="text-zinc-400 font-medium text-sm">Clear your mind. Capture the next step.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Task Title */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 font-bold">
              Task Title
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-base font-semibold text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
            />
            {nlpDate && !dueDate && (
              <p className="mt-2 text-xs text-zinc-400">
                Detected:{' '}
                <span className="text-teal-600 font-semibold">
                  {new Date(nlpDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </p>
            )}
          </div>

          {/* Bento Grid — Due Date + Priority */}
          <div className="grid grid-cols-2 gap-3">
            {/* Due Date card */}
            <div className="relative p-4 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between h-32 hover:border-zinc-300 transition-colors group">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Due Date
              </label>
              <div className="flex items-center justify-between">
                <span className={`text-base font-semibold ${dueDate || nlpDate ? 'text-teal-600' : 'text-zinc-300'}`}>
                  {dueDate
                    ? new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : nlpDate
                    ? new Date(nlpDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Pick date'}
                </span>
                <svg className="size-4 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Due date"
              />
            </div>

            {/* Priority card */}
            <div className="relative p-4 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between h-32">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priorityLabel}
                  onChange={e => {
                    const opt = PRIORITY_OPTIONS.find(o => o.label === e.target.value)
                    if (opt) handlePriority(opt.label, opt.value)
                  }}
                  className="w-full bg-transparent border-0 p-0 text-lg font-bold focus:ring-0 appearance-none cursor-pointer text-zinc-900 outline-none"
                >
                  {PRIORITY_OPTIONS.map(o => (
                    <option key={o.label} value={o.label}>{o.label}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="size-4 text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {priority === 'high' && (
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-400" />
                  <span className="text-[11px] text-orange-500 font-semibold">High priority</span>
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 font-bold">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const active = selectedTags.includes(cat.toLowerCase())
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                      active
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                        : 'border-zinc-200 text-zinc-500 bg-white hover:border-zinc-300 hover:text-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">{error}</p>
          )}

          {/* Info message */}
          <p className="text-xs text-zinc-400 flex items-center gap-2">
            <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-3.5 shrink-0 text-teal-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Your tasks are synchronized across all your devices
          </p>

          {/* Save Task button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-teal-600/20"
            >
              {isPending ? (
                <>
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  SAVING…
                </>
              ) : (
                <>
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  SAVE TASK
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
