const cfg = require("../config");
const D = require("../data");
const H = require("../html");
const { PPH } = require("./packages");
const { esc, img, grid } = H;

const fmtDate = iso => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" });

function gcard(g, i = 0, feature = false) {
  return `<a class="gcard rv${feature ? " feature" : ""}" style="--d:${(i % 3) * 90}" href="/guides/${g.slug}">${img(g.photo, { alt: g.imageAlt, sizes: feature ? "(max-width:767px) 100vw, 55vw" : "(max-width:767px) 100vw, 33vw" })}<div class="gb"><span class="kicker">${esc(g.kicker)}</span>${feature ? `<h2>${esc(g.title)}</h2>` : `<h3>${esc(g.title)}</h3>`}<p>${esc(g.excerpt)}</p><span class="rt"><i class="ph-light ph-clock"></i>${g.readTime} min read · Updated ${fmtDate(g.modified)}</span></div></a>`;
}

function index({ guides }) {
  const body = `
  ${H.pageTop({ crumbs: [{ name: "Home", href: "/" }, { name: "Guides" }], h1: "Italy travel guides from the planners who book it", lead: "Tourist taxes, train times, how many nights each city deserves, what a trip really costs. Practical, checked against official sources, and updated when the rules change." })}
  <section class="sec"><div class="wrap"><div class="glist">${guides.map((g, i) => gcard(g, i, i === 0)).join("")}</div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="pk-head"><h2 class="h2 rv">Put the reading to use</h2><a class="link-arrow rv" href="/italy">All Italy packages<i class="ph-bold ph-arrow-right"></i></a></div>${grid(["italy-big-three", "rome-trevi-three-nights", "venice-grand-canal", "grand-italian-four"].map(s => D.bySlug[s]))}</div></section>`;
  return H.page({ path: "/guides", title: `Italy Travel Guides: Tourist Tax, Trains, Itineraries | ${cfg.name}`, desc: "Practical Italy guides: 2026 tourist tax rates for Rome, Florence, Venice and Milan, train times and fares, 7 and 10-day itineraries and trip costs.", ogImage: H.abs("/images/og/guides.jpg"), active: "guides", guides, body, ld: [H.breadcrumbLd([{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }]), { "@type": "CollectionPage", name: "Travel guides", url: H.abs("/guides"), hasPart: guides.map(g => ({ "@type": "Article", headline: g.title, url: H.abs(`/guides/${g.slug}`) })) }], scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

function article(g, { guides }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: g.short }];
  const toc = [...g.body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  const related = g.related.map(s => D.bySlug[s]).filter(Boolean);
  const others = guides.filter(x => x.slug !== g.slug).slice(0, 4);
  const body = `
  <article>
  <div class="page-top hasimg"><div class="hero-media">${img(g.photo, { alt: g.imageAlt, sizes: "100vw", lazy: false, priority: true })}</div>
    <div class="wrap">${H.crumbs(crumbs)}<span class="tag rv"><i class="ph-fill ph-book-open"></i>${esc(g.kicker)}</span><h1>${esc(g.title)}</h1>
    <div class="byline"><span class="avatar" aria-hidden="true">PH</span><span>By <b>${esc(cfg.author.name)}</b> · <time datetime="${g.published}">Published ${fmtDate(g.published)}</time>${g.modified !== g.published ? ` · <time datetime="${g.modified}">Updated ${fmtDate(g.modified)}</time>` : ""} · ${g.readTime} min read</span></div></div></div>
  <div class="wrap article">
    <div class="prose">${g.body}
      ${related.length ? `<h2 id="related">Packages mentioned in this guide</h2><div class="pkgs">${grid(related)}</div>` : ""}
      <p class="callout"><i class="ph-light ph-shield-check"></i><span><b>How we check this</b>Prices, tax rates and opening rules are verified against the official city, operator and ticketing sites before publishing and reviewed at least every season. If something has changed since ${fmtDate(g.modified)}, <a href="/contact">tell us</a> and we will fix it.</span></p>
    </div>
    <aside class="side">
      ${toc.length ? `<div class="side-card"><h3>On this page</h3><ul class="toc">${toc.map(x => `<li><a href="#${x[1]}">${x[2].replace(/&amp;/g, "&")}</a></li>`).join("")}</ul></div>` : ""}
      <div class="side-card dark"><h3>Skip the spreadsheet</h3><p>Every Preplan package comes with the taxes, trains and reservations in this guide already written into your plan.</p><a class="btn btn-gold btn-sm" href="/italy">See Italy packages<span class="ico"><i class="ph-bold ph-arrow-right"></i></span></a></div>
      <div class="side-card"><h3>More guides</h3><ul>${others.map(x => `<li><a href="/guides/${x.slug}"><i class="ph-light ph-arrow-right"></i>${esc(x.short)}</a></li>`).join("")}</ul></div>
    </aside>
  </div>
  </article>
  ${H.cta({ h: "Questions this guide didn't answer?", p: "Ask a planner. We reply on WhatsApp within the hour during opening times.", text: `Hi Preplan, I have a question after reading your guide: ${g.title}` })}`;
  const ld = [H.breadcrumbLd(crumbs), {
    "@type": "Article", "@id": H.abs(`/guides/${g.slug}#article`), headline: g.title, description: g.excerpt, image: [H.abs(H.photoUrl(g.photo, 1600))], datePublished: g.published, dateModified: g.modified,
    author: { "@type": "Organization", name: cfg.author.name, url: H.abs(cfg.author.url) }, publisher: { "@id": H.ORG_ID }, mainEntityOfPage: H.abs(`/guides/${g.slug}`), inLanguage: "en-US", articleSection: g.kicker
  }];
  return H.page({ path: `/guides/${g.slug}`, title: g.title, desc: g.excerpt, ogImage: H.abs(`/images/og/guides/${g.slug}.jpg`), ogType: "article", article: { published: g.published, modified: g.modified }, active: "guides", guides, body, ld, preload: `<link rel="preload" as="image" href="${H.photoUrl(g.photo, 1600)}" imagesrcset="${H.photo(g.photo).srcset}" imagesizes="100vw" fetchpriority="high">`, scripts: `<script>window.PPH=${H.json(PPH())}</script>` });
}

module.exports = { index, article, gcard };
