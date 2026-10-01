/* ------------------------------------------------------------------
   Store: cart state in localStorage + small helpers. Emits "cart:change"
   so the header badge, cart drawer and cart page stay in sync.
------------------------------------------------------------------ */

const Store = (() => {
  const KEY = "mare_cart_v1";
  const ORDER_KEY = "mare_last_order";

  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  };
  let cart = load();

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
    window.dispatchEvent(new CustomEvent("cart:change"));
  };

  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const sizePrice = (p, ml) => (p.sizes.find((s) => s.ml === ml) || p.sizes[0]).price;

  function add(id, ml, qty = 1) {
    const line = cart.find((l) => l.id === id && l.ml === ml);
    if (line) line.qty += qty;
    else cart.push({ id, ml, qty });
    save();
  }
  function setQty(id, ml, qty) {
    const line = cart.find((l) => l.id === id && l.ml === ml);
    if (!line) return;
    line.qty = Math.max(1, Math.min(99, qty));
    save();
  }
  function remove(id, ml) {
    cart = cart.filter((l) => !(l.id === id && l.ml === ml));
    save();
  }
  function clear() { cart = []; save(); }

  const items = () => cart.slice();
  const count = () => cart.reduce((n, l) => n + l.qty, 0);

  // Enriched line items for rendering (joins cart with product data).
  function detailed() {
    return cart.map((l) => {
      const p = product(l.id);
      const price = sizePrice(p, l.ml);
      return { ...l, product: p, price, lineTotal: price * l.qty };
    });
  }

  const subtotal = () => detailed().reduce((s, l) => s + l.lineTotal, 0);
  const shipping = () => {
    const sub = subtotal();
    if (sub === 0) return 0;
    return sub >= BRAND.freeShippingOver ? 0 : BRAND.shippingFlat;
  };
  const total = () => subtotal() + shipping();

  function saveOrder(order) {
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch {}
  }
  function lastOrder() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY)); } catch { return null; }
  }

  return { add, setQty, remove, clear, items, count, detailed, subtotal, shipping, total,
           product, sizePrice, saveOrder, lastOrder };
})();

/* Price formatting: "1 290 kr" (space thousands, Norwegian style). */
function money(n) {
  return Math.round(n).toLocaleString("nb-NO").replace(/ /g, " ") + " " + BRAND.currency;
}
