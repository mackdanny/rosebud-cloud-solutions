import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SCAN_STEPS, SCAN_HOLD_LABEL, CASCADE_MS, createScanSequence, type SeqState,
} from './scanSequence';

describe('scan sequence step content', () => {
  it('keeps a 12-16s budget over 8+ activity-framed steps', () => {
    const total = SCAN_STEPS.reduce((a, s) => a + s.ms, 0);
    expect(SCAN_STEPS.length).toBeGreaterThanOrEqual(8);
    expect(total).toBeGreaterThanOrEqual(12000);
    expect(total).toBeLessThanOrEqual(16000);
    for (const s of SCAN_STEPS) expect(s.label).toMatch(/…$/);
  });

  it('has no em or en dashes in labels', () => {
    for (const l of [...SCAN_STEPS.map((s) => s.label), SCAN_HOLD_LABEL]) {
      expect(l).not.toMatch(/[–—]/);
    }
  });
});

describe('createScanSequence', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('walks every step on its own duration and holds on the final row', () => {
    const states: SeqState[] = [];
    const seq = createScanSequence((s) => states.push(s));
    seq.start();
    expect(states.at(-1)).toMatchObject({ active: 0 });
    vi.advanceTimersByTime(SCAN_STEPS[0].ms);
    expect(states.at(-1)).toMatchObject({ active: 1 });
    vi.advanceTimersByTime(SCAN_STEPS.slice(1).reduce((a, s) => a + s.ms, 0));
    expect(states.at(-1)).toMatchObject({ active: SCAN_STEPS.length }); // hold row
    vi.advanceTimersByTime(60_000);
    expect(states.at(-1)).toMatchObject({ active: SCAN_STEPS.length }); // still holding
  });

  it('finish() cascades the remaining rows inside the cascade budget', () => {
    const states: SeqState[] = [];
    const done = vi.fn();
    const seq = createScanSequence((s) => states.push(s));
    seq.start();
    vi.advanceTimersByTime(SCAN_STEPS[0].ms); // two rows in
    seq.finish(done);
    vi.advanceTimersByTime(CASCADE_MS + 200);
    expect(done).toHaveBeenCalledOnce();
    expect(states.at(-1)).toMatchObject({ complete: true, doneBelow: SCAN_STEPS.length + 1 });
  });

  it('cancel() stops the walk', () => {
    const states: SeqState[] = [];
    const seq = createScanSequence((s) => states.push(s));
    seq.start();
    seq.cancel();
    const n = states.length;
    vi.advanceTimersByTime(30_000);
    expect(states.length).toBe(n);
  });
});
