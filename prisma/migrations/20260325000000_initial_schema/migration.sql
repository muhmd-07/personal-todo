-- Migration: Initial Schema
-- Created: 2026-03-25
-- Tables: tasks, push_subscriptions

-- ─── Tasks ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "tasks" (
  "id"            UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"       UUID        NOT NULL,
  "title"         TEXT        NOT NULL,
  "due_date"      DATE,
  "due_time"      TIME(6),
  "notes"         TEXT,
  "reminder_time" TIMESTAMPTZ(6),
  "notified_at"   TIMESTAMPTZ(6),
  "completed_at"  TIMESTAMPTZ(6),
  "deleted_at"    TIMESTAMPTZ(6),
  "created_at"    TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "updated_at"    TIMESTAMPTZ(6) NOT NULL DEFAULT now(),

  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- Index: look up tasks by user quickly (most common query)
CREATE INDEX IF NOT EXISTS "tasks_user_id_idx" ON "tasks" ("user_id");

-- Index: filter by due_date for Focus View (today's tasks)
CREATE INDEX IF NOT EXISTS "tasks_due_date_idx" ON "tasks" ("due_date");

-- Index: find tasks with pending reminders (Vercel Cron job)
CREATE INDEX IF NOT EXISTS "tasks_reminder_time_idx" ON "tasks" ("reminder_time")
  WHERE "reminder_time" IS NOT NULL AND "notified_at" IS NULL;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON "tasks"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── Push Subscriptions ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "push_subscriptions" (
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    UUID        NOT NULL,
  "endpoint"   TEXT        NOT NULL,
  "keys"       JSON        NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),

  CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id"),
  -- Prevent duplicate subscriptions for same browser endpoint
  CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE ("endpoint")
);

-- Index: look up subscriptions by user
CREATE INDEX IF NOT EXISTS "push_subscriptions_user_id_idx" ON "push_subscriptions" ("user_id");
