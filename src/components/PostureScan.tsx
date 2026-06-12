import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostureScan } from '../hooks/usePostureScan';
import { POSTURE_API_BASE } from '../config/posture';

interface PostureScanProps {
  readonly variant?: 'section' | 'page';
}

function bandColor(score: number): string {
  if (score >= 75) return '#3fa996'; // teal-green
  if (score >= 40) return '#e0a82e'; // amber
  return '#d05a5a'; // soft red
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

export const PostureScan: React.FC<PostureScanProps> = ({ variant = 'section' }) => {
  const { phase, result, error, scan, submitEmail, reset } = usePostureScan();
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
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
            {phase === 'scanning' && (
              <p className="text-sm text-on-surface-variant/80 font-label">Checking your email, web and exposure surface...</p>
            )}
            {error && phase === 'idle' && <p className="text-sm text-secondary">{error}</p>}
            <p className="text-xs text-on-surface-variant/60 font-label tracking-wide">~15 seconds. Nothing to install, no access to your systems.</p>
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
                : `${result.issueCount} ${result.issueCount === 1 ? 'opportunity' : 'opportunities'} to improve across your email, web and external surface.`}
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); submitEmail(email); }}
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
                  {phase === 'submitting' ? 'Sending' : 'Email me the report'}
                </button>
              </div>
              {error && <p className="text-sm text-secondary">{error}</p>}
              <p className="text-xs text-on-surface-variant/60 font-label">We email a private link to your full graded report. No spam.</p>
            </form>
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
            <p className="text-on-surface-variant text-sm max-w-sm">We have emailed a private link to your full security report. It may take a minute to arrive.</p>
            <a
              href={`${POSTURE_API_BASE}/r/${result.token}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-label text-sm uppercase tracking-[0.18em] no-underline hover:gap-3 transition-all"
            >
              View report now
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
            <button onClick={reset} className="text-xs text-on-surface-variant/60 font-label hover:text-white transition-colors mt-1">Scan another domain</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostureScan;
