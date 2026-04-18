import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { ClientOnly } from '../components/ClientOnly';
import { pageMeta, serviceSchema, breadcrumbSchema } from '../data/seoMeta';
import { TiltCard } from '../components/TiltCard';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// ─── Scroll-triggered wrapper ─────────────────────────────────────────────────

const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={fadeUp}
    transition={{ duration: 0.7, delay: delay * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

// ─── Optimisation Radar Hero Graphic ──────────────────────────────────────────

const OptimisationRadarGraphic: React.FC = () => {
  const axes = [
    { angle: -90, label: 'COST', value: 0.55 },
    { angle: -30, label: 'PERF', value: 0.75 },
    { angle: 30, label: 'SECURITY', value: 0.65 },
    { angle: 90, label: 'GOVERN', value: 0.45 },
    { angle: 150, label: 'SCALE', value: 0.70 },
    { angle: 210, label: 'RELIABILITY', value: 0.60 },
  ];

  const optimised = [0.90, 0.92, 0.88, 0.85, 0.93, 0.91];

  const cx = 260, cy = 260, maxR = 160;

  const toXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const makePolygon = (values: number[]) =>
    axes.map((a, i) => {
      const p = toXY(a.angle, maxR * values[i]);
      return `${p.x},${p.y}`;
    }).join(' ');

  const currentPoly = makePolygon(axes.map(a => a.value));
  const optimisedPoly = makePolygon(optimised);

  return (
    <div className="relative w-full max-w-[520px] aspect-square">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(160,0,181,0.12) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)' }}
      />
      <svg viewBox="0 0 520 520" className="w-full h-full" fill="none">
        <defs>
          <filter id="optGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="optPulse" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(160,0,181,0.4)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.4)" />
          </linearGradient>
        </defs>

        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1.0].map((s, i) => (
          <polygon key={i}
            points={axes.map(a => { const p = toXY(a.angle, maxR * s); return `${p.x},${p.y}`; }).join(' ')}
            fill="none" stroke="rgba(160,0,181,0.08)" strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axes.map((a, i) => {
          const end = toXY(a.angle, maxR + 20);
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
              stroke="rgba(160,0,181,0.1)" strokeWidth="1" strokeDasharray="4 8" />
          );
        })}

        {/* Current state polygon */}
        <motion.polygon
          points={currentPoly}
          fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"
          strokeDasharray="6 4"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Optimised polygon */}
        <motion.polygon
          points={optimisedPoly}
          fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.7)" strokeWidth="2"
          filter="url(#optGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Axis labels & dots */}
        {axes.map((a, i) => {
          const labelPos = toXY(a.angle, maxR + 38);
          const currentPos = toXY(a.angle, maxR * a.value);
          const optPos = toXY(a.angle, maxR * optimised[i]);
          return (
            <g key={a.label}>
              <text x={labelPos.x} y={labelPos.y + 4} textAnchor="middle" fontSize="7.5"
                fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">{a.label}</text>
              {/* Current dot */}
              <motion.circle cx={currentPos.x} cy={currentPos.y} r="4"
                fill="rgba(239,68,68,0.8)" filter="url(#optGlow)"
                animate={{ r: [3, 5, 3], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              />
              {/* Optimised dot */}
              <motion.circle cx={optPos.x} cy={optPos.y} r="5"
                fill="rgba(34,197,94,0.9)" filter="url(#optGlow)"
                animate={{ r: [4, 6, 4], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 + 0.5 }}
              />
              {/* Improvement arrow */}
              <motion.line
                x1={currentPos.x} y1={currentPos.y}
                x2={optPos.x} y2={optPos.y}
                stroke="rgba(34,197,94,0.4)" strokeWidth="1" strokeDasharray="3 4"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
              />
            </g>
          );
        })}

        {/* Centre label */}
        <circle cx={cx} cy={cy} r="28" fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.8)" fontFamily="monospace" fontWeight="bold">AZURE</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.5)" fontFamily="monospace">HEALTH</text>

        {/* Scanning sweep */}
        <motion.line
          x1={cx} y1={cy} x2={cx} y2={cy - maxR}
          stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round"
          filter="url(#optPulse)"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulsing rings from centre */}
        {[0, 1, 2].map(i => (
          <motion.circle key={i} cx={cx} cy={cy} r="30"
            stroke="rgba(34,197,94,0.3)" strokeWidth="1" fill="none"
            animate={{ r: [30, maxR, maxR + 20], opacity: [0.6, 0.1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
          />
        ))}

        {/* Legend */}
        <rect x="20" y="470" width="10" height="10" rx="2" fill="rgba(239,68,68,0.5)" />
        <text x="36" y="479" fontSize="7" fill="rgba(239,68,68,0.7)" fontFamily="monospace">CURRENT</text>
        <rect x="110" y="470" width="10" height="10" rx="2" fill="rgba(34,197,94,0.7)" />
        <text x="126" y="479" fontSize="7" fill="rgba(34,197,94,0.8)" fontFamily="monospace">OPTIMISED</text>

        {/* Corner tick marks */}
        {[{ x: 22, y: 22 }, { x: 498, y: 22 }, { x: 22, y: 498 }, { x: 498, y: 498 }].map(({ x, y }, i) => {
          const dx = i % 2 === 0 ? 1 : -1;
          const dy = i < 2 ? 1 : -1;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + dx * 20} y2={y} stroke="rgba(160,0,181,0.35)" strokeWidth="2" strokeLinecap="round" />
              <line x1={x} y1={y} x2={x} y2={y + dy * 20} stroke="rgba(160,0,181,0.35)" strokeWidth="2" strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Cost & Performance Dashboard Graphic (Overview) ─────────────────────────

const CostDashboardGraphic: React.FC = () => (
  <div className="w-full h-[460px] bg-surface-container rounded-xl border border-outline/30 p-6 flex flex-col gap-4 overflow-hidden relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
          Azure Cost Management
        </div>
        <div className="font-headline text-sm font-bold">Optimisation Dashboard</div>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] text-green-400 font-label">Analysing</span>
      </div>
    </div>

    {/* Cost savings ring */}
    <div className="flex items-center gap-5 bg-surface p-4 rounded-xl border border-outline/20">
      <div className="relative w-[72px] h-[72px] shrink-0">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(160,0,181,0.1)" strokeWidth="7" />
          <motion.circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke="rgba(34,197,94,0.9)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={String(2 * Math.PI * 30)}
            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.38) }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-lg font-bold leading-none">38%</span>
          <span className="text-[8px] text-on-surface-variant leading-none mt-0.5">savings</span>
        </div>
      </div>
      <div>
        <div className="font-headline font-bold text-sm mb-1">Cost Reduction Identified</div>
        <div className="text-[11px] text-on-surface-variant">£14,200/mo in optimisation opportunities found</div>
        <div className="text-[10px] text-green-400 mt-1.5 font-label font-bold">↓ £170K annual saving potential</div>
      </div>
    </div>

    {/* Optimisation areas */}
    {[
      { label: 'Right-sizing VMs', value: 72, color: 'rgba(34,197,94,0.9)' },
      { label: 'Reserved Instances', value: 85, color: 'rgba(34,197,94,0.75)' },
      { label: 'Orphaned Resources', value: 45, color: 'rgba(251,191,36,0.9)' },
      { label: 'Storage Tier Optimisation', value: 60, color: 'rgba(160,0,181,0.9)' },
    ].map(({ label, value, color }, i) => (
      <div key={label} className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-on-surface-variant font-label">{label}</span>
          <span className="text-[11px] font-bold">{value}%</span>
        </div>
        <div className="h-[5px] bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.5, delay: 0.9 + i * 0.15, ease: 'easeOut' }}
          />
        </div>
      </div>
    ))}

    {/* Status row */}
    <div className="grid grid-cols-3 gap-2 mt-auto">
      {[
        { icon: 'savings', label: 'Monthly Waste', status: '£14.2K' },
        { icon: 'memory', label: 'Underutilised', status: '23 VMs' },
        { icon: 'delete_sweep', label: 'Orphaned', status: '47 Resources' },
      ].map(({ icon, label, status }) => (
        <div key={label} className="bg-surface p-2.5 rounded-lg border border-outline/20 text-center">
          <span aria-hidden="true" className="material-symbols-outlined text-primary block mb-1" style={{ fontSize: '1.1rem' }}>
            {icon}
          </span>
          <div className="text-[9px] text-on-surface-variant font-label">{label}</div>
          <div className="text-[10px] font-bold text-primary">{status}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Before/After Efficiency Graphic (Business Impact) ───────────────────────

const EfficiencyGraphic: React.FC = () => {
  // Cost bars comparison
  const categories = [
    { label: 'COMPUTE', before: 180, after: 105, savings: '42%' },
    { label: 'STORAGE', before: 120, after: 75, savings: '38%' },
    { label: 'NETWORK', before: 90, after: 65, savings: '28%' },
    { label: 'DATABASE', before: 140, after: 88, savings: '37%' },
    { label: 'OTHER', before: 70, after: 40, savings: '43%' },
  ];

  return (
    <div className="relative w-full h-[460px] bg-surface-container-highest rounded-2xl border border-outline/30 overflow-hidden">
      <svg viewBox="0 0 500 460" className="w-full h-full absolute inset-0" fill="none">
        <defs>
          <filter id="effGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="savingsGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(34,197,94,0)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.3)" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="250" y="35" textAnchor="middle" fontSize="9" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">MONTHLY AZURE SPEND — BEFORE vs AFTER</text>

        {/* Grid lines */}
        {[80, 130, 180, 230, 280, 330, 380].map(y => (
          <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="4 12" />
        ))}

        {/* Bars */}
        {categories.map(({ label, before, after, savings }, i) => {
          const x = 90 + i * 80;
          const barWidth = 28;
          const baseY = 390;

          return (
            <g key={label}>
              {/* Before bar (red/dim) */}
              <motion.rect
                x={x} y={baseY - before} width={barWidth} height={before}
                rx="4" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />
              <text x={x + barWidth / 2} y={baseY - before - 8} textAnchor="middle" fontSize="6.5"
                fill="rgba(239,68,68,0.7)" fontFamily="monospace">£{(before * 100).toLocaleString()}</text>

              {/* After bar (green) */}
              <motion.rect
                x={x + barWidth + 4} y={baseY - after} width={barWidth} height={after}
                rx="4" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.2"
                filter="url(#effGlow)"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 + 0.5 }}
              />
              <text x={x + barWidth + 4 + barWidth / 2} y={baseY - after - 8} textAnchor="middle" fontSize="6.5"
                fill="rgba(34,197,94,0.8)" fontFamily="monospace">£{(after * 100).toLocaleString()}</text>

              {/* Savings badge */}
              <motion.g
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 + 1 }}
              >
                <rect x={x + 8} y={baseY - after - 45} width="44" height="18" rx="4"
                  fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
                <text x={x + 30} y={baseY - after - 33} textAnchor="middle" fontSize="7"
                  fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">↓{savings}</text>
              </motion.g>

              {/* Label */}
              <text x={x + barWidth + 2} y="410" textAnchor="middle" fontSize="7"
                fill="rgba(255,255,255,0.45)" fontFamily="monospace">{label}</text>
            </g>
          );
        })}

        {/* Total savings */}
        <motion.g
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <rect x="160" y="430" width="180" height="24" rx="6" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.2" />
          <text x="250" y="446" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">TOTAL: 38% COST REDUCTION</text>
        </motion.g>

        {/* Legend */}
        <rect x="60" y="55" width="10" height="10" rx="2" fill="rgba(239,68,68,0.3)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
        <text x="76" y="64" fontSize="7" fill="rgba(239,68,68,0.7)" fontFamily="monospace">BEFORE</text>
        <rect x="140" y="55" width="10" height="10" rx="2" fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.6)" strokeWidth="1" />
        <text x="156" y="64" fontSize="7" fill="rgba(34,197,94,0.8)" fontFamily="monospace">AFTER</text>
      </svg>
    </div>
  );
};

