import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, serviceSchema, breadcrumbSchema } from '../data/seoMeta';

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

const rateLines: { icon: string; text: string }[] = [
  { icon: 'group', text: 'Minimum 5 domains to start, nothing more' },
  { icon: 'inventory_2', text: 'Parked and inactive domains free, unlimited' },
  { icon: 'all_inclusive', text: 'No email volume metering, ever' },
  { icon: 'event_repeat', text: 'Month to month, cancel anytime' },
];

const volumeBreaks: { band: string; price: string }[] = [
  { band: '5-49 domains', price: 'Standard rate' },
  { band: '50-199 domains', price: 'Volume rate' },
  { band: '200+ domains', price: 'Custom' },
];

const whatYouGet: { icon: string; title: string; body: string }[] = [
  {
    icon: 'palette',
    title: 'White-label reporting',
    body: 'Board-ready PDF reports and monthly summaries carrying your logo and your colours. Your brand on the reports your customers keep.',
  },
  {
    icon: 'dashboard',
    title: 'One console, every customer',
    body: 'All your client domains under one login: enforcement progress, senders, alerts and drift, without juggling portals.',
  },
  {
    icon: 'dns',
    title: 'The engine we use ourselves',
    body: 'Hosted DMARC with enforcement safety gates. The same platform behind the managed service we sell direct, so nothing breaks on the way to p=reject.',
  },
  {
    icon: 'api',
    title: 'Partner API',
    body: 'Provision domains and pull live status programmatically from your own tooling, so onboarding and billing fit how you already work.',
  },
  {
    icon: 'support_agent',
    title: 'UK engineers behind you',
    body: 'Stuck sender, strange forwarder, nervous customer? Escalate to the engineers who built the platform. You stay the hero in front of your client.',
  },
  {
    icon: 'payments',
    title: 'Pricing you can plan on',
    body: 'A published rate card, no metering and no surprise repricing. You set the retail price; the margin is yours.',
  },
];

