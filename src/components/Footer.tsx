import { Link } from 'react-router-dom';

interface FooterProps {
  readonly className?: string;
}

const footerSolutions = [
  { label: 'Azure Cloud', href: '/services/azure-landing-zones' },
  { label: 'AI Engineering', href: '/' },
  { label: 'Security', href: '/' },
];

const footerAdvisory = [
  { label: 'Our Process', href: '/' },
  { label: 'Expertise', href: '/' },
  { label: 'Contact', href: '/' },
];

const footerConnect = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Briefing', href: '#' },
];

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-background pt-24 pb-12 border-t border-outline ${className}`}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-2xl">filter_vintage</span>
              <span className="text-2xl font-bold tracking-tight text-white font-headline">
                Rosebud Cloud
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

          {/* Advisory */}
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-8 font-bold font-label">
              Advisory
            </p>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-on-surface-variant">
              {footerAdvisory.map(({ label, href }) => (
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
              {footerConnect.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-outline gap-6">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            © 2025 Rosebud Cloud Solutions. Strategic Enterprise Partner.
          </p>
          <div className="flex gap-12 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
