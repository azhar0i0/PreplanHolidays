// All catalogue data. Keep this file as the single source of truth for
// packages, hotels, reviews and FAQs. `node src/build.js` renders every page from it.

const IMG = (id, w = 1200) => id.startsWith("images/") ? "/" + id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

/* ---------------- Italian cities and the hotels we use ---------------- */
const C = {
  rome: {
    name: "Rome", slug: "rome", nights: 3, price: 489,
    imgs: ["photo-1605200723310-5df264c13e22", "photo-1663143146856-683650ffee76"],
    ia: ["The Pantheon", "The Spanish Steps"],
    hp: ["images/hotels/rome-trevi-collection-hotel-room.jpg", "images/hotels/rome-trevi-collection-hotel-terrace.jpg", "images/hotels/rome-trevi-collection-hotel-lounge.jpg"],
    gal: ["images/hotels/rome-trevi-collection-hotel-terrace.jpg", "photo-1605200723310-5df264c13e22", "photo-1663143146856-683650ffee76"],
    hotel: "Trevi Collection Hotel", addr: "Via Capo le Case 60, 00187 Rome, Italy", phone: "+39 06 7984 4142",
    room: "Standard Quadruple Room", board: "Breakfast", bed: "Double bed requested", area: "Near the Trevi Fountain",
    perks: ["Breakfast daily", "Sleeps up to 4", "Baby cot available"],
    tiles: [
      ["ph-coins", "City tax", "Tourist city tax is not in the price. If it applies, you pay it on the spot at the hotel."],
      ["ph-credit-card", "Deposit", "The hotel may ask for a cash or card deposit as a guarantee. It comes back at departure, minus any charges."],
      ["ph-baby", "Travelling with a baby", "A cot for children aged 0 to 2 costs 16 euros per night, paid at the hotel."],
      ["ph-users-three", "Groups", "Five or more rooms on the same dates count as a group. The hotel confirms these separately, at its own rates."]
    ],
    days: [
      ["Colosseum and the Roman Forum", "Start early at the Colosseum, then walk the Forum and Palatine Hill. Evening coin toss at Trevi, a few minutes from the hotel."],
      ["Vatican Museums and St Peter's", "Book a morning slot for the Sistine Chapel, then cross to St Peter's Basilica. Dinner in Trastevere."]
    ],
    station: "Roma Termini", airport: "Rome Fiumicino (FCO)",
    geo: { lat: 41.9028, lng: 12.4964 }
  },
  florence: {
    name: "Florence", slug: "florence", nights: 2, price: 365,
    imgs: ["photo-1748191024180-53a4890c96e4", "photo-1651536146537-a52d68e337bc"],
    ia: ["Florence from Piazzale Michelangelo", "The Neptune Fountain in Piazza della Signoria"],
    hp: ["images/hotels/florence-grand-hotel-adriatico-room.jpg", "images/hotels/florence-grand-hotel-adriatico-balcony.jpg"],
    gal: ["images/hotels/florence-grand-hotel-adriatico-balcony.jpg", "photo-1748191024180-53a4890c96e4", "photo-1651536146537-a52d68e337bc"],
    hotel: "Grand Hotel Adriatico", addr: "Via Maso Finiguerra 9, 50123 Florence, Italy", phone: "+39 055 27931",
    room: "Comfort Room", board: "Breakfast", bed: "Double bed requested", area: "Near Santa Maria Novella",
    perks: ["Breakfast daily", "24-hour front desk", "Walk to the Duomo"],
    tiles: [
      ["ph-coins", "City tax", "Local city tax and any resort fee are not in the rate. You pay them directly to the hotel."],
      ["ph-moon-stars", "Late arrival", "The front desk is open 24 hours, so a late train or flight is not a problem."],
      ["ph-bed", "Bed type", "A double bed is requested for you. The hotel does its best, but bedding is not guaranteed."],
      ["ph-prohibit", "No-show", "Same-day cancellations and no-shows are charged 100% of the stay."]
    ],
    days: [
      ["Duomo, Baptistery and the Uffizi", "Climb Brunelleschi's dome in the morning, then spend the afternoon with Botticelli at the Uffizi. Sunset from Piazzale Michelangelo."]
    ],
    station: "Firenze Santa Maria Novella", airport: "Florence Peretola (FLR)",
    geo: { lat: 43.7696, lng: 11.2558 }
  },
  venice: {
    name: "Venice", slug: "venice", nights: 2, price: 612,
    imgs: ["photo-1681759180062-11a4e7a18d9b", "photo-1514890547357-a9ee288728e0"],
    ia: ["The St Mark's bell tower", "The Grand Canal and Santa Maria della Salute"],
    hp: ["images/hotels/venice-hotel-monaco-grand-canal-exterior.jpg", "images/hotels/venice-hotel-monaco-grand-canal-room.jpg", "images/hotels/venice-hotel-monaco-grand-canal-terrace.jpg"],
    gal: ["images/hotels/venice-hotel-monaco-grand-canal-room.jpg", "photo-1681759180062-11a4e7a18d9b", "photo-1514890547357-a9ee288728e0"],
    hotel: "Hotel Monaco & Grand Canal", addr: "Calle Vallaresso, San Marco 1332, 30124 Venice, Italy", phone: "+39 041 520 0211",
    room: "Standard Room", board: "Breakfast", bed: "Bed preference passed on", area: "On the Grand Canal by St Mark's",
    perks: ["Breakfast daily", "Grand Canal location", "Steps from St Mark's"],
    tiles: [
      ["ph-coins", "City tax", "Set by star rating and season, up to 5 euros per person per night from February to December, 30% less in January. Charged for the first 5 nights only."],
      ["ph-baby", "Children", "Under 10s pay no city tax. Ages 10 to 16 pay half."],
      ["ph-calendar-x", "Dates are fixed", "Once booked, the check-in date on this stay cannot be changed."],
      ["ph-prohibit", "No-show", "Same-day cancellations and no-shows are charged 100% of the stay."]
    ],
    days: [
      ["St Mark's Square and the Grand Canal", "Basilica and Doge's Palace in the morning, then ride vaporetto line 1 the full length of the Grand Canal. Spritz by the water."]
    ],
    station: "Venezia Santa Lucia", airport: "Venice Marco Polo (VCE)",
    geo: { lat: 45.4343, lng: 12.3388 }
  },
  milan: {
    name: "Milan", slug: "milan", nights: 2, price: 298,
    imgs: ["photo-1513581166391-887a96ddeafd", "photo-1518797814703-ed31ee241ef8"],
    ia: ["The Navigli canals at dusk", "Inside the Galleria Vittorio Emanuele II"],
    hp: ["images/hotels/milan-holiday-inn-garibaldi-station-exterior.jpg", "images/hotels/milan-holiday-inn-garibaldi-station-lobby.jpg"],
    gal: ["photo-1513581166391-887a96ddeafd", "photo-1518797814703-ed31ee241ef8"],
    hotel: "Holiday Inn Milan Garibaldi Station", addr: "Via Ugo Bassi 1/a, 20159 Milan, Italy", phone: "+39 02 607 6801",
    room: "Double Standard Room", board: "Breakfast for 2", bed: "Twin beds requested", area: "By Garibaldi Station",
    perks: ["Breakfast for 2", "Connecting rooms", "LGBTQ+ friendly"],
    tiles: [
      ["ph-coins", "City tax", "10 euros per person, per night, paid at the hotel. Guests under 18 are exempt."],
      ["ph-identification-card", "At check-in", "Every guest, children included, shows a government photo ID or passport."],
      ["ph-coffee", "Breakfast", "Covers up to 2 adults sharing a room. Extra guests pay for breakfast at the hotel."],
      ["ph-wallet", "Paying locally", "Cashless payment works for everything. Cash payments are capped at 5,000 euros by Italian law."]
    ],
    days: [
      ["Duomo rooftop and the Galleria", "Take the lift to the cathedral terraces, browse Galleria Vittorio Emanuele II, then aperitivo along the Navigli canals."]
    ],
    station: "Milano Porta Garibaldi / Milano Centrale", airport: "Milan Malpensa (MXP)",
    geo: { lat: 45.4642, lng: 9.19 }
  }
};

