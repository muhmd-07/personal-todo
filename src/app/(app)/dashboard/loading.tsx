export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 rounded-lg bg-white/4 animate-pulse" />
          <div className="h-10 w-52 rounded-xl bg-white/6 animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-white/4 animate-pulse" />
        </div>
        <div className="size-10 rounded-xl bg-white/6 animate-pulse" />
      </div>

      {/* Stat cards 2×3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 animate-pulse space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-9 w-10 rounded-lg bg-white/8" />
                <div className="h-3.5 w-20 rounded-lg bg-white/4" />
              </div>
              <div className="size-9 rounded-xl bg-white/6" />
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/6" />
          </div>
        ))}
      </div>

      {/* Weekly activity */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-5 w-36 rounded-lg bg-white/8" />
            <div className="h-3.5 w-48 rounded-lg bg-white/4" />
          </div>
          <div className="h-4 w-16 rounded-lg bg-white/4" />
        </div>
        <div className="flex items-end justify-between gap-1">
          {[55, 30, 70, 45, 80, 35, 60].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 rounded-full bg-white/6" style={{ height: `${h}px` }} />
              <div className="space-y-1">
                <div className="h-2.5 w-6 rounded bg-white/4 mx-auto" />
                <div className="h-3.5 w-5 rounded bg-white/6 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-32 rounded-lg bg-white/8" />
          <div className="h-5 w-10 rounded-lg bg-white/6" />
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/8" />
        <div className="flex justify-between mt-2.5">
          <div className="h-3.5 w-24 rounded-lg bg-white/4" />
          <div className="h-3.5 w-24 rounded-lg bg-white/4" />
        </div>
      </div>

      {/* Task rows */}
      <div>
        <div className="h-4 w-24 rounded-lg bg-white/4 animate-pulse mb-3" />
        <div className="space-y-2">
          {[1, 0.75, 0.55].map((op, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 animate-pulse"
              style={{ opacity: op }}
            >
              <div className="size-2 rounded-full bg-white/10 shrink-0" />
              <div className="h-4 flex-1 rounded-lg bg-white/8" style={{ width: `${50 + i * 15}%` }} />
              <div className="h-3.5 w-10 rounded-lg bg-white/4 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
