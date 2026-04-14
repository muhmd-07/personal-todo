import { createClient } from '@/lib/supabase/server'
import { HomeClient } from '@/components/home/HomeClient'
import type { Task } from '@/lib/types/task'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user!.id)
    .is('deleted_at', null)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  const now = new Date()
  const today = now.toLocaleDateString('en-CA')

  // Build week days (last 7 days including today)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return d.toLocaleDateString('en-CA')
  })

  // Next 7 days (excluding today)
  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() + i + 1)
    return d.toLocaleDateString('en-CA')
  })

  const allTasks = (tasks ?? []) as Task[]
  const activeTasks = allTasks.filter((t) => !t.completed_at)

  const completedToday = allTasks.filter((t) => {
    if (!t.completed_at) return false
    return new Date(t.completed_at).toLocaleDateString('en-CA') === today
  })

  const todayTasks = activeTasks.filter((t) => !t.due_date || t.due_date === today)
  const overdueTasks = activeTasks.filter((t) => t.due_date && t.due_date < today)
  const highPriority = activeTasks.filter((t) => t.priority === 'high')
  const upcomingTasks = activeTasks.filter((t) => t.due_date && next7.includes(t.due_date))

  // Completed per day for the last 7 days
  const weekActivity = weekDays.map((day) => ({
    date: day,
    completed: allTasks.filter((t) => {
      if (!t.completed_at) return false
      return new Date(t.completed_at).toLocaleDateString('en-CA') === day
    }).length,
    total: allTasks.filter((t) => {
      const created = new Date(t.created_at).toLocaleDateString('en-CA')
      return created <= day && (!t.completed_at || new Date(t.completed_at).toLocaleDateString('en-CA') >= day)
    }).length,
  }))

  const weekCompletedCount = weekActivity.reduce((sum, d) => sum + d.completed, 0)

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <HomeClient
      greeting={greeting}
      displayName={displayName}
      stats={{
        todayCount: todayTasks.length,
        completedTodayCount: completedToday.length,
        overdueCount: overdueTasks.length,
        highPriorityCount: highPriority.length,
        totalActive: activeTasks.length,
        upcomingCount: upcomingTasks.length,
        weekCompletedCount,
      }}
      weekActivity={weekActivity}
      focusTasks={todayTasks.slice(0, 6)}
      overdueTasks={overdueTasks.slice(0, 3)}
    />
  )
}
