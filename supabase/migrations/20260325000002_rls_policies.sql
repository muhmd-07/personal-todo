-- Migration: Row Level Security Policies
-- Created: 2026-03-25
-- Enables RLS on tasks and push_subscriptions; users access only their own rows

-- ─── Tasks RLS ───────────────────────────────────────────────────────────────

ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;

-- Users can only access their own tasks
CREATE POLICY "tasks_user_isolation" ON "tasks"
  USING (auth.uid() = "user_id")
  WITH CHECK (auth.uid() = "user_id");

-- ─── Push Subscriptions RLS ──────────────────────────────────────────────────

ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;

-- Users can only access their own push subscriptions
CREATE POLICY "push_subscriptions_user_isolation" ON "push_subscriptions"
  USING (auth.uid() = "user_id")
  WITH CHECK (auth.uid() = "user_id");
