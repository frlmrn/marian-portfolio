"""Genera la copia pública del prototipo de MASSolisapp para el portfolio.

La copia de trabajo (Desktop/massolis) lleva datos fiscales y bancarios reales en
la facturación y en la plantilla de factura. Aquí se compila una copia temporal
con datos ficticios: los valores reales se leen de billing.ts, nunca se escriben
en este script. Al final comprueba que ninguno ha llegado al archivo publicado.

Uso: python scripts/prototipo-massolis.py <carpeta temporal>
"""
import base64
import io
import os
import re
import shutil
import subprocess
import sys
import zipfile

ORIGEN = 'C:/Users/Gustavo/Desktop/massolis'
DESTINO = 'C:/Users/Gustavo/Desktop/Marian Portfolio/public/prototipos/massolis/index.html'
TMP = sys.argv[1]

FICTICIOS = {
    'company': 'Empresa de demostración S. L.',
    'nif': 'B-00000000',
    'address': 'CALLE DE EJEMPLO, 1',
    'city': '41000 (SEVILLA)',
    'email': 'facturacion@tuempresa.es',
    'bank': 'Banco de demostración',
    'iban': 'ES00 0000 0000 0000 0000 0000',
}

if os.path.exists(TMP):
    shutil.rmtree(TMP, ignore_errors=True)
shutil.copytree(ORIGEN, TMP, ignore=shutil.ignore_patterns('node_modules', 'dist', 'dist-standalone', 'MASSolisapp.html', '.git'))
subprocess.run(['cmd', '/c', 'mklink', '/J', os.path.join(TMP, 'node_modules').replace('/', '\\'),
                os.path.join(ORIGEN, 'node_modules').replace('/', '\\')], check=True, stdout=subprocess.DEVNULL)

# ——— Datos del emisor y tarifa ———
ruta = os.path.join(TMP, 'src/lib/billing.ts')
s = open(ruta, encoding='utf8').read()
reales = {}
for k, v in FICTICIOS.items():
    m = re.search(rf"(\n  {k}: ')([^']*)(')", s)
    assert m, k
    reales[k] = m.group(2)
    s = s.replace(m.group(0), m.group(1) + v + m.group(3), 1)
s, n = re.subn(r'hourlyRate: [\d.]+', 'hourlyRate: 15', s, count=1)
assert n == 1
open(ruta, 'w', encoding='utf8').write(s)

# ——— Plantilla de factura embebida ———
ruta = os.path.join(TMP, 'src/assets/factura/plantilla.ts')
s = open(ruta, encoding='utf8').read()
m = re.search(r"export default '([^']+)'", s)
entrada = zipfile.ZipFile(io.BytesIO(base64.b64decode(m.group(1))))
salida = io.BytesIO()
with zipfile.ZipFile(salida, 'w', zipfile.ZIP_DEFLATED) as z:
    for item in entrada.namelist():
        datos = entrada.read(item)
        if item == 'xl/sharedStrings.xml':
            t = datos.decode('utf8').replace(f"{reales['bank']} {reales['iban']}", f"{FICTICIOS['bank']} {FICTICIOS['iban']}")
            for k in FICTICIOS:
                t = t.replace(reales[k], FICTICIOS[k])
            datos = t.encode('utf8')
        if item.startswith('xl/persons'):
            datos = re.sub(rb'displayName="[^"]*"', b'displayName="Demo"', datos)
        z.writestr(item, datos)
s = s.replace(m.group(1), base64.b64encode(salida.getvalue()).decode())
open(ruta, 'w', encoding='utf8').write(s)
xlsx = os.path.join(TMP, 'src/assets/factura/plantilla.xlsx')
if os.path.exists(xlsx):
    os.remove(xlsx)

# ——— Rutas con # bajo /prototipos/ y sin el salto a MASSolisapp.html ———
ruta = os.path.join(TMP, 'src/lib/url.ts')
s = open(ruta, encoding='utf8').read()
a = "window.location.protocol === 'file:'"
assert a in s
s = s.replace(a, "(window.location.protocol === 'file:' || window.location.pathname.includes('/prototipos/'))", 1)
open(ruta, 'w', encoding='utf8').write(s)
ruta = os.path.join(TMP, 'index.html')
s = open(ruta, encoding='utf8').read()
s, n = re.subn(r"<script>\s*// Abierto con doble clic:.*?</script>\s*", '', s, count=1, flags=re.S)
assert n == 1
open(ruta, 'w', encoding='utf8').write(s)

subprocess.run('npm run build:standalone', cwd=TMP, shell=True, check=True, stdout=subprocess.DEVNULL)
html = open(os.path.join(TMP, 'MASSolisapp.html'), encoding='utf8').read()

# ——— Ningún dato real en lo que se publica ———
fugas = [k for k, v in reales.items() if k != 'bank' and v.strip() in html] + (['bank'] if reales['bank'] in html else [])
sin_espacios = reales['nif'].replace('-', '')
if sin_espacios in html:
    fugas.append('nif sin guion')
assert not fugas, f'Datos reales en el archivo: {fugas}'
open(DESTINO, 'w', encoding='utf8').write(html)
print('ok', len(html) // 1024, 'kB')
