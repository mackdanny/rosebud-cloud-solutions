// Base URL of the Journey customer portal (self-serve signup + sign-in live there,
// on a separate Express app). Overridable per-environment via VITE_PORTAL_URL;
// defaults to the live custom domain.
export const PORTAL_URL =
  import.meta.env.VITE_PORTAL_URL ||
  'https://portal.rosebudcloudsolutions.co.uk';

export type ManagedPlan = 'monitor' | 'managed' | 'scale';

/** Build the external signup/trial URL, optionally pre-filling the scanned domain. */
export function trialUrl(plan: ManagedPlan, domain?: string, interval: 'month' | 'year' = 'month'): string {
  const u = new URL('/signup', PORTAL_URL);
  u.searchParams.set('plan', plan);
  if (interval === 'year') u.searchParams.set('interval', 'year');
  if (domain) u.searchParams.set('domain', domain);
  return u.toString();
}

/** Sign-in lands on the portal login page. */
export const SIGNIN_URL = `${PORTAL_URL}/portal/login`;
