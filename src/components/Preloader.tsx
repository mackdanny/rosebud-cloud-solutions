import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientOnly } from './ClientOnly';

// ─── Gating ──────────────────────────────────────────────────────────────────
// Preloader plays on the homepage.
//
// 🚧 REVIEW MODE: 24h cooldown is disabled so stakeholders (Alex, Hannah) see
// the brand intro on every visit. Before going live on the production domain,
// set REVIEW_MODE = false to re-enable the once-per-24h gate.

const REVIEW_MODE = true;

const PRELOADER_LAST_SEEN_KEY = 'rcs-preloader-last-seen';
const PRELOADER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

// ─── Timing constants ────────────────────────────────────────────────────────
// Durations extended so the rotation plays long enough for the extra
// interpolation frames (below) to actually be perceivable — a faster spin
// just passes by too quickly to read as "high quality".
const ROTATE_IN  = 0.65;   // time to rotate from -90 → 0
const HOLD       = 0.55;   // time text stays fully visible
const ROTATE_OUT = 0.55;   // time to rotate from 0 → 90
const GAP        = 0.0;    // no dead-air between phases

const p1Start = 0;
const p1End   = p1Start + ROTATE_IN + HOLD + ROTATE_OUT;

const p2Start = p1End + GAP;
const p2End   = p2Start + ROTATE_IN + HOLD + ROTATE_OUT;

const p3Start = p2End + GAP;
const p3End   = p3Start + ROTATE_IN + HOLD + ROTATE_OUT;

// Quick dissolve once phase 3 content has fully rotated away
const OVERLAY_FADE_DUR = 0.3;

// Beat of pure solid-dark between rotation ending and the overlay starting to
// fade. Guarantees the rotation finishes on an untouched backdrop before any
// hint of the page underneath starts bleeding through.
const ROTATION_SETTLE_MS = 180;

// ─── Smooth rotation keyframes ───────────────────────────────────────────────
// Each rotation phase is densely sampled along a premium ease curve (quint-out
// for the in-phase, quart-in for the out-phase) and framer is told to linearly
// interpolate between samples. With ~10 samples per phase, linear segments are
// short enough that the composite motion is indistinguishable from a single
// continuous bezier — but the runtime has explicit frames at every 10% of the
// curve to land on, which reads as higher fidelity on high-refresh displays.
const IN_STEPS  = 10;  // samples along the rotate-in curve (quint-out)
const OUT_STEPS = 10;  // samples along the rotate-out curve (quart-in)

// Ease formulas. Using y = 1 - (1-t)^5 for the in-phase gives a long silky
// deceleration (most of the rotation happens early, then settles smoothly).
// y = t^4 for the out-phase is a slightly gentler acceleration than t^5 so the
// exit doesn't feel whip-sharp.
const easeQuintOut = (t: number) => 1 - Math.pow(1 - t, 5);
const easeQuartIn  = (t: number) => Math.pow(t, 4);

// Build the {times, values} keyframe arrays for a rotation phase. `fromAngle`
// and `toAngle` in degrees. Samples densely so motion stays silky at 120fps.
function buildRotationKeyframes(
  inEnd: number,
  holdEnd: number,
  fromAngle: number,
  toAngle: number,
) {
  const times: number[] = [];
  const values: number[] = [];

  // Rotate-in: fromAngle → 0, sampled along easeQuintOut.
  for (let i = 0; i <= IN_STEPS; i++) {
    const t = i / IN_STEPS;
    times.push(inEnd * t);
    values.push(fromAngle + (0 - fromAngle) * easeQuintOut(t));
  }

  // Hold: explicit anchor at holdEnd keeps the value pinned at 0 through the
  // hold window (framer otherwise linearly drifts between inEnd and the next
  // keyframe past holdEnd).
  times.push(holdEnd);
  values.push(0);

  // Rotate-out: 0 → toAngle, sampled along easeQuartIn. Start at i=1 so we
  // don't emit a duplicate keyframe at holdEnd with value 0.
  for (let i = 1; i <= OUT_STEPS; i++) {
    const t = i / OUT_STEPS;
    times.push(holdEnd + (1 - holdEnd) * t);
    values.push(toAngle * easeQuartIn(t));
  }

  return { times, values };
}

function rotatePhase(startDelay: number) {
  const dur = ROTATE_IN + HOLD + ROTATE_OUT;
  const inEnd    = ROTATE_IN / dur;
  const holdEnd  = (ROTATE_IN + HOLD) / dur;
  const rot = buildRotationKeyframes(inEnd, holdEnd, -90, 90);

  return {
    rotateX: {
      times: rot.times,
      values: rot.values,
      delay: startDelay,
      duration: dur,
      ease: 'linear', // curve shape lives in the sampled values
    },
    opacity: {
      // Content stays fully opaque until the very last stretch of the rotate-
      // out so the text never goes ghostly mid-rotation — fade hugs the final
      // 15% and hits 0 right as the rotation reaches 90° (edge-on, invisible).
      times:    [0,    inEnd * 0.25, holdEnd, holdEnd + (1 - holdEnd) * 0.85, 1],
      values:   [0,    1,            1,       1,                              0],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'linear', 'linear', 'easeIn'],
    },
  };
}

