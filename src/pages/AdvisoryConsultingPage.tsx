import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Faq } from '../components/Faq';
import { faqs } from '../data/faqs';
import { ClientOnly } from '../components/ClientOnly';
import { pageMeta, serviceSchema, breadcrumbSchema, faqSchema } from '../data/seoMeta';
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

// ─── Architecture Blueprint Hero Graphic ─────────────────────────────────────

const ArchitectureBlueprintGraphic: React.FC = () => {
  // Node positions for an architecture constellation
  const nodes = [
    { x: 260, y: 120, label: 'STRATEGY', r: 32, primary: true },
    { x: 130, y: 200, label: 'DESIGN', r: 24 },
    { x: 390, y: 200, label: 'REVIEW', r: 24 },
    { x: 100, y: 320, label: 'MIGRATE', r: 22 },
    { x: 260, y: 300, label: 'ALIGN', r: 26 },
    { x: 420, y: 320, label: 'GOVERN', r: 22 },
    { x: 170, y: 420, label: 'SCALE', r: 20 },
    { x: 350, y: 420, label: 'SECURE', r: 20 },
  ];

  // Connections between nodes (index pairs)
  const connections = [
    [0, 1], [0, 2], [0, 4],
    [1, 3], [1, 4],
    [2, 4], [2, 5],
    [3, 6], [4, 6], [4, 7], [5, 7],
  ];

  return (
    <div className="relative w-full max-w-[520px] aspect-square">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(160,0,181,0.14) 0%, rgba(56,189,248,0.08) 45%, transparent 70%)' }}
      />
      <svg viewBox="0 0 520 520" className="w-full h-full" fill="none">
        <defs>
          <filter id="advGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="advPulse" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="advConnGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(160,0,181,0.5)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.5)" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="20" y1={40 + i * 40} x2="500" y2={40 + i * 40}
            stroke="rgba(160,0,181,0.04)" strokeWidth="1" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={40 + i * 40} y1="20" x2={40 + i * 40} y2="500"
            stroke="rgba(160,0,181,0.04)" strokeWidth="1" />
        ))}

        {/* Connections */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="url(#advConnGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* Data flow particles along connections */}
        {connections.slice(0, 6).map(([a, b], i) => {
          const dx = nodes[b].x - nodes[a].x;
          const dy = nodes[b].y - nodes[a].y;
          return (
            <motion.circle
              key={`particle-${i}`}
              r="3"
              fill="rgba(56,189,248,0.8)"
              filter="url(#advGlow)"
              animate={{
                cx: [nodes[a].x, nodes[a].x + dx * 0.5, nodes[b].x],
                cy: [nodes[a].y, nodes[a].y + dy * 0.5, nodes[b].y],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.label}>
            {/* Pulsing ring for primary */}
            {node.primary && (
              <motion.circle
                cx={node.x} cy={node.y} r={node.r}
                stroke="rgba(160,0,181,0.4)" strokeWidth="1" fill="none"
                animate={{ r: [node.r, node.r + 20, node.r + 30], opacity: [0.6, 0.15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Node circle */}
            <motion.circle
              cx={node.x} cy={node.y} r={node.r}
              fill={node.primary ? 'rgba(160,0,181,0.15)' : 'rgba(160,0,181,0.08)'}
              stroke={node.primary ? 'rgba(160,0,181,0.7)' : 'rgba(160,0,181,0.35)'}
              strokeWidth={node.primary ? 2 : 1.5}
              filter="url(#advGlow)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />

            {/* Node label */}
            <text
              x={node.x} y={node.y + 3}
              textAnchor="middle"
              fontSize={node.primary ? '8' : '6.5'}
              fill={node.primary ? 'rgba(160,0,181,0.9)' : 'rgba(160,0,181,0.7)'}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {node.label}
            </text>

            {/* Orbiting dot for primary */}
            {node.primary && (
              <motion.circle
                r="4"
                fill="rgba(56,189,248,0.8)"
                filter="url(#advPulse)"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                animate={{
                  cx: [node.x + 42, node.x, node.x - 42, node.x, node.x + 42],
                  cy: [node.y, node.y - 42, node.y, node.y + 42, node.y],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </g>
        ))}

        {/* Decision diamond overlay */}
        <motion.g
          filter="url(#advGlow)"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <path d="M 260 70 L 290 95 L 260 120 L 230 95 Z"
            fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1" strokeDasharray="3 5" />
        </motion.g>

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

        {/* Label */}
        <text x="260" y="490" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace">
          ARCHITECTURE · ADVISORY · CONSULTING
        </text>
      </svg>
    </div>
  );
};

// ─── Advisory Process Dashboard (Overview) ──────────────────────────────────

const AdvisoryProcessGraphic: React.FC = () => (
  <div className="w-full h-[460px] bg-surface-container rounded-xl border border-outline/30 p-6 flex flex-col gap-4 overflow-hidden relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
          Advisory Engagement
        </div>
        <div className="font-headline text-sm font-bold">Architecture Decision Record</div>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] text-green-400 font-label">In Progress</span>
      </div>
    </div>

    {/* Decision timeline */}
    <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-outline/20">
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
            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.72) }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-lg font-bold leading-none">72%</span>
          <span className="text-[8px] text-on-surface-variant leading-none mt-0.5">aligned</span>
        </div>
      </div>
      <div>
        <div className="font-headline font-bold text-sm mb-1">Stakeholder Alignment</div>
        <div className="text-[11px] text-on-surface-variant">12 of 16 architectural decisions validated</div>
        <div className="text-[10px] text-primary mt-1.5 font-label font-bold">4 decisions pending review</div>
      </div>
    </div>

    {/* Advisory phases */}
    {[
      { label: 'Discovery & Assessment', value: 100, color: 'rgba(34,197,94,0.9)' },
      { label: 'Architecture Design', value: 72, color: 'rgba(160,0,181,0.9)' },
      { label: 'Stakeholder Workshops', value: 55, color: 'rgba(56,189,248,0.9)' },
      { label: 'Implementation Roadmap', value: 30, color: 'rgba(251,191,36,0.9)' },
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
        { icon: 'architecture', label: 'Decisions', status: '16 ADRs' },
        { icon: 'groups', label: 'Workshops', status: '8 Sessions' },
        { icon: 'route', label: 'Initiatives', status: '5 Workstreams' },
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

// ─── Strategic Decision Matrix (Business Impact) ────────────────────────────

const DecisionMatrixGraphic: React.FC = () => {
  const decisions = [
    { label: 'Multi-Region', x: 350, y: 90, impact: 'HIGH', risk: 'LOW' },
    { label: 'Microservices', x: 280, y: 150, impact: 'HIGH', risk: 'MED' },
    { label: 'Hybrid Cloud', x: 150, y: 120, impact: 'MED', risk: 'MED' },
    { label: 'Containerise', x: 380, y: 220, impact: 'MED', risk: 'LOW' },
    { label: 'Data Platform', x: 120, y: 260, impact: 'HIGH', risk: 'HIGH' },
  ];

  return (
    <div className="relative w-full h-[460px] bg-surface-container-highest rounded-2xl border border-outline/30 overflow-hidden">
      <svg viewBox="0 0 500 460" className="w-full h-full absolute inset-0" fill="none">
        <defs>
          <filter id="dmGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="matrixFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,197,94,0.08)" />
            <stop offset="100%" stopColor="rgba(160,0,181,0.08)" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="250" y="35" textAnchor="middle" fontSize="9" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">
          STRATEGIC DECISION MATRIX
        </text>

        {/* Quadrant background */}
        <rect x="60" y="55" width="400" height="350" rx="8" fill="url(#matrixFade)" stroke="rgba(160,0,181,0.15)" strokeWidth="1" />

        {/* Grid lines */}
        {[130, 205, 280, 355].map(y => (
          <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="4 12" />
        ))}
        {[160, 260, 360].map(x => (
          <line key={x} x1={x} y1="55" x2={x} y2="405" stroke="rgba(160,0,181,0.06)" strokeWidth="1" strokeDasharray="4 12" />
        ))}

        {/* Axis labels */}
        <text x="250" y="430" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace">
          BUSINESS IMPACT →
        </text>
        <text x="30" y="230" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace"
          transform="rotate(-90 30 230)">
          RISK LEVEL →
        </text>

        {/* Quadrant labels */}
        <text x="160" y="80" textAnchor="middle" fontSize="7" fill="rgba(251,191,36,0.5)" fontFamily="monospace">HIGH RISK / LOW IMPACT</text>
        <text x="360" y="80" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace">HIGH RISK / HIGH IMPACT</text>
        <text x="160" y="390" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.4)" fontFamily="monospace">LOW RISK / LOW IMPACT</text>
        <text x="360" y="390" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.6)" fontFamily="monospace">LOW RISK / HIGH IMPACT</text>

        {/* Green zone highlight (low risk / high impact) */}
        <motion.rect x="260" y="280" width="200" height="125" rx="6"
          fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" strokeDasharray="6 6"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <text x="360" y="375" textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.4)" fontFamily="monospace" fontWeight="bold">
          RECOMMENDED
        </text>

        {/* Decision nodes */}
        {decisions.map(({ label, x, y, impact, risk }, i) => {
          const isGreen = impact === 'HIGH' && risk === 'LOW';
          const color = isGreen ? 'rgba(34,197,94,0.9)' : risk === 'HIGH' ? 'rgba(251,191,36,0.8)' : 'rgba(160,0,181,0.8)';
          const bgColor = isGreen ? 'rgba(34,197,94,0.12)' : risk === 'HIGH' ? 'rgba(251,191,36,0.08)' : 'rgba(160,0,181,0.1)';
          return (
            <g key={label}>
              {/* Connection line to center */}
              <motion.line x1="260" y1="230" x2={x} y2={y}
                stroke={color.replace(/[\d.]+\)/, '0.15)')} strokeWidth="1" strokeDasharray="3 6"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              />
              {/* Node */}
              <motion.circle cx={x} cy={y} r="28"
                fill={bgColor} stroke={color} strokeWidth="1.5"
                filter="url(#dmGlow)"
                animate={{ opacity: [0.5, 1, 0.5], r: [26, 28, 26] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
              <text x={x} y={y - 3} textAnchor="middle" fontSize="7" fill={color} fontFamily="monospace" fontWeight="bold">
                {label}
              </text>
              <text x={x} y={y + 9} textAnchor="middle" fontSize="5.5" fill={color.replace(/[\d.]+\)/, '0.6)')} fontFamily="monospace">
                {impact}/{risk}
              </text>
            </g>
          );
        })}

        {/* Centre advisory node */}
        <motion.circle cx="260" cy="230" r="18"
          fill="rgba(160,0,181,0.12)" stroke="rgba(160,0,181,0.6)" strokeWidth="2"
          filter="url(#dmGlow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="260" y="228" textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.9)" fontFamily="monospace" fontWeight="bold">ADV</text>
        <text x="260" y="237" textAnchor="middle" fontSize="5" fill="rgba(160,0,181,0.6)" fontFamily="monospace">HUB</text>

        {/* Pulsing rings from centre */}
        {[0, 1, 2].map(i => (
          <motion.circle key={i} cx="260" cy="230" r="20"
            stroke="rgba(160,0,181,0.3)" strokeWidth="1" fill="none"
            animate={{ r: [20, 80, 120], opacity: [0.5, 0.1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
          />
        ))}
      </svg>
    </div>
  );
};

// ─── Use Case Illustrations ──────────────────────────────────────────────────

/** 1. Planning New Cloud Initiatives - roadmap with milestones */
const IllustrationNewInitiatives: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="niGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Roadmap path */}
    <motion.path
      d="M 40 260 C 100 260, 100 160, 160 160 C 220 160, 220 100, 280 100 C 340 100, 340 60, 380 60"
      stroke="rgba(160,0,181,0.5)" strokeWidth="2" fill="none" strokeLinecap="round"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Milestones */}
    {[
      { x: 40, y: 260, label: 'DISCOVER', color: 'rgba(160,0,181,0.8)' },
      { x: 160, y: 160, label: 'DESIGN', color: 'rgba(56,189,248,0.8)' },
      { x: 280, y: 100, label: 'VALIDATE', color: 'rgba(34,197,94,0.8)' },
      { x: 380, y: 60, label: 'EXECUTE', color: 'rgba(34,197,94,0.9)' },
    ].map(({ x, y, label, color }, i) => (
      <g key={label}>
        <motion.circle cx={x} cy={y} r="18"
          fill={color.replace(/[\d.]+\)/, '0.12)')} stroke={color} strokeWidth="1.5"
          filter="url(#niGlow)"
          animate={{ opacity: [0.5, 1, 0.5], r: [16, 18, 16] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        />
        <text x={x} y={y + 3} textAnchor="middle" fontSize="6" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
        {/* Pulse ring */}
        <motion.circle cx={x} cy={y} r="18"
          stroke={color} strokeWidth="1" fill="none"
          animate={{ r: [18, 30, 38], opacity: [0.5, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        />
      </g>
    ))}
    {/* Travelling dot */}
    <motion.circle r="4" fill="rgba(56,189,248,0.9)" filter="url(#niGlow)"
      animate={{
        cx: [40, 100, 160, 220, 280, 330, 380],
        cy: [260, 210, 160, 130, 100, 80, 60],
        opacity: [0, 1, 1, 1, 1, 1, 0],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">define approach before committing</text>
  </svg>
);

/** 2. Architecture Reviews - magnifying glass scanning layers */
const IllustrationArchReview: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="arGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Architecture layers */}
    {[
      { y: 50, label: 'NETWORKING', w: 300 },
      { y: 100, label: 'COMPUTE', w: 260 },
      { y: 150, label: 'STORAGE', w: 220 },
      { y: 200, label: 'SECURITY', w: 180 },
      { y: 250, label: 'IDENTITY', w: 140 },
    ].map(({ y, label, w }, i) => {
      const x = (400 - w) / 2;
      return (
        <g key={label}>
          <motion.rect x={x} y={y} width={w} height="38" rx="6"
            fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.2)" strokeWidth="1"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          <text x="200" y={y + 23} textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.6)" fontFamily="monospace" fontWeight="bold">{label}</text>
        </g>
      );
    })}
    {/* Scanning beam */}
    <motion.rect x="50" width="300" height="4" rx="2"
      fill="rgba(56,189,248,0.5)" filter="url(#arGlow)"
      animate={{ y: [40, 280, 40] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Findings markers */}
    {[
      { x: 120, y: 70, status: 'warn' },
      { x: 280, y: 165, status: 'ok' },
      { x: 160, y: 220, status: 'warn' },
      { x: 250, y: 115, status: 'ok' },
    ].map(({ x, y, status }, i) => (
      <motion.g key={i}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 + i * 0.8, times: [0, 0.1, 0.2, 0.8, 1] }}
      >
        <circle cx={x} cy={y} r="8"
          fill={status === 'warn' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)'}
          stroke={status === 'warn' ? 'rgba(251,191,36,0.7)' : 'rgba(34,197,94,0.7)'}
          strokeWidth="1.5" />
        <text x={x} y={y + 3} textAnchor="middle" fontSize="7"
          fill={status === 'warn' ? 'rgba(251,191,36,0.9)' : 'rgba(34,197,94,0.9)'}
          fontFamily="monospace" fontWeight="bold">
          {status === 'warn' ? '!' : '✓'}
        </text>
      </motion.g>
    ))}
    <text x="200" y="305" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">identify risks and gaps</text>
  </svg>
);

/** 3. Complex Solution Design - multi-service interconnected architecture */
const IllustrationSolutionDesign: React.FC = () => {
  const services = [
    { x: 200, y: 50, label: 'API GW', color: 'rgba(56,189,248,0.8)' },
    { x: 80, y: 130, label: 'AUTH', color: 'rgba(160,0,181,0.8)' },
    { x: 320, y: 130, label: 'CDN', color: 'rgba(34,197,94,0.8)' },
    { x: 120, y: 220, label: 'APP SVC', color: 'rgba(160,0,181,0.8)' },
    { x: 280, y: 220, label: 'FUNC', color: 'rgba(56,189,248,0.8)' },
    { x: 200, y: 280, label: 'DB', color: 'rgba(34,197,94,0.8)' },
  ];
  const links = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4],[3,5],[4,5]];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="sdGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {links.map(([a, b], i) => (
        <motion.line key={i}
          x1={services[a].x} y1={services[a].y} x2={services[b].x} y2={services[b].y}
          stroke="rgba(160,0,181,0.2)" strokeWidth="1.5" strokeDasharray="4 6"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {services.map(({ x, y, label, color }, i) => (
        <g key={label}>
          <motion.rect x={x - 30} y={y - 16} width="60" height="32" rx="8"
            fill={color.replace(/[\d.]+\)/, '0.1)')} stroke={color} strokeWidth="1.5"
            filter="url(#sdGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="7" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
        </g>
      ))}
      {/* Data flow particles */}
      {links.slice(0, 4).map(([a, b], i) => (
        <motion.circle key={`flow-${i}`} r="2.5" fill="rgba(56,189,248,0.8)" filter="url(#sdGlow)"
          animate={{
            cx: [services[a].x, services[b].x],
            cy: [services[a].y, services[b].y],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
        />
      ))}
      <text x="200" y="310" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">scalable multi-service design</text>
    </svg>
  );
};

/** 4. Cloud Migration Strategy - phased migration flow */
const IllustrationMigrationStrategy: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="msGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Source environment */}
    <rect x="20" y="80" width="100" height="160" rx="8" fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
    <text x="70" y="100" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">SOURCE</text>
    {/* Workloads */}
    {[120, 145, 170, 195].map((y, i) => (
      <rect key={i} x="30" y={y} width="80" height="18" rx="3"
        fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.2)" strokeWidth="0.8" />
    ))}

    {/* Phases */}
    {[
      { x: 175, label: 'ASSESS', color: 'rgba(251,191,36,0.8)' },
      { x: 245, label: 'PLAN', color: 'rgba(56,189,248,0.8)' },
      { x: 315, label: 'EXECUTE', color: 'rgba(34,197,94,0.8)' },
    ].map(({ x, label, color }, i) => (
      <g key={label}>
        {/* Phase arrow */}
        {i > 0 && (
          <motion.line x1={x - 40} y1="160" x2={x - 15} y2="160"
            stroke={color} strokeWidth="1.5" strokeDasharray="3 4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        )}
        <motion.rect x={x - 28} y="125" width="56" height="70" rx="8"
          fill={color.replace(/[\d.]+\)/, '0.08)')} stroke={color} strokeWidth="1.5"
          filter="url(#msGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        />
        <text x={x} y="165" textAnchor="middle" fontSize="7" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
      </g>
    ))}

    {/* Arrow from source to phases */}
    <motion.path d="M 125 160 L 148 160" stroke="rgba(160,0,181,0.4)" strokeWidth="1.5" fill="none"
      strokeDasharray="4 4"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />

    {/* Target cloud */}
    <motion.rect x="355" y="80" width="30" height="160" rx="8"
      fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.2"
      filter="url(#msGlow)"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="370" y="165" textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.8)" fontFamily="monospace" fontWeight="bold"
      transform="rotate(-90 370 165)">AZURE</text>

    {/* Moving workload blocks */}
    {[0, 1, 2].map(i => (
      <motion.rect key={i} width="22" height="10" rx="2"
        fill="rgba(56,189,248,0.6)" filter="url(#msGlow)"
        animate={{
          x: [35, 175, 315, 360],
          y: [125 + i * 25, 140, 140, 125 + i * 25],
          opacity: [0.8, 0.6, 0.6, 0.8],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
      />
    ))}

    <text x="200" y="290" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">structured migration approach</text>
  </svg>
);

/** 5. Technical Decision Support - branching decision tree */
const IllustrationDecisionSupport: React.FC = () => {
  const tree = [
    { x: 200, y: 40, label: 'DECISION', w: 70, h: 28, color: 'rgba(160,0,181,0.8)' },
    { x: 100, y: 120, label: 'OPTION A', w: 60, h: 24, color: 'rgba(56,189,248,0.8)' },
    { x: 300, y: 120, label: 'OPTION B', w: 60, h: 24, color: 'rgba(56,189,248,0.8)' },
    { x: 60, y: 200, label: 'TRADE-OFF', w: 56, h: 22, color: 'rgba(251,191,36,0.7)' },
    { x: 160, y: 200, label: 'TRADE-OFF', w: 56, h: 22, color: 'rgba(251,191,36,0.7)' },
    { x: 250, y: 200, label: 'TRADE-OFF', w: 56, h: 22, color: 'rgba(251,191,36,0.7)' },
    { x: 350, y: 200, label: 'TRADE-OFF', w: 56, h: 22, color: 'rgba(251,191,36,0.7)' },
    { x: 200, y: 270, label: 'RECOMMEND', w: 74, h: 28, color: 'rgba(34,197,94,0.9)' },
  ];
  const links = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[4,7],[5,7],[6,7]];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="dsGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {links.map(([a, b], i) => (
        <motion.line key={i}
          x1={tree[a].x} y1={tree[a].y + (tree[a].h / 2)}
          x2={tree[b].x} y2={tree[b].y - (tree[b].h / 2)}
          stroke="rgba(160,0,181,0.2)" strokeWidth="1" strokeDasharray="3 6"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      {tree.map(({ x, y, label, w, h, color }, i) => (
        <g key={`${label}-${i}`}>
          <motion.rect x={x - w/2} y={y - h/2} width={w} height={h} rx="6"
            fill={color.replace(/[\d.]+\)/, '0.1)')} stroke={color} strokeWidth="1.5"
            filter="url(#dsGlow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
          />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="6.5" fill={color} fontFamily="monospace" fontWeight="bold">{label}</text>
        </g>
      ))}
      {/* Pulse on recommendation */}
      <motion.circle cx="200" cy="270" r="20"
        stroke="rgba(34,197,94,0.4)" strokeWidth="1" fill="none"
        animate={{ r: [20, 35, 45], opacity: [0.5, 0.15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <text x="200" y="310" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.55)" fontFamily="monospace" fontWeight="bold">expert-guided decisions</text>
    </svg>
  );
};

/** 6. Supporting Internal Teams - team augmentation */
const IllustrationTeamSupport: React.FC = () => {
  const internalTeam = [
    { x: 80, y: 100 }, { x: 140, y: 80 }, { x: 110, y: 160 },
    { x: 60, y: 200 }, { x: 150, y: 210 },
  ];
  const advisors = [
    { x: 290, y: 120 }, { x: 340, y: 170 }, { x: 310, y: 230 },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="tsGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Internal team zone */}
      <motion.ellipse cx="110" cy="150" rx="90" ry="100"
        fill="rgba(160,0,181,0.04)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <text x="110" y="50" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.6)" fontFamily="monospace" fontWeight="bold">INTERNAL TEAM</text>

      {/* Internal team members */}
      {internalTeam.map(({ x, y }, i) => (
        <motion.circle key={`int-${i}`} cx={x} cy={y} r="14"
          fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.35)" strokeWidth="1.5"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Advisory zone */}
      <motion.ellipse cx="310" cy="170" rx="65" ry="80"
        fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" strokeDasharray="6 8"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      <text x="310" y="70" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.7)" fontFamily="monospace" fontWeight="bold">ADVISORY</text>

      {/* Advisors */}
      {advisors.map(({ x, y }, i) => (
        <motion.circle key={`adv-${i}`} cx={x} cy={y} r="14"
          fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5"
          filter="url(#tsGlow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Knowledge transfer arrows */}
      {[
        { x1: 290, y1: 120, x2: 150, y2: 210 },
        { x1: 340, y1: 170, x2: 140, y2: 80 },
        { x1: 310, y1: 230, x2: 110, y2: 160 },
      ].map(({ x1, y1, x2, y2 }, i) => (
        <g key={i}>
          <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="4 6"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
          />
          {/* Knowledge transfer particle */}
          <motion.circle r="3" fill="rgba(56,189,248,0.8)" filter="url(#tsGlow)"
            animate={{
              cx: [x1, x2],
              cy: [y1, y2],
              opacity: [0, 0.9, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeInOut' }}
          />
        </g>
      ))}

      <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(56,189,248,0.55)" fontFamily="monospace" fontWeight="bold">augment in-house capability</text>
    </svg>
  );
};

const useCaseIllustrations = [
  IllustrationNewInitiatives,
  IllustrationArchReview,
  IllustrationSolutionDesign,
  IllustrationMigrationStrategy,
  IllustrationDecisionSupport,
  IllustrationTeamSupport,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'architecture',
    title: 'Architecture Design & Technical Reviews',
    description:
      'Thorough assessment of your current and planned architectures against best practices, with clear recommendations to improve design, resilience, and scalability.',
  },
  {
    icon: 'design_services',
    title: 'Solution Design for New Initiatives',
    description:
      'Expert-led design of cloud solutions for new projects and workloads, ensuring the right services, patterns, and approaches are selected from the outset.',
  },
  {
    icon: 'cloud_sync',
    title: 'Cloud Migration & Transformation Planning',
    description:
      'Structured planning for cloud migrations and transformation programmes, covering assessment, sequencing, risk mitigation, and execution roadmaps.',
  },
  {
    icon: 'co_present',
    title: 'Technical Workshops & Stakeholder Alignment',
    description:
      'Facilitated sessions to align technical and business stakeholders around key decisions, ensuring shared understanding and buy-in across the organisation.',
  },
  {
    icon: 'support_agent',
    title: 'Ongoing Advisory & Expert Guidance',
    description:
      'Continuous access to experienced cloud architects for ad-hoc guidance, decision support, and strategic input throughout your cloud journey.',
  },
];

const useCases = [
  {
    icon: 'rocket_launch',
    title: 'Planning New Cloud Initiatives',
    description:
      'Define the right architecture and approach before committing to implementation.',
    accent: 'rgba(160,0,181,0.35)',
  },
  {
    icon: 'find_in_page',
    title: 'Architecture Reviews & Validation',
    description:
      'Assess existing designs to identify risks, gaps, and improvement opportunities.',
    accent: 'rgba(130,0,160,0.35)',
  },
  {
    icon: 'hub',
    title: 'Complex Solution Design',
    description:
      'Design scalable, secure architectures for multi-service or enterprise environments.',
    accent: 'rgba(100,0,140,0.35)',
  },
  {
    icon: 'cloud_upload',
    title: 'Cloud Migration Strategy',
    description:
      'Plan and structure migrations to minimise disruption and maximise long-term value.',
    accent: 'rgba(145,0,170,0.35)',
  },
  {
    icon: 'psychology',
    title: 'Technical Decision Support',
    description:
      'Provide expert input to guide key architectural and technology choices.',
    accent: 'rgba(115,0,150,0.35)',
  },
  {
    icon: 'group_add',
    title: 'Supporting Internal Teams',
    description:
      'Augment in-house capability with experienced architectural guidance.',
    accent: 'rgba(85,0,125,0.35)',
  },
];

const benefits = [
  {
    icon: 'verified',
    title: 'Confident Decision-Making',
    description: 'Make complex cloud decisions with clarity, backed by experienced architectural expertise and proven best practices.',
  },
  {
    icon: 'shield',
    title: 'Reduced Risk',
    description: 'Avoid costly mistakes and architectural debt by getting the design right from the start.',
  },
  {
    icon: 'trending_up',
    title: 'Long-Term Strategic Alignment',
    description: 'Ensure your cloud architecture supports your business goals today and scales with you into the future.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AdvisoryConsultingPageProps {
  readonly className?: string;
}

export const AdvisoryConsultingPage: React.FC<AdvisoryConsultingPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.advisoryConsulting}
        schema={[
          serviceSchema({
            name: 'Advisory & Consulting',
            description: pageMeta.advisoryConsulting.description,
            path: pageMeta.advisoryConsulting.path,
            serviceType: 'Cloud Advisory',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Advisory & Consulting', path: pageMeta.advisoryConsulting.path },
          ]),
          faqSchema(faqs.advisoryConsulting),
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
                  Cloud Architecture &amp; Design
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
                  Architect With
                </motion.span>
                <motion.span
                  className="block text-gradient-primary"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  Confidence
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62 }}
              >
                Expert guidance for complex cloud decisions and strategic initiatives.
              </motion.p>
            </div>

            {/* Right: Blueprint Graphic */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[480px] lg:max-w-[520px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <ClientOnly><ArchitectureBlueprintGraphic /></ClientOnly>
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
                Strategic Cloud{' '}
                <span className="text-gradient-primary">Expertise</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We provide architectural expertise and advisory support to help organisations design,
                plan, and execute cloud strategies with confidence. Our approach ensures decisions are
                aligned with best practices and long-term business goals.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Whether you're planning a new initiative, reviewing an existing architecture, or
                navigating a complex transformation - we bring the experience and insight needed
                to guide your organisation through every critical decision.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src={`${import.meta.env.BASE_URL}service-cloud-architecture.webp`}
                  alt="Azure advisory, cloud architecture and strategy illustration"
                  width={768}
                  height={768}
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

            {/* Decision Matrix Graphic */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <ClientOnly><DecisionMatrixGraphic /></ClientOnly>
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
                  Scalable, Secure,{' '}
                  <span className="text-gradient-primary">Strategically Aligned</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Cloud decisions can be complex and difficult to reverse if done incorrectly.
                  We provide the expertise needed to guide your organisation through key decisions,
                  ensuring your architecture is scalable, secure, and aligned with your long-term strategy.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  This reduces risk, avoids costly mistakes, and enables more confident execution -
                  giving your teams the clarity and direction they need to deliver with purpose.
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
              Where advisory and architecture consulting delivers the greatest impact.
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

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.advisoryConsulting}
        groupName="faq-advisory-consulting"
        eyebrow="Questions"
        heading="Frequently asked questions"
        description="What clients ask us most often about senior Azure advisory and independent architecture input."
      />

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
              READY TO BUILD
              <br />
              <span className="text-gradient-primary">WITH CONFIDENCE?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Speak with our team to discuss your cloud strategy and discover how expert advisory can help you make better architectural decisions.
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
          href="https://learn.microsoft.com/azure/well-architected/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Azure Well-Architected Framework
        </a>
        {' · '}
        <a
          href="https://learn.microsoft.com/azure/cloud-adoption-framework/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Cloud Adoption Framework
        </a>
      </div>

    </main>
  );
};
