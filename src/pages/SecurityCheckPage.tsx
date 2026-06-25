import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { PostureScan } from '../components/PostureScan';
import { Faq } from '../components/Faq';
import { pageMeta, securityCheckSchema, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';
import { REPORT_PRICE_GBP, MONITORING_PRICE_GBP, REPORT_CHECKOUT_URL, MONITORING_CHECKOUT_URL } from '../config/posture';

const STATS = [
  { value: '40+', label: 'Individual checks' },
  { value: '6', label: 'Coverage areas' },
  { value: '100%', label: 'External & passive' },
  { value: 'None', label: 'Sign-up to scan' },
];

// Mirrors the report's section structure 1:1 (same titles, same checks per
// section) so the page and the delivered report reconcile exactly. Sourced from
// the engine's `comprehensive` profile + section assignments in scan-core
// score.ts (see Posture STATUS.md). Keep in sync if the profile/sections change.
const CHECK_GROUPS = [
  {
    icon: 'mark_email_read',
    title: 'Email Security',
    blurb: 'Can anyone send mail as you, and does yours get delivered?',
    items: ['SPF record & policy', 'SPF lookup budget', 'SPF hygiene', 'DKIM signatures & selectors', 'DKIM key strength', 'DMARC policy & enforcement', 'DMARC reporting', 'MTA-STS policy', 'MTA-STS enforcement mode', 'TLS-RPT reporting', 'BIMI verified logo', 'ARC forwarding integrity', 'Reverse DNS (FCrDNS)', 'Mail-server IP reputation', 'Mail delivery resilience', 'DNSSEC'],
  },
  {
    icon: 'public',
    title: 'Web & TLS',
    blurb: 'Is your website configured safely?',
    items: ['TLS version & ciphers', 'Certificate health & expiry', 'TLS hardening grade', 'HSTS', 'Content-Security-Policy', 'Clickjacking protection', 'MIME-sniffing protection', 'Referrer-Policy', 'Permissions-Policy', 'Cookie security flags', 'Mixed content', 'Server version disclosure', 'Security-header depth', 'CAA records'],
  },
  {
    icon: 'travel_explore',
    title: 'External Exposure',
    blurb: 'What can an attacker discover about you?',
    items: ['Subdomain discovery', 'Subdomain-takeover exposure', 'Certificate Transparency exposure', 'DNS zone-transfer (AXFR)', 'Wildcard DNS', 'Nameserver diversity', 'Domain expiry', 'Registrar transfer lock', 'security.txt disclosure policy'],
  },
  {
    icon: 'badge',
    title: 'Additional context',
    blurb: 'Extra intelligence we surface, for context.',
    items: ['Microsoft 365 footprint', 'Staff email-address pattern', 'Hostname naming exposure', 'Compliance framework alignment'],
  },
  {
    icon: 'fingerprint',
    title: 'Identity & Brand',
    blurb: 'Who could impersonate you?',
    items: ['Look-alike domains', 'Mail-enabled lookalike abuse'],
  },
  {
    icon: 'shield',
    title: 'Attack Surface',
    blurb: 'Can your infrastructure absorb an attack?',
    items: ['DDoS scrubbing coverage'],
  },
];

const WHAT_WE_CHECK = [
  {
    icon: 'mail',
    title: 'Email authentication: SPF, DKIM and DMARC',
    body: 'SPF tells receiving mail servers which systems are authorised to send email for your domain. DKIM adds a cryptographic signature so recipients can verify messages have not been tampered with. DMARC ties these together and tells receiving servers what to do when a message fails. Without an enforced DMARC policy, your domain can be spoofed and used in phishing attacks against your own customers, suppliers, and staff.',
  },
  {
    icon: 'public',
    title: 'Web and TLS health',
    body: 'The scan checks your TLS certificate validity and configuration and the presence of key HTTP security headers such as HSTS and Content-Security-Policy. Weak or expired certificates and missing headers are among the most common findings in external security assessments, and they directly affect whether browsers and customers treat your site as safe.',
  },
  {
    icon: 'travel_explore',
    title: 'External exposure',
    body: 'Subdomains created for old projects and never decommissioned stay visible to attackers. The scan maps the subdomains and services associated with your domain to show what is publicly facing. Forgotten DNS records pointing at decommissioned infrastructure are a well-documented source of subdomain takeover vulnerabilities.',
  },
];

const REPORT_ROWS = [
  { label: 'Overall security score and rating', free: true, full: true },
  { label: 'All 40+ checks, run on every scan', free: true, full: true },
  { label: 'Every finding flagged with a severity rating', free: true, full: true },
  { label: 'Plain-English risk: what each finding means for you', free: true, full: true },
  { label: 'Step-by-step fix for every issue', free: false, full: true },
  { label: 'Prioritised fix plan, in order of what matters most', free: false, full: true },
  { label: 'Downloadable PDF you can hand to IT or a supplier', free: false, full: true },
];

// The Posture line's paid products. The £50 report is self-serve (the door-opener);
// monitoring is the recurring posture product; hardening is done-for-you / quote-only.
const POSTURE_PRODUCTS = [
  {
    name: 'Full report',
    price: `£${REPORT_PRICE_GBP}`,
    unit: 'one-off',
    who: 'The complete breakdown with a step-by-step fix for every issue, prioritised in the order that matters.',
    features: ['Every finding, with the exact fix', 'Prioritised plan: what to do first', 'Downloadable PDF for IT or suppliers', 'Yours to keep — no subscription'],
    cta: 'Get the full report',
    href: REPORT_CHECKOUT_URL,
    featured: true,
    badge: 'Most popular',
    note: 'Credited back if you go on to a hardening project.',
  },
  {
    name: 'External Security Monitoring',
    price: `£${MONITORING_PRICE_GBP}`,
    unit: '/mo',
    who: 'We re-scan your domain every month and alert you the moment your security slips.',
    features: ['Monthly automatic re-scan', 'Alerts when something changes', 'Track your score over time', 'Cancel anytime'],
    cta: 'Start monitoring',
    href: MONITORING_CHECKOUT_URL,
    note: 'Threats and misconfigurations creep in over time. This catches them.',
  },
  {
    name: 'Hardening',
    price: 'Quote',
    unit: 'done-for-you',
    who: "Don't want to touch it yourself? We fix everything for you, all the way to a clean bill of health.",
    features: ['Hands-on remediation by us', 'Email, web, DNS & exposure fixes', 'Before/after proof scan', 'Enforced in 90 days, guaranteed'],
    cta: 'Talk to us',
    href: '/contact?intent=hardening',
    note: 'Fixed price per domain, no ongoing commitment.',
  },
];

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

export const SecurityCheckPage: React.FC = () => (
  <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
    <SEO
      {...pageMeta.securityCheck}
      schema={[
        securityCheckSchema,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Free Security Check', path: '/security-check' },
        ]),
        faqSchema(faqs.securityCheck),
      ]}
    />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-[0.16]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.55), transparent 70%)' }} />
    <div className="max-w-[1100px] mx-auto px-6 relative">

      {/* ── Hero + tool (above the fold) ─────────────────────────────── */}
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-6"
        >
          External Security
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
        >
          Free Domain <span className="text-gradient-primary">Security Check</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-on-surface-variant text-lg leading-relaxed"
        >
          The free front door to <span className="text-on-surface font-medium">External Security</span> — our outside-in protection for everything attackers can see. Run a free scan that checks over 40 points across your email security, web and TLS, external exposure, attack surface, and brand. No install, no sign-up, no access to your systems.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
        <PostureScan variant="page" />
      </motion.div>

      {/* ── Stat band ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
        {STATS.map(({ value, label }) => (
          <div key={label} className="rounded-2xl border border-outline/50 bg-surface/60 px-4 py-6 text-center">
            <div className="font-headline text-3xl md:text-4xl font-extrabold text-gradient-primary tracking-tight">{value}</div>
            <div className="text-on-surface-variant text-xs md:text-sm mt-1.5 leading-snug">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Everything we check ───────────────────────────────────────── */}
      <section className="mt-28">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">The full picture</span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-5">Over 40 checks, across six fronts</h2>
          <p className="max-w-3xl mx-auto text-on-surface-variant leading-relaxed">
            Most free scanners look at SPF and a TLS certificate and call it a day. This one runs the same comprehensive passive assessment we use in our paid audits, on every scan, entirely from the outside. Here is exactly what it looks at.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {CHECK_GROUPS.map(({ icon, title, blurb, items }, i) => (
            <Reveal key={title} delay={i % 2}>
              <div className="rounded-2xl border border-outline/50 bg-surface/60 p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-bold leading-tight">{title}</h3>
                    <p className="text-on-surface-variant/80 text-sm mt-1">{blurb}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-outline/30">
                  {items.map((item) => (
                    <li key={item} className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface border border-outline/40 rounded-full pl-2 pr-3 py-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary text-[14px]">check</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center mt-8">
          <p className="text-sm text-on-surface-variant/70 max-w-2xl mx-auto">
            The scanner runs entirely from outside your network, the same view an attacker has. It reads publicly available DNS records and public-facing services only. It never sends test emails, never logs in to anything, and never touches your internal systems.
          </p>
        </Reveal>
      </section>

      {/* ── Why it matters (plain English) ───────────────────────────── */}
      <section className="mt-28">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">Why it matters</span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-5">What the big findings mean for you</h2>
        </Reveal>
        <div className="flex flex-col gap-6">
          {WHAT_WE_CHECK.map(({ icon, title, body }, i) => (
            <Reveal key={title} delay={i}>
              <div className="rounded-2xl border border-outline/50 bg-surface/60 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold mb-3">{title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Who it is for ─────────────────────────────────────────────── */}
      <section className="mt-28">
        <Reveal>
          <div className="rounded-3xl border border-outline/60 bg-surface px-8 py-12 md:px-14 md:py-14 relative overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.14]" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(160,0,181,0.5), transparent 70%)' }} />
            <div className="relative">
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">Who it is for</span>
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-5">Built for UK businesses, free to run</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4 max-w-3xl">
                Half of UK businesses reported a cyber attack or breach in the UK Government's Cyber Security Breaches Survey 2024, and phishing remains the most common attack type. Misconfigured or missing SPF, DKIM and DMARC records mean your domain can be used to phish your own customers and suppliers without your knowledge.
              </p>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">
                The check is designed for IT managers, operations leads, and business owners who want a quick external view before a board update, a tender submission, a Cyber Essentials assessment, or a conversation with a security partner. The results are written in plain English, so you do not need to be technical to act on them.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── What happens after the free scan (priced posture products) ──── */}
      <section id="fix" className="mt-28 scroll-mt-28">
        <Reveal className="text-center mb-10">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">After the free scan</span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Know the fix, keep it fixed, or have us do it</h2>
          <p className="max-w-2xl mx-auto text-on-surface-variant leading-relaxed mt-5">
            The free scan shows you what's wrong and why it matters. When you're ready to act, pick the level of help that suits you — from a one-off report you action yourself to a done-for-you fix.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-[1000px] mx-auto">
          {POSTURE_PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i}>
              <div className={`group h-full rounded-2xl p-7 flex flex-col relative overflow-hidden transition-all ${p.featured ? 'bg-surface border-2 border-primary/40' : 'bg-surface/60 border border-outline/60 hover:border-primary/30'}`}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                {p.badge && (
                  <span className="self-start mb-3 text-[10px] uppercase tracking-[0.15em] font-bold text-white bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-1 rounded-full">{p.badge}</span>
                )}
                <h3 className="font-headline text-xl font-bold mb-1">{p.name}</h3>
                <p className="text-on-surface-variant text-sm min-h-[4rem] mb-3">{p.who}</p>
                <div className="mb-4 flex items-end gap-1.5">
                  <span className="font-headline text-4xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-on-surface-variant text-sm mb-1.5">{p.unit}</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '1.05rem' }}>check</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-on-surface-variant/70 mb-5 leading-relaxed">{p.note}</p>
                <a href={p.href} className="no-underline mt-auto">
                  <button className={`w-full font-headline font-bold px-5 py-3 rounded-lg text-sm transition-all ${p.featured ? 'btn-animated text-white' : 'border border-outline/60 text-on-surface hover:border-primary/40'}`}>
                    {p.cta}
                  </button>
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 mb-8 text-center">
          <h3 className="font-headline text-2xl font-bold tracking-tight">Free scan vs full report</h3>
          <p className="max-w-xl mx-auto text-on-surface-variant leading-relaxed mt-3 text-sm">
            The free scan tells you <em>what</em> is wrong. The £{REPORT_PRICE_GBP} report tells you exactly <em>how</em> to fix it.
          </p>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-outline/50 bg-surface/60 overflow-hidden max-w-3xl mx-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline/60">
                  <th className="px-6 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant">Included</th>
                  <th className="px-4 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant text-center">Free scan</th>
                  <th className="px-4 py-4 text-sm font-label uppercase tracking-wider text-primary text-center">Full report · £{REPORT_PRICE_GBP}</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_ROWS.map(({ label, free, full }) => (
                  <tr key={label} className="border-b border-outline/30 last:border-0">
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{label}</td>
                    <td className="px-4 py-4 text-center">
                      <span aria-label={free ? 'Included' : 'Not included'} className={`material-symbols-outlined text-[18px] ${free ? 'text-primary' : 'text-on-surface-variant/30'}`}>{free ? 'check_circle' : 'remove'}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span aria-label={full ? 'Included' : 'Not included'} className={`material-symbols-outlined text-[18px] ${full ? 'text-primary' : 'text-on-surface-variant/30'}`}>{full ? 'check_circle' : 'remove'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal className="text-center mt-8">
          <p className="text-sm text-on-surface-variant/70 max-w-2xl mx-auto">
            The scan uses only publicly available DNS and web data. We keep scan results so we can generate your report, and we never sell or share your details with third parties. See our <Link to="/privacy" className="text-primary underline-offset-4 hover:underline">privacy policy</Link>.
          </p>
        </Reveal>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.securityCheck}
        groupName="faq-security-check"
        eyebrow="Common questions"
        heading="Domain security, answered"
        compact
        className="mt-12"
      />

      {/* ── Next step bridge ──────────────────────────────────────────── */}
      <section className="mt-16">
        <Reveal>
          <div className="text-center rounded-2xl border border-outline/50 bg-surface/60 px-8 py-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-4">Found something you want fixed?</h2>
            <p className="text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-8">
              Get the £{REPORT_PRICE_GBP} full report and you'll have the exact fix for every finding, prioritised and ready to action. A free scan commits you to nothing.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href={REPORT_CHECKOUT_URL} className="no-underline inline-block">
                <motion.button
                  className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get the full report · £{REPORT_PRICE_GBP}
                </motion.button>
              </a>
              <Link to="/contact?intent=hardening" className="no-underline inline-block">
                <motion.button
                  className="border border-outline/50 hover:border-primary/40 text-on-surface font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Have us fix it for you
                </motion.button>
              </Link>
            </div>
            <p className="text-sm text-on-surface-variant/70 mt-8">
              Specifically worried about email impersonation and DMARC? Our{' '}
              <Link to="/services/email-security" className="text-primary underline-offset-4 hover:underline">Managed DMARC</Link>{' '}
              service walks your domain safely to full enforcement, done for you.
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  </main>
);

export default SecurityCheckPage;
