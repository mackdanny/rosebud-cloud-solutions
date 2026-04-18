import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
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

// ─── Security Radar Hero Graphic ──────────────────────────────────────────────

const SecurityRadarGraphic: React.FC = () => {
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

  const outerNodes = [0, 72, 144, 216, 288].map((deg) => ({
    x: 260 + 215 * Math.cos(toRad(deg)),
    y: 260 + 215 * Math.sin(toRad(deg)),
  }));

  const midNodes = [36, 108, 180, 252, 324].map((deg) => ({
    x: 260 + 140 * Math.cos(toRad(deg)),
    y: 260 + 140 * Math.sin(toRad(deg)),
  }));

  // Sweep sector (60° arc)
  const sweepEndX = 260 + 215 * Math.cos(toRad(60));
  const sweepEndY = 260 + 215 * Math.sin(toRad(60));

  return (
    <div className="relative w-full max-w-[520px] aspect-square">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(160,0,181,0.18) 0%, transparent 68%)' }}
      />
      <svg viewBox="0 0 520 520" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="secSweepGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 260) scale(215)">
            <stop offset="0%" stopColor="rgba(160,0,181,0.55)" />
            <stop offset="100%" stopColor="rgba(160,0,181,0)" />
          </radialGradient>
          <filter id="secNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="secCenterGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="secThreatGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Concentric rings */}
        <circle cx="260" cy="260" r="215" stroke="rgba(160,0,181,0.18)" strokeWidth="1" strokeDasharray="3 10" />
        <circle cx="260" cy="260" r="175" stroke="rgba(160,0,181,0.12)" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="260" cy="260" r="140" stroke="rgba(160,0,181,0.16)" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="260" cy="260" r="95" stroke="rgba(160,0,181,0.14)" strokeWidth="1" />
        <circle cx="260" cy="260" r="50" stroke="rgba(160,0,181,0.22)" strokeWidth="1.5" />

        {/* Axis lines */}
        <line x1="260" y1="30" x2="260" y2="490" stroke="rgba(160,0,181,0.07)" strokeWidth="1" strokeDasharray="4 14" />
        <line x1="30" y1="260" x2="490" y2="260" stroke="rgba(160,0,181,0.07)" strokeWidth="1" strokeDasharray="4 14" />
        <line x1="80" y1="80" x2="440" y2="440" stroke="rgba(160,0,181,0.04)" strokeWidth="1" strokeDasharray="3 18" />
        <line x1="440" y1="80" x2="80" y2="440" stroke="rgba(160,0,181,0.04)" strokeWidth="1" strokeDasharray="3 18" />

        {/* Spoke lines from center */}
        {outerNodes.map((node, i) => (
          <line key={`spoke-${i}`} x1="260" y1="260" x2={node.x} y2={node.y} stroke="rgba(160,0,181,0.09)" strokeWidth="1" />
        ))}

        {/* Rotating radar sweep */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '260px 260px' }}
        >
          <path
            d={`M 260 260 L 260 45 A 215 215 0 0 1 ${sweepEndX} ${sweepEndY} Z`}
            fill="url(#secSweepGrad)"
            opacity="0.7"
          />
          {/* Leading edge */}
          <line x1="260" y1="260" x2="260" y2="45" stroke="rgba(160,0,181,0.85)" strokeWidth="1.5" />
        </motion.g>

        {/* Outer ring nodes */}
        {outerNodes.map((node, i) => (
          <motion.circle
            key={`outer-${i}`}
            cx={node.x}
            cy={node.y}
            r={i === 2 ? 7 : 5}
            fill={i === 2 ? 'rgba(239,68,68,0.9)' : 'rgba(160,0,181,0.9)'}
            filter={i === 2 ? 'url(#secThreatGlow)' : 'url(#secNodeGlow)'}
            animate={{ opacity: [0.6, 1, 0.6], r: [i === 2 ? 6 : 4, i === 2 ? 8 : 6, i === 2 ? 6 : 4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
          />
        ))}

        {/* Mid ring nodes */}
        {midNodes.map((node, i) => (
          <motion.circle
            key={`mid-${i}`}
            cx={node.x}
            cy={node.y}
            r="4"
            fill="rgba(217,70,239,0.75)"
            filter="url(#secNodeGlow)"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 + 0.8, ease: 'easeInOut' }}
          />
        ))}

        {/* Threat marker ring (outer node 2) */}
        <motion.circle
          cx={outerNodes[2].x}
          cy={outerNodes[2].y}
          r="14"
          fill="none"
          stroke="rgba(239,68,68,0.6)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${outerNodes[2].x}px ${outerNodes[2].y}px` }}
        />

        {/* Pulsing rings from center */}
        <motion.circle
          cx="260" cy="260" r="50"
          stroke="rgba(160,0,181,0.5)"
          strokeWidth="2"
          fill="none"
          animate={{ r: [50, 100, 150], opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.circle
          cx="260" cy="260" r="50"
          stroke="rgba(160,0,181,0.5)"
          strokeWidth="2"
          fill="none"
          animate={{ r: [50, 100, 150], opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 1.75 }}
        />

        {/* Central shield */}
        <motion.path
          d="M 260 230 L 286 240 L 286 262 Q 286 282 260 295 Q 234 282 234 262 L 234 240 Z"
          fill="rgba(160,0,181,0.22)"
          stroke="rgba(160,0,181,0.85)"
          strokeWidth="1.5"
          filter="url(#secCenterGlow)"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Checkmark in shield */}
        <motion.path
          d="M 251 263 L 258 271 L 271 253"
          stroke="rgba(217,70,239,1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        />

        {/* "BLOCKED" badge that appears/disappears near threat node */}
        <motion.g
          animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.8, 0.8, 1, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2, times: [0, 0.1, 0.2, 0.75, 1] }}
          style={{ transformOrigin: `${outerNodes[2].x - 30}px ${outerNodes[2].y - 24}px` }}
        >
          <rect
            x={outerNodes[2].x - 58}
            y={outerNodes[2].y - 34}
            width="56"
            height="20"
            rx="4"
            fill="rgba(160,0,181,0.9)"
          />
          <text
            x={outerNodes[2].x - 30}
            y={outerNodes[2].y - 20}
            textAnchor="middle"
            fontSize="8"
            fill="white"
            fontWeight="bold"
            fontFamily="monospace"
          >
            BLOCKED
          </text>
        </motion.g>

        {/* Corner tick marks on outer ring */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const rad = toRad(angle + 90);
          const isLong = i % 3 === 0;
          const r1 = 215 + (isLong ? 6 : 3);
          const r2 = 215;
          return (
            <line
              key={`tick-${i}`}
              x1={260 + r1 * Math.cos(rad)}
              y1={260 + r1 * Math.sin(rad)}
              x2={260 + r2 * Math.cos(rad)}
              y2={260 + r2 * Math.sin(rad)}
              stroke={`rgba(160,0,181,${isLong ? 0.4 : 0.15})`}
              strokeWidth={isLong ? 1.5 : 1}
            />
          );
        })}
      </svg>
    </div>
  );
};

