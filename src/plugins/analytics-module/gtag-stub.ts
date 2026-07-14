type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

if (typeof window !== 'undefined') {
  const analyticsWindow = window as AnalyticsWindow;

  if (typeof analyticsWindow.gtag !== 'function') {
    analyticsWindow.dataLayer ??= [];

    analyticsWindow.gtag = function () {
      (analyticsWindow.dataLayer ??= []).push(arguments);
    };
  }
}

export {};
