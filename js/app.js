/* ------------------------------------------------------------------
   App: hash router, cart drawer, and all interactions (event delegation).
------------------------------------------------------------------ */

const app = document.getElementById("app");
const $ = (s, r = document) => r.querySelector(s);

/* ---------- routing ---------- */
function parseHash() {
  const raw = (location.hash || "#/").slice(1);
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);     // e.g. ["product","costa-azzurra"]
  const params = {};
  new URLSearchParams(query).forEach((v, k) => (params[k] = v));
  return { route: parts[0] || "home", param: parts[1] || "", params };
}

function titleFor(route, param) {
  const base = "MARE D'AKER";
  const p = param && Store.product(param);
  const map = { home: base, shop: "Shop · " + base, cart: "Bag · " + base,
    checkout: "Checkout · " + base, order: "Order confirmed · " + base, about: "Our story · " + base };
  return p ? `${p.name} · ${base}` : (map[route] || base);
}

let focusSearch = false;

function render() {
  const { route, param, params } = parseHash();
  const view = {
    home: () => Views.home(),
    shop: () => Views.shop(params),
    product: () => Views.product(param),
    cart: () => Views.cart(),
    checkout: () => Views.checkout(),
    order: () => Views.order(),
    about: () => Views.about(),
  }[route] || Views.notFound;

  app.innerHTML = view();
  document.title = titleFor(route, param);
  if (!focusSearch) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  if (focusSearch) {
    const s = $('[data-action="search"]');
    if (s) { const v = s.value; s.focus(); s.setSelectionRange(v.length, v.length); }
    focusSearch = false;
  }
  updateChrome();
}

/* ---------- header badge + cart drawer ---------- */
function updateChrome() {
  const n = Store.count();
  const badge = $("#cart-count");
  if (badge) { badge.textContent = n; badge.classList.toggle("show", n > 0); }
  const drawer = $("#drawer-body");
  if (drawer) drawer.innerHTML = drawerHTML();
}

function drawerHTML() {
  const lines = Store.detailed();
  if (!lines.length) return `<p class="drawer-empty muted">Your bag is empty.</p>`;
  return `
    ${lines.map((l) => `
      <div class="drawer-line">
        <a class="drawer-thumb" href="#/product/${l.id}" data-action="close-drawer"><img src="assets/images/${l.product.image}.jpg" alt="${esc(l.product.name)}" loading="lazy"></a>
        <div class="drawer-main">
          <span class="drawer-name">${esc(l.product.name)}</span>
          <span class="muted">${l.ml} ml · ${l.qty} × ${money(l.price)}</span>
        </div>
        <button class="link-danger" data-action="remove" data-id="${l.id}" data-ml="${l.ml}" aria-label="Remove">×</button>
      </div>`).join("")}
    <div class="drawer-foot">
      <div class="sum-row total"><span>Subtotal</span><span>${money(Store.subtotal())}</span></div>
      <a class="btn btn-ghost btn-block" href="#/cart" data-action="close-drawer">View bag</a>
      <a class="btn btn-primary btn-block" href="#/checkout" data-action="close-drawer">Checkout</a>
    </div>`;
}

function openDrawer() { document.body.classList.add("drawer-open"); }
function closeDrawer() { document.body.classList.remove("drawer-open"); }

/* ---------- theme switcher ---------- */
function setTheme(name) {
  if (name === "light") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", name);
  try { localStorage.setItem("mare_theme", name); } catch (e) {}
  markTheme();
}
function markTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  document.querySelectorAll("[data-theme-set]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.themeSet === cur)));
}

function flashBadge() {
  const b = $("#cart-count");
  if (!b) return;
  b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse");
}

/* ---------- query helpers (shop filters/search) ---------- */
function setQuery(patch) {
  const { params } = parseHash();
  const merged = { ...params, ...patch };
  Object.keys(merged).forEach((k) => { if (!merged[k] || merged[k] === "all") delete merged[k]; });
  const qs = new URLSearchParams(merged).toString();
  location.hash = "#/shop" + (qs ? "?" + qs : "");
}

