import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { HomePage } from './pages/HomePage';
import { AzureLandingZonesPage } from './pages/AzureLandingZonesPage';
import { CloudSecurityPage } from './pages/CloudSecurityPage';
import { DevSecOpsPage } from './pages/DevSecOpsPage';
import { CloudOptimisationPage } from './pages/CloudOptimisationPage';
import { AdvisoryConsultingPage } from './pages/AdvisoryConsultingPage';
import { ManagedCloudPage } from './pages/ManagedCloudPage';
import { StrategicTriagePage } from './pages/StrategicTriagePage';
import { AboutPage } from './pages/AboutPage';
import { HowWeWorkPage } from './pages/HowWeWorkPage';
import { ContactPage } from './pages/ContactPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { CaseStudyDetailPage } from './pages/CaseStudyDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

export function AppRoutes() {
  return (
    <Preloader>
      <div className="min-h-screen bg-background text-on-background">
        <ScrollToTop />
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/azure-landing-zones" element={<AzureLandingZonesPage />} />
          <Route path="/services/cloud-security" element={<CloudSecurityPage />} />
          <Route path="/services/devsecops" element={<DevSecOpsPage />} />
          <Route path="/services/cloud-optimisation" element={<CloudOptimisationPage />} />
          <Route path="/services/advisory-consulting" element={<AdvisoryConsultingPage />} />
          <Route path="/services/managed-cloud" element={<ManagedCloudPage />} />
          <Route path="/tools/strategic-triage" element={<StrategicTriagePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-we-work" element={<HowWeWorkPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Preloader>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
