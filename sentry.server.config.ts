// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",

  // Performance Monitoring
  tracesSampleRate:
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? 0.1 : 1.0,

  // Additional server-side options (removed BrowserTracing as it's client-only)

  // Don't send personally identifiable information
  sendDefaultPii: false,
});
