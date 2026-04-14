'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signOutAction } from '@/lib/actions/auth'

const smartLists = [
  {
    label: 'Home',
    href: '/dashboard',
    exact: true,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
      </svg>
    ),
  },
  {
    label: 'Today',
    href: '/dashboard/tasks?v=today',
    v: 'today',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    label: 'Upcoming',
    href: '/dashboard/tasks?v=upcoming',
    v: 'upcoming',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
    ),
  },
  {
    label: 'Inbox',
    href: '/dashboard/tasks?v=inbox',
    v: 'inbox',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
      </svg>
    ),
  },
  {
    label: 'All Tasks',
    href: '/dashboard/tasks',
    v: null,
    exact: true,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
]

function NavItem({ item, active }: { item: typeof smartLists[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-all duration-100 ${
        active
          ? 'bg-violet-600/15 text-violet-300'
          : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
      }`}
    >
      <span className={active ? 'text-violet-400' : 'text-[var(--color-text-muted)]'}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const v = searchParams.get('v')

  function isActive(item: typeof smartLists[0]) {
    // Home: exact match on /dashboard
    if (item.href === '/dashboard') return pathname === '/dashboard'
    // All Tasks: /dashboard/tasks with no query param
    if (item.exact && item.href === '/dashboard/tasks') {
      return pathname === '/dashboard/tasks' && !v
    }
    // Smart lists: match path + query param
    if (item.v !== undefined) {
      return pathname === '/dashboard/tasks' && v === item.v
    }
    return pathname.startsWith(item.href.split('?')[0])
  }

  const mobileNav = smartLists.filter(i =>
    ['/dashboard', '/dashboard/tasks?v=today', '/dashboard/tasks'].includes(i.href)
  )

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[232px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-[18px]">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-900/40">
            <svg className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)]">Slate</span>
        </div>

        {/* Smart lists */}
        <nav className="flex-1 px-2 pb-2 space-y-0.5 overflow-y-auto">
          {smartLists.map((item) => (
            <NavItem key={item.href + item.label} item={item} active={isActive(item)} />
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-[var(--color-border)]" />

          <Link
            href="/settings"
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-all duration-100 ${
              pathname === '/settings'
                ? 'bg-violet-600/15 text-violet-300'
                : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
            }`}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px] text-[var(--color-text-muted)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>

        {/* User + sign out */}
        <div className="px-2 py-3 border-t border-[var(--color-border)]">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[17px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
              <svg className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[var(--color-text-primary)]">Slate</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Link href="/settings" className="flex size-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 transition">
              <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="flex size-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-white/8 transition">
                <svg fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="size-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </form>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md sticky bottom-0 z-10">
          {mobileNav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition ${
                isActive(item)
                  ? 'text-violet-400'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
