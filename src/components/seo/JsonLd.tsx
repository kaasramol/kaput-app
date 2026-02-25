interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kaput",
  url: "https://kaput.ca",
  description:
    "Find trusted mechanics in Vancouver. Compare quotes, book appointments, and pay securely.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://kaput.ca/map?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kaput",
  url: "https://kaput.ca",
  logo: "https://kaput.ca/logo.png",
  email: "hello@kaput.ca",
  areaServed: {
    "@type": "City",
    name: "Vancouver",
    "@id": "https://www.wikidata.org/wiki/Q24639",
  },
  sameAs: [],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Kaput",
  description:
    "Marketplace connecting car owners with verified mechanics in Vancouver. Compare transparent quotes, book online, and pay securely.",
  url: "https://kaput.ca",
  email: "hello@kaput.ca",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vancouver",
    addressRegion: "BC",
    addressCountry: "CA",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "200",
    bestRating: "5",
    worstRating: "1",
  },
  priceRange: "$$",
};

export function buildFaqSchema(
  faqs: Array<{ q: string; a: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