/* ---------- interactions ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-action]");
  // cart drawer open/close buttons live outside [data-action] routing
  const themeBtn = e.target.closest("[data-theme-set]");
  if (themeBtn) { setTheme(themeBtn.dataset.themeSet); return; }
  if (e.target.closest("#cart-btn")) { e.preventDefault(); openDrawer(); return; }
  if (e.target.closest("#drawer-close") || e.target.id === "drawer-scrim") { closeDrawer(); return; }
  if (!t) return;
  const a = t.dataset.action;

  if (a === "add") {
    e.preventDefault(); e.stopPropagation();
    Store.add(t.dataset.id, +t.dataset.ml, 1);
    flashBadge(); openDrawer();
  } else if (a === "add-detail") {
    const root = t.closest("[data-product]");
    const ml = +(root.querySelector(".size.active")?.dataset.ml || 0);
    const qty = +(root.querySelector("[data-qty]")?.value || 1);
    Store.add(t.dataset.id, ml, qty);
    flashBadge(); openDrawer();
  } else if (a === "size") {
    const root = t.closest("[data-product]");
    root.querySelectorAll(".size").forEach((b) => b.classList.remove("active"));
    t.classList.add("active");
    const price = +t.dataset.price, qty = +(root.querySelector("[data-qty]")?.value || 1);
    root.querySelector("[data-buy-price]").textContent = money(price * qty);
  } else if (a === "pq-inc" || a === "pq-dec") {
    const root = t.closest("[data-product]");
    const input = root.querySelector("[data-qty]");
    let q = +input.value + (a === "pq-inc" ? 1 : -1);
    q = Math.max(1, Math.min(99, q)); input.value = q;
    const price = +(root.querySelector(".size.active")?.dataset.price || 0);
    root.querySelector("[data-buy-price]").textContent = money(price * q);
  } else if (a === "qty-inc" || a === "qty-dec") {
    const line = Store.detailed().find((l) => l.id === t.dataset.id && l.ml === +t.dataset.ml);
    if (line) Store.setQty(t.dataset.id, +t.dataset.ml, line.qty + (a === "qty-inc" ? 1 : -1));
    if (parseHash().route === "cart") render();
  } else if (a === "remove") {
    Store.remove(t.dataset.id, +t.dataset.ml);
    if (parseHash().route === "cart") render();
  } else if (a === "nav") {
    if (e.target.closest("[data-stop]")) return;   // the inline "Add" button
    location.hash = t.dataset.href;
  } else if (a === "close-drawer") {
    closeDrawer();
  }
});

/* keyboard: open product card with Enter */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
  if (e.key === "Enter") {
    const card = e.target.closest('.card[data-action="nav"]');
    if (card) location.hash = card.dataset.href;
  }
});

/* search (debounced) + filters */
let searchTimer;
document.addEventListener("input", (e) => {
  if (e.target.matches('[data-action="search"]')) {
    clearTimeout(searchTimer);
    const v = e.target.value;
    searchTimer = setTimeout(() => { focusSearch = true; setQuery({ q: v }); }, 220);
  }
  if (e.target.name === "card") e.target.value = formatCard(e.target.value);
  if (e.target.name === "exp") e.target.value = formatExp(e.target.value);
});
document.addEventListener("change", (e) => {
  if (e.target.matches('[data-action="filter"]')) {
    setQuery({ [e.target.name]: e.target.value });
  }
});

/* forms */
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (form.matches('[data-action="newsletter"]')) {
    e.preventDefault();
    form.querySelector(".news-note").textContent = "Welcome aboard - check your inbox for 10% off.";
    form.querySelector('input[name="email"]').value = "";
  } else if (form.matches('[data-action="place-order"]')) {
    e.preventDefault();
    placeOrder(form);
  }
});

/* ---------- checkout validation ---------- */
const luhn = (num) => {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = +num[i];
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return num.length >= 13 && sum % 10 === 0;
};
const formatCard = (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

function validate(form) {
  const g = (n) => (form.querySelector(`[name="${n}"]`)?.value || "").trim();
  const errs = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g("email"))) errs.email = "Enter a valid email.";
  ["firstName", "lastName", "address", "city"].forEach((n) => { if (!g(n)) errs[n] = "Required."; });
  if (!/^\d{3,5}$/.test(g("zip"))) errs.zip = "Enter a valid postal code.";
  if (g("phone").replace(/[^\d]/g, "").length < 6) errs.phone = "Enter a phone number.";

  const card = g("card").replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(card) || !luhn(card)) errs.card = "Card number looks invalid.";
  if (!g("cardName")) errs.cardName = "Required.";
  const exp = g("exp").match(/^(\d{2})\/(\d{2})$/);
  if (!exp || +exp[1] < 1 || +exp[1] > 12) errs.exp = "Use MM/YY.";
  else {
    const expDate = new Date(2000 + +exp[2], +exp[1], 0, 23, 59);
    if (expDate < new Date()) errs.exp = "Card has expired.";
  }
  if (!/^\d{3,4}$/.test(g("cvc"))) errs.cvc = "3-4 digits.";
  return errs;
}

function placeOrder(form) {
  const errs = validate(form);
  form.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
  form.querySelectorAll("input").forEach((el) => el.classList.remove("invalid"));
  if (Object.keys(errs).length) {
    Object.entries(errs).forEach(([k, msg]) => {
      const el = form.querySelector(`[data-err="${k}"]`); if (el) el.textContent = msg;
      form.querySelector(`[name="${k}"]`)?.classList.add("invalid");
    });
    form.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const g = (n) => form.querySelector(`[name="${n}"]`).value.trim();
  const eta = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const order = {
    number: "MA-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10),
    email: g("email"), firstName: g("firstName"),
    items: Store.detailed().map((l) => ({ name: l.product.name, ml: l.ml, qty: l.qty, lineTotal: l.lineTotal })),
    total: Store.total(), eta: "by " + eta,
  };
  Store.saveOrder(order);
  Store.clear();
  location.hash = "#/order/" + order.number;
}

/* ---------- boot ---------- */
window.addEventListener("hashchange", render);
window.addEventListener("cart:change", updateChrome);
render();
markTheme();
