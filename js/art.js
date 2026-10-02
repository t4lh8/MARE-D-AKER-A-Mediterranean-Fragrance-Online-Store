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

  // Atmospheric coastline behind the hero: a low sun and layered headlands.
  function heroScene() {
    return `
<svg class="hero-scene" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <radialGradient id="sun" cx="78%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#FBE3B0" stop-opacity=".9"/>
      <stop offset="35%" stop-color="#F2C45E" stop-opacity=".45"/>
      <stop offset="100%" stop-color="#F2C45E" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1440" height="600" fill="url(#sun)"/>
  <circle cx="1123" cy="180" r="58" fill="#FCE6BE" opacity=".85"/>
  <!-- distant headlands -->
  <path d="M0,430 C240,390 420,420 620,405 C820,390 1040,430 1440,400 L1440,600 L0,600 Z" fill="#0A2E40" opacity=".35"/>
  <path d="M0,470 C260,440 500,475 760,455 C1020,435 1240,480 1440,455 L1440,600 L0,600 Z" fill="#06202E" opacity=".45"/>
  <!-- a small sail -->
  <g opacity=".5"><path d="M980,432 L980,398 L1004,432 Z" fill="#EAF4F6"/><path d="M980,432 L980,406 L962,432 Z" fill="#CFE3E8"/></g>
</svg>`;
  }

  // Minimalist Mediterranean vignettes used in the "scenery" band and About page.
  function scene(kind) {
    const uid = "s" + kind;
    const sky = (c1, c2) => `<defs><linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#${uid}sky)"/>`;
    if (kind === "goldenhour") {
      return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        ${sky("#F7C98B", "#E88B6A")}
        <circle cx="200" cy="150" r="46" fill="#FFF0CE" opacity=".95"/>
        <circle cx="200" cy="150" r="80" fill="#FFE2A8" opacity=".35"/>
        <rect y="168" width="400" height="132" fill="#2C6E88"/>
        <rect y="168" width="400" height="132" fill="url(#${uid}sky)" opacity=".15"/>
        <rect x="178" y="168" width="44" height="132" fill="#FFE7B0" opacity=".55"/>
        ${[188,210,235,262].map((y,i)=>`<rect x="40" y="${y}" width="320" height="2.5" rx="1" fill="#EAF4F6" opacity="${.3-i*0.05}"/>`).join("")}
      </svg>`;
    }
    if (kind === "cypress") {
      return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        ${sky("#BFE2EC", "#F3ECE0")}
        <rect y="150" width="400" height="60" fill="#5AA6C4" opacity=".7"/>
        <path d="M0,205 C120,180 260,215 400,195 L400,300 L0,300 Z" fill="#8FA86A"/>
        <path d="M0,230 C140,215 280,245 400,228 L400,300 L0,300 Z" fill="#6E7A52"/>
        ${[[70,210],[110,218],[300,205],[340,214],[250,222]].map(([x,y])=>`<path d="M${x},${y} q7,-46 14,0 q-7,10 -14,0Z" fill="#3C4A34"/><rect x="${x+5}" y="${y}" width="4" height="10" fill="#3C4A34"/>`).join("")}
      </svg>`;
    }
    // lemons
    return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      ${sky("#DCEAF0", "#EAF1E2")}
      <path d="M0,0 C120,60 260,20 400,70 L400,0 Z" fill="#7E9A5E" opacity=".5"/>
      ${[[90,110],[180,80],[150,170],[250,140],[310,90],[300,200],[80,210],[210,230]].map(([x,y],i)=>`
        <ellipse cx="${x-18}" cy="${y-16}" rx="22" ry="12" fill="#6E8B5A" transform="rotate(-30 ${x-18} ${y-16})"/>
        <ellipse cx="${x}" cy="${y}" rx="17" ry="21" fill="#F2D24B"/>
        <ellipse cx="${x-5}" cy="${y-6}" rx="6" ry="8" fill="#FBEFA6" opacity=".7"/>`).join("")}
    </svg>`;
  }

  return { bottle, waves, heroScene, scene };
})();
