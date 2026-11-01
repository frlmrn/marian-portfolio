"""Pinta de azul marino el cuerpo del lápiz (la foto es de un lápiz amarillo
y Marian no quiere amarillo). Conserva la punta de madera y el grafito, y
las luces y sombras del lacado.

Uso: python scripts/lapiz-marino.py src/assets/decor/lapiz.webp src/assets/decor/lapiz-marino.webp [vista-previa.png]
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
prev = sys.argv[3] if len(sys.argv) > 3 else None
im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
bgr = im[..., :3].astype(np.float32)
hsv = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV).astype(np.float32)
H, S, V = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255

# Cuerpo lacado: todo lo que queda antes de la base del cono de madera
# (el lápiz va en diagonal; la base es perpendicular a su eje)
h, w = im.shape[:2]
yy, xx = np.mgrid[:h, :w].astype(np.float32)
eje = np.array([0.946, -0.326])
dist = (xx - 482) * eje[0] + (yy - 70) * eje[1]
cuerpo = np.clip(-dist / 3 + 0.5, 0, 1) * (im[..., 3] > 0)
cuerpo = cuerpo.astype(np.float32)

# Luz del lacado (0 sombra .. 1 brillo) llevada a la gama del azul marino
luz = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
luz = cv2.GaussianBlur(luz, (0, 0), 1.6)
luz = (luz - np.percentile(luz[cuerpo > 0.5], 5)) / (np.percentile(luz[cuerpo > 0.5], 99) - np.percentile(luz[cuerpo > 0.5], 5) + 1e-6)
luz = np.clip(cv2.GaussianBlur(luz, (0, 0), 2.2), 0, 1)[..., None]
oscuro = np.array([52, 30, 20], np.float32)   # BGR, casi negro azulado
marino = np.array([85, 50, 34], np.float32)   # #22325a aprox.
brillo = np.array([170, 130, 100], np.float32)
azul = np.where(luz < 0.6, oscuro + (marino - oscuro) * (luz / 0.6), marino + (brillo - marino) * np.clip((luz - 0.6) / 0.4, 0, 1) ** 1.6)
out = bgr * (1 - cuerpo[..., None]) + azul * cuerpo[..., None]
res = np.dstack([np.clip(out, 0, 255), im[..., 3]]).astype(np.uint8)
# Volteado: en la web la punta mira a la izquierda (hacia el recuadro)
res = res[:, ::-1].copy()
cv2.imwrite(dst, res, [cv2.IMWRITE_WEBP_QUALITY, 92])
if prev:
    a = res[..., 3:4] / 255
    cv2.imwrite(prev, (res[..., :3] * a + np.array([210, 224, 232]) * (1 - a)).astype(np.uint8))
print('ok')