// ─── Use Case Illustrations ──────────────────────────────────────────────────

/** 1. Cloud Cost Optimisation — shrinking cost bars */
const IllustrationCostOpt: React.FC = () => {
  const bars = [
    { x: 50, before: 220, after: 120, label: 'VMs' },
    { x: 120, before: 180, after: 95, label: 'DB' },
    { x: 190, before: 150, after: 85, label: 'STORE' },
    { x: 260, before: 130, after: 60, label: 'NET' },
    { x: 330, before: 100, after: 45, label: 'OTHER' },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="coGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Grid */}
      {[80, 140, 200, 260].map(y => (
        <line key={y} x1="30" y1={y} x2="370" y2={y} stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="3 10" />
      ))}
      {bars.map(({ x, before, after, label }, i) => (
        <g key={label}>
          {/* Before bar (fading) */}
          <motion.rect x={x} y={290 - before} width="22" height={before} rx="3"
            fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="1" strokeDasharray="4 3"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          {/* After bar */}
          <motion.rect x={x} y={290 - after} width="22" height={after} rx="3"
            fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.7)" strokeWidth="1.2"
            filter="url(#coGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
          />
          {/* Savings arrow */}
          <motion.line x1={x + 11} y1={290 - before + 5} x2={x + 11} y2={290 - after - 5}
            stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" strokeLinecap="round"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <text x={x + 11} y="305" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.4)" fontFamily="monospace">{label}</text>
        </g>
      ))}
      {/* Label */}
      <text x="200" y="30" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">SPEND REDUCTION</text>
    </svg>
  );
};

