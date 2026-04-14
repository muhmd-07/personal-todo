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

  const today = new Date().toLocaleDateString('en-CA')
  const allTasks = (tasks ?? []) as Task[]
  const activeTasks = allTasks.filter((t) => !t.completed_at)
  const completedToday = allTasks.filter((t) => {
    if (!t.completed_at) return false
    return new Date(t.completed_at).toLocaleDateString('en-CA') === today
  })
  const todayTasks = activeTasks.filter((t) => !t.due_date || t.due_date === today)
  const overdueTasks = activeTasks.filter((t) => t.due_date && t.due_date < today)
  const highPriority = activeTasks.filter((t) => t.priority === 'high')

  const hour = new Date().getHours()
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
      }}
      focusTasks={todayTasks.slice(0, 5)}
      overdueTasks={overdueTasks.slice(0, 3)}
    />
  )
}
