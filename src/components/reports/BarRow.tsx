interface BarRowProps {
  readonly label: string;
  readonly pct: number;
  /** Optional override colour for the bar fill (defaults to the brand gradient). */
  readonly tone?: 'brand' | 'good' | 'warn' | 'bad';
}

const TONE: Record<NonNullable<BarRowProps['tone']>, string> = {
  brand: 'bg-gradient-to-r from-primary to-primary-fixed',
  good: 'bg-[#3fa996]',
  warn: 'bg-[#e0a82e]',
  bad: 'bg-[#d05a5a]',
};

export const BarRow: React.FC<BarRowProps> = ({ label, pct, tone = 'brand' }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-bold text-white">{pct}%</span>
    </div>
    <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
      <div className={`h-full rounded-full ${TONE[tone]}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  </div>
);

export default BarRow;
