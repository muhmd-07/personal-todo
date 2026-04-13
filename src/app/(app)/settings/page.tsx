import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './profile-form'
import { DeleteAccountSection } from './delete-account-section'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? ''

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Settings
          </h1>
          <a
            href="/dashboard"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition"
          >
            ← Back to tasks
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-10">
        {/* Profile section */}
        <section aria-labelledby="profile-heading">
          <h2
            id="profile-heading"
            className="text-base font-semibold text-[var(--color-text-primary)] mb-4"
          >
            Profile
          </h2>
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <div className="mb-4">
              <p className="text-sm text-[var(--color-text-muted)]">
                Email:{' '}
                <span className="font-medium text-[var(--color-text-primary)]">
                  {user?.email}
                </span>
              </p>
            </div>
            <ProfileForm initialDisplayName={displayName} />
          </div>
        </section>

        {/* Data export */}
        <section aria-labelledby="export-heading">
          <h2
            id="export-heading"
            className="text-base font-semibold text-[var(--color-text-primary)] mb-4"
          >
            Data export
          </h2>
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Download all your data in JSON format.
            </p>
            <a
              href="/api/export"
              download
              className="inline-flex rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 transition"
            >
              Export my data
            </a>
          </div>
        </section>

        {/* Danger zone */}
        <section aria-labelledby="danger-heading">
          <h2
            id="danger-heading"
            className="text-base font-semibold text-red-600 mb-4"
          >
            Danger zone
          </h2>
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <DeleteAccountSection email={user?.email ?? ''} />
          </div>
        </section>
      </main>
    </div>
  )
}
