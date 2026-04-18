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

// ─── Cloud Health Monitor Hero Graphic ────────────────────────────────────────

const CloudHealthMonitorGraphic: React.FC = () => {
  // Heartbeat path points
  const heartbeatPath = 'M 30 260 L 90 260 L 110 260 L 125 200 L 140 310 L 160 180 L 180 290 L 195 240 L 210 260 L 270 260 L 290 260 L 305 210 L 320 300 L 340 190 L 360 280 L 375 245 L 390 260 L 490 260';

  // Service nodes orbiting the shield
  const serviceNodes = [
    { angle: 0, label: 'MONITOR', color: 'rgba(56,189,248,0.8)' },
    { angle: 60, label: 'PATCH', color: 'rgba(34,197,94,0.8)' },
    { angle: 120, label: 'ALERT', color: 'rgba(251,191,36,0.8)' },
    { angle: 180, label: 'GOVERN', color: 'rgba(160,0,181,0.8)' },
    { angle: 240, label: 'SECURE', color: 'rgba(56,189,248,0.8)' },
    { angle: 300, label: 'OPTIMISE', color: 'rgba(34,197,94,0.8)' },
  ];

  const cx = 260, cy = 260, orbitR = 180;

  return (
    <div className="relative w-full max-w-[520px] aspect-square">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(56,189,248,0.12) 0%, rgba(160,0,181,0.08) 40%, transparent 68%)' }}
      />
      <svg viewBox="0 0 520 520" className="w-full h-full" fill="none">
        <defs>
          <filter id="mcGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mcPulse" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="mcHeartGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0.9)" />
            <stop offset="50%" stopColor="rgba(160,0,181,0.9)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.9)" />
          </linearGradient>
          <linearGradient id="mcOrbitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.4)" />
            <stop offset="100%" stopColor="rgba(160,0,181,0.4)" />
          </linearGradient>
        </defs>

        {/* Orbit rings */}
        <circle cx={cx} cy={cy} r={orbitR} stroke="rgba(56,189,248,0.1)" strokeWidth="1" strokeDasharray="4 12" />
        <circle cx={cx} cy={cy} r={orbitR - 50} stroke="rgba(160,0,181,0.08)" strokeWidth="1" strokeDasharray="3 10" />
        <circle cx={cx} cy={cy} r={orbitR + 30} stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="2 14" />

        {/* Grid underlay */}
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <line x1="30" y1={52 * i + 30} x2="490" y2={52 * i + 30} stroke="rgba(56,189,248,0.03)" strokeWidth="1" />
            <line x1={52 * i + 30} y1="30" x2={52 * i + 30} y2="490" stroke="rgba(56,189,248,0.03)" strokeWidth="1" />
          </React.Fragment>
        ))}

        {/* Heartbeat line */}
        <motion.path
          d={heartbeatPath}
          stroke="url(#mcHeartGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.7, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Travelling pulse on heartbeat */}
        <motion.circle r="5" fill="rgba(56,189,248,0.9)" filter="url(#mcGlow)"
          animate={{
            cx: [30, 125, 160, 195, 260, 305, 340, 390, 490],
            cy: [260, 200, 180, 240, 260, 210, 190, 260, 260],
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Service nodes around orbit */}
        {serviceNodes.map(({ angle, label, color }, i) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const nx = cx + orbitR * Math.cos(rad);
          const ny = cy + orbitR * Math.sin(rad);
          return (
            <g key={label}>
              {/* Connection to center */}
              <motion.line x1={cx} y1={cy} x2={nx} y2={ny}
                stroke={color.replace(/[\d.]+\)/, '0.12)')} strokeWidth="1" strokeDasharray="3 8"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
              {/* Node */}
              <motion.circle cx={nx} cy={ny} r="24"
                fill={color.replace(/[\d.]+\)/, '0.08)')}
                stroke={color}
                strokeWidth="1.5"
                filter="url(#mcGlow)"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.35 }}
              />
              <text x={nx} y={ny + 3} textAnchor="middle" fontSize="6.5"
                fill={color} fontFamily="monospace" fontWeight="bold">
                {label}
              </text>
              {/* Pulse ring */}
              <motion.circle cx={nx} cy={ny} r="24"
                stroke={color} strokeWidth="1" fill="none"
                animate={{ r: [24, 36, 44], opacity: [0.4, 0.1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
              />
            </g>
          );
        })}

        {/* Central shield with heartbeat icon */}
        <motion.circle cx={cx} cy={cy} r="45"
          fill="rgba(160,0,181,0.1)"
          stroke="rgba(160,0,181,0.6)"
          strokeWidth="2"
          filter="url(#mcPulse)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Shield path */}
        <motion.path
          d={`M ${cx} ${cy - 22} L ${cx + 18} ${cy - 12} L ${cx + 18} ${cy + 6} Q ${cx + 18} ${cy + 22} ${cx} ${cy + 30} Q ${cx - 18} ${cy + 22} ${cx - 18} ${cy + 6} L ${cx - 18} ${cy - 12} Z`}
          fill="rgba(56,189,248,0.12)"
          stroke="rgba(56,189,248,0.7)"
          strokeWidth="1.5"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        {/* Heart icon inside shield */}
        <motion.path
          d={`M ${cx} ${cy + 12} L ${cx - 9} ${cy - 2} Q ${cx - 12} ${cy - 10} ${cx - 6} ${cy - 13} Q ${cx} ${cy - 16} ${cx} ${cy - 8} Q ${cx} ${cy - 16} ${cx + 6} ${cy - 13} Q ${cx + 12} ${cy - 10} ${cx + 9} ${cy - 2} Z`}
          fill="rgba(56,189,248,0.6)"
          stroke="rgba(56,189,248,0.9)"
          strokeWidth="1"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Rotating sentinel ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle cx={cx} cy={cy} r="70" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="8 20" fill="none" />
          <circle cx={cx + 70} cy={cy} r="3" fill="rgba(56,189,248,0.8)" filter="url(#mcGlow)" />
        </motion.g>

        {/* Pulsing rings from center */}
        {[0, 1].map(i => (
          <motion.circle key={i} cx={cx} cy={cy} r="45"
            stroke="rgba(56,189,248,0.35)" strokeWidth="1.5" fill="none"
            animate={{ r: [45, 90, 130], opacity: [0.5, 0.15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 2, ease: 'easeOut' }}
          />
        ))}

        {/* Corner brackets */}
        {[{ x: 22, y: 22 }, { x: 498, y: 22 }, { x: 22, y: 498 }, { x: 498, y: 498 }].map(({ x, y }, i) => {
          const dx = i % 2 === 0 ? 1 : -1;
          const dy = i < 2 ? 1 : -1;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + dx * 20} y2={y} stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
              <line x1={x} y1={y} x2={x} y2={y + dy * 20} stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Label */}
        <text x="260" y="500" textAnchor="middle" fontSize="7" fill="rgba(56,189,248,0.5)" fontFamily="monospace">
          MANAGED CLOUD · SECURITY · SUPPORT
        </text>
      </svg>
    </div>
  );
};

