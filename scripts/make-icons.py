#!/usr/bin/env python3
"""Generate Xinjing PWA icons from the 心經 seal design.

Draws the vermilion rounded-square seal (white carved 心 / 經 glyphs in
Ma Shan Zheng) on rice-paper background at several sizes.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# NOTE: Ma Shan Zheng (the web brush font) has no glyph for the traditional
# 經 (U+7D93) — only simplified 经. Yuji Syuku (OFL, brush calligraphy style)
# covers both 心 and 經 in traditional form, so the seal glyphs are drawn
# with it. Download:
#   curl -sL https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/yujisyuku/YujiSyuku-Regular.ttf \
#     -o /tmp/YujiSyuku-Regular.ttf
TTF = os.environ.get("ICON_TTF", "/tmp/YujiSyuku-Regular.ttf")
OUT_DIR = os.path.join(ROOT, "public")

PAPER = (246, 241, 229, 255)
VERMILION = (200, 68, 44, 255)
CARVE = (253, 251, 245, 255)
BORDER = (253, 251, 245, 140)


def draw_seal(size: int, seal_frac: float) -> Image.Image:
    img = Image.new("RGBA", (size, size), PAPER)
    d = ImageDraw.Draw(img)
    k = size * seal_frac / 464
    # centered seal rect ±232k
    cx = cy = size / 2
    x0, y0 = cx - 232 * k, cy - 232 * k
    x1, y1 = cx + 232 * k, cy + 232 * k
    d.rounded_rectangle([x0, y0, x1, y1], radius=104 * k, fill=VERMILION)
    # inner carved border, offset 32k
    d.rounded_rectangle(
        [x0 + 32 * k, y0 + 32 * k, x1 - 32 * k, y1 - 32 * k],
        radius=84 * k,
        outline=BORDER,
        width=max(1, round(10 * k)),
    )
    font = ImageFont.truetype(TTF, round(168 * k))
    d.text((cx, y0 + 154 * k), "心", font=font, fill=CARVE, anchor="mm")
    d.text((cx, y0 + 318 * k), "經", font=font, fill=CARVE, anchor="mm")
    return img


def main() -> None:
    if not os.path.exists(TTF):
        sys.exit(f"missing font: {TTF}")
    from fontTools.ttLib import TTFont

    cmap = TTFont(TTF).getBestCmap()
    for ch in "心經":
        if ord(ch) not in cmap:
            sys.exit(f"font {TTF} lacks glyph {ch} (U+{ord(ch):04X})")
    os.makedirs(OUT_DIR, exist_ok=True)
    jobs = [
        ("icon-512.png", 512, 464 / 512),
        ("icon-192.png", 192, 464 / 512),
        ("apple-touch-icon.png", 180, 464 / 512),
        ("icon-maskable-512.png", 512, 0.66),
    ]
    for name, size, frac in jobs:
        dest = os.path.join(OUT_DIR, name)
        draw_seal(size, frac).save(dest)
        print(f"wrote {dest} ({size}x{size}, seal_frac={frac:.4f})")


if __name__ == "__main__":
    main()
