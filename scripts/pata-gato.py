"""Quita el fondo de la foto de la pata de gato y conserva su sombra natural.

Uso: python scripts/pata-gato.py source/pata-gato.png src/assets/decor/pata-gato.webp [vista-previa.png]
Necesita numpy y opencv-python-headless.

El fondo de la foto es gris neutro y el pelo naranja saturado: la
transparencia sale de la saturación (refinada con GrabCut), los bordes se
descontaminan del gris del fondo y la sombra de contacto se guarda como
tinta oscura semitransparente, para que caiga sobre el papel de la web.
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
preview = sys.argv[3] if len(sys.argv) > 3 else None

im = cv2.imread(src)
H, W = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
S = hsv[..., 1].astype(np.float32)
V = hsv[..., 2].astype(np.float32)

# 1. Máscara dura con GrabCut. La sombra bajo la pata es anaranjada (luz
#    reflejada) pero lisa; el pelo tiene textura: se separan por las dos cosas.
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
mean = cv2.blur(gray, (5, 5))
texture = np.sqrt(np.maximum(cv2.blur(gray * gray, (5, 5)) - mean * mean, 0))
mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
mask[(S > 45) & (texture > 3)] = cv2.GC_PR_FGD
mask[(S > 110) & (texture > 5)] = cv2.GC_FGD
mask[(S < 10) & (V > 200)] = cv2.GC_BGD
mask[(S < 110) & (texture < 1.6)] = cv2.GC_BGD
bg_m = np.zeros((1, 65))
fg_m = np.zeros((1, 65))
cv2.grabCut(im, mask, None, bg_m, fg_m, 6, cv2.GC_INIT_WITH_MASK)
hard = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1, 0).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(hard)
hard = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))

# 2. Transparencia suave en el borde del pelo, según la saturación
soft = np.clip((S - 14) / 46, 0, 1) * np.clip((texture - 1.2) / 3, 0, 1)
band = cv2.dilate(hard, np.ones((9, 9), np.uint8)) - cv2.erode(hard, np.ones((9, 9), np.uint8))
alpha = np.where(band == 1, soft, hard.astype(np.float32))
alpha = np.where(cv2.dilate(hard, np.ones((9, 9), np.uint8)) == 0, 0, alpha)
alpha = cv2.GaussianBlur(alpha, (0, 0), 0.6)

# 3. Fondo estimado (gris con un leve degradado): plano ajustado a los píxeles neutros
neutral = (S < 8) & (alpha < 0.02)
ys, xs = np.nonzero(neutral)
A = np.c_[xs, ys, np.ones_like(xs)]
coef = np.linalg.lstsq(A, im[ys, xs].astype(np.float32), rcond=None)[0]
yy, xx = np.mgrid[:H, :W]
bg = (np.dstack([xx, yy, np.ones_like(xx)]).reshape(-1, 3) @ coef).reshape(H, W, 3)

# 4. Color del pelo sin el fondo en los bordes. El fondo local (que incluye la
#    sombra anaranjada) se reconstruye rellenando la zona de la pata.
grown = cv2.dilate(hard, np.ones((15, 15), np.uint8))
local_bg = cv2.inpaint(im, grown, 12, cv2.INPAINT_TELEA).astype(np.float32)
a3 = np.maximum(alpha, 0.35)[..., None]  # sin dividir por casi cero en los mechones finos
fur = np.clip((im - (1 - a3) * local_bg) / a3, 0, 255)

# 5. Sombra: cuánto se oscurece el fondo fuera de la pata
dark = np.clip(1 - V / np.maximum(bg.mean(2), 1), 0, 1)
shadow = np.clip((dark - 0.02) / 0.5, 0, 1) * (1 - alpha)
shadow = cv2.GaussianBlur(shadow, (0, 0), 1.5)
shadow_rgb = np.array([20, 28, 45], np.float32)  # sombra cálida (BGR)

out_a = alpha + shadow * 0.85
out_rgb = (fur * alpha[..., None] + shadow_rgb * (shadow * 0.85)[..., None]) / np.maximum(out_a, 1e-3)[..., None]
rgba = np.dstack([np.clip(out_rgb, 0, 255), np.clip(out_a, 0, 1) * 255]).astype(np.uint8)

# El antebrazo entra por la izquierda con un escalón en el pelo de arriba:
# se descarta ese primer tramo; el borde recto resultante queda fuera de pantalla.
rgba = rgba[:, 95:]

# Recorte al contenido
ys, xs = np.nonzero(rgba[..., 3] > 6)
x1, y0, y1 = xs.max() + 4, max(ys.min() - 4, 0), min(ys.max() + 5, H)
rgba = rgba[y0:y1, : x1 + 1]
cv2.imwrite(dst, rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
print('tamaño', rgba.shape[1], 'x', rgba.shape[0])

if preview:
    paper = np.full(rgba.shape[:2] + (3,), (205, 221, 231), np.float32)
    a = rgba[..., 3:4] / 255
    cv2.imwrite(preview, (rgba[..., :3] * a + paper * (1 - a)).astype(np.uint8))
