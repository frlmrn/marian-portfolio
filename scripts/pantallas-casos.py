"""Pantallas de Cecotec y Oh My Cat! a tamaño completo, desde los originales de
source/mockups (780 × 1688 los móviles y 2160 × 1350 los portátiles)."""
import glob
import os
import re

from PIL import Image

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
total = 0
for f in sorted(glob.glob('source/mockups/*.png')):
    nombre = os.path.basename(f)[:-4]
    if nombre.startswith('cec-'):
        caso, k = 'cecotec', re.sub(r'^\d-', '', nombre[4:])
        k = re.sub(r'^ar-\d-', 'ar-', k)
    elif nombre.startswith('omcw-'):
        caso, k = 'ohmycat', 'web-' + nombre[7:]
    else:
        caso, k = 'ohmycat', re.sub(r'^\d-', '', nombre[4:])
    destino = f'src/assets/casos/{caso}/pant-{k}.webp'
    assert os.path.exists(destino), destino
    im = Image.open(f).convert('RGB')
    if im.width > 2000:
        im = im.resize((2000, 1250), Image.LANCZOS)
    im.save(destino, 'WEBP', quality=88, method=6)
    total += 1
print('pantallas', total)