/** 2. Performance & Reliability — heartbeat/uptime monitor */
const IllustrationPerformance: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="perfGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Heartbeat line — problematic */}
    <motion.polyline
      points="20,200 60,200 80,200 90,170 100,240 110,150 120,220 140,200 200,200"
      stroke="rgba(239,68,68,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="110" y="130" textAnchor="middle" fontSize="7" fill="rgba(239,68,68,0.6)" fontFamily="monospace">UNSTABLE</text>

    {/* Heartbeat line — optimised */}
    <motion.polyline
      points="200,200 220,200 230,180 240,210 250,190 260,200 280,200 300,200 310,185 320,205 330,195 340,200 380,200"
      stroke="rgba(34,197,94,0.8)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      filter="url(#perfGlow)"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="290" y="130" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.7)" fontFamily="monospace">STABLE</text>

    {/* Divider */}
    <line x1="200" y1="100" x2="200" y2="280" stroke="rgba(160,0,181,0.15)" strokeWidth="1" strokeDasharray="4 8" />
    <rect x="170" y="90" width="60" height="14" rx="7" fill="rgba(160,0,181,0.1)" />
    <text x="200" y="100" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">TUNED</text>

    {/* Uptime badges */}
    {[
      { x: 60, value: '92%', color: 'rgba(251,191,36,0.8)', label: 'before' },
      { x: 320, value: '99.9%', color: 'rgba(34,197,94,0.9)', label: 'after' },
    ].map(({ x, value, color, label }, i) => (
      <motion.g key={label}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
      >
        <rect x={x - 30} y="240" width="60" height="32" rx="6" fill={`${color.replace(/[\d.]+\)/, '0.1)')}`} stroke={color} strokeWidth="1.2" />
        <text x={x} y="256" textAnchor="middle" fontSize="10" fill={color} fontWeight="bold" fontFamily="monospace">{value}</text>
        <text x={x} y="266" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="monospace">uptime</text>
      </motion.g>
    ))}

    {/* Pulsing dot */}
    <motion.circle cx="380" cy="200" r="5" fill="rgba(34,197,94,0.9)" filter="url(#perfGlow)"
      animate={{ r: [4, 7, 4], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

/** 3. Post-Migration Optimisation — migration journey with cleanup */
const IllustrationPostMigration: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="pmGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* On-prem box (left) */}
    <rect x="20" y="100" width="80" height="120" rx="8" fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
    <text x="60" y="125" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">ON-PREM</text>
    {[140, 160, 180, 200].map((y, i) => (
      <rect key={i} x="30" y={y} width="60" height="8" rx="2" fill="rgba(160,0,181,0.1)" stroke="rgba(160,0,181,0.2)" strokeWidth="0.5" />
    ))}

    {/* Migration arrow */}
    <motion.path d="M 105 160 L 148 160" stroke="rgba(160,0,181,0.5)" strokeWidth="1.5" fill="none"
      strokeDasharray="4 4"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <text x="127" y="148" textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.5)" fontFamily="monospace">MIGRATED</text>

    {/* Cloud box (messy) */}
    <rect x="155" y="80" width="90" height="160" rx="8" fill="rgba(251,191,36,0.05)" stroke="rgba(251,191,36,0.35)" strokeWidth="1" />
    <text x="200" y="100" textAnchor="middle" fontSize="7" fill="rgba(251,191,36,0.8)" fontFamily="monospace" fontWeight="bold">AZURE</text>
    <text x="200" y="112" textAnchor="middle" fontSize="6" fill="rgba(251,191,36,0.5)" fontFamily="monospace">(unoptimised)</text>
    {/* Messy scattered resources */}
    {[
      { x: 165, y: 125, w: 30, h: 18 }, { x: 200, y: 120, w: 35, h: 22 },
      { x: 170, y: 155, w: 25, h: 15 }, { x: 200, y: 150, w: 32, h: 20 },
      { x: 165, y: 185, w: 28, h: 16 }, { x: 198, y: 182, w: 38, h: 24 },
    ].map(({ x, y, w, h }, i) => (
      <motion.rect key={i} x={x} y={y} width={w} height={h} rx="3"
        fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}

    {/* Optimisation arrow */}
    <motion.path d="M 250 160 L 295 160" stroke="rgba(34,197,94,0.6)" strokeWidth="2" fill="none"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <text x="273" y="148" textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.6)" fontFamily="monospace">OPTIMISE</text>

    {/* Optimised cloud box */}
    <motion.rect x="300" y="90" width="80" height="140" rx="8"
      fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.2"
      filter="url(#pmGlow)"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="340" y="110" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.8)" fontFamily="monospace" fontWeight="bold">AZURE</text>
    <text x="340" y="122" textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.5)" fontFamily="monospace">(optimised)</text>
    {/* Neat stacked resources */}
    {[135, 160, 185].map((y, i) => (
      <motion.rect key={i} x="310" y={y} width="60" height="18" rx="4"
        fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}

    {/* Bottom label */}
    <text x="200" y="290" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.6)" fontFamily="monospace" fontWeight="bold">refine structure after migration</text>
  </svg>
);

/** 4. Rapid Growth Clean-up — tangled to organised */
const IllustrationGrowthCleanup: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="gcGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Tangled mess (left) */}
    <text x="100" y="40" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.6)" fontFamily="monospace" fontWeight="bold">UNGOVERNED</text>
    {/* Random scattered nodes */}
    {[
      { x: 40, y: 80 }, { x: 120, y: 65 }, { x: 85, y: 130 },
      { x: 45, y: 180 }, { x: 140, y: 155 }, { x: 100, y: 210 },
      { x: 60, y: 250 }, { x: 155, y: 240 }, { x: 30, y: 140 },
      { x: 160, y: 100 },
    ].map(({ x, y }, i) => (
      <motion.circle key={i} cx={x} cy={y} r={6 + (i % 3) * 3}
        fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
    {/* Tangled lines */}
    {[
      'M 40,80 Q 80,60 120,65', 'M 120,65 Q 90,100 85,130',
      'M 85,130 Q 120,160 140,155', 'M 45,180 Q 90,190 100,210',
      'M 40,80 Q 30,120 30,140', 'M 160,100 Q 155,140 155,240',
      'M 60,250 Q 100,230 155,240', 'M 30,140 Q 40,170 45,180',
    ].map((d, i) => (
      <motion.path key={i} d={d} stroke="rgba(239,68,68,0.2)" strokeWidth="1" fill="none"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}

    {/* Divider */}
    <line x1="200" y1="50" x2="200" y2="280" stroke="rgba(160,0,181,0.15)" strokeWidth="1" strokeDasharray="4 8" />
    <rect x="172" y="145" width="56" height="14" rx="7" fill="rgba(160,0,181,0.1)" />
    <text x="200" y="155" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">GOVERN</text>

    {/* Organised grid (right) */}
    <text x="310" y="40" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">STRUCTURED</text>
    {/* Neat resource groups */}
    {[
      { x: 240, y: 60, w: 130, h: 65, label: 'PRODUCTION' },
      { x: 240, y: 140, w: 130, h: 65, label: 'STAGING' },
      { x: 240, y: 220, w: 130, h: 65, label: 'DEVELOPMENT' },
    ].map(({ x, y, w, h, label }, i) => (
      <g key={label}>
        <motion.rect x={x} y={y} width={w} height={h} rx="6"
          fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.4)" strokeWidth="1.2"
          filter="url(#gcGlow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        />
        <text x={x + 8} y={y + 16} fontSize="6.5" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">{label}</text>
        {/* Neat inner resources */}
        {[0, 1, 2].map(j => (
          <rect key={j} x={x + 8 + j * 40} y={y + 28} width="34" height="24" rx="4"
            fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.25)" strokeWidth="0.8" />
        ))}
      </g>
    ))}

    {/* Bottom label */}
    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.6)" fontFamily="monospace" fontWeight="bold">bring control to rapid growth</text>
  </svg>
);

/** 5. Architecture Refinement — restructuring blocks */
const IllustrationArchitecture: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="archGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Architecture layers */}
    {[
      { y: 40, label: 'FRONTEND', color: 'rgba(56,189,248,0.7)', width: 320 },
      { y: 100, label: 'API LAYER', color: 'rgba(160,0,181,0.7)', width: 280 },
      { y: 160, label: 'SERVICES', color: 'rgba(160,0,181,0.6)', width: 240 },
      { y: 220, label: 'DATA', color: 'rgba(34,197,94,0.7)', width: 200 },
    ].map(({ y, label, color, width }, i) => {
      const x = (400 - width) / 2;
      return (
        <g key={label}>
          <motion.rect x={x} y={y} width={width} height="45" rx="8"
            fill={`${color.replace(/[\d.]+\)/, '0.08)')}`}
            stroke={color} strokeWidth="1.5"
            filter="url(#archGlow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
          <text x="200" y={y + 27} textAnchor="middle" fontSize="8" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
          {/* Connection dots */}
          {i < 3 && (
            <motion.line x1="200" y1={y + 45} x2="200" y2={y + 60}
              stroke={color} strokeWidth="1.5" strokeDasharray="3 4"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          )}
        </g>
      );
    })}
    {/* Improvement annotations */}
    {[
      { x: 360, y: 60, label: 'CDN +' },
      { x: 355, y: 120, label: 'CACHE +' },
      { x: 345, y: 180, label: 'SCALE +' },
      { x: 335, y: 240, label: 'INDEX +' },
    ].map(({ x, y, label }, i) => (
      <motion.g key={label}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, times: [0, 0.1, 0.3, 0.8, 1] }}
      >
        <rect x={x - 22} y={y - 8} width="50" height="16" rx="4"
          fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
        <text x={x + 3} y={y + 4} textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.9)" fontFamily="monospace" fontWeight="bold">{label}</text>
      </motion.g>
    ))}
    {/* Bottom label */}
    <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">improve design for scalability</text>
  </svg>
);

