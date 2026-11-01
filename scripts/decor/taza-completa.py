"""Completa la taza de chai (en la imagen solo se ve un tercio) para que
pueda entrar entera en la pantalla.

Uso: python scripts/decor/taza-completa.py src/assets/decor/chai.webp src/assets/decor/taza.webp [vista-previa]
Necesita numpy y opencv-python-headless.

La taza vista desde arriba es casi simétrica respecto a su centro: se pasa
a coordenadas polares, se toma el sector visible del borde (loza, pared y
anillo de espuma) y se repite en espejo hasta dar la vuelta completa. El
centro del líquido, que nunca se ve, se rellena con la espuma del chai.
"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
prev = sys.argv[3] if len(sys.argv) > 3 else None

a = cv2.imread(src, cv2.IMREAD_UNCHANGED).astype(np.float32)
CX, CY, R = 217.0, 134.0, 211.0  # centro y radio del borde (capa a 1,5×)
N_ANG = 1440
NR = int(R) + 1

# Lienzo cuadrado centrado en la taza
S = 2 * NR
canvas = np.zeros((S, S, 4), np.float32)
ox, oy = int(round(NR - CX)), int(round(NR - CY))
h, w = a.shape[:2]
# recorte de lo que cae fuera del lienzo (solo fondo transparente)
sx, sy = max(0, -ox), max(0, -oy)
ex, ey = min(w, S - ox), min(h, S - oy)
canvas[oy + sy:oy + ey, ox + sx:ox + ex] = a[sy:ey, sx:ex]

polar = cv2.warpPolar(canvas, (NR, N_ANG), (NR, NR), R, cv2.WARP_POLAR_LINEAR)
alpha = polar[..., 3]

# Ángulos donde el anillo exterior (loza + pared + espuma) está completo
R_IN = 128
valid = (alpha[:, R_IN:int(R * 0.97)] > 200).all(axis=1)
idx = np.nonzero(valid)[0]
# sector contiguo más largo
runs = np.split(idx, np.nonzero(np.diff(idx) > 1)[0] + 1)
sector = max(runs, key=len)
s0, s1 = sector[0] + 6, sector[-1] - 6
L = s1 - s0
print('sector visible', s0 * 360 // N_ANG, 'a', s1 * 360 // N_ANG, 'grados')

# Vuelta completa repitiendo el sector en espejo (ida y vuelta, sin costuras)
out = np.zeros_like(polar)
for k in range(N_ANG):
    t = (k - s0) % (2 * L)
    j = s0 + (t if t < L else 2 * L - t)
    out[k] = polar[j]
out[:, :R_IN, 3] = 0

full = cv2.warpPolar(out, (S, S), (NR, NR), R, cv2.WARP_POLAR_LINEAR | cv2.WARP_INVERSE_MAP)

# Centro del líquido: espuma de chai con burbujas y canela
yy, xx = np.mgrid[:S, :S]
r = np.hypot(xx - NR, yy - NR)
t = np.clip(1 - r / (R_IN + 6), 0, 1) ** 0.7
edge_c = np.array([150, 186, 214], np.float32)  # BGR
foam_c = np.array([170, 203, 229], np.float32)
liquid = edge_c * (1 - t[..., None]) + foam_c * t[..., None]
rng = np.random.default_rng(5)
noise = cv2.GaussianBlur(rng.normal(0, 1, (S, S)).astype(np.float32), (0, 0), 1.6) * 9
liquid += noise[..., None]
dust = np.zeros((S, S), np.float32)
for _ in range(700):
    ang = rng.uniform(0, 2 * np.pi)
    rad = abs(rng.normal(0, R_IN * 0.38))
    x, y = int(NR + rad * np.cos(ang)), int(NR + rad * np.sin(ang))
    if 0 <= x < S and 0 <= y < S:
        cv2.circle(dust, (x, y), int(rng.integers(1, 3)), float(rng.uniform(0.3, 0.75)), -1)
dust = cv2.GaussianBlur(dust, (0, 0), 0.7)
cinnamon = np.array([40, 74, 122], np.float32)
liquid = liquid * (1 - dust[..., None]) + cinnamon * dust[..., None]

blend = np.clip((r - (R_IN - 2)) / 10, 0, 1)[..., None]  # unión suave con el anillo
inside = (r < R).astype(np.float32)[..., None]
rgb = full[..., :3] * blend + liquid * (1 - blend)
alpha_out = np.where(r < R_IN + 4, 255, full[..., 3])
alpha_out = alpha_out * cv2.GaussianBlur((r < R - 0.5).astype(np.float32), (0, 0), 0.8)
rgba = np.dstack([np.clip(rgb * inside, 0, 255), np.clip(alpha_out, 0, 255)]).astype(np.uint8)
cv2.imwrite(dst, rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
print('taza', S, 'x', S)

if prev:
    bg = np.full((S, S, 3), (205, 221, 231), np.float32)
    al = rgba[..., 3:4] / 255
    cv2.imwrite(prev, (rgba[..., :3] * al + bg * (1 - al)).astype(np.uint8))
