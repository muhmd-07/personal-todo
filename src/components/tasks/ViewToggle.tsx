'use client'

interface ViewToggleProps {
  view: 'focus' | 'all'
  onViewChange: (view: 'focus' | 'all') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Task view"
      className="inline-flex rounded-lg border border-[var(--color-border)] bg-white p-0.5"
    >
      <button
        onClick={() => onViewChange('focus')}
        aria-pressed={view === 'focus'}
        className={`
          rounded-md px-3 py-1.5 text-xs font-medium transition
          ${view === 'focus'
            ? 'bg-[var(--color-accent)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }
        `}
      >
        Focus
      </button>
      <button
        onClick={() => onViewChange('all')}
        aria-pressed={view === 'all'}
        className={`
          rounded-md px-3 py-1.5 text-xs font-medium transition
          ${view === 'all'
            ? 'bg-[var(--color-accent)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }
        `}
      >
        All tasks
      </button>
    </div>
  )
}
