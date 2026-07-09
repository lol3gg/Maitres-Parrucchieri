/* SEO base — meta, Open Graph, JSON-LD */

const MAITRES_SITE = {
  url: 'https://lol3gg.github.io/Maitres-Parrucchieri',
  name: 'M A Î T R E S Parrucchieri',
  locale: 'it_IT',
  image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80',
  phone: '+390722317369',
  email: 'maitresparrucchieri@gmail.com',
  address: {
    street: 'Via XXIII Gennaio 101/A, Centro Commerciale Bramante',
    city: 'Urbania',
    region: 'PU',
    zip: '61049',
    country: 'IT'
  }
};

const SEO_PAGES = {
  home: {
    title: 'M A Î T R E S | Parrucchieri Premium · Urbania',
    description: 'Salone parrucchieri premium a Urbania (PU). Taglio, colore, balayage, Ponytail Balayage, Beauty Ritual e shop professionale. Prenota online.',
    path: '/index.html',
    keywords: 'parrucchiere urbania, salone capelli urbania, balayage, ponytail balayage, parrucchiere donna uomo, maitres'
  },
  shop: {
    title: 'Shop Professionale · M A Î T R E S | Urbania',
    description: 'Shop online MAÎTRES: 48 prodotti professionali Olaplex, Maria Nila, Alterna, Iles Formula, R+Co. Ordina o ritira in salone a Urbania.',
    path: '/shop.html',
    keywords: 'prodotti parrucchiere, olaplex urbania, shop capelli professionale'
  },
  prenota: {
    title: 'Prenota Appuntamento · M A Î T R E S | Urbania',
    description: 'Prenota online il tuo appuntamento da MAÎTRES Parrucchieri a Urbania. Scegli servizio, stylist, data e ora in pochi click.',
    path: '/prenota.html',
    keywords: 'prenotazione parrucchiere urbania, appuntamento salone capelli'
  },
  blog: {
    title: 'Ponytail Balayage · Blog M A Î T R E S',
    description: 'Ponytail Balayage MAÎTRES: la tecnica per illuminare i capelli raccolti in estate. Scopri benefici, per chi è pensato e prenota la consulenza.',
    path: '/blog-ponytail-balayage.html',
    keywords: 'ponytail balayage, balayage coda, colore capelli estate',
    article: true,
    datePublished: '2026-03-01'
  }
};

function seoSetMeta(name, content, property = false) {
  if (!content) return;
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function seoSetCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function seoInjectJsonLd(data) {
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

function maitresSalonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': MAITRES_SITE.url + '/#salon',
    name: MAITRES_SITE.name,
    image: MAITRES_SITE.image,
    url: MAITRES_SITE.url + '/',
    telephone: MAITRES_SITE.phone,
    email: MAITRES_SITE.email,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: MAITRES_SITE.address.street,
      addressLocality: MAITRES_SITE.address.city,
      addressRegion: MAITRES_SITE.address.region,
      postalCode: MAITRES_SITE.address.zip,
      addressCountry: MAITRES_SITE.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.6687,
      longitude: 12.5201
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00'
      }
    ],
    sameAs: [
      'https://maitresparrucchieri.it',
      'https://maitreshair.com'
    ]
  };
}

function initSeo(pageKey) {
  const page = SEO_PAGES[pageKey];
  if (!page) return;

  const pageUrl = MAITRES_SITE.url + page.path;
  const image = page.image || MAITRES_SITE.image;

  document.title = page.title;
  seoSetMeta('description', page.description);
  seoSetMeta('robots', 'index, follow');
  if (page.keywords) seoSetMeta('keywords', page.keywords);
  seoSetCanonical(pageUrl);

  seoSetMeta('og:type', page.article ? 'article' : 'website', true);
  seoSetMeta('og:locale', MAITRES_SITE.locale, true);
  seoSetMeta('og:site_name', MAITRES_SITE.name, true);
  seoSetMeta('og:title', page.title, true);
  seoSetMeta('og:description', page.description, true);
  seoSetMeta('og:url', pageUrl, true);
  seoSetMeta('og:image', image, true);

  seoSetMeta('twitter:card', 'summary_large_image');
  seoSetMeta('twitter:title', page.title);
  seoSetMeta('twitter:description', page.description);
  seoSetMeta('twitter:image', image);

  const graph = [
    maitresSalonSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': pageUrl + '#webpage',
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': MAITRES_SITE.url + '/#salon' },
      inLanguage: 'it-IT'
    }
  ];

  if (page.article) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Ponytail Balayage',
      description: page.description,
      datePublished: page.datePublished,
      author: { '@type': 'Organization', name: MAITRES_SITE.name },
      publisher: { '@type': 'Organization', name: MAITRES_SITE.name },
      mainEntityOfPage: pageUrl
    });
  }

  seoInjectJsonLd({ '@context': 'https://schema.org', '@graph': graph });
}