/** 6. Governance & Structure — policy controls */
const IllustrationGovernance: React.FC = () => {
  const policies = [
    { label: 'TAG ENFORCEMENT', status: 'ACTIVE' },
    { label: 'COST ALERTS', status: 'ACTIVE' },
    { label: 'REGION LOCK', status: 'ACTIVE' },
    { label: 'RBAC REVIEW', status: 'ACTIVE' },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="govGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Central shield */}
      <motion.g filter="url(#govGlow)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path d="M 200 60 L 240 80 L 240 140 L 200 170 L 160 140 L 160 80 Z"
          fill="rgba(160,0,181,0.1)" stroke="rgba(160,0,181,0.6)" strokeWidth="2" />
        <text x="200" y="118" textAnchor="middle" fontSize="9" fill="rgba(160,0,181,0.8)" fontFamily="monospace" fontWeight="bold">GOV</text>
        <text x="200" y="132" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace">POLICY</text>
      </motion.g>
      {/* Pulsing ring */}
      <motion.circle cx="200" cy="115" r="50"
        stroke="rgba(160,0,181,0.3)" strokeWidth="1" fill="none"
        animate={{ r: [50, 80, 100], opacity: [0.6, 0.2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Policy cards radiating out */}
      {policies.map(({ label, status }, i) => {
        const angle = -45 + i * 30;
        const rad = (angle * Math.PI) / 180;
        const dist = 130;
        const x = 200 + dist * Math.cos(rad);
        const y = 115 + dist * Math.sin(rad);
        return (
          <g key={label}>
            <motion.line x1="200" y1="115" x2={x} y2={y}
              stroke="rgba(34,197,94,0.25)" strokeWidth="1" strokeDasharray="3 6"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
            <motion.rect x={x - 50} y={y - 14} width="100" height="28" rx="6"
              fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.5)" strokeWidth="1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            />
            <text x={x} y={y - 1} textAnchor="middle" fontSize="6.5" fill="rgba(34,197,94,0.8)" fontFamily="monospace" fontWeight="bold">{label}</text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.6)" fontFamily="monospace">{status}</text>
          </g>
        );
      })}

      {/* Bottom label */}
      <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">strengthen policies and controls</text>
    </svg>
  );
};

