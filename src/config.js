// Site-wide settings. Change here, then run `npm run build`.
module.exports = {
  // Canonical origin, no trailing slash. Every canonical URL, sitemap entry and
  // Open Graph URL is built from this. Point preplanholidays.com at Vercel, or
  // change this to the URL you actually serve the site from.
  siteUrl: "https://preplanholidays.com",
  name: "Preplan Holidays",
  legalName: "Preplan Holidays",
  tagline: "Italy city breaks and worldwide holidays, planned properly",
  description: "Prepaid hotel-and-breakfast city breaks in Rome, Florence, Venice and Milan, plus flight-inclusive holidays worldwide. One message, one price, every fee explained upfront.",
  phone: "+1 (212) 555-0147",
  phoneHref: "+12125550147",
  whatsapp: "12125550147",
  email: "hello@preplanholidays.com",
  address: {
    street: "221 Harbour Street, Suite 4",
    city: "New York",
    region: "NY",
    postal: "10001",
    country: "US"
  },
  hours: "Mon to Sun, 9am to 9pm ET",
  openingHoursSpec: [{ days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "09:00", closes: "21:00" }],
  social: {
    instagram: "https://www.instagram.com/preplanholidays",
    facebook: "https://www.facebook.com/preplanholidays",
    tiktok: "https://www.tiktok.com/@preplanholidays",
    youtube: "https://www.youtube.com/@preplanholidays"
  },
  // Optional: a form endpoint (Formspree, Web3Forms, your own API). When empty,
  // the enquiry and booking forms hand the message over to WhatsApp instead.
  formEndpoint: "",
  currency: "USD",
  locale: "en-US",
  founded: "2019",
  // Used for Article schema and the "reviewed by" line on guides.
  author: { name: "The Preplan Holidays planning team", url: "/about" },
  // Increment when you want browsers to re-fetch CSS/JS immediately.
  assetVersion: "20260919"
};
