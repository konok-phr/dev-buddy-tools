import { Helmet } from "react-helmet-async";

const SITE_URL = "https://tools.systems.bd";
const SITE_NAME = "DevTools Hub";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function SEO({ title, description, path = "", keywords, type = "website", noIndex }: SEOProps) {
  const fullTitle = path === "/" || !path ? title : `${title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": description,
    "url": canonical,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME };
