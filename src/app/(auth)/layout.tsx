export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-background)]"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.12) 0%, transparent 60%), #0c0c0e' }}
    >
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-900/50">
          <svg
            aria-hidden="true"
            className="size-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Slate</span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Task management without the noise.</p>
        </div>
      </div>
      <div className="w-full max-w-sm rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-black/60 p-8">
        {children}
      </div>
    </div>
  )
}
