"""Retrato de Marian en blanco y negro, como un recorte de periódico.

Uso: python scripts/retrato.py source/retrato-marian.jpg src/assets/img/retrato-bn.webp
Necesita numpy y opencv-python-headless.
"""
import sys

import cv2
import numpy as np

im = cv2.imread(sys.argv[1])
h, w = im.shape[:2]
# Encuadre de medio cuerpo (cabeza y hombros)
crop = im[int(h * 0.06):int(h * 0.74), int(w * 0.26):int(w * 0.86)]
g = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
lo, hi = np.percentile(g, [1, 99.5])
g = np.clip((g - lo) / (hi - lo), 0, 1)
g = np.clip((g - 0.5) * 1.18 + 0.5, 0, 1) ** 1.05
# Papel de periódico: blancos algo grises y cálidos, negros no puros
paper = np.array([214, 222, 228], np.float32)
ink = np.array([38, 36, 36], np.float32)
out = ink * (1 - g[..., None]) + paper * g[..., None]
# Grano de impresión
rng = np.random.default_rng(2)
out += rng.normal(0, 6, g.shape)[..., None]
out = cv2.resize(np.clip(out, 0, 255).astype(np.uint8), (520, int(520 * crop.shape[0] / crop.shape[1])),
                 interpolation=cv2.INTER_AREA)
cv2.imwrite(sys.argv[2], out, [cv2.IMWRITE_WEBP_QUALITY, 84])
print(out.shape)
