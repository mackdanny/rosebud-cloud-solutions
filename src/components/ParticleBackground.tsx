import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

interface ParticleBackgroundProps {
  readonly className?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className = '' }) => {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="hero-particles"
      className={`absolute inset-0 ${className}`}
      particlesLoaded={async () => {}}
      options={{
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
          },
          modes: {
            grab: { distance: 160, links: { opacity: 0.4 } },
          },
        },
        particles: {
          color: { value: ['#A000B5', '#d946ef', '#7c3aed', '#c084fc'] },
          links: {
            color: '#A000B5',
            distance: 160,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            outModes: { default: 'bounce' },
          },
          number: { value: 60, density: { enable: true } },
          opacity: {
            value: { min: 0.2, max: 0.6 },
            animation: { enable: true, speed: 0.5 },
          },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      // @ts-expect-error — older tsparticles versions use `init` prop
      init={init}
    />
  );
};

export default ParticleBackground;
