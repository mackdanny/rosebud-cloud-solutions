import { useState, useCallback } from 'react';
import { runScan, unlock, normaliseDomain, type ScanSuccess } from '../lib/postureApi';

export type ScanPhase = 'idle' | 'scanning' | 'teaser' | 'submitting' | 'done';

export interface PostureScanState {
  phase: ScanPhase;
  result: ScanSuccess | null;
  error: string | null;
  scan: (rawDomain: string) => Promise<void>;
  submitEmail: (email: string, consent?: boolean) => Promise<void>;
  reset: () => void;
}

export function usePostureScan(): PostureScanState {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [result, setResult] = useState<ScanSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return { phase, result, error, scan, submitEmail, reset };
}
