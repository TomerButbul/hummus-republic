/* ============================================================
   HUMMUS REPUBLIC — /perks  (partner landing)
   ------------------------------------------------------------
   This page is reached almost entirely by phone camera, from a QR
   code printed on something physical that has already shipped:

     members    https://thehummusrepublic.com/perks?p=<slug>
     employees  https://thehummusrepublic.com/perks?p=<slug>&k=<code>

   Those exact URLs live in the sheet's "Member QR URL" / "Employee
   QR URL" columns and are the contract. A slug that stops resolving
   does not 404 in a way anyone notices — it silently turns a printed
   code into a dead end, at the partner's gym, in front of a customer.
   So the failure mode here is never a blank page: an unknown slug
   still gets a usable Hummus Republic page with a way to order.

   One row is not a partner. `hummus-u` is the student campaign's
   config row: its landing page appends ?p=hummus-u to the reward URL
   and this page is what resolves it, so the slug must keep working
   even though the row is Listed = No and must never appear in the
   partner directory.
   ============================================================ */
(function () {
  'use strict';

  var APPFRONT_BASE = 'https://thehummusrepublic.appfront.app';
  var ORDER_FALLBACK = 'https://order.thehummusrepublic.com/find-location';

  var stateEl = document.getElementById('perk-state');
  var bodyEl = document.getElementById('perk-body');
  var main = document.getElementById('perk-main');
  if (!stateEl || !bodyEl) return;

  /* ---- query ------------------------------------------------- */
  var q = new URLSearchParams(location.search);
  var slug = (q.get('p') || q.get('partner') || '').trim().toLowerCase();
  var code = (q.get('k') || q.get('code') || '').trim();
  var audienceParam = (q.get('a') || q.get('audience') || '').trim().toLowerCase();

  function relLuminance(hex) {
    var m = String(hex).trim().replace('#', '');
    if (m.length === 3) m = m[0]+m[0]+m[1]+m[1]+m[2]+m[2];
    if (!/^[0-9a-f]{6}$/i.test(m)) return null;
    var c = [0, 2, 4].map(function (i) {
      var v = parseInt(m.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Build the Appfront embedded-signup URL.
     deepLinkGroupHash is what attributes the reward to this partner AND this
     audience — members and employees have different groups, so getting it
     from the wrong audience silently grants the wrong offer. */
  function signupUrl(partner, content) {
    var base = (partner.appfrontUrl || APPFRONT_BASE).replace(/\/+$/, '');
    var p = new URLSearchParams();
    p.set('hideHeaders', 'true');
    p.set('hidePreferredLocations', 'true');
    if (content.signupGroup) p.set('deepLinkGroupHash', content.signupGroup);
    return base + '/embed/signup/?' + p.toString();
  }

  function done() {
    stateEl.hidden = true;
    bodyEl.hidden = false;
    main.setAttribute('aria-busy', 'false');
  }

  function render(html) {
    bodyEl.textContent = '';
    bodyEl.insertAdjacentHTML('beforeend', html);
    done();
  }

  /* ---- states ------------------------------------------------ */

  /* Deliberately not a dead end. Someone standing in a gym holding a phone
     should still be one tap from ordering, even if the slug is wrong. */
  function renderUnknown(message) {
    document.title = 'Partner Perks | Hummus Republic';
    render(
      '<header class="phead phead--sand grain"><div class="wrap">' +
        '<h1 class="h-1">Partner perks</h1>' +
        '<p class="lede">' + esc(message) + '</p>' +
      '</div></header>' +
      '<section class="wrap wrap--narrow perk__fallback">' +
        '<p>Double-check the code you scanned, or head straight to the good part:</p>' +
        '<div class="perk__cta">' +
          '<a class="btn btn--gold" href="' + ORDER_FALLBACK + '">Order now</a>' +
          '<a class="btn btn--ghost" href="locations.html">Find a location</a>' +
        '</div>' +
      '</section>'
    );
  }

  function renderGate(partner) {
    document.title = partner.name + ' team offer | Hummus Republic';
    render(
      '<header class="phead phead--forest grain"><div class="wrap">' +
        '<span class="crumb phead__crumb">' + esc(partner.name) + '</span>' +
        '<h1 class="h-1">Team members only</h1>' +
        '<p class="lede">This offer is for ' + esc(partner.name) +
          ' staff. Scan the team QR code, or use the member offer instead.</p>' +
      '</div></header>' +
      '<section class="wrap wrap--narrow perk__fallback">' +
        '<div class="perk__cta">' +
          '<a class="btn btn--gold" href="perks.html?p=' + encodeURIComponent(partner.slug) + '">' +
            'See the member offer</a>' +
        '</div>' +
      '</section>'
    );
  }

  function renderPartner(partner, content, isEmployee) {
    var title = content.headline || (partner.name + ' × Hummus Republic');
    document.title = title + ' | Hummus Republic';

    var logo = partner.logo
      ? '<div class="perk__logo perk__logo--' + (partner.logoPlate === 'none' ? 'bare' : 'plate') + '">' +
          '<img src="' + esc(partner.logo) + '" alt="' + esc(partner.name) + '" loading="eager">' +
        '</div>'
      : '<p class="perk__partnername">' + esc(partner.name) + '</p>';

    var url = signupUrl(partner, content);

    var html =
      '<header class="perk__hero grain">' +
        '<div class="wrap">' +
          '<div class="perk__marks">' + logo +
            '<span class="perk__x" aria-hidden="true">&times;</span>' +
            '<span class="perk__hr" aria-label="Hummus Republic">' +
              '<img src="images/hr-mark.svg" alt="" width="52" height="52"></span>' +
          '</div>' +
          (isEmployee ? '<span class="pill-new perk__badge">Team offer</span>' : '') +
          '<h1 class="h-1 perk__headline">' + esc(title) + '</h1>' +
          (content.subhead ? '<p class="lede perk__subhead">' + esc(content.subhead) + '</p>' : '') +
          (content.offer ? '<p class="perk__offer">' + esc(content.offer) + '</p>' : '') +
        '</div>' +
      '</header>' +

      '<section class="wrap perk__signup">' +
        '<h2 class="h-3 perk__signup-title">Claim it in a few taps</h2>' +
        '<iframe class="perk__frame" src="' + esc(url) + '" title="Sign up for your ' +
          esc(partner.name) + ' offer" loading="eager"></iframe>' +
        // Third-party frames get blocked by tracking-protection and some
        // corporate wifi. A visible link means the offer is still claimable
        // when the frame silently renders nothing.
        '<p class="perk__frame-fallback">Form not loading? ' +
          '<a class="textlink" href="' + esc(url) + '">Open the signup form</a>.</p>' +
        (content.finePrint ? '<p class="perk__fine">' + esc(content.finePrint) + '</p>' : '') +
        (partner.finePrint ? '<p class="perk__fine">' + esc(partner.finePrint) + '</p>' : '') +
      '</section>';

    render(html);

    /* Several partner logos are hotlinked from CDNs Hummus Republic does not
       control and at least one is already a 404. A broken <img> inside a
       light plate renders as a white sliver on the green band, which looks
       like a build error to the customer standing in the gym. Fall back to
       the partner's name set in the brand face instead. */
    var img = bodyEl.querySelector('.perk__logo img');
    if (img) {
      img.addEventListener('error', function () {
        var holder = img.closest('.perk__logo');
        if (!holder) return;
        var p = document.createElement('p');
        p.className = 'perk__partnername';
        p.textContent = partner.name;
        holder.replaceWith(p);
      });
      if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    }

    /* The offer pill is filled with the partner's own brand colour, which the
       sheet can set to anything. Dark text is right on LA Fitness blue and
       unreadable on a dark navy, so the label colour is chosen from the
       actual luminance rather than assumed. WCAG's relative-luminance formula,
       0.179 being the crossover where black and white contrast equally. */
    if (partner.color) {
      document.documentElement.style.setProperty('--partner', partner.color);
      var lum = relLuminance(partner.color);
      if (lum !== null) {
        document.documentElement.style.setProperty(
          '--partner-ink', lum > 0.179 ? 'var(--espresso)' : 'var(--cream)');
      }
      document.body.classList.add('has-partner-color');
    }
  }

  /* ---- boot --------------------------------------------------- */

  if (!slug) {
    renderUnknown('Scan the QR code at your gym or studio to see your offer.');
    return;
  }

  if (!window.HRSheets) {
    renderUnknown("We couldn't load offers just now.");
    return;
  }

  window.HRSheets.partner(slug).then(function (partner) {
    if (!partner || !partner.isActive) {
      renderUnknown("We couldn't find that offer. It may have ended.");
      return;
    }

    var wantsEmployee = audienceParam.indexOf('emp') === 0 ||
                        audienceParam.indexOf('staff') === 0 || !!code;

    if (wantsEmployee) {
      var expected = (partner.employeeCode || '').trim().toLowerCase();
      // No code configured means the employee view cannot be unlocked at all,
      // rather than being unlocked by an empty ?k=.
      if (!expected || code.toLowerCase() !== expected) {
        renderGate(partner);
        return;
      }
      renderPartner(partner, partner.employee, true);
      return;
    }

    renderPartner(partner, partner.member, false);
  }).catch(function () {
    renderUnknown("We couldn't load your offer just now. Please try again.");
  });
})();
