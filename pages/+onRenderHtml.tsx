import { renderToPipeableStream } from 'react-dom/server';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import type { HelmetServerState } from 'react-helmet-async';
import { PassThrough } from 'node:stream';

interface HelmetContext {
  helmet?: HelmetServerState;
}

function renderToStringAsync(element: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = '';
    const passthrough = new PassThrough();
    passthrough.on('data', (chunk: Buffer) => { html += chunk.toString(); });
    passthrough.on('end', () => resolve(html));
    passthrough.on('error', reject);

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() { pipe(passthrough); },
      onError: reject,
    });
  });
}

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const Page = pageContext.Page as React.FC<{
    urlPathname: string;
    helmetContext: HelmetContext;
  }>;

  const helmetContext: HelmetContext = {};
  const appHtml = await renderToStringAsync(
    <Page urlPathname={pageContext.urlPathname} helmetContext={helmetContext} />,
  );

  const { helmet } = helmetContext;

  // react-helmet-async v3 + React 19: Helmet becomes a passthrough and no
  // longer populates the context. Extract hoistable tags directly from the
  // rendered HTML so social scrapers (LinkedIn, Facebook) find them in <head>.
  let helmetTags: string;
  let cleanedAppHtml = appHtml;

  if (helmet) {
    helmetTags = [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString(),
    ].join('\n    ');
  } else {
    const extracted: string[] = [];
    cleanedAppHtml = appHtml
      .replace(/<title[^>]*>.*?<\/title>/gi, (m) => { extracted.push(m); return ''; })
      .replace(/<meta\s[^>]*(?:property=["']og:|name=["'](?:description|twitter:|robots))[^>]*\/?>/gi, (m) => { extracted.push(m); return ''; })
      .replace(/<link\s[^>]*rel=["']canonical["'][^>]*\/?>/gi, (m) => { extracted.push(m); return ''; })
      .replace(/<script\s[^>]*type=["']application\/ld\+json["'][^>]*>.*?<\/script>/gi, (m) => { extracted.push(m); return ''; });
    helmetTags = extracted.join('\n    ');
  }

  const htmlAttrs = helmet?.htmlAttributes.toString() ?? 'lang="en-GB"';
  const bodyAttrs = helmet?.bodyAttributes.toString() ?? '';

  const documentHtml = escapeInject`<!doctype html>
<html ${dangerouslySkipEscape(htmlAttrs)}>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0B0F2A" />
    <!-- Material Symbols Outlined is self-hosted via src/fonts.css -->
    ${dangerouslySkipEscape(helmetTags)}
  </head>
  <body ${dangerouslySkipEscape(bodyAttrs)}>
    <div id="root">${dangerouslySkipEscape(cleanedAppHtml)}</div>
  </body>
</html>`;

  return {
    documentHtml,
    // Trim Vike's auto-injected <link rel="preload"> tags that hurt LCP/CLS on
    // slow connections: the 1.1MB Material Symbols icon font (not needed for
    // first paint — still loads on demand via @font-face) and auto image
    // preloads (the SEO component already preloads the true LCP image with
    // fetchpriority). The Manrope/Inter text-font preloads are kept, which is
    // what prevents the late font swap that was shifting the page (CLS).
    injectFilter(assets) {
      for (const asset of assets) {
        if (asset.assetType === 'image') asset.inject = false;
        if (asset.assetType === 'font' && asset.src.includes('material-symbols')) {
          asset.inject = false;
        }
      }
    },
  };
};
