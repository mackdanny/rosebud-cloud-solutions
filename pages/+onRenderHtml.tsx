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

  const helmetTags = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join('\n    ')
    : '';

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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" /></noscript>
    ${dangerouslySkipEscape(helmetTags)}
  </head>
  <body ${dangerouslySkipEscape(bodyAttrs)}>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};
