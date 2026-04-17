'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { parseTaskInput } from '@/lib/nlp/parser'
import { createTaskAction } from '@/lib/actions/tasks'

const CATEGORIES = ['work', 'personal', 'health', 'finance', 'learning'] as const

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

  // Parse NLP as user types the title
  const parsed = title ? parseTaskInput(title) : null
  const nlpDate = parsed?.dueDate
    ? parsed.dueDate.toISOString().slice(0, 10)
    : null

  function toggleCategory(cat: string) {
    setSelectedTags(prev =>
      prev.includes(cat) ? prev.filter(t => t !== cat) : [...prev, cat]
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

    const input = {
      title: final.title || title.trim(),
      due_date: resolvedDate || null,
      due_time: resolvedTime,
      priority: resolvedPriority,
      tags: resolvedTags,
      reminder_time: final.reminderTime ? final.reminderTime.toISOString() : null,
    }

    startTransition(async () => {
      const result = await createTaskAction(input)
      if (result?.error) {
        setError(result.error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-24">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed top-0 right-0 w-64 h-64 -z-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl bg-white/[0.02]" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-96 h-96 -z-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl bg-white/[0.02]" />

      <div className="max-w-lg mx-auto px-6 pt-10 pb-8">
        {/* Hero heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create Task</h1>
          <p className="text-[var(--color-text-muted)] font-medium text-sm">Define your next milestone.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Task Title — borderless underline input */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-4 font-bold">
              Task Title
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full bg-transparent border-0 border-b-2 border-white/10 focus:border-white/40 focus:ring-0 text-2xl font-semibold px-0 py-4 placeholder:text-white/15 outline-none transition-colors"
            />
            {/* NLP preview */}
            {nlpDate && !dueDate && (
              <p className="mt-2 text-xs text-white/30">
                Detected date: <span className="text-white/50">{new Date(nlpDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </p>
            )}
          </div>

          {/* Bento Grid — Due Date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Due Date card */}
            <div className="relative p-5 bg-white/[0.04] rounded-xl border border-white/[0.07] flex flex-col justify-between h-36 group">
              <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
                Due Date
              </label>
              <div className="flex items-center justify-between">
                <span className={`text-base font-semibold ${dueDate ? 'text-white' : 'text-white/30'}`}>
                  {dueDate
                    ? new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : nlpDate
                    ? new Date(nlpDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Select Date'}
                </span>
                <svg className="size-5 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
              </div>
              {/* Invisible native date input overlaid */}
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Due date"
              />
            </div>

            {/* Priority card */}
            <div className="relative p-5 bg-white/[0.04] rounded-xl border border-white/[0.07] flex flex-col justify-between h-36">
              <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priorityLabel}
                  onChange={e => {
                    const opt = PRIORITY_OPTIONS.find(o => o.label === e.target.value)
                    if (opt) handlePriority(opt.label, opt.value)
                  }}
                  className="w-full bg-transparent border-0 p-0 text-xl font-semibold focus:ring-0 appearance-none cursor-pointer text-white outline-none"
                >
                  {PRIORITY_OPTIONS.map(o => (
                    <option key={o.label} value={o.label} className="bg-[#1c1c1c] text-white">
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="size-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {priority === 'high' && (
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-orange-400" />
                  <span className="text-[11px] text-orange-400/80 font-medium">High priority</span>
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const active = selectedTags.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-all capitalize ${
                      active
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">{error}</p>
          )}

          {/* Save Task button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="w-full bg-white text-black py-5 rounded-xl font-bold text-base tracking-widest hover:scale-[1.01] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 transition-all flex items-center justify-center gap-3"
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
                  SAVE TASK
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
