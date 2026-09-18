#!/usr/bin/env node
/* ============================================================
   Build step: Google Sheet  ->  data-locations.js
   ------------------------------------------------------------
   Run:  node build/locations.js
   Netlify runs this before publish, so a sheet edit reaches the
   site on the next deploy without anyone touching code.

   WHY A BUILD STEP AND NOT A RUNTIME FETCH
   Addresses, hours and phone numbers are the content Google ranks
   these 53 pages for. Fetched at runtime they arrive after the
   HTML, and the crawler is not guaranteed to wait — the page it
   indexes is the empty one. Baking them in means the markup is
   complete on first byte, the pages work with JavaScript off, and
   there is no request between a customer and their local store's
   hours.

   Live status still moves faster than deploys, so sheets.js keeps
   refreshing "open / coming soon" in the browser. Content is
   baked; state is live.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const SHEET_ID = '1GyGj5DXqfvAi4qfCeLlEoIZGhx0Cm2BJR9mxKaPzGuE';
const OUT = path.join(__dirname, '..', 'data-locations.js');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LONG = {
  Sun: 'sunday', Mon: 'monday', Tue: 'tuesday', Wed: 'wednesday',
  Thu: 'thursday', Fri: 'friday', Sat: 'saturday'
};

function endpoint(tab) {
  let u = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1`;
  if (tab) u += '&sheet=' + encodeURIComponent(tab);
  return u;
}

function parseGviz(raw) {
  const m = raw.match(/setResponse\(([\s\S]+)\)/);
  if (!m) throw new Error('unexpected sheet response');
  const json = JSON.parse(m[1]);
  const cols = (json.table.cols || []).map(c => (c.label || '').trim());
  return (json.table.rows || []).map(row => {
    const cells = row.c || [];
    const obj = {};
    cells.forEach((cell, i) => {
      const key = cols[i];
      if (!key || !cell) return;
      const v = (cell.f !== undefined && cell.f !== null && cell.f !== '') ? cell.f : cell.v;
      if (v !== undefined && v !== null) obj[key] = v;
    });
    return obj;
  });
}

function pick(row, names) {
  const lower = {};
  Object.keys(row).forEach(k => { lower[k.trim().toLowerCase()] = row[k]; });
  for (const n of names) {
    const v = lower[n.trim().toLowerCase()];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

const numOrNull = v => {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function build(rows) {
  const out = [];
  const problems = [];

  rows.forEach((row, i) => {
    const name = pick(row, ['Name', 'Location Name']);
    let slug = pick(row, ['Slug', 'ID']);
    if (!slug && !name) return;

    // The sheet's slugs use underscores (scottsdale_az) but every printed and
    // indexed URL is /locations/scottsdale-az. Normalising here keeps the
    // sheet as-is and the URLs stable.
    slug = slugify(slug || name);

    const status = pick(row, ['Status', 'State of Store']);
    const city = pick(row, ['city']);
    const state = pick(row, ['state', 'State']);
    const zip = pick(row, ['zip']);

    let lat = numOrNull(pick(row, ['lat', 'Latitude']));
    let lng = numOrNull(pick(row, ['lng', 'Longitude']));
    // 0,0 is the Gulf of Guinea. It is what an empty coordinate cell parses
    // to, and one of them drags the whole map off the United States.
    if (lat === 0 && lng === 0) { lat = null; lng = null; }
    if (lat === null || lng === null) problems.push(`${slug}: no coordinates`);

    const hours = {};
    DAYS.forEach(d => { hours[d] = pick(row, ['hours_' + LONG[d]]) || 'Closed'; });

    const isSoon = /coming\s*soon/i.test(status);
    const isClosed = /^closed$/i.test(status.trim());

    const orderPickup = pick(row, ['order_pickup', 'Pickup Link']);
    const orderDelivery = pick(row, ['order_delivery', 'Delivery Link']);
    const orderNow = pick(row, ['order_now', 'Ordering Url']);
    if (!isSoon && !isClosed && !orderPickup && !orderNow) {
      problems.push(`${slug}: open but no ordering link`);
    }

    // A closed store must not appear. Burbank is marked CLOSED_PERMANENTLY in
    // Google Business, and listing it sends customers to a locked door.
    if (isClosed) { problems.push(`${slug}: CLOSED — omitted`); return; }

    out.push({
      slug,
      city, state, zip,
      addr: pick(row, ['streetaddress', 'Address', 'Location Address']),
      line: [city, state].filter(Boolean).join(', ') + (zip ? ' ' + zip : ''),
      phone: pick(row, ['Phone_number', 'Phone']),
      lat, lng,
      status: isSoon ? 'soon' : 'open',
      hours,
      placeId: pick(row, ['Place ID', 'Google Place ID']) || undefined,
      seo: pick(row, ['store_seo_description']) || undefined,
      orderPickup: orderPickup || undefined,
      orderDelivery: orderDelivery || undefined,
      orderNow: orderNow || undefined,
      catering: /^(yes|true|1)$/i.test(pick(row, ['is_catering_available'])) || undefined,
      yelp: pick(row, ['yelpUrl']) || undefined,
      doordash: pick(row, ['doordashUrl']) || undefined,
      ubereats: pick(row, ['ubereatsUrl']) || undefined,
      grubhub: pick(row, ['grubhubUrl']) || undefined
    });
  });

  // Duplicate slugs would silently collapse two stores into one page.
  const seen = new Map();
  out.forEach(l => {
    if (seen.has(l.slug)) problems.push(`DUPLICATE SLUG: ${l.slug}`);
    seen.set(l.slug, true);
  });

  return { locations: out, problems };
}

(async () => {
  process.stdout.write('Fetching locations sheet… ');
  const res = await fetch(endpoint(''));
  if (!res.ok) throw new Error('sheet HTTP ' + res.status);
  const rows = parseGviz(await res.text());
  console.log(rows.length + ' rows');

  const { locations, problems } = build(rows);

  const open = locations.filter(l => l.status === 'open').length;
  const soon = locations.filter(l => l.status === 'soon').length;
  const withOrder = locations.filter(l => l.orderPickup || l.orderNow).length;

  const banner =
`/* GENERATED FILE — do not edit.
   Source: Google Sheet ${SHEET_ID} (first tab)
   Regenerate: node build/locations.js
   Built: ${new Date().toISOString()}
   ${locations.length} locations — ${open} open, ${soon} coming soon,
   ${withOrder} with a direct ordering link. */
`;

  const body =
    banner +
    '(function () {\n' +
    "  'use strict';\n" +
    '  window.HR = window.HR || {};\n' +
    '  window.HR.locations = ' + JSON.stringify(locations, null, 2).replace(/\n/g, '\n  ') + ';\n' +
    '})();\n';

  fs.writeFileSync(OUT, body, 'utf8');

  console.log(`\nWrote ${path.relative(process.cwd(), OUT)}`);
  console.log(`  ${locations.length} locations — ${open} open, ${soon} coming soon`);
  console.log(`  ${withOrder}/${open} open stores have a direct ordering link`);

  if (problems.length) {
    console.log('\nData problems in the sheet (fix there, not here):');
    problems.forEach(p => console.log('  • ' + p));
  }
  // Deliberately exit 0: a sheet problem should be visible in the build log,
  // not a hard stop that blocks an unrelated deploy.
})().catch(e => { console.error('FAILED: ' + e.message); process.exit(1); });
