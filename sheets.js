/* ============================================================
   HUMMUS REPUBLIC — Google Sheets client
   ------------------------------------------------------------
   One spreadsheet is the source of truth for the whole business:
     tab (first)  53 locations, 57 columns — addresses, hours,
                  per-store ordering links, Place IDs, SEO copy
     tab Partners  7 partner rows — the /perks landing pages

   Read through the public gviz JSON endpoint, exactly as the
   Framer build did, so the sheet keeps working for both sites
   during the cutover and nobody has to maintain two copies.

   Three things this deliberately does:

   1. FALLS BACK, NEVER BLANKS. If the sheet is slow, rate-limited
      or someone breaks a column, pages render from data.js instead
      of showing an empty locator. A stale address beats no address.

   2. CACHES IN localStorage. The Framer site once geocoded blank
      lat/lng cells on every page load and ran ~$226/mo in Maps
      billing. Same class of mistake is easy to repeat by re-fetching
      a 57-column sheet on every navigation, so responses are cached
      with a TTL and served instantly on repeat views.

   3. MATCHES COLUMNS BY NAME, CASE-INSENSITIVELY, WITH ALIASES.
      The sheet is edited by people. "Partner Name" becoming "Name"
      should not take the partner pages down.
   ============================================================ */
(function () {
  'use strict';

  var SHEET_ID = '1GyGj5DXqfvAi4qfCeLlEoIZGhx0Cm2BJR9mxKaPzGuE';
  var TTL_MS = 10 * 60 * 1000;          // 10 minutes
  var CACHE_PREFIX = 'hr.sheet.';
  var TIMEOUT_MS = 12000;

  function endpoint(tab) {
    var u = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID +
            '/gviz/tq?tqx=out:json&headers=1';
    if (tab) u += '&sheet=' + encodeURIComponent(tab);
    return u;
  }

  /* ---- gviz payload -> array of plain row objects ------------
     gviz wraps its JSON in a JS callback, and every cell carries
     both a raw value (v) and a formatted one (f). The formatted
     value is preferred: it is what the editor actually sees, so a
     phone number typed as text stays text instead of arriving as
     a float that has lost its leading zero. */
  function parseGviz(raw) {
    var m = raw.match(/setResponse\(([\s\S]+)\)/);
    if (!m) throw new Error('unexpected sheet response');
    var json = JSON.parse(m[1]);
    var cols = (json.table && json.table.cols || []).map(function (c) {
      return (c && c.label || '').trim();
    });
    var rows = json.table && json.table.rows || [];
    return rows.map(function (row) {
      var cells = row && row.c || [];
      var obj = {};
      cells.forEach(function (cell, i) {
        var key = cols[i];
        if (!key || !cell) return;
        var v = (cell.f !== undefined && cell.f !== null && cell.f !== '')
          ? cell.f : cell.v;
        if (v !== undefined && v !== null) obj[key] = v;
      });
      return obj;
    });
  }

  /* Look a value up by any of several header spellings. */
  function pick(row, names) {
    var lower = {};
    Object.keys(row).forEach(function (k) { lower[k.trim().toLowerCase()] = row[k]; });
    for (var i = 0; i < names.length; i++) {
      var v = lower[names[i].trim().toLowerCase()];
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
    }
    return '';
  }

  function cacheGet(key) {
    try {
      var hit = localStorage.getItem(CACHE_PREFIX + key);
      if (!hit) return null;
      var o = JSON.parse(hit);
      if (!o || (Date.now() - o.t) > TTL_MS) return null;
      return o.d;
    } catch (e) { return null; }   // private mode, quota, corrupt entry
  }

  function cacheSet(key, data) {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), d: data }));
    } catch (e) { /* quota or private mode — caching is an optimisation, not a requirement */ }
  }

  function fetchTab(tab) {
    var key = tab || '_default';
    var cached = cacheGet(key);
    if (cached) return Promise.resolve(cached);

    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, TIMEOUT_MS);

    return fetch(endpoint(tab), ctl ? { signal: ctl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw new Error('sheet HTTP ' + r.status);
        return r.text();
      })
      .then(function (t) {
        var rows = parseGviz(t);
        cacheSet(key, rows);
        return rows;
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  /* ---- normalisers ------------------------------------------- */

  function truthy(v) { return /^(yes|y|true|1|on|live|active)$/i.test(String(v || '').trim()); }
  function falsy(v)  { return /^(no|n|false|0|off|hidden|hide|internal|unlisted)$/i.test(String(v || '').trim()); }

  function slugify(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function num(v) {
    var n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
    return isFinite(n) ? n : null;
  }

  function normalizeLocation(row) {
    var slug = pick(row, ['Slug', 'ID']);
    var name = pick(row, ['Name', 'Location Name', 'Store']);
    if (!slug && !name) return null;

    var lat = num(pick(row, ['lat', 'Latitude']));
    var lng = num(pick(row, ['lng', 'Longitude', 'lon']));
    // 0,0 is the Gulf of Guinea, not a Hummus Republic. It is what an empty
    // coordinate cell parses to, and plotting it drags the whole map there.
    if (lat === 0 && lng === 0) { lat = null; lng = null; }

    var status = pick(row, ['Status', 'State of Store']);

    return {
      slug: slug || slugify(name),
      name: name,
      status: status,
      isComingSoon: /coming\s*soon/i.test(status),
      isClosed: /closed/i.test(status),
      addr: pick(row, ['streetaddress', 'Address', 'Location Address']),
      city: pick(row, ['city']),
      state: pick(row, ['state', 'State']),
      zip: pick(row, ['zip', 'Zip', 'Postal Code']),
      full: pick(row, ['Address', 'Location Address']),
      lat: lat,
      lng: lng,
      phone: pick(row, ['Phone_number', 'Phone', 'Phone Number']),
      phoneLink: pick(row, ['PhoneLink']),
      email: pick(row, ["Store's Email", 'Email']),
      placeId: pick(row, ['Place ID', 'Google Place ID', 'PlaceID']),
      seo: pick(row, ['store_seo_description', 'Store SEO Description']),
      descTitle: pick(row, ['DescriptionTitle']),
      parking: pick(row, ['Parking_Access']),
      directions: pick(row, ['get_directions']),
      /* Per-store ordering. order_now is the general entry point; the
         pickup/delivery pair is what the locator's two modes need. */
      orderNow: pick(row, ['order_now', 'Ordering Url', 'Ordering URL']),
      orderPickup: pick(row, ['order_pickup', 'Pickup Link']),
      orderDelivery: pick(row, ['order_delivery', 'Delivery Link']),
      cateringPickup: pick(row, ['ordering_pickup_catering']),
      cateringDelivery: pick(row, ['ordering_delivery_catering']),
      hasCatering: truthy(pick(row, ['is_catering_available'])),
      gmb: pick(row, ['GMB Link', 'gmbUrl']),
      yelp: pick(row, ['yelpUrl']),
      ubereats: pick(row, ['ubereatsUrl']),
      doordash: pick(row, ['doordashUrl']),
      grubhub: pick(row, ['grubhubUrl']),
      hours: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
        .map(function (d) {
          return {
            day: d,
            label: d.charAt(0).toUpperCase() + d.slice(1),
            text: pick(row, ['hours_' + d]),
            open: pick(row, ['hours_' + d + '_open']),
            close: pick(row, ['hours_' + d + '_close'])
          };
        })
    };
  }

  function audience(row, who) {
    return {
      headline: pick(row, [who + ' Headline', who + 's Headline']),
      subhead: pick(row, [who + ' Subhead', who + 's Subhead']),
      offer: pick(row, [who + ' Offer', who + 's Offer']),
      finePrint: pick(row, [who + ' Fine Print', who + 's Fine Print']),
      signupGroup: pick(row, [who + ' Signup Group']),
      qr: pick(row, [who + ' QR URL'])
    };
  }

  function normalizePartner(row) {
    var slug = pick(row, ['Slug', 'ID', 'Partner Slug']);
    if (!slug) return null;
    var status = pick(row, ['Status', 'State']);
    var listedRaw = pick(row, ['Listed', 'Show On Partners Page', 'Directory']);

    return {
      slug: slug,
      name: pick(row, ['Partner Name', 'Name', 'Partner']),
      logo: pick(row, ['Partner Logo', 'Logo', 'Logo URL']),
      /* Partner logos arrive in two incompatible flavours — dark artwork on
         transparency, which vanishes without a light plate, and artwork with
         its own baked-in plate, where a second plate reads as a border. The
         images are cross-origin so canvas alpha-sniffing is out; the sheet
         says which. Blank keeps the plate, so adding a partner needs no
         thought about it. */
      logoPlate: /^(none|no|off|transparent|clear)$/i
        .test(pick(row, ['Logo Plate', 'Logo Background', 'Logo Chip'])) ? 'none' : 'white',
      color: pick(row, ['Partner Color', 'Color', 'Accent', 'Accent Color']),
      status: status,
      isActive: !/inactive|paused|off/i.test(status),
      isComingSoon: /coming\s*soon/i.test(status),
      /* Not every row here is a public partner. `hummus-u` is the student
         campaign's config row: its landing page appends ?p=hummus-u to the
         reward URL and this sheet is what resolves it, so the row has to
         exist and stay reachable — but it must never appear beside actual
         partner gyms. Default is listed, so a real partner needs no extra
         cell. */
      listed: !falsy(listedRaw),
      description: pick(row, ['Partner Description', 'Description']),
      website: pick(row, ['Partner Website', 'Website']),
      finePrint: pick(row, ['Partner Fine Print']),
      appfrontUrl: pick(row, ['Appfront URL']),
      signupUrl: pick(row, ['Signup URL']),
      ctaLabel: pick(row, ['CTA Label', 'Button Label']) || 'Get the offer',
      employeeCode: pick(row, ['Employee Code', 'Staff Code', 'Access Code']),
      member: audience(row, 'Member'),
      employee: audience(row, 'Employee')
    };
  }

  /* ---- public API -------------------------------------------- */

  var HRSheets = {
    SHEET_ID: SHEET_ID,

    locations: function () {
      return fetchTab('').then(function (rows) {
        var out = rows.map(normalizeLocation).filter(Boolean);
        if (!out.length) throw new Error('sheet returned no locations');
        return out;
      });
    },

    partners: function () {
      return fetchTab('Partners').then(function (rows) {
        var out = rows.map(normalizePartner).filter(Boolean);
        if (!out.length) throw new Error('sheet returned no partners');
        return out;
      });
    },

    partner: function (slug) {
      var want = String(slug || '').trim().toLowerCase();
      return HRSheets.partners().then(function (list) {
        return list.filter(function (p) { return p.slug.toLowerCase() === want; })[0] || null;
      });
    },

    /** Drop every cached tab — for a "data looks stale" escape hatch. */
    clearCache: function () {
      try {
        Object.keys(localStorage)
          .filter(function (k) { return k.indexOf(CACHE_PREFIX) === 0; })
          .forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    },

    _pick: pick,
    _slugify: slugify
  };

  window.HRSheets = HRSheets;
})();
