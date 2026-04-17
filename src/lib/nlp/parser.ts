import * as chrono from 'chrono-node'
import type { ParsedTask } from '@/lib/types/task'

const REMINDER_PATTERNS = [
  /\bremind\s+me\b/i,
  /\balert\s+me\b/i,
  /\bnotif(?:y|ication)\b/i,
  /\breminder\b/i,
]

// Matches #tag patterns (e.g. #work, #personal)
const TAG_PATTERN = /#([a-z][a-z0-9_-]*)/gi

// Matches a bare ! used as a priority flag (not part of a word)
const PRIORITY_PATTERN = /(?<![^\s])!(?![^\s])/

/**
 * Parse natural-language task input into structured fields.
 * Runs entirely client-side — no network call.
 *
 * Supports:
 *  - Date/time via chrono-node: "tomorrow at 3pm", "next Monday"
 *  - Reminder intent: "remind me", "alert me"
 *  - Tags via #hashtag: "Call dentist #health tomorrow"
 *  - High priority via !: "Submit report ! by Friday"
 */
export function parseTaskInput(text: string): ParsedTask {
  const trimmed = text.trim()
  if (!trimmed) {
    return { title: '', dueDate: null, reminderTime: null }
  }

  // ── Extract #tags ──────────────────────────────────────────────────────────
  const tags: string[] = []
  let tagMatch: RegExpExecArray | null
  const tagRegex = new RegExp(TAG_PATTERN.source, 'gi')
  while ((tagMatch = tagRegex.exec(trimmed)) !== null) {
    const tag = tagMatch[1].toLowerCase()
    if (!tags.includes(tag)) tags.push(tag)
  }

  // ── Extract priority flag (!) ──────────────────────────────────────────────
  const priority: 'high' | 'normal' = PRIORITY_PATTERN.test(trimmed) ? 'high' : 'normal'

  // ── Strip #tags and ! from text before chrono parsing ─────────────────────
  let cleaned = trimmed
    .replace(/#[a-z][a-z0-9_-]*/gi, '')
    .replace(PRIORITY_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (!cleaned) cleaned = trimmed

  // ── Date parsing ───────────────────────────────────────────────────────────
  const referenceDate = new Date()
  const results = chrono.parse(cleaned, referenceDate, { forwardDate: true })

  if (results.length === 0) {
    return { title: cleaned, dueDate: null, reminderTime: null, tags, priority }
  }

  // Use the last result as the primary date (handles "from Monday to Wednesday" — picks Wednesday)
  const primary = results[results.length - 1]
  const dueDate = primary.date()

  // Remove all matched date expressions from the title
  let title = cleaned
  for (const result of [...results].reverse()) {
    title = (title.slice(0, result.index) + title.slice(result.index + result.text.length))
      .replace(/\s{2,}/g, ' ')
      .trim()
  }
  if (!title) title = cleaned

  const hasReminderIntent = REMINDER_PATTERNS.some((p) => p.test(trimmed))
  const reminderTime = hasReminderIntent && primary.start.isCertain('hour') ? dueDate : null

  // Low confidence: chrono inferred the day but it wasn't explicitly stated
  const lowConfidence = !primary.start.isCertain('day')

  return { title, dueDate, reminderTime, lowConfidence, tags, priority }
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
