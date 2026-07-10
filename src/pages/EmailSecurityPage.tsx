import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Faq } from '../components/Faq';
import { pageMeta, serviceSchema, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';
import { TiltCard } from '../components/TiltCard';
import { type ManagedPlan } from '../config/portal';

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => (
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

// ─── Data ─────────────────────────────────────────────────────────────────────

interface PricedPkg {
  id: ManagedPlan;
  name: string;
  who: string;
  priceMonthly: number;
  cap: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

const packages: PricedPkg[] = [
  {
    id: 'monitor',
    name: 'Monitor',
    who: 'See your exposure and act on it yourself.',
    priceMonthly: 39,
    cap: '1 domain · 2 users',
    features: ['DMARC report ingestion & analysis', 'Sender identification & classification', 'Live status portal', 'Monthly PDF reports'],
  },
  {
    id: 'managed',
    name: 'Managed',
    who: 'Done-for-you protection: we walk you safely to full enforcement.',
    priceMonthly: 99,
    cap: '1 domain · 5 users',
    features: ['Everything in Monitor', 'We walk you to enforcement (no broken mail)', 'Hosted DMARC, so you never edit DNS again', 'SPF, DKIM, MTA-STS & TLS-RPT', '90-day enforcement guarantee', 'Priority support'],
    featured: true,
    badge: 'Most popular',
  },
  {
    id: 'scale',
    name: 'Scale',
    who: 'Multi-domain estates, with a dedicated specialist.',
    priceMonthly: 149,
    cap: 'Up to 5 domains · unlimited users',
    features: ['Everything in Managed', 'Up to 5 domains', 'BIMI (your verified logo in inboxes)', 'Dedicated specialist + SLA'],
  },
];

const tiers = ['Monitor', 'Managed', 'Scale'];

interface FeatureGroup {
  group: string;
  rows: { label: string; marks: [boolean, boolean, boolean] }[];
}

const T = true;
const F = false;

const featureGroups: FeatureGroup[] = [
  {
    group: 'Visibility & analysis',
    rows: [
      { label: 'Security score (0-100) with section breakdown', marks: [T, T, T] },
      { label: 'Spoofability check (can someone send as you?)', marks: [T, T, T] },
      { label: 'DMARC aggregate report ingestion & analysis', marks: [T, T, T] },
      { label: 'Sender identification & classification', marks: [T, T, T] },
      { label: 'Lookalike / typo-squat domain detection', marks: [T, T, T] },
    ],
  },
  {
    group: 'Reporting & monitoring',
    rows: [
      { label: 'Live status portal', marks: [T, T, T] },
      { label: 'Monthly PDF reports', marks: [T, T, T] },
      { label: 'Continuous monitoring & drift detection', marks: [T, T, T] },
      { label: 'A record of every change we make, available on request', marks: [T, T, T] },
    ],
  },
  {
    group: 'Getting protected (done-for-you)',
    rows: [
      { label: 'We walk you to full enforcement (p=reject)', marks: [F, T, T] },
      { label: 'Enforcement safety gates (no broken mail)', marks: [F, T, T] },
      { label: 'Hosted DMARC, so you never edit DNS again', marks: [F, T, T] },
      { label: 'Done-for-you SPF & DKIM guidance', marks: [F, T, T] },
      { label: 'MTA-STS & TLS reporting (TLS-RPT)', marks: [F, T, T] },
      { label: 'Enforcement guarantee (90 days)', marks: [F, T, T] },
      { label: 'BIMI (your verified logo in inboxes)', marks: [F, F, T] },
    ],
  },
  {
    group: 'Management & access',
    rows: [
      { label: 'Multiple domains (up to 5)', marks: [F, F, T] },
      { label: 'Unlimited portal users', marks: [F, F, T] },
      { label: 'Passwordless sign-in (magic link)', marks: [T, T, T] },
    ],
  },
  {
    group: 'Service & support',
    rows: [
      { label: 'Priority human support', marks: [F, T, T] },
      { label: 'Ongoing managed service & guidance', marks: [F, T, T] },
      { label: 'Dedicated specialist + SLA', marks: [F, F, T] },
    ],
  },
];

// How the managed service actually works — the journey to enforcement.
const howSteps: { n: string; title: string; body: string }[] = [
  { n: '01', title: 'Point your reports at us', body: 'One small DNS change and your DMARC reports start flowing to us. Nothing to install, no access to your systems.' },
  { n: '02', title: 'We find every sender', body: 'We ingest the reports and identify every system legitimately sending email as you — and every impostor — and classify them for you.' },
  { n: '03', title: 'We get you to enforcement', body: 'We fix SPF, DKIM, MTA-STS and TLS-RPT, then step your policy from none → quarantine → reject, with safety gates so legitimate mail never breaks.' },
  { n: '04', title: 'We keep it healthy', body: 'Ongoing monitoring, a live status portal, monthly reports and a full audit trail. You stay protected without lifting a finger.' },
];

// The concrete capabilities behind the subscription — the "what you're paying for".
const whatYouGet: { icon: string; title: string; body: string }[] = [
  { icon: 'verified_user', title: 'Done-for-you enforcement', body: 'We walk your domain safely to p=reject — the only setting that actually stops spoofing — with a 90-day guarantee.' },
  { icon: 'dns', title: 'Hosted DMARC', body: 'We host and manage your DMARC record, so you never have to edit DNS or interpret a report again.' },
  { icon: 'fact_check', title: 'Sender identification', body: 'Every sender found, named and classified — so nothing legitimate gets blocked when you tighten policy.' },
  { icon: 'monitoring', title: 'Live portal & reports', body: 'A clear status portal, monthly PDF reports and continuous drift detection — proof you stay protected.' },
  { icon: 'lock', title: 'MTA-STS, TLS-RPT & BIMI', body: 'We set up encrypted-transport enforcement and your verified logo in inboxes, not just the DMARC basics.' },
  { icon: 'support_agent', title: 'A team, not a dashboard', body: 'Priority human support and ongoing guidance. We do the work — you get the outcome.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface EmailSecurityPageProps {
  readonly className?: string;
}

export const EmailSecurityPage: React.FC<EmailSecurityPageProps> = ({ className = '' }) => {
  const [annual, setAnnual] = useState(false);
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.emailSecurity}
        schema={[
          serviceSchema({
            name: 'Managed Email Security & DMARC',
            description: pageMeta.emailSecurity.description,
            path: pageMeta.emailSecurity.path,
            serviceType: 'Email Security & DMARC Management',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Email Security', path: pageMeta.emailSecurity.path },
          ]),
          faqSchema(faqs.emailSecurity),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-8 md:px-24 overflow-hidden bg-background">
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(160,0,181,1) 1px, transparent 1px), linear-gradient(90deg, rgba(160,0,181,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="max-w-4xl">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label">
                Managed DMARC
              </span>
            </motion.div>

            <h1 className="font-headline text-[3.5rem] md:text-[5.5rem] leading-[1.0] font-extrabold tracking-tighter mb-8">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                Stop anyone sending
              </motion.span>
              <motion.span
                className="block text-gradient-primary"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                email as your business
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
            >
              We take your domain all the way to enforced DMARC and keep it there — done for you,
              without you having to learn DMARC or risk breaking a single legitimate email.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a href="#pricing" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-12 py-5 rounded-lg text-lg tracking-tight"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See plans &amp; pricing
                </motion.button>
              </a>
              <Link to="/security-check" className="text-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors">
                Or run a free security check first →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pricing (lead with the product — visitors arrive from Services → DMARC) ── */}
      <section id="pricing" className="py-28 px-8 md:px-24 bg-surface border-t border-outline scroll-mt-24">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              Managed DMARC pricing
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              Simple, per-account pricing
            </h2>
            <p className="text-on-surface-variant max-w-xl mt-4">
              Per account, not per seat. Talk to us and we'll get you onto the right plan. Public-sector buyer?{' '}
              <Link to="/contact" className="text-primary underline-offset-2 hover:underline">pay by invoice</Link>.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          {/* Billing toggle */}
          <ScrollReveal className="mb-12">
            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-outline/60 bg-surface" role="group" aria-label="Billing period">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                aria-pressed={!annual}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${!annual ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                aria-pressed={annual}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${annual ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Annual <span className="text-xs font-normal opacity-80">· 2 months free</span>
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-[1100px] mx-auto">
            {packages.map((pkg, i) => {
              const price = annual ? pkg.priceMonthly * 10 : pkg.priceMonthly;
              const unit = annual ? '/yr' : '/mo';
              return (
                <motion.div
                  key={pkg.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                >
                  <TiltCard
                    className={`group h-full rounded-2xl p-7 flex flex-col relative overflow-hidden transition-all ${
                      pkg.featured ? 'bg-surface border-2 border-primary/40' : 'bg-surface border border-outline/60 hover:border-primary/30'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    {pkg.badge && (
                      <span className="self-start mb-3 text-[10px] uppercase tracking-[0.15em] font-bold text-white bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-1 rounded-full">
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="font-headline text-xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-on-surface-variant text-sm min-h-[3.5rem] mb-3">{pkg.who}</p>
                    <div className="mb-1 flex items-end gap-1">
                      <span className="font-headline text-4xl font-extrabold tracking-tight">£{price}</span>
                      <span className="text-on-surface-variant text-sm mb-1.5">{unit}</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/70 font-bold font-label mb-2 block">
                      {pkg.cap}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary mb-4">
                      <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '1rem' }}>schedule</span>
                      14-day free trial · cancel anytime
                    </span>
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                          <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '1.05rem' }}>
                            check
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className="no-underline mt-auto">
                      <button
                        className={`w-full font-headline font-bold px-5 py-3 rounded-lg text-sm transition-all ${
                          pkg.featured ? 'btn-animated text-white' : 'border border-outline/60 text-on-surface hover:border-primary/40'
                        }`}
                      >
                        Talk to us to get started
                      </button>
                    </Link>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          <ScrollReveal className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm max-w-[820px] mx-auto">
              <strong className="text-on-surface">The 90-day enforcement guarantee</strong> (Managed and Scale): if we have not
              walked your domain to enforced DMARC (p=reject) within 90 days of onboarding, for reasons within our control,
              your subscription is free from day 91 until we have. No small print beyond this sentence.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Not sure yet? <Link to="/security-check" className="text-primary underline-offset-2 hover:underline">Run the free security check first</Link> — no signup needed.
              {' '}Want a one-off fix instead of a subscription? <Link to="/security-check" className="text-primary underline-offset-2 hover:underline">See the External Security options</Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Mandate hook ─────────────────────────────────────────────── */}
      <section className="py-16 px-8 md:px-24 bg-background border-y border-outline">
        <ScrollReveal className="max-w-[1100px] mx-auto text-center">
          <p className="text-lg md:text-2xl text-on-surface leading-relaxed font-light">
            Since 2024 <span className="text-gradient-primary font-semibold">Google and Yahoo</span>, joined by
            <span className="text-gradient-primary font-semibold"> Microsoft in May 2025</span>, reject or junk mail from
            bulk senders who fail email authentication. Yet even among the world's busiest domains only about
            <span className="text-gradient-primary font-semibold"> 1 in 11</span> is properly protected. If yours isn't,
            criminals can send email as you, and your own mail increasingly lands in spam. We fix both, without breaking a single legitimate email.
          </p>
        </ScrollReveal>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              How Managed DMARC works
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              We do the work. You get to enforcement.
            </h2>
            <p className="text-on-surface-variant max-w-xl mt-4">
              DMARC done properly is a project, not a checkbox. We run the whole journey for you and keep it healthy afterwards.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {howSteps.map((s, i) => (
              <motion.div
                key={s.n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="rounded-2xl border border-outline/60 bg-background p-7 flex flex-col"
              >
                <span className="font-headline text-3xl font-extrabold text-primary/40 mb-4">{s.n}</span>
                <h3 className="font-headline text-lg font-bold mb-2 leading-tight">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <ScrollReveal className="mb-12">
            <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
              What you're actually paying for
            </h3>
            <p className="text-on-surface-variant max-w-xl mt-3">
              Not a report you read yourself — a managed outcome, delivered by us.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatYouGet.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="rounded-2xl border border-outline/50 bg-background/60 p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">{f.icon}</span>
                </div>
                <h4 className="font-headline text-lg font-bold mb-2 leading-tight">{f.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background border-t border-outline">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              What's included
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              More help as you go up
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mt-4">
              Managed DMARC is everything, done for you, ongoing.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="overflow-x-auto rounded-2xl border border-outline/60">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-background">
                    <th className="text-left font-headline font-bold p-4">Feature</th>
                    {tiers.map((t) => (
                      <th key={t} className="font-headline font-bold p-4 text-center whitespace-nowrap">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureGroups.map((grp) => (
                    <Fragment key={grp.group}>
                      <tr className="bg-surface-container">
                        <td colSpan={4} className="px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-bold text-primary font-label">
                          {grp.group}
                        </td>
                      </tr>
                      {grp.rows.map((row) => (
                        <tr key={row.label} className="border-t border-outline/40">
                          <td className="p-4 text-on-surface">{row.label}</td>
                          {row.marks.map((m, idx) => (
                            <td key={idx} className="p-4 text-center">
                              {m ? (
                                <span aria-label="included" className="material-symbols-outlined text-primary" style={{ fontSize: '1.1rem' }}>check</span>
                              ) : (
                                <span aria-label="not included" className="text-on-surface-variant/30">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.emailSecurity}
        groupName="faq-email-security"
        eyebrow="Questions"
        heading="Frequently asked questions"
        description="What organisations ask us most often about DMARC, email impersonation and managed protection."
      />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-44 bg-background relative overflow-hidden border-t border-outline">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.12)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-12">
              GET TO
              <br />
              <span className="text-gradient-primary">ENFORCEMENT</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Talk to us and we'll get your domain protected and on its way to full enforcement — without breaking a single legitimate email.
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
                  Talk to us to get started
                </motion.button>
              </Link>
              <a href="#pricing" className="no-underline">
                <motion.button
                  className="border border-outline/50 hover:border-primary/40 text-on-surface font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See plans
                </motion.button>
              </a>
            </div>
            <p className="text-sm text-on-surface-variant/70 mt-8">
              Not ready? <Link to="/security-check" className="text-primary underline-offset-4 hover:underline">Run a free security check first</Link> — no signup needed.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default EmailSecurityPage;
