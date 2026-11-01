# Archivo Abierto · design system interno

Reglas para que todo el portfolio de Marian se diseñe con el mismo criterio.
Antes de añadir o cambiar una pieza, comprobar que cumple esto. Los valores
viven como variables en `src/styles/base.css` y las piezas comunes como
clases globales que los módulos usan con `composes: … from global`.

## 1. La idea

Una **mesa de trabajo de antropóloga**: madera, una gran hoja cuadriculada
encima y, sobre ella, objetos de archivo reales unidos por un **hilo rojo**.
Todo tiene que poder existir físicamente en una mesa: nada flota, nada parece
un componente de interfaz.

## 2. Superficies

| Capa | Qué es | Reglas |
|---|---|---|
| Mesa | Madera (`mesa.webp`, CC0) | Solo asoma por los bordes. Nunca lleva texto encima. |
| Hoja cuadriculada | `.papel::before` | Todo el texto va sobre papel (contraste). |
| Objetos | Encima de la hoja | Ver «Materiales». Si tocan el borde de la pantalla, **entran** desde fuera, cortados por el borde. |

## 3. Materiales

**Papel suelto** (hojas de presentación, recortes, fichas de índice, notas de
pasos): **nunca un rectángulo perfecto**. Se usa siempre `hoja-rasgada`:

```css
.miPieza {
  composes: hoja-rasgada from global;
  --rasgado: var(--rasgado-ficha); /* «ancho» para hojas apaisadas, «ficha» para piezas pequeñas o altas */
  --papel-1: var(--cartulina-1); /* opcional: cartulina en vez de papel */
  --papel-2: var(--cartulina-2);
}
```

Va un poco girado (entre -3° y 3°) y sujeto con **cinta** (`.cinta`) o una
**chincheta** del hilo rojo.

**Objetos fabricados**: bordes limpios, porque así son en la realidad:
polaroid, post-it (azul pálido), carpeta, cajón de fichero, diploma, ficha de
proyecto (formulario), tira de rotuladora (Dymo), sello de tampón, clip.

**Fotos**: siempre como copia en papel (polaroid o borde blanco), nunca sueltas
ni con halo. Recortes sin borde blanco alrededor.

## 4. Color: cada color tiene un papel

| Variable | Color | Para qué | Nunca |
|---|---|---|---|
| `--granate` | #5e0e16 | Titulares, nombres, rótulos, botón principal, estado activo, foco | Fondos grandes |
| `--marino` | #1f2e4d | **Objetos de archivo**: carpetas, pestañas, tiras Dymo, sellos, clips, cintas de diploma; **números de caso** (01, 02, 03); rol y categorías; flechas de paso | Bandas o cabeceras sobre papel suelto |
| `--tinta` | #24365a | Notas en Ibarra (anotaciones a mano alzada) | Texto de lectura |
| `--texto` | #33291f | Texto de lectura | — |
| `--texto-2` | #5a4c41 | Texto secundario: subtítulos, descripciones, el «antes» tachado | Titulares |
| `--texto-3` | #6f6155 | Metadatos y pies pequeños | Texto de lectura largo |
| `--texto-claro` | #f7efe6 | Texto sobre granate o marino (botón, carpetas) | Sobre papel |
| `--marino-claro` | #e6ebf3 | Texto de las etiquetas Dymo y pestañas azul marino | Sobre papel |
| `--error` | #9a1f17 | Mensajes y bordes de error de los formularios | Decoración |
| `--hilo` | #b3141c | Solo el hilo rojo y sus chinchetas | Texto, botones |
| Papel | `--hoja-1/2` | Papel suelto: hojas, fichas, notas, diagramas | — |
| Cartulina | `--cartulina-1/2` (kraft), `--cartulina-clara-1/2` | Sobres y fichas que se distinguen del papel | — |

