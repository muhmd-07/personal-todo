export type Task = {
  id: string
  user_id: string
  title: string
  priority: 'high' | 'normal'
  due_date: string | null
  due_time: string | null
  notes: string | null
  tags: string[]
  recurring: 'none' | 'daily' | 'weekly' | 'monthly'
  reminder_time: string | null
  notified_at: string | null
  completed_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export type Subtask = {
  id: string
  task_id: string
  user_id: string
  title: string
  completed_at: string | null
  position: number
  created_at: string
}

export type Habit = {
  id: string
  user_id: string
  title: string
  color: string
  position: number
  created_at: string
}

export type HabitCompletion = {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export type ParsedTask = {
  title: string
  dueDate: Date | null
  reminderTime: Date | null
  lowConfidence?: boolean
  tags?: string[]
  priority?: 'high' | 'normal'
}
