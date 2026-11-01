"""Prepara la textura de la mesa a partir de «Wood table large» de Poly Haven
(CC0, vía Wikimedia Commons). Se reduce a 2400 px (sigue siendo continua al
repetirse) y se acerca su luz y su color a la foto de mesa que eligió Marian.

Uso: python scripts/mesa.py source/mesa-m1-polyhaven.jpg source/mesa-madera.webp src/assets/textures/mesa.webp
"""
import sys

import cv2
import numpy as np

src, ref, dst = sys.argv[1:4]
im = cv2.resize(cv2.imread(src), (2400, 2400), interpolation=cv2.INTER_AREA)
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
r = cv2.cvtColor(cv2.imread(ref), cv2.COLOR_BGR2LAB).astype(np.float32)
for c, k in ((0, 0.7), (1, 0.8), (2, 0.8)):  # luz y tono, a medio camino
    m, s = lab[..., c].mean(), lab[..., c].std()
    rm = r[..., c].mean()
    lab[..., c] = lab[..., c] + (rm - m) * k
    print('canal', c, round(m, 1), '->', round(rm, 1), 'std', round(s, 1))
out = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 80])