// ─── Operations Dashboard (Overview) ──────────────────────────────────────────

const OperationsDashboardGraphic: React.FC = () => (
  <div className="w-full h-[460px] bg-surface-container rounded-xl border border-outline/30 p-6 flex flex-col gap-4 overflow-hidden relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
          Managed Services
        </div>
        <div className="font-headline text-sm font-bold">Cloud Operations Dashboard</div>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] text-green-400 font-label">All Systems Healthy</span>
      </div>
    </div>

    {/* Uptime ring + stats */}
    <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-outline/20">
      <div className="relative w-[72px] h-[72px] shrink-0">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="7" />
          <motion.circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke="rgba(34,197,94,0.9)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={String(2 * Math.PI * 30)}
            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.998) }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-lg font-bold leading-none text-green-400">99.8%</span>
          <span className="text-[8px] text-on-surface-variant leading-none mt-0.5">uptime</span>
        </div>
      </div>
      <div>
        <div className="font-headline font-bold text-sm mb-1">Platform Health</div>
        <div className="text-[11px] text-on-surface-variant">42 resources monitored across 3 subscriptions</div>
        <div className="text-[10px] text-green-400 mt-1.5 font-label font-bold">0 critical incidents this month</div>
      </div>
    </div>

    {/* Service health bars */}
    {[
      { label: 'Security & Compliance', value: 100, color: 'rgba(34,197,94,0.9)' },
      { label: 'Performance & Availability', value: 98, color: 'rgba(56,189,248,0.9)' },
      { label: 'Cost Optimisation', value: 87, color: 'rgba(160,0,181,0.9)' },
      { label: 'Governance & Policy', value: 95, color: 'rgba(34,197,94,0.9)' },
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
        { icon: 'monitoring', label: 'Alerts', status: '0 Active' },
        { icon: 'shield', label: 'Security', status: 'Compliant' },
        { icon: 'savings', label: 'Spend', status: 'On Track' },
      ].map(({ icon, label, status }) => (
        <div key={label} className="bg-surface p-2.5 rounded-lg border border-outline/20 text-center">
          <span aria-hidden="true" className="material-symbols-outlined text-primary block mb-1" style={{ fontSize: '1.1rem' }}>
            {icon}
          </span>
          <div className="text-[9px] text-on-surface-variant font-label">{label}</div>
          <div className="text-[10px] font-bold text-green-400">{status}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Platform Health Matrix (Business Impact) ─────────────────────────────────

const PlatformHealthMatrix: React.FC = () => {
  const dimensions = [
    { label: 'Security', value: 95, angle: 0, color: 'rgba(34,197,94,0.9)' },
    { label: 'Performance', value: 88, angle: 60, color: 'rgba(56,189,248,0.9)' },
    { label: 'Cost', value: 82, angle: 120, color: 'rgba(160,0,181,0.9)' },
    { label: 'Compliance', value: 97, angle: 180, color: 'rgba(34,197,94,0.9)' },
    { label: 'Availability', value: 99, angle: 240, color: 'rgba(56,189,248,0.9)' },
    { label: 'Governance', value: 91, angle: 300, color: 'rgba(160,0,181,0.9)' },
  ];

  const cx = 250, cy = 220, maxR = 150;

  const getPoint = (angle: number, r: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const valuePoints = dimensions.map(d => getPoint(d.angle, (d.value / 100) * maxR));
  const valuePathD = valuePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative w-full h-[460px] bg-surface-container-highest rounded-2xl border border-outline/30 overflow-hidden">
      <svg viewBox="0 0 500 460" className="w-full h-full absolute inset-0" fill="none">
        <defs>
          <filter id="phGlow"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="phFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.12)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.12)" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="250" y="35" textAnchor="middle" fontSize="9" fill="rgba(56,189,248,0.7)" fontFamily="monospace" fontWeight="bold">
          PLATFORM HEALTH OVERVIEW
        </text>

        {/* Radar grid rings */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => {
          const points = dimensions.map(d => getPoint(d.angle, maxR * scale));
          const pathD = points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path key={i} d={pathD}
              stroke="rgba(56,189,248,0.1)" strokeWidth="1" fill="none"
              strokeDasharray={i < 3 ? '3 8' : undefined}
            />
          );
        })}

        {/* Axis lines */}
        {dimensions.map(({ angle, label }, i) => {
          const outer = getPoint(angle, maxR + 20);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y}
                stroke="rgba(56,189,248,0.08)" strokeWidth="1" />
              <text x={outer.x} y={outer.y + (angle > 90 && angle < 270 ? 14 : -6)}
                textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.6)"
                fontFamily="monospace" fontWeight="bold">
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Filled value area */}
        <motion.path d={valuePathD}
          fill="url(#phFill)"
          stroke="rgba(56,189,248,0.5)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Value nodes */}
        {dimensions.map(({ angle, value, color, label }, i) => {
          const p = getPoint(angle, (value / 100) * maxR);
          return (
            <g key={label}>
              <motion.circle cx={p.x} cy={p.y} r="8"
                fill={color.replace(/[\d.]+\)/, '0.15)')}
                stroke={color} strokeWidth="1.5"
                filter="url(#phGlow)"
                animate={{ opacity: [0.6, 1, 0.6], r: [7, 9, 7] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              />
              <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="6" fill={color}
                fontFamily="monospace" fontWeight="bold">
                {value}
              </text>
            </g>
          );
        })}

        {/* Centre node */}
        <motion.circle cx={cx} cy={cy} r="12"
          fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5"
          filter="url(#phGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x={cx} y={cy + 3} textAnchor="middle" fontSize="5.5" fill="rgba(56,189,248,0.8)" fontFamily="monospace" fontWeight="bold">
          HEALTH
        </text>

        {/* Pulsing rings */}
        {[0, 1].map(i => (
          <motion.circle key={i} cx={cx} cy={cy} r="12"
            stroke="rgba(56,189,248,0.3)" strokeWidth="1" fill="none"
            animate={{ r: [12, 50, 80], opacity: [0.4, 0.1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.75, ease: 'easeOut' }}
          />
        ))}

        {/* Bottom label */}
        <text x="250" y="440" textAnchor="middle" fontSize="7" fill="rgba(56,189,248,0.4)" fontFamily="monospace">
          CONTINUOUS MONITORING · REAL-TIME INSIGHTS
        </text>
      </svg>
    </div>
  );
};

// ─── Use Case Illustrations ──────────────────────────────────────────────────

/** 1. Ongoing Management of Production Environments — server rack with pulsing status */
const IllustrationProductionMgmt: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="pmGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    {/* Server rack frame */}
    <rect x="100" y="30" width="200" height="250" rx="8" fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.2)" strokeWidth="1.5" />
    {/* Server blades */}
    {[50, 95, 140, 185, 230].map((y, i) => (
      <g key={i}>
        <motion.rect x="115" y={y} width="170" height="35" rx="4"
          fill="rgba(56,189,248,0.06)" stroke="rgba(56,189,248,0.2)" strokeWidth="1"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
        {/* Status light */}
        <motion.circle cx="130" cy={y + 17} r="4"
          fill="rgba(34,197,94,0.8)"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
        {/* Activity bars */}
        {[0, 1, 2, 3].map(j => (
          <motion.rect key={j} x={155 + j * 18} y={y + 10} width="10" height="15" rx="2"
            fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.3)" strokeWidth="0.5"
            animate={{ height: [8, 15, 8], y: [y + 14, y + 10, y + 14] }}
            transition={{ duration: 2 + j * 0.3, repeat: Infinity, delay: i * 0.15 + j * 0.1 }}
          />
        ))}
        {/* Label */}
        <text x="260" y={y + 21} textAnchor="end" fontSize="5.5" fill="rgba(56,189,248,0.5)" fontFamily="monospace">
          {['PROD-01', 'PROD-02', 'PROD-03', 'STAGING', 'DR-SITE'][i]}
        </text>
        <text x="275" y={y + 21} fontSize="5.5" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">OK</text>
      </g>
    ))}
    {/* Scanning beam */}
    <motion.rect x="100" width="200" height="3" rx="1.5"
      fill="rgba(56,189,248,0.4)" filter="url(#pmGlow)"
      animate={{ y: [30, 280, 30] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">stability, security, performance</text>
  </svg>
);

/** 2. Limited In-house Expertise — team extension diagram */
const IllustrationExpertise: React.FC = () => {
  const internalTeam = [
    { x: 80, y: 110 }, { x: 140, y: 90 }, { x: 110, y: 170 },
  ];
  const externalExperts = [
    { x: 290, y: 100, label: 'CLOUD' },
    { x: 340, y: 160, label: 'SECURITY' },
    { x: 310, y: 230, label: 'OPS' },
    { x: 270, y: 190, label: 'GOVERN' },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="exGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Internal zone */}
      <motion.ellipse cx="110" cy="140" rx="80" ry="90"
        fill="rgba(160,0,181,0.04)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <text x="110" y="52" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.6)" fontFamily="monospace" fontWeight="bold">YOUR TEAM</text>
      {internalTeam.map(({ x, y }, i) => (
        <motion.circle key={i} cx={x} cy={y} r="14"
          fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.35)" strokeWidth="1.5"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* External zone */}
      <motion.ellipse cx="305" cy="170" rx="75" ry="95"
        fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      <text x="305" y="60" textAnchor="middle" fontSize="7" fill="rgba(56,189,248,0.7)" fontFamily="monospace" fontWeight="bold">ROSEBUD SUPPORT</text>
      {externalExperts.map(({ x, y, label }, i) => (
        <g key={label}>
          <motion.circle cx={x} cy={y} r="14"
            fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5"
            filter="url(#exGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="5" fill="rgba(56,189,248,0.8)" fontFamily="monospace" fontWeight="bold">{label}</text>
        </g>
      ))}
      {/* Knowledge flow */}
      {[
        { x1: 290, y1: 100, x2: 140, y2: 90 },
        { x1: 340, y1: 160, x2: 110, y2: 170 },
        { x1: 310, y1: 230, x2: 80, y2: 110 },
      ].map(({ x1, y1, x2, y2 }, i) => (
        <g key={i}>
          <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(34,197,94,0.25)" strokeWidth="1" strokeDasharray="4 6"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
          />
          <motion.circle r="3" fill="rgba(34,197,94,0.8)" filter="url(#exGlow)"
            animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.9, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeInOut' }}
          />
        </g>
      ))}
      <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">expert support without the overhead</text>
    </svg>
  );
};

/** 3. Security & Compliance Over Time — timeline with shield checkpoints */
const IllustrationSecurityCompliance: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="scGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    {/* Timeline axis */}
    <line x1="40" y1="160" x2="370" y2="160" stroke="rgba(160,0,181,0.2)" strokeWidth="1.5" />
    {/* Monthly markers */}
    {[60, 120, 180, 240, 300, 360].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="155" x2={x} y2="165" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
        <text x={x} y="178" textAnchor="middle" fontSize="5.5" fill="rgba(160,0,181,0.4)" fontFamily="monospace">
          {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'][i]}
        </text>
      </g>
    ))}
    {/* Shield checkpoints */}
    {[
      { x: 60, status: 'ok', label: 'AUDIT' },
      { x: 140, status: 'ok', label: 'PATCH' },
      { x: 220, status: 'warn', label: 'REVIEW' },
      { x: 300, status: 'ok', label: 'COMPLY' },
    ].map(({ x, status, label }, i) => (
      <g key={label}>
        {/* Shield shape */}
        <motion.path
          d={`M ${x} ${130} L ${x + 14} ${138} L ${x + 14} ${152} Q ${x + 14} ${162} ${x} ${168} Q ${x - 14} ${162} ${x - 14} ${152} L ${x - 14} ${138} Z`}
          fill={status === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(251,191,36,0.12)'}
          stroke={status === 'ok' ? 'rgba(34,197,94,0.6)' : 'rgba(251,191,36,0.6)'}
          strokeWidth="1.5"
          filter="url(#scGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        />
        <text x={x} y={153} textAnchor="middle" fontSize="7"
          fill={status === 'ok' ? 'rgba(34,197,94,0.9)' : 'rgba(251,191,36,0.9)'}
          fontFamily="monospace" fontWeight="bold">
          {status === 'ok' ? '✓' : '!'}
        </text>
        <text x={x} y="118" textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.6)" fontFamily="monospace" fontWeight="bold">{label}</text>
        {/* Pulse */}
        <motion.circle cx={x} cy="150" r="16"
          stroke={status === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'}
          strokeWidth="1" fill="none"
          animate={{ r: [16, 28, 36], opacity: [0.4, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
        />
      </g>
    ))}
    {/* Compliance score rising */}
    <motion.path
      d="M 50 240 L 100 230 L 150 225 L 200 215 L 250 222 L 300 205 L 350 195"
      stroke="rgba(34,197,94,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="370" y="198" fontSize="6" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">↑</text>
    <text x="200" y="260" textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.4)" fontFamily="monospace">COMPLIANCE SCORE TREND</text>
    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">policies aligned with best practices</text>
  </svg>
);

/** 4. Continuous Optimisation — iterative improvement spiral */
const IllustrationOptimisation: React.FC = () => {
  const spiralPoints = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i / 60) * Math.PI * 4;
    const r = 20 + i * 1.8;
    return { x: 200 + r * Math.cos(angle), y: 160 + r * Math.sin(angle) * 0.7 };
  });
  const spiralPath = spiralPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="opGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="spiralGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(160,0,181,0.6)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0.8)" />
        </linearGradient>
      </defs>
      {/* Spiral path */}
      <motion.path d={spiralPath}
        stroke="url(#spiralGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Improvement milestones along spiral */}
      {[
        { idx: 10, label: 'REVIEW', color: 'rgba(160,0,181,0.8)' },
        { idx: 25, label: 'REFINE', color: 'rgba(56,189,248,0.8)' },
        { idx: 40, label: 'IMPROVE', color: 'rgba(34,197,94,0.8)' },
        { idx: 55, label: 'OPTIMISE', color: 'rgba(34,197,94,0.9)' },
      ].map(({ idx, label, color }, i) => {
        const p = spiralPoints[idx];
        return (
          <g key={label}>
            <motion.circle cx={p.x} cy={p.y} r="16"
              fill={color.replace(/[\d.]+\)/, '0.1)')} stroke={color} strokeWidth="1.5"
              filter="url(#opGlow)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="5.5" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
          </g>
        );
      })}
      {/* Travelling particle */}
      <motion.circle r="4" fill="rgba(56,189,248,0.9)" filter="url(#opGlow)"
        animate={{
          cx: spiralPoints.filter((_, i) => i % 5 === 0).map(p => p.x),
          cy: spiralPoints.filter((_, i) => i % 5 === 0).map(p => p.y),
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Center label */}
      <text x="200" y="160" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace" fontWeight="bold">START</text>
      <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.55)" fontFamily="monospace" fontWeight="bold">cost, performance, and structure</text>
    </svg>
  );
};

