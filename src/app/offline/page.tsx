export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100"
        >
          <svg
            className="size-6 text-zinc-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M8.11 8.11A4 4 0 0 0 4 12H2m4 0a6 6 0 0 1 6-6m6 6h2a4 4 0 0 0-4-4m0 0a6 6 0 0 0-3.36-1.05M12 12v.01"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          You&apos;re offline
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Check your connection and try again.
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Try again
        </a>
      </div>
    </div>
  )
}
