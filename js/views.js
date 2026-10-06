/* ------------------------------------------------------------------
   Views: each route returns an HTML string. Interactions are wired up
   centrally in app.js via event delegation (data-action attributes).
------------------------------------------------------------------ */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const Views = (() => {
  const fromPrice = (p) => Math.min(...p.sizes.map((s) => s.price));

  /* Responsive <picture>: modern WebP with a JPEG fallback. */
  const IMG = "assets/images";
  const pic = (name, alt, cls = "", lazy = true) => `
    <picture class="${cls}">
      <source srcset="${IMG}/${name}.webp" type="image/webp">
      <img src="${IMG}/${name}.jpg" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} decoding="async">
    </picture>`;

  /* Journal cards shown on the home page. */
  const JOURNAL = [
    { img: "journal-aegean", alt: "Journal: The Endless Blue - light, salt and timeless horizons over the Aegean" },
    { img: "journal-citrus", alt: "Journal: a feature on Mediterranean citrus groves" },
    { img: "journal-valletta", alt: "Journal: a feature on Valletta and the limestone coast" },
  ];

  const chip = (p) => `<span class="chip chip-${p.family}">${FAMILIES[p.family].label}</span>`;

  function card(p) {
    return `
    <article class="card" data-action="nav" data-href="#/product/${p.id}" tabindex="0" role="link" aria-label="${esc(p.name)}">
      <div class="card-art">${pic(p.image, p.name + " extrait de parfum, " + p.place)}</div>
      <div class="card-body">
        <div class="card-top">${chip(p)}<span class="card-place">${esc(p.place)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="card-tag">${esc(p.tagline)}</p>
        <div class="card-foot">
          <span class="price">from ${money(fromPrice(p))}</span>
          <button class="btn btn-ghost btn-sm" data-action="add" data-id="${p.id}" data-ml="${p.sizes[0].ml}" data-stop>Add</button>
        </div>
      </div>
    </article>`;
  }

  /* A stylised "coast route": the six fragrances, west to east. */
  function coastMap() {
    const stops = [...PRODUCTS].sort((a, b) => a.map - b.map);
    const star = `<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 0l1.7 6.3L16 8l-6.3 1.7L8 16l-1.7-6.3L0 8l6.3-1.7z" fill="currentColor"/></svg>`;
    return `
    <section class="section coastmap">
      <div class="section-head center">
        <p class="eyebrow">Where the scents come from</p>
        <h2 class="display">Follow the coast</h2>
        <p class="section-sub">Six winds, west to east across the Mediterranean - tap a port to meet its fragrance.</p>
      </div>
      <div class="map-wrap">
        <div class="map-rail" aria-hidden="true"></div>
        <div class="map-stops">
          ${stops.map((p) => `
            <a class="map-stop coll-${p.family}" href="#/product/${p.id}" aria-label="${esc(p.name)} - ${esc(p.place)}">
              <span class="stop-dot">${star}</span>
              <span class="stop-name">${esc(p.name)}</span>
              <span class="stop-place">${esc(p.place)}</span>
            </a>`).join("")}
        </div>
      </div>
    </section>`;
  }

  /* ---------------- Home ---------------- */
  function home() {
    const featured = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity);
    return `
    <section class="hero">
      <picture class="hero-photo">
        <source media="(max-width:640px)" srcset="${IMG}/hero-mobile.webp" type="image/webp">
        <source media="(max-width:640px)" srcset="${IMG}/hero-mobile.jpg">
        <source srcset="${IMG}/hero-desktop.webp" type="image/webp">
        <img src="${IMG}/hero-desktop.jpg" alt="MARE D'AKER Mediterranean Collection bottle on a Santorini terrace above the sea" fetchpriority="high" decoding="async">
      </picture>
      <div class="hero-inner">
        <p class="eyebrow">Eau de Parfum · Made in small batches</p>
        <h1 class="display">${esc(BRAND.name)}</h1>
        <p class="hero-tag">${esc(BRAND.tagline)}</p>
        <p class="hero-intro">${esc(BRAND.intro)}</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#/shop">Explore the collection</a>
          <a class="btn btn-ghost-light" href="#/about">Our story</a>
        </div>
      </div>
      ${Art.waves()}
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="display">Signature fragrances</h2>
        <a class="link" href="#/shop">View all →</a>
      </div>
      <div class="grid">${featured.map(card).join("")}</div>
    </section>

    <section class="collections">
      ${COLLECTIONS.map((c) => `
        <a class="collection coll-${c.family}" href="#/shop?family=${c.family}">
          <span class="coll-label">${FAMILIES[c.family].label}</span>
          <h3 class="display">${esc(c.title)}</h3>
          <p>${esc(c.copy)}</p>
          <span class="link-light">Shop →</span>
        </a>`).join("")}
    </section>

    ${coastMap()}

    <section class="section journal">
      <div class="section-head center">
        <p class="eyebrow">From the journal</p>
        <h2 class="display">Notes from the Mediterranean</h2>
      </div>
      <div class="journal-grid">
        ${JOURNAL.map((j) => `
          <a class="journal-card" href="#/about" aria-label="${esc(j.alt)}">
            ${pic(j.img, j.alt)}
          </a>`).join("")}
      </div>
    </section>

    <section class="section story-band">
      <div class="story-text">
        <p class="eyebrow">The house</p>
        <h2 class="display">A coastline in a bottle</h2>
        <p>${esc(BRAND.story)}</p>
        <a class="btn btn-ghost" href="#/about">Read more</a>
      </div>
      <form class="news" data-action="newsletter">
        <h3>Join the harbour list</h3>
        <p class="muted">New releases and 10% off your first order.</p>
        <div class="news-row">
          <input type="email" name="email" placeholder="you@example.com" required aria-label="Email">
          <button class="btn btn-primary" type="submit">Subscribe</button>
        </div>
        <p class="news-note" aria-live="polite"></p>
      </form>
    </section>`;
  }

  /* ---------------- Shop ---------------- */
  function shop(params) {
    const q = (params.q || "").toLowerCase();
    const fam = params.family || "all";
    const gender = params.gender || "all";
    const sort = params.sort || "popular";

    let list = PRODUCTS.filter((p) =>
      (fam === "all" || p.family === fam) &&
      (gender === "all" || p.gender === gender) &&
      (!q || (p.name + " " + p.place + " " + p.tagline).toLowerCase().includes(q)));

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      "price-asc": (a, b) => fromPrice(a) - fromPrice(b),
      "price-desc": (a, b) => fromPrice(b) - fromPrice(a),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    list = list.sort(sorters[sort] || sorters.popular);

    const famOpts = ["all", ...Object.keys(FAMILIES)];
    const genderOpts = ["all", ...Object.keys(GENDERS)];

    return `
    <section class="shop">
      <header class="shop-head">
        <div>
          <p class="eyebrow">The collection</p>
          <h1 class="display">Shop all fragrances</h1>
        </div>
        <div class="shop-search">
          <input type="search" name="q" value="${esc(params.q || "")}" placeholder="Search scents, places…" aria-label="Search" data-action="search">
        </div>
      </header>

      <div class="shop-body">
        <aside class="filters">
          <div class="filter-group">
            <h4>Family</h4>
            ${famOpts.map((f) => `
              <label class="radio">
                <input type="radio" name="family" value="${f}" ${f === fam ? "checked" : ""} data-action="filter">
                <span>${f === "all" ? "All" : FAMILIES[f].label}</span>
              </label>`).join("")}
          </div>
          <div class="filter-group">
            <h4>For</h4>
            ${genderOpts.map((g) => `
              <label class="radio">
                <input type="radio" name="gender" value="${g}" ${g === gender ? "checked" : ""} data-action="filter">
                <span>${g === "all" ? "Everyone" : GENDERS[g]}</span>
              </label>`).join("")}
          </div>
          <div class="filter-group">
            <h4>Sort by</h4>
            <select name="sort" data-action="filter">
              <option value="popular" ${sort === "popular" ? "selected" : ""}>Most loved</option>
              <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Price: low to high</option>
              <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Price: high to low</option>
              <option value="name" ${sort === "name" ? "selected" : ""}>Name A-Z</option>
            </select>
          </div>
          ${fam !== "all" || gender !== "all" || q ? `<a class="link" href="#/shop">Clear filters</a>` : ""}
        </aside>

        <div class="shop-main">
          <p class="result-count">${list.length} fragrance${list.length === 1 ? "" : "s"}</p>
          ${list.length ? `<div class="grid">${list.map(card).join("")}</div>`
            : `<p class="empty">No fragrances match your filters. <a class="link" href="#/shop">Reset</a></p>`}
        </div>
      </div>
    </section>`;
  }

  /* ---------------- Product ---------------- */
  function product(id) {
    const p = Store.product(id);
    if (!p) return notFound();
    const related = PRODUCTS.filter((r) => r.family === p.family && r.id !== p.id).slice(0, 3);
    const noteRow = (label, arr) =>
      `<div class="note-row"><span class="note-label">${label}</span><span class="note-vals">${arr.map(esc).join(" · ")}</span></div>`;

    return `
    <nav class="crumbs"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <span>${esc(p.name)}</span></nav>
    <section class="product" data-product="${p.id}">
      <div class="product-art">${pic(p.image, p.name + " extrait de parfum, inspired by " + p.place, "", false)}</div>
      <div class="product-info">
        <div class="product-top">${chip(p)}<span class="muted">${GENDERS[p.gender]} · ${esc(p.concentration)}</span></div>
        <h1 class="display">${esc(p.name)}</h1>
        <p class="product-place">Inspired by ${esc(p.place)}</p>
        <p class="product-tag">${esc(p.tagline)}</p>

        <div class="sizes" role="group" aria-label="Size">
          ${p.sizes.map((s, i) => `
            <button class="size ${i === 0 ? "active" : ""}" data-action="size" data-ml="${s.ml}" data-price="${s.price}">
              ${s.ml} ml<span>${money(s.price)}</span>
            </button>`).join("")}
        </div>

        <div class="buy-row">
          <div class="stepper" data-stepper>
            <button data-action="pq-dec" aria-label="Decrease">−</button>
            <input type="text" value="1" data-qty readonly aria-label="Quantity">
            <button data-action="pq-inc" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary btn-lg" data-action="add-detail" data-id="${p.id}">
            Add to bag - <span data-buy-price>${money(p.sizes[0].price)}</span>
          </button>
        </div>
        <p class="ship-note">Free shipping over ${money(BRAND.freeShippingOver)} · Ships in 1-2 days</p>

        <div class="notes">
          <h4>Fragrance notes</h4>
          ${noteRow("Top", p.notes.top)}
          ${noteRow("Heart", p.notes.heart)}
          ${noteRow("Base", p.notes.base)}
        </div>
        <p class="product-desc">${esc(p.description)}</p>
      </div>
    </section>

    ${related.length ? `
    <section class="section">
      <div class="section-head"><h2 class="display">You may also like</h2></div>
      <div class="grid">${related.map(card).join("")}</div>
    </section>` : ""}`;
  }

  /* ---------------- Cart ---------------- */
  function cart() {
    const lines = Store.detailed();
    if (!lines.length) {
      return `
      <section class="narrow center-empty">
        <h1 class="display">Your bag is empty</h1>
        <p class="muted">Nothing here yet - find your coastline.</p>
        <a class="btn btn-primary" href="#/shop">Browse fragrances</a>
      </section>`;
    }
    return `
    <section class="cart">
      <h1 class="display">Your bag</h1>
      <div class="cart-grid">
        <div class="cart-lines">
          ${lines.map((l) => `
            <div class="cart-line">
              <a class="cart-thumb" href="#/product/${l.id}">${pic(l.product.image, l.product.name)}</a>
              <div class="cart-line-main">
                <a class="cart-name" href="#/product/${l.id}">${esc(l.product.name)}</a>
                <p class="muted">${l.ml} ml · ${FAMILIES[l.product.family].label}</p>
                <button class="link-danger" data-action="remove" data-id="${l.id}" data-ml="${l.ml}">Remove</button>
              </div>
              <div class="stepper sm">
                <button data-action="qty-dec" data-id="${l.id}" data-ml="${l.ml}" aria-label="Decrease">−</button>
                <input type="text" value="${l.qty}" readonly aria-label="Quantity">
                <button data-action="qty-inc" data-id="${l.id}" data-ml="${l.ml}" aria-label="Increase">+</button>
              </div>
              <div class="cart-line-total">${money(l.lineTotal)}</div>
            </div>`).join("")}
        </div>
        ${summaryBox("Proceed to checkout", "#/checkout")}
      </div>
    </section>`;
  }

  function summaryBox(ctaText, ctaHref) {
    const sub = Store.subtotal(), ship = Store.shipping();
    return `
    <aside class="summary">
      <h3>Order summary</h3>
      <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>${ship === 0 ? "Free" : money(ship)}</span></div>
      ${sub < BRAND.freeShippingOver ? `<p class="sum-hint">Add ${money(BRAND.freeShippingOver - sub)} for free shipping</p>` : ""}
      <div class="sum-row total"><span>Total</span><span>${money(Store.total())}</span></div>
      <a class="btn btn-primary btn-block" href="${ctaHref}">${ctaText}</a>
      <p class="pay-icons">VISA · Mastercard · Vipps · klarna</p>
    </aside>`;
  }

  /* ---------------- Checkout ---------------- */
  function checkout() {
    const lines = Store.detailed();
    if (!lines.length) return `<section class="narrow center-empty"><h1 class="display">Your bag is empty</h1><a class="btn btn-primary" href="#/shop">Browse fragrances</a></section>`;
    const field = (name, label, attrs = "", hint = "") =>
      `<label class="field"><span>${label}</span><input name="${name}" ${attrs}><em class="err" data-err="${name}"></em>${hint ? `<small>${hint}</small>` : ""}</label>`;
    return `
    <section class="checkout">
      <nav class="crumbs"><a href="#/cart">Bag</a> / <span>Checkout</span></nav>
      <h1 class="display">Checkout</h1>
      <div class="checkout-grid">
        <form class="checkout-form" novalidate data-action="place-order">
          <fieldset>
            <legend>Contact</legend>
            ${field("email", "Email", 'type="email" autocomplete="email" placeholder="you@example.com"')}
          </fieldset>
          <fieldset>
            <legend>Shipping address</legend>
            <div class="two">
              ${field("firstName", "First name", 'autocomplete="given-name"')}
              ${field("lastName", "Last name", 'autocomplete="family-name"')}
            </div>
            ${field("address", "Address", 'autocomplete="street-address"')}
            <div class="two">
              ${field("zip", "Postal code", 'inputmode="numeric" autocomplete="postal-code"')}
              ${field("city", "City", 'autocomplete="address-level2"')}
            </div>
            ${field("phone", "Phone", 'type="tel" autocomplete="tel" placeholder="+47 …"')}
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <p class="demo-note">🔒 Demo store - no real payment is taken. Try test card <b>4242 4242 4242 4242</b>, any future date, any CVC.</p>
            ${field("card", "Card number", 'inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="23"')}
            ${field("cardName", "Name on card", 'autocomplete="cc-name"')}
            <div class="two">
              ${field("exp", "Expiry (MM/YY)", 'inputmode="numeric" placeholder="08/29" maxlength="5"')}
              ${field("cvc", "CVC", 'inputmode="numeric" placeholder="123" maxlength="4"')}
            </div>
          </fieldset>
          <button class="btn btn-primary btn-lg btn-block" type="submit">Pay ${money(Store.total())}</button>
          <p class="form-foot muted">By placing the order you agree to our (imaginary) terms. This is a portfolio demo.</p>
        </form>

        <aside class="summary">
          <h3>Your order</h3>
          <div class="co-lines">
            ${lines.map((l) => `
              <div class="co-line">
                <span class="co-qty">${l.qty}×</span>
                <span class="co-name">${esc(l.product.name)} <em>${l.ml} ml</em></span>
                <span>${money(l.lineTotal)}</span>
              </div>`).join("")}
          </div>
          <div class="sum-row"><span>Subtotal</span><span>${money(Store.subtotal())}</span></div>
          <div class="sum-row"><span>Shipping</span><span>${Store.shipping() === 0 ? "Free" : money(Store.shipping())}</span></div>
          <div class="sum-row total"><span>Total</span><span>${money(Store.total())}</span></div>
        </aside>
      </div>
    </section>`;
  }

  /* ---------------- Order confirmation ---------------- */
  function order() {
    const o = Store.lastOrder();
    if (!o) return notFound();
    return `
    <section class="narrow confirm">
      <div class="confirm-mark">✓</div>
      <p class="eyebrow">Order confirmed</p>
      <h1 class="display">Grazie, ${esc(o.firstName)}!</h1>
      <p class="muted">We've sent a confirmation to ${esc(o.email)}. Your order is on its way.</p>
      <div class="confirm-card">
        <div class="sum-row"><span>Order number</span><span class="mono">${esc(o.number)}</span></div>
        <div class="sum-row"><span>Estimated delivery</span><span>${esc(o.eta)}</span></div>
        <hr>
        ${o.items.map((l) => `<div class="co-line"><span class="co-qty">${l.qty}×</span><span class="co-name">${esc(l.name)} <em>${l.ml} ml</em></span><span>${money(l.lineTotal)}</span></div>`).join("")}
        <div class="sum-row total"><span>Total paid</span><span>${money(o.total)}</span></div>
      </div>
      <a class="btn btn-primary" href="#/shop">Continue shopping</a>
    </section>`;
  }

  /* ---------------- About ---------------- */
  function about() {
    return `
    <section class="about">
      <div class="about-hero">
        <p class="eyebrow">The house</p>
        <h1 class="display">${esc(BRAND.name)}</h1>
        <p class="about-lede">${esc(BRAND.story)}</p>
      </div>
      <div class="about-feature">
        ${pic("story-flatlay", "MARE D'AKER bottle styled on linen with olive branches and sea salt", "about-figure")}
        <div class="about-feature-text">
          <p class="eyebrow">A journey, a memory</p>
          <h2 class="display">A scent of the Mediterranean</h2>
          <p>Each fragrance is composed in small batches and presented as a keepsake - a navy case, a gold mark and a card that names the coast it was drawn from.</p>
        </div>
      </div>
      <div class="about-gallery">
        ${pic("packaging-box", "MARE D'AKER gift box, open, with the Morocco Sirocco bottle")}
        ${pic("story-postcards", "MARE D'AKER postcards and bottles laid out on stone")}
      </div>
      <div class="about-cols">
        <div><h3 class="display">Made in small batches</h3><p>Every fragrance is blended in limited runs so each bottle stays fresh and true to its formula.</p></div>
        <div><h3 class="display">Natural-feeling notes</h3><p>We build around realistic citrus, salt, wood and resin accords - nothing loud, nothing synthetic-smelling.</p></div>
        <div><h3 class="display">A place in every scent</h3><p>From Capri's lemon terraces to the myrtle of Corsica, each perfume maps a stretch of Mediterranean coast.</p></div>
      </div>
      <a class="btn btn-primary" href="#/shop">Explore the collection</a>
    </section>`;
  }

  function notFound() {
    return `<section class="narrow center-empty"><h1 class="display">Not found</h1><p class="muted">That page drifted out to sea.</p><a class="btn btn-primary" href="#/">Back home</a></section>`;
  }

  return { home, shop, product, cart, checkout, order, about, notFound, summaryBox };
})();
