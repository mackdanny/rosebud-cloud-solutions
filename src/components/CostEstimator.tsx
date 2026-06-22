import { useState, useCallback, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── Tier definitions (from RCS Combined Rate Card) ─────────────────────────

type TierKey = 'small' | 'medium' | 'large';

interface Tier {
  key: TierKey;
  name: string;
  maxUsers: number;
  userBracket: string;       // e.g. "≤50 users"
  landingZonesLabel: string;
  includedHours: number;
  p1Sla: string;
  p2Sla: string;
  highlights: string[];
}

const tiers: Tier[] = [
  {
    key: 'small',
    name: 'Small',
    maxUsers: 50,
    userBracket: '≤50 users',
    landingZonesLabel: 'Up to 2',
    includedHours: 3.5,
    p1Sla: '1 business hour',
    p2Sla: 'Next business day',
    highlights: ['Monitoring & incident response', 'Security & policy checks', 'Minor changes & requests'],
  },
  {
    key: 'medium',
    name: 'Medium',
    maxUsers: 250,
    userBracket: '50–250 users',
    landingZonesLabel: 'Up to 6',
    includedHours: 8,
    p1Sla: '30 minutes',
    p2Sla: '2 business hours',
    highlights: ['Sentinel alert triage', 'Cost optimisation insights', 'Monthly service review'],
  },
  {
    key: 'large',
    name: 'Large',
    maxUsers: Infinity,
    userBracket: '250+ users',
    landingZonesLabel: '7+',
    includedHours: 16,
    p1Sla: '15 minutes',
    p2Sla: '1 business hour',
    highlights: ['Named Technical Design Authority', 'Architecture roadmap planning', 'Quarterly executive reviews'],
  },
];

// ─── Add-on packages ────────────────────────────────────────────────────────

interface AddOn {
  key: string;
  label: string;
  applies: ReadonlyArray<TierKey>;
  description: string;
}

const addOns: AddOn[] = [
  { key: 'data-lz', label: 'Additional Data Landing Zone', applies: ['medium', 'large'], description: 'Per additional Data LZ' },
  { key: 'sentinel', label: 'Sentinel Platform Management', applies: ['medium', 'large'], description: 'Alert triage & rule tuning' },
  { key: 'finops', label: 'FinOps & Cost Optimisation', applies: ['small', 'medium', 'large'], description: 'Monthly cost review & reporting' },
  { key: 'audit', label: 'Audit Evidence Support', applies: ['medium', 'large'], description: 'Technical evidence preparation' },
  { key: 'ooh', label: 'Out-of-Hours Support', applies: ['small', 'medium', 'large'], description: 'Reactive P1 incident response' },
];

const determineTier = (users: number): Tier => {
  for (const t of tiers) if (users <= t.maxUsers) return t;
  return tiers[tiers.length - 1];
};

// ─── Component ──────────────────────────────────────────────────────────────

export const CostEstimator: React.FC = () => {
  const idPrefix = useId();
  const [users, setUsers] = useState(75);
  const [activeAddOns, setActiveAddOns] = useState<Set<string>>(new Set());

  const tier = useMemo(() => determineTier(users), [users]);

  const selectedAddOns = useMemo(
    () => addOns.filter((a) => activeAddOns.has(a.key) && a.applies.includes(tier.key)),
    [activeAddOns, tier.key],
  );

  const toggleAddOn = useCallback((key: string) => {
    setActiveAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const userPct = (Math.min(users, 500) / 500) * 100;
  const sliderStyle = (pct: number) => ({
    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, var(--color-outline) ${pct}%, var(--color-outline) 100%)`,
  });

  // Build a contact URL that prefills the form with the selections
  const contactUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('service', 'managed-cloud');
    params.set('tier', tier.key);
    if (selectedAddOns.length > 0) {
      params.set('addons', selectedAddOns.map((a) => a.key).join(','));
    }
    return `/contact?${params.toString()}`;
  }, [tier.key, selectedAddOns]);

  return (
    <div className="bg-surface border border-outline/60 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary/15 border-b border-primary/30 px-8 py-5 flex items-center gap-3">
        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.4rem' }}>
          tune
        </span>
        <h3 className="font-headline text-lg font-bold tracking-tight">Find Your Managed Service Tier</h3>
      </div>

      <div className="p-8 md:p-10">
        <p className="text-on-surface-variant text-sm mb-10 leading-relaxed max-w-3xl">
          Tell us about your environment and we'll recommend the right Managed Azure Cloud tier. Tiers are scoped by headcount and Landing Zone footprint, per the RCS service catalogue.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
          {/* ─── Inputs ───────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Users slider */}
            <div>
              <label htmlFor={`${idPrefix}-users`} className="flex items-center justify-between text-sm font-bold mb-3">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.1rem' }}>group</span>
                  Users
                </span>
                <span className="font-headline text-base font-extrabold">{users >= 500 ? '500+' : users}</span>
              </label>
              <input
                id={`${idPrefix}-users`}
                type="range"
                min={10}
                max={500}
                step={5}
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                  [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(160,0,181,0.5)] [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={sliderStyle(userPct)}
              />
              <div className="flex justify-between text-xs mt-3">
                <div className="flex flex-col items-start">
                  <span className="text-on-surface-variant/60">10</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-on-surface-variant/80">≤50 (S)</span>
                  <span className="text-on-surface-variant/50 text-[10px] mt-0.5">Up to 2 LZs</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-on-surface-variant/80">≤250 (M)</span>
                  <span className="text-on-surface-variant/50 text-[10px] mt-0.5">Up to 6 LZs</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-on-surface-variant/80">500+ (L)</span>
                  <span className="text-on-surface-variant/50 text-[10px] mt-0.5">7+ LZs</span>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <p className="text-sm font-bold mb-4 flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.1rem' }}>extension</span>
                Add-on packages
              </p>
              <div className="space-y-2">
                {addOns.map((a) => {
                  const eligible = a.applies.includes(tier.key);
                  const active = activeAddOns.has(a.key);
                  return (
                    <button
                      key={a.key}
                      type="button"
                      disabled={!eligible}
                      onClick={() => toggleAddOn(a.key)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors
                        ${active && eligible
                          ? 'bg-primary/15 border-primary/50'
                          : eligible
                            ? 'bg-surface-container border-outline/60 hover:border-primary/40'
                            : 'bg-surface-container/40 border-outline/30 opacity-50 cursor-not-allowed'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`material-symbols-outlined shrink-0 ${active && eligible ? 'text-primary' : 'text-on-surface-variant/60'}`}
                        style={{ fontSize: '1.2rem' }}
                      >
                        {active && eligible ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold truncate">{a.label}</span>
                        <span className="block text-xs text-on-surface-variant/70">
                          {eligible ? a.description : 'Available on Medium/Large tiers'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Tier card / output ──────────────────────────── */}
          <div className="bg-surface-container border border-outline/60 rounded-xl p-6 lg:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary-fixed font-bold font-label">
                Recommended Tier
              </span>
              <span className="px-3 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs font-bold text-primary">
                {tier.name}
              </span>
            </div>

            {/* Plain-English summary */}
            <p className="text-on-surface text-base leading-relaxed mb-6">
              <span className="font-headline font-extrabold">{tier.name} tier</span> — fits{' '}
              <span className="font-bold">{tier.userBracket}</span> and{' '}
              <span className="font-bold">{tier.landingZonesLabel.toLowerCase()} Landing Zone{tier.landingZonesLabel === '7+' ? 's' : tier.landingZonesLabel === 'Up to 2' || tier.landingZonesLabel === 'Up to 6' ? 's' : ''}</span>.
            </p>

            {/* SLA grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-on-surface-variant/70 mb-1">Included engineering</p>
                <p className="font-headline text-lg font-extrabold">{tier.includedHours} hrs/mo</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant/70 mb-1">P1 SLA</p>
                <p className="font-headline text-lg font-extrabold">{tier.p1Sla}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant/70 mb-1">P2 SLA</p>
                <p className="font-headline text-lg font-extrabold">{tier.p2Sla}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant/70 mb-1">Landing Zones</p>
                <p className="font-headline text-lg font-extrabold">{tier.landingZonesLabel}</p>
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-2 mb-6">
              {tier.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: '1rem' }}>
                    check_circle
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {/* Selected add-ons */}
            <AnimatePresence>
              {selectedAddOns.length > 0 && (
                <motion.div
                  key="addons"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-outline/40 pt-4 mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary-fixed font-bold font-label mb-3">
                      With Add-ons
                    </p>
                    <ul className="space-y-2">
                      {selectedAddOns.map((a) => (
                        <li key={a.key} className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: '1rem' }}>
                            add_circle
                          </span>
                          {a.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <div className="mt-auto pt-2">
              <Link to={contactUrl} className="no-underline block">
                <motion.button
                  className="w-full btn-animated text-white font-headline font-bold px-6 py-4 rounded-lg text-sm tracking-tight"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get a quote for this configuration
                </motion.button>
              </Link>
              <p className="text-on-surface-variant/60 text-xs mt-3 text-center">
                Final scope agreed at engagement. No commitment until you say so.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
