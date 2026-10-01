/* ------------------------------------------------------------------
   Art: inline-SVG illustrations so the shop needs no image files and
   stays visually consistent. Each bottle is tinted by its family.
------------------------------------------------------------------ */

const Art = (() => {
  // A perfume bottle, coloured by the product's fragrance family.
  function bottle(product, { w = 200, h = 300, monogram = true } = {}) {
    const fam = FAMILIES[product.family] || FAMILIES.marine;
    const uid = "b" + product.id.replace(/[^a-z0-9]/g, "");
    return `
<svg class="bottle" viewBox="0 0 200 300" width="${w}" height="${h}" role="img" aria-label="${product.name} bottle">
  <defs>
    <linearGradient id="${uid}-juice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${fam.juice}"/>
      <stop offset="100%" stop-color="${fam.deep}"/>
    </linearGradient>
    <linearGradient id="${uid}-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".35"/>
      <stop offset="18%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity=".08"/>
    </linearGradient>
  </defs>

  <!-- cap -->
  <rect x="80" y="14" width="40" height="30" rx="4" fill="#20343c"/>
  <rect x="80" y="14" width="12" height="30" rx="4" fill="#2f4a54"/>
  <rect x="86" y="42" width="28" height="16" fill="${fam.deep}" opacity=".55"/>

  <!-- body -->
  <rect x="42" y="56" width="116" height="214" rx="20" fill="url(#${uid}-juice)"/>
  <rect x="42" y="56" width="116" height="214" rx="20" fill="url(#${uid}-glass)"/>
  <rect x="42" y="56" width="116" height="214" rx="20" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="1.5"/>

  <!-- liquid line + highlight -->
  <rect x="52" y="66" width="10" height="190" rx="5" fill="#ffffff" opacity=".22"/>
  <path d="M150 70 Q156 150 150 250" stroke="#ffffff" stroke-opacity=".18" stroke-width="6" fill="none" stroke-linecap="round"/>

  <!-- label -->
  <rect x="64" y="150" width="72" height="70" rx="3" fill="#FBF8F2" opacity=".96"/>
  <rect x="64" y="150" width="72" height="70" rx="3" fill="none" stroke="${fam.deep}" stroke-opacity=".5"/>
  ${monogram ? `
  <text x="100" y="176" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-size="17" fill="#20343c" letter-spacing="1">MARE</text>
  <line x1="78" y1="184" x2="122" y2="184" stroke="${fam.deep}" stroke-opacity=".5"/>
  <text x="100" y="200" text-anchor="middle" font-family="'Jost',sans-serif" font-size="7.5" fill="#5f7079" letter-spacing="2">D'AKER</text>
  <text x="100" y="213" text-anchor="middle" font-family="'Jost',sans-serif" font-size="6" fill="${fam.deep}" letter-spacing="2">${fam.label.toUpperCase()}</text>` : ``}
</svg>`;
  }

  // Layered waves for the hero — gentle horizontal drift via CSS.
  function waves() {
    const layer = (cls, d, fill, op) =>
      `<path class="${cls}" d="${d}" fill="${fill}" fill-opacity="${op}"/>`;
    return `
<svg class="waves" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
  ${layer("w1", "M0,120 C240,70 480,170 720,120 C960,70 1200,170 1440,120 L1440,220 L0,220 Z", "#EAF4F6", ".10")}
  ${layer("w2", "M0,150 C240,110 480,200 720,150 C960,100 1200,190 1440,150 L1440,220 L0,220 Z", "#EAF4F6", ".16")}
  ${layer("w3", "M0,180 C240,150 480,210 720,175 C960,140 1200,205 1440,175 L1440,220 L0,220 Z", "#EAF4F6", ".24")}
</svg>`;
  }

  return { bottle, waves };
})();
