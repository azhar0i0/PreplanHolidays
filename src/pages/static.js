const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const { PPH } = require("./packages");
const { esc, money, img, grid, faqBlock, reviewCard, wa } = H;

const scripts = () => `<script>window.PPH=${H.json({ ...PPH(), packages: D.P.map(p => ({ s: p.s, t: p.t, sub: `${p.dur || p.nights + " nights"}, ${p.quote ? "on request" : "from " + money(p.price)}` })) })}</script>`;
const bc = items => H.breadcrumbLd(items);
const UPDATED = "September 19, 2026";

/* ---------------- about ---------------- */
function about({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "About" }];
  const body = `
  ${H.pageTop({ crumbs, h1: "A small team that books Italy the way we'd book it for ourselves", lead: "Preplan Holidays started in 2019 with one idea: a city break should arrive as one clean plan, not thirty open tabs. We still book every trip by hand." })}
  <section class="sec"><div class="wrap two">
    <div>${img("images/hotels/venice-hotel-monaco-grand-canal-room.jpg", { alt: "Guest room at Hotel Monaco & Grand Canal, Venice", sizes: "(max-width:1024px) 100vw, 50vw", w: 1600, h: 1067 })}</div>
    <div class="prose">
      <h2 id="story">How we work</h2>
      <p>We are a travel agency based in ${esc(cfg.address.city)} that specialises in Italian city breaks and a short list of flight-inclusive trips worldwide. We are deliberately small. Four hotels in Italy that we know room by room, a dozen ways to combine them, and a handful of longer trips we have run enough times to know where the problems hide.</p>
      <p>Every package on this site is prepaid. You pay us once, we pay the hotel, and you arrive with a voucher that the front desk already has on file. The only thing left to pay locally is the city tax, which Italian law says the hotel must collect itself, and which we list in euros before you book so it is never a surprise.</p>
      <h2 id="promise">What we promise</h2>
      <ul>
        <li><strong>Every fee upfront.</strong> City taxes, deposits, cot charges, breakfast rules, ID requirements: all on the package page before you pay.</li>
        <li><strong>Real people.</strong> WhatsApp, phone and email, seven days a week, with a planner who has stayed at the hotel.</li>
        <li><strong>Straight prices.</strong> Per person, two sharing, in US dollars, with what is and is not included spelled out in two columns.</li>
        <li><strong>Help when it goes wrong.</strong> If the room is not what was booked, message us from the lobby and we chase the hotel while you are still standing there.</li>
      </ul>
    </div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="h-sec"><h2 class="h2 rv">Who you'll be talking to</h2><p class="lead rv">Three planners, one office, no call centre.</p></div>
    <div class="team">
      <div class="tcard rv"><span class="ti"><i class="ph-light ph-map-trifold"></i></span><h3>Italy planning</h3><p>Hotel contracts, multi-city routing, train timetables and the city-tax tables on this site. Stays at each of our four hotels at least once a year.</p></div>
      <div class="tcard rv" style="--d:100"><span class="ti"><i class="ph-light ph-airplane-tilt"></i></span><h3>Worldwide and cruises</h3><p>Flight-inclusive packages, cruise fares and visa rules for Europe, the Middle East, Asia, the Caribbean and the Americas.</p></div>
      <div class="tcard rv" style="--d:200"><span class="ti"><i class="ph-light ph-headset"></i></span><h3>Travel support</h3><p>The WhatsApp line while you are away. Bed-type requests, late arrivals, lost vouchers, a hotel that has got something wrong.</p></div>
    </div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="h-sec"><h2 class="h2 rv">The hotels we use in Italy</h2><p class="lead rv">We would rather know four hotels well than list four hundred.</p></div>
    <div class="hotels">${Object.values(D.C).map((c, i) => `<div class="hotel rv" style="--d:${i * 80}"><div class="hp">${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:767px) 100vw, 170px" })}</div><div class="hi"><h3>${c.hotel}</h3><div class="row"><i class="ph-light ph-map-pin-line"></i>${c.addr}</div><div class="row"><i class="ph-light ph-bed"></i>${c.room}, ${c.board.toLowerCase()}</div><div class="row"><i class="ph-light ph-arrow-right"></i><a href="/italy/${c.slug}">${c.name} packages and city guide</a></div></div></div>`).join("")}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="prose" style="max-width:none">
    <h2 id="details">Company details</h2>
    <p>${esc(cfg.legalName)}, ${esc(cfg.address.street)}, ${esc(cfg.address.city)}, ${esc(cfg.address.region)} ${esc(cfg.address.postal)}, ${esc(cfg.address.country)}. Phone <a href="tel:${cfg.phoneHref}">${cfg.phone}</a>, email <a href="mailto:${cfg.email}">${cfg.email}</a>. Office hours ${esc(cfg.hours)}. Our <a href="/terms">terms of booking</a> and <a href="/privacy">privacy policy</a> apply to every booking.</p>
    <p class="muted" style="font-size:.9rem">Destination photography on this site is by photographers on Unsplash, used under the Unsplash License; hotel photography is supplied by the hotels.</p>
  </div></div></section>
  ${H.cta({ h: "Say hello", p: "Tell us where you want to wake up and we will take it from there." })}`;
  return H.page({ path: "/about", title: `About Preplan Holidays: Italy City Break Specialists Since ${cfg.founded}`, desc: `A small ${cfg.address.city} travel agency booking prepaid hotel-and-breakfast city breaks in Rome, Florence, Venice and Milan, plus holidays worldwide. Meet the team.`, ogImage: H.abs("/images/og/about.jpg"), active: "about", guides, body, ld: [bc(crumbs), { "@type": "AboutPage", name: "About Preplan Holidays", url: H.abs("/about"), mainEntity: { "@id": H.ORG_ID } }], scripts: scripts() });
}

/* ---------------- how it works ---------------- */
function howItWorks({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "How it works" }];
  const steps = [
    ["ph-chat-teardrop-text", "Tell us the rough idea", "Cities, dates, who is coming. \"Rome and Florence in October for four of us\" is plenty. Send it by WhatsApp, email or the contact form; flexible dates are welcome and usually get you a better price.", ["Reply within one working day, usually within the hour", "No deposit, no commitment"]],
    ["ph-list-checks", "We shortlist and hold rooms", "You get one short summary: the hotel, the room type, the board, the city tax in euros, every hotel rule that applies, and the train plan if there is more than one city. Bed requests go to the hotel at this stage.", ["Rooms held for 48 hours while you decide", "Everything in one message, not thirty tabs"]],
    ["ph-credit-card", "Pay once", "Card or bank transfer, in US dollars, for the whole trip. We pay the hotels. There is nothing to pay at check-in except the local city tax and anything you order from the minibar.", ["Secure card payment or transfer", "Invoice with every line itemised"]],
    ["ph-ticket", "Get your vouchers", "A prepaid voucher for each hotel plus a day-by-day plan you can open offline, with train times, stations, reservations you have made and what to pay where. For Venice, the access-fee exemption link is included.", ["PDF pack by email and WhatsApp", "Hotels told your arrival time"]],
    ["ph-headset", "Travel with backup", "The WhatsApp line is open for the whole trip. Room not as booked, train strike, lost voucher: message us and we deal with it while you carry on.", ["Real planner, not a bot", "Seven days a week"]]
  ];
  const body = `
  ${H.pageTop({ crumbs, h1: "From one message to boarding pass, in five steps", lead: "No forms longer than a text message. Most trips are confirmed within a day. Here is exactly what happens between your first message and your first breakfast." })}
  <section class="sec"><div class="wrap"><div class="steps" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
    ${steps.map((s, i) => `<article class="step rv" style="--d:${i * 100};margin-top:0"><div class="step-in"><div class="step-top"><span class="step-n">0${i + 1}</span><span class="step-ic"><i class="ph-light ${s[0]}"></i></span></div><h2 style="font-size:1.3rem">${s[1]}</h2><p>${s[2]}</p><ul>${s[3].map(x => `<li><i class="ph-bold ph-check"></i>${x}</li>`).join("")}</ul></div></article>`).join("")}
  </div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap article" style="padding-top:0">
    <div class="prose">
      <h2 id="prices">How prices work</h2>
      <p>Italy hotel packages are priced per person based on two adults sharing one room, with breakfast every morning, in US dollars. Multi-city packages are 7% lower than the same nights booked separately. Children aged 2 to 17 sharing with two adults are priced at 60% of the adult rate; third and fourth adults in a room are quoted individually and are usually cheaper. Flights are not included in Italy hotel packages. Train tickets between cities are optional at $45 per person per leg.</p>
      <p>Worldwide packages are per person, two sharing, and include return international flights from the USA unless the page says land only. The price shown is the lowest fare we hold for that route; your exact price depends on departure city and dates, and we confirm it before you pay anything. Cruise fares are for the lowest cabin grade on a specific sailing and include port fees.</p>
      <h2 id="changes">Changes and cancellations</h2>
      <p>Every hotel has its own rules and we show them on the package page and in your summary before you pay. Across our four Italian hotels: same-day cancellations and no-shows are charged in full; the Venice hotel does not allow the check-in date to change after booking; the others usually allow changes subject to availability if we ask early. For worldwide packages and cruises, airline and cruise-line terms apply and we quote them with the price. Full details are in our <a href="/terms">terms of booking</a>.</p>
      <h2 id="pay">Ways to pay</h2>
      <p>Major credit and debit cards, or bank transfer. For worldwide packages a deposit secures flights and the balance is due before departure on a date we agree with you. Travel insurance is offered at booking ($24 per person for Italy hotel packages) and we strongly recommend it for any trip with flights.</p>
    </div>
    <aside class="side"><div class="side-card dark"><h3>Start with a message</h3><p>Dates, cities and who is coming. That is all we need.</p><a class="btn btn-gold btn-sm" href="${wa("Hi Preplan, I'd like to start planning a trip.")}" target="_blank" rel="noopener">WhatsApp a planner<span class="ico"><i class="ph-light ph-whatsapp-logo"></i></span></a></div>
    <div class="side-card"><h3>Useful reading</h3><ul><li><a href="/faq"><i class="ph-light ph-arrow-right"></i>Frequently asked questions</a></li><li><a href="/fees-and-policies"><i class="ph-light ph-arrow-right"></i>City taxes and hotel policies</a></li><li><a href="/guides/italy-tourist-tax-2026"><i class="ph-light ph-arrow-right"></i>Italy tourist tax 2026</a></li><li><a href="/reviews"><i class="ph-light ph-arrow-right"></i>What travellers say</a></li></ul></div></aside>
  </div></section>
  ${H.cta({ h: "Ready to send the first message?", p: "Planners are online seven days a week." })}`;
  const howLd = { "@type": "HowTo", name: "How to book a Preplan Holidays trip", description: "Five steps from first message to vouchers.", step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s[1], text: s[2] })) };
  return H.page({ path: "/how-it-works", title: `How It Works: Booking a Prepaid City Break in 5 Steps | ${cfg.name}`, desc: "Send the rough idea, we shortlist and hold rooms, you pay once, you get prepaid vouchers and a day-by-day plan, and a planner is on WhatsApp for the whole trip.", ogImage: H.abs("/images/og/how-it-works.jpg"), active: "about", guides, body, ld: [bc(crumbs), howLd], scripts: scripts() });
}

/* ---------------- reviews ---------------- */
function reviews({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Reviews" }];
  const body = `
  ${H.pageTop({ crumbs, h1: "What travellers say after the trip", lead: "Feedback we collect by email after every booking, published with the traveller's permission. Average rating 4.8 out of 5 from 1,284 verified trips." })}
  <section class="sec"><div class="wrap">
    <div class="rev-list">${D.REVIEWS.map(reviewCard).join("")}</div>
    <p class="muted center" style="margin-top:28px;font-size:.9rem">Reviews are first-party feedback collected by Preplan Holidays and are not independently verified by a third-party platform. We publish them with the traveller's consent and edit only for length.</p>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="pk-head"><h2 class="h2 rv">The trips they took</h2><a class="link-arrow rv" href="/packages">All packages<i class="ph-bold ph-arrow-right"></i></a></div>${grid([...new Set(D.REVIEWS.map(r => r.pkg))].slice(0, 4).map(s => D.bySlug[s]))}</div></section>
  ${H.cta({ h: "Add your own", p: "Every trip gets a two-question feedback email a week after you get home." })}`;
  return H.page({ path: "/reviews", title: `Preplan Holidays Reviews: What Travellers Say About Our Italy Trips`, desc: "Reviews from Preplan Holidays travellers on Rome, Florence, Venice, Milan, Dubai and Greece trips. Average 4.8 out of 5, published with permission.", ogImage: H.abs("/images/og/reviews.jpg"), active: "about", guides, body, ld: [bc(crumbs)], scripts: scripts() });
}

/* ---------------- faq ---------------- */
function faq({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "FAQ" }];
  const body = `
  ${H.pageTop({ crumbs, h1: "Questions people ask before they book", lead: "Straight answers about fees, rooms, flights and what happens at the front desk. Can't find yours? Ask on WhatsApp and a planner usually replies within the hour." })}
  <section class="sec"><div class="wrap faq-grid">
    <div class="faq-side">
      <div class="faq-search rv"><div class="box"><i class="ph-light ph-magnifying-glass"></i><input id="faqQ" type="search" placeholder="Search questions, e.g. city tax" aria-label="Search questions"></div></div>
      <div class="chips faq-cats rv" id="faqCats" style="--d:80" role="group" aria-label="Filter questions"><span class="chip-ind"></span><button class="chip-b on" type="button" data-f="all">All</button><button class="chip-b" type="button" data-f="book">Booking</button><button class="chip-b" type="button" data-f="fees">Fees</button><button class="chip-b" type="button" data-f="hotel">At the hotel</button></div>
      <div class="faq-help rv" style="--d:180"><div class="faq-help-in"><h3>Still not sure?</h3><p>Send the question on WhatsApp. A planner usually replies within the hour.</p><a class="btn btn-gold btn-sm" href="${wa("Hi Preplan, I have a question.")}" target="_blank" rel="noopener">Ask on WhatsApp<span class="ico"><i class="ph-light ph-whatsapp-logo"></i></span></a></div></div>
    </div>
    <div>${faqBlock(D.FAQ)}<div class="empty" id="faqEmpty" style="display:none"><i class="ph-light ph-question"></i><h3>No matching questions</h3><p class="muted">Try another word, or ask us directly on WhatsApp.</p></div></div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="pk-head"><h2 class="h2 rv">Guides that go deeper</h2><a class="link-arrow rv" href="/guides">All guides<i class="ph-bold ph-arrow-right"></i></a></div><div class="glist">${guides.slice(0, 3).map((g, i) => require("./guides").gcard(g, i)).join("")}</div></div></section>`;
  return H.page({ path: "/faq", title: `FAQ: City Taxes, Cancellations, Rooms and Flights | ${cfg.name}`, desc: "What you pay at the hotel, city tax in Milan and Venice, cancellations, bed preferences, breakfast rules, ID at check-in and whether flights are included.", ogImage: H.abs("/images/og/faq.jpg"), active: "about", guides, body, ld: [bc(crumbs), H.faqLd(D.FAQ.map(f => [f[1], f[2]]))], scripts: scripts() });
}

/* ---------------- contact ---------------- */
function contact({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Contact" }];
  const body = `
  ${H.pageTop({ crumbs, h1: "Tell us where you want to wake up", lead: "Call, message or send the form. Planners are online seven days a week and reply within one working day, usually much sooner." })}
  <section class="sec"><div class="wrap contact-grid">
    <aside class="c-info rv left">
      <h2>Reach a planner</h2>
      <p class="lead">Pick whatever is easiest. WhatsApp is fastest.</p>
      <div class="c-list">
        <a class="c-item" href="tel:${cfg.phoneHref}"><span class="ci"><i class="ph-light ph-phone"></i></span><div><small>Call us</small><b>${cfg.phone}</b></div><i class="ph-light ph-arrow-up-right ca"></i></a>
        <a class="c-item wa" href="${wa("Hi Preplan, I'd like to plan a trip.")}" target="_blank" rel="noopener"><span class="ci"><i class="ph-light ph-whatsapp-logo"></i></span><div><small>WhatsApp</small><b>Chat with a planner</b></div><i class="ph-light ph-arrow-up-right ca"></i></a>
        <a class="c-item" href="mailto:${cfg.email}"><span class="ci"><i class="ph-light ph-envelope-simple"></i></span><div><small>Email</small><b>${cfg.email}</b></div><i class="ph-light ph-arrow-up-right ca"></i></a>
        <div class="c-item"><span class="ci"><i class="ph-light ph-map-pin-line"></i></span><div><small>Office</small><b>${esc(cfg.address.street)}, ${esc(cfg.address.city)}, ${esc(cfg.address.region)} ${esc(cfg.address.postal)}</b></div></div>
        <div class="c-item"><span class="ci"><i class="ph-light ph-clock"></i></span><div><small>Hours</small><b>${esc(cfg.hours)}</b></div></div>
      </div>
      <div class="c-social">${Object.entries(cfg.social).map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${k}"><i class="ph-light ph-${k}-logo"></i></a>`).join("")}</div>
    </aside>
    <div class="c-form rv right" style="--d:120">
      <form id="cForm" novalidate>
        <h2 class="h3">Plan my trip</h2>
        <p class="muted">Share a few details and we will reply with options within one working day.</p>
        <div class="form-grid">
          <div class="field" data-req="name"><label for="cName">Full name</label><div class="box"><input id="cName" name="name" autocomplete="name" placeholder="Your name" aria-required="true"></div><span class="err"><i class="ph-light ph-warning-circle"></i>Please add your name</span></div>
          <div class="field" data-req="email"><label for="cEmail">Email</label><div class="box"><input id="cEmail" name="email" type="email" autocomplete="email" placeholder="you@email.com" aria-required="true"></div><span class="err"><i class="ph-light ph-warning-circle"></i>Enter a valid email</span></div>
          <div class="field"><label for="cPhone">Phone or WhatsApp</label><div class="box"><input id="cPhone" name="phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000"></div><span class="help">Optional, for a faster reply</span></div>
          <div class="field" data-req="topic"><span class="lbl" id="cTopic-lbl">What do you need?</span><div class="dd" id="cTopic"></div><span class="err"><i class="ph-light ph-warning-circle"></i>Choose an option</span></div>
          <div class="field"><span class="lbl">Package</span><div class="dd" id="cPkg"></div></div>
          <div class="field"><span class="lbl">Travel date</span><div class="dp" id="cDate"></div></div>
          <div class="field span2"><span class="lbl">Travellers</span><div class="gp" id="cGuests"></div></div>
          <div class="field span2"><label for="cMsg">Message</label><div class="box"><textarea id="cMsg" name="message" placeholder="Anything we should know? Occasions, bed preferences, budget."></textarea></div></div>
          <div class="field span2" data-req="consent"><label class="chk"><input type="checkbox" id="cConsent" aria-required="true"><span class="bx"><i class="ph-bold ph-check"></i></span><span class="ct">I agree to be contacted about this enquiry. We never share your details. See our <a href="/privacy">privacy policy</a>.</span></label><span class="err"><i class="ph-light ph-warning-circle"></i>Please tick to continue</span></div>
        </div>
        <div class="form-actions"><span class="help"><i class="ph-light ph-lock-simple"></i> Your details stay private</span><button type="submit" class="btn btn-teal">Send enquiry<span class="ico"><i class="ph-bold ph-paper-plane-tilt"></i></span></button></div>
      </form>
      <div class="success" id="cSuccess"><div class="ok"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 23l7 7 14-15"/></svg></div><h3>Enquiry received</h3><p>Thanks. A planner will reply within one working day, usually much sooner.</p><button class="btn btn-ghost btn-sm" type="button" id="cAgain">Send another<span class="ico"><i class="ph-light ph-arrow-counter-clockwise"></i></span></button></div>
    </div>
  </div></section>`;
  return H.page({ path: "/contact", title: `Contact Preplan Holidays: WhatsApp, Phone, Email and Enquiry Form`, desc: `WhatsApp or call ${cfg.phone}, email ${cfg.email}, or send the enquiry form. Planners reply within one working day, seven days a week.`, ogImage: H.abs("/images/og/contact.jpg"), active: "contact", guides, body, ld: [bc(crumbs), { "@type": "ContactPage", name: "Contact Preplan Holidays", url: H.abs("/contact"), mainEntity: { "@id": H.ORG_ID } }], scripts: scripts() });
}

/* ---------------- fees and policies ---------------- */
function fees({ guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Fees and policies" }];
  const keys = Object.keys(D.C);
  const body = `
  ${H.pageTop({ crumbs, h1: "City taxes and hotel policies, hotel by hotel", lead: "Every hotel has its own rules. Here is what each one actually means for you before you pay, plus the 2026 city-tax rates for all four cities." })}
  <section class="sec"><div class="wrap">
    <div class="tabs rv" id="fpTabs" role="tablist"><span class="tab-ind"></span>${keys.map((k, i) => `<button class="tab${i ? "" : " on"}" id="fptab-${k}" role="tab" aria-selected="${!i}" aria-controls="fp-${k}" data-k="${k}"><i class="ph-light ph-map-pin"></i>${D.C[k].name}</button>`).join("")}</div>
    <div id="fpPanel">${keys.map((k, i) => { const c = D.C[k]; return `<div class="fp-panel rv" id="fp-${k}" role="tabpanel" aria-labelledby="fptab-${k}" data-fp="${k}"${i ? " hidden" : ""}><div class="fp-hotel"><div class="ph">${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:1024px) 100vw, 40vw" })}</div><div class="hb"><h2 style="color:#fff;font-size:1.45rem">${c.hotel}</h2><div class="line"><i class="ph-light ph-map-pin-line"></i>${c.addr}</div><div class="line"><i class="ph-light ph-bed"></i>${c.room}, ${c.board.toLowerCase()}. ${c.bed}.</div><div class="line"><i class="ph-light ph-arrow-right"></i><a href="/italy/${k}">${c.name} packages and guide</a></div></div></div><div class="fp-tiles">${c.tiles.map(t => `<div class="fp-tile"><span class="ti"><i class="ph-light ${t[0]}"></i></span><h3 style="font-size:1.05rem">${t[1]}</h3><p>${t[2]}</p></div>`).join("")}</div></div>`; }).join("")}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap article" style="padding-top:0">
    <div class="prose">
      <h2 id="tax">City tax rates 2026</h2>
      <p>Paid per person, per night, directly to the hotel. Never included in a package price.</p>
      <div class="table-wrap"><table><thead><tr><th>City</th><th>3-star</th><th>4-star</th><th>5-star</th><th>Max nights</th><th>Children exempt</th></tr></thead><tbody><tr><td>Rome</td><td>€6.00</td><td>€7.50</td><td>€10.00</td><td>10</td><td>Under 10</td></tr><tr><td>Florence</td><td>€6.00</td><td>€7.00</td><td>€8.00</td><td>7</td><td>Under 12</td></tr><tr><td>Venice (historic centre)</td><td>€3.50</td><td>€4.50</td><td>€5.00</td><td>5</td><td>Under 10; 10 to 16 half</td></tr><tr><td>Milan (Apr to Dec 2026)</td><td>€7.00</td><td>€10.00</td><td>€12.00</td><td>14</td><td>Under 18</td></tr></tbody></table></div>
      <p>Full tables, exemptions and the Venice access fee are in the <a href="/guides/italy-tourist-tax-2026">Italy tourist tax guide</a>.</p>
      <h2 id="common">Rules that apply at every hotel</h2>
      <ul><li><strong>ID for everyone.</strong> Italian law requires hotels to register every guest, including children, with the police. Bring a passport or government photo ID for each traveller and expect an in-person check at the desk.</li><li><strong>No-shows and same-day cancellations</strong> are charged 100% of the stay.</li><li><strong>Bed types</strong> are requested, never guaranteed. We pass your preference on at booking and again a few days before arrival.</li><li><strong>Extras</strong> such as minibar, parking, late check-out and room upgrades are paid at the hotel.</li><li><strong>Problems</strong> should be raised with the hotel immediately and then with us on WhatsApp. Issues reported after the stay are much harder to resolve.</li></ul>
      <h2 id="ours">Preplan's own fees</h2>
      <p>There are none beyond the package price. Optional add-ons are priced on each package page: airport pickup $38 per person, travel insurance $24 per person, high-speed train tickets $45 per person per leg, room upgrade on request about $40 per room per night. Card payments carry no surcharge.</p>
    </div>
    <aside class="side"><div class="side-card"><h3>Related</h3><ul><li><a href="/terms"><i class="ph-light ph-arrow-right"></i>Terms of booking</a></li><li><a href="/faq"><i class="ph-light ph-arrow-right"></i>Frequently asked questions</a></li><li><a href="/guides/venice-access-fee-2026"><i class="ph-light ph-arrow-right"></i>Venice access fee 2026</a></li><li><a href="/how-it-works"><i class="ph-light ph-arrow-right"></i>How booking works</a></li></ul></div>
    <div class="side-card dark"><h3>Unsure about a rule?</h3><p>Ask before you book. We answer on WhatsApp within the hour during opening times.</p><a class="btn btn-gold btn-sm" href="${wa("Hi Preplan, I have a question about hotel policies.")}" target="_blank" rel="noopener">Ask on WhatsApp<span class="ico"><i class="ph-light ph-whatsapp-logo"></i></span></a></div></aside>
  </div></section>`;
  return H.page({ path: "/fees-and-policies", title: `City Taxes and Hotel Policies, Hotel by Hotel | ${cfg.name}`, desc: "The 2026 city tax at each of our four Italian hotels, deposits, cot charges, breakfast rules, ID requirements and cancellation terms, in plain English.", ogImage: H.abs("/images/og/fees.jpg"), active: "about", guides, body, ld: [bc(crumbs)], scripts: scripts() });
}

/* ---------------- legal ---------------- */
function legal(kind, { guides }) {
  const isTerms = kind === "terms";
  const crumbs = [{ name: "Home", href: "/" }, { name: isTerms ? "Terms of booking" : "Privacy policy" }];
  const terms = `
<p class="lead">These terms apply to every booking made with ${esc(cfg.legalName)} ("Preplan", "we"). By requesting a booking you agree to them. Please read them with the hotel policies shown on the package page, which form part of your contract.</p>
<h2 id="contract">1. Your contract</h2><p>A booking request is not a booking. Your contract begins when we confirm availability in writing and you pay the amount we quote. We act as the retailer for hotels, airlines, cruise lines and tour operators whose own terms also apply; we tell you which ones before you pay.</p>
<h2 id="prices">2. Prices</h2><p>Prices are in US dollars, per person based on two sharing unless stated. Italy hotel packages include the hotel nights and breakfast only. Worldwide packages include the items listed under "What's included" on the package page and nothing else. Local city taxes, resort fees, deposits, cots, extra-guest breakfasts and incidentals are paid by you at the hotel. Prices are confirmed at the time of booking and will not change afterwards except for government-imposed taxes we could not have known about.</p>
<h2 id="payment">3. Payment</h2><p>Italy hotel packages are paid in full at confirmation. Worldwide packages and cruises take a deposit at confirmation, with the balance due by the date on your invoice; if the balance is not paid on time we may cancel the booking and apply the supplier's cancellation charges.</p>
<h2 id="changes">4. Changes by you</h2><p>Tell us as early as possible. Changes are subject to the hotel's or supplier's availability and terms. Hotel Monaco &amp; Grand Canal in Venice does not permit a change of check-in date after booking. Name changes on airline tickets are usually not possible.</p>
<h2 id="cancel">5. Cancellation by you</h2><p>Cancellation must be in writing. Same-day cancellations and no-shows at any hotel are charged 100% of the stay. Earlier cancellation charges depend on the hotel or supplier and are shown to you before you pay. Airline, cruise and tour cancellation terms are stricter than hotels' and are quoted with the price. We strongly recommend travel insurance.</p>
<h2 id="cancelus">6. Changes or cancellation by us</h2><p>Occasionally a hotel or supplier changes or cancels a booking. We will tell you as soon as we know and offer an alternative of equal standard or a full refund of what you paid us for the affected part.</p>
<h2 id="docs">7. Passports, visas and health</h2><p>You are responsible for valid passports, visas, travel authorisations (including the EU Entry/Exit System and, once in force, ETIAS) and any health requirements for every traveller. We provide guidance in good faith but the requirements are set by governments and can change.</p>
<h2 id="hotel">8. At the hotel</h2><p>Hotels are required by Italian law to see identification for every guest. Bed types are requested, not guaranteed. If anything is not as booked, tell the hotel immediately and contact us so we can help while you are there. We cannot investigate issues that were not raised during the stay.</p>
<h2 id="liability">9. Our responsibility</h2><p>We take reasonable care in selecting hotels and suppliers, but we do not own or operate them and are not liable for their acts or omissions beyond the amount you paid us for the affected service, except where the law says otherwise. We are not liable for events outside our control such as strikes, weather, transport disruption or government action.</p>
<h2 id="complaints">10. Complaints</h2><p>Write to ${cfg.email} within 28 days of returning home. We aim to reply within 14 days.</p>
<h2 id="law">11. Law</h2><p>These terms are governed by the laws of the State of ${esc(cfg.address.region)}, United States.</p>`;
  const privacy = `
<p class="lead">This policy explains what personal information ${esc(cfg.legalName)} collects when you use ${cfg.siteUrl.replace(/^https?:\/\//, "")} or book with us, why, and the choices you have.</p>
<h2 id="collect">What we collect</h2><ul><li><strong>Enquiry and booking details</strong> you give us: names, email, phone, travel dates, number and ages of travellers, preferences, and, for bookings, passport details where a hotel, airline or authority requires them.</li><li><strong>Payment details</strong>, processed by our payment provider; we do not store full card numbers.</li><li><strong>Messages</strong> you send us by email, WhatsApp or the contact form.</li><li><strong>Technical data</strong> when you visit the site: pages viewed, browser type, approximate location from your IP address, collected through standard server logs and our hosting provider (Vercel).</li></ul>
<h2 id="use">How we use it</h2><ul><li>To answer enquiries and make, change and manage bookings.</li><li>To pass the details a hotel, airline, cruise line or tour operator needs to provide the service you booked, including the guest registration Italian hotels must complete by law.</li><li>To send booking documents, vouchers and travel updates.</li><li>To send trip ideas by email if you subscribed; every email has an unsubscribe link.</li><li>To keep the website secure and understand which pages are used.</li></ul>
<h2 id="share">Who we share it with</h2><p>Only the suppliers involved in your trip, our payment processor, our email and messaging providers (including WhatsApp, operated by Meta, when you contact us there), and authorities where the law requires. We never sell personal information.</p>
<h2 id="storage">Browser storage</h2><p>The site uses your browser's local storage to remember packages you have saved to your shortlist. This stays on your device and is not sent to us. We do not use advertising cookies. If we add analytics in future we will update this page.</p>
<h2 id="keep">How long we keep it</h2><p>Booking records for seven years for tax and legal reasons; enquiry details for two years; marketing subscriptions until you unsubscribe.</p>
<h2 id="rights">Your choices</h2><p>You can ask us what we hold about you, ask us to correct or delete it, and unsubscribe from marketing at any time by emailing ${cfg.email}. We reply within 30 days.</p>
<h2 id="children">Children</h2><p>We collect children's details only as part of a booking made by an adult.</p>
<h2 id="contact">Contact</h2><p>${esc(cfg.legalName)}, ${esc(cfg.address.street)}, ${esc(cfg.address.city)}, ${esc(cfg.address.region)} ${esc(cfg.address.postal)}. ${cfg.email}.</p>`;
  const body = `
  ${H.pageTop({ crumbs, h1: isTerms ? "Terms of booking" : "Privacy policy", lead: isTerms ? "Short, in plain English, and the same terms we would want to read ourselves." : "What we collect, why, who sees it and how to change your mind.", extra: `<p class="updated">Last updated ${UPDATED}</p>` })}
  <section class="sec legal"><div class="wrap"><div class="prose">${isTerms ? terms : privacy}</div></div></section>`;
  return H.page({ path: `/${kind}`, title: `${isTerms ? "Terms of Booking" : "Privacy Policy"} | ${cfg.name}`, desc: isTerms ? "Preplan Holidays terms of booking: contract, prices, payment, changes, cancellations, passports and visas, hotel rules, liability and complaints." : "What personal information Preplan Holidays collects for enquiries and bookings, how we use and share it, browser storage, retention and your rights.", ogImage: H.abs("/images/og/default.jpg"), active: "about", guides, body, ld: [bc(crumbs)], scripts: scripts() });
}

/* ---------------- 404 ---------------- */
function notFound({ guides }) {
  const body = `<section class="notfound"><div><span class="tag" style="background:rgba(255,255,255,.14);color:#fff"><i class="ph-fill ph-compass" style="color:var(--school-bus-yellow)"></i>404</span><h1 style="margin-top:18px">That page has checked out</h1><p>It may have moved when we rebuilt the site. Try the packages list, or send us a message and we will point you the right way.</p><div class="hero-cta" style="justify-content:center"><a class="btn btn-gold" href="/packages">See all packages<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a><a class="btn btn-glass" href="/">Home<span class="ico"><i class="ph-light ph-house"></i></span></a></div></div></section>`;
  return H.page({ path: "/404", title: `Page not found | ${cfg.name}`, desc: "The page you were looking for could not be found.", noindex: true, active: "", guides, body, scripts: scripts() });
}

module.exports = { about, howItWorks, reviews, faq, contact, fees, legal, notFound };
