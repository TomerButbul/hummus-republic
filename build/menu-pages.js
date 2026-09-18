#!/usr/bin/env node
/* ============================================================
   Build step: 19 menu item pages
   ------------------------------------------------------------
   Run:  node build/menu-pages.js
   Writes menu/<slug>.html, one per item in data-menu-items.js.

   These are real indexed URLs on the live site
   (/hummus-republic-menu/<slug>) with their own rankings. They are
   generated as STATIC HTML rather than one template reading a query
   string, because a single template means one title, one meta
   description and one H1 for nineteen dishes — Google would treat
   them as duplicates and rank none of them.

   Calorie figures are copied verbatim from the live pages. Hummus
   Republic is past 20 locations, so its menu falls under FDA
   menu-labeling; a number here is a regulatory statement. Nothing
   is estimated, and an item with no published figure renders no
   calorie line at all rather than a guess.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'menu');

// data-menu-items.js is a browser file; give it a window to attach to.
global.window = {};
require(path.join(ROOT, 'data-menu-items.js'));
const ITEMS = global.window.HR.menuItems;

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const ORDER = 'https://order.thehummusrepublic.com/find-location';
const SITE = 'https://thehummusrepublic.com';

function page(item, prev, next) {
  const url = `${SITE}/hummus-republic-menu/${item.slug}`;
  const title = `${item.name} | Hummus Republic`;
  // Google truncates around 155 characters; the dish description is the most
  // useful thing that fits, so it leads.
  const desc = `${item.desc} ${item.cal ? item.cal + ' calories. ' : ''}Order ${item.name} at Hummus Republic.`
    .replace(/\s+/g, ' ').trim().slice(0, 158);

  /* Schema.org MenuItem. This is what lets the dish appear as a rich result
     and is read by assistants answering "how many calories in a Hummus
     Republic bowl" — the exact question these pages should win. */
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name,
    description: item.desc,
    url,
    image: `${SITE}/${item.img}`,
    ...(item.cal ? {
      nutrition: {
        '@type': 'NutritionInformation',
        calories: `${item.cal} calories`
      }
    } : {}),
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', url: ORDER }
  };

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Menu', item: `${SITE}/hummus-republic-menu` },
      { '@type': 'ListItem', position: 3, name: item.name, item: url }
    ]
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(item.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/${esc(item.img)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../images/hr-mark.svg">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f%5B%5D=switzer@400,500,600,700&f%5B%5D=clash-display@600,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../hummus.css?v=12">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body data-page="menu-item">
<a class="skip" href="#item-main">Skip to content</a>

<main id="item-main" class="mitem">
  <div class="wrap mitem__grid">
    <div class="mitem__media">
      <img src="../${esc(item.img)}" alt="${esc(item.name)} at Hummus Republic" width="900" height="900" loading="eager">
    </div>
    <div class="mitem__body">
      <nav class="crumb mitem__crumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a> &rsaquo; <a href="../menu.html">Menu</a> &rsaquo;
        <span aria-current="page">${esc(item.name)}</span>
      </nav>
      <h1 class="h-1">${esc(item.name)}</h1>
      <p class="lede mitem__desc">${esc(item.desc)}</p>
      ${item.cal ? `<p class="mitem__cal"><span class="mitem__cal-k">Calories</span> ${esc(item.cal)}</p>` : ''}
      <div class="mitem__cta">
        <a class="btn btn--gold" href="${ORDER}" target="_blank" rel="noopener">Order now</a>
        <a class="btn btn--ghost" href="../menu.html">See the full menu</a>
      </div>
      <p class="mitem__note">Calorie figures are for the item as listed. Build-your-own items vary with
        your choices — ask in store or see <a class="textlink" href="../menu.html">the full menu</a>.</p>
    </div>
  </div>

  <nav class="wrap mitem__pager" aria-label="Menu items">
    <a class="mitem__pagelink" href="${prev.slug}.html" rel="prev">&lsaquo; ${esc(prev.name)}</a>
    <a class="mitem__pagelink mitem__pagelink--next" href="${next.slug}.html" rel="next">${esc(next.name)} &rsaquo;</a>
  </nav>
</main>

<script src="../data.js?v=12"></script>
<script src="../hummus.js?v=12"></script>
</body>
</html>
`;
}

fs.mkdirSync(OUTDIR, { recursive: true });
let written = 0;
const noCal = [];

ITEMS.forEach((item, i) => {
  const prev = ITEMS[(i - 1 + ITEMS.length) % ITEMS.length];
  const next = ITEMS[(i + 1) % ITEMS.length];
  fs.writeFileSync(path.join(OUTDIR, item.slug + '.html'), page(item, prev, next), 'utf8');
  if (!item.cal) noCal.push(item.slug);
  written++;
});

console.log(`Wrote ${written} menu item pages to menu/`);
console.log(`  every page has its own title, meta description, canonical and MenuItem schema`);
if (noCal.length) {
  console.log(`  no published calorie figure (rendered without one): ${noCal.join(', ')}`);
}

// Missing photography is worth knowing about — a 404 image on an indexed page
// is both an SEO and a trust problem.
const missing = ITEMS.filter(i => !fs.existsSync(path.join(ROOT, i.img))).map(i => `${i.slug} -> ${i.img}`);
if (missing.length) {
  console.log('\n  MISSING IMAGES:');
  missing.forEach(m => console.log('    • ' + m));
}
