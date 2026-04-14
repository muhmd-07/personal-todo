'use client'

interface ViewToggleProps {
  view: 'focus' | 'calendar' | 'all'
  onViewChange: (view: 'focus' | 'calendar' | 'all') => void
}

const options: { value: 'focus' | 'calendar' | 'all'; label: string }[] = [
  { value: 'focus', label: 'Focus' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'all', label: 'All' },
]

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Task view"
      className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 gap-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onViewChange(o.value)}
          aria-pressed={view === o.value}
          className={`
            rounded-lg px-4 py-1.5 text-sm font-semibold tracking-tight transition-all duration-150
            ${view === o.value
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }
          `}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
