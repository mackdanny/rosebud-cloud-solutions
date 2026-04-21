import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../config/site';

interface PreloadImage {
  readonly href: string;
  readonly type?: string; // e.g. 'image/webp'
  readonly fetchPriority?: 'high' | 'low' | 'auto';
  readonly imagesrcset?: string;
  readonly imagesizes?: string;
}

interface SEOProps {
  readonly title: string;
  readonly description: string;
  readonly path?: string;
  readonly image?: string;
  readonly type?: 'website' | 'article';
  readonly noindex?: boolean;
  readonly schema?: object | readonly object[];
  /** Preload hints for critical above-the-fold imagery (typically 1 per page: the LCP candidate). */
  readonly preloadImages?: readonly PreloadImage[];
}

export function SEO({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  schema,
  preloadImages,
}: SEOProps) {
  const location = useLocation();
  const canonical = `${SITE_URL}${path ?? location.pathname}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={SITE_NAME} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
      {preloadImages?.map((img, i) => (
        <link
          key={`preload-${i}`}
          rel="preload"
          as="image"
          href={img.href}
          {...(img.type ? { type: img.type } : {})}
          {...(img.fetchPriority ? { fetchPriority: img.fetchPriority } : {})}
          {...(img.imagesrcset ? { imageSrcSet: img.imagesrcset } : {})}
          {...(img.imagesizes ? { imageSizes: img.imagesizes } : {})}
        />
      ))}
    </Helmet>
  );
}