const useCaseIllustrations = [
  IllustrationCostOpt,
  IllustrationPerformance,
  IllustrationPostMigration,
  IllustrationGrowthCleanup,
  IllustrationArchitecture,
  IllustrationGovernance,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'health_and_safety',
    title: 'Azure Environment Health Checks',
    description:
      'Comprehensive assessment of your Azure environment to identify misconfigurations, security gaps, and areas where best practices are not being followed.',
  },
  {
    icon: 'savings',
    title: 'Cost Optimisation & Usage Analysis',
    description:
      'Detailed analysis of your Azure spend to identify waste, right-size resources, and implement cost-saving strategies without impacting performance.',
  },
  {
    icon: 'speed',
    title: 'Performance & Reliability Improvements',
    description:
      'Identification and resolution of performance bottlenecks, latency issues, and reliability concerns to improve application and infrastructure stability.',
  },
  {
    icon: 'architecture',
    title: 'Architecture Review & Refinement',
    description:
      'Assessment of your current architecture against Azure best practices, with actionable recommendations to improve design, scalability, and maintainability.',
  },
  {
    icon: 'verified_user',
    title: 'Security & Governance Enhancements',
    description:
      'Review and strengthening of security controls, access management, and governance policies to ensure your environment meets compliance and operational standards.',
  },
  {
    icon: 'map',
    title: 'Prioritised Roadmap for Improvement',
    description:
      'A clear, prioritised plan of recommended improvements ranked by impact and effort, giving your team a practical path forward for continuous optimisation.',
  },
];

