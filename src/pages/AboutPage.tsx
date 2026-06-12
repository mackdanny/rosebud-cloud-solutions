import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Faq } from '../components/Faq';
import { pageMeta, breadcrumbSchema, faqSchema } from '../data/seoMeta';
import { faqs } from '../data/faqs';
import { SITE_URL } from '../config/site';

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Scroll-triggered wrapper ─────────────────────────────────────────────────

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

// ─── Team Data ────────────────────────────────────────────────────────────────

const teamMembers = [
  {
    name: 'Alex Hunte',
    role: 'Founder & Lead Architect',
    bio: 'Oversees cloud architecture and automation at Rosebud Cloud Solutions, delivering secure, scalable platforms and helping organisations streamline operations. With extensive experience across Microsoft Azure, DevOps and cloud governance, he turns complex challenges into straightforward, reliable solutions that enable teams to move faster and safer.',
    linkedin: 'https://www.linkedin.com/in/alex-hunte-ab716a45/',
    photo: `${import.meta.env.BASE_URL}team-alex.webp`,
  },
  {
    name: 'Hannah Hunte',
    role: 'Co-Founder & Operations Lead',
    bio: 'Leads operations and process assurance at Rosebud Cloud Solutions, ensuring the business and its clients run efficiently, securely and with strong governance. With experience across IT process management, finance and service operations, she helps organisations improve control, clarity and consistency while enabling teams to scale with confidence.',
    linkedin: 'https://www.linkedin.com/in/hannah-hunte-b834a85a/',
    photo: `${import.meta.env.BASE_URL}team-hannah.webp`,
  },
  {
    name: 'Daniel Macken',
    role: 'Business Development Lead',
    bio: 'Leads business development at Rosebud Cloud Solutions, working closely with clients to understand their goals and translate them into the right cloud and automation solutions. With a focus on relationships, clarity, and long-term value, he helps organisations navigate complex technology decisions with confidence.',
    linkedin: 'https://www.linkedin.com/in/daniel-macken-41869b38b/',
    photo: `${import.meta.env.BASE_URL}team-daniel.webp`,
  },
  {
    name: 'Hani Jafri',
    role: 'Azure Solutions Architect',
    bio: 'Designs and delivers secure, scalable Azure solutions at Rosebud Cloud Solutions, helping organisations build well-architected cloud platforms aligned to their business goals. With deep expertise across Azure infrastructure, identity, networking and governance, he turns complex requirements into clear, resilient designs built for long-term success.',
    linkedin: 'https://www.linkedin.com/in/hanijafri/',
    photo: `${import.meta.env.BASE_URL}team-hani.webp`,
  },
  {
    name: 'Raza Jafri',
    role: 'Azure Cloud Engineer',
    bio: 'Implements and optimises Azure environments at Rosebud Cloud Solutions, ensuring cloud platforms are reliable, secure and efficiently operated. With hands-on experience across infrastructure, automation and day-to-day operations, he helps organisations run and scale their cloud environments with confidence.',
    linkedin: 'https://www.linkedin.com/in/raza--jafri/',
    photo: `${import.meta.env.BASE_URL}team-raza.webp`,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface AboutPageProps {
  readonly className?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ className = '' }) => {
  const teamPersonSchemas = teamMembers.map((m) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: m.name,
    jobTitle: m.role,
    // Schema.org requires absolute image URLs; m.photo is site-relative.
    image: `${SITE_URL}${m.photo}`,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    sameAs: [m.linkedin],
    description: m.bio,
  }));

  return (
    <main className={className}>
      <SEO
        {...pageMeta.about}
        schema={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: pageMeta.about.path },
          ]),
          ...teamPersonSchemas,
          faqSchema(faqs.about),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.10) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary font-bold font-label mb-6">
                About Us
              </span>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-8">
                Built on expertise.{' '}
                <span className="text-gradient-primary">Driven by partnership.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                Rosebud Cloud Solutions is a cloud and automation consultancy focused on helping organisations build secure, scalable, and well-governed platforms.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={3}>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
                We specialise in Automation, Cloud Security, and DevOps (DevSecOps), working with teams who know they need to improve their IT environment but want clear direction and practical delivery.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={4}>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                With over a decade of experience across cloud migrations, integrations, and security-critical systems, we've supported clients ranging from global retailers to financial institutions and cloud providers. We bring a calm, structured approach to complex problems and partner closely with our clients to help them grow.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Meet the Team ────────────────────────────────────────────── */}
      <section id="team" className="scroll-mt-24 py-28 bg-surface/30 border-t border-outline relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(160,0,181,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <ScrollReveal className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-label mb-4 block">
              The People Behind the Platform
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
              Meet the Team
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                className="group relative overflow-hidden bg-surface border border-outline/60 rounded-2xl flex flex-col"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-10 flex flex-col h-full">
                  {/* Photo - responsive srcset: 400w for <= 600px viewports, 800w otherwise */}
                  <div className="w-[168px] h-[168px] rounded-full overflow-hidden border-[3px] border-primary/30 mb-8 shrink-0">
                    <img
                      src={member.photo}
                      srcSet={`${member.photo.replace(/\.webp$/, '-sm.webp')} 400w, ${member.photo} 800w`}
                      sizes="(max-width: 768px) 200px, 336px"
                      alt={member.name}
                      width={168}
                      height={168}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-headline text-2xl font-bold mb-1">{member.name}</h3>
                  <span className="text-[11px] font-label uppercase tracking-[0.25em] text-primary/70 mb-5 block">{member.role}</span>

                  {/* Bio */}
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1">
                    {member.bio}
                  </p>

                  {/* LinkedIn button */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start"
                  >
                    <motion.span
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-white hover:border-primary/60 hover:bg-primary/10 transition-all duration-300"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </motion.span>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <Faq
        items={faqs.about}
        groupName="faq-about"
        eyebrow="Questions"
        heading="Frequently asked questions"
        description="What prospective clients ask us most often about the team, our approach, and how we work."
      />

    </main>
  );
};

export default AboutPage;
