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
const ROTATE_IN  = 0.45;   // time to rotate from -90 → 0
const HOLD       = 0.50;   // time text stays fully visible
const ROTATE_OUT = 0.40;   // time to rotate from 0 → 90
const GAP        = 0.0;    // no dead-air between phases

const p1Start = 0;
const p1End   = p1Start + ROTATE_IN + HOLD + ROTATE_OUT;

const p2Start = p1End + GAP;
const p2End   = p2Start + ROTATE_IN + HOLD + ROTATE_OUT;

const p3Start = p2End + GAP;
const p3End   = p3Start + ROTATE_IN + HOLD + ROTATE_OUT;

// Quick dissolve once phase 3 content has fully rotated away
const OVERLAY_FADE_DUR = 0.3;

// ─── Smooth rotation keyframes (7 stops, custom ease per segment) ────────────

function rotatePhase(startDelay: number) {
  const dur = ROTATE_IN + HOLD + ROTATE_OUT;
  const inEnd    = ROTATE_IN / dur;
  const holdEnd  = (ROTATE_IN + HOLD) / dur;

  return {
    rotateX: {
      times:    [0,   inEnd * 0.35, inEnd * 0.7,  inEnd,   holdEnd,  holdEnd + (1 - holdEnd) * 0.4,  1],
      values:   [-90, -52,          -14,           0,       0,        38,                              90],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'easeOut', 'easeOut', 'linear', 'easeIn', 'easeIn'],
    },
    opacity: {
      times:    [0,    inEnd * 0.25,  holdEnd,   holdEnd + (1 - holdEnd) * 0.7, 1],
      values:   [0,    1,             1,         0.6,                            0],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'linear', 'easeIn', 'easeIn'],
    },
  };
}

// Logo uses rotateY instead of rotateX
function rotatePhaseY(startDelay: number) {
  const dur = ROTATE_IN + HOLD + ROTATE_OUT;
  const inEnd    = ROTATE_IN / dur;
  const holdEnd  = (ROTATE_IN + HOLD) / dur;

  return {
    rotateY: {
      times:    [0,   inEnd * 0.35, inEnd * 0.7,  inEnd,   holdEnd,  holdEnd + (1 - holdEnd) * 0.4,  1],
      values:   [-90, -52,          -14,           0,       0,        38,                              90],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'easeOut', 'easeOut', 'linear', 'easeIn', 'easeIn'],
    },
    opacity: {
      times:    [0,    inEnd * 0.25,  holdEnd,   holdEnd + (1 - holdEnd) * 0.7, 1],
      values:   [0,    1,             1,         0.6,                            0],
      delay: startDelay,
      duration: dur,
      ease: ['easeOut', 'linear', 'easeIn', 'easeIn'],
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
                onAnimationComplete={() => setDone(true)}
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
