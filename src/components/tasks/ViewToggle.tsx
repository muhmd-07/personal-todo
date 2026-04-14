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
      className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 gap-0.5"
    >
      <button
        onClick={() => onViewChange('focus')}
        aria-pressed={view === 'focus'}
        className={`
          rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-150
          ${view === 'focus'
            ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)]'
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
          rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-150
          ${view === 'all'
            ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }
        `}
      >
        All tasks
      </button>
    </div>
  )
}
