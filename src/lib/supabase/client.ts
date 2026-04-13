// Supabase browser client — use in Client Components
// Uses @supabase/ssr createBrowserClient (NOT deprecated @supabase/auth-helpers-nextjs)

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
