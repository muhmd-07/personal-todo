import { createClient } from '@/lib/supabase/server'
import { TasksClient } from '@/components/tasks/TasksClient'
import type { Task } from '@/lib/types/task'

export const revalidate = 30

interface TasksPageProps {
  searchParams: Promise<{ v?: string }>
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { v } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user!.id)
    .is('deleted_at', null)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  return <TasksClient tasks={(tasks ?? []) as Task[]} initialView={v} />
}
