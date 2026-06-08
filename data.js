/* ============================================================
   HUMMUS REPUBLIC — shared data (mock, but true to the real site)
   Locations, reviews and menu live here so the map, the review
   ticker and the menu all render from one source of truth.
   Real external links are preserved verbatim from thehummusrepublic.com.
   Swap any photo token / address / phone with production data later.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Real, preserved external links --------------------- */
  var links = {
    order:      'https://order.thehummusrepublic.com/find-location',
    catering:   'https://www.catering.thehummusrepublic.com/',
    giftcards:  'https://hummusrepublic.securetree.com/',
    nutrition:  'https://framerusercontent.com/assets/0tI3ojkkn01Qxqozpym8NtKagCo.pdf',
    appStore:   'https://apps.apple.com/us/app/hummus-republic-app/id6737941560?uo=4',
    googlePlay: 'https://play.google.com/store/apps/details?id=ai.appfront.thehummusrepublic&pcampaignid=web_share',
    instagram:  'https://www.instagram.com/hummusrepublic/?hl=en',
    facebook:   'https://www.facebook.com/hummusrepublic/',
    tiktok:     'https://www.tiktok.com/@hummusrepublic'
  };

  /* ---- Photo helper (verified Unsplash tokens) ------------ */
  function ph(token, w, h) {
    return 'https://images.unsplash.com/photo-' + token +
      '?auto=format&fit=crop&q=80&w=' + (w || 900) + (h ? '&h=' + h : '');
  }
  var P = {
    hero:       '1493770348161-369560ae357d',
    bowl:       '1540420773420-3366772f4999',
    pita:       '1604908176997-125f25cc6f3d',
    wrap:       '1606787366850-de6330128bfc',
    specials:   '1551782450-a2132b4ba21d',
    chips:      '1601050690597-df0568f70950',
    kids:       '1574484284002-952d92456975',
    gyro:       '1593560708920-61dd98c46a4e',
    shawarma:   '1623428187969-5da2dcea5ebf',
    falafelbowl:'1564834724105-918b73d1b9e0',
    greek:      '1540189549336-e6e99c3679fe',
    chicken:    '1574484284002-952d92456975',
    burger:     '1551782450-a2132b4ba21d',
    hummus:     '1607330289024-1535c6b4e1c1',
    falafel:    '1639024471283-03518883512d',
    sweetfries: '1551782450-a2132b4ba21d',
    spreads:    '1607330289024-1535c6b4e1c1',
    pitabread:  '1601050690597-df0568f70950',
    streetfries:'1606787366850-de6330128bfc',
    dolmades:   '1466637574441-749b8f19452f',
    shake:      '1466978913421-dad2ebd01d17',
    lemonade:   '1610440042657-612c34d95e9f',
    fountain:   '1533777324565-a040eb52facd',
    salad:      '1512621776951-a57141f2eefd',
    community:  '1414235077428-338989a2e8c0',
    community2: '1528605248644-14dd04022da1',
    dinner:     '1424847651672-bf20a4b0982b',
    interior:   '1517248135467-4c7edcad34c4',
    interior2:  '1552566626-52f8b828add9',
    interior3:  '1542528180-a1208c5169a5',
    fresh:      '1473093295043-cdd812d0e601',
    prep:       '1551218808-94e220e084d2',
    mezze:      '1466637574441-749b8f19452f',
    grilled:    '1432139555190-58524dae6a55',
    spread:     '1490645935967-10de6ba17061',
    bowl2:      '1505253716362-afaea1d3d1af'
  };

  /* ---- Hours templates ------------------------------------ */
  var H9 = { Sun:'11:00 AM – 9:00 PM', Mon:'11:00 AM – 9:00 PM', Tue:'11:00 AM – 9:00 PM',
    Wed:'11:00 AM – 9:00 PM', Thu:'11:00 AM – 9:00 PM', Fri:'11:00 AM – 9:00 PM', Sat:'11:00 AM – 9:00 PM' };
  var H8 = { Sun:'11:00 AM – 8:00 PM', Mon:'11:00 AM – 8:00 PM', Tue:'11:00 AM – 8:00 PM',
    Wed:'11:00 AM – 8:00 PM', Thu:'11:00 AM – 8:00 PM', Fri:'11:00 AM – 9:00 PM', Sat:'11:00 AM – 9:00 PM' };

  /* ---- Locations (addresses verbatim from the live site) -- */
  // status: 'open' (has detail page) | 'soon' (coming soon)
  var locations = [
    { slug:'burbank-ca', city:'Burbank', state:'CA', addr:'313 N San Fernando Blvd', line:'Burbank, CA 91502', phone:'(818) 562-7671', lat:34.1808, lng:-118.3090, status:'open', hours:H8 },
    { slug:'valencia-ca', city:'Valencia', state:'CA', addr:'28108 Newhall Ranch Rd', line:'Valencia, CA 91355', phone:'(661) 295-3000', lat:34.4339, lng:-118.5645, status:'open', hours:H9 },
    { slug:'ventura-ca', city:'Ventura', state:'CA', addr:'4960 Telephone Road Unit 105', line:'Ventura, CA 93003', phone:'(805) 654-1212', lat:34.2746, lng:-119.2290, status:'open', hours:H9 },
    { slug:'isla-vista-ca', city:'Isla Vista', state:'CA', addr:'6546 Pardall Rd', line:'Goleta, CA 93117', phone:'(805) 968-1010', lat:34.4133, lng:-119.8610, status:'open', hours:H9 },
    { slug:'fresno-dt-ca', city:'Fresno DT', state:'CA', addr:'2424 Tulare St', line:'Fresno, CA 93721', phone:'(559) 233-1100', lat:36.7378, lng:-119.7871, status:'open', hours:H8 },
    { slug:'turlock-ca', city:'Turlock', state:'CA', addr:'1207 W Monte Vista Ave', line:'Turlock, CA 95382', phone:'(209) 632-4000', lat:37.4947, lng:-120.8466, status:'open', hours:H8 },
    { slug:'livermore-ca', city:'Livermore', state:'CA', addr:'3032 W Jack London Blvd', line:'Livermore, CA 94551', phone:'(925) 449-7000', lat:37.6819, lng:-121.7680, status:'open', hours:H9 },
    { slug:'surprise-az', city:'Surprise', state:'AZ', addr:'13864 W Bell Rd #100', line:'Surprise, AZ 85374', phone:'(623) 544-2000', lat:33.6292, lng:-112.3680, status:'open', hours:H9 },
    { slug:'scottsdale-az', city:'Scottsdale', state:'AZ', addr:'16211 N Scottsdale Rd Ste A5', line:'Scottsdale, AZ 85254', phone:'(480) 991-3000', lat:33.6360, lng:-111.9261, status:'open', hours:H9 },
    { slug:'louisville-co', city:'Louisville', state:'CO', addr:'321 McCaslin Blvd', line:'Louisville, CO 80027', phone:'(303) 666-7000', lat:39.9778, lng:-105.1319, status:'open', hours:H8 },
    { slug:'bellevue-wa', city:'Bellevue', state:'WA', addr:'11022 NE 8th St', line:'Bellevue, WA 98004', phone:'(425) 454-1000', lat:47.6160, lng:-122.1900, status:'open', hours:H9 },
    { slug:'frisco-tx', city:'Frisco', state:'TX', addr:'3311 Preston Rd #7', line:'Frisco, TX 75034', phone:'(469) 305-4000', lat:33.1507, lng:-96.8030, status:'open', hours:H9 },
    { slug:'memphis-tn', city:'Memphis', state:'TN', addr:'750 N Germantown Pkwy Ste 105', line:'Cordova, TN 38018', phone:'(901) 754-5000', lat:35.1565, lng:-89.7762, status:'open', hours:H9 },
    { slug:'clarksville-tn', city:'Clarksville', state:'TN', addr:'108 Morris Rd #101', line:'Clarksville, TN 37040', phone:'(931) 552-3000', lat:36.5298, lng:-87.3595, status:'open', hours:H9 },
    { slug:'gallatin-tn', city:'Gallatin', state:'TN', addr:'1680 Nashville Pike', line:'Gallatin, TN 37066', phone:'(615) 451-2000', lat:36.3884, lng:-86.4467, status:'open', hours:H9 },
    { slug:'avon-in', city:'Avon', state:'IN', addr:'114 N Avon Ave', line:'Avon, IN 46123', phone:'(317) 272-1000', lat:39.7628, lng:-86.3997, status:'open', hours:H9 },
    { slug:'whitestown-in', city:'Whitestown', state:'IN', addr:'6338 Mills Dr #200', line:'Whitestown, IN 46075', phone:'(317) 769-2000', lat:39.9956, lng:-86.3450, status:'open', hours:H9 },
    { slug:'fort-wayne-in', city:'Fort Wayne', state:'IN', addr:'1034 S Thomas Rd Ste 117', line:'Fort Wayne, IN 46804', phone:'(260) 432-4000', lat:41.0700, lng:-85.1850, status:'open', hours:H9 },
    { slug:'cincinnati-oh', city:'Cincinnati', state:'OH', addr:'257 Calhoun St', line:'Cincinnati, OH 45219', phone:'(513) 281-7000', lat:39.1280, lng:-84.5170, status:'open', hours:H9 },
    { slug:'roswell-ga', city:'Roswell', state:'GA', addr:'675 W Crossville Rd Suite 140', line:'Roswell, GA 30075', phone:'(770) 642-5000', lat:34.0232, lng:-84.3616, status:'open', hours:H9 },
    { slug:'knoxville-tn', city:'Knoxville', state:'TN', addr:'4885 N Broadway St', line:'Knoxville, TN 37918', phone:'(865) 687-3000', lat:36.0270, lng:-83.9210, status:'open', hours:H9 },
    { slug:'delaware-oh', city:'Delaware', state:'OH', addr:'1710 Columbus Pike #216', line:'Delaware, OH 43015', phone:'(740) 363-2000', lat:40.2887, lng:-83.0680, status:'open', hours:H9 },
    { slug:'avon-oh', city:'Avon', state:'OH', addr:'33420 Just Imagine Dr', line:'Avon, OH 44011', phone:'(440) 934-3000', lat:41.4517, lng:-82.0354, status:'open', hours:H9 },
    { slug:'concord-nc', city:'Concord', state:'NC', addr:'3805 Concord Pkwy S Suite 140', line:'Concord, NC 28027', phone:'(704) 786-4000', lat:35.4088, lng:-80.5795, status:'open', hours:H9 },
    { slug:'tampa-fl', city:'Tampa', state:'FL', addr:'7021 E Fletcher Ave', line:'Temple Terrace, FL 33637', phone:'(813) 980-5000', lat:28.0586, lng:-82.3893, status:'open', hours:H9 },
    { slug:'high-point-nc', city:'High Point', state:'NC', addr:'1589 Skeet Club Road', line:'High Point, NC 27265', phone:'(336) 882-3000', lat:36.0400, lng:-79.9900, status:'open', hours:H9 },
    { slug:'garner-nc', city:'Garner', state:'NC', addr:'53 Cabela Dr', line:'Garner, NC 27529', phone:'(919) 772-4000', lat:35.7113, lng:-78.6142, status:'open', hours:H9 },
    { slug:'owings-mills-md', city:'Owings Mills', state:'MD', addr:'10490 Owings Mills Blvd Suite 108', line:'Owings Mills, MD 21117', phone:'(410) 363-5000', lat:39.4196, lng:-76.7803, status:'open', hours:H9 },
    { slug:'jacksonville-nc', city:'Jacksonville', state:'NC', addr:'3040 Western Boulevard Suite 200', line:'Jacksonville, NC 28546', phone:'(910) 353-2000', lat:34.7541, lng:-77.4302, status:'open', hours:H9 },
    { slug:'belair-md', city:'Bel Air', state:'MD', addr:'5 Bel Air S Pkwy Suite 1639', line:'Bel Air, MD 21015', phone:'(410) 893-4000', lat:39.5359, lng:-76.3483, status:'open', hours:H9 },
    { slug:'north-brunswick-nj', city:'North Brunswick', state:'NJ', addr:'758 Shoppes Blvd #11', line:'North Brunswick, NJ 08902', phone:'(732) 246-3000', lat:40.4501, lng:-74.4824, status:'open', hours:H9 },
    { slug:'edison-nj', city:'Edison', state:'NJ', addr:'2680 Woodbridge Ave', line:'Edison, NJ 08837', phone:'(732) 549-2000', lat:40.5187, lng:-74.4121, status:'open', hours:H9 },
    { slug:'westfield-nj', city:'Westfield', state:'NJ', addr:'102 E Broad St', line:'Westfield, NJ 07090', phone:'(908) 233-4000', lat:40.6590, lng:-74.3473, status:'open', hours:H9 },
    { slug:'woodbridge-nj', city:'Woodbridge', state:'NJ', addr:'990 Saint Georges Avenue', line:'Avenel, NJ 07001', phone:'(732) 750-3000', lat:40.5795, lng:-74.2710, status:'open', hours:H9 },
    { slug:'montclair-nj', city:'Montclair', state:'NJ', addr:'412 Bloomfield Ave', line:'Montclair, NJ 07042', phone:'(973) 744-5000', lat:40.8259, lng:-74.2090, status:'open', hours:H9 },
    { slug:'jersey-city-nj', city:'Jersey City', state:'NJ', addr:'2 Journal Square Plaza', line:'Jersey City, NJ 07306', phone:'(201) 222-4000', lat:40.7340, lng:-74.0630, status:'open', hours:H9 },
    { slug:'long-branch-nj', city:'Long Branch', state:'NJ', addr:'84 Ocean Avenue North', line:'Long Branch, NJ 07740', phone:'(732) 222-3000', lat:40.2960, lng:-73.9870, status:'open', hours:H9 },
    /* ---- Coming soon ---- */
    { slug:'pasadena-ca', city:'Pasadena', state:'CA', addr:'1661 E Colorado Blvd', line:'Pasadena, CA 91106', lat:34.1460, lng:-118.1160, status:'soon' },
    { slug:'san-antonio-tx', city:'San Antonio', state:'TX', addr:'842 Northwest Loop 410', line:'San Antonio, TX 78216', lat:29.5230, lng:-98.5240, status:'soon' },
    { slug:'fort-worth-tx', city:'Fort Worth', state:'TX', addr:'1075 Foch Street', line:'Fort Worth, TX 76107', lat:32.7430, lng:-97.3590, status:'soon' },
    { slug:'temple-tx', city:'Temple', state:'TX', addr:'2110 South 31st St Ste 100', line:'Temple, TX 76504', lat:31.0980, lng:-97.3650, status:'soon' },
    { slug:'carrollton-tx', city:'Carrollton', state:'TX', addr:'3400 E Hebron Pkwy', line:'Carrollton, TX 75007', lat:32.9970, lng:-96.8400, status:'soon' },
    { slug:'stafford-tx', city:'Stafford', state:'TX', addr:'3607 S Main St', line:'Stafford, TX 77477', lat:29.6160, lng:-95.5570, status:'soon' },
    { slug:'springfield-il', city:'Springfield', state:'IL', addr:'1322 Wabash Ave', line:'Springfield, IL 62704', lat:39.7600, lng:-89.6800, status:'soon' },
    { slug:'wauwatosa-wi', city:'Wauwatosa', state:'WI', addr:'860 N Mayfair Rd', line:'Wauwatosa, WI 53226', lat:43.0617, lng:-88.0430, status:'soon' },
    { slug:'ann-arbor-mi', city:'Ann Arbor', state:'MI', addr:'407 E Liberty St', line:'Ann Arbor, MI 48104', lat:42.2800, lng:-83.7480, status:'soon' },
    { slug:'charlotte-nc', city:'Charlotte', state:'NC', addr:'4923 Trojan Dr', line:'Charlotte, NC 28278', lat:35.1530, lng:-80.9930, status:'soon' },
    { slug:'wesley-chapel-fl', city:'Wesley Chapel', state:'FL', addr:'26962 Halter Loop', line:'Wesley Chapel, FL 33544', lat:28.2000, lng:-82.3290, status:'soon' },
    { slug:'buffalo-ny', city:'Buffalo', state:'NY', addr:'5181 Transit Rd', line:'Buffalo, NY 14221', lat:42.9760, lng:-78.6960, status:'soon' },
    { slug:'raleigh-nc', city:'Raleigh', state:'NC', addr:'8107 Creedmoor Road Suite 110', line:'Raleigh, NC 27613', lat:35.8800, lng:-78.7080, status:'soon' },
    { slug:'manassas-va', city:'Manassas', state:'VA', addr:'9510 Liberia Avenue', line:'Manassas, VA 20110', lat:38.7509, lng:-77.4753, status:'soon' },
    { slug:'glen-burnie-md', city:'Glen Burnie', state:'MD', addr:'6724 Ritchie Hwy', line:'Glen Burnie, MD 21061', lat:39.1620, lng:-76.6250, status:'soon' },
    { slug:'forest-hill-md', city:'Forest Hill', state:'MD', addr:'1534 Rock Spring Rd', line:'Forest Hill, MD', lat:39.5790, lng:-76.3960, status:'soon' },
    { slug:'hamilton-township-nj', city:'Hamilton Township', state:'NJ', addr:'3100 Quakerbridge Rd Ste 17', line:'Hamilton Township, NJ', lat:40.2090, lng:-74.6580, status:'soon' },
    { slug:'manhattan-ny', city:'Manhattan', state:'NY', addr:'110 Maiden Ln', line:'New York, NY 10005', lat:40.7068, lng:-74.0070, status:'soon' },
    { slug:'plainfield-in', city:'Plainfield', state:'IN', addr:'2870 Pearson Pkwy', line:'Plainfield, IN 46168', lat:39.7280, lng:-86.3580, status:'soon' }
  ];

  /* ---- Reviews (Burbank set is verbatim from the live site;
     others are representative mock reviews for the ticker) ---- */
  var reviews = [
    { stars:5, time:'7 months ago', text:'So good! I got a delicious bowl with the freshest Mediterranean ingredients. The staff were lovely.', name:'Cairenn Binder', city:'Burbank, CA', src:'google' },
    { stars:5, time:'5 months ago', text:'Like Mediterranean Chipotle, but better! Healthy options and so yummy.', name:'Kim Velasquez', city:'Burbank, CA', src:'google' },
    { stars:5, time:'3 weeks ago', text:'Healthy plant-based food choices, great customer service. GO — the food is tasty.', name:'PJ', city:'Burbank, CA', src:'google' },
    { stars:5, time:'6 months ago', text:'Amazing service. Amazing food.', name:'Shamir Milian', city:'Burbank, CA', src:'google' },
    { stars:5, time:'4 months ago', text:'Such a great find during a short stay in Burbank. Excellent personalized service and the bowl was perfect.', name:'Shannon', city:'Burbank, CA', src:'google' },
    { stars:5, time:'1 year ago', text:'Love ordering from here — the food is always so good and so consistent. My go-to.', name:'Pamela S', city:'Burbank, CA', src:'doordash' },
    { stars:5, time:'8 months ago', text:'Superb, excellent restaurant. I love the falafel wrap.', name:'Alan E', city:'Burbank, CA', src:'doordash' },
    { stars:5, time:'1 year ago', text:'Hummus Republic is one of those spots that never fails. The build-your-own wrap offers so much.', name:'Chris H', city:'Burbank, CA', src:'doordash' },
    { stars:5, time:'2 months ago', text:'Fresh, fast and so flavorful. The gyro bowl is unreal and the portions are generous.', name:'Marcus T', city:'Frisco, TX', src:'google' },
    { stars:5, time:'3 months ago', text:'My new lunch obsession. Build-your-own pita with extra hummus — chef’s kiss.', name:'Dana R', city:'Scottsdale, AZ', src:'google' },
    { stars:5, time:'6 months ago', text:'Clean ingredients, huge flavor, and out the door in five minutes. Exactly what I want.', name:'Olivia M', city:'Bellevue, WA', src:'google' },
    { stars:5, time:'1 month ago', text:'The fire shawarma bowl is the move. Spicy, fresh, filling. Came back twice in one week.', name:'Jared K', city:'Cincinnati, OH', src:'doordash' },
    { stars:5, time:'2 weeks ago', text:'Protein-packed and actually delicious. Sweet potato fries are a must-add.', name:'Priya N', city:'Edison, NJ', src:'google' },
    { stars:5, time:'5 months ago', text:'Best Mediterranean in town. Staff remembers my order and the tahini shake is addictive.', name:'Tony G', city:'Montclair, NJ', src:'doordash' }
  ];

  /* ---- Menu (no prices on marketing site — matches live) -- */
  var menu = [
    { key:'build', name:'Build Your Own', blurb:'Four stations, your rules. Pick a base, a protein, hummus & spreads, then pile on the toppings.', items:[
      { name:'Build Your Own Bowl', img:'images/bowl.jpg', kcal:'480–760 cal', tags:['Most popular','GF option'], desc:'Start with greens or grains, add a protein, a scoop of hummus and unlimited fresh toppings.' },
      { name:'Build Your Own Pita', img:'images/pita-bread.jpg', kcal:'520–720 cal', tags:['Vegetarian option'], desc:'A warm, fluffy pita pocket stuffed exactly how you like it — protein, spreads, crunch.' },
      { name:'Build Your Own Wrap', img:'images/oil-pour.jpg', kcal:'560–780 cal', tags:['On the go'], desc:'Everything you love about a bowl, rolled tight and ready to travel.' }
    ]},
    { key:'bowls', name:'Signature Bowls', blurb:'Our chefs already did the building. Protein-forward, generously loaded, deeply craveable.', items:[
      { name:'Gyro Garden Bowl', img:'images/bowl-eat.jpg', kcal:'710 cal', tags:['Gluten Free'], desc:'Beef & lamb gyro, zesty feta, traditional & olive hummus, artichoke hearts, olives, tomatoes, fried eggplant and tzatziki.' },
      { name:'Fire Shawarma Bowl', img:'images/toast.jpg', kcal:'680 cal', tags:['Spicy','High protein'], desc:'Chicken shawarma, Moroccan hot sauce, sumac onions, cabbage, tomatoes and a swirl of spicy hummus over your base.' },
      { name:'Falafel Fusion Bowl', img:'images/bowl-grain.jpg', kcal:'620 cal', tags:['Vegan','GF'], desc:'Crispy house falafel, traditional hummus, cucumber, tomato, cornichons, sumac onions and tahini.' }
    ]},
    { key:'sandwiches', name:'Sandwiches', blurb:'Handhelds with heart — toasted pita and flatbread, stacked and sauced.', items:[
      { name:'Greek Sandwich', img:P.greek, kcal:'640 cal', tags:['Vegetarian'], desc:'Feta, cucumber, tomato, olives, romaine and tzatziki folded into warm pita.' },
      { name:'Spicy Chicken Sandwich', img:P.chicken, kcal:'820 cal', tags:['Spicy'], desc:'Crispy chicken patty, sliced tomatoes, white cabbage, onions, jalapeños & Moroccan hot sauce. Served with sweet potato fries.' },
      { name:'Earth Burger', img:P.burger, kcal:'700 cal', tags:['Vegan'], desc:'Crispy falafel patty, sliced tomatoes, onions, white cabbage, cherry peppers & ketchup. Served with sweet potato fries.' }
    ]},
    { key:'sides', name:'Sides & Specials', blurb:'The supporting cast that steals the show.', items:[
      { name:'Pita Chips & Hummus', img:'images/hummus.jpg', kcal:'420 cal', tags:['Vegetarian','Share'], desc:'Warm, crisp pita chips with a scoop of our traditional hummus.' },
      { name:'Hummus & Spreads', img:'images/hands-spread.jpg', kcal:'260 cal', tags:['Vegan','GF'], desc:'Traditional, olive or spicy — silky, slow-blended, finished with olive oil.' },
      { name:'House Falafel', img:P.falafel, kcal:'310 cal', tags:['Vegan'], desc:'Crisp-outside, herby-inside chickpea falafel, fried to order.' },
      { name:'Sweet Potato Fries', img:P.sweetfries, kcal:'380 cal', tags:['Vegetarian'], desc:'Golden, lightly spiced and impossible to share.' },
      { name:'Street Style Fries', img:P.streetfries, kcal:'520 cal', tags:['Loaded'], desc:'Fries piled with hummus, sauces and toppings — the late-night legend.' },
      { name:'Side of Dolmades', img:'images/olive-table.jpg', kcal:'180 cal', tags:['Vegan','GF'], desc:'Grape leaves stuffed with herbed rice, a Mediterranean classic.' }
    ]},
    { key:'drinks', name:'Drinks', blurb:'Cool it down.', items:[
      { name:'Tahini Shake', img:P.shake, kcal:'410 cal', tags:['Signature'], desc:'Creamy, nutty and just sweet enough — our most-talked-about pour.' },
      { name:'Fresh Lemonade', img:P.lemonade, kcal:'150 cal', tags:['Vegan'], desc:'Hand-squeezed, bright and not too sweet.' },
      { name:'Fountain Drink', img:P.fountain, kcal:'0–200 cal', tags:[], desc:'All your favorites, ice-cold and bottomless.' }
    ]},
    { key:'kids', name:"Kid's Meal", blurb:'Little Republic, big flavor.', items:[
      { name:"Kid's Chicken Bowl", img:P.kids, kcal:'340 cal', tags:['GF option'], desc:'Tender chicken, rice and a mild side — built for smaller appetites.' },
      { name:"Kid's Chicken Sandwich", img:P.chicken, kcal:'420 cal', tags:[], desc:'Crispy chicken strips & ketchup, served with a side.' }
    ]}
  ];

  /* ---- Rewards tiers + FAQ (from the live /app page) ------ */
  var tiers = [
    { pts:300, name:'Fountain Beverage', desc:'Start your reward journey with a free fountain drink or lemonade.' },
    { pts:500, name:'Hummus & Pita', desc:'A scoop of hummus and warm pita chips, on us.' },
    { pts:600, name:'House Falafel', desc:'A side of our fresh, fried-to-order falafel.' },
    { pts:800, name:'Sweet Potato Fries', desc:'Golden, spiced and free with your points.' },
    { pts:1600, name:'Free Bowl', desc:'The big one — any signature or build-your-own bowl.' }
  ];
  var faq = [
    { q:'How do I earn points?', a:'Earn 1 point for every $1 spent in store or online when you’re signed into your Hummus Republic account. It’s that simple.' },
    { q:'Do my points expire?', a:'Points expire 180 days after they’re earned, so be sure to redeem them before they roll off.' },
    { q:'I forgot to scan — can I still get my points?', a:'Yes. Reach out through Contact Us with your order number and we’ll deposit the points within 2 business days.' },
    { q:'How do I redeem a reward?', a:'Open the Rewards tab in the app and apply your reward, or let our team know at checkout in store.' },
    { q:'Do catering orders earn points?', a:'They do — just make sure you’re signed into your account when you place the catering order.' },
    { q:'How will I hear about bonus point days?', a:'Members get our newsletter and push notifications for double-point days, secret menu drops and members-only perks.' }
  ];

  window.HR = { links:links, ph:ph, P:P, locations:locations, reviews:reviews, menu:menu, tiers:tiers, faq:faq };
})();
