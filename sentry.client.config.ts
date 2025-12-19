// This file configures the initialization of Sentry on the client side.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",

  // Performance Monitoring
  tracesSampleRate:
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Additional options
  integrations: [
    Sentry.browserTracingIntegration({
      // Set sampling rate for performance monitoring
      // tracePropagationTargets is now set at the root level
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Trace propagation targets for performance monitoring
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/.*\.eduecosystem\.com/,
  ],

  // Filter errors
  beforeSend(event, hint) {
    // Don't send errors from browser extensions
    if (event.exception?.values?.[0]?.value?.includes("extension://")) {
      return null;
    }

    // Don't send network errors for analytics endpoints
    const url = event.request?.url || "";
    if (url.includes("/analytics") || url.includes("/tracking")) {
      return null;
    }

    return event;
  },

  // Don't send personally identifiable information
  sendDefaultPii: false,
});