const steps: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Talk to us',
    body: 'Tell us about your customer base. We agree terms, set up your partner account and lock your founding-partner pricing.',
  },
  {
    n: '02',
    title: 'We onboard together',
    body: 'Your first client domains go live with our engineers alongside you, white-labelled reporting included from the start.',
  },
  {
    n: '03',
    title: 'You sell at your price',
    body: 'You own the customer relationship and the retail price. We stay in the engine room and keep every domain healthy.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface PartnersPageProps {
  readonly className?: string;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ className = '' }) => {
  return (
    <main className={`pt-24 ${className}`}>
      <SEO
        {...pageMeta.partners}
        schema={[
          serviceSchema({
            name: 'DMARC Partner Programme',
            description: pageMeta.partners.description,
            path: pageMeta.partners.path,
            serviceType: 'White-Label Managed DMARC for MSPs',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Partner Programme', path: pageMeta.partners.path },
          ]),
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
                Partner programme
              </span>
            </motion.div>

            <h1 className="font-headline text-[3.5rem] md:text-[5.5rem] leading-[1.0] font-extrabold tracking-tighter mb-8">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                Sell managed DMARC
              </motion.span>
              <motion.span
                className="block text-gradient-primary"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              >
                under your own brand
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed max-w-2xl mb-12 border-l-2 border-primary/20 pl-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
            >
              For MSPs, IT providers and agencies. White-label our DMARC platform, resell it at your
              price, and keep our UK engineers behind your team. Flat per-domain wholesale, and the
              full rate card on the first call.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/contact?service=partner-programme" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-12 py-5 rounded-lg text-lg tracking-tight"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Talk partnership
                </motion.button>
              </Link>
              <a href="#rates" className="text-sm text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-colors">
                Or see how partner pricing works first →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why now ──────────────────────────────────────────────────── */}
      <section className="py-16 px-8 md:px-24 bg-background border-y border-outline">
        <ScrollReveal className="max-w-[1100px] mx-auto text-center">
          <p className="text-lg md:text-2xl text-on-surface leading-relaxed font-light">
            Since 2024 <span className="text-gradient-primary font-semibold">Google and Yahoo</span>, joined by
            <span className="text-gradient-primary font-semibold"> Microsoft in May 2025</span>, reject or junk
            mail from senders who fail email authentication. Every one of your customers now needs DMARC done
            properly, and they will buy it from someone. The only question is whether that someone is
            <span className="text-gradient-primary font-semibold"> you</span>.
          </p>
        </ScrollReveal>
      </section>

      {/* ── Rate card ────────────────────────────────────────────────── */}
      <section id="rates" className="py-28 px-8 md:px-24 bg-surface scroll-mt-24">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              Partner pricing
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              Simple wholesale, no games
            </h2>
            <p className="text-on-surface-variant max-w-xl mt-4">
              The big DMARC vendors put partners through qualification mazes, 10-domain minimums and
              opaque commitments. Ours is one flat per-domain rate, quoted in full on the first call,
              with the structure public below and UK engineers you can actually ring.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch max-w-[1100px]">
            <ScrollReveal className="lg:col-span-3 h-full">
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-background p-8 md:p-10 h-full flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <span className="self-start mb-4 text-[10px] uppercase tracking-[0.15em] font-bold text-white bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-1 rounded-full">
                  Every active domain
                </span>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">Flat per-domain wholesale</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-6">
                  One rate per active domain per month. We quote it in full on the first call, no
                  qualification maze first.
                </p>
                <ul className="space-y-3.5 flex-1">
                  {rateLines.map((line) => (
                    <li key={line.text} className="flex items-start gap-3 text-sm text-on-surface">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '1.1rem' }}>
                        {line.icon}
                      </span>
                      <span>{line.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-on-surface-variant text-sm mt-6 pt-6 border-t border-outline/40">
                  UK MSPs typically charge £75 to £200 per domain per month for managed DMARC.
                  The platform underneath is a fraction of that. You set the retail price, and the
                  margin is yours.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1} className="lg:col-span-2 h-full">
              <div className="rounded-2xl border border-outline/60 bg-background p-8 h-full flex flex-col">
                <h3 className="font-headline text-lg font-bold mb-5">Volume pricing</h3>
                <ul className="space-y-4">
                  {volumeBreaks.map((v) => (
                    <li key={v.band} className="flex items-center justify-between gap-4 text-sm border-b border-outline/40 pb-4 last:border-0">
                      <span className="text-on-surface-variant">{v.band}</span>
                      <span className="font-headline font-bold text-on-surface whitespace-nowrap">{v.price}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-on-surface-variant text-sm mt-auto pt-6">
                  <strong className="text-on-surface">Founding partners:</strong> our first cohort of MSPs
                  gets locked pricing and direct engineer access. Ask us on the call.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-background border-t border-outline">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              What partners get
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              Your brand out front. Our engine underneath.
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
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
                className="rounded-2xl border border-outline/50 bg-surface/60 p-7"
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

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-32 px-8 md:px-24 bg-surface border-t border-outline">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label block mb-4">
              How it works
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
              Live in days, not quarters
            </h2>
            <p className="text-on-surface-variant max-w-xl mt-4">
              No certification maze, no channel bureaucracy. We onboard your first domains with you and
              stay reachable afterwards.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mt-6" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
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
        </div>
      </section>

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
              YOUR BRAND.
              <br />
              <span className="text-gradient-primary">OUR ENGINE.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Tell us about your customer base and we'll have founding-partner terms in front of you
              this week.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link to="/contact?service=partner-programme" className="no-underline">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Talk partnership
                </motion.button>
              </Link>
              <Link to="/services/email-security" className="no-underline">
                <motion.button
                  className="border border-outline/50 hover:border-primary/40 text-on-surface font-headline font-bold px-14 py-6 rounded-lg text-xl tracking-tight transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See the product
                </motion.button>
              </Link>
            </div>
            <p className="text-sm text-on-surface-variant/70 mt-8">
              Buying for your own organisation instead?{' '}
              <Link to="/services/email-security#pricing" className="text-primary underline-offset-4 hover:underline">
                See the Managed DMARC plans
              </Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default PartnersPage;
