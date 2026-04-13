import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/lib/actions/auth'
import { DashboardClient } from '@/components/tasks/DashboardClient'
import type { Task } from '@/lib/types/task'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Personal Todo
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="/settings"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition"
            >
              Settings
            </a>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <DashboardClient
          tasks={(tasks ?? []) as Task[]}
          email={user.email ?? ''}
        />
      </main>
    </div>
  )
}
