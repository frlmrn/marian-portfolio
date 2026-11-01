"""Separa la decoración de la imagen 1 en capas con transparencia.

Uso: python scripts/decor/extraer.py <carpeta-salida> <carpeta-depuracion>
Necesita numpy y opencv-python-headless.
"""
import json
import sys

import cv2
import numpy as np

sys.path.insert(0, 'scripts/decor')
import regiones as R  # noqa: E402

OUT, DBG = sys.argv[1], sys.argv[2]
SRC = cv2.imread('source/image 39.png')
H, W = SRC.shape[:2]
SCALE = 1.5  # se exporta algo mayor, con Lanczos y un enfoque suave


def poly(p):
    m = np.zeros((H, W), np.uint8)
    cv2.fillPoly(m, [np.array(p, np.int32)], 1)
    return m


def disk(r):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def grabcut(region, holes=(), band=22, seeds_fg=None, seeds_bg=None):
    m = poly(region)
    mask = np.full((H, W), cv2.GC_BGD, np.uint8)
    mask[cv2.dilate(m, disk(band)) == 1] = cv2.GC_PR_BGD
    mask[m == 1] = cv2.GC_PR_FGD
    mask[cv2.erode(m, disk(band)) == 1] = cv2.GC_FGD
    if seeds_bg is not None:
        mask[(seeds_bg == 1) & (m == 1)] = cv2.GC_BGD
    if seeds_fg is not None:
        mask[(seeds_fg == 1) & (m == 1)] = cv2.GC_FGD
    for h in holes:
        mask[poly(h) == 1] = cv2.GC_BGD
    bg = np.zeros((1, 65), np.float64)
    fg = np.zeros((1, 65), np.float64)
    cv2.grabCut(SRC, mask, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
    return np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1, 0).astype(np.uint8)


def clean(m, close=2, open_=1, keep_largest=False):
    if close:
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, disk(close))
    if open_:
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, disk(open_))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    if keep_largest and n > 1:
        i = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        return (lab == i).astype(np.uint8)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 60:
            keep[lab == i] = 1
    return keep


hsv = cv2.cvtColor(SRC, cv2.COLOR_BGR2HSV)
Hh, Ss, Vv = [hsv[..., i].astype(int) for i in range(3)]
holes = [R.CARD01, R.CARD02, R.CARD03, R.HEADER]
u8 = lambda b: b.astype(np.uint8)  # noqa: E731

def sprig(region, fg, bg, extra_fg=None):
    """Ramita: parte de semillas de color y por defecto todo es fondo."""
    m = poly(region)
    mask = np.full((H, W), cv2.GC_BGD, np.uint8)
    mask[m == 1] = cv2.GC_PR_BGD
    mask[(m == 1) & (bg == 1)] = cv2.GC_BGD
    f = cv2.erode(u8(fg), disk(1))
    if extra_fg is not None:
        f |= extra_fg
    mask[(m == 1) & (f == 1)] = cv2.GC_FGD
    b = np.zeros((1, 65))
    g = np.zeros((1, 65))
    cv2.grabCut(SRC, mask, None, b, g, 8, cv2.GC_INIT_WITH_MASK)
    r = np.where((mask == 1) | (mask == 3), 1, 0).astype(np.uint8)
    r = clean(r, close=2, open_=0)
    holes_ = clean(1 - r, close=0, open_=0)  # huecos pequeños dentro de la ramita
    return np.where(holes_ == 1, 0, 1).astype(np.uint8) & cv2.dilate(r, disk(3))


def trim(m, remove, keep=None, open_r=1, close_r=2):
    """Quita papel o sombras pegadas y conserva solo lo conectado a la ramita."""
    r = u8(remove)
    if keep is not None:
        r &= 1 - keep
    m = m.copy()
    m[r == 1] = 0
    if open_r:
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, disk(open_r))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, disk(close_r))
    n, lab, stt, _ = cv2.connectedComponentsWithStats(m)
    big = 1 + np.argmax(stt[1:, cv2.CC_STAT_AREA])
    near = cv2.dilate(u8(lab == big), disk(6))
    k = np.zeros_like(m)
    for i in range(1, n):
        if i == big or (near[lab == i].any() and stt[i, cv2.CC_STAT_AREA] > 25):
            k[lab == i] = 1
    return k


brown = (Ss > 110) & (Vv < 185) & (Hh >= 8) & (Hh <= 30)
dark_stem = (Vv < 95) & (Ss > 60)
green = (Hh > 22) & (Hh < 60) & (Ss > 70) & (Vv < 150)
paper = (Ss < 75) & (Vv > 165)
flowers = np.zeros((H, W), np.uint8)  # flores blancas de la ramita verde (a mano)
cv2.ellipse(flowers, (33, 729), (14, 10), 0, 0, 360, 1, -1)
cv2.ellipse(flowers, (38, 807), (15, 12), 0, 0, 360, 1, -1)
flowers = cv2.dilate(flowers, disk(3))
shadow_like = (Hh >= 8) & (Hh <= 24) & (Ss >= 35) & (Ss <= 140) & (Vv > 105)

