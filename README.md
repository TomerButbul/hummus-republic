# Hummus Republic — website rebuild

A from-scratch redesign of [thehummusrepublic.com](https://thehummusrepublic.com), rebuilt as a fast, hand-coded static site that takes **all** the functionality of the original Framer site and elevates it to match the **Hummus Republic brand book** (Caramba Agency) and the craft level of the sister *nüdes* build.

Same engineering approach as nüdes: vanilla HTML/CSS/JS, no framework, no build step, deploys to Netlify.

## Pages
| File | Purpose |
|---|---|
| `index.html` | Home — hero, categories, build-your-own, signature bowls, reviews ticker, rewards, catering, locations teaser |
| `menu.html` | Full menu with sticky category scrollspy (data-driven) |
| `locations.html` | Interactive map + searchable list of all 54 locations |
| `location.html` | Single-location detail (`location.html?id=burbank-ca`) — hours, ordering, map, reviews |
| `about.html` | Our Story — the "Mediterranean Chipotle" positioning + brand values |
| `rewards.html` | Rewards / app — "Get a free bowl", points ladder, FAQ |
| `franchise.html` · `careers.html` · `contact.html` | Secondary pages (contact form is a working client-side demo) |
| `privacy.html` · `terms.html` · `accessibility.html` | Legal stubs (replace copy before launch) |

## Architecture
- **`hummus.css`** — the whole design system: brand tokens (exact brand-book hex), components, motion. One stylesheet, every page.
- **`hummus.js`** — shared interactions + injects the nav/footer **chrome** on every page (one source of truth for links). Also renders the **review ticker**, the **Leaflet map**, the **location detail** and the **menu**.
- **`data.js`** — single source of truth for **locations, reviews and menu** (`window.HR`). The map, ticker and menu all read from here.

## Brand
- **Color** (brand book): forest `#1C392F`, cream `#FEFBFA`, sand `#EBE2D9`, terracotta `#A8634E`, golden `#F6CA75`, espresso `#271214`.
- **Type:** body is **Switzer** (the brand's body face, loaded free from Fontshare). Headlines are **Dunbar Low Bold** (the brand's title face). Dunbar is a licensed font, so it falls back to **Clash Display** (a premium free geometric display) until you drop the licensed files into `/fonts/DunbarLow-Bold.woff2` — then it upgrades automatically. (Same pattern nüdes used for BC Novatica.)
- **Logo:** the chickpea/garbanzo mark is inline SVG (see `hummus.js` `MARK`) + the stacked "HUMMUS® REPUBLIC" wordmark.

## Mock data (looks/behaves exactly like the live site)
- **Map** — built with **Leaflet + CARTO/OpenStreetMap tiles** (no Google Maps API key needed, no cost). All 54 locations with real addresses; coordinates are approximate. Pins, popups, search-by-city/ZIP, "use my location" and list↔map sync all work.
- **Review ticker** — auto-scrolling, pause-on-hover. The Burbank reviews are verbatim from the live site; the rest are representative.
- **Photography** — the real Hummus Republic photos, **extracted from the brand book PDF** (`pdfimages`) and optimized into `images/` (resized + recompressed + converted to **sRGB** so browsers render the brand colors correctly). Used across the hero (the brand billboard), category tiles, signature bowls, full-bleed bands, the about page and most menu items. A handful of menu items with no brand equivalent (drinks, fries, some sandwiches) keep warm Unsplash shots for variety — swap those via the `HR.P` tokens in `data.js`.

## Real links preserved (verbatim from the live site)
Online ordering (`order.thehummusrepublic.com`), catering (`catering.thehummusrepublic.com`), gift cards (`hummusrepublic.securetree.com`), the Nutrition & Allergens PDF, the iOS + Android apps, and Instagram / Facebook / TikTok. All centralized in `HR.links` (`data.js`).

## Run locally
No build step — serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 4555
```

Then open `http://localhost:4555`. (A tiny Node preview server lives at `.claude/serve.cjs`.)

## Deploy
Push to a Git repo and connect to Netlify, or drag the folder into Netlify Drop. `netlify.toml` is already configured (publish = `.`).

## Improvements over the original
- Full **mobile navigation** (the live site had no working mobile menu).
- Brand-book aesthetic instead of the generic bright-green QSR look.
- Reviews surfaced on the home page (not just buried on location pages).
- Cinematic intro, scroll reveals, magnetic buttons, custom cursor, reduced-motion support.
- No leftover CMS placeholder text.
