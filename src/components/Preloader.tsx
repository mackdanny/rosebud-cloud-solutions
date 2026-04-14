import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHASE_DURATION = 0.6;
const PHASE_HOLD = 0.8;
const PHASE_GAP = 0.15;

// Timeline (seconds):
// 0.0  – "STOP REACTING" rotates in
// 0.6  – hold
// 1.4  – rotates out
// 2.0  – gap
// 2.15 – "START SECURING" rotates in
// 2.75 – hold
// 3.55 – rotates out
// 4.15 – gap
// 4.30 – Logo (rotateY) + "Rosebud Cloud Solutions" (rotateX) rotate in
// 4.90 – hold
// 5.70 – both rotate out
// 6.30 – overlay fades out

const T1_IN = 0;
const T1_OUT = T1_IN + PHASE_DURATION + PHASE_HOLD;
const T2_IN = T1_OUT + PHASE_DURATION + PHASE_GAP;
const T2_OUT = T2_IN + PHASE_DURATION + PHASE_HOLD;
const T3_IN = T2_OUT + PHASE_DURATION + PHASE_GAP;
const T3_OUT = T3_IN + PHASE_DURATION + PHASE_HOLD;

export const Preloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [done, setDone] = useState(false);

  return (
    <>
      {children}
      <AnimatePresence>
        {!done && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: '#0B0F2A', perspective: 800 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onAnimationComplete={() => {}}
          >
            {/* Phase 1: STOP REACTING */}
            <motion.h1
              className="absolute font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white text-center"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: [  -90,   0,    0,   90 ],
                opacity:  [    0,   1,    1,    1 ],
              }}
              transition={{
                duration: T1_OUT + PHASE_DURATION - T1_IN,
                times: [
                  0,
                  PHASE_DURATION / (T1_OUT + PHASE_DURATION),
                  T1_OUT / (T1_OUT + PHASE_DURATION),
                  1,
                ],
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              STOP REACTING
            </motion.h1>

            {/* Phase 2: START SECURING */}
            <motion.h1
              className="absolute font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white text-center"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{
                rotateX: [  -90,   0,    0,   90 ],
                opacity:  [    0,   1,    1,    1 ],
              }}
              transition={{
                delay: T2_IN,
                duration: T2_OUT + PHASE_DURATION - T2_IN,
                times: [
                  0,
                  PHASE_DURATION / (T2_OUT + PHASE_DURATION - T2_IN),
                  (T2_OUT - T2_IN) / (T2_OUT + PHASE_DURATION - T2_IN),
                  1,
                ],
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <span className="text-gradient-primary">START SECURING</span>
            </motion.h1>

            {/* Phase 3: Logo + Company Name */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              onAnimationComplete={() => {}}
            >
              {/* Logo image - rotateY */}
              <motion.img
                src="/rcs-logo.png"
                alt="RCS Logo"
                className="h-80 md:h-[26rem] w-auto mb-6"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{
                  rotateY: [ -90,   0,    0,   90 ],
                  opacity:  [   0,   1,    1,    1 ],
                }}
                transition={{
                  delay: T3_IN,
                  duration: T3_OUT + PHASE_DURATION - T3_IN,
                  times: [
                    0,
                    PHASE_DURATION / (T3_OUT + PHASE_DURATION - T3_IN),
                    (T3_OUT - T3_IN) / (T3_OUT + PHASE_DURATION - T3_IN),
                    1,
                  ],
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              {/* Company name - rotateX */}
              <motion.span
                className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-white"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{
                  rotateX: [ -90,   0,    0,   90 ],
                  opacity:  [   0,   1,    1,    1 ],
                }}
                transition={{
                  delay: T3_IN,
                  duration: T3_OUT + PHASE_DURATION - T3_IN,
                  times: [
                    0,
                    PHASE_DURATION / (T3_OUT + PHASE_DURATION - T3_IN),
                    (T3_OUT - T3_IN) / (T3_OUT + PHASE_DURATION - T3_IN),
                    1,
                  ],
                  ease: [0.4, 0, 0.2, 1],
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
    </>
  );
};

export default Preloader;
