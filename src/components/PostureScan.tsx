import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostureScan } from '../hooks/usePostureScan';
import ScanSequence from './ScanSequence';
import { POSTURE_API_BASE, REPORT_CHECKOUT_URL, REPORT_PRICE_GBP } from '../config/posture';

interface PostureScanProps {
  readonly variant?: 'section' | 'page';
  /** Fired once the visitor submits their email (scan reaches the 'done' phase),
   *  with the private report URL so the caller can confirm + link to it. */
  readonly onComplete?: (reportUrl: string) => void;
}

function bandColor(score: number): string {
  if (score >= 75) return '#3fa996'; // teal-green
  if (score >= 40) return '#e0a82e'; // amber
  return '#d05a5a'; // soft red
}

/** Section ids as the engine emits them, in the words a visitor uses. */
const SECTION_LABELS: Record<string, string> = {
  email: 'email',
  web_tls: 'web and TLS',
  external: 'external exposure',
  identity: 'identity and brand',
  exposure: 'credential exposure',
  attack_surface: 'attack surface',
  supply_chain: 'supply chain',
};

function listify(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * What the score was computed over, in one line.
 *
 * A check that could not be completed carries no penalty, and a section nothing
 * could be established for leaves the composite entirely, so the scan that
 * reached least can show the friendliest number. Saying so costs the visitor
 * nothing and is the difference between a number and an impression.
 *
 * Returns null when the API did not send coverage (an older deployment of it, or
 * this site shipping first), so the teaser silently keeps its previous shape
 * rather than claiming a coverage it does not know.
 */
function coverageNote(assessed?: number, total?: number, unassessed?: string[]): string | null {
  if (typeof assessed !== 'number' || typeof total !== 'number' || total <= 0) return null;
  if (assessed >= total) return `Based on all ${total} checks we run.`;
  const missed = (unassessed ?? []).map((s) => SECTION_LABELS[s]).filter(Boolean);
  const tail = missed.length
    ? ` The ${listify(missed)} checks could not be completed for this domain.`
    : '';
  return `Based on ${assessed} of ${total} checks.${tail}`;
}

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const col = bandColor(score);
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="relative w-[140px] h-[140px] mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-4xl font-extrabold text-white leading-none">{Math.round(score)}</span>
        <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/70 mt-1">/ 100</span>
      </div>
    </div>
  );
};

