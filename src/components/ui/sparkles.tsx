import { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, SingleOrMultiple } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  };

  const generatedId = useId();

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: { value: background || "transparent" },
            },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: ["attract", "trail"] },
                resize: true as unknown as { enable: boolean },
              },
              modes: {
                push: { quantity: 8 },
                repulse: { distance: 200, duration: 0.4 },
                attract: { distance: 250, duration: 0.6, speed: 2 },
                trail: {
                  delay: 0.05,
                  pauseOnStop: true,
                  quantity: 3,
                  particles: {
                    color: { value: particleColor || "#ffffff" },
                    move: {
                      speed: { min: 2, max: 5 },
                      outModes: { default: "destroy" },
                    },
                    opacity: {
                      value: { min: 0.3, max: 1 },
                      animation: { enable: true, speed: 3, startValue: "max", destroy: "min" },
                    },
                    size: {
                      value: { min: 0.5, max: 3 },
                      animation: { enable: true, speed: 2, startValue: "max", destroy: "min" },
                    },
                    life: {
                      count: 1,
                      duration: { value: { min: 0.3, max: 0.8 } },
                    },
                  },
                },
              },
            },
            particles: {
              color: {
                value: particleColor || "#ffffff",
              },
              effect: {
                close: true,
                fill: true,
                options: {},
                type: {} as SingleOrMultiple<string> | undefined,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: false,
                speed: { min: 0.1, max: 1 },
                straight: false,
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 120,
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                  count: 0,
                  enable: true,
                  speed: speed || 4,
                  decay: 0,
                  delay: 0,
                  sync: false,
                  mode: "auto",
                  startValue: "random",
                  destroy: "none",
                },
              },
              shape: { type: "circle" },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
              links: { enable: false },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};
