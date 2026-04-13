import * as chrono from 'chrono-node'
import type { ParsedTask } from '@/lib/types/task'

const REMINDER_PATTERNS = [
  /\bremind\s+me\b/i,
  /\balert\s+me\b/i,
  /\bnotif(?:y|ication)\b/i,
  /\breminder\b/i,
]

/**
 * Parse natural-language task input into structured fields.
 * Runs entirely client-side — no network call.
 */
export function parseTaskInput(text: string): ParsedTask {
  const trimmed = text.trim()
  if (!trimmed) {
    return { title: '', dueDate: null, reminderTime: null }
  }

  const referenceDate = new Date()
  const results = chrono.parse(trimmed, referenceDate, { forwardDate: true })

  if (results.length === 0) {
    return { title: trimmed, dueDate: null, reminderTime: null }
  }

  // Use the last result as the primary date (handles "from Monday to Wednesday" — picks Wednesday)
  const primary = results[results.length - 1]
  const dueDate = primary.date()

  // Remove all matched date expressions from the title
  let title = trimmed
  for (const result of [...results].reverse()) {
    title = (title.slice(0, result.index) + title.slice(result.index + result.text.length))
      .replace(/\s{2,}/g, ' ')
      .trim()
  }
  if (!title) title = trimmed

  const hasReminderIntent = REMINDER_PATTERNS.some((p) => p.test(trimmed))
  const reminderTime = hasReminderIntent && primary.start.isCertain('hour') ? dueDate : null

  // Low confidence: chrono inferred the day but it wasn't explicitly stated
  const lowConfidence = !primary.start.isCertain('day')

  return { title, dueDate, reminderTime, lowConfidence }
}

/**
 * Format a parsed date for display in the NLP preview.
 */
export function formatParsedDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // Fix: midnight (00:00) is a valid time — use strict comparison instead of falsy check
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0
  const timeStr = hasTime
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : null

  let dayStr: string
  if (dateDay.getTime() === today.getTime()) {
    dayStr = 'Today'
  } else if (dateDay.getTime() === tomorrow.getTime()) {
    dayStr = 'Tomorrow'
  } else {
    dayStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return timeStr ? `${dayStr} at ${timeStr}` : dayStr
}
