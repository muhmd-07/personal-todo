import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushNotification } from '@/lib/push/webpush'

// Vercel Cron: runs every minute
// vercel.json: { "crons": [{ "path": "/api/cron/send-reminders", "schedule": "* * * * *" }] }

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    console.error('[cron] CRON_SECRET is not configured')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date()
  const windowEnd = new Date(now.getTime() + 60_000) // next 60 seconds
  // Floor: don't re-fire reminders older than 24 hours (handles downtime catch-up)
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const { data: tasks, error: fetchError } = await admin
    .from('tasks')
    .select('id, user_id, title, due_time, reminder_time')
    .gte('reminder_time', windowStart.toISOString())
    .lte('reminder_time', windowEnd.toISOString())
    .is('notified_at', null)
    .is('completed_at', null)
    .is('deleted_at', null)

  if (fetchError) {
    console.error('[cron] Failed to fetch reminder tasks:', fetchError.message)
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  const expiredEndpoints: string[] = []

  for (const task of tasks) {
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('endpoint, keys')
      .eq('user_id', task.user_id)

    if (!subs || subs.length === 0) continue

    let taskSent = 0
    for (const sub of subs) {
      const ok = await sendPushNotification(
        { endpoint: sub.endpoint, keys: sub.keys as { p256dh: string; auth: string } },
        {
          title: `Reminder: ${task.title}`,
          body: task.due_time ? `Due at ${task.due_time.slice(0, 5)}` : undefined,
          url: '/dashboard',
        },
      )
      if (!ok) {
        expiredEndpoints.push(sub.endpoint)
      } else {
        sent++
        taskSent++
      }
    }

    // Only mark as notified if at least one delivery succeeded
    if (taskSent > 0) {
      await admin
        .from('tasks')
        .update({ notified_at: now.toISOString() })
        .eq('id', task.id)
    }
  }

  if (expiredEndpoints.length > 0) {
    await admin
      .from('push_subscriptions')
      .delete()
      .in('endpoint', expiredEndpoints)
  }

  return NextResponse.json({ sent, expired: expiredEndpoints.length })
}
