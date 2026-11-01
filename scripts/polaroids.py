"""Fotos de las polaroids de la portada: los dispositivos de cada caso sin
fondo (transparentes, con su sombra: se apoyan en el papel de la polaroid;
móviles y portátil dibujados con las capturas reales del prototipo) y el
retrato de Marian para «Sobre mí». Proporción de la foto de la
polaroid: 1,15:1.

Uso: python scripts/polaroids.py
"""
import os

from PIL import Image, ImageDraw, ImageFilter

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
W, H = 1200, 1040


def lienzo():
    # Sin fondo: Marian pidió quitarlo; los dispositivos quedan sobre la polaroid
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))


def redondeado(size, r):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), r, fill=255)
    return m


def sombra(base, caja, r, giro, alto=0.35):
    w, h = caja[2] - caja[0], caja[3] - caja[1]
    s = Image.new('RGBA', (w + 160, h + 160), (0, 0, 0, 0))
    ImageDraw.Draw(s).rounded_rectangle((80, 80, 80 + w, 80 + h), r, fill=(40, 25, 10, int(255 * alto)))
    s = s.rotate(giro, expand=True, resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    cx, cy = (caja[0] + caja[2]) // 2 + 14, (caja[1] + caja[3]) // 2 + 28
    base.alpha_composite(s, (cx - s.size[0] // 2, cy - s.size[1] // 2))


def movil(base, pantalla, cx, cy, ancho, giro=0):
    alto = int(ancho * 844 / 390)
    borde = max(6, int(ancho * 0.03))
    pw, ph = ancho + 2 * borde, alto + 2 * borde
    pieza = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
    marco = Image.new('RGBA', (pw, ph), (30, 29, 28, 255))
    pieza.paste(marco, (0, 0), redondeado((pw, ph), int(pw * 0.13)))
    scr = Image.open(pantalla).convert('RGB').resize((ancho, alto), Image.LANCZOS)
    pieza.paste(scr, (borde, borde), redondeado((ancho, alto), int(ancho * 0.11)))
    isla = ImageDraw.Draw(pieza)
    iw = int(ancho * 0.28)
    isla.rounded_rectangle((pw // 2 - iw // 2, borde + int(alto * 0.012), pw // 2 + iw // 2, borde + int(alto * 0.04)), 20, fill=(12, 12, 12, 255))
    caja = (cx - pw // 2, cy - ph // 2, cx + pw // 2, cy + ph // 2)
    sombra(base, caja, int(pw * 0.13), giro)
    pieza = pieza.rotate(giro, expand=True, resample=Image.BICUBIC)
    base.alpha_composite(pieza, (cx - pieza.size[0] // 2, cy - pieza.size[1] // 2))


def portatil(base, pantalla, cx, cy, ancho):
    sw = int(ancho * 0.86)
    sh = int(sw * 900 / 1440)
    b = int(sw * 0.025)
    tapa = Image.new('RGBA', (sw + 2 * b, sh + 2 * b + int(b * 0.6)), (0, 0, 0, 0))
    ImageDraw.Draw(tapa).rounded_rectangle((0, 0, tapa.size[0] - 1, tapa.size[1] + 20), 18, fill=(30, 29, 28, 255))
    scr = Image.open(pantalla).convert('RGB').resize((sw, sh), Image.LANCZOS)
    tapa.paste(scr, (b, b))
    base_h = int(ancho * 0.03)
    x0 = cx - tapa.size[0] // 2
    y0 = cy - (tapa.size[1] + base_h) // 2
    sombra(base, (cx - ancho // 2, y0, cx + ancho // 2, y0 + tapa.size[1] + base_h), 20, 0, 0.3)
    base.alpha_composite(tapa, (x0, y0))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((cx - ancho // 2, y0 + tapa.size[1] - 4, cx + ancho // 2, y0 + tapa.size[1] + base_h), 14, fill=(196, 191, 184, 255))
    d.rectangle((cx - ancho // 2 + 10, y0 + tapa.size[1] - 4, cx + ancho // 2 - 10, y0 + tapa.size[1] + 2), fill=(170, 165, 158, 255))


def guarda(im, nombre):
    im.save(f'src/assets/img/{nombre}.webp', 'WEBP', quality=86)
    print(nombre, im.size)


# Cecotec: la app, Ceco y la realidad aumentada
im = lienzo().convert('RGBA')
c = 'src/assets/casos/cecotec/'
movil(im, c + 'pant-home.webp', 330, 560, 250, 8)
movil(im, c + 'pant-ar-encaja.webp', 870, 560, 250, -8)
movil(im, c + 'pant-respuesta.webp', 600, 510, 280, 0)
guarda(im, 'polaroid-cecotec')

# Oh My Cat!: la web en el portátil y en el móvil
im = lienzo().convert('RGBA')
o = 'src/assets/casos/ohmycat/'
portatil(im, o + 'pant-web-portada.webp', 540, 500, 920)
movil(im, o + 'pant-portada.webp', 975, 650, 200, -4)
guarda(im, 'polaroid-ohmycat')

# MASSolisapp: el panel de administración en el portátil y la app del profesional
im = lienzo().convert('RGBA')
ms = 'src/assets/casos/massolis/'
portatil(im, ms + 'pant-web-inicio.webp', 540, 500, 920)
movil(im, ms + 'pant-inicio.webp', 975, 650, 200, -4)
guarda(im, 'polaroid-massolis')

# Sobre mí: el retrato, recortado a la proporción de la foto
r = Image.open('src/assets/img/retrato-bn.webp').convert('RGB')
rw, rh = r.size
ch = int(rw / 1.15)
if ch <= rh:
    top = max(0, int(rh * 0.08))
    top = min(top, rh - ch)
    r = r.crop((0, top, rw, top + ch))
else:
    cw = int(rh * 1.15)
    r = r.crop(((rw - cw) // 2, 0, (rw - cw) // 2 + cw, rh))
guarda(r.resize((W, H), Image.LANCZOS).convert('RGB'), 'polaroid-sobre-mi')
