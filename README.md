# Marian · Digital Designer — portada

Portada interactiva construida por capas a partir de la imagen 1 de
`portfolio-definitivo.zip` (copia en `source/image 39.png`), con las
correcciones del 29-10-2026: hero con «Hola, soy Marian. Digital Designer.»,
polaroids como navegación principal (Cecotec, Oh My Cat!, N4 y Sobre mí) con
las fotos vacías a la espera de las imágenes definitivas, cabecera compacta con
«Marian» y el símbolo en burdeos, dos tipografías (Bricolage Grotesque + Ibarra
Real Nova cursiva para las notas), bocetos de diseño digital en lugar de planos antiguos y una pata de gato.

## Web publicada

https://marian-portfolio-mu.vercel.app (Vercel, se actualiza al subir a la rama `main` de GitHub).

## Abrir sin instalar nada

Haz doble clic en `Marian Portfolio.html` (o en `index.html`, que redirige a él). Es la web entera en un solo archivo; los prototipos se abren desde la carpeta `public`, así que el archivo tiene que seguir dentro de esta carpeta.

Si cambias el código, vuelve a generarlo con `npm run build:autonomo`.

## Cómo verla

```bash
npm install
npm run dev
```

Se abre en http://localhost:5193. `npm run build` deja la versión publicable en `dist/`.

## Qué hay en cada sitio

- `src/views/Home.tsx`: portada de escritorio. Todo se coloca con las
  coordenadas de la imagen original (1536 × 1024 «unidades»); el bloque
  izquierdo se ancla al borde izquierdo, el derecho al derecho y el centro al
  centro, así en pantallas anchas la composición respira sin deformarse.
- `src/views/HomeMobile.tsx`: versión vertical (móviles, tabletas en vertical y
  ventanas casi cuadradas).
- `src/views/About.tsx`, `Cases.tsx` y `Contact.tsx`: «Sobre mí», «Case studies»
  (un caso por URL: `/casos/cecotec`, `/casos/ohmycat`, `/casos/n4`) y «Contacto»
  con la ficha de proyecto. Comparten la mesa de `src/components/PageShell.tsx`.
- Para que el formulario envíe, pon el correo en `contacto.email` (`src/content.ts`):
  abrirá el programa de correo con el mensaje redactado. Vacío, avisa de que aún
  no está conectado.
- `src/content.ts`: todos los textos y los tres proyectos.
- `src/assets/decor/`: decoración recortada de la imagen (papeles, mapas,
  fotos, sellos, ramitas, café, pinza y lápiz) y sus posiciones en `capas.json`.
- `src/assets/proyectos/`: capturas de los prototipos de Cecotec, Oh My Cat! y N4.

## Animaciones

1. Al cargar, el hilo rojo se dibuja de chincheta en chincheta (sin cruzar ningún texto) y las anotaciones aparecen.
2. Al pasar el ratón por una foto, se balancea sobre su chincheta y el hilo se tensa.
3. Las pestañas suben un poco al pasar el ratón.
4. Los objetos de los bordes se mueven ligeramente con el ratón (los que están
   cortados por el borde solo se mueven hacia fuera, para que no se vea el corte).
5. Las polaroids son enlaces: los casos llevan a «Case studies» y la cuarta a «Sobre mí».
6. Las tres ramitas se mecen como con viento suave.
7. La pata de gato se asoma y, de vez en cuando, toca el lápiz.
8. «Explora las tarjetas» balancea las polaroids una tras otra y deja el foco en la primera.
9. El «Índice» de la cabecera despliega las secciones como fichas de un fichero (ratón, clic o teclado; Escape lo cierra).

Para poner la imagen definitiva de un caso, añade `imagen` y `alt` a su tarjeta en `src/content.ts`.

Con «reducir movimiento» activado en el sistema, todo queda quieto.

## Regenerar recursos

- Decoración: `python scripts/decor/extraer.py src/assets/decor <carpeta-temporal>`
  (necesita `numpy` y `opencv-python-headless`; las zonas están en `scripts/decor/regiones.py`).
- Capturas de los prototipos: `node scripts/capturas.mjs source/capturas` (usa Brave).
- Logo vectorial: `python scripts/logo-a-svg.py source/logo-reloj-gato.png src/assets/img/logo-reloj-gato.svg`
  (necesita `potracer`).
- Pata de gato (foto sin fondo, con su sombra): `python scripts/pata-gato.py source/pata-gato.png src/assets/decor/pata-gato.webp`.
- Fotos de revisión a varios tamaños: `node scripts/foto.mjs <carpeta> inicio 1920x1080 390x844@2`.

## Límites conocidos

- La decoración sale de una imagen de 1536 px: se exporta a 1,5× con un enfoque
  suave, pero en monitores 4K se verá algo más blanda que el texto, que es
  vectorial. No se ha ampliado con IA (Weave no está vinculado a la cuenta de Figma).

## Imágenes de archivo (Wikimedia Commons)

Todas son de dominio público o CC0; las fichas completas están en `source/archivo/creditos.json`
y se regeneran con `python scripts/archivo.py src/assets/archivo`.

- Pescaderas de Newhaven, Edimburgo — Hill & Adamson, 1843–47 (CC0, Metropolitan Museum of Art).
- Pescadores de Whitby — Frank Meadow Sutcliffe, c. 1885 (CC0, National Gallery of Art).
- Frontispicio de *Frankenstein* (ed. 1831) — Theodor von Holst (dominio público).
- Las hermanas Brontë — Patrick Branwell Brontë, c. 1834 (dominio público).
- Perseo huye con la cabeza de Medusa — hidria del Pintor de Pan, placa de linterna (dominio público).
- Hades y Perséfone — copa ática, British Museum E82; foto de Marie-Lan Nguyen (CC BY 2.5).

Plantas (fotos reales, CC BY-SA: el crédito aparece en la ficha al pasar el ratón;
se recortan con `python scripts/plantas-reales.py src/assets/archivo`):

- Azahar — Zeynel Cebeci (CC BY-SA 4.0).
- Romero — Fir0002 (CC BY-SA 3.0).
- Lirio de araña — Jim Evans (CC BY-SA 4.0).
- Nomeolvides — Douglas Goldman (CC BY-SA 4.0).
