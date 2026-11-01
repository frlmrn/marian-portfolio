"""Genera la copia pública del prototipo de MASSolisapp para el portfolio.

La copia de trabajo (Desktop/massolis) lleva datos fiscales y bancarios reales en
la facturación y en la plantilla de factura. Aquí se compila una copia temporal
con datos ficticios en ambos: los valores reales se leen de billing.ts, nunca se escriben
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

from PIL import Image, ImageDraw, ImageFont

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

# ——— El manual es interno: en la copia pública su contenido es ficticio ———
# Se cambia antes de compilar, así el texto real no llega al archivo publicado.
# Títulos, nombres de código y categorías se conservan: la navegación se entiende.
POOLS = {
    'materiales': ['Bayeta de microfibra', 'Cubo con escurridor', 'Fregona', 'Paño suave', 'Estropajo sin rayado', 'Guantes de nitrilo',
                   'Plumero', 'Recogedor', 'Cepillo de cerdas suaves', 'Pulverizador'],
    'productos': ['Limpiador neutro', 'Limpiacristales', 'Desengrasante suave', 'Jabón de pH neutro', 'Limpiador multiusos', 'Abrillantador de suelos'],
    'maquinaria': ['Aspiradora', 'Mopa de vapor', 'Fregadora compacta'],
    'pasos': ['Quitar el polvo de los muebles.', 'Limpiar los espejos.', 'Aspirar las alfombras.', 'Vaciar las papeleras.',
              'Limpiar el lavabo y la grifería.', 'Limpiar los tiradores y los interruptores.', 'Repasar los zócalos.',
              'Limpiar el exterior de los electrodomésticos.', 'Fregar el suelo de la cocina.', 'Ordenar los cojines.',
              'Limpiar la encimera.', 'Repasar las puertas.'],
    'tiempo': ['Unas 2 horas, según el tamaño del espacio', 'Unas 3 horas, según el tamaño del espacio', 'Unas 4 horas, según el tamaño del espacio', 'A convenir con el cliente'],
    'nivel': ['Limpieza básica', 'Limpieza completa', 'Limpieza a fondo'],
    'pregunta': ['¿Qué revisas antes de empezar?', '¿Por dónde conviene empezar?', '¿Qué haces al terminar?', '¿Qué material usas en esta zona?', '¿Cuándo avisas a la oficina?'],
    'opciones': ['Revisar la zona', 'Avisar a la oficina', 'Ventilar la estancia', 'Pedir más material', 'Empezar por el fondo', 'Recoger al terminar'],
    'frases': ['Contenido de ejemplo: sigue siempre las indicaciones de tu responsable.', 'Prueba primero en una zona poco visible.',
               'Empieza por lo más alto y termina por el suelo.', 'Usa un paño distinto para cada zona.', 'Avisa a la oficina si encuentras algo fuera de lo normal.',
               'Trabaja desde el fondo de la estancia hacia la salida.', 'Lee la etiqueta de cada producto antes de usarlo.', 'Ventila bien mientras limpias.',
               'Respeta los objetos personales del cliente.', 'Deja el material recogido al terminar.', 'Comprueba el resultado antes de marcar la tarea.',
               'Ante cualquier duda, pregunta antes de seguir.'],
}
NO_TOCAR = {'id', 'tipo', 'categoria', 'subcategoria', 'titulo', 'seccion', 'pagina', 'codigo', 'denominacion', 'origen', 'nombre',
            'secuencial', 'etiquetas', 'servicios', 'zonas', 'superficies', 'claves', 'relacionadas', 'entradaId',
            'descripcion', 'S', 'base', 'dis', 'fecha', 'autor', 'motivo', 'correcta'}
LITERAL = re.compile(r"'((?:[^'\\\n]|\\.)*)'")
CLAVE = re.compile(r"(\w+)\s*:(?!:)|const\s+(\w+)")
elegidos, turnos, sustituidos = {}, {}, []


def pool(clave):
    c = clave.lower()
    if c.startswith(('telas', 'otros', 'materiales')):
        return 'materiales'
    if c.startswith('productos'):
        return 'productos'
    if c.startswith('maquinaria'):
        return 'maquinaria'
    if c.startswith(('tareas', 'pasos', 'debes', 'plus', 'plantas')):
        return 'pasos'
    if c in POOLS:
        return c
    if c in ('enunciado',):
        return 'pregunta'
    return 'frases'


def ficticio(texto, clave):
    # el mismo texto siempre da el mismo resultado: el comparador sigue funcionando
    if texto not in elegidos:
        k = pool(clave)
        n = turnos.get(k, 0)
        turnos[k] = n + 1
        elegidos[texto] = POOLS[k][n % len(POOLS[k])]
        if len(texto) >= 25:
            sustituidos.append(texto)
    return elegidos[texto]


def cambia(fuente):
    fuera, ultimo = [], 0
    for m in LITERAL.finditer(fuente):
        previo = LITERAL.sub("''", fuente[max(0, m.start() - 900):m.start()])
        claves = CLAVE.findall(previo)
        clave = (claves[-1][0] or claves[-1][1]) if claves else ''
        texto = m.group(1)
        ligado = fuente[m.end():m.end() + 2].lstrip().startswith(':')
        linea = fuente[fuente.rfind('\n', 0, m.start()) + 1:m.start()]
        indice = re.search(r'\w\[$', fuente[max(0, m.start() - 3):m.start()]) is not None  # SERVICIOS['03MAS']
        # Las frases largas se cambian siempre, salvo que sean títulos o nombres de sección
        frase = len(texto) >= 42 and ' ' in texto and clave not in ('titulo', 'descripcion', 'seccion', 'denominacion')
        if (clave in NO_TOCAR and not frase) or ligado or indice or linea.lstrip().startswith(('import', 'export type', 'export interface')) \
                or not re.search(r'[^\W\d_]', texto):
            continue
        fuera += [fuente[ultimo:m.start()], "'", ficticio(texto, clave), "'"]
        ultimo = m.end()
    return ''.join(fuera) + fuente[ultimo:]


base = os.path.join(TMP, 'src/knowledge')
archivos = [os.path.join(base, 'contenido', f) for f in sorted(os.listdir(os.path.join(base, 'contenido')))] + [os.path.join(base, 'aprendizaje.ts')]
for ruta in archivos:
    fuente = open(ruta, encoding='utf8').read()
    fuente = fuente.replace('`Mantenimiento (limpieza superficial).`', "'Limpieza básica.'")
    open(ruta, 'w', encoding='utf8').write(cambia(fuente))

# Páginas del manual: hojas de ejemplo dibujadas, las reales no llegan al archivo
carpeta = os.path.join(TMP, 'src/assets/manual')
fino = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 15)
negrita = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 19)
pequena = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 13)
for n, nombre in enumerate(sorted(os.listdir(carpeta)), 1):
    im = Image.new('RGB', (620, 877), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 620, 64), fill=(0, 61, 155))
    d.text((36, 24), 'MANUAL DE EJEMPLO · DATOS FICTICIOS', font=pequena, fill=(255, 255, 255))
    y = 100
    for b in range(3):
        d.text((36, y), f'{b + 1}. {POOLS["pregunta"][(n + b) % len(POOLS["pregunta"])]}', font=negrita, fill=(0, 24, 72))
        y += 38
        for f in range(5):
            frase = POOLS['pasos'][(n * 3 + b * 5 + f) % len(POOLS['pasos'])]
            d.ellipse((38, y + 6, 44, y + 12), fill=(0, 61, 155))
            d.text((54, y), frase, font=fino, fill=(40, 50, 70))
            y += 30
        y += 26
    d.text((36, 836), f'Página {n}', font=pequena, fill=(74, 91, 114))
    im.save(os.path.join(carpeta, nombre), 'JPEG', quality=72)

# Aviso en las pantallas del manual: lo que se ve son datos de ejemplo
PROTECCION = """<style>
      #aviso-ficticio { display: none; position: fixed; z-index: 2147483647; top: 0; left: 0; right: 0; padding: 4px 10px;
        font: 600 11px/1.3 Inter, system-ui, sans-serif; text-align: center; color: #fff; background: #001848; pointer-events: none }
      html[data-manual] #aviso-ficticio { display: block }
      html[data-manual] body { padding-top: 22px; box-sizing: border-box }
      html[data-manual] body > #root { height: calc(100dvh - 22px); overflow: hidden }
    </style>
    <script>
      ;(function () {
        var marca = function () {
          document.documentElement.toggleAttribute('data-manual', /conocimiento|\\/admin\\/manual/.test(location.hash))
        }
        addEventListener('DOMContentLoaded', function () {
          var aviso = document.createElement('div')
          aviso.id = 'aviso-ficticio'
          aviso.textContent = 'Contenido de ejemplo · datos ficticios'
          document.body.appendChild(aviso)
        })
        marca()
        setInterval(marca, 400)
      })()
    </script>
  </head>"""
ruta = os.path.join(TMP, 'index.html')
s = open(ruta, encoding='utf8').read()
assert '</head>' in s
s = s.replace('</head>', PROTECCION, 1)
open(ruta, 'w', encoding='utf8').write(s)

subprocess.run('npx vite build --mode standalone', cwd=TMP, shell=True, check=True, stdout=subprocess.DEVNULL)
shutil.copyfile(os.path.join(TMP, 'dist-standalone/index.html'), os.path.join(TMP, 'MASSolisapp.html'))
html = open(os.path.join(TMP, 'MASSolisapp.html'), encoding='utf8').read()

# ——— Ningún dato real en lo que se publica ———
# (si el origen ya trae datos de ejemplo, coinciden con los ficticios y no cuentan)
fugas = [k for k, v in reales.items() if v != FICTICIOS[k] and v.strip() and v.strip() in html]
assert not fugas, f'Datos reales en el archivo: {fugas}'
# (los nombres de los códigos son públicos: salen en la web del proyecto)
visibles = [t for t in sustituidos if t in html and not t.startswith('Mantenimiento')]
assert len(sustituidos) > 100 and not visibles, f'Texto del manual en el archivo: {visibles}'
open(DESTINO, 'w', encoding='utf8').write(html)
print('ok', len(html) // 1024, 'kB')
