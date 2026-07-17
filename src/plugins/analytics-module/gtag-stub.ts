type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  // docusaurus-plugin-sentry loader stub; production-only, queues until SDK loads.
  Sentry?: { captureMessage?: (message: string, level?: string) => void };
  __gtagStubInstalled?: boolean; // for manual/E2E verification
};

if (typeof window !== 'undefined') {
  const analyticsWindow = window as AnalyticsWindow;

  // plugin-google-gtag calls window.gtag unguarded on every route change. It's a
  // mutable global; if left non-callable, navigation throws. Install a stub.
  if (typeof analyticsWindow.gtag !== 'function') {
    analyticsWindow.dataLayer ??= [];

    analyticsWindow.gtag = function () {
      (analyticsWindow.dataLayer ??= []).push(arguments);
    };

    analyticsWindow.__gtagStubInstalled = true;

    // Measure real-world incidence (#2417). Via Sentry, not gtag/dataLayer —
    // whatever suppressed gtag likely blocks Google too; Sentry is a separate
    // origin. Deferred + guarded so telemetry never breaks navigation.
    setTimeout(() => {
      try {
        analyticsWindow.Sentry?.captureMessage?.(
          'gtag-stub: window.gtag not callable at bootstrap',
          'warning',
        );
      } catch {
        /* no-op */
      }
    });
  }
}

export {};
