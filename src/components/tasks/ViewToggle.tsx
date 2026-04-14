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
      className="inline-flex rounded-xl border border-[var(--color-border)] bg-gray-50 p-1 gap-0.5"
    >
      <button
        onClick={() => onViewChange('focus')}
        aria-pressed={view === 'focus'}
        className={`
          rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-150
          ${view === 'focus'
            ? 'bg-white text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
            : 'text-gray-500 hover:text-gray-700'
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
            ? 'bg-white text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        All tasks
      </button>
    </div>
  )
}
