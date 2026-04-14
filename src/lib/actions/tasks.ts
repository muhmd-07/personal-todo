'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

type ActionResult<T = null> =
  | { data: T; error: null }
  | { data: null; error: { message: string } }

// ─── Schemas ─────────────────────────────────────────────────────────────────

const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(500).trim(),
  priority: z.enum(['high', 'normal']).optional().default('normal'),
  due_date: z.string().nullable().optional(),
  due_time: z.string().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  reminder_time: z.string().nullable().optional(),
})

const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.string().uuid(),
})

const RescheduleSchema = z.object({
  id: z.string().uuid(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
})

// ─── Create Task ──────────────────────────────────────────────────────────────

export async function createTaskAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateTaskSchema.safeParse(input)
  if (!parsed.success) {
    return { data: null, error: { message: parsed.error.issues[0]?.message ?? 'Validation failed' } }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      priority: parsed.data.priority ?? 'normal',
      due_date: parsed.data.due_date ?? null,
      due_time: parsed.data.due_time ?? null,
      notes: parsed.data.notes ?? null,
      reminder_time: parsed.data.reminder_time ?? null,
    })
    .select('id')
    .single()

  if (error) {
    return { data: null, error: { message: error.message } }
  }

  revalidatePath('/dashboard')
  return { data: { id: data.id }, error: null }
}

// ─── Complete Task ────────────────────────────────────────────────────────────

export async function completeTaskAction(id: string): Promise<ActionResult> {
  const idParsed = z.string().uuid().safeParse(id)
  if (!idParsed.success) return { data: null, error: { message: 'Invalid task ID' } }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { error } = await supabase
    .from('tasks')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return { data: null, error: { message: error.message } }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

// ─── Uncomplete Task ──────────────────────────────────────────────────────────

export async function uncompleteTaskAction(id: string): Promise<ActionResult> {
  const idParsed = z.string().uuid().safeParse(id)
  if (!idParsed.success) return { data: null, error: { message: 'Invalid task ID' } }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { error } = await supabase
    .from('tasks')
    .update({ completed_at: null })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return { data: null, error: { message: error.message } }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

// ─── Update Task ──────────────────────────────────────────────────────────────

export async function updateTaskAction(input: unknown): Promise<ActionResult> {
  const parsed = UpdateTaskSchema.safeParse(input)
  if (!parsed.success) {
    return { data: null, error: { message: parsed.error.issues[0]?.message ?? 'Validation failed' } }
  }

  const { id, ...fields } = parsed.data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { error } = await supabase
    .from('tasks')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return { data: null, error: { message: error.message } }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

// ─── Delete Task (soft delete) ────────────────────────────────────────────────

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  const idParsed = z.string().uuid().safeParse(id)
  if (!idParsed.success) return { data: null, error: { message: 'Invalid task ID' } }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return { data: null, error: { message: error.message } }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

// ─── Reschedule Task ──────────────────────────────────────────────────────────

export async function rescheduleTaskAction(
  id: string,
  dueDate: string,
): Promise<ActionResult> {
  const parsed = RescheduleSchema.safeParse({ id, dueDate })
  if (!parsed.success) {
    return { data: null, error: { message: parsed.error.issues[0]?.message ?? 'Invalid input' } }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const { error } = await supabase
    .from('tasks')
    .update({ due_date: parsed.data.dueDate, notified_at: null })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) return { data: null, error: { message: error.message } }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}
