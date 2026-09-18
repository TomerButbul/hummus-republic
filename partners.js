/* ============================================================
   HUMMUS REPUBLIC — /partners  (public directory)
   ------------------------------------------------------------
   Lists the partner rows the sheet marks as Listed.

   `hummus-u` is Listed = No and must stay that way: it is the
   student campaign's config row, not a gym, and it exists only so
   /perks?p=hummus-u resolves. Filtering on `listed` here is what
   keeps an internal campaign row off a public marketing page.
   ============================================================ */
(function () {
  'use strict';

  var stateEl = document.getElementById('partners-state');
  var grid = document.getElementById('partners-grid');
  var main = document.getElementById('partners-main');
  if (!stateEl || !grid || !window.HRSheets) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function card(p) {
    var logo = p.logo
      ? '<div class="pcard__logo pcard__logo--' + (p.logoPlate === 'none' ? 'bare' : 'plate') + '">' +
          '<img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '" loading="lazy">' +
        '</div>'
      : '<p class="pcard__name">' + esc(p.name) + '</p>';

    return '<li class="pcard">' +
      logo +
      '<h2 class="h-3 pcard__title">' + esc(p.name) + '</h2>' +
      (p.description ? '<p class="pcard__desc">' + esc(p.description) + '</p>' : '') +
      (p.member.offer ? '<p class="pcard__offer">' + esc(p.member.offer) + '</p>' : '') +
      '<div class="pcard__cta">' +
        '<a class="btn btn--sm" href="perks.html?p=' + encodeURIComponent(p.slug) + '">' +
          esc(p.ctaLabel) + '</a>' +
        (p.website ? '<a class="textlink pcard__site" href="' + esc(p.website) +
          '" target="_blank" rel="noopener">Visit ' + esc(p.name) + '</a>' : '') +
      '</div>' +
      (p.finePrint ? '<p class="pcard__fine">' + esc(p.finePrint) + '</p>' : '') +
    '</li>';
  }

  window.HRSheets.partners().then(function (list) {
    var shown = list.filter(function (p) { return p.listed && p.isActive; });
    stateEl.hidden = true;
    grid.hidden = false;
    main.setAttribute('aria-busy', 'false');

    if (!shown.length) {
      grid.insertAdjacentHTML('beforeend',
        '<li class="partners__empty">New partners are on the way — check back soon.</li>');
      return;
    }
    grid.insertAdjacentHTML('beforeend', shown.map(card).join(''));

    // Same dead-hotlink guard as /perks: fall back to the name, not a blank chip.
    grid.querySelectorAll('.pcard__logo img').forEach(function (img) {
      img.addEventListener('error', function () {
        var holder = img.closest('.pcard__logo');
        if (!holder) return;
        var el = document.createElement('p');
        el.className = 'pcard__name';
        el.textContent = img.alt;
        holder.replaceWith(el);
      });
      if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
    });
  }).catch(function () {
    stateEl.textContent = '';
    stateEl.insertAdjacentHTML('beforeend',
      '<p class="perk__loading">We couldn’t load partners just now. ' +
      '<a class="textlink" href="contact.html">Get in touch</a> if you’d like to become one.</p>');
    main.setAttribute('aria-busy', 'false');
  });
})();