/* ---------------- Italy hotel packages ---------------- */
const PI = [
  { s: "rome-trevi-three-nights", im: "photo-1525874684015-58379d421a52", t: "Three nights by the Trevi Fountain", c: ["rome"], b: "A central Rome base for the Colosseum, the Vatican and late walks past the fountain. The quadruple room suits families and friends sharing." },
  { s: "venice-grand-canal", im: "photo-1523906834658-6e24ef2386f9", t: "Venice on the Grand Canal", c: ["venice"], b: "Two nights at a canal-front hotel a short walk from St Mark's Square, with breakfast and the city tax rules spelled out." },
  { s: "rome-and-florence", im: "photo-1552832230-c0197dd311b5", t: "Rome and Florence classics", c: ["rome", "florence"], b: "Ancient Rome, then Renaissance Florence by fast train. Five nights, two central hotels, breakfast every morning." },
  { s: "florence-weekend", im: "photo-1541370976299-4d24ebbc9077", t: "A Florence weekend near Santa Maria Novella", c: ["florence"], b: "Two nights near the station with a 24-hour front desk, ideal for a short Renaissance break or a stop between cities." },
  { s: "italy-big-three", im: "photo-1575379972263-2f15a5c78236", t: "Italy's big three: Rome, Florence, Venice", c: ["rome", "florence", "venice"], b: "The route most people dream about, planned as one trip. Seven nights across three hand-checked hotels." },
  { s: "milan-garibaldi-break", im: "photo-1690489964962-dcaaf37b22c0", t: "Milan city break at Garibaldi", c: ["milan"], b: "Two nights by Garibaldi Station with breakfast for two, easy links to the Duomo, Brera and Malpensa trains." },
  { s: "milan-and-venice", im: "photo-1546441758-a678df1d3138", t: "Milan and Venice by rail", c: ["milan", "venice"], b: "Design city to lagoon city in under three hours by train. Four nights, two hotels, one clear price." },
  { s: "florence-and-venice", im: "photo-1516186366443-0744a82bffef", t: "Florence to the lagoon", c: ["florence", "venice"], b: "Uffizi mornings and Grand Canal evenings. Four nights linking two of Italy's most photographed cities." },
  { s: "rome-and-venice", im: "photo-1610655769765-be8a0dd9627a", t: "Rome and Venice highlights", c: ["rome", "venice"], b: "Start with three nights in Rome, finish with two on the Grand Canal. The best of both ends of the rail line." },
  { s: "grand-italian-four", im: "photo-1520440229-6469a149ac59", t: "The grand Italian four", c: ["milan", "venice", "florence", "rome"], b: "Nine nights, four cities, four hotels, all prepaid. Arrive in Milan, leave from Rome, breakfast every day in between." },
  { s: "milan-and-florence", im: "photo-1557826807-be1444a653d9", t: "Milan and Florence, style and art", c: ["milan", "florence"], b: "Fashion district and fresco ceilings in one four-night trip, connected by a two-hour fast train." },
  { s: "northern-italy-circuit", im: "photo-1535159994443-5d05daa62298", t: "Northern Italy circuit", c: ["milan", "venice", "florence"], b: "Six nights through the north: Milan, Venice and Florence, with every city tax listed before you pay." }
].map((p, i) => {
  const nights = p.c.reduce((a, k) => a + C[k].nights, 0);
  const full = p.c.reduce((a, k) => a + C[k].price, 0);
  const price = p.c.length > 1 ? Math.round(full * .93) : full;
  return { ...p, i, nights, price, full, multi: p.c.length > 1, w: 0, region: "italy", country: "Italy", img: IMG(p.im, 900) };
});

