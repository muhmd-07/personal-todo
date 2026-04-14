import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  let isLoggedIn = false
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    isLoggedIn = !!data.user
  } catch {
    // fail open
  }

  return (
    <div className="min-h-screen bg-[#080809] text-white overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: 'linear-gradient(to bottom, rgba(8,8,9,0.95) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700">
            <svg className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-base font-black tracking-tight">Slate</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition">Features</a>
          <a href="#pricing" className="text-sm font-medium text-white/60 hover:text-white transition">Pricing</a>
          <a href="#about" className="text-sm font-medium text-white/60 hover:text-white transition">About</a>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 px-4 py-2 text-sm font-bold text-white hover:from-violet-400 hover:to-violet-600 transition"
            >
              Go to app
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white transition">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 px-4 py-2 text-sm font-bold text-white hover:from-violet-400 hover:to-violet-600 transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-end pb-24 md:pb-32"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 60% 40%, rgba(109,40,217,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(139,92,246,0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0d0a14 0%, #080809 50%, #0a090d 100%)
          `,
        }}
      >
        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orb */}
        <div
          className="pointer-events-none absolute right-1/4 top-1/3 size-[600px] -translate-y-1/2 translate-x-1/2 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-6xl px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-900/20 px-4 py-1.5">
              <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-violet-300 tracking-wider uppercase">Now available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Task management<br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%)' }}
              >
                without the noise.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/55 font-medium leading-relaxed mb-10 max-w-xl">
              Slate strips away the complexity. Capture tasks in seconds,
              stay laser-focused, and ship what actually matters.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={isLoggedIn ? '/dashboard' : '/register'}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-900/40 hover:from-violet-400 hover:to-violet-600 transition-all duration-200"
              >
                {isLoggedIn ? 'Open Slate' : 'Start for free'}
                <svg className="size-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-7 py-3.5 text-base font-semibold text-white/70 hover:text-white hover:border-white/20 transition">
                See features
              </a>
            </div>
            <p className="mt-5 text-sm text-white/30 font-medium">No credit card required · Free forever plan</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="size-5 text-white/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Built for focus.<br />
              <span className="text-white/40">Not for feature bloat.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Instant capture',
                desc: 'Type "Call dentist tomorrow at 3pm" and Slate parses the date and time automatically.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
              },
              {
                title: 'Focus mode',
                desc: "See only what's due today. No infinite backlogs, no decision fatigue.",
                icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
              },
              {
                title: 'Progress tracking',
                desc: 'A simple daily progress bar. Watch it fill up as you crush tasks.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
              },
              {
                title: 'Priority system',
                desc: 'Mark tasks as high priority with a single tap. Never lose track of what matters.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />,
              },
              {
                title: 'Smart reminders',
                desc: 'Set reminders in plain English. Slate will ping you at exactly the right time.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
              },
              {
                title: 'Secure by default',
                desc: 'Your tasks are private, encrypted, and yours. No selling your data. Ever.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/6 bg-white/[0.03] p-6 hover:border-violet-500/30 hover:bg-violet-900/10 transition-all duration-300"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-900/20 text-violet-400 group-hover:bg-violet-900/30 transition">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="size-6">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="h-px mx-12 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* ── Pricing ────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple. Fair. Honest.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Free */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black">$0</span>
              </div>
              <p className="text-sm text-white/40 mb-8">Forever free, no catch.</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited tasks', 'Focus mode', 'Natural language input', 'Priority flags', 'Progress tracking'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <svg className="size-4 text-violet-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={isLoggedIn ? '/dashboard' : '/register'}
                className="block text-center rounded-xl border border-white/10 py-3 text-sm font-bold text-white/80 hover:bg-white/6 hover:text-white transition"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div
              className="rounded-3xl border border-violet-500/40 p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(139,92,246,0.08) 100%)' }}
            >
              <div className="absolute top-5 right-5 rounded-full bg-violet-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                Popular
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black">$5</span>
                <span className="text-white/40 mb-2 text-sm font-medium">/month</span>
              </div>
              <p className="text-sm text-white/40 mb-8">Everything in Free, plus:</p>
              <ul className="space-y-3 mb-8">
                {['Recurring tasks', 'Smart reminders', 'Data export', 'Calendar sync', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <svg className="size-4 text-violet-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={isLoggedIn ? '/dashboard' : '/register'}
                className="block text-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 py-3 text-sm font-bold text-white hover:from-violet-400 hover:to-violet-600 transition"
              >
                Start Pro free for 14 days
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="rounded-3xl border border-violet-500/20 p-12 md:p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(8,8,9,0) 100%)' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
            />
            <p className="relative text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Get started today</p>
            <h2 className="relative text-4xl md:text-5xl font-black tracking-tight mb-4">
              Stop planning.<br />Start shipping.
            </h2>
            <p className="relative text-base text-white/50 mb-8 max-w-lg mx-auto">
              Join thousands of people who use Slate to stay focused and get the right things done.
            </p>
            <Link
              href={isLoggedIn ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-900/40 hover:from-violet-400 hover:to-violet-600 transition"
            >
              {isLoggedIn ? 'Go to Slate' : 'Create free account'}
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 px-6 md:px-12 py-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700">
              <svg className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-black text-white">Slate</span>
          </div>
          <p className="text-sm text-white/25">© {new Date().getFullYear()} Slate. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition">Privacy</a>
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition">Terms</a>
            <Link href="/login" className="text-sm text-white/30 hover:text-white/60 transition">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
