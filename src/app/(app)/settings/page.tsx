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
      <main className="mx-auto max-w-2xl px-5 py-8 space-y-8">
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">Settings</h1>

        {/* Profile section */}
        <section aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            Profile
          </h2>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-4">
              <p className="text-sm text-[var(--color-text-muted)]">
                Email:{' '}
                <span className="font-semibold text-[var(--color-text-primary)]">{user?.email}</span>
              </p>
            </div>
            <ProfileForm initialDisplayName={displayName} />
          </div>
        </section>

        {/* Data export */}
        <section aria-labelledby="export-heading">
          <h2 id="export-heading" className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            Data export
          </h2>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Download all your data in JSON format.</p>
            <a
              href="/api/export"
              download
              className="inline-flex rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white/6 transition"
            >
              Export my data
            </a>
          </div>
        </section>

        {/* Danger zone */}
        <section aria-labelledby="danger-heading">
          <h2 id="danger-heading" className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
            Danger zone
          </h2>
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
            <DeleteAccountSection email={user?.email ?? ''} />
          </div>
        </section>
      </main>
    </div>
  )
}