// Logo uses rotateY instead of rotateX — same curve shape for visual parity.
function rotatePhaseY(startDelay: number) {
  const dur = ROTATE_IN + HOLD + ROTATE_OUT;
  const inEnd    = ROTATE_IN / dur;
  const holdEnd  = (ROTATE_IN + HOLD) / dur;
  const rot = buildRotationKeyframes(inEnd, holdEnd, -90, 90);

  return {
    rotateY: {
      times: rot.times,
      values: rot.values,
      delay: startDelay,
      duration: dur,
      ease: 'linear',
    },
    opacity: {
      times:    [0,    inEnd * 0.25, holdEnd, holdEnd + (1 - holdEnd) * 0.85, 1],
      values:   [0,    1,            1,       1,                              0],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'linear', 'linear', 'easeIn'],
    },
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

// Compute initial state ONCE when PreloaderOverlay mounts on the client.
// Because it's wrapped in <ClientOnly>, this never runs during SSR - window is
// always defined here. Putting all the gating logic in the useState initializer
// (instead of a post-mount effect) avoids any flicker/timing issues with
// AnimatePresence and ensures the overlay mounts in its visible state from the
// very first render.
function computeInitialDone(): boolean {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const rawPath = window.location.pathname;
  const pathname = base && rawPath.startsWith(base) ? rawPath.slice(base.length) || '/' : rawPath;
  if (pathname !== '/' && pathname !== '') return true; // non-home: skip
  if (REVIEW_MODE) return false;
  try {
    const lastSeen = Number(window.localStorage.getItem(PRELOADER_LAST_SEEN_KEY) ?? 0);
    if (lastSeen && Date.now() - lastSeen <= PRELOADER_COOLDOWN_MS) return true;
  } catch {
    // localStorage blocked - still show
  }
  return false;
}

const PreloaderOverlay: React.FC = () => {
  const [done, setDone] = useState(computeInitialDone);

  useEffect(() => {
    // Record a fresh timestamp when the preloader actually plays.
    if (!done && !REVIEW_MODE) {
      try {
        window.localStorage.setItem(PRELOADER_LAST_SEEN_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    }
  }, [done]);

  const p1 = rotatePhase(p1Start);
  const p2 = rotatePhase(p2Start);
  const p3x = rotatePhase(p3Start);
  const p3y = rotatePhaseY(p3Start);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: '#0B0F2A', perspective: 800 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_FADE_DUR, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Phase 1: STOP REACTING */}
            <motion.div
              role="presentation"
              aria-hidden="true"
              className="absolute font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white text-center"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', marginTop: '-38px' }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: p1.rotateX.values,
                opacity: p1.opacity.values,
              }}
              transition={{
                rotateX: { delay: p1.rotateX.delay, duration: p1.rotateX.duration, times: p1.rotateX.times, ease: p1.rotateX.ease },
                opacity: { delay: p1.opacity.delay, duration: p1.opacity.duration, times: p1.opacity.times, ease: p1.opacity.ease },
              }}
            >
              STOP REACTING
            </motion.div>

            {/* Phase 2: START SECURING */}
            <motion.div
              role="presentation"
              aria-hidden="true"
              className="absolute font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white text-center"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', marginTop: '-38px' }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: p2.rotateX.values,
                opacity: p2.opacity.values,
              }}
              transition={{
                rotateX: { delay: p2.rotateX.delay, duration: p2.rotateX.duration, times: p2.rotateX.times, ease: p2.rotateX.ease },
                opacity: { delay: p2.opacity.delay, duration: p2.opacity.duration, times: p2.opacity.times, ease: p2.opacity.ease },
              }}
            >
              <span className="text-gradient-primary">START SECURING</span>
            </motion.div>

            {/* Phase 3: Logo + Company Name */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Logo image - rotateY */}
              <motion.img
                src={`${import.meta.env.BASE_URL}rcs-logo.webp`}
                alt="RCS Logo"
                className="h-80 md:h-[26rem] w-auto mb-2"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{
                  rotateY: p3y.rotateY.values,
                  opacity: p3y.opacity.values,
                }}
                transition={{
                  rotateY: { delay: p3y.rotateY.delay, duration: p3y.rotateY.duration, times: p3y.rotateY.times, ease: p3y.rotateY.ease },
                  opacity: { delay: p3y.opacity.delay, duration: p3y.opacity.duration, times: p3y.opacity.times, ease: p3y.opacity.ease },
                }}
              />

              {/* Company name - rotateX */}
              <motion.span
                className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-white"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{
                  rotateX: p3x.rotateX.values,
                  opacity: p3x.opacity.values,
                }}
                transition={{
                  rotateX: { delay: p3x.rotateX.delay, duration: p3x.rotateX.duration, times: p3x.rotateX.times, ease: p3x.rotateX.ease },
                  opacity: { delay: p3x.opacity.delay, duration: p3x.opacity.duration, times: p3x.opacity.times, ease: p3x.opacity.ease },
                }}
                onAnimationComplete={() => {
                  // Hold the solid-dark overlay for a beat after the rotation
                  // physically lands at 90° before letting AnimatePresence fade
                  // it out. Prevents the page underneath from peeking through
                  // while the final frames of the rotate-out are still visible.
                  window.setTimeout(() => setDone(true), ROTATION_SETTLE_MS);
                }}
              >
                Rosebud Cloud Solutions
              </motion.span>
            </motion.div>

            {/* Subtle ambient glow */}
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none"
              style={{ background: 'rgba(160, 0, 181, 0.12)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
  );
};

// Public Preloader component - always renders children; overlay is deferred
// into <ClientOnly> so its useState initializer runs only on the client, with
// full access to window / localStorage / path, and never executes on SSR.
export const Preloader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <ClientOnly>
      <PreloaderOverlay />
    </ClientOnly>
  </>
);

export default Preloader;
