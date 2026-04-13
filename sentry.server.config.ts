// Sentry Server Configuration
// Initializes Sentry for server-side error monitoring (API routes, Server Actions)
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Disable Sentry in development to avoid noise
  enabled: process.env.NODE_ENV === 'production',
})
