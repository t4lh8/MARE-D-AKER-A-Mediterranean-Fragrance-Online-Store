/* ------------------------------------------------------------------
   MARE D'AKER - brand copy, collections and the fragrance catalogue.
   Edit this file to change products; the rest of the site reads from it.
------------------------------------------------------------------ */

const BRAND = {
  name: "MARE D'AKER",
  tagline: "A Mediterranean Fragrance Universe",
  intro:
    "Perfumes drawn from the Mediterranean - salt on warm skin, citrus groves at noon, " +
    "cypress shade and the blue hour by the sea. Composed in small batches, made to be lived in.",
  currency: "kr",
  freeShippingOver: 1200,
  shippingFlat: 79,
  story:
    "MARE D'AKER began with a single idea: that a scent can hold a coastline. " +
    "Each fragrance maps a place along the Mediterranean - from the lemon terraces of Capri " +
    "to the wild myrtle of Sardinia - built around natural-feeling notes and a clean, modern signature.",
};

/* Fragrance families drive the colour of each bottle and the shop filters. */
const FAMILIES = {
  marine:   { label: "Marine",   juice: "#5AA6C4", deep: "#2C6E88" },
  citrus:   { label: "Citrus",   juice: "#E7C04A", deep: "#B98E22" },
  woody:    { label: "Woody",    juice: "#9A7B59", deep: "#6F5236" },
  floral:   { label: "Floral",   juice: "#D694B0", deep: "#A85F84" },
  aromatic: { label: "Aromatic", juice: "#7E9A5E", deep: "#556F38" },
  amber:    { label: "Amber",    juice: "#D08A4C", deep: "#A65E27" },
};

const GENDERS = { unisex: "Unisex", him: "For Him", her: "For Her" };