sprig_tl = trim(sprig(R.SPRIG_TL, brown | dark_stem, paper), np.zeros((H, W), bool), open_r=0, close_r=1)
sprig_bl = trim(sprig(R.SPRIG_BL, green | dark_stem, (Ss > 60) & (Ss < 115) & (Vv > 190), extra_fg=flowers),
                shadow_like, flowers | u8(green))
sprig_br = trim(sprig(R.SPRIG_BR, brown | dark_stem, paper | (((Hh < 8) | (Hh > 165)) & (Ss > 80))),
                (Ss < 95) & (Vv > 105))
cx, cy, cr = R.CUP_CIRCLE
cup = np.zeros((H, W), np.uint8)
cv2.circle(cup, (int(round(cx * 8)), int(round(cy * 8))), int(round(cr * 8)), 1, -1, cv2.LINE_8, 3)
brass = u8((Hh >= 8) & (Hh <= 32) & (Ss > 85) & (Vv > 35))
clip = trim(brass & poly(R.CLIP), np.zeros((H, W), bool), open_r=1, close_r=3)
pencil = poly(R.PENCIL)

# Grupos planos (papeles, mapas y fotos de los bordes)
note = clean(grabcut(R.NOTE, holes, band=6), keep_largest=True)
left = clean(grabcut(R.LEFT, holes, band=10), close=3) & (1 - note)
right = clean(grabcut(R.RIGHT_TOP, holes, band=10) | grabcut(R.RIGHT_BOTTOM, holes, band=10), close=3)


def stamp(box, span, covered):
    """Sello de tinta roja: color fijo + transparencia según la intensidad del rojo
    (medida respecto al papel de alrededor, porque el sello izquierdo está muy gastado)."""
    x0, y0, x1, y1 = box
    crop = SRC[y0:y1, x0:x1].astype(np.float32)
    b, g, r = crop[..., 0], crop[..., 1], crop[..., 2]
    redness = r - (g + b) / 2
    red = np.clip((redness - np.median(redness) - 4) / span, 0, 1)
    red[covered[y0:y1, x0:x1] == 1] = 0  # donde ya hay papel o foto recortada, el sello ya va dentro
    red = cv2.GaussianBlur(red, (0, 0), 0.6)
    rgba = np.zeros((y1 - y0, x1 - x0, 4), np.float32)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 52, 40, 168  # BGR de la tinta
    rgba[..., 3] = red * 235
    return rgba.astype(np.uint8)


# Nota rasgada: se borra la letra azul y se rellena con el papel de alrededor
ink = u8((Hh > 100) & (Hh < 135) & (Ss > 60) & (Vv < 200))
ink = cv2.dilate(ink & note, disk(2))
note_img = cv2.inpaint(SRC, ink, 4, cv2.INPAINT_TELEA)

# Relleno de lo que queda debajo de los objetos que se mueven
under_left = cv2.dilate(sprig_tl | sprig_bl | pencil, disk(3)) & left
under_right = cv2.dilate(sprig_br | cup | clip, disk(3)) & right
def fill_texture(img, hole, layer, cell=40, reach=150, step=3):
    """Tampón de clonar por teselas: el hueco se recorre en cuadros pequeños y
    cada uno se tapa con el trozo cercano del mismo papel o mapa que mejor
    encaja con lo que lo rodea (ya rellenado incluido). Conserva la textura
    real en lugar de dejar un borrón."""
    out = img.astype(np.float32).copy()
    known = (layer == 1) & (hole == 0)
    original = known.copy()  # solo se copia desde papel original, nunca desde un relleno
    used = []
    todo = hole.astype(bool) & (layer == 1)
    ys, xs = np.nonzero(todo)
    if not len(ys):
        return img
    cells = [(cy, cx) for cy in range(ys.min(), ys.max() + 1, cell) for cx in range(xs.min(), xs.max() + 1, cell)]
    for cy, cx in cells:
        part = np.zeros((H, W), np.uint8)
        part[cy:cy + cell, cx:cx + cell] = todo[cy:cy + cell, cx:cx + cell]
        if part.sum() < 4:
            continue
        py, px = np.nonzero(part)
        ring = (cv2.dilate(part, disk(5)) == 1) & (part == 0) & known
        ry, rx = np.nonzero(ring)
        best, best_cost = None, np.inf
        for dy in range(-reach, reach + 1, step):
            for dx in range(-reach, reach + 1, step):
                if abs(dx) < cell and abs(dy) < cell:
                    continue
                sy, sx = py + dy, px + dx
                if sy.min() < 0 or sx.min() < 0 or sy.max() >= H or sx.max() >= W:
                    continue
                if original[sy, sx].mean() < 0.92:
                    continue
                if len(ry):
                    qy, qx = ry + dy, rx + dx
                    if qy.min() < 0 or qx.min() < 0 or qy.max() >= H or qx.max() >= W:
                        continue
                    cost = np.mean((out[qy, qx] - out[ry, rx]) ** 2)
                else:
                    cost = 0.0
                # penaliza repetir el mismo trozo: evita motas clonadas en serie
                if any(abs(dx - ux) < cell and abs(dy - uy) < cell for ux, uy in used):
                    cost = cost * 1.6 + 40
                if cost < best_cost:
                    best, best_cost = (dx, dy), cost
        if best is None:
            continue
        dx, dy = best
        used.append(best)
        grown = cv2.dilate(part, disk(2)).astype(bool) & (layer == 1)
        gy, gx = np.nonzero(grown)
        src = out[np.clip(gy + dy, 0, H - 1), np.clip(gx + dx, 0, W - 1)]
        w8 = np.where(part[gy, gx] == 1, 1.0, 0.5)[:, None]
        out[gy, gx] = out[gy, gx] * (1 - w8) + src * w8
        known |= part.astype(bool)
    rest = (todo & ~known).astype(np.uint8)
    if rest.any():
        out = cv2.inpaint(np.clip(out, 0, 255).astype(np.uint8), rest, 4, cv2.INPAINT_TELEA).astype(np.float32)
    return np.clip(out, 0, 255).astype(np.uint8)


