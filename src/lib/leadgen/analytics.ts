export function track(event: string, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[analytics] ${event}`, payload ?? {});
  }

  // Hook point for GA4 / PostHog integration
  // Example:
  // window.gtag?.('event', event, payload)
}