// ─── Security Dashboard Graphic (Overview) ────────────────────────────────────

const SecurityDashboardGraphic: React.FC = () => (
  <div className="w-full h-[460px] bg-surface-container rounded-xl border border-outline/30 p-6 flex flex-col gap-4 overflow-hidden relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
          Microsoft Defender for Cloud
        </div>
        <div className="font-headline text-sm font-bold">Security Posture Overview</div>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] text-primary font-label">Live</span>
      </div>
    </div>

    {/* Secure Score */}
    <div className="flex items-center gap-5 bg-surface p-4 rounded-xl border border-outline/20">
      <div className="relative w-[72px] h-[72px] shrink-0">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(160,0,181,0.1)" strokeWidth="7" />
          <motion.circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke="rgba(160,0,181,0.9)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={String(2 * Math.PI * 30)}
            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.87) }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-lg font-bold leading-none">87</span>
          <span className="text-[8px] text-on-surface-variant leading-none mt-0.5">/ 100</span>
        </div>
      </div>
      <div>
        <div className="font-headline font-bold text-sm mb-1">Secure Score</div>
        <div className="text-[11px] text-on-surface-variant">87% of maximum score achieved</div>
        <div className="text-[10px] text-primary mt-1.5 font-label font-bold">↑ 12 pts this month</div>
      </div>
    </div>

    {/* Compliance bars */}
    {[
      { label: 'Azure Policy Compliance', value: 94 },
      { label: 'CIS Benchmark Alignment', value: 88 },
      { label: 'Identity & MFA Coverage', value: 96 },
      { label: 'Threat Protection Active', value: 100 },
    ].map(({ label, value }, i) => (
      <div key={label} className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-on-surface-variant font-label">{label}</span>
          <span className="text-[11px] font-bold">{value}%</span>
        </div>
        <div className="h-[5px] bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `rgba(160,0,181,${0.9 - i * 0.1})` }}
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
        { icon: 'security', label: 'Defender', status: 'Active' },
        { icon: 'manage_search', label: 'Sentinel', status: 'Active' },
        { icon: 'policy', label: 'Policies', status: '47 Applied' },
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

// ─── Threat Network Graphic (Business Impact) ─────────────────────────────────

const ThreatNetworkGraphic: React.FC = () => {
  type NodeType = 'hub' | 'secure' | 'threat';
  const nodes: { id: string; x: number; y: number; r: number; type: NodeType }[] = [
    { id: 'hub',  x: 250, y: 250, r: 28, type: 'hub' },
    { id: 'n1',  x: 105, y: 118, r: 14, type: 'secure' },
    { id: 'n2',  x: 250, y: 68,  r: 14, type: 'secure' },
    { id: 'n3',  x: 398, y: 118, r: 14, type: 'threat' },
    { id: 'n4',  x: 435, y: 275, r: 14, type: 'secure' },
    { id: 'n5',  x: 375, y: 415, r: 14, type: 'secure' },
    { id: 'n6',  x: 125, y: 415, r: 14, type: 'threat' },
    { id: 'n7',  x:  68, y: 275, r: 14, type: 'secure' },
  ];

  const edges = [
    ['hub','n1'], ['hub','n2'], ['hub','n3'], ['hub','n4'],
    ['hub','n5'], ['hub','n6'], ['hub','n7'],
    ['n1','n2'], ['n2','n3'], ['n4','n5'],
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="relative w-full h-[500px]">
      <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
        <defs>
          <filter id="tnNodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="tnHubGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const na = getNode(a);
          const nb = getNode(b);
          const isThreat = na.type === 'threat' || nb.type === 'threat';
          return (
            <motion.line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isThreat ? 'rgba(239,68,68,0.45)' : 'rgba(160,0,181,0.28)'}
              strokeWidth={isThreat ? 1.5 : 1}
              strokeDasharray={isThreat ? '5 5' : undefined}
              animate={{ opacity: isThreat ? [0.4, 0.9, 0.4] : [0.28, 0.55, 0.28] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
            />
          );
        })}

        {/* Data-flow particles (secure edges only) */}
        {edges
          .filter(([a, b]) => getNode(a).type !== 'threat' && getNode(b).type !== 'threat')
          .map(([a, b], i) => {
            const na = getNode(a);
            const nb = getNode(b);
            return (
              <motion.circle
                key={`p-${i}`}
                r="2.5"
                fill="rgba(160,0,181,0.9)"
                animate={{ cx: [na.x, nb.x, na.x], cy: [na.y, nb.y, na.y], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.55, ease: 'easeInOut' }}
              />
            );
          })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {node.type === 'threat' && (
              <motion.circle
                cx={node.x} cy={node.y} r={node.r + 9}
                fill="rgba(239,68,68,0.13)"
                animate={{ r: [node.r + 7, node.r + 16, node.r + 7], opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            {node.type === 'hub' && (
              <motion.circle
                cx={node.x} cy={node.y} r={node.r}
                fill="none"
                stroke="rgba(160,0,181,0.45)"
                strokeWidth="2"
                animate={{ r: [node.r, node.r + 28, node.r + 52], opacity: [0.7, 0.3, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              />
            )}
            <circle
              cx={node.x} cy={node.y} r={node.r}
              fill={
                node.type === 'hub' ? 'rgba(160,0,181,0.22)'
                  : node.type === 'threat' ? 'rgba(239,68,68,0.18)'
                  : 'rgba(160,0,181,0.1)'
              }
              stroke={
                node.type === 'hub' ? 'rgba(160,0,181,0.9)'
                  : node.type === 'threat' ? 'rgba(239,68,68,0.85)'
                  : 'rgba(160,0,181,0.5)'
              }
              strokeWidth={node.type === 'hub' ? 2 : 1.5}
              filter={node.type === 'threat' ? 'url(#tnNodeGlow)' : node.type === 'hub' ? 'url(#tnHubGlow)' : undefined}
            />
          </g>
        ))}

        {/* Hub label */}
        <text x="250" y="246" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.9)" fontWeight="bold">SECURED</text>
        <text x="250" y="258" textAnchor="middle" fontSize="6.5" fill="rgba(160,0,181,0.6)">Hub</text>

        {/* Threat labels */}
        <text x={getNode('n3').x} y={getNode('n3').y - 24} textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.9)">THREAT</text>
        <text x={getNode('n6').x} y={getNode('n6').y + 28} textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.9)">THREAT</text>

        {/* Blocked badge */}
        <motion.g
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1.5, times: [0, 0.08, 0.18, 0.72, 1] }}
        >
          <rect x={getNode('n3').x - 30} y={getNode('n3').y + 24} width="60" height="18" rx="4" fill="rgba(160,0,181,0.9)" />
          <text x={getNode('n3').x} y={getNode('n3').y + 37} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="monospace">
            BLOCKED
          </text>
        </motion.g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
            <span className="text-[10px] text-on-surface-variant font-label">Secured</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="text-[10px] text-on-surface-variant font-label">Threat Detected</span>
          </div>
        </div>
        <span className="text-[10px] text-primary font-label">Real-time monitoring</span>
      </div>
    </div>
  );
};

// ─── Use Case Card Illustrations ─────────────────────────────────────────────

/** 1. Security Posture Assessments — horizontal scan beam sweeping a grid of tiles */
const IllustrationPosture: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(160,0,181,0)" />
        <stop offset="50%" stopColor="rgba(160,0,181,0.6)" />
        <stop offset="100%" stopColor="rgba(160,0,181,0)" />
      </linearGradient>
      <filter id="tileGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Grid of tiles */}
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 8 }).map((_, col) => {
        const x = 28 + col * 44;
        const y = 28 + row * 52;
        const isRisk = (row === 1 && col === 3) || (row === 3 && col === 5) || (row === 2 && col === 1);
        return (
          <motion.rect
            key={`${row}-${col}`}
            x={x} y={y} width="36" height="42" rx="4"
            fill={isRisk ? 'rgba(239,68,68,0.18)' : 'rgba(160,0,181,0.06)'}
            stroke={isRisk ? 'rgba(239,68,68,0.55)' : 'rgba(160,0,181,0.18)'}
            strokeWidth="1"
            animate={{ opacity: isRisk ? [0.6, 1, 0.6] : [0.5, 0.8, 0.5] }}
            transition={{ duration: isRisk ? 1.4 : 2.2, repeat: Infinity, delay: (row + col) * 0.08 }}
          />
        );
      })
    )}
    {/* Risk tile icons */}
    {[{ cx: 28 + 3 * 44 + 18, cy: 28 + 1 * 52 + 21 }, { cx: 28 + 5 * 44 + 18, cy: 28 + 3 * 52 + 21 }, { cx: 28 + 1 * 44 + 18, cy: 28 + 2 * 52 + 21 }].map((p, i) => (
      <motion.text key={i} x={p.cx} y={p.cy + 5} textAnchor="middle" fontSize="14" fill="rgba(239,68,68,0.85)"
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}>!</motion.text>
    ))}
    {/* Scan line */}
    <motion.rect
      x="20" width="360" height="4"
      fill="url(#scanGrad)"
      animate={{ y: [20, 300, 20] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
    />
    {/* Scan line glow edge */}
    <motion.line
      x1="20" x2="380" stroke="rgba(160,0,181,0.9)" strokeWidth="1.5"
      animate={{ y1: [22, 302, 22], y2: [22, 302, 22] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
    />
    {/* Corner brackets */}
    {[{ x: 18, y: 18 }, { x: 382, y: 18 }, { x: 18, y: 302 }, { x: 382, y: 302 }].map(({ x, y }, i) => {
      const dx = i % 2 === 0 ? 1 : -1;
      const dy = i < 2 ? 1 : -1;
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={x + dx * 18} y2={y} stroke="rgba(160,0,181,0.7)" strokeWidth="2" />
          <line x1={x} y1={y} x2={x} y2={y + dy * 18} stroke="rgba(160,0,181,0.7)" strokeWidth="2" />
        </g>
      );
    })}
  </svg>
);

/** 2. Compliance Readiness — glowing checklist being validated */
const IllustrationCompliance: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="checkGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Background document */}
    <rect x="90" y="20" width="220" height="280" rx="10" fill="rgba(160,0,181,0.05)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" />
    {/* Header bar */}
    <rect x="90" y="20" width="220" height="36" rx="10" fill="rgba(160,0,181,0.12)" />
    <rect x="90" y="46" width="220" height="10" fill="rgba(160,0,181,0.12)" />
    <text x="200" y="44" textAnchor="middle" fontSize="9" fill="rgba(160,0,181,0.9)" fontWeight="bold" fontFamily="monospace">CIS BENCHMARK CONTROLS</text>
    {/* Checklist rows */}
    {[
      { label: 'Identity & Access Mgmt', delay: 0.3 },
      { label: 'Logging & Monitoring', delay: 0.8 },
      { label: 'Network Security', delay: 1.4 },
      { label: 'Data Protection', delay: 2.0 },
      { label: 'Incident Response', delay: 2.6 },
    ].map(({ label, delay }, i) => {
      const y = 78 + i * 44;
      return (
        <g key={i}>
          {/* Row bg */}
          <rect x="106" y={y} width="188" height="32" rx="4" fill="rgba(160,0,181,0.04)" stroke="rgba(160,0,181,0.1)" strokeWidth="1" />
          {/* Checkbox */}
          <rect x="114" y={y + 8} width="16" height="16" rx="3" fill="rgba(160,0,181,0.12)" stroke="rgba(160,0,181,0.4)" strokeWidth="1" />
          {/* Animated checkmark */}
          <motion.path
            d={`M ${114 + 3} ${y + 16} L ${114 + 7} ${y + 20} L ${114 + 13} ${y + 11}`}
            stroke="rgba(160,0,181,1)"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
            filter="url(#checkGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut', repeat: Infinity, repeatDelay: 5 }}
          />
          {/* Label */}
          <text x="138" y={y + 20} fontSize="8.5" fill="rgba(255,255,255,0.55)" fontFamily="monospace">{label}</text>
          {/* Status dot */}
          <motion.circle cx="278" cy={y + 16} r="4" fill="rgba(160,0,181,0.9)"
            animate={{ opacity: [0, 1], scale: [0.5, 1] }}
            transition={{ duration: 0.3, delay: delay + 0.4, ease: 'easeOut', repeat: Infinity, repeatDelay: 5 }}
          />
        </g>
      );
    })}
    {/* Progress bar at bottom */}
    <rect x="106" y="308" width="188" height="6" rx="3" fill="rgba(160,0,181,0.1)" />
    <motion.rect x="106" y="308" height="6" rx="3" fill="rgba(160,0,181,0.85)"
      animate={{ width: [0, 150, 188] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
);

/** 3. Environment Hardening — concentric hexagons solidifying inward */
const IllustrationHardening: React.FC = () => {
  const hex = (cx: number, cy: number, r: number) => {
    return Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  };
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="hexGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Outer rings */}
      {[140, 108, 78, 52, 28].map((r, i) => (
        <motion.polygon
          key={r} points={hex(200, 160, r)}
          stroke={`rgba(160,0,181,${0.15 + i * 0.14})`}
          strokeWidth={i === 4 ? 2.5 : 1.5}
          fill={`rgba(160,0,181,${0.02 + i * 0.03})`}
          animate={{ opacity: [0.5 + i * 0.1, 1, 0.5 + i * 0.1] }}
          transition={{ duration: 2.5 - i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          filter={i >= 3 ? 'url(#hexGlow)' : undefined}
        />
      ))}
      {/* Rotating outer ring */}
      <motion.polygon points={hex(200, 160, 140)}
        stroke="rgba(160,0,181,0.4)" strokeWidth="1" fill="none"
        strokeDasharray="12 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '200px 160px' }}
      />
      {/* Satellite hex cells around inner ring */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const cx = 200 + 93 * Math.cos(a);
        const cy = 160 + 93 * Math.sin(a);
        return (
          <motion.polygon key={i} points={hex(cx, cy, 18)}
            stroke="rgba(160,0,181,0.35)" strokeWidth="1"
            fill="rgba(160,0,181,0.07)"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.28 }}
          />
        );
      })}
      {/* Center lock icon */}
      <rect x="188" y="145" width="24" height="20" rx="3" fill="rgba(160,0,181,0.25)" stroke="rgba(160,0,181,0.9)" strokeWidth="1.5" filter="url(#hexGlow)" />
      <path d="M193 145 v-6 a7 7 0 0 1 14 0 v6" stroke="rgba(160,0,181,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="157" r="3" fill="rgba(217,70,239,1)" />
      {/* Scan ring */}
      <motion.circle cx="200" cy="160" r="28"
        stroke="rgba(160,0,181,0.6)" strokeWidth="1.5" fill="none"
        animate={{ r: [28, 80, 140], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
    </svg>
  );
};

/** 4. Identity & Access Control — fingerprint arcs + scan beam */
const IllustrationIdentity: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <clipPath id="fpClip"><rect x="100" y="40" width="200" height="240" /></clipPath>
      <filter id="fpGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="fpScan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(160,0,181,0)" />
        <stop offset="40%" stopColor="rgba(160,0,181,0.7)" />
        <stop offset="60%" stopColor="rgba(217,70,239,0.8)" />
        <stop offset="100%" stopColor="rgba(160,0,181,0)" />
      </linearGradient>
    </defs>
    {/* Fingerprint concentric arcs */}
    {[18, 32, 46, 60, 74, 88, 100].map((r, i) => (
      <motion.path
        key={r}
        d={`M ${200 - r} 160 A ${r} ${r} 0 0 1 ${200 + r} 160`}
        stroke={`rgba(160,0,181,${0.7 - i * 0.07})`}
        strokeWidth="1.5" fill="none" strokeLinecap="round"
        clipPath="url(#fpClip)"
        filter="url(#fpGlow)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.14 }}
      />
    ))}
    {/* Lower arcs mirrored */}
    {[18, 32, 46, 60, 74, 88, 100].map((r, i) => (
      <motion.path
        key={`d${r}`}
        d={`M ${200 - r} 165 A ${r} ${r} 0 0 0 ${200 + r} 165`}
        stroke={`rgba(160,0,181,${0.65 - i * 0.07})`}
        strokeWidth="1.5" fill="none" strokeLinecap="round"
        clipPath="url(#fpClip)"
        filter="url(#fpGlow)"
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.14 + 0.3 }}
      />
    ))}
    {/* Center dot */}
    <motion.circle cx="200" cy="162" r="5" fill="rgba(217,70,239,1)" filter="url(#fpGlow)"
      animate={{ r: [4, 7, 4] }} transition={{ duration: 1.8, repeat: Infinity }} />
    {/* Scan beam sweeping down */}
    <motion.rect x="100" width="200" height="18" fill="url(#fpScan)"
      clipPath="url(#fpClip)"
      animate={{ y: [40, 270, 40] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    />
    {/* Corner brackets */}
    {[{ x: 98, y: 38 }, { x: 302, y: 38 }, { x: 98, y: 282 }, { x: 302, y: 282 }].map(({ x, y }, i) => {
      const dx = i % 2 === 0 ? 1 : -1;
      const dy = i < 2 ? 1 : -1;
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={x + dx * 16} y2={y} stroke="rgba(160,0,181,0.75)" strokeWidth="2" />
          <line x1={x} y1={y} x2={x} y2={y + dy * 16} stroke="rgba(160,0,181,0.75)" strokeWidth="2" />
        </g>
      );
    })}
    {/* "IDENTITY VERIFIED" badge */}
    <motion.g
      animate={{ opacity: [0, 0, 1, 1, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay: 1.5, times: [0, 0.1, 0.25, 0.8, 1] }}
    >
      <rect x="138" y="288" width="124" height="20" rx="4" fill="rgba(160,0,181,0.9)" />
      <text x="200" y="302" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="monospace">IDENTITY VERIFIED</text>
    </motion.g>
  </svg>
);

/** 5. Threat Detection & Monitoring — EKG waveform with threat spike */
const IllustrationThreat: React.FC = () => {
  // Normal flat waveform points
  const basePoints = '0,160 40,160 60,140 80,180 100,160 120,160 140,155 160,165 180,160';

  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="waveGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="spikeGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Grid lines */}
      {[80, 120, 160, 200, 240].map(y => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(160,0,181,0.08)" strokeWidth="1" strokeDasharray="4 12" />
      ))}
      {[80, 160, 240, 320].map(x => (
        <line key={x} x1={x} y1="40" x2={x} y2="280" stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="4 12" />
      ))}

      {/* Flat waveform segments (left & right of spike) */}
      <motion.polyline
        points={basePoints}
        stroke="rgba(160,0,181,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"
        filter="url(#waveGlow)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.polyline
        points="240,160 260,160 280,155 300,165 320,160 340,160 360,155 380,165 400,160"
        stroke="rgba(160,0,181,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"
        filter="url(#waveGlow)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Threat spike — animates in */}
      <motion.polyline
        points="180,160 200,60 220,240 240,160"
        stroke="rgba(239,68,68,0.95)" strokeWidth="2.5" fill="none" strokeLinecap="round"
        filter="url(#spikeGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1, times: [0, 0.25, 0.75, 1] }}
      />

      {/* Alert circle around spike peak */}
      <motion.circle cx="200" cy="60" r="16"
        stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" fill="none"
        strokeDasharray="5 4"
        animate={{ scale: [0.7, 1.2, 0.7], opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        style={{ transformOrigin: '200px 60px' }}
      />

      {/* "ANOMALY DETECTED" label */}
      <motion.g
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1.8, times: [0, 0.05, 0.2, 0.75, 1] }}
      >
        <rect x="144" y="26" width="120" height="18" rx="4" fill="rgba(239,68,68,0.9)" />
        <text x="204" y="39" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="monospace">ANOMALY DETECTED</text>
      </motion.g>

      {/* Scrolling scan line */}
      <motion.line y1="40" y2="280" stroke="rgba(160,0,181,0.45)" strokeWidth="1.5"
        animate={{ x1: [0, 400], x2: [0, 400] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Status chips */}
      <rect x="16" y="16" width="68" height="18" rx="4" fill="rgba(160,0,181,0.12)" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
      <text x="50" y="29" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.9)" fontFamily="monospace">SENTINEL</text>
      <motion.circle cx="18" cy="297" r="4" fill="rgba(160,0,181,0.9)"
        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x="28" y="301" fontSize="7.5" fill="rgba(255,255,255,0.4)" fontFamily="monospace">MONITORING ACTIVE</text>
    </svg>
  );
};

