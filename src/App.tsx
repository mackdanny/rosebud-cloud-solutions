import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { STRATEGIC_TRIAGE_ENABLED } from './config/features';

// Lazy-loaded routes - each emits its own chunk. Hydration uses Suspense fallback.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AzureLandingZonesPage = lazy(() =>
  import('./pages/AzureLandingZonesPage').then((m) => ({ default: m.AzureLandingZonesPage })),
);
const CloudSecurityPage = lazy(() =>
  import('./pages/CloudSecurityPage').then((m) => ({ default: m.CloudSecurityPage })),
);
const DevSecOpsPage = lazy(() =>
  import('./pages/DevSecOpsPage').then((m) => ({ default: m.DevSecOpsPage })),
);
const CloudOptimisationPage = lazy(() =>
  import('./pages/CloudOptimisationPage').then((m) => ({ default: m.CloudOptimisationPage })),
);
const AdvisoryConsultingPage = lazy(() =>
  import('./pages/AdvisoryConsultingPage').then((m) => ({ default: m.AdvisoryConsultingPage })),
);
const ManagedCloudPage = lazy(() =>
  import('./pages/ManagedCloudPage').then((m) => ({ default: m.ManagedCloudPage })),
);
const StrategicTriagePage = lazy(() =>
  import('./pages/StrategicTriagePage').then((m) => ({ default: m.StrategicTriagePage })),
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const HowWeWorkPage = lazy(() =>
  import('./pages/HowWeWorkPage').then((m) => ({ default: m.HowWeWorkPage })),
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const CaseStudiesPage = lazy(() =>
  import('./pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })),
);
const CaseStudyDetailPage = lazy(() =>
  import('./pages/CaseStudyDetailPage').then((m) => ({ default: m.CaseStudyDetailPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Lazy routes mount after navigation — retry across frames until the
    // target renders (or give up after ~0.5s).
    let attempts = 0;
    let raf = 0;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
      if (++attempts < 30) raf = requestAnimationFrame(tryScroll);
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

export function AppRoutes() {
  return (
    <Preloader>
      <div className="min-h-screen bg-background text-on-background">
        <ScrollToTop />
        <Nav />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/azure-landing-zones" element={<AzureLandingZonesPage />} />
            <Route path="/services/cloud-security" element={<CloudSecurityPage />} />
            <Route path="/services/devsecops" element={<DevSecOpsPage />} />
            <Route path="/services/cloud-optimisation" element={<CloudOptimisationPage />} />
            <Route path="/services/advisory-consulting" element={<AdvisoryConsultingPage />} />
            <Route path="/services/managed-cloud" element={<ManagedCloudPage />} />
            {STRATEGIC_TRIAGE_ENABLED && (
              <Route path="/tools/strategic-triage" element={<StrategicTriagePage />} />
            )}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-we-work" element={<HowWeWorkPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Preloader>
  );
}

function App() {
  return (
    // reducedMotion="user" honours OS-level prefers-reduced-motion across every
    // Framer animation - no per-component guards needed.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