const useCases = [
  {
    icon: 'savings',
    title: 'Cloud Cost Optimisation',
    description:
      'Identify waste, right-size resources, and reduce unnecessary spend without impacting performance.',
    accent: 'rgba(160,0,181,0.35)',
  },
  {
    icon: 'speed',
    title: 'Performance & Reliability Issues',
    description:
      'Resolve bottlenecks and improve stability across applications and infrastructure.',
    accent: 'rgba(130,0,160,0.35)',
  },
  {
    icon: 'cloud_sync',
    title: 'Post-Migration Optimisation',
    description:
      'Refine environments after cloud migration to improve efficiency and structure.',
    accent: 'rgba(100,0,140,0.35)',
  },
  {
    icon: 'trending_up',
    title: 'Rapid Growth Clean-Up',
    description:
      'Bring control and consistency to environments that have scaled quickly without governance.',
    accent: 'rgba(145,0,170,0.35)',
  },
  {
    icon: 'architecture',
    title: 'Architecture Refinement',
    description:
      'Improve design and resource organisation to support scalability and maintainability.',
    accent: 'rgba(115,0,150,0.35)',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Governance & Structure Improvements',
    description:
      'Strengthen policies and controls to better manage resources at scale.',
    accent: 'rgba(85,0,125,0.35)',
  },
];

