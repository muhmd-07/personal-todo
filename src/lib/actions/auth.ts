'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  RegisterSchema,
  LoginSchema,
  ResetPasswordRequestSchema,
  ResetPasswordConfirmSchema,
} from '@/lib/schemas/auth'
import { authRatelimit } from '@/lib/ratelimit'

type ActionResult<T = null> =
  | { data: T; error: null }
  | { data: null; error: { message: string; fields?: Record<string, string[]> } }

async function checkRateLimit(identifier: string): Promise<ActionResult | null> {
  try {
    const { success, reset } = await authRatelimit.limit(identifier)
    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000)
      return {
        data: null,
        error: {
          message: `Too many attempts. Please try again in ${retryAfterSeconds} seconds.`,
        },
      }
    }
  } catch (e) {
    // Redis unavailable — log and fail open rather than blocking users
    console.error('[auth] Redis unavailable, rate limit bypassed:', e)
  }
  return null
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerAction(
  input: unknown
): Promise<ActionResult<{ needsEmailVerification?: boolean }>> {
  const parsed = RegisterSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        message: 'Validation failed',
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    }
  }

  const rateLimitResult = await checkRateLimit(`register:${parsed.data.email}`)
  if (rateLimitResult) return rateLimitResult

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('user already exists')) {
      return {
        data: null,
        error: {
          message: 'An account with this email already exists — try signing in instead',
          fields: { email: ['An account with this email already exists — try signing in instead'] },
        },
      }
    }
    return { data: null, error: { message: error.message } }
  }

  // If session is null, Supabase requires email confirmation before login
  if (!data.session) {
    return { data: { needsEmailVerification: true }, error: null }
  }

  redirect('/dashboard')
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = LoginSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        message: 'Validation failed',
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    }
  }

  const rateLimitResult = await checkRateLimit(`login:${parsed.data.email}`)
  if (rateLimitResult) return rateLimitResult

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      data: null,
      error: {
        message: 'Incorrect email or password',
        fields: { email: ['Incorrect email or password'] },
      },
    }
  }

  redirect('/dashboard')
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ─── Reset Password Request ──────────────────────────────────────────────────

export async function resetPasswordRequestAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = ResetPasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: {
        message: 'Please enter a valid email address',
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    }
  }

  const rateLimitResult = await checkRateLimit(`reset:${parsed.data.email}`)
  if (rateLimitResult) return rateLimitResult

  const supabase = await createClient()
  // Always show success regardless of whether email exists (prevent enumeration)
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`,
  })

  return { data: null, error: null }
}

// ─── Reset Password Confirm ───────────────────────────────────────────────────

export async function resetPasswordConfirmAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = ResetPasswordConfirmSchema.safeParse(input)
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
    password: parsed.data.password,
  })

  if (error) {
    return { data: null, error: { message: error.message } }
  }

  redirect('/login')
}
