export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="border-b border-[var(--color-border)] px-6 py-14 pb-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="h-6 w-36 rounded-full bg-white/6 animate-pulse" />
              <div className="h-12 w-72 rounded-xl bg-white/8 animate-pulse" />
              <div className="h-5 w-80 rounded-lg bg-white/4 animate-pulse" />
              <div className="flex gap-3 pt-1">
                <div className="h-10 w-40 rounded-xl bg-white/8 animate-pulse" />
                <div className="h-10 w-24 rounded-xl bg-white/4 animate-pulse" />
              </div>
            </div>
            <div className="size-9 rounded-xl bg-white/6 animate-pulse" />
          </div>

          {/* Stat callouts */}
          <div className="mt-10 grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-[var(--color-surface)] px-4 py-5 animate-pulse">
                <div className="h-9 w-8 rounded-lg bg-white/8" />
                <div className="h-3 w-16 rounded bg-white/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Progress bar */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 rounded-lg bg-white/8" />
              <div className="h-3.5 w-44 rounded-lg bg-white/4" />
            </div>
            <div className="h-8 w-12 rounded-lg bg-white/8" />
          </div>
          <div className="h-2 w-full rounded-full bg-white/8" />
        </div>

        {/* Two-col */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] animate-pulse">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <div className="h-3.5 w-20 rounded bg-white/4" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded bg-white/6" />
                  <div className="h-4 w-32 rounded bg-white/4" />
                </div>
                <div className="h-6 w-6 rounded bg-white/8" />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5 animate-pulse">
            <div className="flex justify-between mb-5">
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-white/8" />
                <div className="h-3 w-20 rounded bg-white/4" />
              </div>
              <div className="h-3.5 w-14 rounded bg-white/4" />
            </div>
            <div className="flex items-end justify-between gap-1" style={{ height: '72px' }}>
              {[45, 25, 60, 35, 70, 20, 55].map((h, i) => (
                <div key={i} className="flex flex-col items-end justify-end flex-1 gap-2">
                  <div className="w-full rounded-full bg-white/6" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task rows */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="size-4 rounded bg-white/8" />
              <div className="h-4 w-24 rounded bg-white/6" />
            </div>
            <div className="h-3.5 w-14 rounded bg-white/4" />
          </div>
          {[1, 0.75, 0.55].map((op, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--color-border)] last:border-b-0 animate-pulse"
              style={{ opacity: op }}
            >
              <div className="size-2 rounded-full bg-white/10 shrink-0" />
              <div className="h-4 flex-1 rounded-lg bg-white/6" />
              <div className="h-3.5 w-10 rounded-lg bg-white/4 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
