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

// ─── Pipeline Flow Hero Graphic ───────────────────────────────────────────────

const PipelineFlowGraphic: React.FC = () => {
  const stages = [
    { label: 'CODE', icon: 'code', x: 60 },
    { label: 'BUILD', icon: 'build', x: 175 },
    { label: 'SCAN', icon: 'security', x: 290 },
    { label: 'TEST', icon: 'fact_check', x: 405 },
    { label: 'DEPLOY', icon: 'rocket_launch', x: 460 },
  ];

  // Pipeline stages as SVG boxes with connectors
  const pipelineStages = [
    { label: 'CODE', x: 42, color: 'rgba(160,0,181,0.9)', bgColor: 'rgba(160,0,181,0.15)' },
    { label: 'BUILD', x: 152, color: 'rgba(160,0,181,0.9)', bgColor: 'rgba(160,0,181,0.12)' },
    { label: 'SAST', x: 262, color: 'rgba(34,197,94,0.9)', bgColor: 'rgba(34,197,94,0.12)' },
    { label: 'TEST', x: 372, color: 'rgba(160,0,181,0.9)', bgColor: 'rgba(160,0,181,0.12)' },
    { label: 'DEPLOY', x: 432, color: 'rgba(160,0,181,0.9)', bgColor: 'rgba(160,0,181,0.15)' },
  ];
  void stages;
  void pipelineStages;


  return (
    <div className="relative w-full max-w-[520px] aspect-square">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.1) 0%, rgba(160,0,181,0.12) 40%, transparent 70%)' }}
      />
      <svg viewBox="0 0 520 520" className="w-full h-full" fill="none">
        <defs>
          <filter id="dsoNodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dsoSecGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dsoCenterGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(160,0,181,0.8)" />
            <stop offset="50%" stopColor="rgba(34,197,94,0.8)" />
            <stop offset="100%" stopColor="rgba(160,0,181,0.8)" />
          </linearGradient>
          <linearGradient id="secLayerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34,197,94,0.6)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.2)" />
          </linearGradient>
          <marker id="dsoArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(160,0,181,0.5)" />
          </marker>
          <marker id="dsoArrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(34,197,94,0.6)" />
          </marker>
        </defs>

        {/* Background horizontal grid */}
        {[120, 180, 240, 300, 360, 420].map(y => (
          <line key={y} x1="20" y1={y} x2="500" y2={y} stroke="rgba(160,0,181,0.05)" strokeWidth="1" strokeDasharray="4 18" />
        ))}
        {[80, 160, 240, 320, 400, 480].map(x => (
          <line key={x} x1={x} y1="80" x2={x} y2="460" stroke="rgba(160,0,181,0.04)" strokeWidth="1" strokeDasharray="3 14" />
        ))}

        {/* ── Main pipeline track ── */}
        {/* Track background */}
        <rect x="60" y="220" width="400" height="80" rx="12"
          fill="rgba(160,0,181,0.04)" stroke="rgba(160,0,181,0.1)" strokeWidth="1" />

        {/* Stage boxes */}
        {[
          { x: 68, label: 'CODE', sec: false },
          { x: 158, label: 'BUILD', sec: false },
          { x: 248, label: 'SAST', sec: true },
          { x: 338, label: 'TEST', sec: false },
          { x: 390, label: 'RELEASE', sec: false },
        ].map(({ x, label, sec }, i) => (
          <g key={label}>
            <motion.rect
              x={x} y="228" width="68" height="64" rx="8"
              fill={sec ? 'rgba(34,197,94,0.12)' : 'rgba(160,0,181,0.1)'}
              stroke={sec ? 'rgba(34,197,94,0.7)' : 'rgba(160,0,181,0.45)'}
              strokeWidth={sec ? 1.5 : 1.2}
              filter={sec ? 'url(#dsoSecGlow)' : undefined}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
            />
            <text x={x + 34} y={x === 390 ? 265 : 263} textAnchor="middle" fontSize="7.5"
              fill={sec ? 'rgba(34,197,94,0.95)' : 'rgba(160,0,181,0.9)'}
              fontWeight="bold" fontFamily="monospace">{label}</text>
            {sec && (
              <text x={x + 34} y="276" textAnchor="middle" fontSize="6"
                fill="rgba(34,197,94,0.65)" fontFamily="monospace">SCANNING</text>
            )}
          </g>
        ))}

        {/* Connector arrows between stages */}
        {[136, 226, 316, 382].map((x, i) => (
          <motion.line key={x}
            x1={x} y1="260" x2={x + 12} y2="260"
            stroke={i === 1 ? 'rgba(34,197,94,0.7)' : 'rgba(160,0,181,0.5)'}
            strokeWidth="1.5"
            markerEnd={i === 1 ? 'url(#dsoArrowGreen)' : 'url(#dsoArrow)'}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Animated data packets flowing through pipeline */}
        {[0, 1, 2, 3].map(i => (
          <motion.circle key={`pkt-${i}`}
            cy="260" r="4"
            fill={i === 1 ? 'rgba(34,197,94,0.95)' : 'rgba(160,0,181,0.95)'}
            filter="url(#dsoNodeGlow)"
            animate={{ cx: [68, 460], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.9, ease: 'linear' }}
          />
        ))}

        {/* ── Security layer (below pipeline) ── */}
        <text x="260" y="348" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.6)"
          fontFamily="monospace" fontWeight="bold">SECURITY LAYER</text>

        {/* Security scanners */}
        {[
          { x: 118, label: 'IaC\nSCAN', color: 'rgba(34,197,94,0.75)' },
          { x: 228, label: 'SCA', color: 'rgba(34,197,94,0.75)' },
          { x: 338, label: 'POLICY', color: 'rgba(34,197,94,0.75)' },
        ].map(({ x, label, color }, i) => (
          <g key={label}>
            {/* Vertical connector from pipeline to security layer */}
            <motion.line
              x1={x + 34} y1="292" x2={x + 34} y2="356"
              stroke="rgba(34,197,94,0.35)" strokeWidth="1"
              strokeDasharray="3 5"
              markerEnd="url(#dsoArrowGreen)"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
            />
            <motion.rect
              x={x + 4} y="358" width="60" height="30" rx="6"
              fill="rgba(34,197,94,0.08)"
              stroke={color}
              strokeWidth="1.2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
            <text x={x + 34} y="378" textAnchor="middle" fontSize="7"
              fill={color} fontWeight="bold" fontFamily="monospace">{label.replace('\n', ' ')}</text>
          </g>
        ))}

        {/* ── CI/CD outer frame ── */}
        {/* Left vertical track (loop back) */}
        <motion.path
          d="M 60 260 C 30 260, 30 140, 200 130 C 370 120, 460 170, 460 260"
          stroke="rgba(160,0,181,0.12)" strokeWidth="1.5"
          strokeDasharray="5 10" fill="none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Feedback loop label */}
        <text x="260" y="118" textAnchor="middle" fontSize="7"
          fill="rgba(160,0,181,0.45)" fontFamily="monospace">CI / CD LOOP</text>

        {/* ── Top metrics row ── */}
        {[
          { x: 80, label: 'BUILDS', value: '247' },
          { x: 210, label: 'ISSUES CAUGHT', value: '18' },
          { x: 340, label: 'PASS RATE', value: '99%' },
        ].map(({ x, label, value }, i) => (
          <g key={label}>
            <rect x={x - 4} y="138" width="82" height="42" rx="6"
              fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.18)" strokeWidth="1" />
            <text x={x + 37} y="157" textAnchor="middle" fontSize="6.5"
              fill="rgba(160,0,181,0.55)" fontFamily="monospace">{label}</text>
            <motion.text x={x + 37} y="172" textAnchor="middle" fontSize="11"
              fill={i === 1 ? 'rgba(34,197,94,0.9)' : 'rgba(160,0,181,0.9)'}
              fontWeight="bold" fontFamily="monospace"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
            >{value}</motion.text>
          </g>
        ))}

        {/* ── Bottom status row ── */}
        {[
          { x: 80, label: 'SAST', status: 'PASS', green: true },
          { x: 190, label: 'SCA', status: 'PASS', green: true },
          { x: 300, label: 'IaC', status: 'PASS', green: true },
          { x: 410, label: 'POLICY', status: 'PASS', green: true },
        ].map(({ x, label, status, green }, i) => (
          <g key={label}>
            <rect x={x - 4} y="416" width="74" height="28" rx="5"
              fill={green ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}
              stroke={green ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'} strokeWidth="1" />
            <text x={x + 33} y="430" textAnchor="middle" fontSize="6"
              fill="rgba(255,255,255,0.35)" fontFamily="monospace">{label}</text>
            <motion.text x={x + 33} y="440" textAnchor="middle" fontSize="6.5"
              fill={green ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)'}
              fontWeight="bold" fontFamily="monospace"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
            >{status}</motion.text>
          </g>
        ))}

        {/* ── Central SAST scan animation ── */}
        <motion.rect
          x="248" y="228" width="68" height="64" rx="8"
          fill="none"
          stroke="rgba(34,197,94,0.6)"
          strokeWidth="2"
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />

        {/* Pulsing rings on SAST stage */}
        <motion.circle cx="282" cy="260" r="12"
          stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" fill="none"
          animate={{ r: [12, 40, 60], opacity: [0.8, 0.2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <motion.circle cx="282" cy="260" r="12"
          stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" fill="none"
          animate={{ r: [12, 40, 60], opacity: [0.8, 0.2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 2.25 }}
        />

        {/* ── Corner tick marks ── */}
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

// ─── Pipeline Dashboard Graphic (Overview) ────────────────────────────────────

const PipelineDashboardGraphic: React.FC = () => (
  <div className="w-full h-[460px] bg-surface-container rounded-xl border border-outline/30 p-6 flex flex-col gap-4 overflow-hidden relative">
    {/* Header */}
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
          Azure DevOps / GitHub Actions
        </div>
        <div className="font-headline text-sm font-bold">Pipeline Security Dashboard</div>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[10px] text-green-400 font-label">Running</span>
      </div>
    </div>

    {/* Build progress ring */}
    <div className="flex items-center gap-5 bg-surface p-4 rounded-xl border border-outline/20">
      <div className="relative w-[72px] h-[72px] shrink-0">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="7" />
          <motion.circle
            cx="36" cy="36" r="30"
            fill="none"
            stroke="rgba(34,197,94,0.9)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={String(2 * Math.PI * 30)}
            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.94) }}
            transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-lg font-bold leading-none">94%</span>
          <span className="text-[8px] text-on-surface-variant leading-none mt-0.5">pass rate</span>
        </div>
      </div>
      <div>
        <div className="font-headline font-bold text-sm mb-1">Security Gate Status</div>
        <div className="text-[11px] text-on-surface-variant">247 builds this week — 94% passed all gates</div>
        <div className="text-[10px] text-green-400 mt-1.5 font-label font-bold">↓ 63% fewer prod issues</div>
      </div>
    </div>

    {/* Scanner results */}
    {[
      { label: 'SAST — Code Scanning', value: 98, color: 'rgba(34,197,94,0.9)' },
      { label: 'SCA — Dependency Check', value: 91, color: 'rgba(34,197,94,0.75)' },
      { label: 'IaC — Template Scanning', value: 96, color: 'rgba(160,0,181,0.9)' },
      { label: 'Policy Gate Compliance', value: 100, color: 'rgba(160,0,181,0.75)' },
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
        { icon: 'code', label: 'Pipelines', status: '12 Active' },
        { icon: 'security', label: 'Scanners', status: '4 Running' },
        { icon: 'policy', label: 'Policies', status: '31 Enforced' },
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

// ─── Shift-Left Flow Graphic (Business Impact) ────────────────────────────────

const ShiftLeftGraphic: React.FC = () => {
  // Two timelines: "Before" (security at end) and "After" (security everywhere)
  const beforeStages = [
    { x: 60,  label: 'DEV', color: 'rgba(160,0,181,0.5)' },
    { x: 165, label: 'BUILD', color: 'rgba(160,0,181,0.5)' },
    { x: 270, label: 'TEST', color: 'rgba(160,0,181,0.5)' },
    { x: 375, label: 'SEC', color: 'rgba(239,68,68,0.7)' },
    { x: 430, label: 'PROD', color: 'rgba(160,0,181,0.5)' },
  ];
  const afterStages = [
    { x: 60,  label: 'CODE', color: 'rgba(34,197,94,0.75)' },
    { x: 165, label: 'BUILD', color: 'rgba(34,197,94,0.75)' },
    { x: 270, label: 'TEST', color: 'rgba(34,197,94,0.75)' },
    { x: 375, label: 'DEPLOY', color: 'rgba(34,197,94,0.75)' },
    { x: 430, label: '', color: 'transparent' },
  ];

  return (
    <div className="relative w-full h-[460px] bg-surface-container-highest rounded-2xl border border-outline/30 overflow-hidden">
      <svg viewBox="0 0 500 460" className="w-full h-full absolute inset-0" fill="none">
        <defs>
          <filter id="slGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="slRedGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <marker id="slArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(160,0,181,0.4)" />
          </marker>
          <marker id="slArrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(34,197,94,0.6)" />
          </marker>
        </defs>

        {/* Background grid */}
        {[80, 160, 240, 320, 400].map(y => (
          <line key={y} x1="20" y1={y} x2="480" y2={y} stroke="rgba(160,0,181,0.05)" strokeWidth="1" strokeDasharray="4 16" />
        ))}

        {/* ── BEFORE row ── */}
        <text x="30" y="88" fontSize="8" fill="rgba(160,0,181,0.5)" fontFamily="monospace" fontWeight="bold">TRADITIONAL</text>
        {/* Track */}
        <line x1="55" y1="115" x2="455" y2="115" stroke="rgba(160,0,181,0.15)" strokeWidth="1.5" strokeDasharray="4 8" markerEnd="url(#slArrow)" />
        {beforeStages.map(({ x, label, color }, i) => (
          <g key={label}>
            <motion.circle cx={x} cy="115" r="22"
              fill={`${color.replace(')', ', 0.1)').replace('rgba(', 'rgba(')}`}
              stroke={color} strokeWidth="1.5"
              filter={i === 3 ? 'url(#slRedGlow)' : undefined}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
            />
            <text x={x} y="119" textAnchor="middle" fontSize="7" fill={color} fontWeight="bold" fontFamily="monospace">{label}</text>
            {i === 3 && (
              <>
                <motion.circle cx={x} cy="115" r="30"
                  stroke="rgba(239,68,68,0.4)" strokeWidth="1" fill="none"
                  animate={{ r: [28, 40, 28], opacity: [0.7, 0.1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <text x={x} y="158" textAnchor="middle" fontSize="6.5" fill="rgba(239,68,68,0.8)" fontFamily="monospace">LATE!</text>
              </>
            )}
          </g>
        ))}

        {/* Lock icon at the end "bolted on" */}
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          <rect x="410" y="96" width="34" height="38" rx="5" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" />
          <rect x="416" y="84" width="22" height="20" rx="11" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2" />
          <circle cx="427" cy="112" r="3" fill="rgba(239,68,68,0.7)" />
          <line x1="427" y1="115" x2="427" y2="122" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        <text x="427" y="148" textAnchor="middle" fontSize="6" fill="rgba(239,68,68,0.6)" fontFamily="monospace">BOLTED ON</text>

        {/* Divider */}
        <line x1="30" y1="188" x2="470" y2="188" stroke="rgba(160,0,181,0.12)" strokeWidth="1" strokeDasharray="2 8" />
        <rect x="200" y="181" width="100" height="14" rx="7" fill="rgba(160,0,181,0.1)" />
        <text x="250" y="191" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.7)" fontFamily="monospace" fontWeight="bold">SHIFT LEFT</text>

        {/* ── AFTER row ── */}
        <text x="30" y="220" fontSize="8" fill="rgba(34,197,94,0.75)" fontFamily="monospace" fontWeight="bold">DEVSECOPS</text>
        {/* Track */}
        <line x1="55" y1="248" x2="410" y2="248" stroke="rgba(34,197,94,0.2)" strokeWidth="1.5" markerEnd="url(#slArrowGreen)" />
        {afterStages.filter(s => s.label).map(({ x, label, color }, i) => (
          <g key={label}>
            <motion.circle cx={x} cy="248" r="22"
              fill="rgba(34,197,94,0.08)"
              stroke={color} strokeWidth="1.5"
              filter="url(#slGlow)"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            />
            <text x={x} y="252" textAnchor="middle" fontSize="7" fill={color} fontWeight="bold" fontFamily="monospace">{label}</text>
            {/* Security badge on every stage */}
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
            >
              <circle cx={x + 16} cy="228" r="8" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1" />
              <text x={x + 16} y="232" textAnchor="middle" fontSize="6" fill="rgba(34,197,94,0.9)" fontFamily="monospace">✓</text>
            </motion.g>
          </g>
        ))}

        {/* Security woven through — connecting lines */}
        {[60, 165, 270, 375].map((x, i) => (
          <motion.path key={x}
            d={`M ${x} 270 Q ${x + 52} 305 ${x + 105} 270`}
            stroke="rgba(34,197,94,0.2)" strokeWidth="1" fill="none"
            strokeDasharray="3 6"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* ── Bottom benefit boxes ── */}
        {[
          { x: 46, label: 'FASTER', sub: 'delivery', color: 'rgba(34,197,94,0.8)' },
          { x: 188, label: 'CHEAPER', sub: 'to fix', color: 'rgba(34,197,94,0.7)' },
          { x: 330, label: 'SAFER', sub: 'releases', color: 'rgba(34,197,94,0.8)' },
        ].map(({ x, label, sub, color }, i) => (
          <g key={label}>
            <motion.rect x={x} y="348" width="110" height="46" rx="8"
              fill="rgba(34,197,94,0.06)"
              stroke={color} strokeWidth="1.2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
            />
            <text x={x + 55} y="369" textAnchor="middle" fontSize="10" fill={color} fontWeight="bold" fontFamily="monospace">{label}</text>
            <text x={x + 55} y="384" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.4)" fontFamily="monospace">{sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Use Case Illustrations ───────────────────────────────────────────────────

/** 1. DevSecOps Transition — converging flows */
const IllustrationTransition: React.FC = () => (
  <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
    <defs>
      <filter id="tr1Glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* Three converging streams: Dev, Sec, Ops */}
    {[
      { startX: 40, startY: 40, label: 'DEV', color: 'rgba(160,0,181,0.8)' },
      { startX: 200, startY: 20, label: 'SEC', color: 'rgba(34,197,94,0.8)' },
      { startX: 360, startY: 40, label: 'OPS', color: 'rgba(160,0,181,0.8)' },
    ].map(({ startX, startY, label, color }, i) => (
      <g key={label}>
        <motion.path
          d={`M ${startX} ${startY} Q ${startX + (200 - startX) * 0.5} 160, 200 220`}
          stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
          filter="url(#tr1Glow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
        />
        <rect x={startX - 22} y={startY - 16} width="44" height="18" rx="4"
          fill={`${color.replace('0.8', '0.12')}`} stroke={color} strokeWidth="1" />
        <text x={startX} y={startY - 3} textAnchor="middle" fontSize="8" fill={color} fontWeight="bold" fontFamily="monospace">{label}</text>
        {/* Flowing particles */}
        {[0, 1].map(j => (
          <motion.circle key={j} r="3.5" fill={color} filter="url(#tr1Glow)"
            animate={{
              cx: [startX, 200],
              cy: [startY, 220],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 + j * 1.2, ease: 'easeInOut' }}
          />
        ))}
      </g>
    ))}
    {/* Central union circle */}
    <motion.circle cx="200" cy="230" r="40" fill="rgba(34,197,94,0.08)"
      stroke="rgba(34,197,94,0.6)" strokeWidth="2"
      filter="url(#tr1Glow)"
      animate={{ opacity: [0.7, 1, 0.7], r: [38, 42, 38] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="200" y="226" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">DEV</text>
    <text x="200" y="237" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">SEC</text>
    <text x="200" y="248" textAnchor="middle" fontSize="9" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">OPS</text>
    {/* Pulsing ring */}
    <motion.circle cx="200" cy="230" r="40"
      stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" fill="none"
      animate={{ r: [40, 72, 90], opacity: [0.8, 0.2, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
    />
    {/* Unified output arrow */}
    <motion.line x1="200" y1="270" x2="200" y2="305"
      stroke="rgba(34,197,94,0.7)" strokeWidth="2" strokeLinecap="round"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <text x="200" y="315" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.75)" fontFamily="monospace" fontWeight="bold">UNIFIED WORKFLOW</text>
  </svg>
);

/** 2. CI/CD Pipeline — horizontal flow with stages */
const IllustrationCICD: React.FC = () => {
  const stages = ['COMMIT', 'BUILD', 'TEST', 'SCAN', 'STAGE', 'PROD'];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="ciGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="ciArrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(160,0,181,0.5)" />
        </marker>
      </defs>
      {/* Track */}
      <line x1="30" y1="160" x2="370" y2="160" stroke="rgba(160,0,181,0.12)" strokeWidth="2" />
      {/* Stage nodes */}
      {stages.map((label, i) => {
        const x = 30 + i * 68;
        const isScan = label === 'SCAN';
        return (
          <g key={label}>
            {i > 0 && (
              <motion.line x1={x - 35} y1="160" x2={x - 10} y2="160"
                stroke={isScan ? 'rgba(34,197,94,0.6)' : 'rgba(160,0,181,0.4)'}
                strokeWidth="1.5" markerEnd="url(#ciArrow)"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
            <motion.circle cx={x} cy="160" r={isScan ? 22 : 18}
              fill={isScan ? 'rgba(34,197,94,0.1)' : 'rgba(160,0,181,0.08)'}
              stroke={isScan ? 'rgba(34,197,94,0.8)' : 'rgba(160,0,181,0.6)'}
              strokeWidth={isScan ? 2 : 1.5}
              filter={isScan ? 'url(#ciGlow)' : undefined}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35 }}
            />
            <text x={x} y="164" textAnchor="middle" fontSize={isScan ? 7 : 6.5}
              fill={isScan ? 'rgba(34,197,94,0.9)' : 'rgba(160,0,181,0.85)'}
              fontWeight="bold" fontFamily="monospace">{label}</text>
            {/* Packet animation */}
            <motion.circle r="3" fill={isScan ? 'rgba(34,197,94,0.9)' : 'rgba(160,0,181,0.9)'}
              filter="url(#ciGlow)"
              animate={{ cx: [x, x + 68], cy: [160, 160], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
            />
          </g>
        );
      })}
      {/* Branch lines */}
      <motion.path d="M 234 160 Q 234 220, 200 240 Q 166 260, 166 300"
        stroke="rgba(34,197,94,0.3)" strokeWidth="1.2" fill="none" strokeDasharray="3 6"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <text x="152" y="300" fontSize="7" fill="rgba(34,197,94,0.6)" fontFamily="monospace">SECURITY REPORT</text>
      {/* Labels above */}
      {stages.map((label, i) => {
        const x = 30 + i * 68;
        return (
          <text key={label} x={x} y="126" textAnchor="middle" fontSize="6"
            fill={label === 'SCAN' ? 'rgba(34,197,94,0.5)' : 'rgba(160,0,181,0.35)'}
            fontFamily="monospace">
            {label === 'COMMIT' ? 'git push' :
             label === 'BUILD' ? 'npm build' :
             label === 'TEST' ? 'jest' :
             label === 'SCAN' ? 'snyk' :
             label === 'STAGE' ? 'staging' : 'main'}
          </text>
        );
      })}
    </svg>
  );
};

/** 3. Infrastructure as Code — code becoming infrastructure */
const IllustrationIaC: React.FC = () => {
  const codeLines = [
    'resource "azurerm_vnet"',
    '  address_space = ["10.0.0.0/16"]',
    'resource "azurerm_subnet"',
    '  address_prefix = "10.0.1.0/24"',
    'resource "azurerm_nsg"',
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="iacGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Code editor panel */}
      <rect x="20" y="20" width="160" height="170" rx="8" fill="rgba(160,0,181,0.05)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" />
      <rect x="20" y="20" width="160" height="22" rx="8" fill="rgba(160,0,181,0.12)" />
      <rect x="20" y="34" width="160" height="8" fill="rgba(160,0,181,0.12)" />
      <text x="100" y="35" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.8)" fontFamily="monospace" fontWeight="bold">main.tf</text>
      {codeLines.map((line, i) => (
        <motion.text key={i} x="28" y={62 + i * 26} fontSize="6.5"
          fill={i % 2 === 0 ? 'rgba(160,0,181,0.75)' : 'rgba(255,255,255,0.35)'}
          fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3, duration: 0.4, repeat: Infinity, repeatDelay: 5 }}
        >{line}</motion.text>
      ))}
      {/* Arrow */}
      <motion.path d="M 185 105 Q 215 105, 215 105"
        stroke="rgba(160,0,181,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.path d="M 210 100 L 222 105 L 210 110" stroke="rgba(160,0,181,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
      />
      {/* Infrastructure icons */}
      {[
        { x: 230, y: 60, icon: '⬡', label: 'VNet' },
        { x: 310, y: 60, icon: '▦', label: 'Subnet' },
        { x: 230, y: 140, icon: '⊞', label: 'NSG' },
        { x: 310, y: 140, icon: '⬡', label: 'VM' },
      ].map(({ x, y, label }, i) => (
        <g key={label}>
          <motion.rect x={x - 26} y={y - 22} width="52" height="46" rx="6"
            fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.45)" strokeWidth="1.2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 1 + i * 0.4 }}
          />
          <text x={x} y={y + 2} textAnchor="middle" fontSize="11" fill="rgba(160,0,181,0.7)">{/* icon */}</text>
          <text x={x} y={y - 3} textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.8)" fontFamily="monospace" fontWeight="bold">{label}</text>
          <text x={x} y={y + 12} textAnchor="middle" fontSize="6" fill="rgba(160,0,181,0.5)" fontFamily="monospace">auto-deployed</text>
        </g>
      ))}
      {/* Version control badge */}
      <rect x="20" y="206" width="360" height="24" rx="6" fill="rgba(160,0,181,0.06)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" />
      <text x="200" y="222" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.65)" fontFamily="monospace">git commit → plan → apply → verified</text>
    </svg>
  );
};

/** 4. Security Scanning — SAST code analysis */
const IllustrationSAST: React.FC = () => {
  const findings = [
    { line: 14, sev: 'HIGH', msg: 'SQL injection risk' },
    { line: 28, sev: 'MED', msg: 'Hardcoded secret' },
    { line: 41, sev: 'LOW', msg: 'Unused import' },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="sastGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,197,94,0)" />
          <stop offset="50%" stopColor="rgba(34,197,94,0.5)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>
      {/* Code file */}
      <rect x="30" y="20" width="200" height="280" rx="8" fill="rgba(160,0,181,0.04)" stroke="rgba(160,0,181,0.15)" strokeWidth="1" />
      <rect x="30" y="20" width="200" height="22" rx="8" fill="rgba(160,0,181,0.1)" />
      <rect x="30" y="34" width="200" height="8" fill="rgba(160,0,181,0.1)" />
      <text x="130" y="35" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.8)" fontFamily="monospace" fontWeight="bold">app.py — SAST SCAN</text>
      {/* Code lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = 52 + i * 20;
        const lineNum = i + 10;
        const finding = findings.find(f => f.line === lineNum);
        return (
          <g key={i}>
            <text x="40" y={y + 8} fontSize="6" fill="rgba(160,0,181,0.3)" fontFamily="monospace">{lineNum}</text>
            <motion.rect x="56" y={y} width={finding ? 160 : 90 + (i % 4) * 18} height="10" rx="2"
              fill={finding
                ? finding.sev === 'HIGH' ? 'rgba(239,68,68,0.2)' : finding.sev === 'MED' ? 'rgba(251,191,36,0.15)' : 'rgba(160,0,181,0.08)'
                : 'rgba(160,0,181,0.07)'}
              stroke={finding
                ? finding.sev === 'HIGH' ? 'rgba(239,68,68,0.5)' : finding.sev === 'MED' ? 'rgba(251,191,36,0.4)' : 'rgba(160,0,181,0.2)'
                : 'none'}
              strokeWidth="1"
              animate={{ opacity: finding ? [0.6, 1, 0.6] : [0.5, 0.8, 0.5] }}
              transition={{ duration: finding ? 1.5 : 2.5, repeat: Infinity, delay: i * 0.1 }}
            />
          </g>
        );
      })}
      {/* Scan line */}
      <motion.rect x="30" width="200" height="6"
        fill="url(#scanBeam)"
        animate={{ y: [30, 300, 30] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <motion.line x1="30" x2="230" stroke="rgba(34,197,94,0.8)" strokeWidth="1"
        animate={{ y1: [33, 303, 33], y2: [33, 303, 33] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      {/* Finding badges on the right */}
      {findings.map(({ line, sev, msg }, i) => {
        const y = 52 + (line - 10) * 20 - 4;
        const color = sev === 'HIGH' ? 'rgba(239,68,68,0.9)' : sev === 'MED' ? 'rgba(251,191,36,0.9)' : 'rgba(160,0,181,0.8)';
        return (
          <motion.g key={i}
            animate={{ opacity: [0, 0, 1, 1, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1.5 + i * 0.7, times: [0, 0.1, 0.25, 0.8, 1] }}
          >
            <rect x="248" y={y} width="134" height="28" rx="5"
              fill={`${color.replace('0.9', '0.1')}`} stroke={color} strokeWidth="1" />
            <text x="256" y={y + 10} fontSize="6.5" fill={color} fontWeight="bold" fontFamily="monospace">[{sev}] {msg}</text>
            <text x="256" y={y + 22} fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="monospace">line {line}</text>
          </motion.g>
        );
      })}
      {/* Result summary */}
      <motion.g
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 4, times: [0, 0.1, 0.2, 1] }}
      >
        <rect x="248" y="260" width="134" height="36" rx="6" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.2" />
        <text x="315" y="275" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">SCAN COMPLETE</text>
        <text x="315" y="287" textAnchor="middle" fontSize="6.5" fill="rgba(34,197,94,0.6)" fontFamily="monospace">3 findings · pipeline paused</text>
      </motion.g>
    </svg>
  );
};

/** 5. Policy as Code — enforcement rules */
const IllustrationPolicyCode: React.FC = () => {
  const rules = [
    { rule: 'deny http — require https', status: 'ENFORCED' },
    { rule: 'require tags: env, owner', status: 'ENFORCED' },
    { rule: 'no public storage blobs', status: 'ENFORCED' },
    { rule: 'approved regions only', status: 'ENFORCED' },
  ];
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="polcGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="polcArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(160,0,181,0.5)" />
        </marker>
      </defs>
      {/* Policy file */}
      <rect x="20" y="16" width="160" height="200" rx="8" fill="rgba(160,0,181,0.05)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" />
      <rect x="20" y="16" width="160" height="22" rx="8" fill="rgba(160,0,181,0.12)" />
      <rect x="20" y="30" width="160" height="8" fill="rgba(160,0,181,0.12)" />
      <text x="100" y="31" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.85)" fontFamily="monospace" fontWeight="bold">policy.rego</text>
      {rules.map(({ rule }, i) => (
        <g key={i}>
          <text x="30" y={62 + i * 38} fontSize="6" fill="rgba(160,0,181,0.45)" fontFamily="monospace">rule {i + 1}:</text>
          <rect x="30" y={67 + i * 38} width="140" height="18" rx="3" fill="rgba(160,0,181,0.07)" stroke="rgba(160,0,181,0.2)" strokeWidth="1" />
          <text x="38" y={80 + i * 38} fontSize="6" fill="rgba(255,255,255,0.45)" fontFamily="monospace">{rule}</text>
        </g>
      ))}
      {/* Arrow to deployment */}
      <motion.line x1="186" y1="116" x2="222" y2="116"
        stroke="rgba(160,0,181,0.6)" strokeWidth="1.8"
        markerEnd="url(#polcArrow)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Deployment attempts */}
      {[
        { y: 60, label: 'deploy req #1', pass: true },
        { y: 118, label: 'deploy req #2', pass: false },
        { y: 176, label: 'deploy req #3', pass: true },
      ].map(({ y, label, pass }, i) => (
        <g key={i}>
          <motion.rect x="232" y={y} width="140" height="46" rx="7"
            fill={pass ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}
            stroke={pass ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}
            strokeWidth="1.2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
          />
          <text x="302" y={y + 16} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.45)" fontFamily="monospace">{label}</text>
          <motion.text x="302" y={y + 32} textAnchor="middle" fontSize="9"
            fill={pass ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)'}
            fontWeight="bold" fontFamily="monospace"
            filter="url(#polcGlow)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.7 }}
          >{pass ? '✓ ALLOWED' : '✗ DENIED'}</motion.text>
        </g>
      ))}
      {/* Particles through policy engine */}
      {[0, 1, 2].map(i => (
        <motion.circle key={i} r="3" fill="rgba(160,0,181,0.9)" filter="url(#polcGlow)"
          animate={{ cx: [186, 222], cy: [116, 116], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
      {/* Bottom label */}
      <text x="200" y="300" textAnchor="middle" fontSize="7.5" fill="rgba(160,0,181,0.55)" fontFamily="monospace" fontWeight="bold">policy enforced at deploy time</text>
    </svg>
  );
};

/** 6. Release Process Optimisation — throughput/speed chart */
const IllustrationRelease: React.FC = () => {
  // Before: slow, bumpy. After: fast, smooth
  const beforePath = 'M 30,240 L 80,220 L 110,230 L 140,210 L 180,225 L 210,205 L 240,215';
  const afterPath  = 'M 240,215 L 270,185 L 300,165 L 330,145 L 360,125 L 390,105';
  return (
    <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
      <defs>
        <filter id="relGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="relFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,197,94,0.3)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[100, 140, 180, 220, 260].map(y => (
        <line key={y} x1="20" y1={y} x2="400" y2={y} stroke="rgba(160,0,181,0.07)" strokeWidth="1" strokeDasharray="4 12" />
      ))}
      {/* Y axis labels */}
      <text x="18" y="104" textAnchor="end" fontSize="7" fill="rgba(34,197,94,0.6)" fontFamily="monospace">FAST</text>
      <text x="18" y="244" textAnchor="end" fontSize="7" fill="rgba(160,0,181,0.5)" fontFamily="monospace">SLOW</text>
      {/* X axis */}
      <line x1="30" y1="270" x2="390" y2="270" stroke="rgba(160,0,181,0.15)" strokeWidth="1" />
      <text x="90" y="285" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.45)" fontFamily="monospace">BEFORE</text>
      <text x="310" y="285" textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.65)" fontFamily="monospace">DEVSECOPS</text>

      {/* Divider */}
      <line x1="240" y1="80" x2="240" y2="270" stroke="rgba(160,0,181,0.2)" strokeWidth="1" strokeDasharray="4 8" />

      {/* Before line — slow/flat */}
      <motion.polyline points={beforePath}
        stroke="rgba(160,0,181,0.6)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#relGlow)"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* After line — steeply improving */}
      <motion.path
        d={`${afterPath} L 390 270 L 240 270 Z`}
        fill="url(#relFill)" opacity="0.6"
      />
      <motion.polyline points={afterPath}
        stroke="rgba(34,197,94,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#relGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Data points on after line */}
      {[[270, 185], [300, 165], [330, 145], [360, 125], [390, 105]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="4"
          fill="rgba(34,197,94,0.9)" filter="url(#relGlow)"
          animate={{ r: [3.5, 5.5, 3.5], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Annotations */}
      <rect x="252" y="88" width="110" height="20" rx="4" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.4)" strokeWidth="1" />
      <text x="307" y="102" textAnchor="middle" fontSize="7.5" fill="rgba(34,197,94,0.9)" fontWeight="bold" fontFamily="monospace">↑ DEPLOY VELOCITY</text>

      <rect x="40" y="195" width="100" height="20" rx="4" fill="rgba(160,0,181,0.08)" stroke="rgba(160,0,181,0.3)" strokeWidth="1" />
      <text x="90" y="209" textAnchor="middle" fontSize="7" fill="rgba(160,0,181,0.65)" fontFamily="monospace">manual bottlenecks</text>

      {/* Moving dot along after line */}
      <motion.circle r="5" fill="rgba(34,197,94,0.95)" filter="url(#relGlow)"
        animate={{
          cx: [240, 270, 300, 330, 360, 390],
          cy: [215, 185, 165, 145, 125, 105],
          opacity: [0, 1, 1, 1, 1, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
      />
    </svg>
  );
};

const useCaseIllustrations = [
  IllustrationTransition,
  IllustrationCICD,
  IllustrationIaC,
  IllustrationSAST,
  IllustrationPolicyCode,
  IllustrationRelease,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const deliverables = [
  {
    icon: 'account_tree',
    title: 'CI/CD Pipeline Design',
    description:
      'End-to-end pipeline design and implementation using Azure DevOps or GitHub Actions — enabling fast, consistent, and secure software delivery from day one.',
  },
  {
    icon: 'code_blocks',
    title: 'Infrastructure as Code Pipelines',
    description:
      'Automated, version-controlled infrastructure deployments using Terraform or Bicep, replacing manual builds with repeatable, auditable pipelines.',
  },
  {
    icon: 'manage_search',
    title: 'Security Scanning (SAST, SCA, IaC)',
    description:
      'Static code analysis, dependency vulnerability scanning, and infrastructure template scanning integrated directly into your delivery pipelines.',
  },
  {
    icon: 'policy',
    title: 'Policy-as-Code Implementation',
    description:
      'Security and governance rules defined and enforced as code using OPA/Rego or Azure Policy, ensuring consistent compliance at every deployment.',
  },
  {
    icon: 'verified_user',
    title: 'Automated Compliance Controls',
    description:
      'Compliance and governance controls embedded into pipelines to automatically validate deployments against required standards before they reach production.',
  },
  {
    icon: 'integration_instructions',
    title: 'Security in Development Workflows',
    description:
      'Security integrated as a first-class concern throughout your development workflow — from IDE plugins and pre-commit hooks to automated PR checks.',
  },
];

const useCases = [
  {
    icon: 'sync_alt',
    title: 'Transition to DevSecOps',
    description:
      'Move from siloed development and security processes to a unified, automated delivery model that reduces friction and increases control.',
    accent: 'rgba(160,0,181,0.35)',
  },
  {
    icon: 'account_tree',
    title: 'CI/CD Pipeline Implementation',
    description:
      'Design and deploy pipelines that enable fast, consistent, and reliable releases across all environments.',
    accent: 'rgba(130,0,160,0.35)',
  },
  {
    icon: 'code_blocks',
    title: 'Infrastructure as Code Adoption',
    description:
      'Replace manual builds with automated, version-controlled infrastructure deployments that are repeatable and auditable.',
    accent: 'rgba(100,0,140,0.35)',
  },
  {
    icon: 'manage_search',
    title: 'Integrated Security Scanning',
    description:
      'Embed SAST, dependency, and IaC scanning into pipelines to catch vulnerabilities and misconfigurations early in the delivery cycle.',
    accent: 'rgba(145,0,170,0.35)',
  },
  {
    icon: 'policy',
    title: 'Policy-as-Code Enforcement',
    description:
      'Ensure every deployment automatically meets security and compliance standards — no manual gates required.',
    accent: 'rgba(115,0,150,0.35)',
  },
  {
    icon: 'speed',
    title: 'Release Process Optimisation',
    description:
      'Reduce bottlenecks and improve deployment speed without sacrificing control, quality, or security posture.',
    accent: 'rgba(85,0,125,0.35)',
  },
];

const benefits = [
  {
    icon: 'rocket_launch',
    title: 'Faster, Safer Delivery',
    description: 'Automated security gates remove manual bottlenecks while ensuring every release meets your standards.',
  },
  {
    icon: 'currency_pound',
    title: 'Lower Cost to Remediate',
    description: 'Catching issues in the pipeline is significantly cheaper than fixing vulnerabilities discovered in production.',
  },
  {
    icon: 'task_alt',
    title: 'Continuous Compliance',
    description: 'Policy-as-code and automated controls keep your environment compliant as it evolves, without manual effort.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface DevSecOpsPageProps {
  readonly className?: string;
}

export const DevSecOpsPage: React.FC<DevSecOpsPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.devSecOps}
        schema={[
          serviceSchema({
            name: 'DevSecOps Consulting',
            description: pageMeta.devSecOps.description,
            path: pageMeta.devSecOps.path,
            serviceType: 'DevSecOps',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'DevSecOps', path: pageMeta.devSecOps.path },
          ]),
        ]}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 flex items-center px-8 md:px-24 overflow-hidden bg-background">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-[-5%] right-[-8%] w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, rgba(160,0,181,0.08) 40%, transparent 70%)' }}
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
                  Secure DevOps &amp; Automation
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
                  Security Built
                </motion.span>
                <motion.span
                  className="block text-gradient-primary"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  Into Every Pipeline
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.62 }}
              >
                Integrate security into your development and deployment processes.
              </motion.p>
            </div>

            {/* Right: Pipeline Graphic */}
            <motion.div
              className="flex-shrink-0 w-full max-w-[480px] lg:max-w-[520px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <ClientOnly><PipelineFlowGraphic /></ClientOnly>
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
                Delivery Without{' '}
                <span className="text-gradient-primary">Compromise</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                We help organisations adopt DevSecOps practices that combine development, operations,
                and security into a unified, automated workflow. This enables faster delivery
                without compromising security or quality.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Rather than treating security as a final approval gate, we embed automated scanning,
                policy enforcement, and compliance controls directly into your pipelines — so security
                is a continuous property of every release, not an afterthought.
              </p>
            </ScrollReveal>
          </div>

          {/* Image */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
              <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                <img
                  src={`${import.meta.env.BASE_URL}service-devsecops.webp`}
                  alt="Secure DevOps & Automation"
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

            {/* Shift-Left Graphic */}
            <ScrollReveal className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative bg-surface-container-highest p-4 rounded-2xl shadow-2xl border border-outline/30">
                  <ClientOnly><ShiftLeftGraphic /></ClientOnly>
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
                  Ship Faster,{' '}
                  <span className="text-gradient-primary">Stay Secure</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Traditional development processes often treat security as a final step,
                  causing delays and increasing risk. When vulnerabilities are caught late,
                  remediation is expensive and can stall critical releases.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  By embedding security into every stage of delivery, your teams can deploy
                  faster while maintaining control and compliance. This results in more efficient
                  workflows, fewer issues in production, and a stronger overall security posture.
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
              Where DevSecOps enablement makes the greatest impact.
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
          style={{ background: 'rgba(34, 197, 94, 0.06)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              READY TO EMBED SECURITY
              <br />
              <span className="text-gradient-primary">INTO YOUR PIPELINES?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Speak with our team to discuss your current delivery process and how DevSecOps can help you ship faster without sacrificing control.
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
