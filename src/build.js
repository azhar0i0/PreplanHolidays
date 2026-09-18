#!/usr/bin/env node
// Static site generator for Preplan Holidays.
//   node src/build.js            -> writes every page, sitemap, robots, manifest, vercel.json
//   python tools/images.py og    -> then renders the Open Graph images listed in src/og-manifest.json
const fs = require("fs");
const path = require("path");
const cfg = require("./config");
const D = require("./data");
const H = require("./html");
const GUIDES = require("./content/guides");
const home = require("./pages/home");
const packages = require("./pages/packages");
const dest = require("./pages/destinations");
const guides = require("./pages/guides");
const stat = require("./pages/static");

const ROOT = path.resolve(__dirname, "..");
const ctx = { guides: GUIDES };
const out = [];           // {path, file, lastmod, images[]}
const og = [];            // {out, photo, title, kicker}

function write(urlPath, html, opts = {}) {
  const rel = urlPath === "/" ? "index.html" : urlPath === "/404" ? "404.html" : urlPath.replace(/^\//, "") + (opts.dir ? "/index.html" : ".html");
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
  if (!opts.noindex) out.push({ path: urlPath, file: rel, lastmod: opts.lastmod || TODAY, images: [...html.matchAll(/<img [^>]*src="(\/images\/[^"]+\.jpg)"/g)].map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 12) });
}
const TODAY = new Date().toISOString().slice(0, 10);
const ogItem = (outFile, photo, title, kicker) => og.push({ out: outFile, photo: H.photoUrl(photo, 1600), title, kicker });

/* ---------- clean previous output ---------- */
for (const d of ["packages", "italy", "destinations", "guides"]) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
for (const f of fs.readdirSync(ROOT)) if (/\.html$/.test(f) && f !== "index.html") fs.rmSync(path.join(ROOT, f));

/* ---------- CSS bundle ---------- */
fs.mkdirSync(path.join(ROOT, "assets/css"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "assets/css/site.css"), fs.readFileSync(path.join(__dirname, "css/base.css"), "utf8") + fs.readFileSync(path.join(__dirname, "css/pages.css"), "utf8"));

/* ---------- pages ---------- */
const hashRedirect = `<script>(function(){var h=location.hash||"";var m=h.match(/^#\\/?package\\/([a-z0-9-]+)/i);if(m){location.replace("/packages/"+m[1].toLowerCase());return}if(/^#\\/?packages/i.test(h)){location.replace("/packages")}})();</script>`;
write("/", home(ctx).replace("<meta charset=\"UTF-8\">\n\n", "<meta charset=\"UTF-8\">\n" + hashRedirect + "\n"));
ogItem("default.jpg", "photo-1514890547357-a9ee288728e0", "Italy city breaks, planned before you pack", "Preplan Holidays");

write("/packages", packages.list(ctx), { dir: true });
ogItem("packages.jpg", "photo-1575379972263-2f15a5c78236", "Every vacation package, in one place", `${D.P.length} packages`);
fs.mkdirSync(path.join(ROOT, "images/og/packages"), { recursive: true });
for (const p of D.P) {
  write(`/packages/${p.s}`, packages.detail(p, ctx));
  ogItem(`packages/${p.s}.jpg`, p.im, p.t, p.w ? `${p.dur} · from ${H.priceTxt(p)}` : `${p.nights} nights · from ${H.priceTxt(p)} pp`);
}

write("/destinations", dest.index(ctx), { dir: true });
ogItem("destinations.jpg", "photo-1533105079780-92b9be482077", "Where we can take you", "Destinations");
write("/italy", dest.italy(ctx), { dir: true });
ogItem("italy.jpg", "photo-1552832230-c0197dd311b5", "Italy vacation packages: Rome, Florence, Venice and Milan", "Italy");
write("/italy/multi-city", dest.multiCity(ctx));
ogItem("italy-multi-city.jpg", "photo-1531572753322-ad063cecc140", "Italy multi-city vacation packages by train", "Italy");
for (const k of Object.keys(D.C)) {
  write(`/italy/${k}`, dest.city(k, ctx));
  ogItem(`italy-${k}.jpg`, D.C[k].imgs[0], `${D.C[k].name} vacation packages with hotel and breakfast`, D.C[k].area);
}
for (const k of ["europe", "middleeast", "asia", "caribbean", "americas"]) {
  write(`/destinations/${D.RG_SLUG[k]}`, dest.region(k, ctx));
  ogItem(`region-${D.RG_SLUG[k]}.jpg`, D.P.find(p => p.region === k).im, `${D.RG[k]} vacation packages with flights`, D.RG[k]);
}
write("/cruises", dest.region("cruises", ctx), { dir: true });
ogItem("region-cruises.jpg", D.P.find(p => p.region === "cruises").im, "Cruise packages: Mediterranean, Adriatic and Alaska", "Cruises");

write("/guides", guides.index(ctx), { dir: true });
ogItem("guides.jpg", "photo-1516186366443-0744a82bffef", "Italy travel guides from the planners who book it", "Guides");
fs.mkdirSync(path.join(ROOT, "images/og/guides"), { recursive: true });
for (const g of GUIDES) {
  write(`/guides/${g.slug}`, guides.article(g, ctx), { lastmod: g.modified.slice(0, 10) });
  ogItem(`guides/${g.slug}.jpg`, g.photo, g.title, g.kicker);
}

write("/about", stat.about(ctx)); ogItem("about.jpg", "images/hotels/venice-hotel-monaco-grand-canal-terrace.jpg", "A small team that books Italy the way we'd book it for ourselves", "About");
write("/how-it-works", stat.howItWorks(ctx)); ogItem("how-it-works.jpg", "photo-1541370976299-4d24ebbc9077", "From one message to boarding pass, in five steps", "How it works");
write("/reviews", stat.reviews(ctx)); ogItem("reviews.jpg", "photo-1523906834658-6e24ef2386f9", "What travellers say after the trip", "Reviews");
write("/faq", stat.faq(ctx)); ogItem("faq.jpg", "photo-1605200723310-5df264c13e22", "Questions people ask before they book", "FAQ");
write("/contact", stat.contact(ctx)); ogItem("contact.jpg", "photo-1513581166391-887a96ddeafd", "Tell us where you want to wake up", "Contact");
write("/fees-and-policies", stat.fees(ctx)); ogItem("fees.jpg", "images/hotels/rome-trevi-collection-hotel-lounge.jpg", "City taxes and hotel policies, hotel by hotel", "Fees and policies");
write("/terms", stat.legal("terms", ctx));
write("/privacy", stat.legal("privacy", ctx));
write("/404", stat.notFound(ctx), { noindex: true });

/* ---------- sitemap, robots, manifest, vercel ---------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${out.map(u => `  <url>
    <loc>${H.abs(u.path)}</loc>
    <lastmod>${u.lastmod}</lastmod>
${u.images.map(i => `    <image:image><image:loc>${H.abs(i)}</image:loc></image:image>`).join("\n")}
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${H.abs("/sitemap.xml")}\n`);
fs.writeFileSync(path.join(ROOT, "site.webmanifest"), JSON.stringify({
  name: cfg.name, short_name: "Preplan", description: cfg.description, start_url: "/", display: "standalone", background_color: "#03302e", theme_color: "#06837f",
  icons: [{ src: "/images/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/images/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
}, null, 2));
fs.writeFileSync(path.join(ROOT, "vercel.json"), JSON.stringify({
  "$schema": "https://openapi.vercel.sh/vercel.json",
  cleanUrls: true,
  trailingSlash: false,
  redirects: [
    { source: "/index.html", destination: "/", permanent: true },
    { source: "/package/:slug", destination: "/packages/:slug", permanent: true },
    { source: "/destinations/italy", destination: "/italy", permanent: true },
    { source: "/destinations/cruises", destination: "/cruises", permanent: true }
  ],
  headers: [
    { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/images/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    { source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }
    ] }
  ]
}, null, 2));
fs.writeFileSync(path.join(__dirname, "og-manifest.json"), JSON.stringify(og, null, 1));

console.log(`Built ${out.length + 1} pages, ${og.length} OG images queued.`);
