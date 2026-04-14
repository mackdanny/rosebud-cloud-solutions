import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavProps {
  readonly className?: string;
}

const serviceLinks = [
  { label: 'Azure Foundation & Landing Zones', href: '/services/azure-landing-zones', icon: 'cloud_done' },
  { label: 'Cloud Security & Compliance',       href: '/services/cloud-security',        icon: 'security' },
  { label: 'Secure DevOps & Automation',         href: '/services/devsecops',             icon: 'terminal' },
  { label: 'Cloud Optimisation & Improvement',  href: '/services/cloud-optimisation',    icon: 'trending_up' },
  { label: 'Cloud Architecture & Design',        href: '/services/advisory-consulting',    icon: 'architecture' },
  { label: 'Managed Cloud & Security Support',  href: '/services/managed-cloud',         icon: 'shield' },
  { label: 'Strategic Triage Engine',           href: '/tools/strategic-triage',         icon: 'hub' },
];

const otherLinks = [
  { label: 'How We Work',  href: '/how-we-work' },
  { label: 'Case Studies', href: '/' },
  { label: 'About',        href: '/about' },
];

export const Nav: React.FC<NavProps> = ({ className = '' }) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropdownOpen(true);  };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 120); };

  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/tools');

  return (
    <motion.header
      className={`glass-header fixed top-0 left-0 right-0 z-50 border-b border-outline h-28 flex items-center ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center w-full max-w-[1440px] mx-auto px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/rcs-logo-full.png" alt="Rosebud Cloud Solutions" className="h-28 w-auto" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-10 ml-12">

          {/* ── Home ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <Link
              to="/"
              className={`text-base font-medium font-headline transition-colors duration-300 relative group ${
                location.pathname === '/' ? 'text-white' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          </motion.div>

          {/* ── Services (with dropdown) ─────────────────────────────── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              className={`flex items-center gap-1 text-base font-medium font-headline transition-colors duration-300 relative group ${
                isServicesActive ? 'text-white' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              Services
              <motion.span
                className="material-symbols-outlined text-[16px] mt-px"
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                expand_more
              </motion.span>
              {/* Underline */}
              <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                isServicesActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: 'rgba(11, 15, 42, 0.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(45,52,91,0.8)' }}
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  {/* Top accent */}
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                  <div className="py-2">
                    {serviceLinks.map(({ label, href, icon }) => {
                      const isActive = location.pathname === href;
                      return (
                        <Link
                          key={href}
                          to={href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 group/item transition-colors duration-200 ${
                            isActive ? 'bg-primary/15 text-white' : 'hover:bg-primary/10 text-on-surface-variant hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '1.1rem' }}>
                            {icon}
                          </span>
                          <span className="text-sm font-medium font-headline leading-snug flex-1">{label}</span>
                          <span className="material-symbols-outlined text-primary/0 group-hover/item:text-primary/70 transition-colors shrink-0" style={{ fontSize: '0.9rem' }}>
                            arrow_forward
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Other links ──────────────────────────────────────────── */}
          {otherLinks.map(({ label, href }, i) => {
            const isActive = location.pathname === href && href !== '/';
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + i * 0.08, duration: 0.4 }}
              >
                <Link
                  to={href}
                  className={`text-base font-medium font-headline transition-colors duration-300 relative group ${
                    isActive ? 'text-white' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* CTA */}
        <motion.button
          className="ml-auto bg-transparent text-white text-sm font-semibold font-headline px-6 py-2 rounded-lg border border-primary/40 hover:bg-primary/10 transition-all duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05, borderColor: 'rgba(160,0,181,0.8)' }}
          whileTap={{ scale: 0.97 }}
        >
          Contact Us
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Nav;