**Regla:** en los CSS no se escriben colores sueltos: se usa la variable. Solo
son excepción los colores de las marcas de cada proyecto (muestras de paleta,
pantallas y bocetos de Oh My Cat!, Cecotec y MASSolisapp), que son contenido.

Prohibido: **amarillo** (post-its en azul pálido), dorados, degradados de
color «de app».

## 5. Tipografía

Solo dos familias:

- **Bricolage Grotesque** para todo: titulares (peso 780, `opsz` 96,
  interletra negativa), textos y rótulos.
- **Ibarra Real Nova en cursiva** solo para notas de archivo, citas y
  subtítulos en tono de anotación (color `--tinta`).

Prohibido: letras manuscritas, serifas «pijas» y una tercera familia.

**Rótulo**: etiqueta pequeña en mayúsculas para nombrar una pieza («Índice de
casos», «Cómo empezamos», el antetítulo de la portada). Se usa
`composes: rotulo from global` (peso 650, interletra 0.14em, granate). Si es el
título de una ficha, lleva una raya fina debajo (`1px rgb(60 40 20 / 0.3)`).

**Rótulos** (etiquetas pequeñas en mayúsculas): `composes: rotulo from global`
o, si no se puede, `font-weight: var(--rotulo-peso)` y
`letter-spacing: var(--rotulo-tracking)`. Todo texto en mayúsculas los usa.

## 6. Profundidad

- Papel suelto: `filter: var(--sombra-papel)` (funciona con los rasgados).
- Objetos con bordes limpios: `box-shadow` de dos capas, una corta de
  contacto y otra larga y suave, siempre con los tokens: `--sombra-1`
  (fichas pequeñas), `--sombra-2` (hojas y tarjetas), `--sombra-3` (levantado
  al pasar el ratón) y `--sombra-boton` / `-alta` / `-baja` para el botón
  granate. Nada de sombras sueltas nuevas.
- La luz viene de arriba a la izquierda: las sombras caen hacia abajo y a la
  derecha (también en los objetos recortados, como los lápices).
- Todo objeto tiene sombra de contacto: nada flota.

## 7. Movimiento

- Tiempos, siempre con su token: `--dur-pulsar` (80ms, al apretar),
  `--dur-hover` (200ms, al pasar el ratón o enfocar), `--dur-media` (320ms,
  piezas que cambian de sitio) y `--dur-entrada` (480ms, objetos que llegan).
  Curvas: `--ease-out` (casi todo), `--ease-asiento` (cae y se asienta) y
  `--ease-rebote` (golpe de sello, pulsaciones). Nada de `ease` a secas.
- Al pasar el ratón: pequeño (se levanta 4–6u, se desplaza o se tambalea),
  `--dur-hover` con `--ease-out`.
- Entradas: los objetos **caen y se asientan** (`--ease-asiento`) o se
  **deslizan** sobre la mesa; los textos aparecen uno tras otro (50–60ms entre
  cada uno); los sellos llegan los últimos, con un golpe.
- Microinteracciones (solo donde se puede pulsar):
  - Botón granate: se levanta 2px con `--sombra-boton-alta` y la flecha se
    adelanta 3px; al pulsar se hunde 1px con `--sombra-boton-baja` (80ms).
  - Flechas de enlace («Volver», anterior/siguiente): se mueven 4px hacia
    donde llevan; la ficha de anterior/siguiente pasa a `--sombra-3`.
  - Pestañas de fichero y carpeta: la ficha de detrás asoma 0,3em.
  - Flechas del carrusel: se hunden (escala 0,92) al pulsar.
  - En táctil, sin el destello azul de pulsación.
- Todo se desactiva con `prefers-reduced-motion`.
- Las frases al pasar el ratón por los objetos están en primera persona
  (cuentan algo de Marian) o son citas «frase — autor, año».

## 8. Composición

- **Menos es más**: Marian lo ha pedido varias veces. Antes de añadir un
  objeto, quitar otro.