export const PostureScan: React.FC<PostureScanProps> = ({ variant = 'section', onComplete }) => {
  const { phase, result, error, portalLoginUrl, unlockMode, scanResolved, scan, submitEmail, reset } = usePostureScan();

  useEffect(() => {
    // Only a report-mode unlock produces a report the caller can link to; a
    // verify-mode unlock sends them to the dashboard instead.
    if (phase === 'done' && result && unlockMode !== 'verify') onComplete?.(`${POSTURE_API_BASE}/r/${result.token}`);
  }, [phase, result, unlockMode, onComplete]);
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [reportOnly, setReportOnly] = useState(false);
  const pad = variant === 'page' ? 'px-6 py-10 md:px-12 md:py-14' : 'px-6 py-8 md:px-10 md:py-10';

  return (
    <div className={`relative mx-auto w-full max-w-xl rounded-2xl border border-outline/60 bg-surface/80 backdrop-blur ${pad}`}>
      <AnimatePresence mode="wait">
        {(phase === 'idle' || phase === 'scanning') && (
          <motion.form
            key="input"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => { e.preventDefault(); scan(domain); }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text" inputMode="url" autoComplete="off" spellCheck={false}
                value={domain} onChange={(e) => setDomain(e.target.value)}
                placeholder="yourcompany.co.uk"
                disabled={phase === 'scanning'}
                className="flex-1 rounded-lg bg-background/70 border border-outline px-4 py-3.5 text-white placeholder:text-on-surface-variant/50 outline-none focus:border-primary/70 transition-colors"
              />
              <button
                type="submit" disabled={phase === 'scanning'}
                className="btn-animated text-white font-headline font-bold px-7 py-3.5 rounded-lg whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {phase === 'scanning' ? (
                  <>
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Scanning
                  </>
                ) : (
                  <>
                    Run free check
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
            {phase === 'scanning' && <ScanSequence done={scanResolved} />}
            {error && phase === 'idle' && <p className="text-sm text-secondary">{error}</p>}
            <p className="text-xs text-on-surface-variant/60 font-label tracking-wide">In seconds. Nothing to install, no access to your systems.</p>
          </motion.form>
        )}

        {(phase === 'teaser' || phase === 'submitting') && result && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <ScoreRing score={result.score} />
            <div className="font-headline text-2xl font-bold" style={{ color: bandColor(result.score) }}>{result.grade}</div>
            <p className="text-on-surface-variant text-sm max-w-sm">
              {result.issueCount === 0
                ? 'No material issues found. Unlock the full breakdown to confirm.'
                : `${result.issueCount} ${result.issueCount === 1 ? 'opportunity' : 'opportunities'} to improve across your email, web, DNS and exposure surface.`}
            </p>

            {(() => {
              const note = coverageNote(result.assessedChecks, result.totalChecks, result.unassessedSections);
              return note
                ? <p className="text-xs text-on-surface-variant/60 font-label max-w-sm">{note}</p>
                : null;
            })()}

            <p className="text-xs text-on-surface-variant/60 font-label">Enter your email and we&apos;ll take you straight to your free dashboard to view the full findings.</p>

            <form
              onSubmit={(e) => { e.preventDefault(); submitEmail(email, !reportOnly); }}
              className="w-full flex flex-col gap-3 mt-2"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.co.uk" disabled={phase === 'submitting'}
                  className="flex-1 rounded-lg bg-background/70 border border-outline px-4 py-3.5 text-white placeholder:text-on-surface-variant/50 outline-none focus:border-primary/70 transition-colors"
                />
                <button
                  type="submit" disabled={phase === 'submitting'}
                  className="btn-animated text-white font-headline font-bold px-7 py-3.5 rounded-lg whitespace-nowrap disabled:opacity-70"
                >
                  {phase === 'submitting' ? 'Sending' : 'See my results'}
                </button>
              </div>
              <label htmlFor="posture-scan-report-only" className="flex items-start gap-2.5 text-left cursor-pointer">
                <input
                  id="posture-scan-report-only" type="checkbox" checked={reportOnly}
                  onChange={(e) => setReportOnly(e.target.checked)}
                  disabled={phase === 'submitting'}
                  className="mt-0.5 h-4 w-4 flex-none accent-primary"
                />
                <span className="text-xs text-on-surface-variant/60 font-label">
                  Just email me the report instead.
                </span>
              </label>
              {error && <p className="text-sm text-secondary">{error}</p>}
              <p className="text-xs text-on-surface-variant/60 font-label">
                We&apos;ll set up your free security dashboard so you can view your findings, no password needed. See our <a href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</a>. No spam, and you can ask us to delete your data at any time.
              </p>
            </form>

            <a href={REPORT_CHECKOUT_URL} className="text-xs text-on-surface-variant/70 font-label no-underline hover:text-primary transition-colors mt-1">
              Skip ahead — get the full report &amp; fix plan for £{REPORT_PRICE_GBP} →
            </a>
          </motion.div>
        )}

        {phase === 'done' && result && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4 py-2"
          >
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">mark_email_read</span>
            </div>
            <h3 className="font-headline text-2xl font-bold">Check your inbox</h3>
            {unlockMode === 'verify' ? (
              <p className="text-on-surface-variant text-sm max-w-sm">We&apos;ve sent a link to sign in to your dashboard, where you can view all your findings. It may take a minute to arrive.</p>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm max-w-sm">We have emailed a private link to your security report. It may take a minute to arrive.</p>
                <a
                  href={`${POSTURE_API_BASE}/r/${result.token}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-label text-sm uppercase tracking-[0.18em] no-underline hover:gap-3 transition-all"
                >
                  View report now
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
                <a
                  href={REPORT_CHECKOUT_URL}
                  className="w-full no-underline mt-1"
                >
                  <button className="btn-animated text-white font-headline font-bold w-full px-7 py-3.5 rounded-lg text-sm">
                    Unlock the full report &amp; fix plan — £{REPORT_PRICE_GBP}
                  </button>
                </a>
                <p className="text-xs text-on-surface-variant/60 font-label">The free report shows what's wrong. The full report shows exactly how to fix it.</p>
              </>
            )}
            <button onClick={reset} className="text-xs text-on-surface-variant/60 font-label hover:text-white transition-colors mt-1">Scan another domain</button>
          </motion.div>
        )}

        {phase === 'member' && (
          <motion.div
            key="member"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-4 py-2"
          >
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">badge</span>
            </div>
            <h3 className="font-headline text-2xl font-bold">You already have an account</h3>
            <p className="text-on-surface-variant text-sm max-w-sm">Sign in to your security platform to scan new domains and see the full findings there.</p>
            <a href={portalLoginUrl ?? 'https://portal.rosebudcloudsolutions.co.uk/portal/login'} className="w-full no-underline mt-1">
              <button className="btn-animated text-white font-headline font-bold w-full px-7 py-3.5 rounded-lg text-sm">
                Sign in to your platform
              </button>
            </a>
            <button onClick={reset} className="text-xs text-on-surface-variant/60 font-label hover:text-white transition-colors mt-1">Scan another domain</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostureScan;
