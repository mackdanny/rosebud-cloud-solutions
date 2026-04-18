import { useState } from 'react';
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

export const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="pt-28 md:pt-36">
      <SEO
        {...pageMeta.contact}
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: pageMeta.contact.path },
        ])}
      />
      <section className="pt-10 md:pt-16 pb-20 md:pb-28 bg-background relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: 'rgba(160, 0, 181, 0.08)' }}
        />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left — Info */}
            <div>
              <ScrollReveal>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4 block">
                  Get in Touch
                </span>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                  Let's Build Something{' '}
                  <span className="text-gradient-primary">Secure Together</span>
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-12 max-w-lg">
                  Whether you're starting a cloud transformation, need a security assessment, or want to
                  optimise your Azure estate — we're here to help.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={1}>
                <div className="space-y-8">
                  {[
                    { icon: 'mail', label: 'Email', value: 'hello@rosebudcloudsolutions.co.uk' },
                    { icon: 'location_on', label: 'Location', value: 'United Kingdom' },
                    { icon: 'schedule', label: 'Response Time', value: 'Within 24 hours' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '1.2rem' }}>{icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-1">{label}</p>
                        <p className="text-white font-headline font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Form */}
            <ScrollReveal delay={1}>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl pointer-events-none" />
                <div className="relative bg-surface p-8 md:p-10 rounded-2xl border border-outline/40">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>check_circle</span>
                      </div>
                      <h3 className="font-headline text-2xl font-bold mb-3">Message Sent</h3>
                      <p className="text-on-surface-variant">We'll be in touch within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formState.name}
                            onChange={handleChange}
                            className="w-full bg-surface-container border border-outline/40 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/60 transition-colors"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formState.email}
                            onChange={handleChange}
                            className="w-full bg-surface-container border border-outline/40 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/60 transition-colors"
                            placeholder="you@company.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formState.company}
                          onChange={handleChange}
                          className="w-full bg-surface-container border border-outline/40 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/60 transition-colors"
                          placeholder="Your company"
                        />
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-2">
                          What can we help with?
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formState.service}
                          onChange={handleChange}
                          className="w-full bg-surface-container border border-outline/40 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/60 transition-colors appearance-none"
                        >
                          <option value="">Select a service</option>
                          <option value="azure-landing-zones">Azure Foundation & Landing Zones</option>
                          <option value="cloud-security">Cloud Security & Compliance</option>
                          <option value="devsecops">Secure DevOps & Automation</option>
                          <option value="cloud-optimisation">Cloud Optimisation</option>
                          <option value="advisory">Advisory & Consulting</option>
                          <option value="managed-cloud">Managed Cloud Support</option>
                          <option value="strategic-triage">Strategic Triage Engine</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-label uppercase tracking-wider text-on-surface-variant/60 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formState.message}
                          onChange={handleChange}
                          className="w-full bg-surface-container border border-outline/40 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
                          placeholder="Tell us about your project or challenge..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full btn-animated text-white font-headline font-bold px-8 py-4 rounded-lg text-base tracking-tight"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Send Message
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
