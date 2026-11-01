"""Remata el lápiz azul marino: la foto acababa cortada en diagonal (estaba
pensada para salirse de la pantalla). Se corta perpendicular al eje, antes
del corte de la foto, y se dibuja el extremo: canto redondeado y la cara
del final con la madera y la mina asomando.

Uso: python scripts/lapiz-entero.py src/assets/decor/lapiz-marino.webp src/assets/decor/lapiz-entero.webp [vista-previa.png]
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
prev = sys.argv[3] if len(sys.argv) > 3 else None
im = cv2.imread(src, cv2.IMREAD_UNCHANGED).astype(np.float32)
h, w = im.shape[:2]
a = im[..., 3] / 255

# Eje del lápiz por componentes principales de la silueta
ys, xs = np.nonzero(a > 0.5)
c = np.array([xs.mean(), ys.mean()])
cov = np.cov(np.vstack([xs - c[0], ys - c[1]]))
val, vec = np.linalg.eigh(cov)
eje = vec[:, 1] if vec[0, 1] > 0 else -vec[:, 1]          # hacia el final (derecha)
nor = np.array([-eje[1], eje[0]])
yy, xx = np.mgrid[:h, :w].astype(np.float32)
t = (xx - c[0]) * eje[0] + (yy - c[1]) * eje[1]
n = (xx - c[0]) * nor[0] + (yy - c[1]) * nor[1]

# Grosor del cuerpo y dónde deja de estar entero
tt = t[a > 0.5]; nn = n[a > 0.5]
paso = np.arange(int(tt.min()), int(tt.max()))
anchos = np.array([np.ptp(nn[(tt >= k) & (tt < k + 1)]) if np.any((tt >= k) & (tt < k + 1)) else 0 for k in paso])
grosor = np.median(anchos[len(anchos) // 2: int(len(anchos) * 0.8)])
completo = paso[anchos >= grosor * 0.96]
fin = completo.max() - 6
medio = np.median(nn[(tt > fin - 40) & (tt < fin)])
r = grosor / 2
print('eje', eje, 'grosor', grosor, 'fin', fin)

# Silueta nueva: corte recto con el canto suavemente redondeado
radio = 3.0
dn = np.abs(n - medio)
esquina = np.clip(dn - (r - radio), 0, None)
borde = fin - (radio - np.sqrt(np.clip(radio ** 2 - esquina ** 2, 0, None)))
corte = np.clip(borde - t + 0.5, 0, 1)
alfa = a * corte

# Cara del final: una franja estrecha (se ve casi de canto) con madera y mina
# (una elipse muy aplastada: el lápiz se ve casi desde arriba)
ancho = 7.0
elipse = ((t - (borde - ancho)) / ancho) ** 2 + (dn / (r * 0.9)) ** 2
cara = np.clip((1 - elipse) * 4, 0, 1) * (t > borde - ancho)
madera = np.array([118, 170, 214], np.float32)  # BGR
mina = np.array([60, 58, 58], np.float32)
col = im[..., :3].copy()
cuerpoOsc = col * 0.78
dmina = np.sqrt(((t - (borde - ancho * 0.55)) / (ancho * 0.35)) ** 2 + (dn / (r * 0.3)) ** 2)
mezcla = np.where((dmina < 1)[..., None], mina, madera)
f = (cara * 0.95)[..., None]
col = col * (1 - f) + mezcla * f

out = np.dstack([np.clip(col, 0, 255), np.clip(alfa * 255, 0, 255)]).astype(np.uint8)
# Recorta el sobrante transparente
ys, xs = np.nonzero(out[..., 3] > 0)
out = out[: ys.max() + 4, : xs.max() + 4]
cv2.imwrite(dst, out, [cv2.IMWRITE_WEBP_QUALITY, 92])
if prev:
    k = out[..., 3:4] / 255
    big = (out[..., :3] * k + np.array([210, 224, 232]) * (1 - k)).astype(np.uint8)
    cv2.imwrite(prev, cv2.resize(big, None, fx=2, fy=2))
print('ok', out.shape)
