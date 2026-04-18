import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  distFromEdge: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftSpeed: number;
  driftOffset: number;
  maxDrift: number;
  colorIdx: number;
}

interface LogoParticlesProps {
  className?: string;
  logoSrc: string;
  particleCount?: number;
  /** Max distance particles can radiate outward from the edge (px) */
  radius?: number;
  color?: [number, number, number];
  colorAlt?: [number, number, number];
}

/**
 * Flood-fill from canvas edges to mark all transparent pixels
 * reachable from outside the shape as "exterior". Returns a
 * Uint8Array: 1 = exterior, 0 = interior or opaque.
 */
function markExterior(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold: number,
): Uint8Array {
  const size = width * height;
  const exterior = new Uint8Array(size); // 0 by default
  const stack: number[] = [];

  // Seed from all four canvas edges
  for (let x = 0; x < width; x++) {
    if (data[x * 4 + 3] < alphaThreshold) stack.push(x); // top row
    const bot = (height - 1) * width + x;
    if (data[bot * 4 + 3] < alphaThreshold) stack.push(bot); // bottom row
  }
  for (let y = 1; y < height - 1; y++) {
    const left = y * width;
    if (data[left * 4 + 3] < alphaThreshold) stack.push(left);
    const right = y * width + width - 1;
    if (data[right * 4 + 3] < alphaThreshold) stack.push(right);
  }

  // Mark seeds
  for (const idx of stack) exterior[idx] = 1;

  // Flood fill (4-connected)
  while (stack.length > 0) {
    const idx = stack.pop()!;
    const x = idx % width;
    const y = (idx - x) / width;

    const neighbours = [
      y > 0 ? idx - width : -1,
      y < height - 1 ? idx + width : -1,
      x > 0 ? idx - 1 : -1,
      x < width - 1 ? idx + 1 : -1,
    ];

    for (const n of neighbours) {
      if (n < 0 || exterior[n] === 1) continue;
      if (data[n * 4 + 3] >= alphaThreshold) continue; // opaque, can't pass
      exterior[n] = 1;
      stack.push(n);
    }
  }

  return exterior;
}

/**
 * Build a distance-to-nearest-opaque map for EXTERIOR transparent pixels only.
 */
function buildDistanceField(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold: number,
  exterior: Uint8Array,
): Float32Array {
  const size = width * height;
  const dist = new Float32Array(size);
  const INF = 1e9;

  for (let i = 0; i < size; i++) {
    if (data[i * 4 + 3] >= alphaThreshold) {
      dist[i] = 0; // opaque
    } else if (exterior[i] === 0) {
      dist[i] = -1; // interior cavity — exclude
    } else {
      dist[i] = INF; // exterior transparent
    }
  }

  // Two-pass Manhattan distance transform
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (dist[idx] <= 0) continue;
      if (x > 0 && dist[idx - 1] >= 0) dist[idx] = Math.min(dist[idx], dist[idx - 1] + 1);
      if (y > 0 && dist[(y - 1) * width + x] >= 0) dist[idx] = Math.min(dist[idx], dist[(y - 1) * width + x] + 1);
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const idx = y * width + x;
      if (dist[idx] <= 0) continue;
      if (x < width - 1 && dist[idx + 1] >= 0) dist[idx] = Math.min(dist[idx], dist[idx + 1] + 1);
      if (y < height - 1 && dist[(y + 1) * width + x] >= 0) dist[idx] = Math.min(dist[idx], dist[(y + 1) * width + x] + 1);
    }
  }

  return dist;
}

