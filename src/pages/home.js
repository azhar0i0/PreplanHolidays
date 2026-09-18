const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const { esc, money, img, card, faqBlock, reviewCard, wa } = H;
const { gcard } = require("./guides");

const HOME_SET = ["rome-trevi-three-nights", "italy-big-three", "venice-grand-canal", "rome-and-florence", "dubai-abu-dhabi-seven-nights", "aegean-athens-santorini-mykonos", "istanbul-cappadocia-antalya", "alaska-inside-passage-glacier-bay"];

module.exports = function home({ guides }) {
  const heroId = "photo-1514890547357-a9ee288728e0";
  const hero = H.photo(heroId);
  const side = ["grand-italian-four", "florence-and-venice", "milan-garibaldi-break"].map((s, i) => { const p = D.bySlug[s]; return `<a class="hero-card rv right" style="--d:${500 + i * 120}" href="/packages/${s}">${img(p.im, { alt: p.t, sizes: "64px", cls: "" })}<div><b>${esc(p.t)}</b><span>${p.nights} nights</span></div><span class="pr">${money(p.price)}</span></a>`; }).join("");
  const cards = D.P.map((p, i) => card(p, i, "rv", HOME_SET.includes(p.s) ? "" : "more").replace('class="card rv', `data-home="${HOME_SET.includes(p.s) ? 1 : 0}" class="card rv`)).join("\n");
  const show = ["rome", "venice", "florence", "milan"].map((k, i) => { const c = D.C[k]; const p = D.P.find(p => !p.w && p.c.length === 1 && p.c[0] === k); return `<a class="scard rv" style="--d:${i * 110}" href="/italy/${k}">${img(c.imgs[0], { alt: `${c.ia[0]}, ${c.name}`, sizes: "(max-width:1024px) 72vw, 25vw" })}<span class="arr"><i class="ph-light ph-arrow-right"></i></span><div class="sc-b"><h3>${c.name} vacation packages</h3><div class="sc-m"><span>From ${p.nights} nights</span><b>From ${money(p.price)}</b></div></div></a>`; }).join("");
  const keys = ["rome", "florence", "venice", "milan"];
  const fpTabs = keys.map((k, i) => `<button class="tab${i ? "" : " on"}" id="fptab-${k}" role="tab" aria-selected="${!i}" aria-controls="fp-${k}" data-k="${k}"><i class="ph-light ph-map-pin"></i>${D.C[k].name}</button>`).join("");
  const fpPanels = keys.map((k, i) => { const c = D.C[k]; return `<div class="fp-panel rv" id="fp-${k}" role="tabpanel" aria-labelledby="fptab-${k}" data-fp="${k}"${i ? " hidden" : ""}><div class="fp-hotel"><div class="ph">${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:1024px) 100vw, 40vw" })}</div><div class="hb"><h3>${c.hotel}</h3>
    <div class="line"><i class="ph-light ph-map-pin-line"></i>${c.addr}</div><div class="line"><i class="ph-light ph-bed"></i>${c.room}, ${c.board.toLowerCase()}</div><div class="line"><i class="ph-light ph-arrow-right"></i><a href="/italy/${k}">All ${c.name} packages and city tax rules</a></div></div></div>
    <div class="fp-tiles">${c.tiles.map(t => `<div class="fp-tile"><span class="ti"><i class="ph-light ${t[0]}"></i></span><h4>${t[1]}</h4><p>${t[2]}</p></div>`).join("")}</div></div>`; }).join("");
  const faqs = D.FAQ.filter(f => ["Do I pay anything at the hotel?", "Are flights included in the Italy hotel packages?", "How does the Venice city tax work?", "Is my bed preference guaranteed?", "Are your prices per person or per room?", "How far in advance should I book?"].includes(f[1]));
  const guideCards = guides.slice(0, 3).map((g, i) => gcard(g, i)).join("");

  const body = `
  <section class="hero" id="top">
    <div class="hero-media">${img(heroId, { alt: hero.alt, sizes: "100vw", lazy: false, priority: true, extra: ' id="heroImg"' })}</div>
    <div class="wrap hero-body">
      <div class="hero-grid">
        <div>
          <span class="tag rv" style="--d:100;background:rgba(255,255,255,.16);color:#fff"><i class="ph-fill ph-sparkle" style="color:var(--school-bus-yellow)"></i>Rome, Florence, Venice, Milan and beyond</span>
          <h1 style="margin-top:20px">
            <span class="mask"><span style="--d:150">Italy vacation packages,</span></span>
            <span class="mask"><span style="--d:260">planned before you <em>pack.</em></span></span>
          </h1>
          <p class="sub rv" style="--d:420">Prepaid city breaks with central hotels, breakfast included and every city tax explained upfront. Plus flight-inclusive holidays and cruises worldwide, priced in US dollars.</p>
          <div class="hero-cta rv" style="--d:540">
            <a class="btn btn-gold" href="/packages">Browse packages<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a>
            <a class="btn btn-glass" href="/how-it-works">How it works<span class="ico"><i class="ph-light ph-play"></i></span></a>
          </div>
        </div>
        <div class="hero-side" id="heroSide">${side}</div>
      </div>
      <div class="planner rv" style="--d:680">
        <div class="planner-in">
          <div class="pf"><div class="pf-label"><i class="ph-light ph-map-pin"></i>Where to</div><div class="dd" id="hDest"></div></div>
          <div class="pf"><div class="pf-label"><i class="ph-light ph-calendar-blank"></i>Check in</div><div class="dp" id="hDate"></div></div>
          <div class="pf"><div class="pf-label"><i class="ph-light ph-users"></i>Travellers</div><div class="gp" id="hGuests"></div></div>
          <button class="btn btn-ink go" id="hSearch" type="button">Find my trip<span class="ico"><i class="ph-bold ph-magnifying-glass"></i></span></button>
        </div>
      </div>
    </div>
  </section>

  <div class="marq" aria-label="What every package includes">
    <div class="marq-track">
      ${[0, 1].map(k => `<div class="marq-group"${k ? ' aria-hidden="true"' : ""}>
        <span class="marq-item">Breakfast included<i class="ph-fill ph-star-four"></i></span>
        <span class="marq-item">Central hotels, hand-checked<i class="ph-fill ph-star-four"></i></span>
        <span class="marq-item">City taxes explained upfront<i class="ph-fill ph-star-four"></i></span>
        <span class="marq-item">Prepaid vouchers, no surprises<i class="ph-fill ph-star-four"></i></span>
        <span class="marq-item">Real humans on WhatsApp<i class="ph-fill ph-star-four"></i></span>
        <span class="marq-item">Single or multi-city<i class="ph-fill ph-star-four"></i></span>
      </div>`).join("")}
    </div>
  </div>

  <section class="sec" id="about">
    <div class="wrap">
      <div class="about-top">
        <h2 class="h2 rv">We sort the stay. You keep the <span class="hl">good part.</span></h2>
        <p class="lead rv" style="--d:120">Preplan Holidays is a small team that books Italian city breaks the way we would want them booked for ourselves: walkable hotels, breakfast sorted, and no fine print waiting at the front desk. <a href="/about">Meet the team</a>.</p>
      </div>
      <div class="bento">
        <div class="bz b1 rv scale">
          ${img("images/hotels/venice-hotel-monaco-grand-canal-terrace.jpg", { alt: "Terrace restaurant at Hotel Monaco & Grand Canal, looking across to Santa Maria della Salute", sizes: "(max-width:767px) 100vw, 42vw", w: 1600, h: 1068 })}
          <div class="cap"><i class="ph-light ph-buildings"></i><div><b>Four hotels we know well</b><span>Steps from Trevi, the Grand Canal, Santa Maria Novella and Garibaldi</span></div></div>
        </div>
        <div class="bz b2 rv" style="--d:100">
          <div><h3>One booking, one voucher, one clear price.</h3><p>Every package is prepaid, so the hotel already has you on the list when you arrive.</p></div>
          <div class="ticks">
            <div><i class="ph-light ph-check-circle"></i>Breakfast on every night</div>
            <div><i class="ph-light ph-check-circle"></i>Bed preference passed to the hotel</div>
            <div><i class="ph-light ph-check-circle"></i>Local fees listed before you pay</div>
          </div>
        </div>
        <div class="bz b3 rv" style="--d:180">${img("images/hotels/rome-trevi-collection-hotel-terrace.jpg", { alt: "Private terrace at Trevi Collection Hotel, Rome", sizes: "(max-width:767px) 50vw, 25vw", w: 1240, h: 827 })}</div>
        <div class="bz b4 rv" style="--d:240"><div class="num" data-count="${D.P.length}">0</div><p>ready-to-book packages across Italy and the world</p></div>
        <div class="bz b5 rv" style="--d:300"><div class="big"><i class="ph-light ph-headset"></i></div><div><b>24/7 help while you travel</b><span>If something at the hotel is not right, message us and we chase it.</span></div></div>
      </div>
    </div>
  </section>

  <section class="sec" id="packages" style="padding-top:0">
    <div class="wrap">
      <div class="pk-head">
        <div>
          <h2 class="h2 rv">Pick a city, or string a few together</h2>
          <p class="lead rv" style="--d:100;margin-top:14px">Italy prices are per person, two sharing, with breakfast every morning. Worldwide packages include flights unless marked land only.</p>
        </div>
        <div class="chips rv" id="homeChips" style="--d:160" role="group" aria-label="Filter packages">
          <span class="chip-ind"></span>
          <button class="chip-b on" type="button" data-f="all">Featured</button>
          <button class="chip-b" type="button" data-f="single">One city</button>
          <button class="chip-b" type="button" data-f="multi">Multi-city</button>
          <button class="chip-b" type="button" data-f="world">Worldwide</button>
          <button class="chip-b" type="button" data-f="cruise">Cruises</button>
        </div>
      </div>
      <div class="grid4" id="homeGrid">${cards}</div>
      <div class="see-all rv"><a class="btn btn-teal" href="/packages">See all ${D.P.length} packages<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a></div>
    </div>
  </section>

  <section class="sec job">
    <div class="wrap job-grid">
      <div>
        <h2 class="rv blur">Booking a great holiday shouldn't feel like a <span>second job.</span></h2>
        <p class="lead rv" style="--d:120">Most of the work in a city break happens before you leave: comparing, cross-checking and reading the small print. That part is our job now.</p>
        <a class="btn btn-gold rv" style="--d:220" href="/how-it-works">Show me how<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a>
      </div>
      <div class="chores">
        <div class="chore rv right" style="--d:0"><i class="ph-light ph-browsers"></i><p>Thirty open tabs of hotel reviews</p></div>
        <div class="chore rv right" style="--d:120"><i class="ph-light ph-coffee"></i><p>Working out if breakfast is included or extra</p></div>
        <div class="chore rv right" style="--d:240"><i class="ph-light ph-receipt"></i><p>Guessing how much city tax to budget per night</p></div>
        <div class="chore rv right" style="--d:360"><i class="ph-light ph-bed"></i><p>Hoping the twin room is actually twin beds</p></div>
        <div class="chore rv right" style="--d:480"><i class="ph-light ph-train"></i><p>Matching check-out in one city to check-in at the next</p></div>
        <div class="chore fix rv right" style="--d:640"><i class="ph-fill ph-chat-circle-dots"></i><p>Or send Preplan one message and get it all back sorted.</p></div>
      </div>
    </div>
  </section>

  <section class="sec" id="how">
    <div class="wrap">
      <div class="steps-head">
        <h2 class="h2 rv">Three steps from idea to boarding pass</h2>
        <p class="lead rv" style="--d:100;margin-top:14px">No forms longer than a text message. Most trips are confirmed within a day. <a href="/how-it-works">Read the full process</a>.</p>
      </div>
      <div class="steps rv" id="stepsWrap">
        <div class="steps-line" aria-hidden="true"><svg viewBox="0 0 1000 24" preserveAspectRatio="none"><path d="M0 12 C 250 -10, 500 34, 1000 12"/><path class="draw" d="M0 12 C 250 -10, 500 34, 1000 12"/></svg></div>
        <article class="step rv" style="--d:100"><div class="step-in">
          <div class="step-top"><span class="step-n">01</span><span class="step-ic"><i class="ph-light ph-chat-teardrop-text"></i></span></div>
          <h3>Tell us the rough idea</h3>
          <p>Cities, dates, who is coming. "Rome and Florence in October for four of us" is plenty.</p>
          <ul><li><i class="ph-bold ph-check"></i>WhatsApp, email or the form</li><li><i class="ph-bold ph-check"></i>Flexible dates welcome</li></ul>
        </div></article>
        <article class="step rv" style="--d:220"><div class="step-in">
          <div class="step-top"><span class="step-n">02</span><span class="step-ic"><i class="ph-light ph-list-checks"></i></span></div>
          <h3>We shortlist and hold rooms</h3>
          <p>You get the hotel, room type, board and every local fee in one short summary.</p>
          <ul><li><i class="ph-bold ph-check"></i>Bed requests sent to the hotel</li><li><i class="ph-bold ph-check"></i>City taxes listed in euros</li></ul>
        </div></article>
        <article class="step rv" style="--d:340"><div class="step-in">
          <div class="step-top"><span class="step-n">03</span><span class="step-ic"><i class="ph-light ph-ticket"></i></span></div>
          <h3>Pay once, get your vouchers</h3>
          <p>Prepaid vouchers for each hotel plus a day-by-day plan you can open offline.</p>
          <ul><li><i class="ph-bold ph-check"></i>Nothing to pay at check-in but local tax</li><li><i class="ph-bold ph-check"></i>Support line for the whole trip</li></ul>
        </div></article>
      </div>
    </div>
  </section>

  <section class="sec show">
    <div class="wrap">
      <div class="show-head">
        <div>
          <h2 class="h2 rv">Four Italian cities, four very different stays</h2>
          <p class="lead rv" style="--d:100">A room by the Trevi Fountain, a canal-side hotel in San Marco, a Renaissance weekend and a design-city break. Breakfast and prepaid rooms included.</p>
        </div>
        <a class="link-arrow rv" style="--d:180" href="/italy">All Italy packages<i class="ph-bold ph-arrow-right"></i></a>
      </div>
      <div class="show-row" id="showRow">${show}</div>
      <div class="stats">
        <div class="stat rv" style="--d:0"><b data-count="27" data-suf="K+">0</b><p>Happy travellers</p></div>
        <div class="stat rv" style="--d:100"><b data-count="${D.P.length}">0</b><p>Ready-to-book packages</p></div>
        <div class="stat rv" style="--d:200"><b data-count="4.8" data-dec="1" data-suf="/5">0</b><p>Average customer rating</p></div>
        <div class="stat rv" style="--d:300"><b data-count="24" data-suf="/7">0</b><p>Travel support</p></div>
      </div>
    </div>
  </section>

  <section class="sec" id="fineprint">
    <div class="wrap">
      <div class="fp-head">
        <span class="tag rv"><i class="ph-light ph-magnifying-glass"></i>No surprises at check-in</span>
        <h2 class="h2 rv" style="--d:80;margin-top:16px">The fine print, translated into plain English</h2>
        <p class="lead rv" style="--d:160;margin-top:14px">Every hotel has its own rules. Here is what each one actually means for you before you pay. Full details on the <a href="/fees-and-policies">city taxes and hotel policies</a> page.</p>
      </div>
      <div class="tabs rv" id="fpTabs" role="tablist"><span class="tab-ind"></span>${fpTabs}</div>
      <div id="fpPanel">${fpPanels}</div>
    </div>
  </section>

  <section class="sec rev" id="reviews">
    <div class="wrap rev-grid">
      <div>
        <h2 class="h2 rv">People come back with photos, not complaints</h2>
        <div class="score rv" style="--d:120">
          <b data-count="4.8" data-dec="1">0</b>
          <div><div class="stars" aria-hidden="true"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star-half"></i></div><small>Average from 1,284 verified trips</small></div>
        </div>
        <div class="bars rv" id="bars" style="--d:200">
          <div>5 star<span class="b" style="--w:.84;--d:0;background:var(--mist)"></span>84%</div>
          <div>4 star<span class="b" style="--w:.12;--d:120;background:var(--mist)"></span>12%</div>
          <div>3 star<span class="b" style="--w:.03;--d:240;background:var(--mist)"></span>3%</div>
          <div>2 star<span class="b" style="--w:.01;--d:360;background:var(--mist)"></span>1%</div>
        </div>
        <div class="rv-ctrl rv" style="--d:280">
          <button class="icon-btn" id="rvPrev" type="button" aria-label="Previous review"><i class="ph-light ph-arrow-left"></i></button>
          <button class="icon-btn" id="rvNext" type="button" aria-label="Next review"><i class="ph-light ph-arrow-right"></i></button>
          <div class="rv-prog"><i id="rvProg"></i></div>
        </div>
        <p class="rv" style="--d:320;margin-top:22px"><a class="link-arrow" href="/reviews">Read all reviews<i class="ph-bold ph-arrow-right"></i></a></p>
      </div>
      <div class="deck rv scale" id="deck" style="--d:150">${D.REVIEWS.slice(0, 6).map(reviewCard).join("")}</div>
    </div>
  </section>

  <section class="sec" id="guides" style="padding-top:0">
    <div class="wrap">
      <div class="pk-head">
        <div><h2 class="h2 rv">Plan smarter with our Italy guides</h2><p class="lead rv" style="--d:100;margin-top:14px">City taxes, train times, how many nights each city deserves. Written by the planners who book these trips every week.</p></div>
        <a class="link-arrow rv" href="/guides">All guides<i class="ph-bold ph-arrow-right"></i></a>
      </div>
      <div class="glist">${guideCards}</div>
    </div>
  </section>

  <section class="sec" id="faq" style="padding-top:0">
    <div class="wrap faq-grid">
      <div class="faq-side">
        <h2 class="h2 rv">Questions people ask before they book</h2>
        <p class="lead rv" style="--d:100;margin-top:14px">Straight answers about fees, rooms and what happens at the front desk. <a href="/faq">See all ${D.FAQ.length} questions</a>.</p>
        <div class="faq-help rv" style="--d:180"><div class="faq-help-in">
          <h3>Still not sure?</h3>
          <p>Send the question on WhatsApp. A planner usually replies within the hour.</p>
          <a class="btn btn-gold btn-sm" href="${wa("Hi Preplan, I have a question about booking a trip.")}" target="_blank" rel="noopener">Ask on WhatsApp<span class="ico"><i class="ph-light ph-whatsapp-logo"></i></span></a>
        </div></div>
      </div>
      <div>${faqBlock(faqs, { id: "homeFaq" })}</div>
    </div>
  </section>

  ${H.cta({ h: "Tell us where you want to wake up", p: "Call, message or send the form. Planners are online seven days a week and reply within one working day." })}
  `;

  return H.page({
    path: "/",
    title: "Italy Vacation Packages & City Breaks 2026/2027 | Preplan Holidays",
    desc: "Prepaid Italy vacation packages with central hotels and breakfast in Rome, Florence, Venice and Milan, plus flight-inclusive holidays and cruises worldwide.",
    ogImage: H.abs("/images/og/default.jpg"),
    active: "home",
    guides,
    body,
    preload: `<link rel="preload" as="image" href="${H.photoUrl(heroId, 1600)}" imagesrcset="${H.photo(heroId).srcset}" imagesizes="100vw" fetchpriority="high">`,
    ld: [H.faqLd(faqs.map(f => [f[1], f[2]]))],
    scripts: `<script>window.PPH=${H.json({ wa: cfg.whatsapp, formEndpoint: cfg.formEndpoint, cities: Object.values(D.C).map(c => ({ k: c.slug, name: c.name, area: c.area })), regions: ["europe", "middleeast", "asia", "caribbean", "americas", "cruises"].map(k => ({ k, name: D.RG[k], sub: `${D.P.filter(p => p.region === k).length} package${D.P.filter(p => p.region === k).length === 1 ? "" : "s"}` })) })}</script>`
  });
};
