// Base URL of the Posture public API (the scan + unlock endpoints). Overridable
// per-environment via VITE_POSTURE_API_BASE; defaults to the live custom domain.
export const POSTURE_API_BASE =
  import.meta.env.VITE_POSTURE_API_BASE ||
  'https://posture.rosebudcloudsolutions.co.uk';

// ─── Posture line pricing (the security-posture product, separate from DMARC) ──
// Prices agreed 2026-06-25. The £50 full report is the self-serve door-opener;
// the £29/mo monitoring sub is the recurring posture product (re-scan + drift
// alerts). Hardening is done-for-you and quote-only (no public price).
export const REPORT_PRICE_GBP = 50;
export const MONITORING_PRICE_GBP = 29;

// Checkout destinations for the self-serve posture products. Self-serve billing
// is GoCardless IN THE PORTAL (not payment links): at BILLING_ENABLED go-live,
// set the env vars to the portal buy pages
//   VITE_REPORT_CHECKOUT_URL=https://portal.rosebudcloudsolutions.co.uk/portal/full-report
//   VITE_MONITORING_CHECKOUT_URL=https://portal.rosebudcloudsolutions.co.uk/portal/monitoring
// Until then they fall back to the concierge /contact route so the CTA is never dead.
export const REPORT_CHECKOUT_URL =
  import.meta.env.VITE_REPORT_CHECKOUT_URL || '/contact?intent=full-report';
export const MONITORING_CHECKOUT_URL =
  import.meta.env.VITE_MONITORING_CHECKOUT_URL || '/contact?intent=monitoring';
