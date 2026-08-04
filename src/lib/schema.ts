import { SITE } from '../consts';
import type { Publication } from './publications';

const absolute = (path: string) => new URL(path, SITE.url).href;

export const personId = `${SITE.url}/#person`;
export const siteId = `${SITE.url}/#website`;

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    jobTitle: [...SITE.roles],
    address: {
      '@type': 'PostalAddress',
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Nottingham' },
      { '@type': 'CollegeOrUniversity', name: 'Nottingham Trent University' },
    ],
    knowsAbout: [
      'Data engineering',
      'ETL pipeline design',
      'Geospatial data infrastructure',
      'Entity resolution and conflation',
      'PostGIS and spatial SQL',
      'Apache Spark and DuckDB',
      'H3 discrete global grid systems',
      'OpenStreetMap and Overture Maps',
      'Graph neural networks',
      'NLP geoparsing',
    ],
    sameAs: SITE.profiles.filter((p) => p.sameAs).map((p) => p.href),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteId,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': personId },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absolute(opts.path),
    isPartOf: { '@id': siteId },
    about: { '@id': personId },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absolute(item.path),
      })),
    },
  };
}

const SCHOLARLY_TYPE: Record<string, string> = {
  'Journal article': 'ScholarlyArticle',
  'Conference paper': 'ScholarlyArticle',
  Preprint: 'ScholarlyArticle',
  Thesis: 'Thesis',
  Dataset: 'Dataset',
  Article: 'Article',
};

export function publicationSchema(pub: Publication) {
  const url = absolute(`/publications/${pub.slug}`);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': SCHOLARLY_TYPE[pub.kind] ?? 'ScholarlyArticle',
    '@id': `${url}#publication`,
    headline: pub.title,
    name: pub.title,
    url,
    inLanguage: 'en',
    author: pub.authors.map((author) => ({
      '@type': 'Person',
      name: author.full,
      givenName: author.given || undefined,
      familyName: author.family,
      ...(author.family === 'Williams' && author.given.startsWith('James')
        ? { '@id': personId }
        : {}),
    })),
    isPartOf: { '@id': siteId },
  };

  if (pub.year) {
    schema.datePublished = String(pub.year);
    schema.copyrightYear = pub.year;
  }
  if (pub.abstract) schema.abstract = pub.abstract;
  if (pub.keywords.length) schema.keywords = pub.keywords;
  if (pub.doi) {
    schema.identifier = [
      { '@type': 'PropertyValue', propertyID: 'DOI', value: pub.doi },
    ];
    schema.sameAs = pub.doiUrl;
  }
  if (pub.publisher) schema.publisher = { '@type': 'Organization', name: pub.publisher };
  if (pub.pages) schema.pagination = pub.pages;
  if (pub.volume) schema.volumeNumber = pub.volume;
  if (pub.number) schema.issueNumber = pub.number;
  if (pub.pdf) {
    schema.encoding = {
      '@type': 'MediaObject',
      encodingFormat: 'application/pdf',
      contentUrl: absolute(pub.pdf),
    };
  }

  if (pub.venue) {
    if (pub.kind === 'Journal article') {
      schema.isPartOf = {
        '@type': 'PublicationIssue',
        isPartOf: { '@type': 'Periodical', name: pub.venue },
        ...(pub.number ? { issueNumber: pub.number } : {}),
      };
    } else if (pub.kind === 'Conference paper') {
      schema.isPartOf = { '@type': 'PublicationEvent', name: pub.venue };
    } else if (pub.kind === 'Thesis' && pub.school) {
      schema.sourceOrganization = { '@type': 'Organization', name: pub.school };
    }
  }

  return schema;
}

export function creativeWorkSchema(opts: {
  type: 'CreativeWork' | 'Course';
  name: string;
  description: string;
  path: string;
  datePublished?: Date;
  dateModified?: Date;
  keywords?: string[];
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': opts.type,
    name: opts.name,
    description: opts.description,
    url: absolute(opts.path),
    author: { '@id': personId },
    ...(opts.type === 'Course'
      ? { provider: { '@id': personId } }
      : { creator: { '@id': personId } }),
    isPartOf: { '@id': siteId },
  };
  if (opts.datePublished) schema.datePublished = opts.datePublished.toISOString();
  if (opts.dateModified) schema.dateModified = opts.dateModified.toISOString();
  if (opts.keywords?.length) schema.keywords = opts.keywords;
  return schema;
}
