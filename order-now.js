/* ============================================================
   HUMMUS REPUBLIC — /order-now
   ------------------------------------------------------------
   One job: get someone from "I want Hummus Republic" to their own
   store's menu in as few taps as possible.

   The generic find-location URL asks a customer to choose a store
   on a second site after they have already chosen one here. Every
   open store in the sheet carries a direct Appfront branchId link,
   so each card links straight to that store's menu instead.
   ============================================================ */
(function () {
  'use strict';

  var grid = document.getElementById('ordergrid');
  var input = document.getElementById('ordersearch');
  var count = document.getElementById('ordercount');
  if (!grid || !window.HR || !HR.locations) return;

  var GENERIC = 'https://order.thehummusrepublic.com/find-location';

  // Only stores you can actually order from belong on an ordering page.
  var stores = HR.locations.filter(function (l) {
    return l.status === 'open' && (l.orderPickup || l.orderNow || l.orderDelivery);
  }).sort(function (a, b) {
    return (a.state + a.city).localeCompare(b.state + b.city);
  });

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function card(l) {
    var pickup = l.orderPickup || l.orderNow;
    var name = l.city + ', ' + l.state;
    return '<li class="ocard">' +
      '<h2 class="ocard__name">' + esc(name) + '</h2>' +
      '<p class="ocard__addr">' + esc(l.addr) + '</p>' +
      '<div class="ocard__cta">' +
        (pickup ? '<a class="btn btn--sm btn--gold" href="' + esc(pickup) + '" target="_blank" rel="noopener">' +
          'Pickup<span class="vh"> from ' + esc(name) + '</span></a>' : '') +
        (l.orderDelivery ? '<a class="btn btn--sm btn--ghost" href="' + esc(l.orderDelivery) + '" target="_blank" rel="noopener">' +
          'Delivery<span class="vh"> from ' + esc(name) + '</span></a>' : '') +
      '</div>' +
      '<a class="ocard__detail textlink" href="location.html?id=' + encodeURIComponent(l.slug) + '">' +
        'Hours &amp; details<span class="vh"> for ' + esc(name) + '</span></a>' +
    '</li>';
  }

  function render(list) {
    grid.textContent = '';
    if (!list.length) {
      grid.insertAdjacentHTML('beforeend',
        '<li class="ordergrid__empty">No stores match that search. ' +
        '<a class="textlink" href="locations.html">See all locations</a>.</li>');
    } else {
      grid.insertAdjacentHTML('beforeend', list.map(card).join(''));
    }
    if (count) {
      count.textContent = list.length === stores.length
        ? stores.length + ' stores taking orders'
        : list.length + ' of ' + stores.length + ' stores';
    }
  }

  function filter(q) {
    q = q.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(function (l) {
      return (l.city + ' ' + l.state + ' ' + l.zip + ' ' + l.addr).toLowerCase().indexOf(q) !== -1;
    });
  }

  render(stores);

  if (input) {
    var t;
    input.addEventListener('input', function () {
      clearTimeout(t);
      // Debounced so the aria-live count is not re-announced on every keystroke.
      t = setTimeout(function () { render(filter(input.value)); }, 180);
    });
  }
})();
