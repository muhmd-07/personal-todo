import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all tasks for this user using admin client (bypasses RLS for export)
  const admin = createAdminClient()
  const { data: tasks, error } = await admin
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }

  const exportPayload = {
    exported_at: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.display_name ?? null,
      created_at: user.created_at,
    },
    tasks: tasks ?? [],
  }

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="personal-todo-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
