// Scan sequence driver for the posture embed: staged "what we're checking"
// presentation while the scan request is in flight. Pure timers, no React, so
// it unit-tests with fake timers. Step content mirrors the Journey portal
// sequence (apps/journey/src/views/portal/scanSequence.ts in the platform
// repo); keep the two aligned when editing either. Activity framing only,
// never a claimed result: the engine runs categories concurrently.

export interface ScanStep { label: string; ms: number }

export const SCAN_STEPS: readonly ScanStep[] = [
  { label: 'Looking up DNS records…', ms: 1200 },
  { label: 'Checking SPF policy…', ms: 1200 },
  { label: 'Checking DKIM selectors…', ms: 1200 },
  { label: 'Checking DMARC policy…', ms: 1400 },
  { label: 'Testing TLS and certificates…', ms: 1600 },
  { label: 'Checking web security headers…', ms: 1400 },
  { label: 'Checking domain identity and lookalikes…', ms: 1500 },
  { label: 'Scanning for exposed services…', ms: 1600 },
  { label: 'Reviewing attack surface…', ms: 1500 },
  { label: 'Checking supply chain…', ms: 1400 },
];

export const SCAN_HOLD_LABEL = 'Compiling your score…';

/** How long the done-cascade takes once the scan request has resolved. */
export const CASCADE_MS = 350;

export interface SeqState {
  /** Index of the active row; SCAN_STEPS.length means the hold row; -1 during the cascade. */
  active: number;
  /** Rows strictly below this index render as done. */
  doneBelow: number;
  complete: boolean;
}

export function createScanSequence(onChange: (s: SeqState) => void): {
  start: () => void;
  finish: (onDone: () => void) => void;
  cancel: () => void;
} {
  let idx = -1;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let finished = false;

  const advance = () => {
    if (finished) return;
    idx += 1;
    onChange({ active: idx, doneBelow: idx, complete: false });
    // The hold row (idx === SCAN_STEPS.length) has no duration: it holds
    // until finish() or cancel().
    if (idx < SCAN_STEPS.length) timer = setTimeout(advance, SCAN_STEPS[idx].ms);
  };

  return {
    start: advance,
    finish: (onDone) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      const rows = SCAN_STEPS.length + 1;
      const per = Math.max(30, Math.round(CASCADE_MS / rows));
      const tick = () => {
        if (idx < rows) {
          idx += 1;
          onChange({ active: -1, doneBelow: idx, complete: false });
          setTimeout(tick, per);
        } else {
          onChange({ active: -1, doneBelow: rows, complete: true });
          onDone();
        }
      };
      tick();
    },
    cancel: () => {
      finished = true;
      if (timer) clearTimeout(timer);
    },
  };
}
