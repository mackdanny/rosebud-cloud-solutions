import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { PostureScan } from '../components/PostureScan';
import { pageMeta } from '../data/seoMeta';

const CHECKS = [
  { icon: 'mail', title: 'Email security', body: 'SPF, DKIM, DMARC and spoofing exposure.' },
  { icon: 'public', title: 'Web and TLS', body: 'Certificates, headers and exposed services.' },
  { icon: 'travel_explore', title: 'External surface', body: 'Subdomains and attacker-visible footprint.' },
];

export const SecurityCheckPage: React.FC = () => (
  <main className="pt-32 md:pt-40 pb-32 bg-background relative overflow-hidden">
    <SEO {...pageMeta.securityCheck} />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-[0.16]" style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgba(160,0,181,0.55), transparent 70%)' }} />
    <div className="max-w-[1100px] mx-auto px-6 relative">
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
          How exposed is your domain?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-on-surface-variant text-lg leading-relaxed"
        >
          Run a free external security scan in seconds and see your risks from an attacker point of view. No install, no access to your systems.
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
    </div>
  </main>
);

export default SecurityCheckPage;
