/* ============================================================
   HUMMUS REPUBLIC — shared interactions  ·  vanilla, no deps
   Ports the nüdes motion system (intro · reveals · magnetic +
   tilt · cursor · mobile nav) and adds the data-driven features:
   review ticker · Leaflet locations map + search · location
   detail · menu builder + scrollspy. Each page opts in by markup.
   All markup below is first-party (built from data.js), injected
   with insertAdjacentHTML via setHTML().
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches && !reduce;
  var doc = document.documentElement;
  if (fine) doc.classList.add('has-fine');

  function rafThrottle(fn) {
    var queued = false, lastArgs;
    return function () {
      lastArgs = arguments;
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; fn.apply(null, lastArgs); });
    };
  }
  function setHTML(node, str) { if (!node) return; node.textContent = ''; node.insertAdjacentHTML('beforeend', str); }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.insertAdjacentHTML('beforeend', html); return n; }

  /* SVG snippets ------------------------------------------- */
  var ARR = '<svg class="arr" width="20" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5h19M15 1l5 4-5 4"/></svg>';
  var MARK = '<svg viewBox="0 0 60 80" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round">' +
    '<ellipse cx="30" cy="40" rx="23.5" ry="35"/><path d="M30 5.5C14 26 14 54 30 74.5"/><path d="M30 5.5C46 26 46 54 30 74.5"/>' +
    '<path d="M30 5.5C23 28 23 52 30 74.5"/><path d="M30 5.5C37 28 37 52 30 74.5"/></svg>';
  function starSVG(filled) {
    return '<svg viewBox="0 0 24 24" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.3"><path d="M12 2.5l2.9 6.3 6.8.6-5.1 4.5 1.6 6.7L12 17.7 5.8 20.6l1.6-6.7L2.3 9.4l6.8-.6z"/></svg>';
  }
  function srcBadge(src) {
    if (src === 'doordash') return '<span class="src">DoorDash</span>';
    return '<span class="src"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z"/><path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.5 24 12 24z"/><path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.5 0 3.7 2.6 1.8 6.4l3.8 3c.9-2.7 3.4-4.6 6.4-4.6z"/></svg>Google</span>';
  }
  function reviewCard(r) {
    var s = ''; for (var i = 0; i < 5; i++) s += starSVG(i < r.stars);
    return '<article class="revcard"><div class="revcard__top"><span class="stars">' + s + '</span><span class="revcard__time">' + r.time + '</span></div>' +
      '<p class="revcard__text">“' + r.text + '”</p>' +
      '<div class="revcard__foot"><span><span class="revcard__who">' + r.name + '</span> <span class="revcard__city">' + r.city + '</span></span>' + srcBadge(r.src) + '</div></article>';
  }

  /* ============================================================
     Shared chrome — topbar + nav + mobile menu + footer.
     Injected on every page so links stay DRY & identical.
     Active nav state comes from <body data-page="…">.
     ============================================================ */
  (function buildChrome() {
    if (document.querySelector('.nav') || !window.HR) return;
    var page = document.body.getAttribute('data-page') || '';
    var K = HR.links;
    var navItems = [
      { label: 'Menu', href: 'menu.html', key: 'menu' },
      { label: 'Catering', href: K.catering, ext: true },
      { label: 'Rewards', href: 'rewards.html', key: 'rewards' },
      { label: 'Franchise', href: 'franchise.html', key: 'franchise' },
      { label: 'Locations', href: 'locations.html', key: 'locations' }
    ];
    function navlink(n) {
      var cur = (n.key && n.key === page) ? ' aria-current="page"' : '';
      var ext = n.ext ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + n.href + '"' + cur + ext + '>' + n.label + '</a>';
    }
    var brand = '<a class="brand" href="index.html" aria-label="Hummus Republic — home">' +
      '<span class="brand__mark">' + MARK + '</span>' +
      '<span class="wordmark">Hummus<sup>®</sup><br>Republic</span></a>';
    var header = '<header class="nav"><div class="nav__inner">' + brand +
      '<nav class="nav__links" aria-label="Main">' + navItems.map(navlink).join('') + '</nav>' +
      '<div class="nav__cta"><a class="btn btn--sm" href="' + K.order + '" target="_blank" rel="noopener">Order Now ' + ARR + '</a></div>' +
      '<button class="nav__burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>' +
      '</div></header>';
    var mlinks = navItems.map(function (n, i) {
      var ext = n.ext ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + n.href + '"' + ext + '><span>' + n.label + '</span><small>0' + (i + 1) + '</small></a>';
    }).join('');
    var menuEl = '<div class="menu" id="menu"><button class="menu__close" type="button">Close ✕</button>' + mlinks +
      '<a href="' + K.order + '" target="_blank" rel="noopener"><span>Order</span><small>06</small></a>' +
      '<div class="menu__foot"><span>Modern Mediterranean</span><span>@hummusrepublic</span></div></div>';
    document.body.insertAdjacentHTML('afterbegin', header + menuEl);

    /* ---- footer ---- */
    var IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5.4"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>';
    var FB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.9 8.4h2.3V5.2c-.4-.05-1.7-.18-3.2-.18-3.2 0-5.3 1.95-5.3 5.5v2.9H6v3.6h2.7V22h3.6v-7H15l.5-3.6h-3.2v-2.5c0-1 .28-1.5 1.6-1.5z"/></svg>';
    var TT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.3 3c.35 2.1 1.7 3.75 3.7 4V10c-1.45 0-2.8-.45-3.9-1.2v5.85a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6.02.9.07v3.05a2.6 2.6 0 1 0 1.85 2.5V3z"/></svg>';
    var APPLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.18.76-.66 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.44 2.08-1.46 2.54-.37 6.3 1.05 8.36.7 1 1.52 2.13 2.6 2.09 1.04-.04 1.44-.67 2.7-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.02 2.51-2.03.79-1.16 1.12-2.28 1.13-2.34-.02-.01-2.17-.83-2.19-3.3zM14.4 6.36c.57-.7.96-1.66.85-2.62-.83.03-1.83.55-2.42 1.24-.53.61-1 1.6-.87 2.54.92.07 1.87-.47 2.44-1.16z"/></svg>';
    var PLAY = '<svg viewBox="0 0 24 24"><path d="M3.6 2.5 14 12 3.6 21.5c-.3-.18-.5-.5-.5-.94V3.44c0-.44.2-.76.5-.94z" fill="#36C871"/><path d="M17.6 8.6 14 12l3.6 3.4 2.9-1.66c.9-.52.9-1.96 0-2.48z" fill="#FFCE49"/><path d="M3.6 2.5 14 12l3.6-3.4z" fill="#FF5C5C"/><path d="M3.6 21.5 14 12l3.6 3.4z" fill="#4AA0FF"/></svg>';
    var yearTxt = '<span data-year></span>';
    var footer = '<footer class="footer"><div class="footer__mark">' + MARK + '</div><div class="wrap">' +
      '<div class="footer__top"><div class="footer__news">' +
        '<span class="eyebrow eyebrow--light"><span class="dots"></span> The Republic list</span>' +
        '<h3 class="h-2">Get the<br>first scoop</h3>' +
        '<div class="field"><input type="email" placeholder="Your email" aria-label="Email"><button type="button">Join</button></div>' +
        '<div class="footer__social"><a href="' + K.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + IG + '</a>' +
          '<a href="' + K.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + FB + '</a>' +
          '<a href="' + K.tiktok + '" target="_blank" rel="noopener" aria-label="TikTok">' + TT + '</a></div>' +
      '</div>' +
      '<div class="footer__col"><h4>About</h4><a href="about.html">Our Story</a><a href="careers.html">Careers</a><a href="locations.html">Locations</a><a href="franchise.html">Franchise Info</a></div>' +
      '<div class="footer__col"><h4>Explore</h4><a href="' + K.catering + '" target="_blank" rel="noopener">Catering</a><a href="' + K.giftcards + '" target="_blank" rel="noopener">Gift Cards</a><a href="' + K.nutrition + '" target="_blank" rel="noopener">Nutrition &amp; Allergens</a><a href="rewards.html">Rewards</a><a href="contact.html">Contact Us</a></div>' +
      '<div class="footer__col"><h4>Get the App</h4><p style="font-size:.92rem;opacity:.8;margin-bottom:.3rem">Order ahead, earn points, unlock a free bowl.</p><div class="footer__apps">' +
        '<a class="storebadge" href="' + K.appStore + '" target="_blank" rel="noopener">' + APPLE + '<span><small>Download on the</small><b>App Store</b></span></a>' +
        '<a class="storebadge" href="' + K.googlePlay + '" target="_blank" rel="noopener">' + PLAY + '<span><small>Get it on</small><b>Google Play</b></span></a>' +
      '</div></div></div>' +
      '<div class="footer__bar"><span>© ' + yearTxt + ' Hummus Republic. Modern Mediterranean.</span>' +
      '<span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="accessibility.html">Accessibility</a></span></div>' +
      '</div></footer>';
    document.body.insertAdjacentHTML('beforeend', footer);
  })();

  /* ============================================================
     0. Cinematic intro loader (first load only, session-gated)
     ============================================================ */
  (function intro() {
    return; // intro curtain removed — lighter, friendlier, loads straight to content
    if (!document.body.hasAttribute('data-intro')) return;
    var seen = false;
    try { seen = sessionStorage.getItem('hr-intro') === '1'; } catch (e) {}
    if (seen) return;
    try { sessionStorage.setItem('hr-intro', '1'); } catch (e) {}

    var letters = 'HUMMUS'.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('');
    var node = el('div', 'intro');
    node.setAttribute('aria-hidden', 'true');
    setHTML(node,
      '<div class="intro__panel intro__panel--t"></div><div class="intro__panel intro__panel--b"></div>' +
      '<div class="intro__seam"></div>' +
      '<div class="intro__core"><span class="intro__mark">' + MARK + '</span>' +
      '<span class="intro__word">' + letters + '</span>' +
      '<span class="intro__tag">Modern Mediterranean</span></div>' +
      '<button class="intro__skip" type="button">Skip</button>');
    document.body.appendChild(node);
    doc.classList.add('intro-lock');

    node.querySelectorAll('.intro__mark path, .intro__mark ellipse').forEach(function (p) {
      if (p.getTotalLength) { try { p.style.setProperty('--len', Math.ceil(p.getTotalLength())); } catch (e) {} }
    });

    var done = false;
    function finish() {
      if (done) return; done = true;
      node.classList.add('is-exiting'); doc.classList.remove('intro-lock');
      var rm = function () { if (node.parentNode) node.parentNode.removeChild(node); };
      if (reduce) { rm(); return; }
      node.addEventListener('transitionend', function te(ev) {
        if (ev.target === node.querySelector('.intro__panel--b')) { node.removeEventListener('transitionend', te); rm(); }
      });
      setTimeout(rm, 1500);
    }
    node.querySelector('.intro__skip').addEventListener('click', finish);
    node.addEventListener('click', function (e) { if (e.target === node) finish(); });
    setTimeout(finish, reduce ? 60 : 1750);
  })();

  /* ---- Nav: solid on scroll -------------------------------- */
  var nav = document.querySelector('.nav');
  function onNav() { if (nav) nav.classList.toggle('nav--solid', window.scrollY > 24); }
  onNav();

  /* ---- Mobile menu ----------------------------------------- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.menu');
  var closeBtn = document.querySelector('.menu__close');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ============================================================
     Data-driven: REVIEW TICKER
     ============================================================ */
  (function reviewTicker() {
    var hosts = document.querySelectorAll('[data-reviews]');
    if (!hosts.length || !window.HR) return;
    hosts.forEach(function (host) {
      var row = HR.reviews.map(reviewCard).join('');
      setHTML(host, '<div class="revrow">' + row + row + '</div>');
    });
  })();

  /* ============================================================
     Data-driven: MENU builder + sticky scrollspy
     ============================================================ */
  (function menuBuild() {
    var host = document.querySelector('[data-menu]');
    if (!host || !window.HR) return;
    var bar = document.querySelector('[data-menubar]');
    var barHTML = '', body = '';
    HR.menu.forEach(function (cat) {
      barHTML += '<a href="#' + cat.key + '" data-cat="' + cat.key + '">' + cat.name + '</a>';
      var items = cat.items.map(function (it) {
        var tags = (it.tags || []).map(function (t) { return '<span class="tag tag--diet">' + t + '</span>'; }).join('');
        var src = (typeof it.img === 'string' && it.img.indexOf('images/') === 0) ? it.img : HR.ph(it.img, 760);
        return '<article class="mitem reveal"><div class="media"><img loading="lazy" src="' + src + '" alt="' + it.name + '"></div>' +
          '<div class="mitem__body"><div class="mitem__row"><h3>' + it.name + '</h3><span class="kcal">' + (it.kcal || '') + '</span></div>' +
          '<p>' + it.desc + '</p><div class="mitem__tags">' + tags + '</div></div></article>';
      }).join('');
      body += '<section class="mcat" id="' + cat.key + '"><div class="wrap"><div class="mcat__head"><div class="reveal">' +
        '<span class="eyebrow"><span class="dots"></span> ' + cat.name + '</span>' +
        '<h2 class="h-1" style="margin-top:.5rem">' + cat.name + '</h2></div>' +
        '<p class="lede reveal" style="max-width:32ch">' + cat.blurb + '</p></div>' +
        '<div class="mitems">' + items + '</div></div></section>';
    });
    setHTML(bar, barHTML);
    setHTML(host, body);

    var links = bar ? bar.querySelectorAll('a') : [];
    var cats = host.querySelectorAll('.mcat');
    if ('IntersectionObserver' in window && links.length) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) {
            var k = en.target.id;
            links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-cat') === k); });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      cats.forEach(function (c) { io.observe(c); });
    }
  })();

  /* ============================================================
     Data-driven: LOCATIONS map + list (Leaflet)
     ============================================================ */
  function hrPin(color) {
    return L.divIcon({ className: 'hr-pin', iconSize: [26, 34], iconAnchor: [13, 33], popupAnchor: [0, -30],
      html: '<svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 0C5.8 0 0 5.8 0 13c0 9 13 21 13 21s13-12 13-21C26 5.8 20.2 0 13 0z" fill="' + color + '"/><circle cx="13" cy="13" r="5" fill="#FEFBFA"/></svg>' });
  }
  function gmaps(loc) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Hummus Republic ' + loc.addr + ' ' + loc.line); }

  (function locations() {
    var mapEl = document.getElementById('locmap');
    var listEl = document.getElementById('loclist');
    if (!mapEl || !listEl || !window.HR || !window.L) return;
    var locs = HR.locations;

    var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true }).setView([39.5, -96.5], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19
    }).addTo(map);
    mapEl.addEventListener('click', function () { map.scrollWheelZoom.enable(); });

    var markers = {};
    function setActive(slug) {
      listEl.querySelectorAll('.loccard').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-slug') === slug); });
      var act = listEl.querySelector('.loccard.is-active');
      if (act) act.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    locs.forEach(function (loc) {
      var m = L.marker([loc.lat, loc.lng], { icon: hrPin(loc.status === 'open' ? '#1C392F' : '#A8634E') }).addTo(map);
      var pop = '<span class="pop-name">' + loc.city + ', ' + loc.state + '</span><span class="pop-addr">' + loc.addr + '<br>' + loc.line + '</span>' +
        (loc.status === 'open' ? '<a href="location.html?id=' + loc.slug + '">View details &rsaquo;</a>' : '<span class="pill pill--soon">Coming soon</span>');
      m.bindPopup(pop);
      m.on('click', function () { setActive(loc.slug); });
      markers[loc.slug] = m;
    });

    var countEl = document.getElementById('loccount');
    function render(filter) {
      filter = (filter || '').trim().toLowerCase();
      var shown = 0, html = '';
      locs.forEach(function (loc) {
        var hay = (loc.city + ' ' + loc.state + ' ' + loc.line + ' ' + loc.addr).toLowerCase();
        var match = !filter || hay.indexOf(filter) > -1;
        if (markers[loc.slug]) markers[loc.slug].setOpacity(match ? 1 : 0.18);
        if (!match) return;
        shown++;
        var pill = loc.status === 'open' ? '<span class="pill pill--open">Open</span>' : '<span class="pill pill--soon">Coming soon</span>';
        var lnks = loc.status === 'open'
          ? '<a href="location.html?id=' + loc.slug + '">View details</a><a href="' + gmaps(loc) + '" target="_blank" rel="noopener">Directions</a>'
          : '<a href="' + gmaps(loc) + '" target="_blank" rel="noopener">Directions</a>';
        html += '<button class="loccard" data-slug="' + loc.slug + '"><div class="loccard__top"><h3>' + loc.city + ', ' + loc.state + '</h3>' + pill + '</div>' +
          '<div class="loccard__addr">' + loc.addr + '<br>' + loc.line + '</div><div class="loccard__links">' + lnks + '</div></button>';
      });
      setHTML(listEl, html || '<div class="locpanel-empty">No locations match “' + filter + '”. Try a city or state.</div>');
      if (countEl) countEl.textContent = shown + ' location' + (shown === 1 ? '' : 's');
      listEl.querySelectorAll('.loccard').forEach(function (c) {
        c.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          var slug = c.getAttribute('data-slug');
          var loc = locs.filter(function (l) { return l.slug === slug; })[0];
          map.flyTo([loc.lat, loc.lng], 12, { duration: .8 });
          if (markers[slug]) markers[slug].openPopup();
          setActive(slug);
        });
      });
    }

    var search = document.getElementById('locsearch');
    if (search) search.addEventListener('input', function () { render(search.value); });
    var geo = document.getElementById('locgeo');
    if (geo) geo.addEventListener('click', function () {
      if (!navigator.geolocation) return;
      geo.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var la = pos.coords.latitude, ln = pos.coords.longitude, best = null, bd = Infinity;
        locs.forEach(function (l) { var d = (l.lat - la) * (l.lat - la) + (l.lng - ln) * (l.lng - ln); if (d < bd) { bd = d; best = l; } });
        map.flyTo([la, ln], 9, { duration: .9 });
        if (best) { setActive(best.slug); if (markers[best.slug]) markers[best.slug].openPopup(); }
        setHTML(geo, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Use my location');
      }, function () { geo.textContent = 'Location off'; });
    });

    render('');
    setTimeout(function () { map.invalidateSize(); }, 200);
  })();

  /* ============================================================
     Data-driven: LOCATION DETAIL (?id=slug)
     ============================================================ */
  (function locationDetail() {
    var root = document.getElementById('locdetail');
    if (!root || !window.HR) return;
    var id = new URLSearchParams(location.search).get('id');
    var loc = HR.locations.filter(function (l) { return l.slug === id; })[0];
    var titleEl = document.getElementById('loc-title');
    if (!loc) { if (titleEl) titleEl.textContent = 'Location Not Found'; setHTML(root, '<div class="wrap"><p class="lede">We couldn’t find that location. <a class="textlink" href="locations.html">See all locations</a></p></div>'); return; }

    document.title = 'Hummus Republic — ' + loc.city + ', ' + loc.state;
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var today = days[new Date().getDay()];
    var hoursRows = (loc.hours ? days.map(function (d) {
      var t = d === today ? ' class="today"' : '';
      return '<dt' + t + '>' + d + '</dt><dd' + t + '>' + (loc.hours[d] || 'Closed') + '</dd>';
    }).join('') : '');

    var orderBtns = loc.status === 'open'
      ? '<a class="btn" href="' + HR.links.order + '" target="_blank" rel="noopener">Order Online ' + ARR + '</a><a class="btn btn--ghost" href="' + HR.links.catering + '" target="_blank" rel="noopener">Order Catering</a>'
      : '<span class="pill pill--soon">Coming soon</span>';

    if (titleEl) titleEl.textContent = loc.city + ', ' + loc.state;
    setHTML(root,
      '<div class="wrap"><div class="locdetail">' +
        '<div class="locinfo reveal">' +
          '<a class="textlink" href="' + gmaps(loc) + '" target="_blank" rel="noopener" style="font-size:.9rem">' + loc.addr + ', ' + loc.line + '</a>' +
          (loc.phone ? '<div class="mt-1"><a class="num" href="tel:' + loc.phone.replace(/[^0-9+]/g, '') + '">' + loc.phone + '</a></div>' : '') +
          '<div class="row-cta">' + orderBtns + '</div>' +
          '<div class="locmeta"><span class="tag tag--diet">Pickup</span><span class="tag tag--diet">Delivery</span><span class="tag tag--diet">Dine In</span><span class="tag tag--diet">Vegan / Vegetarian</span><span class="tag tag--diet">Gluten-Free</span></div>' +
          (hoursRows ? '<div class="lochours"><h3>Hours of Operation</h3><dl>' + hoursRows + '</dl></div>' : '') +
          '<p class="locabout">Looking for fresh Mediterranean food in ' + loc.city + ', ' + loc.state + '? Build a bowl, wrap or pita exactly how you like it at our ' + loc.addr + ' location — then add a side like hummus or street-style fries. Fresh meets fast, every single day.</p>' +
        '</div>' +
        '<div class="reveal" style="--d:120ms"><div id="locdetailmap"></div></div>' +
      '</div></div>');

    if (window.L) {
      var m = L.map('locdetailmap', { scrollWheelZoom: false, zoomControl: true }).setView([loc.lat, loc.lng], 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(m);
      L.marker([loc.lat, loc.lng], { icon: hrPin('#1C392F') }).addTo(m)
        .bindPopup('<span class="pop-name">' + loc.city + ', ' + loc.state + '</span><span class="pop-addr">' + loc.addr + '</span>').openPopup();
      setTimeout(function () { m.invalidateSize(); }, 200);
    }
    var host = document.querySelector('[data-reviews-detail]');
    if (host) {
      var local = HR.reviews.filter(function (r) { return r.city === loc.city + ', ' + loc.state; });
      var set = (local.length ? local : HR.reviews);
      var row = set.concat(set).map(reviewCard).join('');
      setHTML(host, '<div class="revrow">' + row + '</div>');
    }
  })();

  /* ============================================================
     Reveal-on-scroll (base + variants + word-by-word)
     ============================================================ */
  document.querySelectorAll('[data-rv-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-rv-stagger'), 10) || 90;
    group.querySelectorAll('.reveal, .reveal-clip, [data-rv]').forEach(function (k, i) {
      if (!k.style.getPropertyValue('--d')) k.style.setProperty('--d', (i * step) + 'ms');
    });
  });
  document.querySelectorAll('.rv-words').forEach(function (h) {
    if (h.dataset.rvDone) return; h.dataset.rvDone = '1';
    var words = h.textContent.trim().split(/\s+/); h.textContent = '';
    words.forEach(function (w, i) {
      var wrap = el('span', 'rv-w'); var inner = el('span'); inner.textContent = w;
      inner.style.setProperty('--wd', (i * 80) + 'ms'); wrap.appendChild(inner); h.appendChild(wrap);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });
  var revealEls = document.querySelectorAll('.reveal, .reveal-clip, [data-rv], .rv-words');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io2 = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io2.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (e) { io2.observe(e); });
  }

  /* ============================================================
     Scroll-driven hero parallax (home)
     ============================================================ */
  (function heroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero || reduce) return;
    var bg = hero.querySelector('.hero__bg');
    var inr = hero.querySelector('.hero__in');
    if (window.matchMedia('(max-width:780px)').matches) return;
    var update = rafThrottle(function () {
      var y = window.scrollY, h = window.innerHeight || 1;
      if (y > h * 1.15) return;
      var p = Math.min(y / h, 1.2);
      if (bg) bg.style.transform = 'scale(' + (1 + p * 0.12).toFixed(4) + ') translate3d(0,' + (p * 24).toFixed(2) + 'px,0)';
      if (inr) inr.style.transform = 'translate3d(0,' + (p * -38).toFixed(2) + 'px,0)';
    });
    update();
    window.addEventListener('scroll', update, { passive: true });
  })();

  /* nav solid + mobile scroll progress -------------------- */
  var prog = null;
  if (!reduce && window.matchMedia('(max-width:600px)').matches) { prog = el('div', 'scrollprog'); document.body.appendChild(prog); }
  var onScrollAll = rafThrottle(function () {
    onNav();
    if (prog) { var st = window.scrollY, max = (doc.scrollHeight - window.innerHeight) || 1; prog.style.width = Math.max(0, Math.min(1, st / max)) * 100 + '%'; }
  });
  window.addEventListener('scroll', onScrollAll, { passive: true });

  /* ============================================================
     Magnetic buttons + 3D tilt (desktop fine pointer)
     ============================================================ */
  if (false) { /* magnetic buttons + 3D tilt disabled — friendlier, less "techy" */
    document.querySelectorAll('.btn').forEach(function (btn) {
      var strength = 0.28, rect = null;
      var reset = function () { btn.style.transform = ''; };
      btn.addEventListener('mouseenter', function () { rect = btn.getBoundingClientRect(); });
      btn.addEventListener('mousemove', function (e) {
        if (!rect) rect = btn.getBoundingClientRect();
        var mx = e.clientX - (rect.left + rect.width / 2), my = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = 'translate(' + (mx * strength).toFixed(2) + 'px,' + (my * strength).toFixed(2) + 'px)';
      });
      btn.addEventListener('mouseleave', reset); btn.addEventListener('blur', reset);
    });
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var max = parseFloat(card.getAttribute('data-tilt')) || 8, rect = null, raf = 0;
      var surface = card.querySelector('.media') || card;
      var sheen = el('span', 'tilt-sheen'); surface.appendChild(sheen);
      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width, py = (e.clientY - rect.top) / rect.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max * 2).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max * 2).toFixed(2) + 'deg)';
          var inner = card.querySelector('img'); if (inner) inner.style.transform = 'translateZ(24px) scale(1.05)';
          sheen.style.setProperty('--mx', (px * 100).toFixed(1) + '%'); sheen.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      }
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); card.classList.add('is-tilting'); });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-tilting'); card.style.transform = '';
        var inner = card.querySelector('img'); if (inner) inner.style.transform = ''; rect = null;
      });
    });
  }

  /* ---- FAQ accordion --------------------------------------- */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq__item');
      var a = item.querySelector('.faq__a');
      var open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '';
    });
  });

  /* ---- Footer year + newsletter demo ----------------------- */
  var yr = document.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();
  document.querySelectorAll('.field').forEach(function (f) {
    var btn = f.querySelector('button'), input = f.querySelector('input');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (input && input.value.indexOf('@') > 0) { btn.textContent = 'Welcome ✦'; input.value = ''; }
      else if (input) input.focus();
    });
  });

  /* ============================================================
     Refined custom cursor (fine pointers)
     ============================================================ */
  if (false) { /* custom cursor disabled — friendlier, less "techy" */
    var dot = el('div', 'cursor-dot'), ring = el('div', 'cursor-ring');
    document.body.appendChild(ring); document.body.appendChild(dot); document.body.classList.add('cursor-on');
    var dx = 0, dy = 0, rx = 0, ry = 0, tx = -100, ty = -100, started = false;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; if (!started) { started = true; dx = rx = tx; dy = ry = ty; } });
    window.addEventListener('mousedown', function () { ring.classList.add('cursor-ring--press'); });
    window.addEventListener('mouseup', function () { ring.classList.remove('cursor-ring--press'); });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = ''; ring.style.opacity = ''; });
    (function loop() {
      dx += (tx - dx) * 0.85; dy += (ty - dy) * 0.85; rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.tag,.claim,.ucard,input,.loccard,.cat,.mitem').forEach(function (x) {
      x.addEventListener('mouseenter', function () { ring.classList.add('cursor-ring--active'); dot.classList.add('cursor-dot--min'); });
      x.addEventListener('mouseleave', function () { ring.classList.remove('cursor-ring--active'); dot.classList.remove('cursor-dot--min'); });
    });
  }

  /* ============================================================
     Sticky mobile action bar
     ============================================================ */
  if (matchMedia('(max-width:600px)').matches && !document.body.hasAttribute('data-no-mbar')) {
    var mbar = el('div', 'mbar');
    var orderHref = (window.HR && HR.links.order) || 'menu.html';
    var b1 = el('a', 'btn'); b1.href = orderHref; b1.target = '_blank'; b1.rel = 'noopener'; b1.textContent = 'Order Now';
    var b2 = el('a', 'btn btn--ghost'); b2.href = 'locations.html'; b2.textContent = 'Find Us';
    mbar.appendChild(b1); mbar.appendChild(b2); document.body.appendChild(mbar);
    var toggle = function () {
      var nearBottom = window.scrollY + window.innerHeight > doc.scrollHeight - 160;
      mbar.classList.toggle('mbar--show', window.scrollY > 460 && !nearBottom);
    };
    toggle(); window.addEventListener('scroll', toggle, { passive: true });
  }

})();
