const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const { esc, attr, money, priceTxt, img, card, grid, faqBlock, wa } = H;
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);

const PPH = () => ({ wa: cfg.whatsapp, formEndpoint: cfg.formEndpoint, cities: Object.values(D.C).map(c => ({ k: c.slug, name: c.name, area: c.area })), regions: ["europe", "middleeast", "asia", "caribbean", "americas", "cruises"].map(k => ({ k, name: D.RG[k], sub: `${D.P.filter(p => p.region === k).length} package${D.P.filter(p => p.region === k).length === 1 ? "" : "s"}` })) });

/* ---------------- listing ---------------- */
function list({ guides }) {
  const lo = Math.min(...D.P.filter(p => p.price).map(p => p.price));
  const body = `
  ${H.pageTop({
    crumbs: [{ name: "Home", href: "/" }, { name: "Packages" }],
    h1: `<span class="mask"><span style="--d:80">Every vacation package,</span></span><span class="mask"><span style="--d:180">in one place</span></span>`,
    lead: `Italy city breaks with hotel and breakfast, flight-inclusive holidays across Europe, the Middle East, Asia, the Caribbean and the Americas, and small-ship and big-ship cruises. ${D.P.length} packages from ${money(lo)} per person. Filter by destination, length or price.`
  })}
  <div class="wrap">
    <div class="toolbar rv" style="--d:350">
      <div class="toolbar-in">
        <div class="box sbox"><i class="ph-light ph-magnifying-glass"></i><input id="aQ" type="search" placeholder="Search by place, country or hotel" aria-label="Search packages"></div>
        <div class="dd" id="aCity"></div>
        <div class="dd" id="aLen"></div>
        <div class="dd" id="aSort"></div>
      </div>
    </div>
    <div class="filters-row">
      <div class="count" id="aCount">Showing <b>${D.P.length}</b> of ${D.P.length} packages</div>
      <div class="checks">
        <label class="chk"><input type="checkbox" id="aMulti"><span class="bx"><i class="ph-bold ph-check"></i></span><span class="ct"><b>Multi-city only</b></span></label>
        <label class="chk"><input type="checkbox" id="aSaved"><span class="bx"><i class="ph-bold ph-check"></i></span><span class="ct"><b>Saved</b></span></label>
      </div>
    </div>
    <div class="grid4" id="allGrid" style="padding-bottom:clamp(40px,6vw,80px)">${D.P.map((p, i) => card(p, i, "rv")).join("\n")}</div>
  </div>
  ${H.cta({ h: "Can't see the exact trip you want?", p: "Most of our bookings start as a custom request. Tell us the cities and dates and we price it within a day.", text: "Hi Preplan, I'd like a custom trip quote." })}`;

  return H.page({
    path: "/packages",
    title: `All Vacation Packages 2026/2027 | ${cfg.name}`,
    desc: `All ${D.P.length} packages: Italy city breaks with hotel and breakfast, Greece, Dubai, Egypt, Jordan, Thailand, Mexico, the Caribbean and cruises. From ${money(lo)} per person.`,
    ogImage: H.abs("/images/og/packages.jpg"),
    active: "packages", guides, body,
    ld: [H.breadcrumbLd([{ name: "Home", href: "/" }, { name: "Packages", href: "/packages" }])],
    scripts: `<script>window.PPH=${H.json(PPH())}</script>`
  });
}

/* ---------------- detail ---------------- */
function seoTitle(p) {
  if (p.w) return p.region === "cruises" ? `${p.t} | ${p.dur} on ${p.ship} from ${priceTxt(p)}` : `${p.t} | ${p.dur} ${p.tags.includes("plane") ? "with flights" : "land only"} from ${priceTxt(p)}`;
  return `${p.t} | ${p.nights} nights, hotel + breakfast from ${priceTxt(p)}`;
}
function seoDesc(p) {
  if (p.w) return H.truncate(`${p.dur}, ${p.route.replace(/ · /g, ", ")}. ${p.b} From ${priceTxt(p)} per person${p.quote ? "" : ", two sharing"}.`, 158);
  const cities = p.c.map(k => D.C[k]);
  return H.truncate(`${p.nights} nights in ${cities.map(c => c.name).join(" and ")} at ${cities.map(c => c.hotel).join(" and ")}, breakfast daily, prepaid vouchers, city tax explained. From ${money(p.price)} per person.`, 158);
}

