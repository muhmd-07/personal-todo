import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import type { Task } from '@/lib/types/task'

interface TaskListProps {
  tasks: Task[]
  view: 'focus' | 'calendar' | 'all'
}

export function TaskList({ tasks, view }: TaskListProps) {
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
      className="space-y-6"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {overdueTasks.length > 0 && (
        <section aria-labelledby="overdue-heading">
          <h3
            id="overdue-heading"
            className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-overdue)]"
          >
            <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Overdue
            <span className="ml-0.5 rounded-full bg-amber-900/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
              {overdueTasks.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {overdueTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {todayTasks.length > 0 && (
        <section aria-labelledby="today-heading">
          <h3
            id="today-heading"
            className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            Today
            <span className="ml-0.5 rounded-full bg-violet-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-violet-400">
              {todayTasks.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {futureTasks.length > 0 && (
        <section aria-labelledby="upcoming-heading">
          <h3
            id="upcoming-heading"
            className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]"
          >
            Upcoming
            <span className="ml-0.5 rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
              {futureTasks.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {futureTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {undatedTasks.length > 0 && (
        <section aria-labelledby="undated-heading">
          <h3
            id="undated-heading"
            className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]"
          >
            No due date
            <span className="ml-0.5 rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
              {undatedTasks.length}
            </span>
          </h3>
          <ul className="space-y-2">
            {undatedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section aria-labelledby="completed-heading">
          <details>
            <summary
              id="completed-heading"
              className="cursor-pointer list-none mb-2.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-1 hover:text-[var(--color-text-primary)] transition select-none"
            >
              <svg
                aria-hidden="true"
                className="size-3 details-chevron"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Completed ({completedTasks.length})
            </summary>
            <ul className="space-y-2 mt-2">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          </details>
        </section>
      )}
    </div>
  )
}
