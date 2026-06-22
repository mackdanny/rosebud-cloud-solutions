import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ChatBubble } from './components/ChatBubble';
import { ChatPanel } from './components/ChatPanel';
import { useChatbot } from './hooks/useChatbot';
import { STRATEGIC_TRIAGE_ENABLED, INSIGHTS_ENABLED, REPORTS_ENABLED } from './config/features';

// Lazy-loaded routes - each emits its own chunk. Hydration uses Suspense fallback.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const SecurityCheckPage = lazy(() =>
  import('./pages/SecurityCheckPage').then((m) => ({ default: m.SecurityCheckPage })),
);
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
const EmailSecurityPage = lazy(() =>
  import('./pages/EmailSecurityPage').then((m) => ({ default: m.EmailSecurityPage })),
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
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage })),
);
const ArticlePage = lazy(() =>
  import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })),
);
const ReportDetailPage = lazy(() =>
  import('./pages/ReportDetailPage').then((m) => ({ default: m.ReportDetailPage })),
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
  const chatbot = useChatbot();

  return (
    <div className="min-h-screen bg-background text-on-background">
      <ScrollToTop />
      <Nav />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/security-check" element={<SecurityCheckPage />} />
          <Route path="/services/azure-landing-zones" element={<AzureLandingZonesPage />} />
          <Route path="/services/cloud-security" element={<CloudSecurityPage />} />
          <Route path="/services/devsecops" element={<DevSecOpsPage />} />
          <Route path="/services/cloud-optimisation" element={<CloudOptimisationPage />} />
          <Route path="/services/advisory-consulting" element={<AdvisoryConsultingPage />} />
          <Route path="/services/managed-cloud" element={<ManagedCloudPage />} />
          <Route path="/services/email-security" element={<EmailSecurityPage />} />
          {STRATEGIC_TRIAGE_ENABLED && (
            <Route path="/tools/strategic-triage" element={<StrategicTriagePage />} />
          )}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-we-work" element={<HowWeWorkPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/faq" element={<FaqPage />} />
          {INSIGHTS_ENABLED && (
            <>
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<ArticlePage />} />
            </>
          )}
          {REPORTS_ENABLED && (
            <Route path="/reports/:slug" element={<ReportDetailPage />} />
          )}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <AnimatePresence>
        {!chatbot.isOpen && (
          <ChatBubble onClick={() => chatbot.setIsOpen(true)} isOpen={chatbot.isOpen} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatbot.isOpen && (
          <ChatPanel
            messages={chatbot.messages}
            onSend={chatbot.sendMessage}
            onClose={() => chatbot.setIsOpen(false)}
            isStreaming={chatbot.isStreaming}
            error={chatbot.error}
            hasInteracted={chatbot.hasInteracted}
          />
        )}
      </AnimatePresence>
    </div>
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
