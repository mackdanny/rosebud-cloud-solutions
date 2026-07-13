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

export interface UnlockSuccess {
  ok: true;
  /**
   * How the account was handled (see the Posture on-ramp):
   *  - `login`  — brand-new account, `loginUrl` is set and we redirect straight in.
   *  - `verify` — existing prospect, a sign-in link was emailed ("check inbox").
   *  - `member` — existing paying customer, send them to `portalLoginUrl` to sign in.
   *  - `report` — report link emailed (the "just email me the report" opt-out).
   */
  mode?: 'login' | 'verify' | 'member' | 'report';
  loginUrl?: string;
  portalLoginUrl?: string;
}
export interface UnlockFailure {
  ok: false;
  kind: 'invalidEmail' | 'expired' | 'network' | 'rateLimited';
  message: string;
}
export type UnlockResult = UnlockSuccess | UnlockFailure;

const NETWORK_MSG = 'Something went wrong running the scan. Please try again.';

/** Friendly, specific message when the public rate limit (per IP) is hit. */
function rateLimitMessage(retryAfterSec?: number): string {
  const mins = retryAfterSec && retryAfterSec > 0 ? Math.max(1, Math.ceil(retryAfterSec / 60)) : undefined;
  const when = mins ? `try again in about ${mins} minute${mins === 1 ? '' : 's'}` : 'try again shortly';
  return `You've reached the free-check limit for now. Please ${when}, or contact us for a full assessment.`;
}

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
    const retryAfterSec = typeof body.retryAfterSec === 'number' ? body.retryAfterSec : undefined;
    return { ok: false, kind: 'rateLimited', message: rateLimitMessage(retryAfterSec), retryAfterSec };
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

export async function unlock(token: string, email: string, consent = false): Promise<UnlockResult> {
  let res: Response;
  try {
    res = await fetch(`${POSTURE_API_BASE}/api/public/unlock`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, email, consent }),
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
  if (res.status === 429) {
    const body = await res.json().catch(() => ({} as { retryAfterSec?: number }));
    return { ok: false, kind: 'rateLimited', message: rateLimitMessage(body.retryAfterSec) };
  }
  if (!res.ok) {
    return { ok: false, kind: 'network', message: 'Something went wrong. Please try again.' };
  }
  const body = await res.json().catch(() => null);
  const mode = body && typeof body.mode === 'string' ? (body.mode as UnlockSuccess['mode']) : undefined;
  const loginUrl = body && typeof body.loginUrl === 'string' ? body.loginUrl : undefined;
  const portalLoginUrl = body && typeof body.portalLoginUrl === 'string' ? body.portalLoginUrl : undefined;
  return { ok: true, mode, loginUrl, portalLoginUrl };
}
