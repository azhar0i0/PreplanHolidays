const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const { PPH } = require("./packages");
const { esc, money, img, wa } = H;

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
    <div class="hotels">${Object.values(D.C).map((c, i) => `<div class="hotel rv" style="--d:${i * 80}"><div class="hp">${img(c.hp[0], { alt: `${c.hotel}, ${c.name}`, sizes: "(max-width:767px) 100vw, 170px" })}</div><div class="hi"><h3>${c.hotel}</h3><div class="row"><i class="ph-light ph-map-pin-line"></i>${c.addr}</div><div class="row"><i class="ph-light ph-bed"></i>${c.room}, ${c.board.toLowerCase()}</div><div class="row"><i class="ph-light ph-arrow-right"></i><a href="/packages/${D.P.find(p => !p.w && p.c.length === 1 && p.c[0] === c.slug).s}">See the ${c.name} package</a></div></div></div>`).join("")}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="prose" style="max-width:none">
    <h2 id="details">Company details</h2>
    <p>${esc(cfg.legalName)}, ${esc(cfg.address.street)}, ${esc(cfg.address.city)}, ${esc(cfg.address.region)} ${esc(cfg.address.postal)}, ${esc(cfg.address.country)}. Phone <a href="tel:${cfg.phoneHref}">${cfg.phone}</a>, email <a href="mailto:${cfg.email}">${cfg.email}</a>. Office hours ${esc(cfg.hours)}. Our <a href="/terms">terms of booking</a> and <a href="/privacy">privacy policy</a> apply to every booking.</p>
    <p class="muted" style="font-size:.9rem">Destination photography on this site is by photographers on Unsplash, used under the Unsplash License; hotel photography is supplied by the hotels.</p>
  </div></div></section>
  ${H.cta({ h: "Say hello", p: "Tell us where you want to wake up and we will take it from there." })}`;
  return H.page({ path: "/about", title: `About Preplan Holidays: Italy City Break Specialists Since ${cfg.founded}`, desc: `A small ${cfg.address.city} travel agency booking prepaid hotel-and-breakfast city breaks in Rome, Florence, Venice and Milan, plus holidays worldwide. Meet the team.`, ogImage: H.abs("/images/og/about.jpg"), active: "about", guides, body, ld: [bc(crumbs), { "@type": "AboutPage", name: "About Preplan Holidays", url: H.abs("/about"), mainEntity: { "@id": H.ORG_ID } }], scripts: scripts() });
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

module.exports = { about, contact, legal, notFound };
