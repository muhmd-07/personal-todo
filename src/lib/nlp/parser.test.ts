import { describe, it, expect, beforeEach, vi } from 'vitest'
import { parseTaskInput, formatParsedDate } from './parser'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pin "now" so tests are deterministic. Base: Wednesday 2026-04-08 10:00:00 local */
const BASE = new Date('2026-04-08T10:00:00')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(BASE)
})

afterEach(() => {
  vi.useRealTimers()
})

function ymd(date: Date | null): string | null {
  if (!date) return null
  return date.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

function hhmm(date: Date | null): string | null {
  if (!date) return null
  return date.toTimeString().slice(0, 5)
}

// ─── Empty / trivial inputs ───────────────────────────────────────────────────

describe('empty and whitespace input', () => {
  it('returns empty title and nulls for empty string', () => {
    const r = parseTaskInput('')
    expect(r).toEqual({ title: '', dueDate: null, reminderTime: null })
  })

  it('returns empty title and nulls for whitespace-only string', () => {
    const r = parseTaskInput('   ')
    expect(r).toEqual({ title: '', dueDate: null, reminderTime: null })
  })
})

// ─── No date present ─────────────────────────────────────────────────────────

describe('input with no date', () => {
  it('preserves title when no date is found', () => {
    const r = parseTaskInput('Buy groceries')
    expect(r.title).toBe('Buy groceries')
    expect(r.dueDate).toBeNull()
    expect(r.reminderTime).toBeNull()
  })

  it('preserves multi-word title', () => {
    const r = parseTaskInput('Send quarterly report to Alice')
    expect(r.title).toBe('Send quarterly report to Alice')
    expect(r.dueDate).toBeNull()
  })
})

// ─── Relative day keywords ────────────────────────────────────────────────────

describe('relative day keywords', () => {
  it('parses "today"', () => {
    const r = parseTaskInput('Call dentist today')
    expect(ymd(r.dueDate)).toBe('2026-04-08')
    expect(r.title).toBe('Call dentist')
  })

  it('parses "tomorrow"', () => {
    const r = parseTaskInput('Gym tomorrow')
    expect(ymd(r.dueDate)).toBe('2026-04-09')
    expect(r.title).toBe('Gym')
  })

  it('parses "yesterday" (backward date)', () => {
    const r = parseTaskInput('Log expense yesterday')
    expect(ymd(r.dueDate)).toBe('2026-04-07')
    expect(r.title).toBe('Log expense')
  })
})

// ─── Named weekdays ───────────────────────────────────────────────────────────

describe('named weekdays (forward)', () => {
  it('parses "next Monday"', () => {
    // Base is Wednesday 2026-04-08; next Monday = 2026-04-13
    const r = parseTaskInput('Team standup next Monday')
    expect(ymd(r.dueDate)).toBe('2026-04-13')
  })

  it('parses "this Friday"', () => {
    // This Friday = 2026-04-10
    const r = parseTaskInput('Submit PR this Friday')
    expect(ymd(r.dueDate)).toBe('2026-04-10')
  })

  it('parses bare "Saturday" (forward)', () => {
    // Forward from Wednesday → next Saturday = 2026-04-11
    const r = parseTaskInput('Hike Saturday')
    expect(ymd(r.dueDate)).toBe('2026-04-11')
  })

  it('parses "Sunday"', () => {
    const r = parseTaskInput('Family dinner Sunday')
    expect(ymd(r.dueDate)).toBe('2026-04-12')
  })
})

// ─── Explicit calendar dates ──────────────────────────────────────────────────

describe('explicit calendar dates', () => {
  it('parses "April 15"', () => {
    const r = parseTaskInput('Tax return April 15')
    expect(ymd(r.dueDate)).toBe('2026-04-15')
  })

  it('parses "15th April"', () => {
    const r = parseTaskInput('Tax return 15th April')
    expect(ymd(r.dueDate)).toBe('2026-04-15')
  })

  it('parses MM/DD format', () => {
    const r = parseTaskInput('Flight check-in 04/20')
    expect(ymd(r.dueDate)).toBe('2026-04-20')
  })

  it('parses full ISO date', () => {
    const r = parseTaskInput('Conference 2026-05-01')
    expect(ymd(r.dueDate)).toBe('2026-05-01')
  })
})

// ─── Relative n-day offsets ───────────────────────────────────────────────────

describe('relative offsets', () => {
  it('parses "in 3 days"', () => {
    const r = parseTaskInput('Review docs in 3 days')
    expect(ymd(r.dueDate)).toBe('2026-04-11')
  })

  it('parses "in 2 weeks"', () => {
    const r = parseTaskInput('Car service in 2 weeks')
    expect(ymd(r.dueDate)).toBe('2026-04-22')
  })

  it('parses "next month"', () => {
    const r = parseTaskInput('Renew subscription next month')
    expect(ymd(r.dueDate)).toBe('2026-05-08')
  })

  it('parses "in a week"', () => {
    const r = parseTaskInput('Follow up in a week')
    expect(ymd(r.dueDate)).toBe('2026-04-15')
  })
})

// ─── Time expressions ─────────────────────────────────────────────────────────

describe('time expressions', () => {
  it('parses "at 3pm"', () => {
    const r = parseTaskInput('Meeting at 3pm')
    expect(hhmm(r.dueDate)).toBe('15:00')
  })

  it('parses "at 9:30am"', () => {
    const r = parseTaskInput('Standup at 9:30am')
    expect(hhmm(r.dueDate)).toBe('09:30')
  })

  it('parses "at noon"', () => {
    const r = parseTaskInput('Lunch at noon')
    expect(hhmm(r.dueDate)).toBe('12:00')
  })

  it('parses "at midnight" — not treated as no-time', () => {
    const r = parseTaskInput('Backup at midnight')
    // midnight = 00:00 — lowConfidence irrelevant here; just check time is preserved
    expect(r.dueDate).not.toBeNull()
    expect(hhmm(r.dueDate)).toBe('00:00')
  })

  it('combines date and time: "tomorrow at 2pm"', () => {
    const r = parseTaskInput('Doctor appointment tomorrow at 2pm')
    expect(ymd(r.dueDate)).toBe('2026-04-09')
    expect(hhmm(r.dueDate)).toBe('14:00')
  })

  it('combines date and time: "Friday at 10am"', () => {
    const r = parseTaskInput('Sprint demo Friday at 10am')
    expect(ymd(r.dueDate)).toBe('2026-04-10')
    expect(hhmm(r.dueDate)).toBe('10:00')
  })
})

// ─── Title stripping ──────────────────────────────────────────────────────────

describe('title stripping', () => {
  it('removes leading date text', () => {
    const r = parseTaskInput('tomorrow buy milk')
    expect(r.title).toBe('buy milk')
    expect(ymd(r.dueDate)).toBe('2026-04-09')
  })

  it('removes trailing date text', () => {
    const r = parseTaskInput('Buy milk tomorrow')
    expect(r.title).toBe('Buy milk')
  })

  it('removes mid-sentence date text', () => {
    const r = parseTaskInput('Meet John on Friday for lunch')
    expect(r.title).toBe('Meet John for lunch')
  })

  it('does not produce empty title when input is only a date', () => {
    const r = parseTaskInput('tomorrow')
    expect(r.title).toBeTruthy()
  })
})

// ─── Reminder intent ──────────────────────────────────────────────────────────

describe('reminder intent detection', () => {
  it('sets reminderTime when "remind me" + certain time present', () => {
    const r = parseTaskInput('remind me to call Alice at 3pm')
    expect(r.reminderTime).not.toBeNull()
    expect(hhmm(r.reminderTime)).toBe('15:00')
  })

  it('sets reminderTime with "alert me"', () => {
    const r = parseTaskInput('alert me about dentist tomorrow at 9am')
    expect(r.reminderTime).not.toBeNull()
  })

  it('does NOT set reminderTime when no reminder keyword', () => {
    const r = parseTaskInput('Call Alice at 3pm today')
    expect(r.reminderTime).toBeNull()
  })

  it('does NOT set reminderTime when reminder keyword present but time not certain', () => {
    // "remind me next week" — day is uncertain, hour definitely not present
    const r = parseTaskInput('remind me next week')
    expect(r.reminderTime).toBeNull()
  })

  it('sets reminderTime with "notification"', () => {
    const r = parseTaskInput('notification for meeting Friday at 2pm')
    expect(r.reminderTime).not.toBeNull()
  })
})

// ─── lowConfidence flag ───────────────────────────────────────────────────────

describe('lowConfidence flag', () => {
  it('is false for explicit date like "April 15"', () => {
    const r = parseTaskInput('Tax return April 15')
    expect(r.lowConfidence).toBe(false)
  })

  it('is false for "tomorrow"', () => {
    const r = parseTaskInput('Gym tomorrow')
    expect(r.lowConfidence).toBe(false)
  })

  it('is false for "next Monday"', () => {
    const r = parseTaskInput('Standup next Monday')
    expect(r.lowConfidence).toBe(false)
  })

  it('is false when no date', () => {
    const r = parseTaskInput('Buy groceries')
    expect(r.lowConfidence).toBeUndefined()
  })
})

// ─── Multiple date expressions ────────────────────────────────────────────────

describe('multiple date expressions', () => {
  it('uses last date when two dates appear', () => {
    // "from Monday to Wednesday" — should pick Wednesday
    const r = parseTaskInput('Vacation from Monday to Wednesday')
    expect(ymd(r.dueDate)).toBe('2026-04-15') // Wednesday
  })

  it('strips all date text from title', () => {
    const r = parseTaskInput('Meeting Monday and Tuesday')
    expect(r.title).not.toMatch(/monday/i)
    expect(r.title).not.toMatch(/tuesday/i)
  })
})

// ─── formatParsedDate ─────────────────────────────────────────────────────────

describe('formatParsedDate', () => {
  it('returns "Today" for today with no time', () => {
    const d = new Date('2026-04-08T00:00:00')
    expect(formatParsedDate(d)).toBe('Today')
  })

  it('returns "Tomorrow" for tomorrow with no time', () => {
    const d = new Date('2026-04-09T00:00:00')
    expect(formatParsedDate(d)).toBe('Tomorrow')
  })

  it('returns "Today at 3:00 PM" when time is set today', () => {
    const d = new Date('2026-04-08T15:00:00')
    expect(formatParsedDate(d)).toBe('Today at 3:00 PM')
  })

  it('returns "Tomorrow at 9:30 AM"', () => {
    const d = new Date('2026-04-09T09:30:00')
    expect(formatParsedDate(d)).toBe('Tomorrow at 9:30 AM')
  })

  it('returns weekday+date for a future date', () => {
    const d = new Date('2026-04-15T00:00:00')
    const result = formatParsedDate(d)
    expect(result).toMatch(/Wed/)
    expect(result).toMatch(/Apr/)
    expect(result).toMatch(/15/)
  })

  it('formats date with time for non-today/tomorrow', () => {
    const d = new Date('2026-04-15T14:00:00')
    const result = formatParsedDate(d)
    expect(result).toContain('2:00 PM')
  })
})
