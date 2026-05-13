import { useEffect, useRef } from 'react';

const BG = { r: 11, g: 15, b: 42 };
const SAMPLE_W = 1200;
const SAMPLE_H = 600;
const PIXEL_STEPS = 2;

const PHASE_2_AT = 2800;
const PHASE_3_AT = 5600;
const KILL_AT = 8500;
const COMPLETE_AT = 9600;

interface Vector2D { x: number; y: number }

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };
  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  isKilled = false;
  startColor = { ...BG };
  targetColor = { ...BG };
  colorWeight = 0;
  colorBlendRate = 0.025;

  move() {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const prox = dist < this.closeEnoughTarget ? dist / this.closeEnoughTarget : 1;

    const desX = dist > 0 ? (dx / dist) * this.maxSpeed * prox : 0;
    const desY = dist > 0 ? (dy / dist) * this.maxSpeed * prox : 0;

    let stX = desX - this.vel.x;
    let stY = desY - this.vel.y;
    const stMag = Math.sqrt(stX * stX + stY * stY);
    if (stMag > 0) {
      stX = (stX / stMag) * this.maxForce;
      stY = (stY / stMag) * this.maxForce;
    }

    this.vel.x += stX;
    this.vel.y += stY;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  currentColor() {
    const w = this.colorWeight;
    return {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * w),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * w),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * w),
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    const c = this.currentColor();
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 1, 1);
  }

  kill(w: number, h: number) {
    if (this.isKilled) return;
    const angle = Math.random() * Math.PI * 2;
    const d = (w + h) * 0.6;
    this.target.x = w / 2 + Math.cos(angle) * d;
    this.target.y = h / 2 + Math.sin(angle) * d;
    this.startColor = this.currentColor();
    this.targetColor = { ...BG };
    this.colorWeight = 0;
    this.isKilled = true;
  }
}

function samplePixels(
  canvas: HTMLCanvasElement,
  particles: Particle[],
  mode: 'text1' | 'text2' | 'composite',
  logoImg: HTMLImageElement | null,
) {
  const scaleX = canvas.width / SAMPLE_W;
  const scaleY = canvas.height / SAMPLE_H;

  const off = document.createElement('canvas');
  off.width = SAMPLE_W;
  off.height = SAMPLE_H;
  const ctx = off.getContext('2d')!;

  if (mode === 'text1') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 80px "Manrope Variable", Manrope, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STOP REACTING', SAMPLE_W / 2, SAMPLE_H / 2);
  } else if (mode === 'text2') {
    const grad = ctx.createLinearGradient(SAMPLE_W * 0.25, 0, SAMPLE_W * 0.75, 0);
    grad.addColorStop(0, '#A000B5');
    grad.addColorStop(1, '#f472b6');
    ctx.fillStyle = grad;
    ctx.font = '900 80px "Manrope Variable", Manrope, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START SECURING', SAMPLE_W / 2, SAMPLE_H / 2);
  } else {
    if (logoImg?.complete && logoImg.naturalWidth > 0) {
      const lh = 260;
      const lw = lh * (logoImg.naturalWidth / logoImg.naturalHeight);
      ctx.drawImage(logoImg, (SAMPLE_W - lw) / 2, SAMPLE_H / 2 - lh * 0.7, lw, lh);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 48px "Manrope Variable", Manrope, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Rosebud Cloud Solutions', SAMPLE_W / 2, SAMPLE_H / 2 + 110);
  }

  const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
  const coords: { x: number; y: number; r: number; g: number; b: number }[] = [];

  for (let i = 0; i < data.length; i += PIXEL_STEPS * 4) {
    if (data[i + 3] < 25) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    coords.push({
      x: (i / 4) % SAMPLE_W,
      y: Math.floor(i / 4 / SAMPLE_W),
      r, g, b,
    });
  }

  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }

  let pi = 0;
  for (const c of coords) {
    let p: Particle;
    if (pi < particles.length) {
      p = particles[pi];
      p.isKilled = false;
    } else {
      p = new Particle();
      const angle = Math.random() * Math.PI * 2;
      const d = Math.min(canvas.width, canvas.height) * 0.4;
      p.pos.x = canvas.width / 2 + Math.cos(angle) * d;
      p.pos.y = canvas.height / 2 + Math.sin(angle) * d;
      particles.push(p);
    }
    p.maxSpeed = Math.random() * 8 + 5;
    p.maxForce = p.maxSpeed * 0.05;
    p.colorBlendRate = Math.random() * 0.04 + 0.02;
    p.startColor = p.currentColor();
    p.targetColor = { r: c.r, g: c.g, b: c.b };
    p.colorWeight = 0;
    p.target.x = c.x * scaleX;
    p.target.y = c.y * scaleY;
    pi++;
  }

  for (let i = pi; i < particles.length; i++) {
    particles[i].kill(canvas.width, canvas.height);
  }
}

export function ParticlePreloader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let stopped = false;
    let animId = 0;
    let particles: Particle[] = [];
    let phase = 0;
    let done = false;
    const t0 = performance.now();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.src = `${import.meta.env.BASE_URL}rcs-logo.png`;

    const animate = () => {
      if (stopped) return;
      const elapsed = performance.now() - t0;
      const w = canvas.width;
      const h = canvas.height;

      let phaseChanged = false;
      if (phase === 0) {
        samplePixels(canvas, particles, 'text1', null);
        phase = 1;
        phaseChanged = true;
      } else if (elapsed >= PHASE_2_AT && phase === 1) {
        samplePixels(canvas, particles, 'text2', null);
        phase = 2;
        phaseChanged = true;
      } else if (elapsed >= PHASE_3_AT && phase === 2) {
        samplePixels(canvas, particles, 'composite', logo);
        phase = 3;
        phaseChanged = true;
      } else if (elapsed >= KILL_AT && phase === 3) {
        particles.forEach(p => p.kill(w, h));
        phase = 4;
        phaseChanged = true;
      }

      if (phaseChanged) {
        ctx.fillStyle = `rgb(${BG.r},${BG.g},${BG.b})`;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = `rgba(${BG.r},${BG.g},${BG.b},0.15)`;
        ctx.fillRect(0, 0, w, h);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.move();
        p.draw(ctx);
        if (p.isKilled && (p.pos.x < -50 || p.pos.x > w + 50 || p.pos.y < -50 || p.pos.y > h + 50)) {
          particles.splice(i, 1);
        }
      }

      if (elapsed >= COMPLETE_AT && !done) {
        done = true;
        onCompleteRef.current();
        return;
      }
    };

    const tick = () => {
      if (stopped) return;
      animate();
      if (!done && !stopped) {
        animId = window.setTimeout(tick, 16) as unknown as number;
      }
    };
    animId = window.setTimeout(tick, 16) as unknown as number;

    return () => {
      stopped = true;
      clearTimeout(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
