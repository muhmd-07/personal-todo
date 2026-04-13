-- Migration: Cascade deletes, composite push_subscriptions unique, scoped RLS
-- Date: 2026-04-05

-- ─── Cascade delete: tasks ────────────────────────────────────────────────────
ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE;

-- ─── Push subscriptions: replace endpoint-only unique with (user_id, endpoint) ─
ALTER TABLE "push_subscriptions"
  DROP CONSTRAINT IF EXISTS "push_subscriptions_endpoint_unique";

ALTER TABLE "push_subscriptions"
  ADD CONSTRAINT "push_subscriptions_user_endpoint_unique"
  UNIQUE ("user_id", "endpoint");

ALTER TABLE "push_subscriptions"
  ADD CONSTRAINT "push_subscriptions_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE;

-- ─── RLS: push_subscriptions (SELECT / INSERT / DELETE only, no UPDATE) ───────
DROP POLICY IF EXISTS "push_subscriptions_user_isolation" ON "push_subscriptions";

CREATE POLICY "push_subscriptions_select" ON "push_subscriptions"
  FOR SELECT
  USING (auth.uid() = "user_id");

CREATE POLICY "push_subscriptions_insert" ON "push_subscriptions"
  FOR INSERT
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "push_subscriptions_delete" ON "push_subscriptions"
  FOR DELETE
  USING (auth.uid() = "user_id");
