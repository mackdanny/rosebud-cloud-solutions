import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { pageMeta, breadcrumbSchema } from '../data/seoMeta';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

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

const LAST_UPDATED = '8 July 2026';

const sections = [
  {
    heading: 'Who We Are',
    body: `Rosebud Cloud Solutions Ltd is a company registered in England and Wales (company number 14500087, VAT number 439 921 563). Our registered address is in Worthing, West Sussex, United Kingdom. When this policy refers to "we", "us", or "our", it means Rosebud Cloud Solutions Ltd.\n\nIf you have any questions about how we handle your data, you can contact us at hello@rosebudcloudsolutions.co.uk.`,
  },
  {
    heading: 'What Data We Collect',
    body: `We collect personal data only when you actively provide it through our website. This includes:\n\n• Contact form — your name, email address, company name (optional), the service you are enquiring about, and your message.\n• AI chatbot — the messages you send during a conversation. If you choose to share your name, email, or topic of interest with the chatbot, those details are also collected.\n• Security scan — when you run a free security scan, the domain you ask us to scan and the email address you provide to receive your results.\n\nWe do not collect data passively through tracking cookies, analytics scripts, or advertising pixels. Our website does not use Google Analytics, Facebook Pixel, or any similar third-party tracking technology.`,
  },
  {
    heading: 'How We Use Your Data',
    body: `We use the data you provide for the following purposes:\n\n• To respond to your enquiry or request for consultation.\n• To understand the nature of your requirements so we can prepare for an initial conversation.\n• To operate the AI chatbot and provide helpful responses during your session.\n\nIf you run a security scan or share your business email with us, we may contact you about security services relevant to your results. We rely on our legitimate interest in offering relevant services to organisations that have engaged with us, and you can opt out at any time using the unsubscribe link in any message, or by emailing us. Beyond that, we do not profile you, make automated decisions about you, or sell your personal data.`,
  },
  {
    heading: 'Security Scan and Dashboard',
    body: `When you run a free security scan on our website, we collect the domain you ask us to scan and the email address you provide. We use these to run the scan, generate your security findings, and set up a free security dashboard where you can view them. We email you a one-time link to sign in to that dashboard, no password needed.\n\nThe scan only inspects information that is already publicly visible about a domain, such as its public DNS records and its published email and web security settings. It does not access anything private, and it does not attempt to log in to any system.\n\nOur legal basis for this is legitimate interest: you have asked us to assess a domain and show you the results, and you provide your email so that we can deliver them. The dashboard is the default way we deliver your results; you can instead choose to have the report emailed to you, and you can ask us to delete your account and data at any time by emailing hello@rosebudcloudsolutions.co.uk.`,
  },
  {
    heading: 'Legal Basis for Processing',
    body: `Under UK GDPR, our legal basis for processing your personal data is legitimate interest — specifically, responding to a business enquiry that you have initiated. Where you provide your data through our contact form or chatbot, you are doing so voluntarily and with a reasonable expectation that we will use it to respond.`,
  },
  {
    heading: 'Third-Party Services',
    body: `Your data passes through a small number of third-party services in order to reach us:\n\n• Web3Forms — our contact form and chatbot transcripts are delivered to our inbox via Web3Forms (web3forms.com), an email relay service. Web3Forms processes the data only to deliver it and does not store it long-term.\n• Anthropic (Claude API) — our AI chatbot uses the Claude language model to generate responses. Your messages are sent to Anthropic's API for processing. Anthropic's data handling is governed by their own privacy policy and API terms.\n• Cloudflare — our chatbot backend runs on Cloudflare Workers. Cloudflare processes requests in transit but does not store conversation data.\n\nWe do not share your data with any other third parties, and we do not sell personal data under any circumstances.`,
  },
  {
    heading: 'Cookies and Local Storage',
    body: `Our website does not set tracking cookies or advertising cookies.\n\nWe use a single localStorage entry (a timestamp) to control whether our introductory animation plays on repeat visits. This contains no personal information and is stored only in your browser. You can clear it at any time through your browser settings.\n\nNo other cookies or local storage mechanisms are used.`,
  },
  {
    heading: 'Data Retention',
    body: `Contact form submissions and chatbot transcripts are delivered to our email inbox and retained only as long as necessary to respond to your enquiry and for reasonable record-keeping.\n\nWhen you run a scan we store your results and, if created, your free dashboard account so you can return to them. If an account is inactive and has not become a customer, we delete it and its scan data after 24 months. If you become a customer, we keep your data for the duration of our relationship and the period our legal and accounting obligations require afterwards. You can ask us to delete your data at any time.\n\nChatbot conversations are not stored on our servers. They exist in your browser session only and are discarded when you close or navigate away from the page. A transcript may be sent to our inbox for follow-up purposes.`,
  },
  {
    heading: 'Your Rights',
    body: `Under UK GDPR, you have the right to:\n\n• Access the personal data we hold about you.\n• Request correction of inaccurate data.\n• Request deletion of your data.\n• Object to or restrict our processing of your data.\n• Request a copy of your data in a portable format.\n\nTo exercise any of these rights, contact us at hello@rosebudcloudsolutions.co.uk. We will respond within 30 days.`,
  },
  {
    heading: 'Children',
    body: `Our services are aimed at businesses and professionals. We do not knowingly collect personal data from anyone under the age of 18.`,
  },
  {
    heading: 'Changes to This Policy',
    body: `We may update this policy from time to time. The date at the top of this page shows when it was last revised. We encourage you to review this page periodically.`,
  },
] as const;

export function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title={pageMeta.privacy.title}
        description={pageMeta.privacy.description}
        path={pageMeta.privacy.path}
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
        ]}
      />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative pt-48 pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
          </div>
          <div className="max-w-3xl mx-auto px-8">
            <ScrollReveal className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4">
                Legal
              </p>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-background mb-6">
                Privacy Policy
              </h1>
              <p className="text-on-surface-variant text-sm">
                Last updated: {LAST_UPDATED}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Content ───────────────────────────────────────────────── */}
        <section className="pb-32">
          <div className="max-w-3xl mx-auto px-8 space-y-16">
            {sections.map(({ heading, body }, i) => (
              <ScrollReveal key={heading} delay={i * 0.5}>
                <h2 className="text-xl font-headline font-bold text-on-background mb-4">
                  {heading}
                </h2>
                <div className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line">
                  {body}
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={sections.length * 0.5}>
              <div className="pt-8 border-t border-outline">
                <p className="text-on-surface-variant text-sm">
                  If you have any questions about this policy, please{' '}
                  <Link
                    to="/contact"
                    className="text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    get in touch
                  </Link>
                  .
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