/* ---------------- Worldwide packages and cruises ---------------- */
const RG = { italy: "Italy", europe: "Europe", middleeast: "Middle East", asia: "Asia", caribbean: "Caribbean", americas: "Americas", cruises: "Cruises" };
const RG_SLUG = { italy: "italy", europe: "europe", middleeast: "middle-east", asia: "asia", caribbean: "caribbean", americas: "americas", cruises: "cruises" };

const W = [
  { s: "aegean-athens-santorini-mykonos", t: "Aegean island hop: Athens, Santorini and Mykonos", region: "europe", country: "Greece", im: "photo-1533105079780-92b9be482077", dur: "8 nights", nights: 8, price: 2990, route: "Athens · Santorini · Mykonos", tags: ["plane", "hotel", "ship", "tour"],
    b: "Start with the Acropolis in Athens, then take the ferry out to Santorini for caldera sunsets and on to Mykonos for its beaches and windmills. Every ferry and transfer is booked before you fly.",
    incl: ["Return international flights from the USA", "3 nights in Athens, 4-star hotel with breakfast", "3 nights in Santorini, caldera-view hotel with breakfast", "2 nights in Mykonos, boutique hotel with breakfast", "Guided tour of the Acropolis and the Acropolis Museum", "Santorini island tour with a wine tasting", "Mykonos highlights tour", "All ferry tickets and port transfers", "All airport transfers, with 24/7 support"] },
  { s: "italy-end-to-end-fast-train", t: "Italy end to end by fast train", region: "europe", country: "Italy", im: "photo-1531572753322-ad063cecc140", badge: "Best seller", dur: "10 nights", nights: 10, price: 2190, route: "Rome · Florence · Venice · Milan", tags: ["plane", "hotel", "train", "tour"],
    b: "Ten nights across Rome, Florence, Venice and Milan with flights included and every leg on Frecciarossa high-speed trains. Skip-the-line entry at the big sights is already arranged.",
    incl: ["Return international flights from the USA", "Rome, 3 nights, with skip-the-line Colosseum and Vatican tours", "Florence, 2 nights, with the Accademia Gallery and the Duomo", "Venice, 2 nights, with a guided tour of St Mark's and the Doge's Palace", "Milan, 2 nights, with the Duomo and the fashion district", "All Frecciarossa high-speed train tickets between cities", "All airport and hotel-to-station transfers"] },
  { s: "paris-versailles-normandy", t: "Paris, Versailles and the Normandy coast", region: "europe", country: "France", im: "photo-1499856871958-5b9627545d1a", dur: "7 nights", nights: 7, price: 1890, route: "Paris · Versailles · Caen", tags: ["plane", "hotel", "train", "tour"],
    b: "Four nights in Paris with a guided day at Versailles, then the train to Caen for three nights within easy reach of the D-Day beaches. Four days are left free to spend as you like.",
    incl: ["Return flights with United Airlines, Newark (EWR) to Paris CDG", "4 nights at Pullman Paris La Défense with breakfast", "3 nights at Mercure Caen Centre Port de Plaisance with breakfast", "Guided day trip to the Palace of Versailles", "Airport and train station transfers", "Return train tickets, Paris to Caen", "4 free days to explore at your own pace"] },
  { s: "lisbon-porto-algarve", t: "Portugal from Lisbon to the Algarve", region: "europe", country: "Portugal", im: "photo-1555881400-74d7acaacd8b", dur: "9 days", nights: 8, price: 1890, route: "Lisbon · Porto · Lagos", tags: ["plane", "hotel", "tour", "coffee"],
    b: "Trams and pastéis de nata in Lisbon, port cellars along the Douro in Porto, then down to the Algarve coast for two nights at a spa and beach resort in Lagos.",
    incl: ["Return flights with United Airlines, Raleigh-Durham (RDU) to Lisbon", "3 nights in Lisbon at NH Campo Grande with breakfast", "2 nights in Porto at Mercure Porto Centro with breakfast", "2 nights at Belmar Spa and Beach Resort, Lagos, with breakfast", "Algarve jeep safari", "All airport and inter-city transfers"] },
  { s: "jamaica-three-coasts", t: "Jamaica's three coasts in one trip", region: "caribbean", country: "Jamaica", im: "photo-1530225029356-e301a685e6b1", dur: "9 nights", nights: 9, price: 2490, route: "Montego Bay · Ocho Rios · Negril", tags: ["plane", "hotel", "coffee"],
    b: "Three nights each in Montego Bay, Ocho Rios and Negril, so you see the island's north and west coasts instead of one resort. Transfers between resorts are included.",
    incl: ["Return international flights from the USA", "3 nights at a Montego Bay resort with breakfast", "3 nights at an Ocho Rios resort with breakfast", "3 nights at a Negril resort with breakfast", "All airport and inter-resort transfers", "Local excursions available on request"] },
  { s: "santo-domingo-las-terrenas", t: "Santo Domingo and the Las Terrenas beaches", region: "caribbean", country: "Dominican Republic", im: "photo-1592174887344-02ff9373ca55", dur: "7 nights", nights: 7, price: 1990, route: "Santo Domingo · Las Terrenas", tags: ["plane", "hotel", "tour", "coffee"],
    b: "Three nights in Santo Domingo's colonial zone, the oldest European-founded city in the Americas, followed by four nights on the beach at Las Terrenas on the Samaná peninsula.",
    incl: ["Return international flights from the USA", "3 nights at a Santo Domingo hotel with breakfast", "4 nights at a Las Terrenas beach resort with breakfast", "All airport and inter-city transfers", "Guided tour of Santo Domingo's colonial city"] },
  { s: "istanbul-cappadocia-antalya", t: "Istanbul, Cappadocia and the Turquoise Coast", region: "middleeast", country: "Turkey", im: "photo-1567797964760-5366be053e70", dur: "7 nights", nights: 7, price: 1990, route: "Istanbul · Cappadocia · Antalya", tags: ["plane", "hotel", "tour"],
    b: "Hagia Sophia and the Grand Bazaar in Istanbul, a cave hotel among the balloon-filled valleys of Cappadocia, then the Mediterranean beaches of Antalya.",
    incl: ["Return international flights from the USA", "3 nights in Istanbul, 4-star hotel with breakfast", "2 nights at a Cappadocia cave hotel with breakfast", "2 nights at an Antalya resort with breakfast", "Guided Istanbul city tour, including Hagia Sophia and the Grand Bazaar", "Cappadocia highlights tour", "All airport and inter-city transfers"] },
  { s: "dubai-abu-dhabi-seven-nights", t: "Dubai and Abu Dhabi, five-star all the way", region: "middleeast", country: "United Arab Emirates", im: "photo-1512453979798-5ea266f8880c", badge: "Most popular", dur: "7 nights", nights: 7, price: 1990, route: "Dubai · Abu Dhabi", tags: ["plane", "hotel", "tour"],
    b: "Five nights in Dubai with the Burj Khalifa observation deck and a desert safari, then two nights in Abu Dhabi for the Sheikh Zayed Grand Mosque. Five-star hotels in both cities.",
    incl: ["Return international flights from the USA", "5 nights in Dubai, 5-star hotel with breakfast", "2 nights in Abu Dhabi, 5-star hotel with breakfast", "Dubai city tour, including the Burj Khalifa 124th floor", "Desert safari with a barbecue dinner", "Abu Dhabi city tour and the Sheikh Zayed Grand Mosque", "All airport and inter-city transfers"] },
  { s: "cairo-nile-valley-of-kings", t: "Cairo, the Nile and the Valley of the Kings", region: "middleeast", country: "Egypt", im: "photo-1539768942893-daf53e448371", dur: "7 nights", nights: 7, price: 1990, route: "Cairo · Luxor · Nile cruise · Aswan", tags: ["plane", "hotel", "ship", "tour"],
    b: "The Pyramids of Giza and the Sphinx from Cairo, then three nights sailing the Nile from Luxor to Aswan, with the Valley of the Kings and Karnak Temple on the way.",
    incl: ["Return international flights from the USA", "2 nights at a Cairo hotel with breakfast", "3-night Nile cruise from Luxor to Aswan, with all meals and excursions", "2 nights at an Aswan hotel with breakfast", "Guided tour of the Giza Pyramids and the Sphinx", "Valley of the Kings and Karnak Temple tours", "All airport and inter-city transfers"] },
  { s: "petra-wadi-rum-dead-sea", t: "Petra, Wadi Rum and the Dead Sea", region: "middleeast", country: "Jordan", im: "photo-1548786811-dd6e453ccca7", dur: "7 nights", nights: 7, price: 1990, route: "Amman · Petra · Wadi Rum · Dead Sea", tags: ["plane", "hotel", "tour"],
    b: "Walk into Petra through the Siq, spend a night at a Bedouin camp under Wadi Rum's desert sky, then float in the Dead Sea. Amman starts and ends the trip.",
    incl: ["Return international flights from the USA", "2 nights at an Amman hotel with breakfast", "2 nights at a Petra hotel with breakfast", "1 night at a Bedouin desert camp in Wadi Rum", "2 nights at a Dead Sea resort with breakfast", "Guided tour of Petra: the Treasury, the Monastery and beyond", "Wadi Rum jeep safari at sunset"] },
  { s: "bangkok-phi-phi-phuket", t: "Bangkok temples and the Andaman islands", region: "asia", country: "Thailand", im: "photo-1508009603885-50cf7c579365", dur: "7 nights", nights: 7, price: 2190, route: "Bangkok · Phi Phi · Phuket", tags: ["plane", "hotel", "tour"],
    b: "Temples and street food in Bangkok, the limestone cliffs of the Phi Phi Islands, then beach time in Phuket. Island boat trip and city tour included.",
    incl: ["Return international flights from the USA", "3 nights in Bangkok, 5-star hotel with breakfast", "2 nights at a Phi Phi beach resort", "2 nights at a Phuket beach resort with breakfast", "Guided Bangkok temples and city tour", "Phi Phi Islands boat excursion", "All airport and inter-city transfers"] },
  { s: "kuala-lumpur-borneo-singapore", t: "Kuala Lumpur, Borneo and Singapore", region: "asia", country: "Malaysia and Singapore", im: "photo-1597148543182-830ef7bbb904", dur: "13 days", nights: 10, price: 0, quote: true, route: "Kuala Lumpur · Kuching · Sarawak · Singapore", tags: ["plane", "hotel", "tour"],
    b: "The Petronas Towers and Batu Caves in Kuala Lumpur, Borneo's rainforest and culture around Kuching, a beach resort in Sarawak, and three nights on Orchard Road in Singapore.",
    incl: ["Qatar Airways: New York JFK to Kuala Lumpur via Doha, returning from Singapore", "3 nights at Pullman KL Residences (5-star) with breakfast", "2 nights at Hilton Kuching, Borneo (5-star) with breakfast", "2 nights at Damai Beach Resort, Sarawak (4-star)", "3 nights at YOTEL Singapore, Orchard Road (4-star)", "5 guided tours: KL city, Batu Caves, Kuching, Sarawak Cultural Village and Singapore", "All domestic flights and every transfer"] },
  { s: "china-beijing-to-shanghai", t: "China from Beijing to Shanghai, land only", region: "asia", country: "China", im: "photo-1508804185872-d7badad00f7d", badge: "Land only", dur: "16 days", nights: 15, price: 1690, route: "Beijing · Xi'an · Yangshuo · Guilin · Shanghai", tags: ["hotel", "train", "tour"],
    b: "The Great Wall and the Forbidden City, the Terracotta Warriors in Xi'an, a Li River cruise through Guilin's karst hills and the Shanghai Bund. International flights are not included.",
    incl: ["Land-only package: international flights are not included", "4 nights in Beijing, 3 in Xi'an, 2 in Yangshuo, 2 in Guilin and 4 in Shanghai", "Bullet train from Beijing to Xi'an", "Domestic flights: Xi'an to Guilin, and Guilin to Shanghai", "7 guided tours throughout", "Great Wall, Forbidden City, Terracotta Warriors, Li River cruise, the Bund and more"] },
  { s: "mexico-city-cancun-tulum", t: "Mexico City, Cancun and Tulum", region: "americas", country: "Mexico", im: "photo-1518638150340-f706e86654de", dur: "11 nights", nights: 11, price: 2900, route: "Mexico City · Cancun · Tulum", tags: ["plane", "hotel", "tour"],
    b: "Museums, markets and Teotihuacan in Mexico City, then the Caribbean side: Cancun's beaches, a day at Chichen Itza, a swim in a cenote and the clifftop ruins at Tulum.",
    incl: ["Return international flights from the USA", "3 nights in Mexico City, 4-star hotel with breakfast", "3 nights at a Cancun resort with breakfast", "3 nights at a Tulum boutique hotel with breakfast", "2 nights at a Cancun hotel before departure", "Guided Mexico City tour and Teotihuacan", "Day trip to Chichen Itza from Cancun", "Cenote swimming excursion", "All airport and inter-city transfers"] },
  { s: "adriatic-sailing-rome-to-venice", t: "Under sail from Rome to Venice", region: "cruises", country: "Italy, Montenegro and Croatia", ship: "Windstar Wind Spirit", im: "photo-1626699748984-47d6942751ca", badge: "Small ship", dur: "14 nights", nights: 14, price: 3899, route: "Rome · Naples · Messina · Kotor · Dubrovnik · Hvar · Zadar · Split · Venice", tags: ["cruise", "tour"],
    b: "Fourteen nights on a four-masted sailing yacht that carries only 148 guests. It leaves Rome, rounds the south of Italy and works up the Adriatic through Kotor, Dubrovnik and the Dalmatian islands to Venice.",
    incl: ["14 nights aboard Wind Spirit, Windstar Cruises", "All meals on board, open seating with no fixed times or tables", "Free watersports from the stern platform: kayaking, sailing and water skiing", "8 ports: Naples, Messina, Kotor, Dubrovnik, Hvar, Zadar, Split and Venice", "Embark in Rome (Civitavecchia), disembark in Venice", "All port taxes and fees, with 24/7 support"] },
  { s: "alaska-inside-passage-glacier-bay", t: "Alaska's Inside Passage and Glacier Bay", region: "cruises", country: "Alaska, USA", ship: "Norwegian Encore", im: "photo-1657682899797-5692d871dd0e", dur: "7 nights", nights: 7, price: 999, route: "Seattle · Juneau · Skagway · Glacier Bay · Ketchikan · Victoria", tags: ["cruise", "tour"],
    b: "A round trip from Seattle up the Inside Passage to Juneau, Skagway and Glacier Bay National Park, returning via Ketchikan and Victoria in Canada. On board: a go-kart track, a VR pavilion and a Broadway show.",
    incl: ["7 nights aboard Norwegian Encore, round trip from Seattle", "Drinks package offers, dining credits and onboard credit", "Shore excursion credit, free soft drinks and free internet", "Ports: Juneau, Skagway, Glacier Bay (UNESCO), Ketchikan and Victoria, BC", "Encore Speedway, Galaxy Pavilion and the Kinky Boots Broadway show", "All port taxes and fees"] },
  { s: "western-mediterranean-round-trip", t: "Western Mediterranean round trip from Rome", region: "cruises", country: "Italy, Spain and France", ship: "MSC Sinfonia", im: "photo-1578095172812-dcc191c5aed8", dur: "9 nights", nights: 9, price: 849, route: "Rome · Palermo · Valencia · Barcelona · Marseille · Genoa · Livorno", tags: ["cruise", "tour"],
    b: "Nine nights out of Rome and back, calling at Palermo, Valencia, Barcelona, Marseille, Genoa and Livorno for Florence and Pisa, with two full days at sea in between.",
    incl: ["9 nights aboard MSC Sinfonia, round trip from Rome (Civitavecchia)", "Drinks offers, free cabin upgrades, free soft drinks and free internet", "6 ports: Palermo, Valencia, Barcelona, Marseille, Genoa and Livorno", "2 days at sea with full use of the ship", "All dining, restaurants and entertainment on board", "All port taxes and fees"] }
].map(p => ({ ...p, w: 1, c: [], multi: p.route.split("·").length > 1, full: p.price, img: IMG(p.im, 900) }));

