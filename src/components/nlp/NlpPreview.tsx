'use client'

import { formatParsedDate } from '@/lib/nlp/parser'
import type { ParsedTask } from '@/lib/types/task'

interface NlpPreviewProps {
  parsed: ParsedTask
}

const TAG_COLORS: Record<string, string> = {
  work: '#3b82f6', personal: '#8b5cf6', urgent: '#d94f4f',
  health: '#26a35a', finance: '#c8841a', learning: '#06b6d4',
}
function tagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? '#a3a3a3'
}

export function NlpPreview({ parsed }: NlpPreviewProps) {
  const { dueDate, reminderTime, lowConfidence, tags, priority } = parsed

  const hasBadges = dueDate || (tags && tags.length > 0) || priority === 'high'
  if (!hasBadges) return null

  return (
    <div
      aria-live="polite"
      aria-label="Parsed task details"
      className="flex flex-wrap items-center gap-2 px-1 pt-1.5 pb-0.5"
    >
      {dueDate && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] border border-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">
          <svg
            aria-hidden="true"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatParsedDate(dueDate)}
        </span>
      )}

      {priority === 'high' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
          <span className="size-1.5 rounded-full bg-orange-400" />
          High priority
        </span>
      )}

      {tags && tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: tagColor(tag), background: tagColor(tag) + '18', border: `1px solid ${tagColor(tag)}30` }}
        >
          #{tag}
        </span>
      ))}

      {reminderTime && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <svg
            aria-hidden="true"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Reminder set
        </span>
      )}

      {lowConfidence && (
        <span
          role="status"
          className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 text-xs text-white/30"
        >
          <svg
            aria-hidden="true"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Date may be approximate
        </span>
      )}
    </div>
  )
}
