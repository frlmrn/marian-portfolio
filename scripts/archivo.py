"""Prepara las imágenes de archivo (source/archivo) para la portada.

Uso: python scripts/archivo.py src/assets/archivo [carpeta-vista-previa]
Necesita numpy, pillow y opencv-python-headless.

- Fotos: se recortan, se pasan a un tono sepia común (el de las copias del
  collage) y se exportan a WebP; el marco de papel se dibuja en CSS.
- Las plantas (fotos reales) se recortan aparte con scripts/plantas-reales.py.
"""
import json
import sys

import cv2
import numpy as np

SRC = 'source/archivo'
OUT = sys.argv[1]
PREV = sys.argv[2] if len(sys.argv) > 2 else None

# Tono de las copias: sombra marrón oscura → luz crema (BGR)
DARK = np.array([24, 32, 44], np.float32)
LIGHT = np.array([196, 218, 232], np.float32)


def load(name):
    return cv2.imread(f'{SRC}/{name}.jpg')


def crop(im, x0, y0, x1, y1):
    h, w = im.shape[:2]
    return im[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)]


def sepia(im, contrast=1.08, gamma=0.95):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    lo, hi = np.percentile(g, [1.5, 98.5])
    g = np.clip((g - lo) / max(hi - lo, 1e-3), 0, 1)
    g = np.clip((g - 0.5) * contrast + 0.5, 0, 1) ** gamma
    out = DARK[None, None] * (1 - g[..., None]) + LIGHT[None, None] * g[..., None]
    # grano de copia antigua
    noise = np.random.default_rng(3).normal(0, 4.5, g.shape).astype(np.float32)
    return np.clip(out + noise[..., None], 0, 255).astype(np.uint8)


def muted(im, amount=0.3):
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)[..., None].astype(np.float32)
    out = im.astype(np.float32) * (1 - amount) + gray * amount
    return np.clip(out * np.array([0.94, 0.98, 1.02], np.float32), 0, 255).astype(np.uint8)


def save_photo(name, im, width):
    h = int(im.shape[0] * width / im.shape[1])
    im = cv2.resize(im, (width, h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{OUT}/{name}.webp', im, [cv2.IMWRITE_WEBP_QUALITY, 82])
    return {'w': width, 'h': h}


sizes = {
    'whitby': save_photo('whitby', sepia(crop(load('whitby'), 0, 0.08, 1, 0.95)), 900),
    'newhaven': save_photo('newhaven', sepia(crop(load('newhaven'), 0.04, 0.03, 0.96, 0.97)), 640),
    'frankenstein': save_photo('frankenstein', sepia(crop(load('frankenstein'), 0.02, 0.02, 0.98, 0.98), contrast=1.0), 760),
    'bronte': save_photo('bronte', sepia(crop(load('bronte'), 0.0, 0.1, 1.0, 0.68), contrast=1.15, gamma=0.8), 520),
    # mitología griega: placa de linterna con Perseo y Medusa (se conserva entera)
    # y la copa de Hades y Perséfone, con su color de terracota algo apagado
    'medusa': save_photo('medusa', cv2.addWeighted(load('medusa'), 0.9, np.full_like(load('medusa'), 18), 0.1, 0), 640),
    'persefone': save_photo('persefone', muted(crop(load('persefone'), 0.0, 0.0, 1.0, 0.86)), 560),
}
json.dump(sizes, open(f'{OUT}/tamanos.json', 'w'), indent=1)
print(sizes)
