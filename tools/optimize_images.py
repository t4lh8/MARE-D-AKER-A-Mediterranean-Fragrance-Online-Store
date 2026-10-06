#!/usr/bin/env python3
"""
MARE D'AKER - image build pipeline.

The brand imagery arrives as large (2-3 MB) PNG exports with inconsistent names.
This script turns them into clean, web-ready assets:

  * resizes each image to a sensible maximum width for its role on the page,
  * writes both a modern WebP and a JPEG fallback (the site serves WebP with a
    <picture> fallback),
  * renames everything to a predictable scheme,
  * builds a square favicon from the logo,
  * writes assets/images/manifest.json so the result is auditable.

Usage:
    python tools/optimize_images.py                 # read from tools/source-images
    python tools/optimize_images.py --source "C:/path/to/raw"

Only the optimized output is committed to the repo; the heavy source PNGs stay
out of version control (see tools/source-images/.gitignore).

Requires: Pillow  ->  pip install pillow
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image

# source filename  ->  (output name, role, max width in px)
SPEC = {
    "hero-santorini-collection.webp.png": ("hero-desktop", "hero", 1800),
    "hero-mobile-santorini.webp.png":     ("hero-mobile", "hero", 900),
    "greece-azure-card.webp.png":         ("destination-greece", "destination", 900),
    "italy-capri-card.webp.png":          ("destination-italy", "destination", 900),
    "malta-valletta-card.webp.png":       ("destination-malta", "destination", 900),
    "morocco-sirocco-card.webp.png":      ("destination-morocco", "destination", 900),
    "spain-solano-card.webp.png":         ("destination-spain", "destination", 900),
    "turkey-bodrum-card.webp.png":        ("destination-turkey", "destination", 900),
    "journal-aegean.webp.png":            ("journal-aegean", "journal", 900),
    "journal-citrus.webp.png":            ("journal-citrus", "journal", 900),
    "journal-valletta.webp.png":          ("journal-valletta", "journal", 900),
    "mare-daker-box-open.webp.png":       ("packaging-box", "story", 1400),
    "mare-daker-postcards.webp.png":      ("story-postcards", "story", 1400),
    "story-flatlay.webp.png":             ("story-flatlay", "story", 900),
    "logo.png":                           ("logo", "brand", 600),
    "mediterranean-map-texture.webp.png": ("map-mediterranean", "map", 1600),
}

# Crop box for the brand emblem (fraction of the square logo): left, top, right, bottom.
EMBLEM_BOX = (0.26, 0.19, 0.74, 0.67)

JPEG_QUALITY = 82
WEBP_QUALITY = 80
FAVICON_SIZE = 64

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "images"


def load_rgb(path: Path) -> Image.Image:
    """Open an image and flatten any transparency onto white."""
    img = Image.open(path)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img).convert("RGB")
    else:
        img = img.convert("RGB")
    return img


def resize_to_width(img: Image.Image, max_w: int) -> Image.Image:
    if img.width <= max_w:
        return img
    h = round(img.height * max_w / img.width)
    return img.resize((max_w, h), Image.LANCZOS)


def kb(path: Path) -> int:
    return round(path.stat().st_size / 1024)


def main() -> None:
    ap = argparse.ArgumentParser(description="Build web-ready MARE D'AKER images.")
    ap.add_argument("--source", default=str(ROOT / "tools" / "source-images"),
                    help="folder with the raw brand PNGs")
    args = ap.parse_args()

    source = Path(args.source)
    if not source.is_dir():
        raise SystemExit(f"Source folder not found: {source}\n"
                         f"Drop the raw brand images there, or pass --source.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    missing = []

    for src_name, (out_name, role, max_w) in SPEC.items():
        src = source / src_name
        if not src.exists():
            missing.append(src_name)
            continue

        img = resize_to_width(load_rgb(src), max_w)

        jpg = OUT_DIR / f"{out_name}.jpg"
        webp = OUT_DIR / f"{out_name}.webp"
        img.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        img.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)

        manifest.append({
            "name": out_name, "role": role,
            "width": img.width, "height": img.height,
            "jpg_kb": kb(jpg), "webp_kb": kb(webp),
            "source": src_name,
        })
        print(f"  {out_name:22} {img.width}x{img.height}  "
              f"jpg {kb(jpg):>4} KB  webp {kb(webp):>4} KB")

    # Square favicon from the logo, if present.
    logo_src = source / "logo.png"
    if logo_src.exists():
        logo = load_rgb(logo_src)
        side = min(logo.size)
        left = (logo.width - side) // 2
        top = (logo.height - side) // 2
        fav = logo.crop((left, top, left + side, top + side)).resize(
            (FAVICON_SIZE, FAVICON_SIZE), Image.LANCZOS)
        fav_path = OUT_DIR / "favicon.png"
        fav.save(fav_path, "PNG", optimize=True)
        print(f"  {'favicon':22} {FAVICON_SIZE}x{FAVICON_SIZE}  png {kb(fav_path):>4} KB")

        # Brand emblem (star + arch + waves) for the small header/footer mark.
        lw, lh = logo.size
        box = (int(lw * EMBLEM_BOX[0]), int(lh * EMBLEM_BOX[1]),
               int(lw * EMBLEM_BOX[2]), int(lh * EMBLEM_BOX[3]))
        mark = logo.crop(box).resize((220, 220), Image.LANCZOS)
        mark_png = OUT_DIR / "logo-mark.png"
        mark_webp = OUT_DIR / "logo-mark.webp"
        mark.save(mark_png, "PNG", optimize=True)
        mark.save(mark_webp, "WEBP", quality=90, method=6)
        print(f"  {'logo-mark':22} 220x220  png {kb(mark_png):>4} KB")

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(sorted(manifest, key=lambda m: (m["role"], m["name"])), indent=2),
        encoding="utf-8")

    total = sum(m["webp_kb"] for m in manifest)
    print(f"\nWrote {len(manifest)} images to {OUT_DIR.relative_to(ROOT)} "
          f"({total} KB total as WebP).")
    if missing:
        print(f"Skipped {len(missing)} missing source file(s): {', '.join(missing)}")


if __name__ == "__main__":
    main()
