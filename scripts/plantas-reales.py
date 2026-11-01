"""Recorta las fotos reales de plantas (source/archivo/*-foto.jpg) sin halo.

Uso: python scripts/plantas-reales.py src/assets/archivo [carpeta-vista-previa]
Necesita numpy y opencv-python-headless.

La transparencia se calcula respecto al color del fondo (blanco, negro o
follaje desenfocado) y después se «descontamina» el color de los bordes:
F = (I - (1 - a) * fondo) / a. Así no queda el cerco claro u oscuro del fondo
original. Donde la foto corta la planta (un tallo que sale del encuadre), el
borde se desvanece en vez de terminar en recto.
"""
import sys

import cv2
import numpy as np

SRC = 'source/archivo'
OUT = sys.argv[1]
PREV = sys.argv[2] if len(sys.argv) > 2 else None


def load(name, box):
    im = cv2.imread(f'{SRC}/{name}.jpg')
    h, w = im.shape[:2]
    x0, y0, x1, y1 = box
    return im[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)].astype(np.float32)


def largest(mask, keep=1, min_frac=0.0):
    n, lab, st, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8))
    if n <= 1:
        return mask.astype(np.uint8)
    order = 1 + np.argsort(-st[1:, cv2.CC_STAT_AREA])
    big = st[order[0], cv2.CC_STAT_AREA]
    ok = [i for i in order[:keep] if st[i, cv2.CC_STAT_AREA] >= big * min_frac]
    return np.isin(lab, ok).astype(np.uint8)


def fade_cut_edges(alpha, sides, frac=0.07):
    """Desvanece la planta hacia los lados del encuadre que la cortan."""
    h, w = alpha.shape
    yy, xx = np.mgrid[:h, :w].astype(np.float32)
    d = np.full((h, w), np.inf, np.float32)
    span = frac * min(h, w)
    if 'l' in sides:
        d = np.minimum(d, xx)
    if 'r' in sides:
        d = np.minimum(d, w - 1 - xx)
    if 't' in sides:
        d = np.minimum(d, yy)
    if 'b' in sides:
        d = np.minimum(d, h - 1 - yy)
    return alpha * np.clip(d / span, 0, 1) ** 1.2