const benefits = [
  {
    icon: 'trending_down',
    title: 'Reduced Cloud Spend',
    description: 'Eliminate waste and optimise resource usage to significantly lower your monthly Azure costs.',
  },
  {
    icon: 'bolt',
    title: 'Improved Performance',
    description: 'Resolve bottlenecks and tune your environment for faster, more reliable application delivery.',
  },
  {
    icon: 'shield',
    title: 'Stronger Governance',
    description: 'Better policies, controls, and structure make your cloud environment easier to manage and more secure.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CloudOptimisationPageProps {
  readonly className?: string;
}

export const CloudOptimisationPage: React.FC<CloudOptimisationPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.cloudOptimisation}
        schema={[
          serviceSchema({
            name: 'Cloud Optimisation & FinOps',
            description: pageMeta.cloudOptimisation.description,
            path: pageMeta.cloudOptimisation.path,
            serviceType: 'Cloud Cost Optimisation',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Cloud Optimisation', path: pageMeta.cloudOptimisation.path },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-5%] right-[-8%] w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(160,0,181,0.08) 40%, transparent 70%)' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-8%] left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.09) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Dot-matrix background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(rgba(160,0,181,1) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-24">

            {/* Left: Text */}
            <div className="flex-1 max-w-3xl">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-8 h-px bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label">
                  Cloud Optimisation
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="font-headline text-[3.2rem] md:text-[5rem] leading-[1.0] font-extrabold tracking-tighter mb-8">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  Refine, Optimise,
                </motion.span>
                <motion.span
                  className="block text-gradient-primary"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  And Improve
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62 }}
              >
                Refine, optimise, and improve your existing Azure environment.
              </motion.p>
            </div>

            {/* Right: Radar Graphic */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[480px] lg:max-w-[520px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <ClientOnly><OptimisationRadarGraphic /></ClientOnly>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-label">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── Overview ──────────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">

          {/* Text */}
          <div className="space-y-8">
            <ScrollReveal>
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                Overview
              </span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                Unlock Hidden{' '}
                <span className="text-gradient-primary">Potential</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We assess your current cloud setup and identify opportunities to enhance performance,
                reduce cost, and strengthen security. Our approach focuses on practical, measurable
                improvements that deliver immediate and long-term value.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Whether your environment has grown organically, been through a migration, or simply
                needs a fresh review — we provide clear, actionable recommendations that make a
                real difference.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src={`${import.meta.env.BASE_URL}service-cloud-optimisation.webp`}
                  alt="Cloud Optimisation & Improvement"
                  className="rounded-xl w-full h-[460px] object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What We Deliver ───────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              Deliverables
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              What We Deliver
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliverables.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                <TiltCard className="group h-full bg-surface border border-outline/60 rounded-2xl p-8 hover:border-primary/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
                        {icon}
                      </span>
                    </div>
                    <h4 className="font-headline text-lg font-bold mb-3">{title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How This Helps ────────────────────────────────────────────── */}
      <section className="py-32 bg-surface border-t border-outline">
        <div className="max-w-[1440px] mx-auto px-8 md:px-24">
          <div className="flex flex-col md:flex-row gap-20 items-center">

            {/* Efficiency Graphic */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <ClientOnly><EfficiencyGraphic /></ClientOnly>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-8">
              <ScrollReveal>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
                  Business Impact
                </span>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
                  Efficient, Cost-Effective,{' '}
                  <span className="text-gradient-primary">Easy to Manage</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  As cloud environments grow, inefficiencies and unnecessary costs often accumulate.
                  Resources become oversized, orphaned, or misconfigured — quietly increasing your
                  monthly spend without delivering value.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  We provide a clear assessment of your environment and identify areas for improvement.
                  By optimising resources, refining architecture, and strengthening governance, your
                  cloud platform becomes more efficient, cost-effective, and easier to manage.
                </p>
              </ScrollReveal>

              {/* Benefit cards */}
              <div className="space-y-4 pt-2">
                {benefits.map(({ icon, title, description }, i) => (
                  <ScrollReveal key={title} delay={3 + i}>
                    <div className="flex items-start gap-4 p-5 bg-surface-container rounded-xl border border-outline/30 hover:border-primary/30 transition-colors group">
                      <div className="bg-primary/15 p-2.5 rounded-lg text-primary shrink-0 group-hover:bg-primary/25 transition-colors">
                        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                          {icon}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-headline font-bold mb-1">{title}</h5>
                        <p className="text-on-surface-variant text-sm">{description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ─────────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal className="text-center mb-20 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block">
              Application
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              Common Use Cases
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Where cloud optimisation delivers the greatest impact.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(({ icon, title, description }, i) => {
              const Illustration = useCaseIllustrations[i];
              return (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                  className="group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Dark base */}
                  <div className="absolute inset-0 bg-[#06040f]" />

                  {/* SVG illustration */}
                  <div className="absolute inset-0 pointer-events-none transition-transform duration-700 group-hover:scale-105 origin-center">
                    <ClientOnly><Illustration /></ClientOnly>
                  </div>

                  {/* Bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06040f] via-[#06040f]/50 to-transparent" />

                  {/* Hover tint */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-500" />

                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-outline/20 group-hover:border-primary/40 transition-colors duration-500" />

                  {/* Top accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/60 to-transparent transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/40 transition-colors">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1rem' }}>
                          {icon}
                        </span>
                      </div>
                      <h4 className="font-headline text-lg font-bold">{title}</h4>
                    </div>
                    <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-24">
                      <p className="text-sm text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-44 bg-surface relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.12)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(56, 189, 248, 0.06)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              READY TO OPTIMISE
              <br />
              <span className="text-gradient-primary">YOUR CLOUD?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Speak with our team to discuss your Azure environment and discover where quick wins and long-term improvements can reduce cost and boost performance.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link to="/contact" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Book a Consultation
                </motion.button>
              </Link>
              <Link to="/how-we-work" className="no-underline">
                <motion.button
                  className="border border-outline/50 hover:border-primary/40 text-on-surface font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Our Process
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── References / Further Reading ─────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 pb-10 text-center text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/50 font-label">
        Further reading:{' '}
        <a
          href="https://learn.microsoft.com/azure/cost-management-billing/costs/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Microsoft Cost Management
        </a>
        {' · '}
        <a
          href="https://learn.microsoft.com/azure/well-architected/cost/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Azure Well-Architected: Cost
        </a>
      </div>

    </main>
  );
};
