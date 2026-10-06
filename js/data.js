/* ------------------------------------------------------------------
   MARE D'AKER - brand copy, collections and the fragrance catalogue.
   Edit this file to change products; the rest of the site reads from it.

   The "Winds of the Mediterranean" collection: six fragrances, each a
   coastline. Every product carries a real brand image (assets/images),
   built by tools/optimize_images.py.
------------------------------------------------------------------ */

const BRAND = {
  name: "MARE D'AKER",
  tagline: "Winds of the Mediterranean",
  intro:
    "Six fragrances, six coastlines - salt on warm skin, citrus groves at noon, " +
    "cedar shade and the blue hour by the sea. Each one named for a wind or a shore, " +
    "composed in small batches and made to be lived in.",
  currency: "kr",
  freeShippingOver: 1200,
  shippingFlat: 79,
  story:
    "MARE D'AKER began with a single idea: that a scent can hold a coastline. " +
    "Each fragrance follows a Mediterranean wind - from the Aegean Meltemi to the " +
    "Saharan Sirocco - built around natural-feeling notes and a clean, modern signature.",
};

/* Fragrance families drive the shop filters and each product's accent. */
const FAMILIES = {
  marine:   { label: "Marine",   juice: "#5AA6C4", deep: "#2C6E88" },
  citrus:   { label: "Citrus",   juice: "#E7C04A", deep: "#B98E22" },
  woody:    { label: "Woody",    juice: "#9A7B59", deep: "#6F5236" },
  aromatic: { label: "Aromatic", juice: "#7E9A5E", deep: "#556F38" },
  amber:    { label: "Amber",    juice: "#D08A4C", deep: "#A65E27" },
};

const GENDERS = { unisex: "Unisex", him: "For Him", her: "For Her" };

/* Each product's `image` is a basename in assets/images (served as .webp/.jpg).
   `map` is the pin position on the home "coast" map, west (0) to east (100). */
const PRODUCTS = [
  {
    id: "meltemi", name: "Meltemi", place: "Santorini, Greece",
    image: "destination-greece", map: 78,
    family: "marine", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 98, featured: true,
    tagline: "Azure air, bergamot and a cool Aegean horizon.",
    notes: { top: ["Bergamot", "Sea salt", "Pink pepper"], heart: ["Marine accord", "Jasmine petals"], base: ["Driftwood", "White amber", "Musk"] },
    description:
      "Named for the Meltemi, the dry summer wind that sweeps the Aegean. Citrus and salt " +
      "over a breezy, mineral base - clean and weightless, like a linen shirt by the water.",
    sizes: [{ ml: 50, price: 949 }, { ml: 100, price: 1360 }],
  },
  {
    id: "zagara", name: "Zagara", place: "Capri, Italy",
    image: "destination-italy", map: 46,
    family: "citrus", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 95, featured: true,
    tagline: "Sun-warmed lemon blossom on a Capri terrace.",
    notes: { top: ["Sorrento lemon", "Mandarin", "Petitgrain"], heart: ["Neroli", "Orange blossom"], base: ["Cedar", "White musk"] },
    description:
      "Zagara is the Sicilian word for citrus blossom. A bright, joyful scent built on real " +
      "lemon-leaf facets, softened by orange blossom and warm cedar - the most uplifting bottle in the house.",
    sizes: [{ ml: 50, price: 899 }, { ml: 100, price: 1290 }],
  },
  {
    id: "sirocco", name: "Sirocco", place: "Morocco",
    image: "destination-morocco", map: 20,
    family: "amber", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 93, featured: true,
    tagline: "Warm amber carried on a desert wind.",
    notes: { top: ["Saffron", "Bergamot"], heart: ["Amber accord", "Immortelle", "Rose"], base: ["Labdanum", "Sandalwood", "Musk"] },
    description:
      "The Sirocco blows warm off the Sahara and across the sea. Golden, resinous and close to " +
      "the body - saffron and amber over soft woods. Our most enveloping, sensual scent.",
    sizes: [{ ml: 50, price: 1090 }, { ml: 100, price: 1560 }],
  },
  {
    id: "solano", name: "Solano", place: "Costa del Sol, Spain",
    image: "destination-spain", map: 8,
    family: "citrus", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 88, featured: true,
    tagline: "Golden citrus and sun on whitewashed stone.",
    notes: { top: ["Blood orange", "Grapefruit", "Pink pepper"], heart: ["Neroli", "Petitgrain"], base: ["Blond woods", "Amber", "Musk"] },
    description:
      "Solano is the warm easterly that crosses the Spanish coast. Juicy citrus lifted by pink " +
      "pepper and set on a soft amber-wood base - bright, radiant and easy to wear every day.",
    sizes: [{ ml: 50, price: 879 }, { ml: 100, price: 1250 }],
  },
  {
    id: "valletta", name: "Valletta", place: "Malta",
    image: "destination-malta", map: 54,
    family: "woody", gender: "him", concentration: "Extrait de Parfum",
    popularity: 85,
    tagline: "Sun-bleached limestone, cedar and sea salt.",
    notes: { top: ["Marine salt", "Grapefruit"], heart: ["Cypress", "Clary sage"], base: ["Cedar", "Ambrette", "Vetiver"] },
    description:
      "The honey-coloured stone of Valletta at golden hour - dry, warm and mineral. Salty woods " +
      "with a soft musky dry-down. Understated and versatile, an everyday signature.",
    sizes: [{ ml: 50, price: 929 }, { ml: 100, price: 1330 }],
  },
  {
    id: "bodrum", name: "Bodrum", place: "Bodrum, Turkey",
    image: "destination-turkey", map: 90,
    family: "aromatic", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 87,
    tagline: "Wild herbs, lavender and cool blue water.",
    notes: { top: ["Lavender", "Lemon", "Mint"], heart: ["Rosemary", "Bay leaf", "Myrtle"], base: ["Oakmoss", "Vetiver", "Musk"] },
    description:
      "The herb-covered hills above the Bodrum coast - aromatic, green and a little wild. " +
      "Lavender and sea-cliff herbs over a grounded, mossy base. Fresh without ever turning sharp.",
    sizes: [{ ml: 50, price: 899 }, { ml: 100, price: 1290 }],
  },
];

const COLLECTIONS = [
  { id: "marine", title: "The Marine Edit", copy: "Salt, air and open water.", family: "marine" },
  { id: "citrus", title: "Citrus Grove", copy: "Lemons, neroli and sunlight.", family: "citrus" },
  { id: "amber", title: "Golden Hour", copy: "Warm skin and amber.", family: "amber" },
];

if (typeof module !== "undefined") module.exports = { BRAND, FAMILIES, GENDERS, PRODUCTS, COLLECTIONS };
