import { Link } from 'react-router-dom';
import { INSIGHTS_ENABLED, REPORTS_ENABLED } from '../config/features';

interface FooterProps {
  readonly className?: string;
}

const footerSolutions = [
  { label: 'Azure Landing Zones', href: '/services/azure-landing-zones' },
  { label: 'Cloud Security', href: '/services/cloud-security' },
  { label: 'DevSecOps', href: '/services/devsecops' },
  { label: 'Cloud Optimisation', href: '/services/cloud-optimisation' },
  { label: 'Managed Cloud', href: '/services/managed-cloud' },
  { label: 'Advisory & Consulting', href: '/services/advisory-consulting' },
  { label: 'Free Security Check', href: '/security-check' },
];

const footerCompany = [
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'About Us', href: '/about' },
  { label: 'Meet the Team', href: '/about#team' },
  ...(INSIGHTS_ENABLED ? [{ label: 'Insights', href: '/insights' }] : []),
  ...(REPORTS_ENABLED ? [{ label: 'Reports', href: '/reports/uk-housing-email-security-2026' }] : []),
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const footerConnect: ReadonlyArray<{ label: string; href: string; external?: boolean }> = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rosebud-cloud-solutions-ltd/', external: true },
  { label: 'Instagram', href: 'https://www.instagram.com/rosebudcloudsolutions/', external: true },
];

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-background pt-24 pb-12 border-t border-outline ${className}`}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link to="/" className="flex items-center gap-2.5 mb-8 hover:opacity-80 transition-opacity">
              <img
                src={`${import.meta.env.BASE_URL}rcs-logo.webp`}
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="w-12 h-12 object-contain shrink-0"
              />
              <span className="text-2xl font-bold tracking-tight text-white font-headline">
                Rosebud Cloud Solutions
              </span>
            </Link>
            <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
              Engineering the next generation of cloud experiences. We blend technical gravitas
              with aesthetic precision to build systems that scale.
            </p>
          </div>

          {/* Solutions */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-8 font-bold font-label">
              Solutions
            </p>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-on-surface-variant">
              {footerSolutions.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-8 font-bold font-label">
              Company
            </p>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-on-surface-variant">
              {footerCompany.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-8 font-bold font-label">
              Connect
            </p>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-on-surface-variant">
              {footerConnect.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center py-12 border-t border-outline gap-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/80">
            © 2024–{new Date().getFullYear()} Rosebud Cloud Solutions Ltd
          </p>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50">
            Company No. 14500087 &nbsp;·&nbsp; VAT No. 439 921 563 &nbsp;·&nbsp; Registered in England & Wales
          </p>
          <Link
            to="/privacy"
            className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 hover:text-white transition-colors mt-1"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
