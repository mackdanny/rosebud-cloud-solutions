import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { SITE_NAME } from '../config/site';

const popularLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services/azure-landing-zones' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
] as const;

export const NotFoundPage: React.FC = () => {
  return (
    <main className="pt-24 min-h-screen flex flex-col">
      <SEO
        title={`Page Not Found | ${SITE_NAME}`}
        description="The page you're looking for doesn't exist. Browse our services, case studies, or contact our Azure architects."
        noindex
      />

      <section className="relative flex-1 flex items-center justify-center px-8 py-24 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.span
            className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Error 404
          </motion.span>

          <motion.h1
            className="font-headline text-[4rem] md:text-[7rem] leading-[0.9] font-extrabold tracking-tighter mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Page Not <span className="text-gradient-primary">Found</span>
          </motion.h1>

          <motion.p
            className="text-on-surface-variant text-lg leading-relaxed mb-12 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            The page you're looking for has moved or never existed. Try one of these instead:
          </motion.p>

          <motion.nav
            className="flex flex-wrap justify-center gap-3 mb-12"
            aria-label="Popular pages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {popularLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-label font-bold border border-outline/60 hover:border-primary/50 hover:bg-primary/5 text-on-surface transition-colors rounded-lg no-underline"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/" className="no-underline">
              <motion.button
                className="btn-animated text-white font-headline font-bold px-10 py-4 rounded-lg text-base tracking-tight"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Back to Homepage
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
