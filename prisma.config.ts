// Prisma v7 Configuration
// Connection URLs are defined here (not in schema.prisma — Prisma v7 breaking change)
// See: https://pris.ly/d/config-datasource

import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    // DIRECT_URL: bypasses PgBouncer for schema migrations (prisma migrate / db push)
    // Use the direct Postgres connection, not the pooled one
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
