import { TaskCard } from './TaskCard'
import { EmptyState } from './EmptyState'
import type { Task } from '@/lib/types/task'

interface TaskListProps {
  tasks: Task[]
  view: 'focus' | 'all'
}

export function TaskList({ tasks, view }: TaskListProps) {
  // Use local date (not UTC) to avoid midnight-rollover misclassification for non-UTC users
  const today = new Date().toLocaleDateString('en-CA') // returns YYYY-MM-DD in local time

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
    return <EmptyState />
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
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-overdue)]"
          >
            Overdue
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
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
          >
            Today
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
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
          >
            Upcoming
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
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
          >
            No due date
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
              className="cursor-pointer list-none mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] flex items-center gap-1 hover:text-[var(--color-text-primary)] transition select-none"
            >
              <svg
                aria-hidden="true"
                className="size-3"
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
