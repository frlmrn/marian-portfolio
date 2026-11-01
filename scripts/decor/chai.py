"""Convierte la taza de café de la imagen en un chai latte.

Uso: python scripts/decor/chai.py src/assets/decor/cafe.webp src/assets/decor/chai.webp
Necesita numpy y opencv-python-headless.

Se conserva la taza tal cual y solo se recolorea el líquido: espuma de leche
tostada (más clara en el centro), las burbujas de la crema original como
textura y un poco de canela espolvoreada.
"""
import json
import sys

import cv2
import numpy as np

sys.path.insert(0, 'scripts/decor')
import regiones as R  # noqa: E402

src, dst = sys.argv[1], sys.argv[2]
rgba = cv2.imread(src, cv2.IMREAD_UNCHANGED)
H, W = rgba.shape[:2]
bgr = rgba[..., :3].astype(np.float32)
hsv = cv2.cvtColor(rgba[..., :3], cv2.COLOR_BGR2HSV)
S, V = hsv[..., 1].astype(np.float32), hsv[..., 2].astype(np.float32)

# Centro de la taza en coordenadas de la capa (exportada a 1,5×)
capas = json.load(open('src/assets/decor/capas.json', encoding='utf8'))
scale = W / capas['cafe']['w']
cx = (R.CUP_CIRCLE[0] - capas['cafe']['x']) * scale
cy = (R.CUP_CIRCLE[1] - capas['cafe']['y']) * scale
yy, xx = np.mgrid[:H, :W]
r = np.hypot(xx - cx, yy - cy)

# Líquido: por la perspectiva no es concéntrico con la boca de la taza. Se
# toma lo oscuro o muy saturado (café y crema; la pared interior es menos
# saturada), se rellena y se le ajusta una elipse.
inside = rgba[..., 3] > 200
seed = (((S > 90) & (V < 150)) | (V < 60)) & inside
seed = cv2.morphologyEx(seed.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(seed)
seed = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
cnts, _ = cv2.findContours(seed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
pts = max(cnts, key=len)[:, 0, :]
# solo el contorno real (no el corte del borde derecho de la capa)
pts = pts[(pts[:, 0] < W - 3) & (pts[:, 1] > 2) & (pts[:, 1] < H - 3)]
(ex, ey), (ew, eh), ea = cv2.fitEllipse(pts.astype(np.float32))
cx, cy = ex, ey  # el degradado de la espuma se centra en el líquido
r = np.hypot(xx - cx, yy - cy)
liquid_mask = np.zeros((H * 4, W * 4), np.uint8)
cv2.ellipse(liquid_mask, ((ex * 4, ey * 4), (ew * 4 - 4, eh * 4 - 4), ea), 255, -1)
liquid = cv2.resize(liquid_mask, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
r_in = (ew + eh) / 4
soft = liquid * inside

# Color de chai latte: tostado en el borde, espuma clara en el centro (BGR)
edge_c = np.array([88, 138, 186], np.float32)
foam_c = np.array([168, 202, 228], np.float32)
t = np.clip(1 - r / r_in, 0, 1) ** 0.6
base = edge_c[None, None] * (1 - t[..., None]) + foam_c[None, None] * t[..., None]

# Textura de burbujas a partir de la crema original
L = cv2.cvtColor(rgba[..., :3], cv2.COLOR_BGR2GRAY).astype(np.float32)
detail = L - cv2.GaussianBlur(L, (0, 0), 4)
base += detail[..., None] * 0.9

# Sombra del menisco junto a la loza
meniscus = np.clip((r - (r_in - 10)) / 10, 0, 1)
base *= (1 - 0.28 * meniscus)[..., None]

# Canela espolvoreada en el centro
rng = np.random.default_rng(7)
dust = np.zeros((H, W), np.float32)
for _ in range(520):
    ang = rng.uniform(0, 2 * np.pi)
    rad = abs(rng.normal(0, r_in * 0.32))
    x, y = int(cx + rad * np.cos(ang)), int(cy + rad * np.sin(ang))
    if 0 <= x < W and 0 <= y < H:
        cv2.circle(dust, (x, y), int(rng.integers(1, 3)), float(rng.uniform(0.35, 0.8)), -1)
dust = cv2.GaussianBlur(dust, (0, 0), 0.7) * liquid
cinnamon = np.array([40, 74, 122], np.float32)
base = base * (1 - dust[..., None]) + cinnamon[None, None] * dust[..., None]

out = bgr * (1 - soft[..., None]) + np.clip(base, 0, 255) * soft[..., None]
rgba[..., :3] = np.clip(out, 0, 255).astype(np.uint8)
cv2.imwrite(dst, rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
print('elipse del líquido', round(ex), round(ey), round(ew), round(eh), round(ea))
