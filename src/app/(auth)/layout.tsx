export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_#ede9fe_0%,_transparent_60%)] bg-[var(--color-background)] px-4">
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-accent)] shadow-md">
          <svg
            aria-hidden="true"
            className="size-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-[var(--color-text-primary)]">Personal Todo</span>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-white shadow-lg p-8">
        {children}
      </div>
    </div>
  )
}