function detail(p, { guides }) {
  const W_ = !!p.w, cruise = p.region === "cruises";
  const cities = p.c.map(k => D.C[k]);
  const imgs = W_ ? [p.im] : [...new Set([p.im, ...[0, 1, 2].flatMap(r => cities.map(c => c.gal[r]).filter(Boolean))])].slice(0, 4);
  const heroAlt = H.photo(imgs[0]).alt || (W_ ? `${p.t}, ${p.country}` : `${p.t}, ${cities.map(c => c.name).join(", ")}`);
  const stops = W_ ? p.route.split("·").map(x => x.trim()) : [];
  const wTravel = cruise ? ["ph-boat", p.ship] : W_ && p.tags.includes("plane") ? ["ph-airplane-tilt", "Flights included"] : ["ph-map-trifold", "Land only"];
  const crumbPath = [{ name: "Packages", href: "/packages" }];
  const crumbs = [{ name: "Home", href: "/" }, ...crumbPath, { name: p.t }];

  /* itinerary */
  const days = []; let dn = 1;
  p.c.forEach((k, ci) => { const c = D.C[k];
    days.push([dn++, ci ? `Travel to ${c.name}` : `Arrive in ${c.name}`, `${ci ? `Breakfast, check out, then take the high-speed train to ${c.name} (${c.station}). ` : `Land at ${c.airport} or arrive by train at ${c.station}. `}Check in at ${c.hotel}, ${lc(c.area)}. Your ${c.room.toLowerCase()} is prepaid with ${c.board.toLowerCase()}.`]);
    for (let n = 1; n < c.nights; n++) { const a = c.days[(n - 1) % c.days.length]; days.push([dn++, `${c.name}: ${a[0]}`, a[1]]); }
  });
  if (!W_) days.push([dn, "Breakfast and head home", `Enjoy one last breakfast, settle any city tax and extras at the front desk, and check out of ${cities[cities.length - 1].hotel}.`]);

  const excl = W_ ? [...(p.tags.includes("plane") || cruise ? [] : ["International flights"]), ...(cruise ? ["Flights to and from the ship"] : []), "Travel insurance, offered when you book", "Visas and entry fees where they apply", cruise ? "Gratuities and drinks not listed above" : "Meals not listed above", "Personal spending and tips"]
    : ["Flights to Italy and back home", ...(p.multi ? ["Train tickets between cities (we can add them)"] : []), "Local city tax, paid at each hotel", "Incidentals and any resort fees", ...(p.c.includes("milan") ? ["Breakfast for extra guests in Milan"] : []), ...(p.c.includes("rome") ? ["Baby cot in Rome, 16 euros per night"] : [])];
  const notes = W_ ? [["ph-identification-card", "Passports and visas", "Your passport should be valid for at least six months after you return. We tell you which visas apply when we confirm the trip."], ["ph-calendar-check", "Prices move with dates", "The price shown is the lowest we have for this route. We confirm the exact fare for your dates before you pay anything."], ["ph-pencil-simple-line", "Make it yours", "Dates, departure city, hotels and number of nights can all be changed. We re-price it for you."], ...(cruise ? [["ph-anchor", "Cruise fares", "Fares are per person in the lowest cabin grade, based on two sharing. Ask us about refund terms before you book."]] : [])]
    : [["ph-prohibit", "No-show policy", "Same-day cancellations and no-shows are charged in full at every hotel."], ["ph-warning-circle", "If something is wrong", "Tell the hotel right away so they can fix it, then contact us if it is not resolved."],
      ...(p.c.includes("venice") ? [["ph-calendar-x", "Venice dates are fixed", "The check-in date for the Venice hotel cannot be changed after booking."]] : []),
      ...(p.c.includes("milan") ? [["ph-identification-card", "Bring ID for everyone", "In Milan all guests, children included, show a government photo ID or passport."]] : []),
      ...(p.c.includes("rome") ? [["ph-credit-card", "Possible deposit in Rome", "The hotel may hold a cash or card deposit, returned at departure minus any charges."]] : [])];
  const sug = D.P.filter(x => x.s !== p.s).map(x => ({ x, sc: W_ ? (x.region === p.region ? 2 : 0) + (x.w ? 1 : 0) : x.c.filter(k => p.c.includes(k)).length })).sort((a, b) => b.sc - a.sc || a.x.i - b.x.i).slice(0, 4).map(o => o.x);
  const save = Math.round(p.full - p.price);

  /* highlights */
  const highlights = W_ ? p.incl.slice(0, 5) : [...cities.map(c => `${c.nights} night${c.nights > 1 ? "s" : ""} at ${c.hotel}, ${lc(c.area)}`), "Breakfast every morning, prepaid", ...(p.multi ? [`High-speed train connections between ${cities.map(c => c.name).join(", ")}`] : []), "Every city tax and hotel policy explained before you pay"];

  /* package FAQ (visible + schema) */
  const faq = W_ ? [
    ["What is included in the price?", `${p.incl.join("; ")}. Anything not listed is not included.`],
    [p.tags.includes("plane") ? "Which airports can I fly from?" : "Are international flights included?", p.tags.includes("plane") ? "Most departures are from major US gateways such as New York, Chicago, Los Angeles, Dallas and Miami. Tell us your home airport and we price the connection." : "No. This is a land-only package. We can add flights from your home airport when we quote."],
    ["Is the price per person?", `Yes. ${priceTxt(p)} is per person based on two sharing${cruise ? " a cabin in the lowest grade" : " a room"}. Solo travellers and groups of three or four are priced on request.`],
    ["Can I change the dates or add nights?", "Yes. Every worldwide package is a template. Dates, departure city, hotels and length can all be adjusted and we re-price it for you before you pay."]
  ] : [
    ["What is included?", `${cities.map(c => `${c.nights} nights at ${c.hotel} in a ${c.room.toLowerCase()} with ${c.board.toLowerCase()}`).join(", and ")}. Rooms are prepaid, so nothing is due at check-in except local city tax and extras.`],
    ["Are flights and trains included?", `Flights are not included in Italy hotel packages. ${p.multi ? "High-speed train tickets between the cities are optional and can be added when you book." : "We can add flights or trains to any package on request."}`],
    ["How much is the city tax?", cities.map(c => `${c.name}: ${c.tiles[0][2]}`).join(" ")],
    ["Can I change my check-in date?", p.c.includes("venice") ? "The Venice stay does not allow the check-in date to be changed after booking. For the other hotels we ask on your behalf." : "Message us and we ask the hotel. Changes are subject to availability."],
    ["What happens if I cancel?", "Same-day cancellations and no-shows are charged 100% of the stay. Earlier changes depend on the hotel, and we always tell you the terms before you pay."]
  ];

  const holdText = W_ ? (cruise ? `your cabin on ${p.ship} is` : "your places on this trip are") : `the rooms at ${cities.map(c => c.hotel).join(" and ")} are`;
  const pkgCfg = { s: p.s, t: p.t, w: p.w, cruise, nights: p.nights, price: p.price, quote: !!p.quote, img: H.photoUrl(p.im, 480), holdText, roomStd: W_ ? (cruise ? "Lowest cabin grade, two sharing" : "Rooms as listed in the package") : cities.map(c => c.room).join(", "), roomUp: W_ ? "Priced separately when we confirm" : "About $40 per room, per night" };

  const ld = [
    H.breadcrumbLd(crumbs),
    {
      "@type": "Product", "@id": H.abs(`/packages/${p.s}#product`), name: p.t, description: p.b, sku: `PPH-${p.s.toUpperCase()}`,
      image: [H.abs(H.photoUrl(p.im, 1600))],
      brand: { "@type": "Brand", name: cfg.name },
      additionalType: "https://schema.org/TouristTrip",
      category: W_ ? (cruise ? "Cruise package" : "Vacation package") : "City break package",
      ...(p.quote ? {} : { offers: { "@type": "Offer", url: H.abs(`/packages/${p.s}`), price: p.price, priceCurrency: "USD", availability: "https://schema.org/InStock", priceValidUntil: "2027-12-31", seller: { "@id": H.ORG_ID }, eligibleQuantity: { "@type": "QuantitativeValue", unitText: "per person, two sharing" } } })
    },
    {
      "@type": "TouristTrip", name: p.t, description: p.b, url: H.abs(`/packages/${p.s}`), provider: { "@id": H.ORG_ID }, touristType: p.multi ? "Multi-city travellers" : "City break travellers",
      itinerary: { "@type": "ItemList", itemListElement: (W_ ? stops : cities.map(c => c.name)).map((n, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "City", name: n } })) }
    },
    H.faqLd(faq)
  ];

  const body = `
  <article id="pkg">
  <section class="d-hero"><div class="hero-media">${img(imgs[0], { alt: heroAlt, sizes: "100vw", lazy: false, priority: true, extra: ' id="dImg"' })}</div>
    <div class="wrap">
      ${H.crumbs(crumbs)}
      <h1><span class="mask"><span style="--d:100">${esc(p.t)}</span></span></h1>
      <div class="d-chips rv" style="--d:260">
${W_ ? `<span class="d-chip"><i class="ph-light ph-moon-stars"></i>${p.dur}</span><span class="d-chip"><i class="ph-light ph-map-pin"></i>${stops.length} stops</span><span class="d-chip"><i class="ph-light ${wTravel[0]}"></i>${esc(wTravel[1])}</span><span class="d-chip"><i class="ph-light ph-globe-hemisphere-east"></i>${D.RG[p.region]}</span>`
      : `<span class="d-chip"><i class="ph-light ph-moon-stars"></i>${p.nights} nights</span><span class="d-chip"><i class="ph-light ph-map-pin"></i>${cities.length} ${cities.length > 1 ? "cities" : "city"}</span><span class="d-chip"><i class="ph-light ph-coffee"></i>Breakfast daily</span><span class="d-chip"><i class="ph-light ph-ticket"></i>Prepaid vouchers</span>`}
      </div>
${imgs.length > 1 ? `      <div class="d-thumbs rv" style="--d:360">${imgs.map((id, i) => `<button type="button" class="${i ? "" : "on"}" data-src="${H.photoUrl(id, 1600)}" data-srcset="${attr(H.photo(id).srcset)}" data-alt="${attr(H.photo(id).alt || heroAlt)}" aria-label="Show photo ${i + 1}">${img(id, { alt: "", sizes: "74px" })}</button>`).join("")}</div>` : ""}
    </div>
  </section>
  <div class="wrap d-body">
    <div>
      <div class="d-sec">
        <h2 class="rv">About this trip</h2>
        <p class="lead rv" style="--d:80">${esc(p.b)}</p>
        <div class="facts">
${W_ ? `<div class="fact rv" style="--d:0"><i class="ph-light ph-calendar"></i><small>Length</small><b>${p.dur}</b></div>
          <div class="fact rv" style="--d:80"><i class="ph-light ph-map-pin"></i><small>Destination</small><b>${esc(p.country)}</b></div>
          <div class="fact rv" style="--d:160"><i class="ph-light ${wTravel[0]}"></i><small>${cruise ? "Ship" : "Travel"}</small><b>${esc(wTravel[1])}</b></div>
          <div class="fact rv" style="--d:240"><i class="ph-light ph-signpost"></i><small>Stops</small><b>${stops.length}</b></div>`
      : `<div class="fact rv" style="--d:0"><i class="ph-light ph-calendar"></i><small>Length</small><b>${p.nights} nights</b></div>
          <div class="fact rv" style="--d:80"><i class="ph-light ph-buildings"></i><small>Hotels</small><b>${cities.length} central</b></div>
          <div class="fact rv" style="--d:160"><i class="ph-light ph-bed"></i><small>Room</small><b>${cities.length > 1 ? "Per hotel" : cities[0].room}</b></div>
          <div class="fact rv" style="--d:240"><i class="ph-light ph-coffee"></i><small>Board</small><b>Breakfast</b></div>`}
        </div>
      </div>
      <div class="d-sec"><h2 class="rv">Highlights</h2><ul class="hl-list rv">${highlights.map(h => `<li><i class="ph-fill ph-check-circle"></i>${esc(h)}</li>`).join("")}</ul></div>
${W_ ? `      <div class="d-sec"><h2 class="rv">The route</h2><div class="wstops rv">${stops.map((x, i) => `${i ? '<i class="ph-light ph-arrow-right" aria-hidden="true"></i>' : ""}<span>${esc(x)}</span>`).join("")}</div>
        <p class="muted rv" style="margin-top:16px">${cruise ? `Sailing on ${esc(p.ship)}. Ports and sea days follow the ship's published schedule for your departure date.` : "Every transfer, internal flight and ferry between these stops is booked before you leave, and you get one itinerary with all of it in order."}</p></div>`
      : `      <div class="d-sec"><h2 class="rv">Day by day itinerary</h2><div class="timeline" id="dTl">
        ${days.map((d, i) => `<div class="tl rv ${i ? "" : "open"}" style="--d:${Math.min(i, 5) * 60}"><span class="dot" aria-hidden="true">${d[0]}</span><div class="qa ${i ? "" : "open"}"><h3 class="qa-h"><button class="qa-q" type="button" aria-expanded="${!i}"><span><small>Day ${d[0]}</small>${esc(d[1])}</span><span class="qa-plus" aria-hidden="true"></span></button></h3><div class="qa-a"><div><p>${esc(d[2])}</p></div></div></div></div>`).join("")}
      </div></div>
      <div class="d-sec"><h2 class="rv">Where you'll stay</h2><div class="hotels">
        ${p.c.map((k, i) => { const c = D.C[k]; return `<div class="hotel rv" style="--d:${i * 90}"><div class="hp">${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:767px) 100vw, 170px" })}</div><div class="hi"><h3>${c.hotel}</h3>
        <div class="row"><i class="ph-light ph-map-pin-line"></i>${c.addr}</div><div class="row"><i class="ph-light ph-train"></i>Nearest station: ${c.station}</div>
        <div class="row"><i class="ph-light ph-bed"></i>${c.room}, ${c.nights} nights. ${c.bed}.</div><div class="pills">${c.perks.map(x => `<span>${x}</span>`).join("")}</div></div></div>`; }).join("")}
      </div></div>`}
      <div class="d-sec"><h2 class="rv">What's included</h2><div class="inc">
        <div class="inc-col yes rv"><h3><i class="ph-fill ph-check-circle" style="color:var(--teal)"></i>Included</h3><ul>
${W_ ? p.incl.map(x => `<li><i class="ph-light ph-check"></i>${esc(x)}</li>`).join("") : `${cities.map(c => `<li><i class="ph-light ph-check"></i>${c.nights} nights at ${c.hotel}</li>`).join("")}
          <li><i class="ph-light ph-check"></i>Breakfast every morning</li><li><i class="ph-light ph-check"></i>Prepaid hotel vouchers</li><li><i class="ph-light ph-check"></i>Bed preference sent to each hotel</li><li><i class="ph-light ph-check"></i>24/7 support while you travel</li>`}</ul></div>
        <div class="inc-col no rv" style="--d:100"><h3><i class="ph-fill ph-info" style="color:#b54708"></i>Not included</h3><ul>${excl.map(x => `<li><i class="ph-light ph-minus-circle"></i>${esc(x)}</li>`).join("")}</ul></div>
      </div></div>
      <div class="d-sec"><h2 class="rv">Dates and prices</h2><div class="notes"><div class="note rv"><i class="ph-light ph-tag"></i><div><b>From ${priceTxt(p)} per person${p.quote ? "" : ", two sharing"}</b><p>${W_ ? (cruise ? "Cruise fares are for the lowest cabin grade and move with the sailing date. We check live availability and confirm the exact fare before you pay." : "The price is the lowest fare we hold for this route and moves with your departure date and home airport. We confirm the exact price before you pay anything.") : `Hotel rates are the same year round for the standard room. Peak dates (Easter, late April to June, September and October) sell out first, so book six to twelve weeks ahead. Children aged 2 to 17 sharing a room with two adults are priced at 60% of the adult rate.`}</p></div></div></div></div>
      <div class="d-sec"><h2 class="rv">Good to know</h2><div class="notes">${notes.map((n, i) => `<div class="note rv" style="--d:${i * 70}"><i class="ph-light ${n[0]}"></i><div><b>${n[1]}</b><p>${n[2]}</p></div></div>`).join("")}</div></div>
      <div class="d-sec"><h2 class="rv">Frequently asked questions</h2>${faqBlock(faq, { id: "pkgFaq" })}</div>
    </div>
    <aside class="bk rv right" id="bk" aria-label="Book this trip"><div class="bk-in">
      <div class="bk-price"><div><small>${p.quote ? "Priced for your dates" : "From, per person"}</small><br><b>${priceTxt(p)}</b></div>${save > 0 ? `<span class="save">Save ${money(save)} vs booking separately</span>` : `<span class="save">${W_ ? (cruise ? "Port fees included" : p.tags.includes("plane") ? "Flights included" : "Tours included") : "Breakfast included"}</span>`}</div>
      <div class="bk-fields">
        <div class="field"><span class="lbl">${W_ ? "Departure" : "Check in"}</span><div class="dp" id="dDate"></div></div>
        <div class="field"><span class="lbl">Travellers</span><div class="gp" id="dGuests"></div></div>
        <div class="field"><span class="lbl">Room</span><div class="dd" id="dRoom"></div></div>
      </div>
      ${!W_ && p.multi ? `<div class="addons">
        <label class="chk"><input type="checkbox" data-add="${45 * (p.c.length - 1)}"><span class="bx"><i class="ph-bold ph-check"></i></span><span class="ct"><span>Fast train tickets</span><b>+$${45 * (p.c.length - 1)}</b></span></label>
      </div>` : ""}
      <div class="bk-total"><div class="tt"><span>Estimated total</span><b id="tTot">${p.quote ? "On request" : money(p.price * 2)}</b></div></div>
      <div class="bk-actions">
        <button class="btn btn-gold full" id="dBook" type="button">Book this trip<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></button>
        <div class="duo"><a class="btn btn-ghost plain" id="dWa" href="${wa(`Hi Preplan, I'd like "${p.t}".`)}" target="_blank" rel="noopener"><i class="ph-light ph-whatsapp-logo" style="font-size:1.25rem"></i>Ask on WhatsApp</a><button class="save-btn" type="button" data-fav="${p.s}" aria-label="Save package"><i class="ph-light ph-heart"></i></button></div>
      </div>
      <p class="bk-note"><i class="ph-light ph-shield-check"></i>Free to request. Pay after we confirm rooms.</p>
    </div></aside>
  </div>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="pk-head"><h2 class="h2 rv">You might also like</h2><a class="link-arrow rv" href="/packages">All packages<i class="ph-bold ph-arrow-right"></i></a></div>
    ${grid(sug)}
  </div></section>
  ${H.cta({ h: "Questions about this trip?", p: "Talk to the planner who knows these hotels. Pick whatever is easiest.", text: `Hi Preplan, I have a question about: ${p.t}` })}
  </article>

  <div class="mbar" id="mbar"><div><small>From, per person</small><b id="mbarPrice">${priceTxt(p)}</b></div><button class="btn btn-gold btn-sm" id="mbarBtn" type="button">Book now<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></button></div>
  <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">
    <div class="modal-bg" data-close></div>
    <div class="modal-card">
      <button class="modal-x" type="button" data-close aria-label="Close"><i class="ph-light ph-x"></i></button>
      <div id="mForm">
        <h3 class="h3" id="mTitle">Confirm your booking request</h3>
        <p class="muted" style="font-size:.92rem;margin-top:4px">We hold the rooms and send payment details within a few hours.</p>
        <div class="m-sum" id="mSum"></div>
        <form id="bForm" novalidate>
          <div class="m-grid">
            <div class="field span2" data-req="name"><label for="bName">Lead traveller</label><div class="box"><input id="bName" autocomplete="name" placeholder="Name as on passport" aria-required="true"></div><span class="err"><i class="ph-light ph-warning-circle"></i>Please add a name</span></div>
            <div class="field" data-req="email"><label for="bEmail">Email</label><div class="box"><input id="bEmail" type="email" autocomplete="email" placeholder="you@email.com" aria-required="true"></div><span class="err"><i class="ph-light ph-warning-circle"></i>Enter a valid email</span></div>
            <div class="field"><label for="bPhone">Phone</label><div class="box"><input id="bPhone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000"></div></div>
            <div class="field span2"><span class="lbl">Bed preference</span><div class="dd" id="bBed"></div><span class="help">Passed to the hotel, subject to availability.</span></div>
            <div class="field span2" data-req="consent"><label class="chk"><input type="checkbox" id="bTerms" aria-required="true"><span class="bx"><i class="ph-bold ph-check"></i></span><span class="ct">I understand city taxes are paid at the hotel and a no-show is charged in full. I have read the <a href="/terms" target="_blank">terms of booking</a>.</span></label><span class="err"><i class="ph-light ph-warning-circle"></i>Please confirm to continue</span></div>
          </div>
          <button class="btn btn-gold full" style="margin-top:18px" type="submit">Request booking<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></button>
          <p class="bk-note"><i class="ph-light ph-shield-check"></i>No payment now. We confirm rooms first, then send the invoice.</p>
        </form>
      </div>
      <div class="success" id="mDone">
        <div class="ok"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 23l7 7 14-15"/></svg></div>
        <h3>Request sent</h3>
        <p id="mRef"></p>
        <button class="btn btn-teal btn-sm" type="button" data-close>Done<span class="ico"><i class="ph-bold ph-check"></i></span></button>
      </div>
    </div>
  </div>`;

  return H.page({
    path: `/packages/${p.s}`,
    title: seoTitle(p),
    desc: seoDesc(p),
    ogImage: H.abs(`/images/og/packages/${p.s}.jpg`),
    ogType: "website",
    active: "packages", guides, body, ld,
    preload: `<link rel="preload" as="image" href="${H.photoUrl(imgs[0], 1600)}" imagesrcset="${H.photo(imgs[0]).srcset}" imagesizes="100vw" fetchpriority="high">`,
    scripts: `<script>window.PPH=${H.json({ ...PPH(), pkg: pkgCfg })}</script>`
  });
}

module.exports = { list, detail, PPH };