/** 6. Policy & Governance Enforcement — tree of policy rules propagating down */
const IllustrationPolicy: React.FC = () => {
  const nodes = [
    { id: 'root', x: 200, y: 42, label: 'ROOT POLICY' },
    { id: 'l1a', x: 100, y: 118, label: 'SUB-A' },
    { id: 'l1b', x: 200, y: 118, label: 'SUB-B' },
    { id: 'l1c', x: 300, y: 118, label: 'SUB-C' },
    { id: 'l2a', x: 56, y: 204, label: 'DENY' },
    { id: 'l2b', x: 144, y: 204, label: 'AUDIT' },
    { id: 'l2c', x: 200, y: 204, label: 'ALLOW' },
    { id: 'l2d', x: 256, y: 204, label: 'AUDIT' },
    { id: 'l2e', x: 344, y: 204, label: 'DENY' },
  ];
  const edges = [
    ['root', 'l1a'], ['root', 'l1b'], ['root', 'l1c'],
    ['l1a', 'l2a'], ['l1a', 'l2b'],
    ['l1b', 'l2c'],
    ['l1c', 'l2d'], ['l1c', 'l2e'],
  ];
  const getNode = (id: string) => nodes.find(n => n.id === id)!;
  const denyColor = 'rgba(239,68,68,0.85)';
  const allowColor = 'rgba(34,197,94,0.85)';
  const auditColor = 'rgba(160,0,181,0.85)';
  const nodeColor = (label: string) => label === 'DENY' ? denyColor : label === 'ALLOW' ? allowColor : auditColor;

  return (
    <svg viewBox="0 0 400 280" className="w-full h-full" fill="none">
      <defs>
        <filter id="polGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(160,0,181,0.5)" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const na = getNode(a);
        const nb = getNode(b);
        return (
          <motion.line key={i}
            x1={na.x} y1={na.y + 12} x2={nb.x} y2={nb.y - 12}
            stroke="rgba(160,0,181,0.3)" strokeWidth="1.2"
            markerEnd="url(#arrow)"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        );
      })}

      {/* Propagation particles */}
      {edges.map(([a, b], i) => {
        const na = getNode(a);
        const nb = getNode(b);
        return (
          <motion.circle key={`p${i}`} r="3"
            fill="rgba(160,0,181,0.9)"
            animate={{ cx: [na.x, nb.x], cy: [na.y, nb.y], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const isLeaf = node.id.startsWith('l2');
        const color = isLeaf ? nodeColor(node.label) : 'rgba(160,0,181,0.85)';
        const isRoot = node.id === 'root';
        return (
          <g key={node.id}>
            <motion.rect
              x={node.x - (isRoot ? 52 : 32)} y={node.y - 12}
              width={isRoot ? 104 : 64} height={24} rx="5"
              fill={isLeaf ? `${color.replace('0.85', '0.12')}` : 'rgba(160,0,181,0.12)'}
              stroke={color}
              strokeWidth={isRoot ? 1.8 : 1.2}
              filter={isRoot ? 'url(#polGlow)' : undefined}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: node.x * 0.003 }}
            />
            <text x={node.x} y={node.y + 5}
              textAnchor="middle" fontSize={isRoot ? 8 : 7}
              fill={color} fontWeight="bold" fontFamily="monospace"
            >{node.label}</text>
          </g>
        );
      })}

      {/* Subscription icons below */}
      {[{ x: 56, label: 'prod-001' }, { x: 144, label: 'dev-004' }, { x: 200, label: 'shared' }, { x: 256, label: 'staging' }, { x: 344, label: 'legacy' }].map(({ x, label }) => (
        <g key={label}>
          <rect x={x - 28} y="230" width="56" height="30" rx="4"
            fill="rgba(160,0,181,0.05)" stroke="rgba(160,0,181,0.15)" strokeWidth="1" />
          <text x={x} y="249" textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.35)" fontFamily="monospace">{label}</text>
        </g>
      ))}
      {/* Connecting lines to subscriptions */}
      {[[56, 'l2a'], [144, 'l2b'], [200, 'l2c'], [256, 'l2d'], [344, 'l2e']].map(([x, id]) => {
        const n = getNode(id as string);
        return <line key={id} x1={x} y1={n.y + 12} x2={x} y2={230} stroke="rgba(160,0,181,0.15)" strokeWidth="1" strokeDasharray="3 5" />;
      })}
    </svg>
  );
};

