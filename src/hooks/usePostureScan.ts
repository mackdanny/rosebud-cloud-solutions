import { useState, useCallback } from 'react';
import { runScan, unlock, normaliseDomain, type ScanSuccess } from '../lib/postureApi';

export type ScanPhase = 'idle' | 'scanning' | 'teaser' | 'submitting' | 'done' | 'member';

export interface PostureScanState {
  phase: ScanPhase;
  result: ScanSuccess | null;
  error: string | null;
  /** Where to send an existing paying customer to sign in (member mode). */
  portalLoginUrl: string | null;
  scan: (rawDomain: string) => Promise<void>;
  submitEmail: (email: string, consent?: boolean) => Promise<void>;
  reset: () => void;
}

export function usePostureScan(): PostureScanState {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [result, setResult] = useState<ScanSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [portalLoginUrl, setPortalLoginUrl] = useState<string | null>(null);

  const scan = useCallback(async (rawDomain: string) => {
    const domain = normaliseDomain(rawDomain);
    if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      setError('That does not look like a valid domain. Try something like yourcompany.co.uk.');
      return;
    }
    setError(null);
    setPhase('scanning');
    const res = await runScan(domain);
    if (res.ok) {
      setResult(res);
      setPhase('teaser');
    } else {
      setError(res.message);
      setPhase('idle');
    }
  }, []);

  const submitEmail = useCallback(async (email: string, consent = false) => {
    if (!result) return;
    setError(null);
    setPhase('submitting');
    const res = await unlock(result.token, email, consent);
    if (res.ok) {
      if (res.loginUrl) {
        // Direct-to-platform on-ramp (login mode): the magic-link is single-use,
        // so we redirect straight into it instead of showing "check your inbox".
        // Don't set phase to 'done' here, we're navigating away.
        window.location.href = res.loginUrl;
        return;
      }
      if (res.mode === 'member') {
        // Existing paying customer: never auto-logged-in from the funnel. Point
        // them at the platform to sign in and scan new domains there.
        setPortalLoginUrl(res.portalLoginUrl ?? 'https://portal.rosebudcloudsolutions.co.uk/portal/login');
        setPhase('member');
        return;
      }
      // verify (prospect) + report (opt-out) both emailed a link -> check inbox.
      setPhase('done');
    } else {
      setError(res.message);
      setPhase(res.kind === 'expired' ? 'idle' : 'teaser');
    }
  }, [result]);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
    setPortalLoginUrl(null);
  }, []);

  return { phase, result, error, portalLoginUrl, scan, submitEmail, reset };
}
