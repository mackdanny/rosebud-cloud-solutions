import { useEffect, useRef, useState } from 'react';
import { SCAN_STEPS, SCAN_HOLD_LABEL, createScanSequence, type SeqState } from '../lib/scanSequence';

const ROWS = [...SCAN_STEPS.map((s) => s.label), SCAN_HOLD_LABEL];

/** Staged "what we're checking" list shown during the scanning phase. `done`
 *  flips when the scan request resolves; the remaining rows then cascade to
 *  ticks before the teaser takes over (usePostureScan delays the phase flip
 *  by CASCADE_MS to leave room for it). */
export default function ScanSequence({ done }: { done: boolean }) {
  const [state, setState] = useState<SeqState>({ active: -1, doneBelow: -1, complete: false });
  const seqRef = useRef<ReturnType<typeof createScanSequence> | null>(null);

  useEffect(() => {
    // Fresh instance per effect run: cancel() is terminal, and StrictMode's dev
    // double-invoke would freeze a cached instance on its first row otherwise.
    const seq = createScanSequence(setState);
    seqRef.current = seq;
    seq.start();
    return () => { seqRef.current = null; seq.cancel(); };
  }, []);

  useEffect(() => {
    if (done) seqRef.current?.finish(() => {});
  }, [done]);

  const announced = state.complete
    ? 'Scan complete. Preparing your results.'
    : state.active >= 0 && state.active < ROWS.length ? ROWS[state.active] : '';

  return (
    <div className="flex flex-col gap-1.5 text-left" data-testid="scan-sequence">
      <span className="sr-only" role="status" aria-live="polite">{announced}</span>
      {/* role restores list semantics stripped by Safari/VoiceOver on list-style:none */}
      <ol role="list" className="flex flex-col gap-1.5 list-none m-0 p-0">
        {ROWS.map((label, i) => {
          const isDone = i < state.doneBelow || state.complete;
          const isActive = i === state.active && !isDone;
          return (
            <li
              key={label}
              className={`flex items-center gap-2 text-sm font-label transition-opacity duration-300 motion-reduce:transition-none ${
                isDone || isActive ? 'opacity-100' : 'opacity-40'
              } ${isActive ? 'text-white' : 'text-on-surface-variant/80'}`}
            >
              <span className="inline-flex w-4 justify-center flex-none">
                {isDone || isActive ? (
                  <span
                    aria-hidden="true"
                    className={`material-symbols-outlined text-[16px] ${
                      isDone ? 'text-primary' : 'animate-spin motion-reduce:animate-none'
                    }`}
                  >
                    {isDone ? 'check_circle' : 'progress_activity'}
                  </span>
                ) : (
                  // The self-hosted Material Symbols subset does not include `circle`
                  // (see ac3a9ba for the same class of bug), so the pending state draws
                  // a plain CSS ring instead of a font glyph that would render as text.
                  <span aria-hidden="true" className="w-3.5 h-3.5 mx-px rounded-full border-2 border-on-surface-variant/40 flex-none opacity-50" />
                )}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
