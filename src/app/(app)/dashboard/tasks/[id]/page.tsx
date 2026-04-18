import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TaskDetailClient } from '@/components/tasks/TaskDetailClient'
import type { Task, Subtask } from '@/lib/types/task'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!task) notFound()

  const { data: subtasks } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', id)
    .eq('user_id', user!.id)
    .order('position', { ascending: true })

  return (
    <TaskDetailClient
      task={task as Task}
      subtasks={(subtasks ?? []) as Subtask[]}
    />
  )
}