const P = [...PI, ...W].map((p, i) => ({ ...p, i }));
const bySlug = Object.fromEntries(P.map(p => [p.s, p]));
const SHORT = { rome: "Rome by the Trevi Fountain", venice: "Venice on the Grand Canal", florence: "A Renaissance weekend in Florence", milan: "Milan city break at Garibaldi" };

/* ---------------- Reviews (first-party testimonials) ---------------- */
const REVIEWS = [
  { q: "The hotel was a two-minute walk from Trevi and breakfast was genuinely good. Every fee matched what we were told.", n: "Hannah Okafor", w: "Leeds, UK", trip: "Rome", pkg: "rome-trevi-three-nights", d: "2026-05" },
  { q: "We did Florence and Venice with two kids. The city tax breakdown saved us an awkward moment at the front desk.", n: "Mateo Álvarez", w: "Valencia, Spain", trip: "Florence and Venice", pkg: "florence-and-venice", d: "2026-04" },
  { q: "I asked for twin beds in Milan on WhatsApp late at night and had a reply before I finished my drink.", n: "Priya Raman", w: "Singapore", trip: "Milan", pkg: "milan-garibaldi-break", d: "2026-03" },
  { q: "Four cities in nine nights sounded chaotic. The day-by-day plan made it feel easy from the first train.", n: "Jonah Whitfield", w: "Denver, USA", trip: "Grand Italian four", pkg: "grand-italian-four", d: "2026-06" },
  { q: "Waking up next to the Grand Canal was worth every euro. The whole booking took one conversation.", n: "Leila Haddad", w: "Montreal, Canada", trip: "Venice", pkg: "venice-grand-canal", d: "2026-02" },
  { q: "Straightforward, quick and nothing hidden. We have already asked about Milan for next spring.", n: "Tomasz Nowak", w: "Kraków, Poland", trip: "Rome and Florence", pkg: "rome-and-florence", d: "2025-11" },
  { q: "Dubai and Abu Dhabi with the desert safari thrown in. Hotels were exactly as described and the transfers were waiting every time.", n: "Grace Mitchell", w: "Austin, USA", trip: "Dubai and Abu Dhabi", pkg: "dubai-abu-dhabi-seven-nights", d: "2026-01" },
  { q: "Santorini sunset from our own balcony. The ferries were booked before we flew, which is exactly what we wanted.", n: "Daniel and Ruth Kim", w: "Seattle, USA", trip: "Aegean island hop", pkg: "aegean-athens-santorini-mykonos", d: "2025-09" }
];