- Colocación imperfecta: cada pieza ligeramente girada, nunca todo alineado.
- La mesa cambia con la página: las hojas impresas de los bordes cuentan lo
  que se ve en ella (`StageShell` → `bocetos`): bocetos de UX en Inicio,
  investigación en Casos (persona, mapa de experiencia, afinidad), primera
  conversación en Contacto (brief, agenda, doble diamante) y ninguna en Sobre
  mí, que lleva objetos personales. Chai, romero y pata de gato son fijos.
- El hilo rojo une las piezas de cada página y **nunca cruza texto**.
- Las zonas tocables miden al menos 44px aunque el objeto se vea más pequeño.
- En tablet y móvil se conservan los mismos objetos (carpeta con pestañas,
  cajón, post-its), reordenados en columna; no se sustituyen por componentes
  genéricos.

**Navegación entre secciones:**
- Sin migas de pan (Marian las quitó): el índice de la cabecera marca la
  sección y cada proyecto tiene «Volver al proyecto». En el móvil, sin atajos.
- En escritorio, atajos pequeños sobre la mesa: polaroid en miniatura
  (`MiniPolaroid`) de «Sobre mí» en Proyectos y Contacto, y el sello
  «Ponte en contacto» pequeño en Proyectos y Sobre mí.

## 9. Casos de estudio (expedientes)

- Una sola página por caso, hecha de **objetos de archivo**: nada de bloques
  de texto sueltos sobre la cuadrícula ni pases de diapositivas.
- Orden de los portfolios de UX: **cabecera** (resumen, cliente, contexto,
  papel, equipo, herramientas y el resultado en un post-it) → 01 Contexto y
  reto (con el objetivo) → 02 Investigación → 03 La solución (pantallas,
  decisiones de diseño y guía de estilo) → 04 Resultados → 05 Siguientes
  pasos → enlace al siguiente caso.
- Qué va en cada objeto:
  - **Cajón de fichero con pestañas** (`Fichas`, variante cajón): las personas.
  - **Carpeta con pestañas** (`Fichas`, variante carpeta): los cambios
    antes → después y las pantallas del prototipo.
  - **Post-its**: hallazgos y citas.
  - **Notas rasgadas**: el reto y el contexto, con los métodos en tiras Dymo.
  - **Ficha impresa**: la ficha técnica.
  - **Recortes con cinta**: los títulos de cada parte.
  - **Copias con cinta o clip**: las láminas del Figma y las capturas.
- **Diagramas propios, nunca capturas del Figma**: journey, arquitectura,
  service blueprint, benchmarking y contrastes se dibujan en la web
  (`components/Diagramas.tsx`) sobre láminas impresas, con los datos del Figma.
- **Pantallas en mockups**: móviles y portátil dibujados con capturas del
  prototipo real; «Cómo funciona» paso a paso y «Pruébalo aquí» con el
  prototipo en vivo dentro de un móvil.
- El hilo rojo une la portada con el título de cada parte por el margen.
- Objetos de la mesa relacionados con el caso en los márgenes (huellas y pata
  en Oh My Cat!, el lápiz en Cecotec).
- Es dinámico: las piezas aparecen al llegar a ellas, las pestañas se pasan
  con el ratón o el teclado y los post-its y copias se levantan al pasar.
- Solo lo comprobado («Probado»), nunca una lista de lo que falta.
- Si el trabajo fue en equipo, se dice y se nombra el papel de Marian.
- Los datos están en `textos/es.ts` y `en.ts` (tipo `Expediente`).

## 10. Contenido

- Web bilingüe: todo texto visible va en `src/textos/es.ts` y `en.ts`; nada
  escrito directamente en los componentes.
- No se inventan proyectos, datos ni resultados. El teléfono de Marian solo en el sobre de Contacto (enlace a WhatsApp), por petición suya.
- No poner post-its o rótulos encima de objetos que ya se explican solos.
