import { prerenderToNodeStream } from 'react-dom/static';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import type { HelmetServerState } from 'react-helmet-async';

interface HelmetContext {
  helmet?: HelmetServerState;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  let html = '';
  for await (const chunk of stream) {
    html += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
  }
  return html;
}

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const Page = pageContext.Page as React.FC<{
    urlPathname: string;
    helmetContext: HelmetContext;
  }>;

  const helmetContext: HelmetContext = {};
  // prerenderToNodeStream waits for all Suspense boundaries (incl. React.lazy)
  // to resolve before emitting the HTML — required for route-level code splitting.
  const { prelude } = await prerenderToNodeStream(
    <Page urlPathname={pageContext.urlPathname} helmetContext={helmetContext} />,
  );
  let appHtml = await streamToString(prelude);

  // Strip Helmet-injected head tags from the prerendered body HTML.
  // Helmet renders <title>, <meta>, <link> into the React tree AND the
  // context — we use the context for <head>, so remove the body duplicates.
  appHtml = appHtml
    .replace(/<title[^>]*>.*?<\/title>/g, '')
    .replace(/<meta[^>]*(?:name=|property=|charset=)[^>]*\/?>/g, '')
    .replace(/<link[^>]*rel="(?:canonical|preload)"[^>]*\/?>/g, '');

  const { helmet } = helmetContext;

  const headFallback = `
    <title>Rosebud Cloud Solutions | Enterprise Azure &amp; Cloud Security</title>
    <meta name="description" content="Rosebud Cloud Solutions — Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified consultancy delivering secure, scalable infrastructure." />
  `;

  const helmetTags = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join('\n    ')
    : headFallback;

  const htmlAttrs = helmet?.htmlAttributes.toString() ?? 'lang="en"';
  const bodyAttrs = helmet?.bodyAttributes.toString() ?? '';

  return escapeInject`<!doctype html>
<html ${dangerouslySkipEscape(htmlAttrs)}>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0B0F2A" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
    ${dangerouslySkipEscape(helmetTags)}
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://www.rosebudcloudsolutions.co.uk/#organization",
        "name": "Rosebud Cloud Solutions",
        "url": "https://www.rosebudcloudsolutions.co.uk",
        "logo": "https://www.rosebudcloudsolutions.co.uk/rcs-logo-full.png",
        "image": "https://www.rosebudcloudsolutions.co.uk/rcs-og-card.png",
        "description": "Enterprise Azure architecture, cloud security, DevSecOps, and managed cloud services. Microsoft-certified UK consultancy for regulated industries.",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "hello@rosebudcloudsolutions.co.uk",
          "contactType": "customer service",
          "areaServed": "GB",
          "availableLanguage": ["en"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB"
        },
        "sameAs": ["https://www.linkedin.com/company/rosebud-cloud-solutions-ltd/","https://www.instagram.com/rosebudcloudsolutions/"],
        "areaServed": "United Kingdom",
        "serviceType": ["Azure Landing Zones","Cloud Security","DevSecOps","Cloud Optimisation","Managed Cloud Services","Advisory & Consulting"]
      }
    </script>
  </head>
  <body ${dangerouslySkipEscape(bodyAttrs)}>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};