const PRODUCTS = [
  {
    id: "costa-azzurra", name: "Costa Azzurra", place: "Côte d'Azur",
    family: "marine", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 98, featured: true,
    tagline: "Salt air, bergamot and a cool blue horizon.",
    notes: { top: ["Bergamot", "Sea salt", "Pink pepper"], heart: ["Seaweed accord", "Jasmine petals"], base: ["Driftwood", "White amber", "Musk"] },
    description:
      "The scent of a boat leaving harbour at dawn: citrus and salt over a breezy, mineral base. " +
      "Clean and weightless, it wears like a linen shirt by the water.",
    sizes: [{ ml: 50, price: 899 }, { ml: 100, price: 1290 }],
  },
  {
    id: "limone-di-capri", name: "Limone di Capri", place: "Capri",
    family: "citrus", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 95, featured: true,
    tagline: "Sun-warmed lemons on a whitewashed terrace.",
    notes: { top: ["Sorrento lemon", "Mandarin", "Petitgrain"], heart: ["Neroli", "Orange blossom"], base: ["Cedar", "White musk"] },
    description:
      "A bright, joyful citrus built on real lemon-leaf facets, softened by orange blossom and warm cedar. " +
      "The most uplifting bottle in the house.",
    sizes: [{ ml: 50, price: 849 }, { ml: 100, price: 1190 }],
  },
  {
    id: "fico-mediterraneo", name: "Fico Mediterraneo", place: "Sardinia",
    family: "woody", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 90, featured: true,
    tagline: "Green fig, milky coconut and sun-bleached wood.",
    notes: { top: ["Fig leaf", "Green mandarin"], heart: ["Fig fruit", "Coconut milk"], base: ["Sandalwood", "Cedar", "Tonka"] },
    description:
      "Shade under a fig tree in late summer - green and leafy up top, creamy and woody underneath. " +
      "Comforting without ever turning heavy.",
    sizes: [{ ml: 50, price: 929 }, { ml: 100, price: 1340 }],
  },
  {
    id: "gelsomino-notte", name: "Gelsomino Notte", place: "Amalfi",
    family: "floral", gender: "her", concentration: "Eau de Parfum",
    popularity: 88,
    tagline: "Night-blooming jasmine on a warm coast.",
    notes: { top: ["Mandarin", "Green notes"], heart: ["Jasmine sambac", "Tuberose", "Ylang-ylang"], base: ["Amber", "Sandalwood", "Vanilla"] },
    description:
      "A full, luminous white floral that opens as the heat fades. Jasmine and tuberose glow over a soft amber trail.",
    sizes: [{ ml: 50, price: 969 }, { ml: 100, price: 1390 }],
  },
  {
    id: "cipresso", name: "Cipresso", place: "Tuscany",
    family: "aromatic", gender: "him", concentration: "Eau de Parfum",
    popularity: 86,
    tagline: "Cypress, vetiver and dry incense.",
    notes: { top: ["Cypress", "Bergamot", "Juniper"], heart: ["Lavender", "Geranium"], base: ["Vetiver", "Incense", "Oakmoss"] },
    description:
      "Cool green cypress lines over a smoky, earthy base. Composed and quietly serious - a scent for long evenings.",
    sizes: [{ ml: 50, price: 899 }, { ml: 100, price: 1290 }],
  },
  {
    id: "sale-e-ambra", name: "Sale & Ambra", place: "Ibiza",
    family: "amber", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 92, featured: true,
    tagline: "Skin, salt and golden amber.",
    notes: { top: ["Sea salt", "Bergamot"], heart: ["Ambergris accord", "Immortelle"], base: ["Amber", "Labdanum", "Musk"] },
    description:
      "Warm skin after a day in the sun - salty, golden and close to the body. Our most addictive, low-key sensual scent.",
    sizes: [{ ml: 50, price: 989 }, { ml: 100, price: 1420 }],
  },
  {
    id: "arancia-rossa", name: "Arancia Rossa", place: "Sicily",
    family: "citrus", gender: "unisex", concentration: "Eau de Toilette",
    popularity: 83,
    tagline: "Blood orange with a peppery spark.",
    notes: { top: ["Blood orange", "Grapefruit", "Pink pepper"], heart: ["Neroli", "Rose"], base: ["Musk", "Cedar"] },
    description:
      "Juicy blood orange lifted by pink pepper, drying down to a clean musk. Bright, modern and easy to wear daily.",
    sizes: [{ ml: 50, price: 749 }, { ml: 100, price: 1090 }],
  },
  {
    id: "mirto-selvatico", name: "Mirto Selvatico", place: "Corsica",
    family: "aromatic", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 80,
    tagline: "Wild myrtle and sea-cliff herbs.",
    notes: { top: ["Myrtle", "Lemon", "Mint"], heart: ["Rosemary", "Bay leaf"], base: ["Oakmoss", "Vetiver", "Musk"] },
    description:
      "The scrubland above the sea - aromatic, green and a little wild. Herbal and fresh with a grounded, mossy base.",
    sizes: [{ ml: 50, price: 879 }, { ml: 100, price: 1250 }],
  },
  {
    id: "rosa-di-sicilia", name: "Rosa di Sicilia", place: "Sicily",
    family: "floral", gender: "her", concentration: "Eau de Parfum",
    popularity: 84,
    tagline: "Sicilian rose with saffron warmth.",
    notes: { top: ["Saffron", "Raspberry"], heart: ["Damask rose", "Peony"], base: ["Patchouli", "Amber", "Musk"] },
    description:
      "A modern rose - spiced with saffron and deepened by patchouli, never old-fashioned. Rich but refined.",
    sizes: [{ ml: 50, price: 959 }, { ml: 100, price: 1380 }],
  },
  {
    id: "legno-e-sale", name: "Legno & Sale", place: "Marseille",
    family: "woody", gender: "him", concentration: "Eau de Parfum",
    popularity: 85,
    tagline: "Driftwood, marine salt and clean musk.",
    notes: { top: ["Marine salt", "Grapefruit"], heart: ["Driftwood", "Clary sage"], base: ["Ambrette", "Cedar", "Musk"] },
    description:
      "Smooth, salty woods with a soft musky dry-down. Understated and versatile - an everyday signature.",
    sizes: [{ ml: 50, price: 909 }, { ml: 100, price: 1310 }],
  },
  {
    id: "neroli-solare", name: "Neroli Solare", place: "Nice",
    family: "citrus", gender: "unisex", concentration: "Eau de Parfum",
    popularity: 87,
    tagline: "Orange blossom in full sun.",
    notes: { top: ["Neroli", "Bergamot"], heart: ["Orange blossom", "Honey accord"], base: ["White musk", "Blond woods"] },
    description:
      "Soft, radiant orange blossom with a hint of honey. Elegant and clean - flattering on everyone.",
    sizes: [{ ml: 50, price: 939 }, { ml: 100, price: 1350 }],
  },
  {
    id: "oud-mediterraneo", name: "Oud Mediterraneo", place: "Málaga",
    family: "amber", gender: "unisex", concentration: "Extrait de Parfum",
    popularity: 82,
    tagline: "Fig-leaf oud, soft and sunlit.",
    notes: { top: ["Fig leaf", "Bergamot"], heart: ["Oud accord", "Rose"], base: ["Labdanum", "Amber", "Sandalwood"] },
    description:
      "A lighter, Mediterranean take on oud - warm resins kept airy by fig and citrus. Our richest, longest-lasting scent.",
    sizes: [{ ml: 50, price: 1190 }, { ml: 100, price: 1690 }],
  },
];

const COLLECTIONS = [
  { id: "marine", title: "The Marine Edit", copy: "Salt, air and open water.", family: "marine" },
  { id: "citrus", title: "Citrus Grove", copy: "Lemons, neroli and sunlight.", family: "citrus" },
  { id: "amber", title: "Golden Hour", copy: "Warm skin and amber.", family: "amber" },
];

if (typeof module !== "undefined") module.exports = { BRAND, FAMILIES, GENDERS, PRODUCTS, COLLECTIONS };