const useCaseIllustrations = [
  IllustrationPosture,
  IllustrationCompliance,
  IllustrationHardening,
  IllustrationIdentity,
  IllustrationThreat,
  IllustrationPolicy,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'policy',
    title: 'Azure Policy (CIS & ASB Aligned)',
    description:
      'Azure Policy implementation aligned to CIS benchmarks and the Azure Security Benchmark, enforcing compliance standards automatically across your environment.',
  },
  {
    icon: 'security',
    title: 'Microsoft Defender for Cloud',
    description:
      'Full configuration of Microsoft Defender for Cloud to provide continuous security posture management and advanced threat protection.',
  },
  {
    icon: 'manage_accounts',
    title: 'Identity Security',
    description:
      'MFA enforcement, conditional access policies, and least-privilege access controls protecting users, service identities, and privileged roles.',
  },
  {
    icon: 'monitor_heart',
    title: 'Threat Detection & Monitoring',
    description:
      'Microsoft Sentinel integration for real-time threat detection, alerting, and security event correlation across your Azure environment.',
  },
  {
    icon: 'assessment',
    title: 'Security Posture Assessments',
    description:
      'Structured assessments identifying gaps, misconfigurations, and risks across your environment with clear, prioritised remediation plans.',
  },
  {
    icon: 'gavel',
    title: 'Compliance & Governance Alignment',
    description:
      'Ongoing controls aligned to recognised frameworks, with governance applied consistently across subscriptions as your environment evolves.',
  },
];

