'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signOutAction } from '@/lib/actions/auth'
import { CommandPalette } from '@/components/CommandPalette'
import type { Task } from '@/lib/types/task'

const NAV_TASKS = [
  { label: 'Home',      href: '/dashboard',                  exact: true,  v: undefined },
  { label: 'Today',     href: '/dashboard/tasks?v=today',    v: 'today' },
  { label: 'Upcoming',  href: '/dashboard/tasks?v=upcoming', v: 'upcoming' },
  { label: 'All Tasks', href: '/dashboard/tasks',            exact: true,  v: null },
]
const NAV_TOOLS = [
  { label: 'Create',       href: '/dashboard/create' },
  { label: 'Focus Mode',   href: '/dashboard/focus' },
  { label: 'AI Assistant', href: '/dashboard/ai',    badge: 'AI' },
  { label: 'Habits',       href: '/dashboard/habits' },
  { label: 'Stats',        href: '/dashboard/stats' },
]

function NavIcon({ label }: { label: string }) {
  const p = { fill: 'none' as const, stroke: 'currentColor' as const, strokeWidth: '1.6' as const, viewBox: '0 0 24 24' as const, className: 'size-[15px]' }
  if (label === 'Home')         return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /></svg>
  if (label === 'Today')        return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
  if (label === 'Upcoming')     return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></svg>
  if (label === 'All Tasks')    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
  if (label === 'Create')       return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
  if (label === 'Focus Mode')   return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
  if (label === 'AI Assistant') return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
  if (label === 'Habits')       return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  if (label === 'Stats')        return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
  if (label === 'Settings')     return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12" /></svg>
}

export function AppShell({ children, tasks = [] }: { children: React.ReactNode; tasks?: Task[] }) {
  const pathname = usePathname()
  const params  = useSearchParams()
  const v       = params.get('v')

  function activeTask(item: typeof NAV_TASKS[0]) {
    if (item.href === '/dashboard') return pathname === '/dashboard'
    if (item.exact && item.href === '/dashboard/tasks') return pathname === '/dashboard/tasks' && !v
    if (item.v) return pathname === '/dashboard/tasks' && v === item.v
    return false
  }

  const navItem = (on: boolean) =>
    `relative flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
      on
        ? 'bg-white/[0.08] text-white nav-active-glow'
        : 'text-[#454545] hover:text-[#c0c0c0] hover:bg-white/[0.035]'
    }`

  const sideNavItem = (on: boolean) =>
    `relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
      on ? 'bg-white text-black' : 'text-zinc-600 hover:text-white hover:bg-zinc-900'
    }`

  return (
    <div className="flex min-h-screen bg-black">
      <CommandPalette tasks={tasks} />

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col bg-black border-r border-zinc-900">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-zinc-900">
          <div className="flex size-6 items-center justify-center rounded-md bg-white text-black">
            <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[15px] font-extrabold text-white tracking-tight">Nudge</span>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
            className="ml-auto text-[10px] font-bold text-zinc-700 hover:text-zinc-400 transition-colors"
            title="Open command palette"
          >
            ⌘K
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-800">Tasks</p>
          {NAV_TASKS.map(item => {
            const on = activeTask(item)
            return (
              <Link key={item.label} href={item.href} className={sideNavItem(on)}>
                <span className={on ? 'text-black' : 'text-zinc-700'}><NavIcon label={item.label} /></span>
                {item.label}
              </Link>
            )
          })}

          <div className="my-3 border-t border-zinc-900" />
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-800">Tools</p>

          {NAV_TOOLS.map(item => {
            const on = pathname === item.href
            return (
              <Link key={item.label} href={item.href} className={sideNavItem(on)}>
                <span className={on ? 'text-black' : 'text-zinc-700'}><NavIcon label={item.label} /></span>
                {item.label}
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                )}
              </Link>
            )
          })}

          <div className="my-3 border-t border-zinc-900" />
          <Link href="/settings" className={sideNavItem(pathname === '/settings')}>
            <span className={pathname === '/settings' ? 'text-black' : 'text-zinc-700'}><NavIcon label="Settings" /></span>
            Settings
          </Link>
        </nav>

        <div className="p-3 border-t border-zinc-900">
          <form action={signOutAction}>
            <button type="submit" className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-zinc-700 hover:text-red-400 hover:bg-red-950/20 transition-all">
              <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[15px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 bg-black">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between h-14 px-5 bg-black border-b border-zinc-900 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-white text-black">
              <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-[15px] font-extrabold text-white">Nudge</span>
          </div>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
            className="text-[11px] font-semibold text-zinc-600 hover:text-white transition-colors"
          >
            Search
          </button>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-zinc-900 bg-black/95 backdrop-blur-xl sticky bottom-0 z-10">
          {[
            { label: 'Home',   href: '/dashboard' },
            { label: 'Today',  href: '/dashboard/tasks?v=today' },
            { label: 'Create', href: '/dashboard/create' },
            { label: 'Focus',  href: '/dashboard/focus' },
            { label: 'Stats',  href: '/dashboard/stats' },
          ].map(item => {
            const on = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href.split('?')[0]) && (item.href.includes('?') ? v === 'today' : true)
            return (
              <Link key={item.label} href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-all ${on ? 'text-white' : 'text-zinc-800'}`}>
                <NavIcon label={item.label === 'Focus' ? 'Focus Mode' : item.label} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
