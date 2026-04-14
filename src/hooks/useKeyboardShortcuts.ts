'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onFocusInput: () => void
  onSetView: (view: 'focus' | 'calendar' | 'all') => void
}

/**
 * Global keyboard shortcuts:
 *   / or n  → focus the task input
 *   f       → switch to focus view
 *   c       → switch to calendar view
 *   a       → switch to all-tasks view
 */
export function useKeyboardShortcuts({
  onFocusInput,
  onSetView,
}: ShortcutHandlers) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      switch (e.key) {
        case '/':
        case 'n':
          e.preventDefault()
          onFocusInput()
          break
        case 'f':
          onSetView('focus')
          break
        case 'c':
          onSetView('calendar')
          break
        case 'a':
          onSetView('all')
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFocusInput, onSetView])
}