const useCases = [
  {
    icon: 'troubleshoot',
    title: 'Security Posture Assessments',
    description:
      'Identify gaps, misconfigurations, and risks across your Azure environment with clear remediation actions.',
    accent: 'rgba(160,0,181,0.35)',
  },
  {
    icon: 'verified',
    title: 'Compliance Readiness & Alignment',
    description:
      'Implement and maintain controls aligned to CIS and Azure Security Benchmark requirements.',
    accent: 'rgba(130,0,160,0.35)',
  },
  {
    icon: 'lock',
    title: 'Environment Hardening',
    description:
      'Strengthen existing deployments by applying security best practices and reducing attack surface.',
    accent: 'rgba(100,0,140,0.35)',
  },
  {
    icon: 'key',
    title: 'Identity & Access Control',
    description:
      'Enforce least privilege, MFA, and conditional access to protect users and resources across your tenant.',
    accent: 'rgba(145,0,170,0.35)',
  },
  {
    icon: 'crisis_alert',
    title: 'Threat Detection & Monitoring',
    description:
      'Enable visibility and real-time alerting using Microsoft Defender for Cloud and Microsoft Sentinel.',
    accent: 'rgba(115,0,150,0.35)',
  },
  {
    icon: 'rule',
    title: 'Policy & Governance Enforcement',
    description:
      'Apply consistent security and compliance rules across subscriptions using Azure Policy.',
    accent: 'rgba(85,0,125,0.35)',
  },
];

