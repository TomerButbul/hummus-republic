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

   Photography is the real product shots, downloaded from the live
   site's CDN. 17 of the 19 are transparent cutouts; fountain-drink
   and lemonade carry a baked #FFF9EA backdrop, because a transparent
   drink cup cannot be cut out — see --photo-plate in hummus.css.
   ============================================================ */
(function () {
  'use strict';
  window.HR = window.HR || {};

  /* slug, name, calories (verbatim), description (verbatim), photo */
  window.HR.menuItems = [
    { slug: 'bowl', name: 'Bowl', cal: '390 - 1130',
      desc: 'Build your own dream bowl, just the way you like it.',
      img: 'images/menu/bowl.png',
      alt: 'Top-down view of a customizable Mediterranean grain bowl with greens, protein and assorted toppings' },

    { slug: 'pita', name: 'Pita', cal: '620 - 1360',
      desc: 'Fluffy pita, stuffed your way. Fresh, and full of flavor.',
      img: 'images/menu/pita.png',
      alt: 'A fluffy pita bread pocket stuffed with fresh salad, protein and drizzled tahini sauce' },

    { slug: 'wrap', name: 'Wrap', cal: '600 - 1420',
      desc: 'Your favorite flavors, all rolled into one.',
      img: 'images/menu/wrap.png',
      alt: 'A tightly wrapped Mediterranean wrap with fresh vegetables and grilled protein' },

    { slug: 'hummus-spreads', name: 'Hummus & Spreads', cal: '840 - 1240',
      desc: 'Hummus & spreads made fresh in-house. 8oz, choose up to 5 flavors',
      img: 'images/menu/hummus-spreads.png',
      alt: 'Top-down shot of a container filled with various types of hummus' },

    { slug: 'falafel', name: 'Falafel', cal: '380',
      desc: 'Crispy falafel, made fresh with chickpeas, herbs & spices. Served with 5 pieces',
      img: 'images/menu/falafel.png',
      alt: 'Top-down shot of a container with falafel balls' },

    { slug: 'earth-burger', name: 'Earth Burger', cal: '450',
      desc: 'Crispy falafel patty, sliced tomatoes, onions, white cabbage, cherry peppers, & ketchup. Served with sweet potato fries.',
      img: 'images/menu/earth-burger.png',
      alt: 'Falafel patty burger with tomatoes, onions, white cabbage and cherry peppers' },

    { slug: 'greek-sandwich', name: 'Greek Sandwich', cal: '650',
      desc: 'Grilled beef & lamb gyro, sliced tomatoes, street mix, onions and jalapeños served with sweet potato fries or pita chips.',
      img: 'images/menu/greek-sandwich.png',
      alt: 'A toasted sandwich layered with Mediterranean meats, tomatoes, pickles and fresh greens' },

    { slug: 'spicy-chicken-sandwich', name: 'Spicy Chicken Sandwich', cal: '480',
      desc: 'Crispy chicken patty, sliced tomatoes, white cabbage, onions, jalapeños, & Moroccan hot sauce served with sweet potato fries.',
      img: 'images/menu/spicy-chicken-sandwich.png',
      alt: 'Crispy chicken patty with sliced tomatoes on a bed of cabbage' },

    { slug: 'street-style-fries', name: 'Street Style Fries', cal: '550',
      desc: 'Sweet potato fries, red cabbage, fried eggplant, olives, fried jalapeno, chickpea croutons, crumbled feta, tahini dressing.',
      img: 'images/menu/street-style-fries.png',
      alt: 'Top-down shot of a bowl of sweet potato fries with various toppings' },

    { slug: 'sweet-potato-fries', name: 'Sweet Potato Fries', cal: '220',
      desc: 'Golden sweet potato fries tossed with our signature za’atar seasoning',
      img: 'images/menu/sweet-potato-fries.png',
      alt: 'Waffle-cut sweet potato fries in a small paper bag' },

    { slug: 'pita-chips', name: 'Pita Chips', cal: '440',
      desc: 'Our signature warm, golden, and perfectly crispy pita chips.',
      img: 'images/menu/pita-chips.png',
      alt: 'Pita chips in a small paper bag' },

    { slug: 'pita-chips-hummus', name: 'Pita Chips & Hummus', cal: '430 - 760',
      desc: 'Fresh pita chips seasoned with za’atar paired with our house-made hummus. Pick up to 5 flavors',
      img: 'images/menu/pita-chips-hummus.png',
      alt: 'Pita chips in a paper bag with a container of assorted hummus scoops' },

    { slug: 'pita-bread', name: 'Pita Bread', cal: '165',
      desc: 'Fresh Pita Bread',
      img: 'images/menu/pita-bread.png',
      alt: 'Top-down shot of a single pita bread' },

    { slug: 'side-of-dolmades', name: 'Side of Dolmades', cal: '200',
      desc: 'Stuffed grape leaves with rice, herbs & spices. 100% plant-based. Served with 5 pieces',
      img: 'images/menu/side-of-dolmades.png',
      alt: 'Front-facing shot of two dolmades, one in front of the other' },

    { slug: 'kid-s-chicken-bowl', name: "Kid's Chicken Bowl", cal: '350',
      desc: 'Crispy chicken strips & ketchup. Served with sweet potato fries and drink',
      img: 'images/menu/kid-s-chicken-bowl.png',
      alt: 'Crispy chicken strips with ketchup' },

    { slug: 'kid-s-chicken-sandwich', name: "Kid's Chicken Sandwich", cal: '610',
      desc: 'Crispy chicken patty, sliced tomatoes and ketchup. Served with sweet potato fries and drink',
      img: 'images/menu/kid-s-chicken-sandwich.png',
      alt: 'Crispy chicken patty with sliced tomatoes and a small paper bag of fries' },

    { slug: 'tahini-shake', name: 'Tahini Shake', cal: '730',
      desc: 'Our signature smooth, chocolatey tahini shake blended with vanilla ice cream & almond milk.',
      img: 'images/menu/tahini-shake.png',
      alt: 'Tahini shake in a plastic cup with stripes of chocolate' },

    { slug: 'lemonade', name: 'Lemonade', cal: '20 - 30',
      desc: 'Refreshing lemonade in a variety of flavors',
      img: 'images/menu/lemonade.png',
      alt: 'Front-facing shot of three plastic cups of lemonade' },

    { slug: 'fountain-drink', name: 'Fountain Drink', cal: '20 - 100',
      desc: 'A variety of fountain drinks to pair with your perfect meal',
      img: 'images/menu/fountain-drink.png',
      alt: 'Front-facing shot of a plastic cup filled with a yellow beverage' }
  ];
})();
