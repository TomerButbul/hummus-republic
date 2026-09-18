/* ============================================================
   HUMMUS REPUBLIC — menu item pages
   ------------------------------------------------------------
   Names, descriptions and CALORIE RANGES read from the live site
   (thehummusrepublic.com/hummus-republic-menu/<slug>), not written
   for this rebuild.

   That distinction matters more here than anywhere else on the
   site. data.js carries invented figures — it has the Bowl at
   "480–760 cal" where the real range is 390–1130. Hummus Republic
   is past 20 locations, which puts its menu under FDA menu-labeling
   rules, so a calorie number on a page is a regulatory statement,
   not decoration. Nothing in this file is estimated: if a value was
   not on the live page it is left empty rather than guessed.

   Photography is still the rebuild's own (images/mi-*.jpg) and is
   matched by hand below; swap any token when real product shots
   are available.
   ============================================================ */
(function () {
  'use strict';
  window.HR = window.HR || {};

  /* slug, name, calories (verbatim), description (verbatim), photo */
  window.HR.menuItems = [
    { slug: 'bowl', name: 'Bowl', cal: '390 - 1130',
      desc: 'Build your own dream bowl, just the way you like it.',
      img: 'images/mi-bowl.jpg' },

    { slug: 'pita', name: 'Pita', cal: '620 - 1360',
      desc: 'Fluffy pita, stuffed your way. Fresh, and full of flavor.',
      img: 'images/mi-pita.jpg' },

    { slug: 'wrap', name: 'Wrap', cal: '600 - 1420',
      desc: 'Your favorite flavors, all rolled into one.',
      img: 'images/c-wrap.jpg' },

    { slug: 'hummus-spreads', name: 'Hummus & Spreads', cal: '840 - 1240',
      desc: 'Hummus & spreads made fresh in-house. 8oz, choose up to 5 flavors',
      img: 'images/mi-spreads.jpg' },

    { slug: 'falafel', name: 'Falafel', cal: '380',
      desc: 'Crispy falafel, made fresh with chickpeas, herbs & spices. Served with 5 pieces',
      img: 'images/bowl-falafel.jpg' },

    { slug: 'earth-burger', name: 'Earth Burger', cal: '450',
      desc: 'Crispy falafel patty, sliced tomatoes, onions, white cabbage, cherry peppers, & ketchup. Served with sweet potato fries.',
      img: 'images/mi-burger.jpg' },

    { slug: 'greek-sandwich', name: 'Greek Sandwich', cal: '650',
      desc: 'Grilled beef & lamb gyro, sliced tomatoes, street mix, onions and jalapeños served with sweet potato fries or pita chips.',
      img: 'images/mi-greek.jpg' },

    { slug: 'spicy-chicken-sandwich', name: 'Spicy Chicken Sandwich', cal: '480',
      desc: 'Crispy chicken patty, sliced tomatoes, white cabbage, onions, jalapeños, & Moroccan hot sauce served with sweet potato fries.',
      img: 'images/mi-chicken.jpg' },

    { slug: 'street-style-fries', name: 'Street Style Fries', cal: '550',
      desc: 'Sweet potato fries, red cabbage, fried eggplant, olives, fried jalapeno, chickpea croutons, crumbled feta, tahini dressing.',
      img: 'images/mi-streetfries.jpg' },

    { slug: 'sweet-potato-fries', name: 'Sweet Potato Fries', cal: '220',
      desc: 'Golden sweet potato fries tossed with our signature za’atar seasoning',
      img: 'images/mi-sweetfries.jpg' },

    { slug: 'pita-chips', name: 'Pita Chips', cal: '440',
      desc: 'Our signature warm, golden, and perfectly crispy pita chips.',
      img: 'images/mi-chipsbag.jpg' },

    { slug: 'pita-chips-hummus', name: 'Pita Chips & Hummus', cal: '430 - 760',
      desc: 'Fresh pita chips seasoned with za’atar paired with our house-made hummus. Pick up to 5 flavors',
      img: 'images/hummus.jpg' },

    { slug: 'pita-bread', name: 'Pita Bread', cal: '165',
      desc: 'Fresh Pita Bread',
      img: 'images/mi-pitabread.jpg' },

    { slug: 'side-of-dolmades', name: 'Side of Dolmades', cal: '200',
      desc: 'Stuffed grape leaves with rice, herbs & spices. 100% plant-based. Served with 5 pieces',
      img: 'images/mi-dolmades.jpg' },

    { slug: 'kid-s-chicken-bowl', name: "Kid's Chicken Bowl", cal: '350',
      desc: 'Crispy chicken strips & ketchup. Served with sweet potato fries and drink',
      img: 'images/mi-kidchicken.jpg' },

    { slug: 'kid-s-chicken-sandwich', name: "Kid's Chicken Sandwich", cal: '610',
      desc: 'Crispy chicken patty, sliced tomatoes and ketchup. Served with sweet potato fries and drink',
      img: 'images/c-kids.jpg' },

    { slug: 'tahini-shake', name: 'Tahini Shake', cal: '730',
      desc: 'Our signature smooth, chocolatey tahini shake blended with vanilla ice cream & almond milk.',
      img: 'images/mi-shake.jpg' },

    { slug: 'lemonade', name: 'Lemonade', cal: '20 - 30',
      desc: 'Refreshing lemonade in a variety of flavors',
      img: 'images/lemons.jpg' },

    { slug: 'fountain-drink', name: 'Fountain Drink', cal: '20 - 100',
      desc: 'A variety of fountain drinks to pair with your perfect meal',
      img: 'images/mi-fountain.jpg' }
  ];
})();
