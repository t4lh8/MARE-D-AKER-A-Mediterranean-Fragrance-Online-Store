# 🌊 MARE D'AKER - A Mediterranean Fragrance Universe

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build-none-2E7D5B)
![Python](https://img.shields.io/badge/tooling-Python%20%2B%20Pillow-3776AB?logo=python&logoColor=white)

A fully functional **perfume e-commerce storefront** for a fictional Mediterranean
fragrance brand - product catalogue, filtering and search, product pages, a cart, and
a complete **checkout flow** with form and card validation. Built from scratch in
**vanilla JavaScript** (no framework, no build step), so it runs anywhere you can host
static files.

**🛍️ Live demo:** https://t4lh8.github.io/MARE-D-AKER-A-Mediterranean-Fragrance-Online-Store/

![Home](assets/home.png)

> ⚠️ **Portfolio demo store - no real payment is processed.** The checkout accepts the
> test card `4242 4242 4242 4242` and validates it client-side only.

## Features

- **Product catalogue** - 12 fragrances, each with notes (top / heart / base), sizes and prices
- **Shop page** - filter by fragrance family and audience, sort by price / popularity / name, and live search
- **Product pages** - size selector, quantity, add-to-bag, fragrance notes and related scents
- **Cart** - slide-in cart drawer + full cart page, quantity steppers, remove, live totals, free-shipping threshold
- **Checkout** - contact, shipping and payment forms with inline validation (incl. a **Luhn card check** and expiry-date check), live order summary
- **Order confirmation** - generated order number and estimated delivery
- **Persistent cart** - survives reloads via `localStorage`
- **Design** - Mediterranean theme with animated hero waves and **hand-built SVG bottle art** tinted per fragrance family (no image files needed)
- **Responsive** and keyboard-accessible, with reduced-motion support

### Visuals

Two layers work together:

- **Product bottles are generated SVG** - each bottle is drawn in code and tinted by its
  fragrance family, so the catalogue needs no per-product image files.
- **Brand photography** - a cohesive set of Mediterranean brand images (hero, a
  destinations gallery and a journal section) gives the storefront a real editorial feel.
  The raw exports are large, so a small **Python pipeline** turns them into web-ready
  assets (see [Image pipeline](#image-pipeline)).

![Mediterranean scenes](assets/scenery.png)

| Product page | Checkout |
|---|---|
| ![Product](assets/product.png) | ![Checkout](assets/checkout.png) |

## Tech

| | |
|---|---|
| **Frontend** | Vanilla JavaScript (ES2020), HTML5, CSS3 |
| **Routing** | Hash-based single-page router (`#/shop`, `#/product/:id`, `#/checkout` …) |
| **State** | Cart in `localStorage`, re-rendered via a small event bus (`cart:change`) |
| **Art** | Inline SVG - bottles and hero waves generated in code |
| **Image tooling** | Python + Pillow pipeline that resizes and compresses brand imagery to WebP + JPEG |
| **Hosting** | Static - no build, deploys straight to GitHub Pages |

## How it works

```
index.html         app shell: header, cart drawer, footer
css/style.css      the Mediterranean theme
js/data.js         brand copy + the fragrance catalogue (edit products here)
js/art.js          SVG bottle + hero-wave generators
js/store.js        cart state, localStorage, price helpers
js/views.js        one render function per page
js/app.js          hash router + all interactions (event delegation) + checkout validation
assets/images/     web-ready brand imagery (built by the pipeline) + manifest.json
tools/             Python image pipeline (optimize_images.py)
```

## Image pipeline

The brand imagery arrives as large (2-3 MB) PNG exports. `tools/optimize_images.py`
(Python + Pillow) turns them into clean web assets: it resizes each image for its role,
writes a modern **WebP** plus a **JPEG** fallback, renames everything to a predictable
scheme, builds a square favicon from the logo, and writes `assets/images/manifest.json`.
It cut the imagery from ~40 MB of source PNGs to under 2 MB of WebP.

```bash
pip install pillow
# drop the raw brand PNGs in tools/source-images/, then:
python tools/optimize_images.py
```

Only the optimized output is committed; the heavy source PNGs stay out of version control.
The page serves each image through a `<picture>` element (WebP with a JPEG fallback) and
lazy-loads everything below the hero.

The cart never blocks the UI: adding an item updates `localStorage` and fires a
`cart:change` event, and the header badge, drawer and cart page re-read from the store.
Checkout runs fully client-side validation (required fields, email format, a real Luhn
check on the card number, and an expiry-date-in-the-future check) before creating the order.

## Run locally

No install or build needed:

```bash
git clone https://github.com/t4lh8/MARE-D-AKER-A-Mediterranean-Fragrance-Online-Store.git
cd MARE-D-AKER-A-Mediterranean-Fragrance-Online-Store
# then open index.html, or serve it:
python -m http.server 8000     # http://localhost:8000
```

## What I learned

- Structuring a **single-page app in vanilla JS** - a hash router, views and event delegation - without a framework
- Modelling an **e-commerce cart** and a validated **checkout flow** (including the Luhn algorithm for card numbers)
- Keeping UI in sync with a tiny **event-driven store** and `localStorage`
- Building a whole product catalogue's imagery as **generated SVG**, so the catalogue needs zero image files
- Writing a small **Python (Pillow) build pipeline** to optimise brand imagery into WebP + JPEG, and serving it with responsive `<picture>` and lazy loading
- Designing a cohesive, responsive brand with an accessible, reduced-motion-friendly layout

## License

[MIT](LICENSE)

Made by **Talha Aker**.
