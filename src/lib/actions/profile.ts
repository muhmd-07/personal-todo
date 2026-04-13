'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

type ActionResult<T = null> =
  | { data: T; error: null }
  | { data: null; error: { message: string; fields?: Record<string, string[]> } }

const UpdateProfileSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(64, 'Display name must be 64 characters or fewer')
    .trim(),
})

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  const parsed = UpdateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        message: 'Validation failed',
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    data: { display_name: parsed.data.display_name },
  })

  if (error) {
    return { data: null, error: { message: error.message } }
  }

  return { data: null, error: null }
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export async function deleteAccountAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } }
  }

  // Use admin client to delete the user (requires service role key)
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user.id)

  if (error) {
    return { data: null, error: { message: error.message } }
  }

  // Sign out and redirect
  await supabase.auth.signOut()
  redirect('/register')
}
