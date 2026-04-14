interface EmptyStateProps {
  view?: 'focus' | 'all'
}

export function EmptyState({ view = 'all' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-violet-50">
        <svg
          aria-hidden="true"
          className="size-8 text-[var(--color-accent)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
        {view === 'focus' ? "You're all caught up!" : 'No tasks yet'}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
        Add your first task above. Try{' '}
        <span className="font-medium text-[var(--color-accent)]">"Call dentist tomorrow at 3pm"</span>
      </p>
    </div>
  )
}
