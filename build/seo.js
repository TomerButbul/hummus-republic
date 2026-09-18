#!/usr/bin/env node
/* ============================================================
   Build step: sitemap.xml + robots.txt + Restaurant schema
   ------------------------------------------------------------
   Run:  node build/seo.js

   The sitemap is GENERATED from the same data that builds the
   pages, so it can never drift from what actually exists. A
   hand-kept sitemap is how closed stores stay listed: tampa-fl and
   roswell-ga are CLOSED in the sheet but the live sitemap still
   advertises 55 location pages, which sends customers to shut
   doors and spends crawl budget on soft-404s.

   Only URLs this site really serves are listed. A sitemap that
   promises a page which 404s is worse than omitting it.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://thehummusrepublic.com';

global.window = {};
require(path.join(ROOT, 'data-locations.js'));
require(path.join(ROOT, 'data-menu-items.js'));
const LOCATIONS = global.window.HR.locations;
const ITEMS = global.window.HR.menuItems;

const today = new Date().toISOString().slice(0, 10);

/* priority reflects how much of the business each page carries, not wishful
   thinking — the locator and the ordering page are where revenue starts. */
const STATIC = [
  ['/', 1.0, 'weekly'],
  ['/order-now', 0.9, 'weekly'],
  ['/locations-main', 0.9, 'weekly'],
  ['/hummus-republic-menu', 0.9, 'weekly'],
  ['/about-us', 0.6, 'monthly'],
  ['/careers', 0.5, 'monthly'],
  ['/contact-us', 0.5, 'monthly'],
  ['/franchise-opportunities', 0.7, 'monthly'],
  ['/app', 0.6, 'monthly'],
  ['/partners', 0.6, 'monthly'],
  ['/perks', 0.5, 'monthly'],
  ['/hummus-u-plus', 0.5, 'monthly'],
  ['/news-media', 0.3, 'monthly'],
  ['/privacynotice', 0.2, 'yearly'],
  ['/termsofservice', 0.2, 'yearly'],
  ['/accessibility-statement', 0.2, 'yearly']
];

const urls = [];
STATIC.forEach(([loc, pri, freq]) => urls.push({ loc, pri, freq }));
ITEMS.forEach(i => urls.push({ loc: `/hummus-republic-menu/${i.slug}`, pri: 0.7, freq: 'monthly' }));
// Coming-soon stores are included: people search for them by name and the page
// is genuinely useful. Closed stores are already absent from data-locations.js.
LOCATIONS.forEach(l => urls.push({ loc: `/locations/${l.slug}`, pri: 0.8, freq: 'weekly' }));

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u =>
    '  <url>\n' +
    `    <loc>${SITE}${u.loc}</loc>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>${u.freq}</changefreq>\n` +
    `    <priority>${u.pri.toFixed(1)}</priority>\n` +
    '  </url>\n').join('') +
  '</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
`User-agent: *
Allow: /

# Partner landing pages are reached by QR code with a ?p= slug. The bare page
# is indexable; the query-string variants are the same page and would look
# like duplicates.
Disallow: /perks?

Sitemap: ${SITE}/sitemap.xml
`, 'utf8');

/* ---- Restaurant schema, one entry per open store ------------
   This is what puts hours, phone and address into Google's local
   results. Coming-soon stores are excluded: claiming opening hours
   for a store that is not open yet is a bad local-SEO signal and a
   bad customer experience. */
const restaurants = LOCATIONS.filter(l => l.status === 'open').map(l => {
  const hours = Object.entries(l.hours || {})
    .filter(([, v]) => v && !/closed/i.test(v))
    .map(([day, v]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${{ Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday',
        Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' }[day]}`,
      description: v
    }));

  return {
    '@type': 'Restaurant',
    '@id': `${SITE}/locations/${l.slug}`,
    name: `Hummus Republic — ${l.city}, ${l.state}`,
    url: `${SITE}/locations/${l.slug}`,
    servesCuisine: 'Mediterranean',
    priceRange: '$$',
    ...(l.phone ? { telephone: l.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: l.addr,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: 'US'
    },
    ...(l.lat != null && l.lng != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng } } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(l.orderPickup || l.orderNow
      ? { potentialAction: { '@type': 'OrderAction', target: l.orderPickup || l.orderNow } } : {})
  };
});

fs.writeFileSync(path.join(ROOT, 'schema-locations.json'),
  JSON.stringify({ '@context': 'https://schema.org', '@graph': restaurants }, null, 2), 'utf8');

const noGeo = restaurants.filter(r => !r.geo).length;
const noPhone = restaurants.filter(r => !r.telephone).length;

console.log(`sitemap.xml      ${urls.length} URLs`);
console.log(`                 ${STATIC.length} static · ${ITEMS.length} menu items · ${LOCATIONS.length} locations`);
console.log(`robots.txt       written`);
console.log(`schema-locations.json  ${restaurants.length} open stores as Restaurant schema`);
if (noGeo) console.log(`  ⚠ ${noGeo} without coordinates (weaker local ranking)`);
if (noPhone) console.log(`  ⚠ ${noPhone} without a phone number`);
