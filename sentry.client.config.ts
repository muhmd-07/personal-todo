// Sentry Client Configuration
// Initializes Sentry for browser-side error monitoring
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Disable Sentry in development to avoid noise
  enabled: process.env.NODE_ENV === 'production',

  // Additional integrations can be added here as needed
})