const benefits = [
  {
    icon: 'shield',
    title: 'Reduced Breach Risk',
    description: 'Consistent policy enforcement and continuous monitoring reduces the likelihood of security incidents.',
  },
  {
    icon: 'task_alt',
    title: 'Simplified Compliance',
    description: 'Controls aligned to recognised frameworks make compliance straightforward and auditable.',
  },
  {
    icon: 'visibility',
    title: 'Continuous Visibility',
    description: 'Real-time posture monitoring ensures your platform stays protected as it evolves.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CloudSecurityPageProps {
  readonly className?: string;
}

export const CloudSecurityPage: React.FC<CloudSecurityPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.cloudSecurity}
        schema={[
          serviceSchema({
            name: 'Cloud Security & Compliance',
            description: pageMeta.cloudSecurity.description,
            path: pageMeta.cloudSecurity.path,
            serviceType: 'Cloud Security',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Cloud Security', path: pageMeta.cloudSecurity.path },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-5%] right-[-8%] w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.14) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-8%] left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Dot-matrix background pattern */}
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
                  Cloud Security
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
                  Cloud Security
                </motion.span>
                <motion.span
                  className="block text-gradient-primary"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  &amp; Compliance
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62 }}
              >
                Embed security into your cloud environment from the ground up.
                Continuous visibility, control, and protection — by design.
              </motion.p>
            </div>

            {/* Right: Radar Graphic */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[480px] lg:max-w-[520px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <SecurityRadarGraphic />
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
                Security Integrated{' '}
                <span className="text-gradient-primary">by Design</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We help organisations secure their Azure environments by aligning with Microsoft
                best practices and industry frameworks. Security is integrated directly into your
                platform — providing continuous visibility, control, and protection from day one.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Rather than bolting on security after the fact, we embed it into the foundation
                of your environment, ensuring consistent enforcement of policies and ongoing
                monitoring of risks as your platform grows.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src={`${import.meta.env.BASE_URL}service-cloud-security.png`}
                  alt="Cloud Security & Compliance"
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

            {/* Threat Network Graphic */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <ThreatNetworkGraphic />
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
                  Protected as You{' '}
                  <span className="text-gradient-primary">Scale</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Without a structured approach, cloud security becomes reactive and difficult to
                  manage — leaving your environment exposed to misconfigurations, threats, and
                  compliance failures.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  We embed security directly into your environment, ensuring consistent enforcement
                  of policies and continuous monitoring of risks. This reduces the likelihood of
                  breaches, simplifies compliance, and provides confidence that your platform is
                  protected as it evolves.
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
              Where structured cloud security makes the greatest impact.
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
                  <Illustration />
                </div>

                {/* Bottom fade so text is readable */}
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
          style={{ background: 'rgba(217, 70, 239, 0.08)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              READY TO SECURE YOUR
              <br />
              <span className="text-gradient-primary">AZURE ENVIRONMENT?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Speak with our security team to discuss your current posture and a path to continuous protection.
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

export default CloudSecurityPage;
