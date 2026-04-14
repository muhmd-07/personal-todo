import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white text-[#0f0f12]" style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700">
              <svg className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight">Slate</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" className="rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:from-violet-600 hover:to-violet-800 transition-all">
                Go to app →
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition">
                  Sign in
                </Link>
                <Link href="/register" className="rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:from-violet-600 hover:to-violet-800 transition-all">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-5" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, #ede9fe 0%, transparent 70%)' }}>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-6">
            <span className="size-1.5 rounded-full bg-violet-500 inline-block" />
            Simple by design
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-[#0f0f12] mb-5">
            Everything you need.<br />
            <span className="text-violet-600">Nothing you don&apos;t.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Slate captures tasks in plain English, shows you only what matters today, and gets out of your way.
            No folders. No tags. No clutter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-violet-600 hover:to-violet-800 transition-all">
              Get started free →
            </Link>
            <a href="#features" className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">No credit card required · Free forever plan</p>
        </div>

        {/* App Preview */}
        <div className="mx-auto max-w-lg mt-16">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-violet-100/50 overflow-hidden">
            {/* Mock header */}
            <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-violet-700">
                <svg className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800">Slate</span>
            </div>
            {/* Mock input */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                <span className="text-sm text-gray-400">Add a task… try &apos;Call dentist tomorrow at 3pm&apos;</span>
                <div className="ml-auto flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 shrink-0">
                  <svg className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Mock task list */}
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs font-semibold text-gray-800 mb-2">Today <span className="ml-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] text-violet-700">3</span></p>
              {[
                { title: 'Submit project report', done: true, time: null, high: false },
                { title: 'Call dentist', done: false, time: 'Today · 15:00', high: true },
                { title: 'Review Q3 metrics', done: false, time: 'Today · 17:00', high: false },
              ].map((t, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 ${t.done ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]'}`}>
                  <div className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${t.done ? 'border-violet-500 bg-violet-500' : t.high ? 'border-orange-400' : 'border-gray-300'}`}>
                    {t.done && <svg className="size-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${t.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</p>
                    {t.time && <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      {t.high && <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-orange-600 font-semibold text-[9px]">HIGH</span>}
                      {t.time}
                    </p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-5 bg-[#fafafa]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Designed to disappear</h2>
            <p className="text-gray-500 max-w-md mx-auto">The best productivity tool is one you don&apos;t have to think about.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
                title: 'Natural language',
                desc: 'Type "dentist tomorrow at 3pm" or "weekly review next Monday" — Slate parses dates and times automatically.',
              },
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Focus mode',
                desc: "See only today's tasks and what's overdue. Switch to All Tasks when you need the full picture.",
              },
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: 'Instant capture',
                desc: 'Press / anywhere in the app to jump to the input. Your ideas are captured before they disappear.',
              },
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 9.143M3 3h18M3 3L1.5 1.5M21 3l-1.664 9.143M21 3l1.5-1.5M9.143 16.664L3.664 12.143m14.693 4.521L21.336 12.143M9 21h6m-6 0a3 3 0 01-3-3v-3h12v3a3 3 0 01-3 3m-6 0h6" />
                  </svg>
                ),
                title: 'Task priorities',
                desc: 'Flag your most important tasks as high priority so they always stand out from the rest.',
              },
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                ),
                title: 'Smart reminders',
                desc: 'Set a reminder time on any task and get a push notification right when you need it.',
              },
              {
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                title: 'Export anytime',
                desc: 'Your data is always yours. Export all your tasks to CSV in one click, no lock-in.',
              },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-200 transition-all duration-200">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-5 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Simple pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">Free</p>
                <p className="text-4xl font-bold tracking-tight">$0</p>
                <p className="text-sm text-gray-400 mt-1">forever</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited tasks', 'Natural language input', 'Focus mode', 'Task priorities', 'Keyboard shortcuts'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <svg className="size-4 shrink-0 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Get started free
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-violet-500 bg-gradient-to-br from-violet-600 to-violet-800 p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                Popular
              </div>
              <div className="mb-6">
                <p className="text-sm font-semibold text-violet-200 mb-1">Pro</p>
                <p className="text-4xl font-bold tracking-tight">$5</p>
                <p className="text-sm text-violet-200 mt-1">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'Push notifications', 'Reminders & alerts', 'CSV export', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-violet-100">
                    <svg className="size-4 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-violet-700 hover:bg-violet-50 transition">
                Start 14-day free trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-5" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%, #ede9fe 0%, transparent 70%)' }}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Start today. Stay focused.</h2>
          <p className="text-gray-500 mb-8">Join thousands of people who use Slate to get things done without the noise.</p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 px-7 py-3 text-sm font-semibold text-white shadow-md hover:from-violet-600 hover:to-violet-800 transition-all">
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10 px-5">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-violet-700">
              <svg className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold">Slate</span>
            <span className="text-xs text-gray-400 ml-2">Task management without the noise.</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Slate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