left_img = fill_texture(SRC, under_left, left)
right_img = fill_texture(SRC, under_right, right)
left = left | under_left
right = right | under_right


def export(name, img, mask, pad=4):
    a = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 0.7) * 255
    ys, xs = np.where(a > 8)
    x0, y0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    x1, y1 = min(xs.max() + pad + 1, W), min(ys.max() + pad + 1, H)
    rgba = np.dstack([img[y0:y1, x0:x1], a[y0:y1, x0:x1].astype(np.uint8)])
    big = cv2.resize(rgba, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)
    rgb = big[..., :3].astype(np.float32)
    blur = cv2.GaussianBlur(rgb, (0, 0), 1.0)
    big[..., :3] = np.clip(rgb + 0.45 * (rgb - blur), 0, 255).astype(np.uint8)
    cv2.imwrite(f'{OUT}/{name}.webp', big, [cv2.IMWRITE_WEBP_QUALITY, 88])
    return {'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)}


manifest = {
    'izquierda': export('izquierda', left_img, left),
    'derecha': export('derecha', right_img, right),
    'nota': export('nota', note_img, note),
    'ramitaSupIzq': export('ramita-sup-izq', SRC, sprig_tl),
    'ramitaInfIzq': export('ramita-inf-izq', SRC, sprig_bl),
    'ramitaInfDer': export('ramita-inf-der', SRC, sprig_br),
    'cafe': export('cafe', SRC, cup),
    'pinza': export('pinza', SRC, clip),
    'lapiz': export('lapiz', SRC, pencil),
}
for key, name, box, span, cov in [('selloIzq', 'sello-izq', R.STAMP_L, 30, left), ('selloDer', 'sello-der', R.STAMP_R, 50, right)]:
    big = cv2.resize(stamp(box, span, cov), None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(f'{OUT}/{name}.webp', big, [cv2.IMWRITE_WEBP_QUALITY, 88])
    manifest[key] = {'x': box[0], 'y': box[1], 'w': box[2] - box[0], 'h': box[3] - box[1]}
with open(f'{OUT}/capas.json', 'w', encoding='utf8') as f:
    json.dump(manifest, f, indent=2)

# Vistas de comprobación sobre fondo liso
check = np.full((H, W, 3), (120, 200, 120), np.uint8)
for img, m in [(left_img, left), (right_img, right), (note_img, note), (SRC, sprig_tl), (SRC, sprig_bl),
               (SRC, sprig_br), (SRC, cup), (SRC, clip), (SRC, pencil)]:
    check[m == 1] = img[m == 1]
cv2.imwrite(f'{DBG}/capas_check.png', check)
for n, m in [('s_tl', sprig_tl), ('s_bl', sprig_bl), ('s_br', sprig_br), ('cup', cup), ('clip', clip),
             ('pencil', pencil)]:
    ys, xs = np.where(m)
    c = np.full((H, W, 3), (120, 200, 120), np.uint8)
    c[m == 1] = SRC[m == 1]
    c = c[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{DBG}/x_{n}.png', cv2.resize(c, None, fx=2.5, fy=2.5, interpolation=cv2.INTER_NEAREST))
print(json.dumps(manifest))
