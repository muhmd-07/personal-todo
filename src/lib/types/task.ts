export type Task = {
  id: string
  user_id: string
  title: string
  due_date: string | null   // ISO date string YYYY-MM-DD
  due_time: string | null   // HH:MM:SS
  notes: string | null
  reminder_time: string | null  // ISO datetime
  notified_at: string | null
  completed_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export type ParsedTask = {
  title: string
  dueDate: Date | null
  reminderTime: Date | null
  lowConfidence?: boolean
}
