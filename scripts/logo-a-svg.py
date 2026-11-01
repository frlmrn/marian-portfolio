"""Convierte el logo del reloj-gato (PNG negro) en un SVG vectorial.

Uso: python scripts/logo-a-svg.py <png> <svg> [radio-max]
  radio-max: si se indica, se descarta todo lo que quede fuera de ese radio
  (en píxeles del PNG), es decir, el aro negro exterior. Así queda solo el
  símbolo, sin círculo detrás.
Necesita numpy, pillow y potracer.
"""
import sys

import numpy as np
import potrace
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
r_max = float(sys.argv[3]) if len(sys.argv) > 3 else None

rgba = Image.open(src).convert('RGBA')
white = Image.new('RGBA', rgba.size, (255, 255, 255, 255))
img = Image.alpha_composite(white, rgba).convert('L')
w, h = img.size
ink = np.asarray(img) < 128
if r_max is not None:
    yy, xx = np.mgrid[:h, :w]
    ink &= np.hypot(xx - (w - 1) / 2, yy - (h - 1) / 2) < r_max

SCALE = 4  # trazado más suave
big = Image.fromarray(ink.astype(np.uint8) * 255).resize((w * SCALE, h * SCALE), Image.LANCZOS)
bmp = potrace.Bitmap(np.asarray(big) > 127)
path = bmp.trace(turdsize=8, alphamax=1.0, opticurve=True, opttolerance=0.2)

d = []
xs, ys = [], []
for curve in path:
    pts = [curve.start_point]
    seg_d = [f'M{curve.start_point.x / SCALE:.2f} {curve.start_point.y / SCALE:.2f}']
    for seg in curve.segments:
        if seg.is_corner:
            seg_d.append(f'L{seg.c.x / SCALE:.2f} {seg.c.y / SCALE:.2f}'
                         f'L{seg.end_point.x / SCALE:.2f} {seg.end_point.y / SCALE:.2f}')
            pts += [seg.c, seg.end_point]
        else:
            seg_d.append(f'C{seg.c1.x / SCALE:.2f} {seg.c1.y / SCALE:.2f} {seg.c2.x / SCALE:.2f} '
                         f'{seg.c2.y / SCALE:.2f} {seg.end_point.x / SCALE:.2f} {seg.end_point.y / SCALE:.2f}')
            pts += [seg.end_point]
    cx = [p.x / SCALE for p in pts]
    cy = [p.y / SCALE for p in pts]
    # potracer devuelve también el contorno del lienzo entero: se descarta
    if min(cx) <= 0.5 and min(cy) <= 0.5 and max(cx) >= w - 0.5 and max(cy) >= h - 0.5:
        continue
    d.append(''.join(seg_d) + 'Z')
    xs += cx
    ys += cy

# viewBox ajustado al símbolo, con un pequeño margen
pad = 2
x0, y0 = min(xs) - pad, min(ys) - pad
vw, vh = max(xs) - x0 + pad, max(ys) - y0 + pad
with open(dst, 'w', encoding='utf8') as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {vw:.1f} {vh:.1f}">'
            f'<path fill="currentColor" fill-rule="evenodd" d="{"".join(d)}"/></svg>\n')
