# Preplan Holidays website

Static, multi-page site generated from a small Node build. Every page is a real HTML file with its own title, description, canonical URL, Open Graph image and JSON-LD structured data.

## Editing

| What you want to change | Where |
|---|---|
| Phone, email, address, social links, site domain, form endpoint | `src/config.js` |
| Packages, hotels, prices, reviews, FAQs | `src/data.js` |
| Rome / Florence / Venice / Milan hub text and FAQs | `src/content/cities.js` |
| Italy, multi-city, region and cruise hub text | `src/content/regions.js` |
| Guides (blog articles) | `src/content/guides.js` |
| Page templates | `src/pages/*.js`, shared layout in `src/html.js` |
| Styles | `src/css/base.css` and `src/css/pages.css` (bundled to `assets/css/site.css`) |
| Client-side behaviour | `assets/js/site.js` |
| Stock photo names and alt text | `src/photos.json` |

## Building

```
npm run build        # node src/build.js + Open Graph images
npm run images       # download/regenerate photo renditions, icons and OG images
python tools/serve.py 3111   # local preview with clean URLs at http://127.0.0.1:3111
```

Commit the generated output (HTML, `assets/`, `images/`, `sitemap.xml`, `robots.txt`, `vercel.json`) together with the source. Vercel serves the files as-is; `src/` and `tools/` are excluded by `.vercelignore`.

## URL structure

- `/` home
- `/packages` listing, `/packages/<slug>` one page per package
- `/italy`, `/italy/rome`, `/italy/florence`, `/italy/venice`, `/italy/milan`, `/italy/multi-city`
- `/destinations`, `/destinations/europe`, `/destinations/middle-east`, `/destinations/asia`, `/destinations/caribbean`, `/destinations/americas`, `/cruises`
- `/guides`, `/guides/<slug>`
- `/about`, `/how-it-works`, `/reviews`, `/faq`, `/contact`, `/fees-and-policies`, `/terms`, `/privacy`
- Old hash URLs (`/#/package/<slug>`) redirect client-side from the home page.

## Forms

With `formEndpoint` empty in `src/config.js`, the enquiry, booking and newsletter forms open WhatsApp with the message pre-filled. Set `formEndpoint` to a Formspree, Web3Forms or custom URL that accepts a JSON POST to receive submissions by email instead.

## After deploying

1. Point `preplanholidays.com` at Vercel (or change `siteUrl` in `src/config.js` and rebuild).
2. Add the property in Google Search Console and submit `https://preplanholidays.com/sitemap.xml`.
3. Run one page of each type through Google's Rich Results Test.
4. Bump `assetVersion` in `src/config.js` whenever `site.css` or `site.js` changes.
