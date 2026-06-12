import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { PostureScan } from '../components/PostureScan';
import { Faq } from '../components/Faq';
import { pageMeta, securityCheckSchema, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';

const CHECKS = [
  { icon: 'mail', title: 'Email security', body: 'SPF, DKIM, DMARC and spoofing exposure.' },
  { icon: 'public', title: 'Web and TLS', body: 'Certificates, headers and exposed services.' },
  { icon: 'travel_explore', title: 'External surface', body: 'Subdomains and attacker-visible footprint.' },
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
    title: 'External attack surface',
    body: 'Subdomains created for old projects and never decommissioned stay visible to attackers. The scan maps the subdomains and services associated with your domain to show what is publicly facing. Forgotten DNS records pointing at decommissioned infrastructure are a well-documented source of subdomain takeover vulnerabilities.',
  },
];

const REPORT_ROWS = [
  { label: 'Overall security score and rating', free: true, full: true },
  { label: 'Issue count across email, web and exposure', free: true, full: true },
  { label: 'Every finding with a severity rating', free: false, full: true },
  { label: 'Plain-English explanation of why each finding matters', free: false, full: true },
  { label: 'Private link you can share with your IT team', free: false, full: true },
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
          Free tool
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
          How exposed is your domain? Run a free external scan of your SPF, DKIM and DMARC records, TLS configuration, and attacker-visible services in around 15 seconds. No install, no sign-up, no access to your systems.
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
        <PostureScan variant="page" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {CHECKS.map(({ icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-outline/50 bg-surface/60 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-4">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
            </div>
            <h2 className="font-headline text-lg font-bold mb-2">{title}</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* ── What we check and why it matters ─────────────────────────── */}
      <section className="mt-28">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">Under the hood</span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-5">What the scan checks and why it matters</h2>
          <p className="max-w-3xl mx-auto text-on-surface-variant leading-relaxed">
            The scanner runs entirely from outside your network, the same view an attacker has. It reads publicly available DNS records and public-facing services only. It never sends test emails, never logs in to anything, and never touches your internal systems.
          </p>
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

      {/* ── Free scan vs full report ──────────────────────────────────── */}
      <section className="mt-28">
        <Reveal className="text-center mb-10">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">What you get</span>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Instant result vs full report</h2>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl border border-outline/50 bg-surface/60 overflow-hidden max-w-3xl mx-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline/60">
                  <th className="px-6 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant">Included</th>
                  <th className="px-4 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant text-center">Instant</th>
                  <th className="px-4 py-4 text-sm font-label uppercase tracking-wider text-primary text-center">Full report</th>
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
              If your scan shows gaps in email authentication or exposed services, our <Link to="/services/cloud-security" className="text-primary underline-offset-4 hover:underline">cloud security team</Link> can walk you through remediation, or harden the pipeline that caused it with <Link to="/services/devsecops" className="text-primary underline-offset-4 hover:underline">DevSecOps</Link>. Want to understand what fixing it involves before we talk? Our <Link to="/insights/set-up-dmarc-microsoft-365" className="text-primary underline-offset-4 hover:underline">DMARC guide for Microsoft 365</Link> explains the process. A free scan commits you to nothing.
            </p>
            <Link to="/contact" className="no-underline inline-block">
              <motion.button
                className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Talk to us about your results
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  </main>
);

export default SecurityCheckPage;
