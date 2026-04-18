import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from '../../src/App';

interface PageProps {
  readonly urlPathname: string;
  readonly helmetContext?: Record<string, unknown>;
}

// React Router's basename must NOT have a trailing slash. Vite's BASE_URL does
// (e.g. "/rosebud-cloud-solutions/"), so strip it. Empty string when deployed
// at the domain root (production).
const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function Page({ urlPathname, helmetContext }: PageProps) {
  const isServer = typeof window === 'undefined';

  // SSR: urlPathname already omits the base prefix (Vike normalizes it).
  // Client: BrowserRouter strips the basename from window.location.pathname.
  const routed = isServer ? (
    <StaticRouter location={urlPathname} basename={basename}>
      <AppRoutes />
    </StaticRouter>
  ) : (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );

  return <HelmetProvider context={helmetContext}>{routed}</HelmetProvider>;
}