export const LogoParticles: React.FC<LogoParticlesProps> = ({
  className = '',
  logoSrc,
  particleCount = 1400,
  radius = 80,
  color = [217, 70, 239],
  colorAlt = [192, 132, 252],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const buildAndSpawn = useCallback(
    (img: HTMLImageElement, cw: number, ch: number) => {
      // Render logo to offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = cw;
      offscreen.height = ch;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return [];

      const scale = Math.min(cw / img.width, ch / img.height) * 0.85;
      const w = img.width * scale;
      const h = img.height * scale;
      const ox = (cw - w) / 2;
      const oy = (ch - h) / 2;
      ctx.drawImage(img, ox, oy, w, h);

      const imageData = ctx.getImageData(0, 0, cw, ch);
      const exterior = markExterior(imageData.data, cw, ch, 40);
      const dist = buildDistanceField(imageData.data, cw, ch, 40, exterior);

      // Collect candidate positions: transparent pixels within `radius` of the shape
      const candidates: { x: number; y: number; d: number }[] = [];
      const step = 2;
      for (let y = 0; y < ch; y += step) {
        for (let x = 0; x < cw; x += step) {
          const d = dist[y * cw + x];
          // d <= 0 means opaque or interior cavity — skip
          // d > radius means too far — skip
          if (d <= 0 || d > radius) continue;
          candidates.push({ x, y, d });
        }
      }

      if (candidates.length === 0) return [];

      // Weight candidates so near-edge pixels are picked more often
      // Weight = 1/d^1.5 — heavily biased toward the edge
      const weights: number[] = [];
      let totalWeight = 0;
      for (const c of candidates) {
        const wt = 1 / Math.pow(c.d, 1.5);
        weights.push(wt);
        totalWeight += wt;
      }

      // Build cumulative distribution for weighted random sampling
      const cdf: number[] = [];
      let cumulative = 0;
      for (const wt of weights) {
        cumulative += wt / totalWeight;
        cdf.push(cumulative);
      }

      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        // Weighted random pick
        const r = Math.random();
        let idx = 0;
        for (let j = 0; j < cdf.length; j++) {
          if (r <= cdf[j]) { idx = j; break; }
        }
        const c = candidates[idx];

        const distRatio = c.d / radius; // 0 near edge, 1 at max radius

        // Opacity: bright near edge, dim far away
        const baseOpacity = (1 - distRatio * 0.9) * (Math.random() * 0.5 + 0.5);

        // Size: slightly larger near edge
        const size = (1 - distRatio * 0.5) * (Math.random() * 1.5 + 0.3);

        const cr = Math.random();
        const colorIdx = cr > 0.88 ? 2 : cr > 0.5 ? 1 : 0;

        particles.push({
          x: c.x,
          y: c.y,
          originX: c.x,
          originY: c.y,
          distFromEdge: c.d,
          size,
          baseOpacity,
          twinkleSpeed: Math.random() * 2.5 + 0.8,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftSpeed: Math.random() * 0.25 + 0.08,
          driftOffset: Math.random() * Math.PI * 2,
          maxDrift: Math.random() * 2.5 + 0.5,
          colorIdx,
        });
      }

      return particles;
    },
    [particleCount, radius],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      particlesRef.current = buildAndSpawn(img, rect.width, rect.height);
    };
    img.src = logoSrc;

    let t = 0;
    const colors: readonly (readonly [number, number, number])[] = [color, colorAlt, [255, 255, 255]];

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);
      t += 0.016;

      for (const p of particlesRef.current) {
        const twinkle = Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * 0.5 + 0.5;
        const alpha = p.baseOpacity * (0.3 + twinkle * 0.7);

        p.x = p.originX + Math.sin(t * p.driftSpeed + p.driftOffset) * p.maxDrift;
        p.y = p.originY + Math.cos(t * p.driftSpeed * 0.7 + p.driftOffset) * p.maxDrift;

        const c = colors[p.colorIdx];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
        ctx.fill();

        // White core for bright particles
        if (alpha > 0.45 && p.size > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || !img.complete) return;
      particlesRef.current = buildAndSpawn(img, rect.width, rect.height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [logoSrc, color, colorAlt, buildAndSpawn]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default LogoParticles;
