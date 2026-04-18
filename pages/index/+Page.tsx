import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from '../../src/App';

interface PageProps {
  readonly urlPathname: string;
  readonly helmetContext?: Record<string, unknown>;
}

export function Page({ urlPathname, helmetContext }: PageProps) {
  const isServer = typeof window === 'undefined';

  const routed = isServer ? (
    <StaticRouter location={urlPathname}>
      <AppRoutes />
    </StaticRouter>
  ) : (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

  return <HelmetProvider context={helmetContext}>{routed}</HelmetProvider>;
}
