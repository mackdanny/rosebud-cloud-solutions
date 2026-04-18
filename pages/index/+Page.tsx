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

  // SSR: Vike's urlPathname is already base-relative (e.g. "/about", not
  // "/rosebud-cloud-solutions/about"), so StaticRouter doesn't need a basename.
  // Client: window.location.pathname is absolute, so BrowserRouter uses basename
  // to strip the deployment prefix before matching routes.
  const routed = isServer ? (
    <StaticRouter location={urlPathname}>
      <AppRoutes />
    </StaticRouter>
  ) : (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );

  return <HelmetProvider context={helmetContext}>{routed}</HelmetProvider>;
}
