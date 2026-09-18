const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const CITY = require("../content/cities");
const REG = require("../content/regions");
const { PPH } = require("./packages");
const { esc, money, img, grid, faqBlock } = H;

const sideLinks = (items) => `<div class="side-card"><h3>Related</h3><ul>${items.map(([h, l]) => `<li><a href="${h}"><i class="ph-light ph-arrow-right"></i>${esc(l)}</a></li>`).join("")}</ul></div>`;
const help = (text) => `<div class="side-card dark"><h3>Talk to a planner</h3><p>Send the rough idea on WhatsApp and get a priced plan back within one working day.</p><a class="btn btn-gold btn-sm" href="${H.wa(text)}" target="_blank" rel="noopener">Ask on WhatsApp<span class="ico"><i class="ph-light ph-whatsapp-logo"></i></span></a></div>`;
const toc = (html) => { const m = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)]; return m.length ? `<div class="side-card"><h3>On this page</h3><ul class="toc">${m.map(x => `<li><a href="#${x[1]}">${x[2].replace(/&amp;/g, "&")}</a></li>`).join("")}</ul></div>` : ""; };

/* -------- destinations index -------- */
function index({ guides }) {
  const cityCards = Object.values(D.C).map((c, i) => `<a class="dcard rv" style="--d:${i * 80}" href="/italy/${c.slug}">${img(c.imgs[0], { alt: `${c.ia[0]}, ${c.name}`, sizes: "(max-width:767px) 50vw, 33vw" })}<span class="arr"><i class="ph-light ph-arrow-up-right"></i></span><div><h3>${c.name}</h3><span>${D.P.filter(p => p.c.includes(c.slug)).length} packages, from ${money(c.price)}</span></div></a>`).join("");
  const regionCards = ["europe", "middleeast", "asia", "caribbean", "americas", "cruises"].map((k, i) => { const ps = D.P.filter(p => p.region === k); const href = k === "cruises" ? "/cruises" : `/destinations/${D.RG_SLUG[k]}`; const countries = [...new Set(ps.map(p => p.country))].join(", "); return `<a class="dcard rv" style="--d:${i * 80}" href="${href}">${img(ps[0].im, { alt: `${D.RG[k]} vacation packages`, sizes: "(max-width:767px) 50vw, 33vw" })}<span class="arr"><i class="ph-light ph-arrow-up-right"></i></span><div><h3>${D.RG[k]}</h3><span>${esc(countries)}</span></div></a>`; }).join("");
  const body = `
  ${H.pageTop({ crumbs: [{ name: "Home", href: "/" }, { name: "Destinations" }], h1: "Where we can take you", lead: "Four Italian cities we know street by street, and a short list of flight-inclusive trips across Europe, the Middle East, Asia, the Caribbean and the Americas that we book often enough to get right every time." })}
  <section class="sec"><div class="wrap">
    <div class="pk-head"><div><h2 class="h2 rv">Italy, city by city</h2><p class="lead rv" style="margin-top:14px">Prepaid hotel-and-breakfast stays, single or multi-city by high-speed train. <a href="/italy">See the full Italy range</a> or the <a href="/italy/multi-city">multi-city routes</a>.</p></div></div>
    <div class="dest-grid" style="margin-bottom:60px">${cityCards}</div>
    <div class="pk-head"><div><h2 class="h2 rv">Worldwide, with flights</h2><p class="lead rv" style="margin-top:14px">Seven to sixteen nights with international flights, hotels, guided tours and every transfer included. Cruises include port fees.</p></div></div>
    <div class="dest-grid">${regionCards}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="pk-head"><h2 class="h2 rv">Most booked this season</h2><a class="link-arrow rv" href="/packages">All packages<i class="ph-bold ph-arrow-right"></i></a></div>${grid(["italy-big-three", "dubai-abu-dhabi-seven-nights", "rome-trevi-three-nights", "aegean-athens-santorini-mykonos"].map(s => D.bySlug[s]))}</div></section>
  ${H.cta({ h: "Somewhere not on the list?", p: "We also price custom trips to anywhere our partners operate. Tell us where and when.", text: "Hi Preplan, I'd like a quote for a destination not on your site." })}`;
  return H.page({ path: "/destinations", title: `Destinations: Italy City Breaks and Worldwide Packages | ${cfg.name}`, desc: "Prepaid hotel packages in Rome, Florence, Venice and Milan, or flight-inclusive trips across Europe, the Middle East, Asia, the Caribbean and Mexico, plus cruises.", ogImage: H.abs("/images/og/destinations.jpg"), active: "destinations", guides, body, ld: [H.breadcrumbLd([{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }])], scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

/* -------- Italy hub -------- */
function italy({ guides }) {
  const c = REG.italy;
  const single = D.PI.filter(p => !p.multi), multi = D.PI.filter(p => p.multi);
  const body = `
  ${H.pageTop({ crumbs: [{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }, { name: "Italy" }], h1: c.h1, lead: c.lead, extra: `<div class="subnav">${Object.values(D.C).map(x => `<a href="/italy/${x.slug}"><i class="ph-light ph-map-pin"></i>${x.name}</a>`).join("")}<a href="/italy/multi-city"><i class="ph-light ph-train"></i>Multi-city</a><a href="/fees-and-policies"><i class="ph-light ph-coins"></i>City taxes</a></div>` })}
  <section class="sec" style="padding-bottom:0"><div class="wrap">
    <div class="pk-head"><div><h2 class="h2 rv">One city, done properly</h2><p class="lead rv" style="margin-top:14px">Two or three nights with breakfast, in the middle of everything.</p></div></div>
    ${grid(single)}
    <div class="pk-head" style="margin-top:60px"><div><h2 class="h2 rv">Two, three or four cities by train</h2><p class="lead rv" style="margin-top:14px">Priced 7% below the separate stays, with the train connections planned. <a href="/italy/multi-city">More about multi-city trips</a>.</p></div></div>
    ${grid(multi)}
  </div></section>
  <div class="wrap article">
    <div class="prose">${c.intro}<h2 id="faq">Italy packages: frequently asked questions</h2>${faqBlock(c.faq, { id: "italyFaq" })}</div>
    <aside class="side">${toc(c.intro)}${sideLinks([["/guides/italy-tourist-tax-2026", "Italy tourist tax 2026"], ["/guides/how-many-days-rome-florence-venice", "How many days in each city"], ["/guides/rome-florence-venice-by-train", "Italy by train"], ["/guides/best-time-to-visit-italy", "Best time to visit Italy"], ["/packages/italy-end-to-end-fast-train", "Italy with flights and tours included"]])}${help("Hi Preplan, I'd like help planning an Italy trip.")}</aside>
  </div>
  ${H.cta({ h: "Tell us your dates and who is coming", p: "We reply with a priced Italy plan, hotel by hotel, within one working day.", text: "Hi Preplan, I'd like a quote for Italy." })}`;
  return H.page({ path: "/italy", title: c.title, desc: c.desc, ogImage: H.abs("/images/og/italy.jpg"), active: "destinations", guides, body, ld: [H.breadcrumbLd([{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }, { name: "Italy", href: "/italy" }]), H.faqLd(c.faq)], scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

/* -------- multi-city hub -------- */
function multiCity({ guides }) {
  const c = REG.multi;
  const multi = D.PI.filter(p => p.multi);
  const body = `
  ${H.pageTop({ crumbs: [{ name: "Home", href: "/" }, { name: "Italy", href: "/italy" }, { name: "Multi-city" }], h1: c.h1, lead: c.lead })}
  <section class="sec" style="padding-bottom:0"><div class="wrap">${grid(multi)}</div></section>
  <div class="wrap article">
    <div class="prose">${c.intro}<h2 id="faq">Multi-city trips: frequently asked questions</h2>${faqBlock(c.faq, { id: "multiFaq" })}</div>
    <aside class="side">${toc(c.intro)}${sideLinks([["/guides/rome-florence-venice-by-train", "Rome to Florence to Venice by train"], ["/guides/7-day-italy-itinerary", "7-day Italy itinerary"], ["/guides/10-day-italy-itinerary", "10-day Italy itinerary"], ["/guides/how-many-days-rome-florence-venice", "How many days in each city"]])}${help("Hi Preplan, I'd like a multi-city Italy quote.")}</aside>
  </div>
  ${H.cta({ h: "Want a different split?", p: "Any combination of our four cities can be priced with any number of nights.", text: "Hi Preplan, I'd like a custom multi-city Italy quote." })}`;
  return H.page({ path: "/italy/multi-city", title: c.title, desc: c.desc, ogImage: H.abs("/images/og/italy-multi-city.jpg"), active: "destinations", guides, body, ld: [H.breadcrumbLd([{ name: "Home", href: "/" }, { name: "Italy", href: "/italy" }, { name: "Multi-city", href: "/italy/multi-city" }]), H.faqLd(c.faq)], scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

/* -------- city hub -------- */
function city(k, { guides }) {
  const c = D.C[k], t = CITY[k];
  const pk = D.P.filter(p => p.c.includes(k));
  const single = pk.find(p => !p.multi);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Italy", href: "/italy" }, { name: c.name }];
  const body = `
  <div class="page-top hasimg"><div class="hero-media">${img(c.imgs[0], { alt: `${c.ia[0]}, ${c.name}`, sizes: "100vw", lazy: false, priority: true })}</div>
    <div class="wrap">${H.crumbs(crumbs)}<span class="tag rv"><i class="ph-fill ph-map-pin"></i>${c.area}</span><h1>${t.h1}</h1><p class="lead rv" style="--d:200">${t.lead}</p>
    <div class="meta">${t.kv.map(([a, b]) => `<span class="d-chip"><i class="ph-light ph-info"></i>${a}: ${b}</span>`).join("")}</div>
    <div class="actions"><a class="btn btn-gold" href="/packages/${single.s}">${c.name} package from ${money(single.price)}<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a><a class="btn btn-glass" href="#packages">All ${pk.length} packages with ${c.name}<span class="ico"><i class="ph-light ph-arrow-down"></i></span></a></div></div></div>
  <section class="sec" style="padding-bottom:0"><div class="wrap two">
    <div>${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:1024px) 100vw, 50vw" })}</div>
    <div><span class="tag"><i class="ph-light ph-buildings"></i>Where you stay</span><h2 class="h2" style="margin-top:14px">${c.hotel}</h2><p class="lead" style="margin-top:14px">${c.addr}. ${c.room} with ${c.board.toLowerCase()}, ${c.bed.toLowerCase()}.</p>
    <div class="kv">${c.perks.map(x => `<div><small>Included</small><b>${x}</b></div>`).join("")}</div>
    <div class="fp-tiles" style="margin-top:16px">${c.tiles.map(x => `<div class="fp-tile"><span class="ti"><i class="ph-light ${x[0]}"></i></span><h3 style="font-size:1.02rem">${x[1]}</h3><p>${x[2]}</p></div>`).join("")}</div></div>
  </div></section>
  <section class="sec" id="packages"><div class="wrap"><div class="pk-head"><div><h2 class="h2 rv">${c.name} packages</h2><p class="lead rv" style="margin-top:14px">On its own, or combined with ${Object.values(D.C).filter(x => x.slug !== k).map(x => x.name).join(", ")} by train.</p></div><a class="link-arrow rv" href="/italy">All Italy packages<i class="ph-bold ph-arrow-right"></i></a></div>${grid(pk)}</div></section>
  <div class="wrap article" style="padding-top:0">
    <div class="prose">${t.intro}<h2 id="faq">${c.name} travel questions</h2>${faqBlock(t.faq, { id: "cityFaq" })}</div>
    <aside class="side">${toc(t.intro)}${sideLinks([["/guides/italy-tourist-tax-2026", "Italy tourist tax 2026"], ["/guides/italy-airport-to-city-transfers", "Airport transfers in Italy"], ["/guides/best-time-to-visit-italy", "Best time to visit Italy"], ["/guides/rome-florence-venice-by-train", "Italy by train"], ["/fees-and-policies", "City taxes and hotel policies"]])}${help(`Hi Preplan, I'd like a quote for ${c.name}.`)}</aside>
  </div>
  ${H.cta({ h: `Ready for ${c.name}?`, p: "Tell us your dates and we hold the room and send the voucher within a day.", text: `Hi Preplan, I'd like to book ${c.name}.` })}`;
  const ld = [H.breadcrumbLd(crumbs), H.faqLd(t.faq), { "@type": "TouristDestination", name: c.name, description: t.lead, url: H.abs(`/italy/${k}`), geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng }, includesAttraction: c.ia.map(n => ({ "@type": "TouristAttraction", name: n })), touristType: ["City break travellers", "Couples", "Families"] },
    { "@type": "Hotel", name: c.hotel, address: c.addr, telephone: c.phone, image: H.abs(H.photoUrl(c.hp[0], 1600)), amenityFeature: c.perks.map(x => ({ "@type": "LocationFeatureSpecification", name: x, value: true })) }];
  return H.page({ path: `/italy/${k}`, title: t.title, desc: t.desc, ogImage: H.abs(`/images/og/italy-${k}.jpg`), active: "destinations", guides, body, ld, preload: `<link rel="preload" as="image" href="${H.photoUrl(c.imgs[0], 1600)}" imagesrcset="${H.photo(c.imgs[0]).srcset}" imagesizes="100vw" fetchpriority="high">`, scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

/* -------- region hub -------- */
function region(k, { guides }) {
  const t = REG[k];
  const pk = D.P.filter(p => p.region === k);
  const isCruise = k === "cruises";
  const path = isCruise ? "/cruises" : `/destinations/${D.RG_SLUG[k]}`;
  const crumbs = isCruise ? [{ name: "Home", href: "/" }, { name: "Cruises" }] : [{ name: "Home", href: "/" }, { name: "Destinations", href: "/destinations" }, { name: D.RG[k] }];
  const countries = [...new Set(pk.map(p => p.country))];
  const body = `
  <div class="page-top hasimg"><div class="hero-media">${img(pk[0].im, { alt: `${D.RG[k]} vacation packages`, sizes: "100vw", lazy: false, priority: true })}</div>
    <div class="wrap">${H.crumbs(crumbs)}<span class="tag rv"><i class="ph-fill ph-globe-hemisphere-east"></i>${pk.length} packages</span><h1>${t.h1}</h1><p class="lead rv" style="--d:200">${t.lead}</p>
    <div class="subnav">${pk.map(p => `<a href="/packages/${p.s}"><i class="ph-light ${isCruise ? "ph-boat" : "ph-map-pin"}"></i>${esc(isCruise ? p.ship : p.country)}</a>`).join("")}</div></div></div>
  <section class="sec" id="packages"><div class="wrap"><div class="pk-head"><div><h2 class="h2 rv">${isCruise ? "The three cruises we book" : `${D.RG[k]} packages`}</h2><p class="lead rv" style="margin-top:14px">${isCruise ? "Fares per person, two sharing the lowest cabin grade, port fees included." : `Flights, hotels, tours and transfers included. ${countries.join(", ")}.`}</p></div><a class="link-arrow rv" href="/packages">All packages<i class="ph-bold ph-arrow-right"></i></a></div>${grid(pk)}</div></section>
  <div class="wrap article" style="padding-top:0">
    <div class="prose">${t.intro}<h2 id="faq">Frequently asked questions</h2>${faqBlock(t.faq, { id: "regionFaq" })}</div>
    <aside class="side">${toc(t.intro)}${sideLinks(isCruise ? [["/packages/rome-trevi-three-nights", "Rome hotel before you sail"], ["/packages/venice-grand-canal", "Venice hotel after the Adriatic cruise"], ["/guides/italy-airport-to-city-transfers", "Airport transfers in Italy"]] : k === "middleeast" ? [["/guides/dubai-vs-abu-dhabi", "Dubai vs Abu Dhabi"], ["/packages/dubai-abu-dhabi-seven-nights", "Dubai and Abu Dhabi package"], ["/how-it-works", "How booking works"]] : [["/how-it-works", "How booking works"], ["/faq", "Frequently asked questions"], ["/reviews", "What travellers say"]])}${help(`Hi Preplan, I'd like a quote for ${D.RG[k]}.`)}</aside>
  </div>
  ${H.cta({ h: "Pick your dates and departure city", p: "We check live fares and hotel availability and send back one price for the whole trip.", text: `Hi Preplan, I'd like a ${D.RG[k]} quote.` })}`;
  return H.page({ path, title: t.title, desc: t.desc, ogImage: H.abs(`/images/og/region-${D.RG_SLUG[k]}.jpg`), active: isCruise ? "packages" : "destinations", guides, body, ld: [H.breadcrumbLd(crumbs.map((x, i) => i === crumbs.length - 1 ? { ...x, href: path } : x)), H.faqLd(t.faq)], preload: `<link rel="preload" as="image" href="${H.photoUrl(pk[0].im, 1600)}" imagesrcset="${H.photo(pk[0].im).srcset}" imagesizes="100vw" fetchpriority="high">`, scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

module.exports = { index, italy, multiCity, city, region };
