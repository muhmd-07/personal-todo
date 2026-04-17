import { useState } from 'react'
import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import type { Task } from '@/lib/types/task'

const COMPLETED_SHOW_LIMIT = 10

interface TaskListProps {
  tasks: Task[]
  view: 'focus' | 'calendar' | 'all'
}

function SectionDivider({
  label,
  count,
  color = 'muted',
}: {
  label: string
  count: number
  color?: 'muted' | 'overdue' | 'accent'
}) {
  const labelClass =
    color === 'overdue'
      ? 'text-orange-400'
      : color === 'accent'
      ? 'text-white'
      : 'text-zinc-600'

  return (
    <div className={`flex items-center gap-3 ${labelClass}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest shrink-0">{label}</span>
      <div className="flex-1 h-px bg-zinc-900" />
      <span className="text-[10px] font-bold tabular-nums opacity-60">{count}</span>
    </div>
  )
}

export function TaskList({ tasks, view }: TaskListProps) {
  const [showAllCompleted, setShowAllCompleted] = useState(false)
  const today = new Date().toLocaleDateString('en-CA')

  const activeTasks = tasks.filter((t) => !t.completed_at && !t.deleted_at)
  const completedTasks = tasks.filter((t) => t.completed_at && !t.deleted_at)

  let displayTasks = activeTasks
  if (view === 'focus') {
    displayTasks = activeTasks.filter(
      (t) => !t.due_date || t.due_date <= today,
    )
  }

  const overdueTasks = displayTasks.filter((t) => t.due_date && t.due_date < today)
  const todayTasks = displayTasks.filter((t) => t.due_date === today)
  const futureTasks = view === 'all'
    ? activeTasks.filter((t) => t.due_date && t.due_date > today)
    : []
  const undatedTasks = displayTasks.filter((t) => !t.due_date)

  if (displayTasks.length === 0 && completedTasks.length === 0) {
    return <EmptyState view={view} />
  }

  return (
    <div
      className="space-y-5"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {overdueTasks.length > 0 && (
        <section aria-labelledby="overdue-heading">
          <div id="overdue-heading" className="mb-1">
            <SectionDivider label="Overdue" count={overdueTasks.length} color="overdue" />
          </div>
          <ul>
            {overdueTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {todayTasks.length > 0 && (
        <section aria-labelledby="today-heading">
          <div id="today-heading" className="mb-1">
            <SectionDivider label="Today" count={todayTasks.length} color="accent" />
          </div>
          <ul>
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {futureTasks.length > 0 && (
        <section aria-labelledby="upcoming-heading">
          <div id="upcoming-heading" className="mb-1">
            <SectionDivider label="Upcoming" count={futureTasks.length} />
          </div>
          <ul>
            {futureTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {undatedTasks.length > 0 && (
        <section aria-labelledby="undated-heading">
          <div id="undated-heading" className="mb-1">
            <SectionDivider label="No due date" count={undatedTasks.length} />
          </div>
          <ul>
            {undatedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section aria-labelledby="completed-heading">
          <details className="group">
            <summary
              id="completed-heading"
              className="cursor-pointer list-none mb-1 select-none"
            >
              <div className="flex items-center gap-3 text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg
                  aria-hidden="true"
                  className="size-3 transition-transform group-open:rotate-90 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest shrink-0">Completed</span>
                <div className="flex-1 h-px bg-zinc-900" />
                <span className="text-[10px] font-bold tabular-nums opacity-60">{completedTasks.length}</span>
              </div>
            </summary>
            <ul className="mt-1">
              {(showAllCompleted ? completedTasks : completedTasks.slice(0, COMPLETED_SHOW_LIMIT)).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
            {completedTasks.length > COMPLETED_SHOW_LIMIT && (
              <button
                onClick={() => setShowAllCompleted(s => !s)}
                className="mt-1 w-full py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-center"
              >
                {showAllCompleted
                  ? 'Show less'
                  : `Show ${completedTasks.length - COMPLETED_SHOW_LIMIT} more`}
              </button>
            )}
          </details>
        </section>
      )}
    </div>
  )
}
