import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, reportSchema, breadcrumbSchema } from '../data/seoMeta';
import { housing2026 } from '../data/reports/housing-2026';
import { BarRow } from '../components/reports/BarRow';
import { NotFoundPage } from './NotFoundPage';

const REPORTS = [housing2026];

const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

export const ReportDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = REPORTS.find((r) => r.slug === slug);
  if (!report) return <NotFoundPage />;
  const path = `/reports/${report.slug}`;

  return (
    <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
      <SEO
        {...pageMeta.housingReport2026}
        schema={[
          reportSchema({ title: report.title, description: pageMeta.housingReport2026.description, path, datePublished: report.datePublished }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Reports', path: '/reports' },
            { name: report.title, path },
          ]),
        ]}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-[0.16]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.55), transparent 70%)' }} />

      <div className="max-w-[820px] mx-auto px-6 relative">
        {/* Hero */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary-fixed font-bold font-label mb-6">Original research</p>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tighter mb-8 leading-[1.1]">{report.title}</h1>

        <div className="rounded-3xl border border-outline/60 bg-surface px-8 py-12 text-center mb-12 relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />
          <div className="relative">
            <div className="font-headline text-6xl md:text-8xl font-extrabold text-gradient-primary mb-4">{report.headline.value}</div>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto">{report.headline.label}</p>
            {report.headline.sub && <p className="text-sm text-on-surface-variant/70 max-w-xl mx-auto mt-3">{report.headline.sub}</p>}
          </div>
        </div>

        {/* Standfirst */}
        {report.standfirst.map((p, i) => (
          <p key={i} className="text-lg text-on-surface-variant leading-relaxed mb-5">{p}</p>
        ))}

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-14">
          {report.keyStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-outline/50 bg-surface/60 p-5 text-center">
              <div className="font-headline text-3xl font-extrabold text-white mb-1.5">{s.value}</div>
              <div className="text-xs text-on-surface-variant leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* DMARC breakdown chart */}
        <Reveal>
          <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-2">DMARC posture across the sector</h2>
          <p className="text-on-surface-variant text-sm mb-6">DMARC is what actually stops a domain being spoofed. Only an enforced policy (quarantine or reject) protects tenants; a policy of none monitors but protects nothing.</p>
          <div className="rounded-2xl border border-outline/50 bg-surface/60 p-8 mb-14">
            {report.dmarcBreakdown.map((d) => <BarRow key={d.label} label={d.label} pct={d.pct} tone={d.tone} />)}
          </div>
        </Reveal>

        {/* Score distribution */}
        {report.scoreBands.length > 0 && (
          <Reveal>
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6">Overall security score distribution</h2>
            <div className="rounded-2xl border border-outline/50 bg-surface/60 p-8 mb-14">
              {report.scoreBands.map((b) => <BarRow key={b.band} label={b.band} pct={b.pct} />)}
              <p className="text-xs text-on-surface-variant/60 mt-4">Sector mean {report.scoreMean}/100, median {report.scoreMedian}/100.</p>
            </div>
          </Reveal>
        )}

        {/* Findings */}
        {report.findings.map((section) => (
          <Reveal key={section.heading} className="mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-5">{section.heading}</h2>
            {section.body.map((p, i) => <p key={i} className="text-on-surface-variant leading-relaxed mb-4">{p}</p>)}
          </Reveal>
        ))}

        {/* Top performers (only if signed off) */}
        {report.topPerformers && report.topPerformers.length > 0 && (
          <Reveal className="mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-5">Sector leaders</h2>
            <p className="text-on-surface-variant leading-relaxed mb-5">These providers had fully configured, enforced email authentication at the time of scanning. Credit to their teams.</p>
            <div className="flex flex-wrap gap-2.5">
              {report.topPerformers.map((name) => (
                <span key={name} className="px-4 py-2 rounded-lg bg-primary/8 border border-primary/20 text-sm text-on-surface-variant">{name}</span>
              ))}
            </div>
          </Reveal>
        )}

        {/* Methodology */}
        <Reveal className="mb-14">
          <div className="rounded-2xl border border-outline/50 bg-surface/40 p-8">
            <h2 className="font-headline text-xl font-bold tracking-tight mb-4">Methodology</h2>
            {report.methodology.map((p, i) => <p key={i} className="text-sm text-on-surface-variant/90 leading-relaxed mb-3">{p}</p>)}
            <p className="text-xs text-on-surface-variant/60 mt-2">Scanned {report.scannedAt}. Sample size: {report.sampleSize} providers.</p>
          </div>
        </Reveal>

        {/* CTA */}
        <div className="rounded-2xl border border-outline/60 bg-surface px-8 py-10 text-center relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />
          <div className="relative">
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-3">How does your domain score?</h2>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-7">Run the same external check on your own domain in about 15 seconds. Free, no install, no access to your systems.</p>
            <Link to="/security-check" className="no-underline inline-block">
              <motion.button className="btn-animated text-white font-headline font-bold px-9 py-4 rounded-lg text-base tracking-tight" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Run the free security check
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReportDetailPage;
