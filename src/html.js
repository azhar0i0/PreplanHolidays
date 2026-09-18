// Shared layout, components and structured-data helpers.
const cfg = require("./config");
const D = require("./data");

const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = esc;
const abs = p => cfg.siteUrl + (p.startsWith("/") ? p : "/" + p);
const money = n => "$" + Math.round(n).toLocaleString("en-US");
const priceTxt = p => p.quote ? "On request" : money(p.price);
const cityNames = p => p.w ? p.country : p.c.map(k => D.C[k].name).join(", ");
const pkgUrl = p => `/packages/${p.s}`;
const truncate = (s, n) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
const json = o => JSON.stringify(o).replace(/</g, "\\u003c");


/* ---------------- responsive self-hosted images ---------------- */
let PHOTOS = {}, META = {};
try { PHOTOS = require("./photos.json"); } catch (e) {}
try { META = require("./photos-meta.json"); } catch (e) {}
// Returns {src, srcset, w, h, alt} for an Unsplash id or a local path.
function photo(id, fallbackAlt = "") {
  if (id.startsWith("images/") || id.startsWith("/images/")) {
    const base = id.replace(/^\//, "").replace(/\.jpg$/, "");
    const name = base.split("/").pop();
    const dir = base.slice(0, base.length - name.length);
    return { src: "/" + base + ".jpg", srcset: SIZES.map(s => `/${dir}${name}-${s}.webp ${s}w`).join(", "), alt: fallbackAlt, local: true };
  }
  const m = META[id], p = PHOTOS[id];
  if (m) return { src: `/images/photos/${m.file}.jpg`, srcset: SIZES.map(s => `/images/photos/${m.file}-${s}.webp ${s}w`).join(", "), w: m.w, h: m.h, alt: (p && p.alt) || fallbackAlt, local: true };
  return { src: D.IMG(id, 1600), srcset: SIZES.map(s => `${D.IMG(id, s)} ${s}w`).join(", "), alt: fallbackAlt, local: false };
}
const SIZES = [1600, 960, 480];
function img(id, { alt = "", sizes = "100vw", cls = "", w = 1600, h = 1067, lazy = true, priority = false, extra = "" } = {}) {
  const ph = photo(id, alt);
  return `<img src="${ph.src}" srcset="${ph.srcset}" sizes="${sizes}" alt="${attr(alt || ph.alt)}" width="${ph.w || w}" height="${ph.h || h}"${cls ? ` class="${cls}"` : ""}${priority ? ' fetchpriority="high" decoding="async"' : lazy ? ' loading="lazy" decoding="async"' : ""}${extra}>`;
}
const photoUrl = (id, size = 1600) => { const ph = photo(id); return ph.local ? (size === 1600 ? ph.src : ph.src.replace(/\.jpg$/, `-${size}.webp`)) : D.IMG(id, size); };

/* ---------------- structured data ---------------- */
const ORG_ID = abs("/#organization");
const orgLd = () => ({
  "@type": ["TravelAgency", "Organization"],
  "@id": ORG_ID,
  name: cfg.name,
  legalName: cfg.legalName,
  url: cfg.siteUrl + "/",
  logo: { "@type": "ImageObject", url: abs("/images/logo-light.png"), width: 612, height: 181 },
  image: abs("/images/og/default.jpg"),
  description: cfg.description,
  telephone: cfg.phoneHref,
  email: cfg.email,
  foundingDate: cfg.founded,
  priceRange: "$$",
  currenciesAccepted: "USD",
  address: { "@type": "PostalAddress", streetAddress: cfg.address.street, addressLocality: cfg.address.city, addressRegion: cfg.address.region, postalCode: cfg.address.postal, addressCountry: cfg.address.country },
  areaServed: [{ "@type": "Country", name: "Italy" }, { "@type": "Country", name: "United States" }],
  openingHoursSpecification: cfg.openingHoursSpec.map(o => ({ "@type": "OpeningHoursSpecification", dayOfWeek: o.days, opens: o.opens, closes: o.closes })),
  contactPoint: [{ "@type": "ContactPoint", telephone: cfg.phoneHref, contactType: "customer service", email: cfg.email, availableLanguage: ["English"], areaServed: "US" }],
  sameAs: Object.values(cfg.social)
});
const websiteLd = () => ({ "@type": "WebSite", "@id": abs("/#website"), url: cfg.siteUrl + "/", name: cfg.name, publisher: { "@id": ORG_ID }, inLanguage: "en-US" });
const breadcrumbLd = items => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, ...(it.href ? { item: abs(it.href) } : {}) }))
});
const faqLd = qas => ({ "@type": "FAQPage", mainEntity: qas.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const wrapLd = (...graph) => `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph.filter(Boolean) })}</script>`;

/* ---------------- head ---------------- */
function head({ path, title, desc, ogImage, ogType = "website", ld = [], preload = "", noindex = false, article, extraHead = "" }) {
  const canonical = abs(path);
  const og = ogImage || abs("/images/og/default.jpg");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${extraHead}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
${noindex ? "" : `<link rel="canonical" href="${canonical}">`}
<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<meta name="theme-color" content="#06837f">
<meta name="author" content="${attr(cfg.name)}">
<meta property="og:site_name" content="${attr(cfg.name)}">
<meta property="og:type" content="${ogType}">
${noindex ? "" : `<meta property="og:url" content="${canonical}">`}
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
${article ? `<meta property="article:published_time" content="${article.published}">\n<meta property="article:modified_time" content="${article.modified}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/svg+xml" href="/images/icon.svg">
<link rel="icon" type="image/png" sizes="64x64" href="/images/favicon.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
${preload}
<link rel="stylesheet" href="/assets/css/site.css?v=${cfg.assetVersion}">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/bold/style.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/bold/style.css"></noscript>
${wrapLd(orgLd(), websiteLd(), ...ld)}
</head>`;
}

/* ---------------- nav + footer ---------------- */
const NAV = [
  ["/", "Home", "home"],
  ["/packages", "Packages", "packages"],
  ["/destinations", "Destinations", "destinations"],
  ["/guides", "Guides", "guides"],
  ["/about", "About", "about"],
  ["/contact", "Contact", "contact"]
];
const wa = (text) => `https://wa.me/${cfg.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

function nav(active) {
  const links = NAV.map(([h, l, k]) => `<a class="nav-link${k === active ? " on" : ""}" href="${h}"${k === active ? ' aria-current="page"' : ""}>${l}</a>`).join("\n      ");
  const mlinks = NAV.map(([h, l, k]) => `<a href="${h}"${k === active ? ' aria-current="page"' : ""}>${l}<i class="ph-light ph-arrow-right"></i></a>`).join("\n    ");
  return `<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
<header class="nav" id="nav">
  <div class="nav-in">
    <a href="/" class="island brand logo" aria-label="${attr(cfg.name)} home">
      <img class="logo-img logo-on-dark" src="/images/logo-light.png" alt="${attr(cfg.name)}" width="612" height="181">
      <img class="logo-img logo-on-light" src="/images/logo.svg" alt="" width="1223" height="361">
    </a>
    <nav class="island links" aria-label="Primary">
      <span class="nav-pill"></span>
      ${links}
    </nav>
    <div class="island acts">
      <a class="wa" href="${wa()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="ph-light ph-whatsapp-logo"></i></a>
      <a class="btn btn-gold btn-sm" href="/contact">Plan my trip<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mmenu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu" aria-hidden="true">
  <nav aria-label="Mobile">
    ${mlinks}
  </nav>
  <div class="mfoot">
    <div class="row">
      <a class="chip" href="tel:${cfg.phoneHref}"><i class="ph-light ph-phone"></i>${cfg.phone}</a>
      <a class="chip" href="${wa()}" target="_blank" rel="noopener"><i class="ph-light ph-whatsapp-logo"></i>WhatsApp</a>
    </div>
    <a class="chip" href="mailto:${cfg.email}"><i class="ph-light ph-envelope-simple"></i>${cfg.email}</a>
  </div>
</div>
<div class="sheet-bg" id="sheetBg"></div>`;
}

function footer(guides) {
  const cities = Object.values(D.C).map(c => `<li><a href="/italy/${c.slug}">${c.name} vacation packages</a></li>`).join("");
  const regions = ["europe", "middleeast", "asia", "caribbean", "americas"].map(k => `<li><a href="/destinations/${D.RG_SLUG[k]}">${D.RG[k]}</a></li>`).join("");
  const g = (guides || []).slice(0, 5).map(x => `<li><a href="/guides/${x.slug}">${esc(x.short || x.title)}</a></li>`).join("");
  const soc = Object.entries(cfg.social).map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener me" aria-label="${k[0].toUpperCase() + k.slice(1)}"><i class="ph-light ph-${k}-logo"></i></a>`).join("");
  return `<footer class="foot">
  <div class="wrap">
    <div class="foot-cta">
      <h2 class="rv">Where are you <span>waking up</span> next?</h2>
      <a class="btn btn-gold rv" style="--d:120" href="/contact">Plan my trip<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a>
    </div>
    <div class="foot-cols">
      <div class="rv">
        <a href="/" class="logo" aria-label="${attr(cfg.name)} home"><img class="logo-img" src="/images/logo-light.png" alt="${attr(cfg.name)}" width="612" height="181" loading="lazy"></a>
        <p class="foot-about">Italian city breaks with central hotels, breakfast and every local fee explained before you pay. Flight-inclusive holidays and cruises worldwide.</p>
        <form class="news" id="news" action="/contact" method="get"><input type="email" name="email" placeholder="Get trip ideas by email" aria-label="Email address" required><button type="submit">Subscribe</button></form>
      </div>
      <div class="rv" style="--d:80"><h4>Italy</h4><ul><li><a href="/italy">Italy vacation packages</a></li>${cities}<li><a href="/italy/multi-city">Multi-city trips by train</a></li><li><a href="/fees-and-policies">City taxes and hotel policies</a></li></ul></div>
      <div class="rv" style="--d:160"><h4>Worldwide</h4><ul><li><a href="/packages">All packages</a></li>${regions}<li><a href="/cruises">Cruises</a></li></ul></div>
      <div class="rv" style="--d:240"><h4>Company</h4><ul>
        <li><a href="/about">About us</a></li><li><a href="/how-it-works">How it works</a></li><li><a href="/reviews">Reviews</a></li><li><a href="/guides">Travel guides</a></li><li><a href="/faq">FAQ</a></li><li><a href="/contact">Contact</a></li><li><a href="/terms">Terms of booking</a></li><li><a href="/privacy">Privacy policy</a></li>
      </ul></div>
    </div>
  </div>
  <div class="foot-word" id="footWord" aria-hidden="true">${[..."Preplan"].map((l, i) => `<span style="--i:${i}">${l}</span>`).join("")}</div>
  <div class="wrap">
    <div class="foot-bot">
      <span>© <span id="yr">${new Date().getFullYear()}</span> ${cfg.name}. All rights reserved.</span>
      <address class="foot-addr">${esc(cfg.address.street)}, ${esc(cfg.address.city)}, ${esc(cfg.address.region)} ${esc(cfg.address.postal)} · <a href="tel:${cfg.phoneHref}">${cfg.phone}</a> · <a href="mailto:${cfg.email}">${cfg.email}</a></address>
      <div class="soc">${soc}<a href="${wa()}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph-light ph-whatsapp-logo"></i></a></div>
    </div>
  </div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"><i class="ph-bold ph-check"></i><span></span></div>
<script src="/assets/js/site.js?v=${cfg.assetVersion}" defer></script>`;
}

function page(opts) {
  const { body, active, guides, bodyClass = "", scripts = "" } = opts;
  return `${head(opts)}
<body class="${bodyClass}">
${nav(active)}
<main id="main">
${body}
</main>
${footer(guides)}
${scripts}
</body>
</html>
`;
}

/* ---------------- components ---------------- */
function crumbs(items) {
  return `<nav class="crumbs rv" aria-label="Breadcrumb"><ol>${items.map((it, i) => it.href && i < items.length - 1 ? `<li><a href="${it.href}">${esc(it.name)}</a></li>` : `<li aria-current="page">${esc(it.name)}</li>`).join('<li aria-hidden="true"><i class="ph-light ph-caret-right"></i></li>')}</ol></nav>`;
}

function pageTop({ crumbs: cr, h1, lead, extra = "", tag = "" }) {
  return `<div class="page-top">
  <div class="wrap">
    ${cr ? crumbs(cr) : ""}
    ${tag}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead rv" style="--d:200">${lead}</p>` : ""}
    ${extra}
  </div>
</div>`;
}

function card(p, i = 0, anim = "rv", extraClass = "") {
  const cities = cityNames(p);
  const alt = photo(p.im).alt || `${p.t}, ${cities}`;
  const m1 = p.w ? (p.region === "cruises" ? `<span><i class="ph-light ph-boat"></i>${esc(p.ship)}</span>` : p.tags.includes("plane") ? `<span><i class="ph-light ph-airplane-tilt"></i>Flights included</span>` : `<span><i class="ph-light ph-map-trifold"></i>Land only</span>`) : `<span><i class="ph-light ph-coffee"></i>Breakfast</span>`;
  const m2 = p.w ? (p.region === "cruises" ? "" : `<span class="rm"><i class="ph-light ph-globe-hemisphere-east"></i>${D.RG[p.region]}</span>`) : `<span class="rm"><i class="ph-light ph-buildings"></i>${p.c.length} hotel${p.c.length > 1 ? "s" : ""}</span>`;
  const cat = p.w ? (p.region === "cruises" ? "cruise" : "world") : (p.multi ? "multi" : "single");
  const search = [p.t, p.w ? `${p.route} ${p.country} ${p.ship || ""} ${D.RG[p.region]}` : p.c.map(k => D.C[k].name + " " + D.C[k].hotel).join(" ") + " Italy"].join(" ").replace(/\s+/g, " ").trim().toLowerCase();
  return `<article class="card ${anim} ${extraClass}" style="--i:${i};--d:${(i % 4) * 90}" data-cat="${cat}" data-region="${p.region}" data-cities="${p.c.join(" ")}" data-nights="${p.nights}" data-price="${p.price}" data-multi="${p.multi ? 1 : 0}" data-slug="${p.s}" data-search="${attr(search)}">
  <div class="card-in"><div class="card-img">${img(p.im, { alt, sizes: "(max-width:767px) 50vw, (max-width:1180px) 33vw, 300px" })}
  <span class="nights"><i class="ph-fill ph-moon-stars"></i>${p.dur || p.nights + " nights"}</span>
  ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
  <button type="button" class="fav" data-fav="${p.s}" aria-label="Save ${attr(p.t)} to shortlist" aria-pressed="false"><i class="ph-light ph-heart"></i></button></div>
  <div class="card-body"><span class="card-city"><i class="ph-light ph-map-pin"></i>${esc(cities)}</span><h3><a class="card-link" href="${pkgUrl(p)}">${esc(p.t)}</a></h3>
  <div class="card-meta">${m1}${m2}</div>
  <div class="card-foot"><div class="price"><small>${p.quote ? "Price" : "From"}</small><b>${priceTxt(p)}<span>${p.quote ? " for your dates" : " /person"}</span></b></div></div>
  <span class="go-cta" aria-hidden="true">See details<i class="ph-bold ph-arrow-right"></i></span></div></div></article>`;
}

const grid = (list, anim = "rv") => `<div class="grid4">${list.map((p, i) => card(p, i, anim)).join("\n")}</div>`;

function faqBlock(items, { open = 0, id = "faqList" } = {}) {
  return `<div class="acc" id="${id}">${items.map((f, i) => {
    const [cat, q, a] = f.length === 3 ? f : ["all", f[0], f[1]];
    return `<div class="qa${i === open ? " open" : ""}" data-c="${cat}"><h3 class="qa-h"><button class="qa-q" aria-expanded="${i === open}"><span>${esc(q)}</span><span class="qa-plus" aria-hidden="true"></span></button></h3><div class="qa-a"><div><p>${a}</p></div></div></div>`;
  }).join("\n")}</div>`;
}

function cta({ h = "Ready when you are", p = "Tell us the rough idea and we send back a priced plan within one working day.", text } = {}) {
  return `<section class="sec" style="padding-top:0"><div class="wrap"><div class="cstrip rv scale">
    <div style="position:relative;z-index:1"><h2>${h}</h2><p>${p}</p></div>
    <div class="cbtns">
      <a class="cbtn" href="tel:${cfg.phoneHref}"><i class="ph-light ph-phone-call"></i>Call</a>
      <a class="cbtn" href="${wa(text || "Hi Preplan, I'd like help planning a trip.")}" target="_blank" rel="noopener"><i class="ph-light ph-whatsapp-logo"></i>WhatsApp</a>
      <a class="cbtn" href="mailto:${cfg.email}"><i class="ph-light ph-envelope-simple"></i>Email</a>
      <a class="cbtn" href="/contact"><i class="ph-light ph-phone-incoming"></i>Callback</a>
    </div>
  </div></div></section>`;
}

function reviewCard(r) {
  const initials = r.n.split(/\s+/).filter(x => /^[A-Za-zÀ-ÿ]/.test(x)).map(x => x[0]).slice(0, 2).join("").toUpperCase();
  return `<article class="qcard"><i class="ph-fill ph-quotes qi" aria-hidden="true"></i><div class="stars" style="margin-top:6px" aria-label="5 out of 5 stars"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div><blockquote><p>“${esc(r.q)}”</p></blockquote><div class="who"><span class="avatar" aria-hidden="true">${initials}</span><div><b>${esc(r.n)}</b><span>${esc(r.w)}</span></div><a class="trip" href="${pkgUrl(D.bySlug[r.pkg])}"><i class="ph-light ph-airplane-tilt"></i>${esc(r.trip)}</a></div></article>`;
}

module.exports = { photo, img, photoUrl, esc, attr, abs, money, priceTxt, cityNames, pkgUrl, truncate, json, head, nav, footer, page, crumbs, pageTop, card, grid, faqBlock, cta, reviewCard, wa, orgLd, websiteLd, breadcrumbLd, faqLd, wrapLd, ORG_ID };