def finish(name, im, alpha, bg, width, sides=''):
    alpha = np.clip(alpha, 0, 1)
    if sides:
        alpha = fade_cut_edges(alpha, sides)
    a3 = np.maximum(alpha, 0.04)[..., None]
    fg = np.clip((im - (1 - a3) * bg) / a3, 0, 255)
    # color algo apagado y cálido, a juego con las copias del collage
    gray = cv2.cvtColor(fg.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)[..., None]
    fg = (fg * 0.86 + gray * 0.14) * np.array([0.95, 0.99, 1.03], np.float32)
    rgba = np.dstack([np.clip(fg, 0, 255), alpha * 255]).astype(np.uint8)
    ys, xs = np.nonzero(alpha > 0.03)
    rgba = rgba[max(ys.min() - 2, 0):ys.max() + 3, max(xs.min() - 2, 0):xs.max() + 3]
    h = int(rgba.shape[0] * width / rgba.shape[1])
    rgba = cv2.resize(rgba, (width, h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{OUT}/{name}.webp', rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
    if PREV:
        for tag, paper in [('claro', (205, 221, 231)), ('oscuro', (40, 50, 60))]:
            p = np.full(rgba.shape[:2] + (3,), paper, np.float32)
            a = rgba[..., 3:4] / 255
            cv2.imwrite(f'{PREV}/r_{name}_{tag}.png', (rgba[..., :3] * a + p * (1 - a)).astype(np.uint8))
    print(name, rgba.shape[1], 'x', rgba.shape[0])


def on_dark(name, box, lo, hi, width, sides='', keep=1, erase_red=False):
    im = load(name, box)
    if erase_red:  # letras rojas de referencia que lleva la foto original
        b, g, r = im[..., 0], im[..., 1], im[..., 2]
        red = ((r > 120) & (r > g + 60) & (r > b + 60)).astype(np.uint8)
        im[cv2.dilate(red, np.ones((7, 7), np.uint8)) == 1] = 0
    v = im.max(2)
    # cuánto «pesa» la planta en cada píxel del borde: respecto al brillo de la
    # planta justo al lado (pétalos claros y tallos oscuros a la vez)
    ref = np.maximum(cv2.dilate(v, np.ones((9, 9), np.uint8)), hi)
    alpha = np.clip((v - lo) / (ref - lo), 0, 1)
    hard = largest(cv2.morphologyEx((alpha > 0.35).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)), keep, 0.02)
    alpha *= cv2.dilate(hard, np.ones((7, 7), np.uint8))
    bg = np.median(im[v < lo * 0.8], 0) if (v < lo * 0.8).any() else np.zeros(3)
    finish(name.replace('-foto', ''), im, alpha, bg[None, None], width, sides)


def on_white(name, box, width, sides=''):
    im = load(name, box)
    bg = np.median(np.concatenate([im[:8].reshape(-1, 3), im[:, :8].reshape(-1, 3)]), 0)
    dist = np.linalg.norm(im - bg, axis=2)
    # rampa empinada y borde algo erosionado: el halo claro de la foto no pasa
    alpha = np.clip((dist - 28) / 42, 0, 1)
    hard = largest((alpha > 0.5).astype(np.uint8), 1)
    alpha = np.minimum(alpha, cv2.GaussianBlur(cv2.erode(hard, np.ones((3, 3), np.uint8)).astype(np.float32), (0, 0), 0.8))
    finish(name.replace('-foto', ''), im, alpha, bg[None, None], width, sides)


def on_foliage(name, box, width, sides=''):
    """Azahar: el fondo es follaje desenfocado; la rama está enfocada."""
    im = load(name, box)
    u8 = im.astype(np.uint8)
    gray = cv2.cvtColor(u8, cv2.COLOR_BGR2GRAY).astype(np.float32)
    sharp = cv2.GaussianBlur(np.abs(cv2.Laplacian(gray, cv2.CV_32F, ksize=3)), (0, 0), 6)
    hsv = cv2.cvtColor(u8, cv2.COLOR_BGR2HSV)
    S, V = hsv[..., 1].astype(np.float32), hsv[..., 2].astype(np.float32)
    flowers = (S < 45) & (V > 175)
    t_hi, t_lo = np.percentile(sharp, [70, 35])
    mask = np.full(gray.shape, cv2.GC_PR_BGD, np.uint8)
    mask[sharp > t_hi] = cv2.GC_PR_FGD
    mask[sharp < t_lo] = cv2.GC_BGD
    # los pétalos son lisos (poca nitidez) pero blancos: se marcan al final
    mask[cv2.dilate(flowers.astype(np.uint8), np.ones((3, 3), np.uint8)) == 1] = cv2.GC_FGD
    b, f = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(u8, mask, None, b, f, 6, cv2.GC_INIT_WITH_MASK)
    hard = np.where((mask == 1) | (mask == 3), 1, 0).astype(np.uint8)
    hard = cv2.morphologyEx(hard, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    hard = largest(hard, 1)
    inv = largest(1 - hard, 1)  # rellena huecos interiores
    hard = (1 - inv).astype(np.uint8)
    alpha = cv2.GaussianBlur(hard.astype(np.float32), (0, 0), 1.2)
    # solo el ramillete principal: flores blancas y capullos; las hojas se
    # confunden con el follaje del fondo y quedarían dentadas
    petals = cv2.morphologyEx(flowers.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    petals = cv2.morphologyEx(petals, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    keep = largest(petals, 1)
    inv = largest(1 - keep, 1)  # rellena los huecos de dentro (estambres, sombras)
    keep = (1 - inv).astype(np.uint8)
    keep = cv2.erode(keep, np.ones((3, 3), np.uint8))  # fuera el cerco oscuro
    alpha = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 0.8)
    bg = cv2.inpaint(u8, cv2.dilate(hard, np.ones((25, 25), np.uint8)), 15, cv2.INPAINT_TELEA).astype(np.float32)
    finish(name.replace('-foto', ''), im, alpha, bg, width, sides)


on_white('romero-foto', (0.0, 0.0, 1.0, 1.0), 360)
on_dark('lirio-foto', (0.0, 0.0, 1.0, 1.0), 22, 70, 620, sides='b')
on_dark('nomeolvides-foto', (0.08, 0.14, 0.535, 0.92), 26, 80, 420, sides='rb', erase_red=True)
on_foliage('azahar-foto', (0.35, 0.12, 0.705, 0.75), 380)
