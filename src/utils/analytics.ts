/**
 * Google Tag (AW-18297262924) Analytics & Conversion Tracking Helper
 * Dispatches pageviews and conversion events safely to Google Ads / Tag Manager.
 */

export const GOOGLE_TAG_ID = 'AW-18297262924';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a SPA route page_view in Google Tag
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return;
  const path = pagePath || window.location.pathname + window.location.search;
  const title = pageTitle || document.title;

  if (typeof window.gtag === 'function') {
    window.gtag('config', GOOGLE_TAG_ID, {
      page_path: path,
      page_title: title,
    });
  }
}

/**
 * Tracks generic custom events (e.g. clicks, calculators, filters)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      send_to: GOOGLE_TAG_ID,
      ...params,
    });
  }
}

/**
 * Tracks lead form submission as a high-value conversion event
 */
export function trackConversion(conversionLabel?: string, value?: number, extraData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      send_to: GOOGLE_TAG_ID,
      event_category: 'Lead',
      event_label: conversionLabel || 'Mutual Fund Advisory Lead',
      value: value || 0,
      currency: 'INR',
      ...extraData,
    });
  }
}
