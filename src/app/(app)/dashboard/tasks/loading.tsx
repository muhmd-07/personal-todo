export default function TasksLoading() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-24 rounded-xl bg-white/6 animate-pulse" />
          <div className="h-4 w-36 rounded-lg bg-white/4 animate-pulse mt-2" />
        </div>
        <div className="size-10 rounded-xl bg-white/6 animate-pulse" />
      </div>

      {/* Input skeleton */}
      <div className="h-14 w-full rounded-2xl bg-white/6 animate-pulse mb-4" />

      {/* Chips */}
      <div className="flex gap-2 mb-4">
        {[60, 48, 64, 56].map((w, i) => (
          <div key={i} className="h-7 rounded-full bg-white/4 animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-9 w-52 rounded-xl bg-white/6 animate-pulse" />
      </div>

      {/* Section label */}
      <div className="h-4 w-20 rounded-lg bg-white/4 animate-pulse mb-3" />

      {/* Task cards */}
      <div className="space-y-2.5">
        {[1, 0.85, 0.7, 0.9, 0.6].map((opacity, i) => (
          <TaskCardSkeleton key={i} opacity={opacity} wide={i % 2 === 0} />
        ))}
      </div>
    </div>
  )
}

function TaskCardSkeleton({ opacity, wide }: { opacity: number; wide: boolean }) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 animate-pulse"
      style={{ opacity }}
    >
      {/* Checkbox */}
      <div className="size-[22px] rounded-full border-2 border-[var(--color-border-strong)] shrink-0" />
      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-lg bg-white/8" style={{ width: wide ? '65%' : '45%' }} />
        <div className="h-3 w-24 rounded-lg bg-white/4" />
      </div>
    </div>
  )
}
