import { POSTURE_API_BASE } from '../config/posture';

export interface ScanSuccess {
  ok: true;
  token: string;
  score: number;
  grade: string;
  issueCount: number;
}
export interface ScanFailure {
  ok: false;
  kind: 'invalid' | 'rateLimited' | 'network';
  message: string;
  retryAfterSec?: number;
}
export type ScanResult = ScanSuccess | ScanFailure;

export interface UnlockSuccess { ok: true }
export interface UnlockFailure {
  ok: false;
  kind: 'invalidEmail' | 'expired' | 'network';
  message: string;
}
export type UnlockResult = UnlockSuccess | UnlockFailure;

const NETWORK_MSG = 'Something went wrong running the scan. Please try again.';

/** Normalise a user-typed domain: drop scheme, path, whitespace, leading www. */
export function normaliseDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./i, '')
    .toLowerCase();
}

export async function runScan(domain: string): Promise<ScanResult> {
  let res: Response;
  try {
    res = await fetch(`${POSTURE_API_BASE}/api/public/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
  } catch {
    return { ok: false, kind: 'network', message: NETWORK_MSG };
  }
  if (res.status === 429) {
    const body = await res.json().catch(() => ({}));
    return {
      ok: false,
      kind: 'rateLimited',
      message: 'You have run a few scans already. Please try again in a few minutes.',
      retryAfterSec: typeof body.retryAfterSec === 'number' ? body.retryAfterSec : undefined,
    };
  }
  if (res.status === 400) {
    return {
      ok: false,
      kind: 'invalid',
      message: 'That does not look like a valid domain. Try something like yourcompany.co.uk.',
    };
  }
  if (!res.ok) return { ok: false, kind: 'network', message: NETWORK_MSG };
  const body = await res.json().catch(() => null);
  if (!body || typeof body.token !== 'string') {
    return { ok: false, kind: 'network', message: NETWORK_MSG };
  }
  return {
    ok: true,
    token: body.token,
    score: Number(body.score) || 0,
    grade: String(body.grade ?? ''),
    issueCount: Number(body.issueCount) || 0,
  };
}

export async function unlock(token: string, email: string): Promise<UnlockResult> {
  let res: Response;
  try {
    res = await fetch(`${POSTURE_API_BASE}/api/public/unlock`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, email }),
    });
  } catch {
    return { ok: false, kind: 'network', message: 'Something went wrong. Please try again.' };
  }
  if (res.status === 400) {
    return { ok: false, kind: 'invalidEmail', message: 'Please enter a valid email address.' };
  }
  if (res.status === 404) {
    return { ok: false, kind: 'expired', message: 'That scan has expired. Please run it again.' };
  }
  if (!res.ok) {
    return { ok: false, kind: 'network', message: 'Something went wrong. Please try again.' };
  }
  return { ok: true };
}