/* ---------------- FAQs ---------------- */
const FAQ = [
  ["book", "Do I pay anything at the hotel?", "Your room and breakfast are prepaid, so the hotel will not charge you for them. You only pay local city tax, any resort fee, and extras such as the minibar."],
  ["book", "Can I change my check-in date after booking?", "It depends on the hotel. The Venice stay does not allow a change of check-in date once booked. For the others, message us and we will ask the hotel."],
  ["book", "What if I cancel on the day or do not turn up?", "Same-day cancellations and no-shows are charged 100% of the stay. If your plans change, tell us as early as you can."],
  ["book", "Do you handle group bookings?", "Yes. Some hotels, including our Rome hotel, treat five or more rooms on the same dates as a group and confirm them separately at group rates."],
  ["book", "Are flights included in the Italy hotel packages?", "No. The Italy city-break prices cover the hotel nights with breakfast. Our worldwide packages, such as Italy end to end by fast train, include return flights from the USA, and we can add flights to any Italy hotel package on request."],
  ["book", "How far in advance should I book?", "For Rome, Florence and Venice in spring, September and October, six to twelve weeks ahead gives you the best choice of rooms. Worldwide packages with flights are best booked three to six months out."],
  ["fees", "How much is the city tax in Milan?", "10 euros per person, per night, paid at the hotel. Guests under 18 do not pay it."],
  ["fees", "How does the Venice city tax work?", "It depends on the hotel's star rating and the season, up to 5 euros per person per night from February to December, lower in January. It is charged for the first 5 nights only. Under 10s are exempt and ages 10 to 16 pay half."],
  ["fees", "Will the hotel ask for a deposit?", "Some can. The Rome hotel may take a cash or card deposit as a guarantee, returned when you leave minus any charges."],
  ["fees", "Is there a limit on paying in cash?", "In Milan, cash payments cannot go above 5,000 euros because of Italian regulations. Card and other cashless payments work for everything."],
  ["fees", "Are your prices per person or per room?", "Italy hotel packages are priced per person based on two adults sharing one room, with breakfast every morning. Worldwide packages and cruises are per person based on two sharing, in the lowest room or cabin grade."],
  ["hotel", "Is my bed preference guaranteed?", "We send your request, for example a double or twin beds, straight to the hotel. They do their best, but bedding depends on availability on the day."],
  ["hotel", "Who gets breakfast if three of us share a room?", "In Milan, breakfast covers up to 2 adults sharing a room. Extra guests can buy breakfast at the hotel."],
  ["hotel", "Can I bring a baby?", "Of course. In Rome a cot for children aged 0 to 2 costs 16 euros per night, paid at the hotel."],
  ["hotel", "What ID do we need at check-in?", "Bring a government photo ID or passport for every guest, children included. Italian hotels are required by law to register every guest, and Milan requires this for everyone at arrival."],
  ["hotel", "Something is wrong with the room. What should I do?", "Tell the hotel straight away so they can fix it. If it is not sorted, contact us on WhatsApp. Issues not reported during the stay are much harder to resolve later."]
];

module.exports = { IMG, C, PI, W, P, RG, RG_SLUG, bySlug, SHORT, REVIEWS, FAQ };