/** 5. Post-project Support & Ownership — handoff with continuous loop */
const IllustrationPostProject: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="ppGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    {/* Project phase (left) */}
    <motion.rect x="30" y="100" width="120" height="120" rx="12"
      fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.3)" strokeWidth="1.5"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="90" y="135" textAnchor="middle" fontSize="8" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">PROJECT</text>
    <text x="90" y="150" textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.5)" fontFamily="monospace">DELIVERY</text>
    {/* Checkmarks inside project */}
    {['Design', 'Build', 'Deploy'].map((step, i) => (
      <g key={step}>
        <text x="70" y={170 + i * 14} fontSize="5.5" fill="rgba(160,0,181,0.5)" fontFamily="monospace">{step}</text>
        <text x="115" y={170 + i * 14} fontSize="6" fill="rgba(34,197,94,0.7)" fontFamily="monospace">✓</text>
      </g>
    ))}

    {/* Handoff arrow */}
    <motion.path d="M 155 160 C 190 160, 190 130, 210 130 L 240 130"
      stroke="rgba(56,189,248,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"
      strokeDasharray="6 6"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    <text x="198" y="120" textAnchor="middle" fontSize="6" fill="rgba(56,189,248,0.6)" fontFamily="monospace" fontWeight="bold">HANDOFF</text>

    {/* Managed support phase (right) — circular loop */}
    <motion.circle cx="310" cy="160" r="70"
      fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5"
      strokeDasharray="8 8"
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
    />
    <text x="310" y="155" textAnchor="middle" fontSize="8" fill="rgba(56,189,248,0.7)" fontFamily="monospace" fontWeight="bold">MANAGED</text>
    <text x="310" y="170" textAnchor="middle" fontSize="6" fill="rgba(56,189,248,0.5)" fontFamily="monospace">SUPPORT</text>

    {/* Rotating dot around managed circle */}
    <motion.circle r="4" fill="rgba(34,197,94,0.9)" filter="url(#ppGlow)"
      animate={{
        cx: [380, 310, 240, 310, 380],
        cy: [160, 90, 160, 230, 160],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
    />

    {/* Loop labels */}
    {[
      { angle: 0, label: 'MONITOR' },
      { angle: 90, label: 'IMPROVE' },
      { angle: 180, label: 'SUPPORT' },
      { angle: 270, label: 'SECURE' },
    ].map(({ angle, label }, _i) => {
      const rad = (angle - 90) * (Math.PI / 180);
      const x = 310 + 55 * Math.cos(rad);
      const y = 160 + 55 * Math.sin(rad);
      return (
        <text key={label} x={x} y={y + 3} textAnchor="middle" fontSize="5" fill="rgba(56,189,248,0.5)" fontFamily="monospace" fontWeight="bold">
          {label}
        </text>
      );
    })}

    <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">from implementation to ongoing care</text>
  </svg>
);

/** 6. Incident Response — alert cascade with resolution */
const IllustrationIncidentResponse: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="irGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    {/* Alert source */}
    <motion.circle cx="60" cy="160" r="28"
      fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.6)" strokeWidth="2"
      filter="url(#irGlow)"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <text x="60" y="157" textAnchor="middle" fontSize="14" fill="rgba(239,68,68,0.9)" fontFamily="monospace" fontWeight="bold">!</text>
    <text x="60" y="172" textAnchor="middle" fontSize="5" fill="rgba(239,68,68,0.7)" fontFamily="monospace">ALERT</text>
    {/* Pulsing danger rings */}
    {[0, 1].map(i => (
      <motion.circle key={i} cx="60" cy="160" r="28"
        stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" fill="none"
        animate={{ r: [28, 45, 60], opacity: [0.5, 0.15, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
      />
    ))}

    {/* Response pipeline */}
    {[
      { x: 145, label: 'DETECT', color: 'rgba(251,191,36,0.8)' },
      { x: 215, label: 'DIAGNOSE', color: 'rgba(56,189,248,0.8)' },
      { x: 285, label: 'RESOLVE', color: 'rgba(34,197,94,0.8)' },
      { x: 355, label: 'VERIFY', color: 'rgba(34,197,94,0.9)' },
    ].map(({ x, label, color }, i) => (
      <g key={label}>
        {/* Connection line */}
        <motion.line x1={i === 0 ? 88 : x - 40} y1="160" x2={x - 20} y2="160"
          stroke={color} strokeWidth="1.5" strokeDasharray="4 6"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
        {/* Node */}
        <motion.rect x={x - 28} y="138" width="56" height="44" rx="8"
          fill={color.replace(/[\d.]+\)/, '0.1)')} stroke={color} strokeWidth="1.5"
          filter="url(#irGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
        />
        <text x={x} y="164" textAnchor="middle" fontSize="6.5" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
      </g>
    ))}

    {/* Travelling incident particle */}
    <motion.circle r="4" fill="rgba(251,191,36,0.9)" filter="url(#irGlow)"
      animate={{
        cx: [60, 145, 215, 285, 355],
        cy: [160, 160, 160, 160, 160],
        fill: ['rgba(239,68,68,0.9)', 'rgba(251,191,36,0.9)', 'rgba(56,189,248,0.9)', 'rgba(34,197,94,0.9)', 'rgba(34,197,94,0.9)'],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Resolution checkmark */}
    <motion.g
      animate={{ opacity: [0, 0, 1, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay: 3, times: [0, 0.1, 0.3, 0.8, 1] }}
    >
      <circle cx="355" cy="110" r="12" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" />
      <text x="355" y="114" textAnchor="middle" fontSize="10" fill="rgba(34,197,94,0.9)" fontFamily="monospace" fontWeight="bold">✓</text>
    </motion.g>

    {/* MTTR label */}
    <text x="200" y="220" textAnchor="middle" fontSize="6" fill="rgba(56,189,248,0.4)" fontFamily="monospace">
      MEAN TIME TO RESOLUTION
    </text>
    <motion.text x="200" y="238" textAnchor="middle" fontSize="12" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      &lt; 15 min
    </motion.text>

    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(251,191,36,0.55)" fontFamily="monospace" fontWeight="bold">identify, investigate, resolve</text>
  </svg>
);

const useCaseIllustrations = [
  IllustrationProductionMgmt,
  IllustrationExpertise,
  IllustrationSecurityCompliance,
  IllustrationOptimisation,
  IllustrationPostProject,
  IllustrationIncidentResponse,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'monitoring',
    title: 'Proactive Monitoring & Alerting',
    description:
      'Continuous monitoring of your Azure environment with intelligent alerting to detect and address issues before they impact your business.',
  },
  {
    icon: 'shield',
    title: 'Security & Compliance Management',
    description:
      'Ongoing management of your security posture, ensuring configurations, policies, and controls remain aligned with industry standards and best practices.',
  },
  {
    icon: 'policy',
    title: 'Azure Policy & Governance Maintenance',
    description:
      'Regular review and maintenance of Azure Policy assignments, management groups, and governance structures to enforce standards across your environment.',
  },
  {
    icon: 'savings',
    title: 'Cost & Performance Optimisation',
    description:
      'Continuous analysis of resource utilisation, cost trends, and performance metrics to identify savings and improvement opportunities.',
  },
  {
    icon: 'support_agent',
    title: 'Incident Support & Troubleshooting',
    description:
      'Responsive support for issue identification, investigation, and resolution — minimising disruption and restoring normal operations quickly.',
  },
  {
    icon: 'trending_up',
    title: 'Continuous Improvement Recommendations',
    description:
      'Regular reviews and proactive recommendations to evolve your environment in line with emerging best practices and your changing business needs.',
  },
];

const useCases = [
  {
    icon: 'dns',
    title: 'Ongoing Management of Production Environments',
    description:
      'Maintain stability, security, and performance across live Azure workloads.',
  },
  {
    icon: 'group_add',
    title: 'Limited In-house Cloud Expertise',
    description:
      'Provide access to experienced support without the need to build a full internal team.',
  },
  {
    icon: 'verified_user',
    title: 'Maintaining Security & Compliance Over Time',
    description:
      'Ensure policies, controls, and configurations remain aligned with best practices.',
  },
  {
    icon: 'autorenew',
    title: 'Continuous Optimisation & Improvement',
    description:
      'Regularly review and refine your environment to improve cost, performance, and structure.',
  },
  {
    icon: 'handshake',
    title: 'Post-project Support & Ownership',
    description:
      'Transition from implementation into ongoing management and enhancement.',
  },
  {
    icon: 'emergency',
    title: 'Incident Response & Issue Resolution',
    description:
      'Quickly identify, investigate, and resolve issues to minimise disruption.',
  },
];

const benefits = [
  {
    icon: 'security',
    title: 'Always Secure & Compliant',
    description: 'Your environment is continuously monitored and maintained to meet security standards and compliance requirements.',
  },
  {
    icon: 'speed',
    title: 'Optimised Performance & Cost',
    description: 'Regular reviews ensure your cloud runs efficiently, with waste eliminated and performance maximised.',
  },
  {
    icon: 'groups',
    title: 'Free Your Team to Focus',
    description: 'With platform health taken care of, your teams can concentrate on delivering business value.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface ManagedCloudPageProps {
  readonly className?: string;
}

export const ManagedCloudPage: React.FC<ManagedCloudPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.managedCloud}
        schema={[
          serviceSchema({
            name: 'Managed Cloud & Security Support',
            description: pageMeta.managedCloud.description,
            path: pageMeta.managedCloud.path,
            serviceType: 'Managed Cloud Services',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Managed Cloud', path: pageMeta.managedCloud.path },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-5%] right-[-8%] w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(160,0,181,0.06) 40%, transparent 70%)' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-8%] left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Dot-matrix background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(rgba(56,189,248,1) 1px, transparent 1px)',
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
                  Managed Services
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
                  Managed Cloud &amp;
                </motion.span>
                <motion.span
                  className="block text-gradient-primary"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  Security Support
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62 }}
              >
                Ongoing support to keep your Azure environment secure, compliant, and optimised.
              </motion.p>
            </div>

            {/* Right: Health Monitor Graphic */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[480px] lg:max-w-[520px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <ClientOnly><CloudHealthMonitorGraphic /></ClientOnly>
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
                Continuous Cloud{' '}
                <span className="text-gradient-primary">Management</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We provide continuous management and support for your cloud environment, ensuring
                it remains aligned with best practices while adapting to your evolving business needs.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                From proactive monitoring and security management to cost optimisation and incident
                response — we take ownership of your platform's ongoing health so your team can focus
                on what matters most.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src={`${import.meta.env.BASE_URL}service-managed-cloud.webp`}
                  alt="Managed Cloud & Security Support"
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

            {/* Platform Health Graphic */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <ClientOnly><PlatformHealthMatrix /></ClientOnly>
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
                  Focus on Business,{' '}
                  <span className="text-gradient-primary">We Handle the Platform</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Managing a cloud environment requires ongoing attention to maintain performance,
                  security, and cost efficiency.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  We take ownership of your platform's ongoing health, ensuring it remains secure,
                  optimised, and aligned with best practices. This allows your team to focus on
                  business priorities while your cloud environment is continuously maintained and improved.
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
              Where managed cloud and security support delivers the greatest impact.
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
          style={{ background: 'rgba(56, 189, 248, 0.10)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.08)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              READY FOR ONGOING
              <br />
              <span className="text-gradient-primary">CLOUD SUPPORT?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Speak with our team to discuss how managed cloud and security support can keep your environment secure, optimised, and running at its best.
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

    </main>
  );
};

export default ManagedCloudPage;
