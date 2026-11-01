"""Recorta la pata de gato atigrada (foto sobre fondo blanco) y la gira para
que entre desde el borde izquierdo de la pantalla.

Uso: python scripts/pata-atigrada.py source/pata-atigrada.png src/assets/decor/pata-gato.webp [vista-previa.png]
Necesita numpy y opencv-python-headless.

El fondo es blanco puro: la transparencia sale de lo que cada píxel se
aleja del blanco (refinada con GrabCut para no perder las puntas claras
del pelo) y los bordes se descontaminan del blanco. El brazo toca el borde
superior de la foto; al girarla 90° queda pegado al borde izquierdo.
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
preview = sys.argv[3] if len(sys.argv) > 3 else None

im = cv2.imread(src)
H, W = im.shape[:2]
f = im.astype(np.float32)
d = (255 - f).max(axis=2)  # cuánto se aleja del blanco

mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
mask[d > 25] = cv2.GC_PR_FGD
mask[d > 60] = cv2.GC_FGD
mask[d < 4] = cv2.GC_BGD
bg_m = np.zeros((1, 65))
fg_m = np.zeros((1, 65))
cv2.grabCut(im, mask, None, bg_m, fg_m, 5, cv2.GC_INIT_WITH_MASK)
hard = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1, 0).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(hard)
hard = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))

# Alfa suave: dentro de la máscara, opaco; en el borde, según el blanco
# (sin dilatar y con el borde comido 2 px: las puntas casi blancas del pelo
#  dejaban un halo claro sobre el papel)
near = cv2.erode(hard, np.ones((3, 3), np.uint8), iterations=2)
soft = np.clip((d - 18) / 55, 0, 1)
inner = cv2.erode(hard, np.ones((9, 9), np.uint8)).astype(np.float32)
alpha = np.maximum(inner, soft * near)
alpha = cv2.GaussianBlur(alpha, (0, 0), 0.6) * near

# Descontaminar: quitar el blanco mezclado en los pelos del borde
a = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((f - (1 - a) * 255) / a, 0, 255)
rgb = np.where(alpha[..., None] > 0.02, rgb, 0)

rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
ys, xs = np.nonzero(alpha > 0.02)
rgba = rgba[0:ys.max() + 3, max(xs.min() - 3, 0):xs.max() + 3]
rgba = cv2.rotate(rgba, cv2.ROTATE_90_COUNTERCLOCKWISE)
cv2.imwrite(dst, rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
print('pata', rgba.shape[1], 'x', rgba.shape[0])

if preview:
    bg = np.full(rgba.shape[:2] + (3,), (205, 221, 231), np.float32)
    al = rgba[..., 3:4] / 255
    cv2.imwrite(preview, (rgba[..., :3] * al + bg * (1 - al)).astype(np.uint8))
