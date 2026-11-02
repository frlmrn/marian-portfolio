import type { HintText } from '../components/Hint'
import { paths } from '../lib/router'

/*
 * Textos en castellano (el idioma principal). La versión en inglés está en
 * en.ts y tiene que tener exactamente la misma forma.
 */

/** Textos de la portada (correcciones del 29-10-2026). */
export const home = {
  // Espacios duros: si se parte en móvil, el punto se queda con la palabra anterior
  etiqueta: 'Diseño digital · Experiencia · Identidad visual',
  titulo: { linea1: 'Hola, soy Marian.', linea2: 'Digital Designer.' },
  texto:
    'Investigo, conecto ideas y diseño experiencias digitales que combinan funcionalidad, creatividad y una identidad visual cuidada.',
  boton: 'Explora las tarjetas',
  pistaSello: ['Púlsalo', 'para', 'escribirme.'],
  chivato: ['Psst: lo que hay sobre la mesa', 'también se puede pulsar.'],
  /** Cita en la nota rasgada (Los argonautas del Pacífico occidental). */
  cita: {
    texto: 'Captar el punto de vista del nativo, su relación con la vida, comprender su visión de su mundo.',
    autor: 'Bronisław Malinowski',
    obra: 'Los argonautas del Pacífico occidental',
    año: 1922,
  },
  pagina: '01 / 04',
}

/**
 * Frases al pasar el ratón por los objetos de la mesa. Las citas llevan autor
 * y año; el resto son notas propias. x/y: dónde aparece la ficha (unidades de
 * la imagen, respecto al objeto).
 */
export const pistas = {
  chai: {
    lines: ['Chai latte: las mejores ideas', 'llegan con la taza aún caliente.'],
    x: -8,
    y: 120,
    align: 'end',
  },
  arquitectura: {
    lines: ['La forma sigue a la función.'],
    autor: 'Louis Sullivan, 1896',
    x: 81,
    y: 286,
  },
  flujo: {
    lines: ['No me hagas pensar.'],
    autor: 'Steve Krug, 2000',
    x: 330,
    y: -66,
  },
  wireframe: {
    lines: [
      'El poder de la Web está en su universalidad.',
      'El acceso de todo el mundo, sin importar',
      'la discapacidad, es esencial.',
    ],
    autor: 'Tim Berners-Lee, 1997',
    x: 300,
    y: -120,
  },
  pata: {
    lines: ['Me encantan los gatos:', 'siempre hay uno supervisando la mesa.'],
    x: 180,
    y: -40,
  },
  // Bocetos de Casos y Contacto (notas propias, salvo el doble diamante)
  persona: { lines: ['Mis personas salen de entrevistas', 'reales, no de la imaginación.'], x: 81, y: 286 },
  journey: { lines: ['Donde el recorrido duele,', 'es donde más se aprende.'], x: 330, y: -56 },
  afinidad: { lines: ['Ordenar post-its hasta que aparece', 'el patrón: mi parte favorita.'], x: 300, y: -70 },
  brief: { lines: ['Antes de diseñar,', 'pregunto. Mucho.'], x: 81, y: 286 },
  agenda: { lines: ['Me gusta empezar', 'con una conversación tranquila.'], x: 330, y: -56 },
  diamante: {
    lines: ['Primero entender el problema;', 'después, diseñar la solución.'],
    autor: 'Doble diamante · Design Council, 2005',
    x: 300,
    y: -90,
  },
  romero: {
    lines: ['«Aquí hay romero,', 'que es para el recuerdo.»'],
    autor: 'William Shakespeare, Hamlet, c. 1600 · foto: Fir0002, CC BY-SA 3.0',
    x: 150,
    y: -10,
  },
  // Objetos personales (solo en «Sobre mí»): cuentan algo de Marian
  whitby: {
    lines: ['Debilidad por las leyendas oscuras:', 'en Whitby desembarca Drácula, lectura obligada.'],
    autor: 'Whitby, c. 1885 · foto de F. M. Sutcliffe',
    x: 210,
    y: 30,
  },
  medusa: {
    lines: ['La mitología griega es una de mis pasiones:', 'Medusa, la mirada que convertía en piedra.'],
    autor: 'Hidria del Pintor de Pan, s. V a. C.',
    x: 150,
    y: 10,
  },
  azahar: {
    lines: ['Vivo en Sevilla:', 'en primavera, la ciudad huele a azahar.'],
    autor: 'Foto: Zeynel Cebeci, CC BY-SA 4.0',
    x: 120,
    y: 40,
  },
  persefone: {
    lines: [
      'Perséfone: medio año en el inframundo',
      'y medio en la tierra. Mis mitos favoritos',
      'siempre tienen su lado oscuro.',
    ],
    autor: 'Copa ática, c. 430 a. C. · foto: Marie-Lan Nguyen, CC BY 2.5',
    x: -8,
    y: 20,
    align: 'end',
  },
  lirio: {
    lines: ['Me gustan las plantas con significado:', 'en Japón, el lirio de araña acompaña a los muertos.'],
    autor: 'Foto: Jim Evans, CC BY-SA 4.0',
    x: -8,
    y: -30,
    align: 'end',
  },
  frankenstein: {
    lines: [
      'Leer es mi pasión, sobre todo los clásicos',
      'escritos por mujeres. Mary Shelley empezó',
      'Frankenstein con dieciocho años.',
    ],
    autor: 'Frontispicio de Frankenstein, 1831',
    x: 0,
    y: -96,
  },
  bronte: {
    lines: ['Charlotte, Emily y Anne Brontë:', 'de mis autoras de cabecera.'],
    autor: 'Retrato de Branwell Brontë, c. 1834',
    x: 0,
    y: -70,
  },
  nomeolvides: {
    lines: ['Nomeolvides: una flor pequeña', 'que pide que no la olvides.'],
    autor: 'Foto: Douglas Goldman, CC BY-SA 4.0',
    x: -8,
    y: 20,
    align: 'end',
  },
} satisfies Record<string, HintText>

/** Tarjetas polaroid: son la navegación principal de la portada. */
export type CardItem = {
  id: 'cecotec' | 'ohmycat' | 'massolis' | 'sobre-mi'
  /** Número de caso (las tarjetas que no son casos no lo llevan). */
  numero?: string
  nombre: string
  descripcion: string
  to: string
  /** Imagen definitiva del caso; mientras no exista, la foto queda vacía. */
  imagen?: string
  alt?: string
  /** Anotación de archivo junto a la tarjeta. */
  nota?: string[]
}

export const cards: Record<CardItem['id'], CardItem> = {
  cecotec: {
    id: 'cecotec',
    alt: 'La app de Cecotec en tres móviles: el inicio, Ceco respondiendo y la realidad aumentada',
    numero: '01',
    nombre: 'Cecotec',
    descripcion: 'App, chatbot y AR',
    to: `${paths.casos}/cecotec`,
    nota: ['Conversaciones', 'que resuelven.'],
  },
  ohmycat: {
    id: 'ohmycat',
    alt: 'La web de Oh My Cat! en un portátil y en un móvil',
    numero: '02',
    nombre: 'Oh My Cat!',
    descripcion: 'Web responsive y rebranding',
    to: `${paths.casos}/ohmycat`,
    nota: ['Marcas que', 'dejan huella.'],
  },
  massolis: {
    id: 'massolis',
    alt: 'El panel de MASSolisapp en un portátil y la app del profesional en un móvil',
    numero: '03',
    nombre: 'MASSolisapp',
    descripcion: 'Plataforma de gestión de servicios',
    to: `${paths.casos}/massolis`,
    nota: ['Todo el equipo,', 'en una pantalla.'],
  },
  'sobre-mi': {
    id: 'sobre-mi',
    alt: 'Retrato en blanco y negro de Marian',
    nombre: 'Sobre mí',
    descripcion: 'Quién soy y cómo trabajo',
    to: paths['sobre-mi'],
  },
}

export const pages = {
  'sobre-mi': {
    numero: '02 / 04',
    titulo: ['Detrás de cada idea,', 'una buena pregunta.'],
  },
  casos: { numero: '03 / 04', titulo: ['Proyectos abiertos.'] },
  contacto: { numero: '04 / 04', titulo: ['Abramos', 'un nuevo caso.'] },
}

/*
 * Textos de las secciones interiores (borrador a partir de las referencias
 * del 29-10-2026; pendientes de revisión de Marian). Los casos solo cuentan
 * lo que hacen los prototipos: sin resultados ni datos inventados.
 */
export const sobreMi = {
  nombre: 'Marian López Solís',
  rol: 'Antropóloga y diseñadora digital',
  gancho: ['Estudié antropología para entender a las personas.', 'Ahora diseño para ellas.'],
  lead: 'Investigo cómo vive la gente y lo convierto en webs, apps e identidades claras. Integro agentes de IA en mi proceso para validar ideas y llegar antes a prototipos funcionales.',
  datos: ['Sevilla', 'Disponibilidad inmediata', 'Español nativo', 'Inglés C1'],
  /** Trayectoria (de los CV de Marian, octubre de 2026) */
  trayectoria: [
    {
      fecha: 'Ene–jul 2026',
      puesto: 'UX Designer en prácticas',
      lugar: 'Green Hat Workers / YellowBreak',
      corto: 'YellowBreak',
      detalle: 'Auditorías UX, rediseño web, sistemas de diseño e IA',
    },
    {
      fecha: 'Ago 2025–jul 2026',
      puesto: 'UX Researcher & UX Designer',
      lugar: 'Grupo Portillo',
      corto: 'Portillo',
      referencia: true,
      detalle: 'Investigación de usuarios y rediseño web',
    },
    {
      fecha: 'Oct 2024–mar 2025',
      puesto: 'Investigación de usuarios',
      lugar: 'Asociación Andaluza Prader-Willi',
      corto: 'Prader-Willi',
      detalle: 'Entrevistas, encuestas y seguimiento de más de 50 familias',
    },
    {
      fecha: 'Ago 2018–ago 2020',
      puesto: 'Operaciones y análisis de procesos',
      lugar: 'Massoluciones',
      corto: 'Massoluciones',
      detalle: 'Mejora de procesos y manuales internos',
    },
  ],
  formacion: [
    {
      titulo: 'Máster en Diseño de Experiencia de Usuario (UX)',
      centro: 'UNIR',
      fecha: '2025–2026',
    },
    {
      titulo: 'Programa avanzado en IA aplicada al diseño',
      centro: 'UNIR',
      fecha: '2025–2026',
    },
    {
      titulo: 'Grado en Antropología Social y Cultural',
      centro: 'Universidad de Sevilla',
      fecha: '2021–2025',
    },
  ],
  /** Carpeta de herramientas: la primera de cada grupo se destaca; «ia» se abre de inicio */
  herramientas: [
    {
      id: 'ux',
      grupo: 'Diseño UX/UI',
      corto: 'UX/UI',
      items: ['Figma', 'FigJam', 'Adobe XD', 'Framer'],
    },
    {
      id: 'research',
      grupo: 'Investigación',
      corto: 'Research',
      items: [
        'Entrevistas',
        'Test de usabilidad',
        'Card sorting',
        'Tree testing',
        'Análisis heurístico',
        'Miro',
        'Dovetail',
        'Hotjar',
      ],
    },
    {
      id: 'ia',
      grupo: 'IA',
      corto: 'IA',
      items: ['Agentes de IA', 'Claude', 'ChatGPT', 'Gemini', 'NotebookLM', 'Kimi', 'Midjourney', 'Nano Banana'],
    },
    {
      id: 'web',
      grupo: 'Web',
      corto: 'Web',
      items: ['WordPress', 'HTML', 'CSS', 'Elementor', 'WooCommerce', 'SEO', 'Accesibilidad web'],
    },
    {
      id: 'datos',
      grupo: 'Datos',
      corto: 'Datos',
      items: ['Looker Studio', 'Power BI', 'Excel', 'Google Sheets', 'SPSS'],
    },
    {
      id: 'visual',
      grupo: 'Diseño visual',
      corto: 'Visual',
      items: ['Illustrator', 'Photoshop', 'InDesign', 'Affinity', 'Canva'],
    },
  ],
  nota: ['Las buenas ideas', 'también se encuentran.'],
  boton: 'Explorar mis proyectos',
}

export type Caso = {
  id: 'cecotec' | 'ohmycat' | 'massolis'
  categoria: string
  descripcion: string
  claves: string[]
  nota: string[]
}

export const casos: Caso[] = [
  {
    id: 'cecotec',
    categoria: 'App móvil · Chatbot · AR',
    descripcion:
      'Rediseño de la app de Cecotec: un catálogo por familias, la posventa reunida en «Tu cuenta», Ceco, un asistente virtual que resuelve dudas de compra, envíos y garantía, y la realidad aumentada para ver cada electrodoméstico en casa.',
    claves: ['UX/UI móvil', 'Asistente conversacional', 'Prototipo interactivo'],
    nota: ['Conversaciones', 'que resuelven.'],
  },
  {
    id: 'ohmycat',
    categoria: 'Web responsive · Rebranding',
    descripcion:
      'Web del cat café de la Asociación Ghato Verde en Sevilla: reserva de visitas en tres pasos, fichas de los gatos en adopción y un formulario para colaborar como voluntaria, casa de acogida o con donaciones.',
    claves: ['Auditoría del diseño', 'Flujo de reserva', 'Web responsive'],
    nota: ['Marcas que', 'dejan huella.'],
  },
  {
    id: 'massolis',
    categoria: 'Plataforma de gestión · Panel web, app y portal del cliente',
    descripcion:
      'Herramienta de operaciones para Massoluciones: un panel web para organizar servicios, agenda y equipo, una app para que cada profesional lleve su día con tareas, fotos y el manual digital, un portal para el cliente y facturación.',
    claves: ['Research desde operaciones', 'Panel, app y portal del cliente', 'Prototipo con agentes de IA'],
    nota: ['Todo el equipo,', 'en una pantalla.'],
  },
]

export const contacto = {
  texto: ['Cuéntame qué tienes entre manos.', 'Empezamos por una conversación.'],
  nota: ['Toda idea', 'empieza por aquí.'],
  /** Correo que recibe los mensajes (de los CV de Marian). Vacío = formulario sin conectar. */
  email: 'frlmrn13@gmail.com',
  linkedin: 'https://www.linkedin.com/in/marian-lopez-solis-a15707389',
  /** Teléfono (de los CV): Marian pidió publicarlo con enlace a WhatsApp */
  telefono: '+34 645 53 22 65',
  /** Sobre con los datos de contacto directos */
  sobre: {
    titulo: 'O escríbeme directamente',
    para: 'Para',
    ciudad: 'Sevilla, España',
    whatsapp: 'Escribirme por WhatsApp al',
    linkedin: 'Mi perfil de LinkedIn',
  },
  boton: 'Enviar mensaje',
  pasos: ['Me cuentas qué tienes entre manos.', 'Lo conversamos con calma.', 'Y abrimos el caso.'],
}

/** Textos sueltos de la interfaz: menú, etiquetas, formulario y bocetos. */
export const ui = {
  titulos: {
    inicio: 'Marian | Digital Designer — Diseño digital y UX/UI',
    'sobre-mi': 'Sobre mí | Marian, Digital Designer',
    casos: 'Proyectos | Marian, Digital Designer',
    contacto: 'Contacto | Marian, Digital Designer',
  },
  /** Descripción de cada página para buscadores y al compartir el enlace */
  descripciones: {
    inicio:
      'Portfolio de Marian López Solís, antropóloga y diseñadora digital en Sevilla: investigación con usuarios, UX/UI e identidad visual en proyectos como Cecotec, Oh My Cat! y MASSolisapp.',
    'sobre-mi':
      'Marian López Solís: antropóloga y diseñadora digital. Su trayectoria, formación (Máster en UX, IA aplicada al diseño) y herramientas.',
    casos:
      'Proyectos de Marian López Solís: la app de Cecotec con asistente y realidad aumentada, la web de Oh My Cat! y la plataforma de gestión MASSolisapp.',
    contacto: 'Escribe a Marian López Solís para empezar un proyecto de diseño digital o de investigación con usuarios.',
  },
  /** Título de la página de un expediente */
  noEncontrado: {
    titulo: 'Página no encontrada | Marian, Digital Designer',
    rotulo: 'Error 404',
    h1: ['Esta hoja no está', 'en el archivo.'],
    texto: 'Puede que la dirección esté mal escrita o que la página ya no exista. Elige por dónde seguir:',
    nota: ['Hasta los mejores archivos', 'pierden algún papel.'],
  },
  tituloExpediente: (nombre: string) => `${nombre} · Proyecto | Marian, Digital Designer`,
  menu: {
    inicio: 'Inicio',
    'sobre-mi': 'Sobre mí',
    casos: 'Proyectos',
    contacto: 'Contacto',
  },
  referencia: {
    clip: 'Referencias',
    abrir: 'Abrir la carta de referencia de Grupo Portillo',
    titulo: 'Carta de referencia · Grupo Portillo',
    idiomas: { es: 'ES', en: 'EN' },
    descargar: 'Descargar PDF',
    cerrar: 'Cerrar',
    alt: 'Carta de referencia firmada por José Manuel Portillo: Marian colaboró con Grupo Portillo durante aproximadamente un año en análisis, estrategia, marketing y experiencia digital.',
  },
  irInicio: 'Marian, ir al inicio',
  secciones: 'Secciones',
  indice: 'Índice',
  idioma: 'Idioma',
  arriba: 'Volver arriba',
  sello: { arco: 'PONTE EN CONTACTO · ESCRÍBEME · ', centro: 'Hablemos', etiqueta: 'Ponte en contacto' },
  pagina: (numero: string) => `Página ${numero.replace(' / ', ' de ')}`,
  caso: 'Proyecto',
  proyectos: 'Proyectos y perfil',
  sobreMi: 'Sobre mí',
  dondeHeTrabajado: 'Dónde he trabajado',
  herramientas: 'Herramientas',
  ySoftware: 'y software',
  herramientasYSoftware: 'Herramientas y software',
  estudiado: 'Lo que he estudiado',
  casos: {
    sub: 'Proyectos, procesos y decisiones en contexto.',
    nav: 'Proyectos',
    indice: 'Índice de proyectos',
    claves: 'Claves del proyecto',
    pendiente: 'Proyecto completo en preparación.',
    pasar: 'Pasar de proyecto',
    anterior: 'Proyecto anterior',
    siguiente: 'Proyecto siguiente',
  },
  empezar: 'Cómo empezamos',
  form: {
    titulo: 'Ficha de proyecto',
    num: 'Nº 04',
    nombre: 'Tu nombre',
    email: 'Tu email',
    idea: 'Cuéntame tu idea',
    faltaNombre: 'Escribe tu nombre.',
    faltaEmail: 'Escribe tu email para poder responderte.',
    emailMal: 'Revisa el email: falta algo (por ejemplo, la @).',
    faltaIdea: 'Cuéntame en unas líneas qué tienes en mente.',
    ok: 'Mensaje enviado. Te responderé lo antes posible.',
    okCorreo: 'Se ha abierto tu programa de correo con el mensaje listo para enviar.',
    enviando: 'Enviando…',
    errorEnvio: 'No se ha podido enviar. Prueba otra vez o escríbeme a',
    asunto: 'Nuevo caso',
  },
  /** Expediente completo de un caso */
  expediente: {
    expediente: 'Expediente',
    migas: 'Volver',
    volver: 'Volver al proyecto',
    probar: 'Probar el prototipo',
    ficha: 'Ficha técnica',
    metodos: 'Métodos',
    personas: 'Personas',
    objetivo: 'Objetivo',
    frustracion: 'Barreras',
    hallazgos: 'Hallazgos',
    antes: 'Antes',
    despues: 'Después',
    colores: 'Paleta',
    probado: 'Probado',
    resuelve: 'Lo que resuelve',
    sinProbar: 'Sin probar todavía',
    navCasos: 'Más proyectos',
    todos: 'Ver todos los proyectos',
    abrir: 'Abrir el expediente completo',
    ia: 'Cómo trabajé con agentes de IA',
    referencia: 'Referencia',
    pasoAnterior: 'Anterior',
    pasoSiguiente: 'Siguiente',
    irPaso: (n: number) => `Ir a la pantalla ${n}`,
    objetivoEtq: 'Objetivo',
    encender: 'Encender el prototipo',
    completa: 'Abrir en pantalla completa',
    contrastes: 'Contrastes medidos',
    resultadoEtq: 'Resultado',
    resultados: 'Resultados',
    siguienteCaso: 'Siguiente proyecto',
    casoAnterior: 'Proyecto anterior',
    cajonPersonas: 'Personas',
    carpetaCambios: 'Antes y después',
    carpetaPantallas: 'Pantallas',
    estudiados: 'Lo que estudié',
  },
  /** Rótulos de los bocetos de UX de la mesa */
  bocetos: {
    arquitectura: 'ARQUITECTURA · v2',
    inicio: 'Inicio',
    casos: 'Proyectos',
    perfil: 'Perfil',
    contacto: 'Contacto',
    reticula: 'RETÍCULA 6 COL · 8 PT',
    escala: 'ESCALA TIPOGRÁFICA',
    espaciado: 'ESPACIADO',
    flujo: 'FLUJO DE USUARIO · RESERVA',
    entrada: 'Entrada',
    elegirDia: 'Elegir día',
    datos: 'Datos',
    acceso: 'Acceso',
    confirmar: 'Confirmar',
    cuenta: '¿cuenta?',
    si: 'sí',
    pasoLargo: 'Paso más largo: simplificar',
    foco: 'Orden de foco',
    wireframe: 'WIREFRAME · ESCRITORIO',
    componentes: 'COMPONENTES',
    boton: 'Botón',
    secundario: 'Secundario',
    campo: 'Campo de texto',
    minimo: 'mín. 44 px',
    accesibilidad: 'ACCESIBILIDAD',
    contraste: 'Contraste 4,5:1',
    focoVisible: 'Foco visible',
    // Casos: investigación
    persona: 'PERSONA · PROTO',
    objetivos: 'OBJETIVOS',
    frustraciones: 'FRUSTRACIONES',
    cita: 'CITA',
    canales: 'CANALES',
    journey: 'MAPA DE EXPERIENCIA',
    etapas: ['Descubre', 'Compara', 'Reserva', 'Visita', 'Vuelve'],
    friccion: 'Fricción',
    oportunidad: 'Oportunidad',
    afinidad: 'MAPA DE AFINIDAD',
    grupos: ['Confianza', 'Dudas', 'Navegación'],
    insight: 'Insight',
    // Contacto: primera conversación
    brief: 'BRIEF · PRIMERA LLAMADA',
    preguntas: ['¿Qué problema hay?', '¿Para quién es?', '¿Qué existe ya?', '¿Qué plazos hay?', '¿Cómo sabremos si funciona?'],
    notas: 'NOTAS',
    agenda: 'AGENDA · SEMANA',
    dias: ['L', 'M', 'X', 'J', 'V'],
    conversacion: 'Primera conversación',
    diamante: 'DOBLE DIAMANTE',
    fases: ['Descubrir', 'Definir', 'Desarrollar', 'Entregar'],
    problema: 'Reto',
    solucion: 'Solución',
  },
}

/*
 * Expedientes completos de los casos. La página los compone como objetos de
 * archivo; los diagramas (journey, arquitectura, blueprint, benchmarking) se
 * dibujan en la web a partir del Figma, no son capturas. Las pantallas son
 * del prototipo real y se nombran por clave (ver views/Expediente.tsx).
 */
type Estado = 'si' | 'parcial' | 'no' | 'na'
export type Diagrama =
  | {
      tipo: 'journey'
      titulo: string
      pie: string
      grupos?: { nombre: string; n: number }[]
      /** nivel: altura en la curva del Figma, de -2 (peor) a 2 (mejor) */
      etapas: { nombre: string; nivel: number; emocion?: string; dolor?: boolean }[]
      /** Filas del journey; la curva va después de la fila número `curvaTras` */
      filas: { nombre: string; celdas: string[] }[]
      curva: string
      curvaTras: number
      leyenda?: string
    }
  | {
      tipo: 'arbol'
      titulo: string
      pie: string
      raiz: string
      ramas: { nombre: string; hijos?: string[]; nuevo?: boolean }[]
      aparte?: { nombre: string; hijos?: string[]; nuevo?: boolean }[]
      leyenda?: string
    }
  | {
      tipo: 'blueprint'
      titulo: string
      pie: string
      fases: string[]
      tiempos?: string[]
      carriles: { nombre: string; celdas: string[]; linea?: string }[]
      mejora?: { fila: string; col: number; texto: string }
    }
  | {
      tipo: 'bench'
      titulo: string
      pie: string
      leyenda: Record<Estado, string>
      /** Conclusión en una frase, encima de los grupos */
      resumen: string
      filas: { criterio: string; estado: Estado }[]
    }

export type Expediente = {
  categoria: string
  lead: string
  ficha: { k: string; v: string }[]
  prototipo: string
  /** Resultado principal, en una frase (va en la cabecera) */
  resultado: string
  reto: {
    titulo: string
    texto: string[]
    objetivo: string
    cita?: { texto: string; autor: string }
    /** La web original, como referencia */
    referencia?: { nota: string; imgs: string[] }
  }
  investigacion: {
    titulo: string
    nota: string
    metodos: string[]
    personas?: { nombre: string; perfil: string; objetivo: string; frustracion: string; cita: string }[]
    diagramas: Diagrama[]
    hallazgos: string[]
  }
  solucion: {
    titulo: string
    nota: string
    /** Mockup de portada: un portátil con un móvil delante, o varios móviles */
    mockup: { portatil?: string; moviles: string[] }
    pasosTitulo: string
    pasos: { img: string; titulo: string; texto: string }[]
    probarTitulo: string
    probarNota: string
    /** Versión web (escritorio): pantallas en portátil */
    web?: {
      titulo: string
      /** La web original frente al rediseño */
      comparar?: { antes: { img: string; texto: string }; despues: { img: string; texto: string } }
      pasos: { img: string; titulo: string; texto: string }[]
    }
    /** Aviso al inicio de la solución (el manual lleva datos de ejemplo) */
    aviso?: string
    /** Bloque de pantallas móviles propio (el manual de MASSolisapp) */
    manual?: { titulo: string; nota: string; pasos: { img: string; titulo: string; texto: string }[] }
    /** Otro perfil con su propia app (el portal del cliente de MASSolisapp) */
    cliente?: { titulo: string; nota: string; pasos: { img: string; titulo: string; texto: string }[] }
    /** Dónde se prueba el prototipo en vivo en pantallas anchas */
    probarEn?: 'movil' | 'portatil'
    /** Realidad aumentada: pasos del prototipo y lo explorado en Figma */
    ar?: {
      titulo: string
      nota: string
      pasos: { img: string; titulo: string; texto: string }[]
      exploracionTitulo: string
      estados: { texto: string; tono: 'calc' | 'ok' | 'no' }[]
      exploracion: string[]
    }
  }
  cambios: { titulo: string; nota: string; items: { tab: string; antes: string; despues: string }[] }
  /** SEO del prototipo: etiquetas reales del HTML */
  seo?: { titulo: string; nota: string; codigo: string[]; puntos: string[] }
  /** Logo diseñado por Marian (Oh My Cat!) */
  logo?: { titulo: string; nota: string; antes?: { img: string; pie: string }; versiones: { img: string; pie: string }[] }
  estilo?: {
    titulo: string
    nota: string
    colores: { nombre: string; hex: string }[]
    tipografia: string
    tipografiaNota: string
    contrastes: { texto: string; fondo: string; tinta: string; ratio: string }[]
  }
  probado: string[]
  /** Problemas que resuelve (sustituye a «Probado» en Resultados) */
  resuelve?: string[]
  /** Bocetos a tinta en los márgenes: clave del dibujo y su nota */
  garabatos: { dibujo: string; nota: string }[]
  /** Cómo trabajó Marian con agentes de IA en el caso */
  ia: { intro: string; etiquetas: string[]; pasos: { titulo: string; texto: string }[] }
  alt: Record<string, string>
}

export const expedientes: Record<string, Expediente> = {
  cecotec: {
    categoria: 'App móvil · Chatbot · AR',
    lead: 'Una app de e-commerce reorganizada para que comprar y resolver la posventa sea más fácil: un catálogo por familias, «Tu cuenta» con toda la posventa y dos propuestas de valor, Ceco, un asistente virtual, y la realidad aumentada para ver cada electrodoméstico en casa.',
    ficha: [
      { k: 'Cliente', v: 'Cecotec · dos reuniones con la empresa' },
      { k: 'Mi rol', v: 'Lideré el UX Research y la auditoría de accesibilidad, y construí la simulación interactiva' },
      { k: 'Equipo', v: 'Tres personas' },
      { k: 'Contexto', v: 'Trabajo Fin de Máster · UNIR · julio de 2026' },
      { k: 'Herramientas', v: 'Figma · UXtweak · Google Forms · TAW · Agentes de IA' },
    ],
    prototipo: '/prototipos/cecotec/index.html',
    resultado: 'En el test de usabilidad con 7 personas, Ceco fue de lo más valorado.',
    reto: {
      titulo: 'Contexto y reto',
      texto: [
        'La experiencia móvil de Cecotec no estaba a la altura de su catálogo: demasiadas categorías al mismo nivel, productos, accesorios y posventa mezclados, y barreras de accesibilidad en momentos clave.',
        'Lo más difícil era lo de después de comprar: gestionar una reparación o encontrar un repuesto.',
      ],
      objetivo: 'Diseñar una app que reduzca la carga cognitiva, con una navegación más clara y la posventa en un solo sitio.',
      cita: { texto: 'El diseño en móvil se siente algo torpe al intentar navegar por ella.', autor: 'Una de las personas encuestadas' },
      referencia: {
        nota: 'Así se ve la web de Cecotec en el móvil, el punto de partida: un carrusel de ofertas a pantalla completa y un menú lateral con muchas familias de producto al mismo nivel. Capturada en octubre de 2026.',
        imgs: ['original-home', 'original-menu'],
      },
    },
    investigacion: {
      titulo: 'Investigación',
      nota: 'Lideré la investigación del equipo: la encuesta, el análisis de los resultados y la auditoría de accesibilidad con WCAG 2.2. Con el card sorting y el benchmarking definimos tres personas y sus journeys.',
      metodos: ['Encuesta · 36', 'Card sorting · 20', 'Benchmarking · 11 apps', 'Auditoría WCAG 2.2', 'Personas y journeys'],
      personas: [
        {
          nombre: 'Javier',
          perfil: '22 años · Compra rápida desde el móvil',
          objetivo: 'Comparar dos modelos y comprar sin pasos de más.',
          frustracion: 'Menús que se traban, un «volver» que pierde el progreso y demasiadas categorías.',
          cita: 'Espero encontrar lo que busco antes de llegar a mi parada.',
        },
        {
          nombre: 'Lucía',
          perfil: '31 años · Garantías y reparaciones',
          objetivo: 'Gestionar la garantía y la reparación desde la app.',
          frustracion: 'Contactar con soporte está lleno de barreras; se siente abandonada tras comprar.',
          cita: 'No quiero pelear con la versión web, prefiero hacerlo desde la app.',
        },
        {
          nombre: 'Carlos',
          perfil: '27 años · Mantenimiento y repuestos',
          objetivo: 'Encontrar repuestos compatibles y seguir su envío.',
          frustracion: 'Filtros que no funcionan y demasiadas notificaciones promocionales.',
          cita: 'Sé exactamente lo que busco, espero que el buscador aplique bien los filtros.',
        },
      ],
      diagramas: [
        {
          tipo: 'journey',
          titulo: 'Journey de Javier',
          pie: 'Escenario: quiere comprar un robot aspirador desde el móvil, en el transporte público, y necesita ver las diferencias entre dos modelos muy parecidos.',
          etapas: [
            { nombre: 'Acceso a la app', nivel: 0, emocion: 'Expectante' },
            { nombre: 'Búsqueda en catálogo', nivel: 0, emocion: 'Concentrado' },
            { nombre: 'Comparación', nivel: 0.6, emocion: 'Aliviado' },
            { nombre: 'Añadir al carrito', nivel: 1, emocion: 'Satisfecho' },
            { nombre: 'Checkout (pago)', nivel: 1.4, emocion: 'Encantado' },
          ],
          filas: [
            {
              nombre: 'Pensamientos',
              celdas: [
                '«Espero encontrar lo que busco antes de llegar a mi parada.»',
                '«¿Cuáles son las características y diferencias de estos modelos similares?»',
                '«Con esta vista puedo comparar las especificaciones sin leer textos densos.»',
                '«Perfecto, ya lo tengo claro, voy a comprarlo.»',
                '«Qué bien, una transacción rápida y sin fricciones.»',
              ],
            },
            {
              nombre: 'Puntos de dolor',
              celdas: [
                'La interfaz móvil actual se siente torpe.',
                'Los menús se quedan trabados al navegar.',
                'Imposibilidad de comparar productos fácilmente por el exceso de categorías.',
                'El botón de «volver atrás» no funciona bien y le hace perder el progreso.',
                'Fricciones tecnológicas durante el proceso de pago.',
              ],
            },
            {
              nombre: 'Oportunidades',
              celdas: [
                'Diseñar una pantalla de inicio libre de carga cognitiva que guíe directamente al catálogo.',
                'Implementar una navegación fluida que respete el flujo del usuario y evite menús trabados.',
                'Integrar un comparador táctil que enfrente especificaciones y características de productos similares.',
                'Asegurar un diseño donde el botón «volver atrás» mantenga el progreso y el contexto.',
                'Reducir el checkout a los pasos mínimos esenciales para lograr interacciones ágiles y directas.',
              ],
            },
          ],
          curva: 'Emociones',
          curvaTras: 2,
        },
        {
          tipo: 'bench',
          titulo: 'La web actual frente a 11 apps del sector',
          pie: 'Benchmarking de 11 apps (Amazon, IKEA, MediaMarkt, Samsung Shop…) con 12 criterios; aquí, cómo salía la web de Cecotec.',
          leyenda: { si: 'Cumple', parcial: 'Cumple a medias', no: 'No cumple', na: 'No evaluado' },
          resumen: 'La web actual no cumplía del todo ninguno de los 12 criterios.',
          filas: [
            { criterio: 'Arquitectura y navegación', estado: 'parcial' },
            { criterio: 'Búsqueda y catálogo', estado: 'no' },
            { criterio: 'Ficha de producto', estado: 'parcial' },
            { criterio: 'Checkout y compra', estado: 'parcial' },
            { criterio: 'Seguimiento y pedidos', estado: 'no' },
            { criterio: 'Área de cliente y posventa', estado: 'no' },
            { criterio: 'Fidelización y puntos', estado: 'no' },
            { criterio: 'Gamificación y contenido', estado: 'no' },
            { criterio: 'Diseño visual y consistencia', estado: 'parcial' },
            { criterio: 'Accesibilidad', estado: 'na' },
            { criterio: 'Ayuda, soporte y errores', estado: 'no' },
            { criterio: 'IA, AR y ecosistema', estado: 'parcial' },
          ],
        },
        {
          tipo: 'arbol',
          titulo: 'Nueva arquitectura de la app',
          pie: 'Sitemap de la app: cuatro apartados en la barra inferior y la posventa reunida en «Tu cuenta».',
          raiz: 'App Cecotec',
          ramas: [
            { nombre: 'Inicio', hijos: ['Ofertas de temporada', 'Podría gustarte'] },
            {
              nombre: 'Catálogo',
              hijos: ['Electrodomésticos', 'Climatización', 'Cuidado personal', 'Fitness', 'Mascotas', 'Movilidad', 'Bricolaje y exterior', 'Repuestos'],
            },
            { nombre: 'Carrito', hijos: ['Tramitar compra'] },
            {
              nombre: 'Tu cuenta',
              nuevo: true,
              hijos: ['Mis favoritos', 'Mis pedidos', 'Mi cuenta', 'Mis dispositivos', 'Historial de compras', 'Notificaciones', 'Ajustes', 'Soporte y atención al cliente', 'Términos y políticas'],
            },
          ],
          aparte: [{ nombre: 'Ceco', nuevo: true, hijos: ['botón en todas las pantallas'] }],
          leyenda: 'Centro de la posventa y el asistente virtual.',
        },
      ],
      hallazgos: [
        'El 80,6 % compra online desde el móvil.',
        'La mayor frustración: «menús poco claros» (38,9 %).',
        'Comparar productos y encontrar repuestos, lo más difícil.',
        'Aceptan avisos útiles: el estado del pedido (82,4 %).',
        'Borrarían la app por exceso de notificaciones (70,6 %).',
        'El catálogo estaba demasiado fragmentado: el card sorting lo reorganizó.',
      ],
    },
    solucion: {
      titulo: 'La solución',
      nota: 'Una app con cuatro apartados en la barra inferior y dos propuestas de valor: Ceco, el asistente virtual, siempre a mano en la esquina de la pantalla, y la realidad aumentada para ver si un electrodoméstico cabe en tu casa.',
      mockup: { moviles: ['bienvenida', 'respuesta', 'ar-encaja'] },
      pasosTitulo: 'Cómo funciona',
      pasos: [
        { img: 'bienvenida', titulo: 'Ceco se presenta', texto: 'Al entrar, explica qué puede hacer y dónde encontrarlo.' },
        { img: 'respuesta', titulo: 'Preguntas y responde', texto: 'Envíos, devoluciones o garantías, sin salir de la pantalla.' },
        { img: 'catalogo', titulo: 'Catálogo ordenado', texto: 'Buscador visible y las familias del card sorting.' },
        { img: 'producto', titulo: 'Ficha de producto', texto: 'Precio, envío, stock y garantía de un vistazo.' },
        { img: 'anadido', titulo: 'Añadir al carrito', texto: 'Confirmación clara y la opción de seguir comprando.' },
        { img: 'carrito', titulo: 'Carrito simplificado', texto: 'Solo lo esencial para tramitar la compra.' },
      ],
      probarTitulo: 'Pruébalo aquí',
      probarNota: 'Es la simulación interactiva: toca el icono de Cecotec, abre a Ceco con el botón del robot o entra en un frigorífico y pulsa «Ver producto en mi espacio 3D».',
      ar: {
        titulo: 'Ver el producto en tu casa (AR)',
        nota: 'La segunda propuesta de valor: desde la ficha de un frigorífico, la app mide el hueco con la cámara y coloca el producto en tu espacio para saber si cabe antes de comprarlo. En el test fue una de las tres tareas: comprar un frigorífico y verlo con realidad aumentada.',
        pasos: [
          { img: 'ar-ficha', titulo: 'Desde la ficha', texto: '«Ver producto en mi espacio 3D», junto a añadir al carrito.' },
          { img: 'ar-calculando', titulo: 'Mide el hueco', texto: 'La cámara calcula el espacio disponible.' },
          { img: 'ar-encaja', titulo: '¿Cabe?', texto: 'Alto, ancho y fondo, y el aviso de si hay espacio suficiente.' },
          { img: 'ar-recomendados', titulo: 'Otras opciones', texto: 'Si sobra espacio, productos con medidas parecidas.' },
        ],
        exploracionTitulo: 'Diseñado en Figma',
        estados: [
          { texto: 'Calculando espacio…', tono: 'calc' },
          { texto: 'Espacio suficiente', tono: 'ok' },
          { texto: 'Espacio insuficiente', tono: 'no' },
        ],
        exploracion: [
          'Si el producto no encaja, Ceco pregunta: «¿Quieres ver otras opciones que encajan en tu espacio?».',
          'Desde Inicio, medir un hueco sin producto elegido y ver qué modelos encajan con esas medidas.',
          'Escanear la superficie moviendo el móvil despacio y guardar la medida.',
        ],
      },
    },
    cambios: {
      titulo: 'De la auditoría al diseño',
      nota: 'Mi auditoría WCAG 2.2 de la web actual se convirtió en requisitos para la app. Pasa las pestañas.',
      items: [
        { tab: 'Imágenes', antes: 'Banners e imágenes de producto sin texto alternativo.', despues: 'Texto alternativo descriptivo, y vacío en las imágenes decorativas.' },
        { tab: 'Contraste', antes: 'Contraste insuficiente en textos, precios y descuentos.', despues: 'Contraste mínimo de 4,5:1; el botón principal lo supera.' },
        { tab: 'Foco', antes: 'Foco de teclado casi invisible en el inicio de sesión y la compra.', despues: 'Foco claramente visible en todos los elementos interactivos.' },
        { tab: 'Enlaces', antes: 'Enlaces genéricos «Ver más».', despues: 'Enlaces que dicen adónde llevan.' },
        { tab: 'Botones', antes: 'Botones sin nombre accesible en el inicio de sesión.', despues: 'Cada botón con su nombre accesible.' },
        { tab: 'Errores', antes: 'Errores comunicados solo con color.', despues: 'Errores que no dependen del color.' },
        { tab: 'Catálogo', antes: 'Demasiadas categorías al mismo nivel.', despues: 'Familias de producto a partir del card sorting, y la posventa en «Tu cuenta».' },
      ],
    },
    garabatos: [
      { dibujo: 'cec-home', nota: 'Cuatro apartados, abajo' },
      { dibujo: 'cec-catalogo', nota: 'Buscador a la vista' },
      { dibujo: 'cec-ceco', nota: 'Ceco, siempre a mano' },
      { dibujo: 'cec-ar', nota: '¿Cabe? Alto, ancho y fondo' },
    ],
    probado: [
      'Test de usabilidad con 7 participantes y tres tareas.',
      'Ceco, muy valorado: «El robot asistente, muy funcional».',
      'Mejoras pedidas: migas de pan y estados activos más claros.',
      'Dos reuniones con Cecotec sobre la app.',
    ],
    ia: {
      intro: 'La simulación de la app la construí dirigiendo agentes de IA a partir del prototipo de Figma del equipo: yo decidía qué hacer y cómo, el agente lo programaba y yo revisaba cada resultado.',
      etiquetas: ['Agentes de IA', 'LLM', 'Prompting', 'Contexto', 'Revisión humana'],
      pasos: [
        { titulo: 'Del Figma al código', texto: 'El agente leyó las interacciones del prototipo de Figma, qué botón lleva a qué pantalla y cada animación, y las replicó anotando de dónde salía cada una.' },
        { titulo: 'Hipótesis a la vista', texto: 'Donde el Figma no decía nada, propuso hipótesis marcadas como tales, por ejemplo que la barra de inicio abre a Ceco, y yo decidía.' },
        { titulo: 'Errores detectados', texto: 'Encontró fallos del propio Figma, como una tarjeta que llevaba a «Mis favoritos» en vez de al dispositivo, y los corregimos.' },
        { titulo: 'Ceco y la AR, funcionando', texto: 'Las respuestas de Ceco y la simulación de realidad aumentada funcionan en el navegador, con datos de demostración.' },
        { titulo: 'Los detalles', texto: 'Microinteracciones como el producto que vuela al carrito o el check que se dibuja al confirmar la compra.' },
      ],
    },
    alt: {
      bienvenida: 'Inicio de la app con Ceco presentándose: «¡Hola! Soy Ceco, tu asistente virtual»',
      ceco: 'Ceco abierto, listo para recibir una pregunta',
      respuesta: 'Conversación con Ceco sobre el plazo de envío y cómo devolver un producto',
      home: 'Inicio de la app de Cecotec con promociones',
      catalogo: 'Catálogo de la app con buscador y categorías',
      producto: 'Ficha de un ventilador con precio, stock y botón para añadir al carrito',
      anadido: 'Aviso de producto añadido al carrito, con «Ver carrito» y «Seguir comprando»',
      carrito: 'Carrito con un producto, el total y el botón «Tramitar compra»',
      'original-home': 'La web de Cecotec en el móvil: carrusel de ofertas de robots aspiradores',
      'original-menu': 'El menú lateral de la web de Cecotec con las familias de producto',
      'ar-ficha': 'Ficha de un frigorífico con el botón «Ver producto en mi espacio 3D»',
      'ar-calculando': 'Simulación en tu espacio: la cámara calculando el hueco de la cocina',
      'ar-encaja': 'El frigorífico colocado en el hueco de la cocina con sus medidas y «Espacio suficiente»',
      'ar-recomendados': 'Productos recomendados con medidas parecidas tras la simulación',
    },
  },
  ohmycat: {
    categoria: 'Web responsive · Rebranding',
    lead: 'La web de un cat café que también es una asociación de adopción: una reserva de visitas rápida y clara, los gatos como protagonistas y una marca nueva con más personalidad.',
    ficha: [
      { k: 'Cliente', v: 'Oh My Cat! · Asociación Ghato Verde, Sevilla' },
      { k: 'Mi rol', v: 'Investigación, branding, diseño UX/UI y prototipo' },
      { k: 'Contexto', v: 'Máster en Diseño de Experiencia de Usuario · UNIR · 2025–2026' },
      { k: 'Herramientas', v: 'Figma · Agentes de IA · HTML, CSS y JavaScript' },
    ],
    prototipo: '/prototipos/ohmycat/index.html',
    resultado: 'Un prototipo que funciona, con la reserva completa en escritorio, tablet y móvil.',
    reto: {
      titulo: 'Contexto y reto',
      texto: [
        'La web es la puerta de entrada al cat café: ahí se reserva la visita.',
        'Pero la reserva no estaba en el encabezado, no quedaba claro dónde poner cuántas personas iban y una reserva de grupo se convertía en varias citas: al cancelar, solo se borraba una.',
      ],
      objetivo: 'Mejorar la reserva online a partir de los puntos débiles del journey map.',
      cita: { texto: 'Solo quiero desconectar un rato, estar con gatos y que reservar sea rápido y fácil.', autor: 'Marta, una de las personas del estudio' },
    },
    investigacion: {
      titulo: 'Investigación',
      nota: 'Recorrí el servicio entero, en la web y en el local, y me fijé en todos los que intervienen: también en los gatos, cuyo bienestar marca el aforo.',
      metodos: ['Mapa de actores', 'Journey map', 'Personas', 'Service blueprint', 'Sitemap'],
      personas: [
        {
          nombre: 'Marta',
          perfil: '28 años · Amante de los gatos',
          objetivo: 'Reservar una experiencia relajante de forma rápida y sin fricciones.',
          frustracion: 'Procesos largos y no saber cómo funciona la visita.',
          cita: 'Solo quiero desconectar un rato, estar con gatos y que reservar sea rápido y fácil.',
        },
        {
          nombre: 'Carlos',
          perfil: '38 años · El planificador de la familia',
          objetivo: 'Organizar un plan sencillo y seguro para varias personas.',
          frustracion: 'Reservar varias plazas, no saber si es para niños y cancelaciones poco claras.',
          cita: 'Quiero un plan diferente para el finde, pero que sea fácil de organizar para todos.',
        },
        {
          nombre: 'Nuria',
          perfil: '30 años · Sensibilizada con el bienestar animal',
          objetivo: 'Apoyar la causa mientras disfruta del espacio.',
          frustracion: 'Poca información sobre adopciones y sobre el impacto real.',
          cita: 'Me gusta venir porque siento que estoy ayudando, no solo pasando el rato.',
        },
      ],
      diagramas: [
        {
          tipo: 'journey',
          titulo: 'Journey de la visita',
          pie: 'Los dos puntos de dolor están antes de llegar: encontrar la reserva y reservar.',
          grupos: [
            { nombre: 'Reserva online', n: 3 },
            { nombre: 'En el local', n: 3 },
          ],
          etapas: [
            { nombre: 'Buscar reserva', nivel: -1.5, dolor: true },
            { nombre: 'Reservar cita', nivel: -1.5, dolor: true },
            { nombre: 'Confirmar reserva', nivel: 1.5 },
            { nombre: 'Llegada', nivel: 0 },
            { nombre: 'Cita', nivel: 0 },
            { nombre: 'Abandona', nivel: 0 },
          ],
          filas: [
            {
              nombre: 'Qué piensa',
              celdas: [
                '«No encuentro el botón.»',
                '«No sé dónde poner el número de personas.»',
                '«Perfecto, la cita ya está hecha.»',
                '«Esperaba más acompañamiento o explicación.»',
                '«Falta más interacción o dinamización.»',
                '«La despedida fue bastante simple.»',
              ],
            },
            {
              nombre: 'Debilidades',
              celdas: [
                'CTA poco visible.',
                'Campo de personas escondido.',
                'Cancelaciones parciales poco claras.',
                'La información depende de que el cliente pregunte.',
                'Falta de dinamización.',
                'Falta de cierre emocional o participativo.',
              ],
            },
            {
              nombre: 'Oportunidades',
              celdas: [
                'Destacar el botón de reserva.',
                'Hacer más visible el selector de personas.',
                'Aclarar qué reserva se cancela.',
                'Explicar gatos y adopciones de forma activa.',
                'Generar una experiencia más inmersiva.',
                'Recordar opciones de adopción o ayuda.',
              ],
            },
          ],
          curva: 'Valoración',
          curvaTras: 1,
          leyenda: 'Punto de dolor',
        },
        {
          tipo: 'blueprint',
          titulo: 'Service blueprint',
          pie: 'Lo que ve la persona y lo que pasa detrás, de la web a la salida del local.',
          fases: ['Buscar', 'Reservar', 'Confirmar', 'Llegada', 'Cita', 'Salida'],
          tiempos: ['1 min', '3 min', '1 min', '10 min', '1 h', '2 min'],
          carriles: [
            { nombre: 'Evidencia', celdas: ['Web y horarios', 'Formulario y calendario', 'Correo de confirmación', 'Fachada y recepción', 'Gatos, salón y bebida', 'Merchandising y salida'] },
            { nombre: 'Usuario', celdas: ['Encuentra la reserva', 'Elige fecha, hora y datos', 'Revisa la cita', 'Confirma la reserva', 'Interactúa con los gatos', 'Sale y comparte'] },
            {
              nombre: 'Frontstage',
              linea: 'Línea de interacción',
              celdas: ['Muestra horarios y normas', 'Muestra disponibilidad', 'Envía la confirmación', 'Recibe y explica normas', 'Atiende y resuelve dudas', 'Despedida'],
            },
            {
              nombre: 'Backstage',
              linea: 'Línea de visibilidad',
              celdas: ['Actualiza contenidos y horarios', 'Verifica plazas', 'Confirmación automática', 'Control del aforo', 'Supervisión y limpieza', '—'],
            },
          ],
          mejora: { fila: 'Frontstage', col: 5, texto: 'Oportunidad: una despedida que recuerde adoptar, donar o volver.' },
        },
        {
          tipo: 'arbol',
          titulo: 'Arquitectura del prototipo',
          pie: 'Una sola página con secciones, y la reserva siempre a mano.',
          raiz: 'Inicio · una sola página',
          ramas: [
            { nombre: 'Reserva rápida', hijos: ['Día', 'Hora', 'Personas'] },
            { nombre: 'Nuestros gatos', hijos: ['Carrusel', 'Ficha de cada gato'] },
            { nombre: 'Así es tu visita', nuevo: true, hijos: ['Los 4 pasos del local'] },
            { nombre: 'Somos Ghato Verde' },
            { nombre: 'Colabora', hijos: ['Dona', 'Acoge', 'Voluntariado'] },
          ],
          aparte: [
            { nombre: 'Reservar', hijos: ['Tu visita', 'Tus datos', 'Confirmación'] },
            { nombre: 'Mis reservas', nuevo: true, hijos: ['Modificar', 'Cancelar'] },
          ],
          leyenda: 'Lo nuevo del rediseño',
        },
      ],
      hallazgos: [
        'La reserva no está en el encabezado: hay que bajar para encontrarla.',
        'No queda claro dónde se indica el número de personas.',
        'Precio, aforo y normas tienen el mismo peso: cuesta leerlo.',
        'Una reserva de grupo crea varias citas y al cancelar se borra solo una.',
        'En el local, conocer a los gatos depende de que preguntes.',
        'La despedida es simple: no recuerda adoptar, donar o volver.',
      ],
    },
    solucion: {
      titulo: 'La solución',
      nota: 'Una web que funciona en escritorio, tablet y móvil, con la reserva siempre a la vista y los gatos en el centro.',
      mockup: { portatil: 'escritorio', moviles: ['portada'] },
      pasosTitulo: 'Y en el móvil: la reserva paso a paso',
      pasos: [
        { img: 'portada', titulo: 'Reserva a la vista', texto: 'Desde la portada, sin buscarla.' },
        { img: 'ficha', titulo: 'Conoce a los gatos', texto: 'Cada gato tiene su ficha y se reserva con él.' },
        { img: 'hora', titulo: 'Día, hora y personas', texto: 'Calendario, horas disponibles y cuántas personas van.' },
        { img: 'datos', titulo: 'Tus datos y normas', texto: 'Las normas de la visita, antes de confirmar.' },
        { img: 'resumen', titulo: 'Revisa', texto: 'Una sola reserva para todo el grupo.' },
        { img: 'confirmada', titulo: 'Reserva guardada', texto: 'Con su código y para añadir al calendario.' },
      ],
      probarTitulo: 'Pruébalo aquí',
      probarNota: 'Es el prototipo de verdad: reserva una visita, conoce a los gatos o abre «Mis reservas» para cambiarla o cancelarla.',
      web: {
        titulo: 'La web',
        comparar: {
          antes: {
            img: 'web-antes',
            texto: 'Un gato muy simpático saliendo del transportín… pero para reservar había que bajar a buscar el botón, y te mandaba a un formulario aparte.',
          },
          despues: {
            img: 'web-portada',
            texto: 'Ahora la reserva te recibe nada más llegar, junto a la foto del café. Y «Reservar» te acompaña arriba mientras bajas.',
          },
        },
        pasos: [
          { img: 'web-portada', titulo: 'La reserva, a la vista', texto: 'Día, hora y cuántas personas van, sin tener que buscarla.' },
          { img: 'web-gatos', titulo: 'Los protagonistas', texto: 'Coco, Haru, Leo y compañía, cada uno con su ficha y su historia.' },
          { img: 'web-visita', titulo: 'Sin sorpresas', texto: 'Cómo es la visita en cuatro pasos, para llegar sabiendo qué te espera.' },
          { img: 'web-colabora', titulo: 'Echar una pata', texto: 'Donar, acoger o hacerse voluntaria, a un clic.' },
          { img: 'web-reserva', titulo: 'Tres pasos y listo', texto: 'Eliges día y hora, y todo el grupo va en una sola reserva.' },
          { img: 'web-confirmada', titulo: '¡Reserva guardada!', texto: 'Con su código, directa a tu calendario. Y si cambias de planes, se modifica en un momento.' },
        ],
      },
      probarEn: 'portatil',
    },
    cambios: {
      titulo: 'Decisiones de diseño',
      nota: 'Al construir el rediseño volví a revisarlo y corregí lo que todavía no funcionaba. Pasa las pestañas.',
      items: [
        { tab: 'Reserva', antes: 'La reserva no estaba en el encabezado; el estudio la marcaba como «CTA poco visible».', despues: '«Reservar» fijo en el encabezado y una reserva rápida en la portada.' },
        { tab: 'Campos', antes: 'Etiquetas a la derecha, botón pequeño y el número de personas escondido.', despues: 'Etiquetas encima, campos de 52 px, selector de personas claro y errores que explican qué falta.' },
        { tab: 'Grupos', antes: 'Una reserva de grupo eran varias citas; al cancelar se borraba solo una.', despues: 'Una sola reserva por grupo, con código. Cancelar pide confirmación y dice qué se anula.' },
        { tab: 'Menú', antes: 'Navegación partida alrededor del logo, textos de 12 px y un «Blog» sin contenido.', despues: 'Logo a la izquierda, navegación con estado activo y el blog fuera hasta que tenga contenido.' },
        { tab: 'Gatos', antes: 'Tarjetas con textos de 10–12 px, «Años» sin dato y un botón equivocado.', despues: 'Textos de 14–20 px, botones corregidos y la edad oculta mientras no haya dato.' },
        { tab: 'Visita', antes: 'Las normas de la visita no se explicaban de forma activa.', despues: 'Una sección nueva, «Así es tu visita», y las normas dentro de la reserva.' },
        { tab: 'Móvil', antes: 'La versión móvil era el escritorio reducido a 474 px.', despues: 'Móvil rediseñado a 390 px: menú desplegable, reserva apilada y diálogos que suben desde abajo.' },
      ],
    },
    seo: {
      titulo: 'SEO',
      nota: 'No me olvidé del SEO: que te encuentren buscando «cat café en Sevilla» también es parte de la experiencia.',
      codigo: [
        '<html lang="es">',
        '<title>Oh My Cat · Cat café en Sevilla (prototipo)</title>',
        '<meta name="description" content="… el cat café de la Asociación Ghato Verde en Sevilla: reserva tu visita, conoce a los gatos en adopción y colabora.">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<img alt="Sala del cat café con plantas y estanterías: un gato atigrado duerme sobre un cojín…">',
        '<h1> × 1 · <h2> × 7',
        '<header> <nav> <main> <section> <footer>',
      ],
      puntos: [
        'Título y descripción con lo que la gente busca: cat café, Sevilla, reservar, adopción.',
        'Un solo H1 y una jerarquía de títulos clara.',
        'Etiquetas semánticas para que buscadores y lectores de pantalla entiendan la página.',
        'Textos alternativos que describen de verdad cada foto.',
        'Idioma declarado y diseño responsive, pensado primero para el móvil.',
      ],
    },
    logo: {
      titulo: 'Branding',
      nota: 'El café se llama Oh My Cat!, y el logo nuevo refleja ese «¡Oh!»: el gato se lleva la pata a la boca, sorprendido, con su signo de exclamación. Y como aquí los gatos mandan, se cuela en la «A» de CAT. Las letras van en Jua, redondas y amables, y la silueta salta a la web como mascota.',
      antes: { img: 'logo-antiguo', pie: 'El logo anterior' },
      versiones: [
        { img: 'logo-simbolo', pie: 'El gato que dice «¡oh!»' },
        { img: 'logo-horizontal', pie: 'Versión horizontal' },
        { img: 'logo-integrado', pie: 'El gato, dentro de la «A»' },
      ],
    },
    estilo: {
      titulo: 'Guía de estilo',
      nota: 'Una guía de estilo en cinco partes: marca, color y accesibilidad, tipografía y voz, espaciado y responsive, y componentes. Conserva el verde, la salvia y la crema de la marca y mide los contrastes.',
      colores: [
        { nombre: 'Crema', hex: '#F6F8F0' },
        { nombre: 'Salvia', hex: '#D8E3CD' },
        { nombre: 'Verde acción', hex: '#416B49' },
        { nombre: 'Bosque', hex: '#223B2C' },
        { nombre: 'Banda', hex: '#264D39' },
        { nombre: 'Verde vivo', hex: '#319A37' },
      ],
      tipografia: 'Plus Jakarta Sans',
      tipografiaNota: 'Titulares en 800, texto en 400; Jua solo en el logo.',
      contrastes: [
        { texto: 'Texto sobre crema', fondo: '#F6F8F0', tinta: '#223B2C', ratio: '11,33:1' },
        { texto: 'Texto sobre salvia', fondo: '#D8E3CD', tinta: '#223B2C', ratio: '9,13:1' },
        { texto: 'Blanco sobre verde', fondo: '#416B49', tinta: '#FFFFFF', ratio: '6,13:1' },
        { texto: 'Crema sobre bosque', fondo: '#223B2C', tinta: '#F6F8F0', ratio: '8,90:1' },
      ],
    },
    garabatos: [
      { dibujo: 'omc-hero', nota: 'La reserva, arriba' },
      { dibujo: 'omc-gatos', nota: '«Conoce a…»' },
      { dibujo: 'omc-calendario', nota: 'Día, hora y personas' },
      { dibujo: 'omc-codigo', nota: 'Un grupo, una reserva' },
    ],
    probado: [
      'Sin desbordamientos a 1440, 834 y 390 px.',
      'Reserva completa, con validaciones y teclado.',
      'Modificar y cancelar una reserva.',
      'Contrastes de la paleta: todos AA.',
    ],
    ia: {
      intro: 'No le pedí a una IA «hazme una web»: preparé el contexto, dirigí a los agentes paso a paso y revisé cada resultado. Así pasé del Figma a un prototipo que funciona.',
      etiquetas: ['Agentes de IA', 'LLM', 'Prompting', 'Contexto', 'Revisión humana', 'Pruebas automáticas'],
      pasos: [
        { titulo: 'El contexto', texto: 'Le di al agente el Figma, la investigación y la guía de estilo, con los requisitos de accesibilidad.' },
        { titulo: 'La auditoría', texto: 'Revisamos el diseño frente al journey map; cada cambio que proponía lo validaba yo antes de aplicarlo.' },
        { titulo: 'La construcción', texto: 'Montó el sistema de diseño en código, con sus tokens y componentes, y los recorridos de reserva.' },
        { titulo: 'Las pruebas', texto: 'Probó la web en un navegador automatizado: tres tamaños de pantalla, la reserva completa y la consola sin errores.' },
        { titulo: 'La documentación', texto: 'Todo quedó explicado en un README: decisiones, supuestos y límites del prototipo.' },
      ],
    },
    alt: {
      escritorio: 'Portada del prototipo de Oh My Cat! en escritorio, con la foto del café y el panel de reserva',
      'web-portada': 'La web en escritorio: portada con el panel de reserva rápida',
      'web-antes': 'La web original de Oh My Cat!: portada verde con un gato saliendo de un transportín y los botones Reserva, Contribuir y Únete',
      'logo-antiguo': 'El logo anterior de Oh My Cat!: una taza humeante con orejas de gato',
      'logo-simbolo': 'Símbolo del logo: un gato de espaldas saludando con la pata y el signo de exclamación',
      'logo-horizontal': 'Logo horizontal: el símbolo junto a OH MY CAT!',
      'logo-integrado': 'Logo con el gato integrado en la A de OH MY CAT',
      'web-gatos': 'La web en escritorio: carrusel «Nuestros gatos» con Coco, Haru, Leo y Mimi',
      'web-visita': 'La web en escritorio: «Así es tu visita» con los cuatro pasos',
      'web-colabora': 'La web en escritorio: «¿Quieres colaborar?» con Dona, Acoge y Voluntariado',
      'web-reserva': 'La web en escritorio: diálogo de reserva con el día y la hora elegidos',
      'web-confirmada': 'La web en escritorio: reserva guardada con su código',
      portada: 'Portada del prototipo en el móvil: «Café y bigotes, plan prrrfecto!»',
      gatos: 'Sección «Nuestros gatos» en el móvil, con la tarjeta de Coco',
      ficha: 'Ficha de Coco con el botón para reservar una visita y conocerla',
      reserva: 'Paso 1 de la reserva: el calendario',
      hora: 'Paso 1 de la reserva con el día y la hora elegidos',
      datos: 'Paso 2: los datos y las normas de la visita aceptadas',
      resumen: 'Paso 3: el resumen de la reserva para confirmar',
      confirmada: 'Reserva guardada con su código y el botón para añadirla al calendario',
    },
  },
  massolis: {
    categoria: 'Plataforma de gestión · Panel web, app y portal del cliente',
    lead: 'Una plataforma de operaciones para una empresa de limpieza y mantenimiento, con tres productos sobre los mismos datos: un panel para la oficina, una app para las profesionales y un portal para el cliente.',
    ficha: [
      { k: 'Cliente', v: 'Massoluciones · encargo directo de su CEO' },
      { k: 'Mi rol', v: 'Research, UX, diseño UI, testing y prototipo' },
      { k: 'Equipo', v: 'Dos personas: diseño (yo) y desarrollo backend' },
      { k: 'Contexto', v: 'Proyecto real · 2026–actualidad · backend en desarrollo' },
      { k: 'Herramientas', v: 'Figma · Agentes de IA · React · TypeScript' },
    ],
    prototipo: '/prototipos/massolis/index.html',
    resultado: 'El horario, las fotos y las incidencias, por fin en un mismo sitio: sin Excel ni WhatsApp.',
    reto: {
      titulo: 'Contexto y reto',
      texto: [
        'Massoluciones organiza servicios de limpieza y mantenimiento con un equipo de diez profesionales.',
        'Hasta ahora todo pasaba por Drive y WhatsApp: el horario se rellenaba en un Excel compartido que cada una editaba a su manera, y las fotos y las incidencias se perdían entre mensajes.',
        'La CEO me pidió centralizarlo en una herramienta propia, elegante y acorde con la empresa. La usarían tres perfiles: las profesionales, la empresa como administradora y los clientes.',
      ],
      objetivo: 'Que la oficina y el equipo trabajen con la misma información, del horario al cierre de cada servicio, sin Excel ni WhatsApp.',
      cita: { texto: 'En el móvil el Excel es muy difícil de usar, y muchas veces se me olvida rellenarlo.', autor: 'Lo que repetían las entrevistas' },
    },
    investigacion: {
      titulo: 'Investigación',
      nota: 'Partí de mis dos años en operaciones en Massoluciones, hablé con la CEO y entrevisté a diez profesionales del equipo sobre cómo trabajaban con Drive y WhatsApp.',
      metodos: ['Entrevistas: 10 profesionales y la CEO', 'Experiencia en operaciones', 'Customer journey map', 'User personas', 'Service blueprint', 'Arquitectura de la información'],
      personas: [
        {
          nombre: 'Rocío',
          perfil: 'Profesional de limpieza · trabaja desde el móvil',
          objetivo: 'Consultar su horario y documentar cada servicio sin perder tiempo.',
          frustracion: 'El Excel de Drive no está hecho para el móvil, a veces se le olvida rellenarlo y las fotos se pierden en el chat.',
          cita: 'Desde el móvil el Excel es muy difícil, y acordarme de rellenarlo también.',
        },
        {
          nombre: 'Elena',
          perfil: 'Dirección · organiza servicios y equipo',
          objetivo: 'Ver en un solo sitio qué se hace, quién lo hace y cómo ha quedado.',
          frustracion: 'Horarios con errores o con el formato cambiado, y fotos e incidencias repartidas por WhatsApp.',
          cita: 'Necesito tenerlo todo centralizado, no repartido entre el Drive y el WhatsApp.',
        },
      ],
      diagramas: [
        {
          tipo: 'journey',
          titulo: 'Journey de un día de trabajo, antes de la app',
          pie: 'Los puntos de dolor están al registrar: el horario en el Excel y las fotos e incidencias por WhatsApp.',
          grupos: [
            { nombre: 'La profesional', n: 5 },
            { nombre: 'La oficina', n: 1 },
          ],
          etapas: [
            { nombre: 'Mirar el horario', nivel: -1, dolor: true },
            { nombre: 'Hacer el servicio', nivel: 1 },
            { nombre: 'Compartir fotos', nivel: -1 },
            { nombre: 'Avisar de una incidencia', nivel: -1 },
            { nombre: 'Rellenar el horario', nivel: -1.5, dolor: true },
            { nombre: 'Revisar el trabajo', nivel: -1.5, dolor: true },
          ],
          filas: [
            {
              nombre: 'Qué hace',
              celdas: [
                'Abre el Excel en Drive desde el móvil.',
                'Limpia siguiendo los códigos del manual.',
                'Manda las fotos por WhatsApp.',
                'Lo cuenta por WhatsApp.',
                'Rellena el Excel de Drive.',
                'La CEO busca en Drive y en WhatsApp.',
              ],
            },
            {
              nombre: 'Debilidades',
              celdas: [
                'El Excel no está hecho para el móvil.',
                '—',
                'Las fotos se mezclan con otros mensajes.',
                'Las incidencias se pierden en el chat.',
                'Se olvida o se cambia el formato, y hay errores.',
                'La información está repartida: cuesta centralizarla.',
              ],
            },
            {
              nombre: 'Oportunidades',
              celdas: [
                'Su día, en una app pensada para el móvil.',
                'Las tareas de cada código, una a una.',
                'Fotos del antes y del después en cada servicio.',
                'Incidencias con foto, unidas al servicio.',
                'Fichaje al llegar y al salir.',
                'Un panel con todo en un mismo sitio.',
              ],
            },
          ],
          curva: 'Experiencia',
          curvaTras: 1,
          leyenda: 'Punto de dolor',
        },
        {
          tipo: 'blueprint',
          titulo: 'La vida de un servicio',
          pie: 'Un mismo servicio, visto desde la oficina, desde la app y desde lo que el sistema hace por detrás.',
          fases: ['Programar', 'Asignar', 'Llegar', 'Hacer', 'Finalizar', 'Validar'],
          carriles: [
            { nombre: 'Evidencia', celdas: ['La agenda del panel', 'Un aviso en la app', 'El fichaje de entrada', 'Tareas y fotos', 'Las fotos del después', 'El servicio cerrado'] },
            { nombre: 'Profesional', celdas: ['—', 'Ve el servicio en su día', 'Ficha al llegar', 'Marca tareas y hace fotos', 'Revisa y finaliza', '—'] },
            {
              nombre: 'Administración',
              linea: 'Línea de interacción',
              celdas: ['Crea el servicio en la agenda', 'Asigna responsable y apoyo', 'Ve quién ha fichado', 'Sigue el avance', 'Recibe el cierre por revisar', 'Valida y cierra'],
            },
            {
              nombre: 'Sistema',
              linea: 'Línea de visibilidad',
              celdas: ['Comprueba choques de horario', 'Avisa a la app', 'Guarda la hora', 'Sincroniza panel y app', 'Pide una foto del después', 'Guarda la actividad'],
            },
          ],
          mejora: { fila: 'Administración', col: 5, texto: 'Cierre en dos pasos: el profesional finaliza y la oficina valida.' },
        },
        {
          tipo: 'arbol',
          titulo: 'Arquitectura',
          pie: 'Tres productos sobre los mismos datos: lo que hace la profesional llega al panel y al portal del cliente.',
          raiz: 'MASSolisapp',
          ramas: [
            { nombre: 'App del profesional', hijos: ['Inicio y fichaje', 'Agenda', 'Mis servicios', 'Manual MASS', 'Ruta del día', 'Mi jornada', 'Historial', 'Mensajes', 'Perfil y ayuda'] },
            { nombre: 'Panel de administración', hijos: ['Inicio', 'Agenda', 'Servicios', 'Incidencias', 'Equipo', 'Clientes', 'Informes', 'Manual', 'Facturación', 'Configuración y ayuda'] },
            { nombre: 'Portal del cliente', hijos: ['Inicio', 'Servicios', 'Mensajes', 'Avisos', 'Perfil'] },
          ],
          aparte: [
            { nombre: 'Un servicio en la app', hijos: ['Detalle', 'Tareas', 'Fotos', 'Incidencia', 'Revisar y finalizar'] },
            { nombre: 'Manual MASS', hijos: ['Fichas', 'Buscador', 'MASS IA', 'Comparar', '¿Cómo limpio esto?', 'Aprende'] },
            { nombre: 'Un servicio en el portal', hijos: ['Seguimiento', 'Pedir un cambio', 'Valorar'] },
          ],
        },
      ],
      hallazgos: [
        'El horario vive en un Excel de Drive que cada una rellena a su manera: formatos cambiados y errores.',
        'El Excel no está pensado para el móvil, que es donde trabajan.',
        'A veces se olvida rellenar el horario.',
        'Fotos e incidencias van por WhatsApp y se pierden entre mensajes.',
        'A la CEO le cuesta centralizar la información y revisar cada servicio.',
        'La empresa necesita las fotos del después y sus códigos de limpieza (01 M, 02 MA, 03 MAS, 04 MASS y LG), los del manual que escribí.',
      ],
    },
    solucion: {
      titulo: 'La solución',
      aviso: 'El manual es información interna de la empresa: lo que ves en el prototipo y en las capturas son datos de ejemplo, no su contenido real.',
      nota: 'Tres caras de la misma información: el panel para organizar, la app para hacer y el portal para que el cliente sepa qué pasa. Lo que marca el profesional aparece al momento en el panel y en el portal, y de ahí sale la factura.',
      mockup: { portatil: 'web-inicio', moviles: ['inicio'] },
      pasosTitulo: 'La app del profesional: un servicio de principio a fin',
      pasos: [
        { img: 'inicio', titulo: 'Tu día', texto: 'Fichaje, resumen de hoy y el próximo servicio nada más entrar.' },
        { img: 'detalle', titulo: 'El servicio', texto: 'Dirección, cómo llegar, el contacto del cliente y las notas de la oficina.' },
        { img: 'tareas', titulo: 'Tarea a tarea', texto: 'Se marcan una a una y la barra dice cuánto falta.' },
        { img: 'fotos', titulo: 'Antes y después', texto: 'Fotos desde la cámara o la galería: la prueba del trabajo bien hecho.' },
        { img: 'revisar', titulo: 'Revisar y finalizar', texto: 'Tareas y fotos a la vista antes de cerrar.' },
        { img: 'completado', titulo: '¡Buen trabajo!', texto: 'El servicio pasa a la oficina para que lo valide.' },
      ],
    manual: {
      titulo: 'El manual, con su chatbot',
      nota: 'El manual de limpieza que escribí deja de ser un PDF: se consulta desde la app, y la oficina lo mantiene al día desde el panel, con un historial de cada cambio.',
      pasos: [
        { img: 'manual', titulo: 'Centro de conocimiento', texto: '73 fichas en 7 categorías, siempre a mano en su propia pestaña.' },
        { img: 'ficha', titulo: 'Cada código, claro', texto: 'Tiempos, materiales y tareas, con la página del manual de donde sale.' },
        { img: 'massia', titulo: 'MASS IA', texto: 'El chatbot del manual, en demostración: responde solo con lo que hay en él y, si no aparece, lo dice.' },
        { img: 'comparar', titulo: 'Comparar códigos', texto: 'Qué cambia de un servicio a otro, de un vistazo.' },
        { img: 'comolimpio', titulo: '¿Cómo limpio esto?', texto: 'Se elige qué hay que limpiar y lleva al procedimiento.' },
        { img: 'aprende', titulo: 'Aprende MASS', texto: 'Tarjetas, casos y cuestionarios para quien empieza.' },
      ],
    },
      cliente: {
        titulo: 'Y el portal del cliente',
        nota: 'El cliente también tiene su sitio: ve quién va, cuándo llega y cómo avanza su servicio, pide cambios y lo valora.',
        pasos: [
          { img: 'cliente-inicio', titulo: 'Su servicio, hoy', texto: 'Quién está en su espacio, desde qué hora y cuántas tareas lleva.' },
          { img: 'cliente-seguimiento', titulo: 'Seguimiento', texto: 'Paso a paso, con las fotos del servicio.' },
          { img: 'cliente-cambio', titulo: 'Pedir un cambio', texto: 'Otra hora, otro día, instrucciones o cancelar; la oficina lo aprueba.' },
          { img: 'cliente-valorar', titulo: 'Valorar', texto: 'Estrellas, etiquetas y un comentario al terminar.' },
          { img: 'cliente-servicios', titulo: 'Sus servicios', texto: 'Los próximos y los anteriores, con su estado.' },
          { img: 'cliente-mensajes', titulo: 'Mensajes', texto: 'Habla con atención al cliente sin salir del portal.' },
        ],
      },
      probarTitulo: 'Pruébalo aquí',
      probarNota: 'Es el prototipo de verdad: entra con la cuenta de demostración, mueve un servicio en la agenda o abre la app del profesional y el portal del cliente desde el botón «Demo». El contenido del manual son datos de ejemplo.',
      web: {
        titulo: 'El panel de administración',
        pasos: [
          { img: 'web-inicio', titulo: 'Cómo va el día', texto: 'Servicios, horas, cobertura y lo que requiere atención, de un vistazo.' },
          { img: 'web-agenda', titulo: 'Agenda', texto: 'Por día, semana o mes. Los servicios se arrastran entre horas y profesionales, y avisa si algo choca.' },
          { img: 'web-servicios', titulo: 'Servicios', texto: 'Filtros, búsqueda, selección múltiple y exportación a CSV.' },
          { img: 'web-detalle', titulo: 'Cada servicio', texto: 'Tareas sincronizadas con la app, fotos, personal asignado y cierre.' },
          { img: 'web-equipo', titulo: 'Equipo', texto: 'Quién está en servicio, disponible o de descanso, y cuánta carga lleva.' },
          { img: 'web-informes', titulo: 'Informes', texto: 'Servicios por día, horas por profesional y servicios por zona.' },
        { img: 'web-manual', titulo: 'Manual', texto: 'La oficina edita las fichas; cada cambio pide un motivo y queda en el historial.' },
        { img: 'web-factura-detalle', titulo: 'Facturación', texto: 'Del servicio a la factura: horas, IVA, cobros y descarga en la plantilla de la empresa.' },
        ],
      },
      probarEn: 'portatil',
    },
    cambios: {
      titulo: 'Decisiones de diseño',
      nota: 'Cada problema de la investigación pedía una decisión. Estas son las más importantes; pasa las pestañas.',
      items: [
        { tab: 'Horario', antes: 'Un Excel compartido que cada una editaba a su manera: formatos cambiados y errores.', despues: 'Una sola agenda en el panel. Cada profesional ve su día en la app, sin poder romper nada.' },
        { tab: 'Móvil', antes: 'El Excel de Drive no estaba pensado para el móvil, que es donde trabajan.', despues: 'App hecha para el móvil: botones grandes, cinco pestañas abajo y lo urgente arriba.' },
        { tab: 'Manual', antes: 'El manual de limpieza era un PDF para leer entero, fuera de la herramienta.', despues: 'Un centro de consulta con 73 fichas y buscador. Cada servicio lleva su código y enlaza a lo que incluye.' },
        { tab: 'Fotos', antes: 'Las fotos iban por WhatsApp y se perdían entre mensajes.', despues: 'Antes y después dentro de cada servicio. Sin foto del después no se puede finalizar.' },
        { tab: 'Incidencias', antes: 'Se contaban por WhatsApp, mezcladas con todo.', despues: 'Con tipo, descripción y foto, unidas al servicio, y la oficina responde en la misma conversación.' },
        { tab: 'Cierre', antes: 'Al finalizar, el servicio pasaba directamente a «Completado».', despues: 'Cierre en dos pasos: la profesional finaliza y la oficina revisa las evidencias y lo valida.' },
        { tab: 'Facturación', antes: 'La factura se preparaba aparte, en una plantilla de Excel.', despues: 'Sale de las horas de los servicios completados, y lo ya facturado no se puede cobrar dos veces.' },
      ],
    },
    estilo: {
      titulo: 'Sistema de diseño Suave',
      nota: 'La CEO quería algo elegante y acorde con la empresa, así que partí de los azules de su marca. Las tres interfaces comparten un único sistema en Figma y en código: una sola tipografía, once tamaños de texto, colores con nombre y componentes comunes. Después subí el contraste de bordes, textos y estados.',
      colores: [
        { nombre: 'Fondo', hex: '#EEF4FB' },
        { nombre: 'Suave', hex: '#E4F0FD' },
        { nombre: 'Cielo', hex: '#7BBEF4' },
        { nombre: 'Hero', hex: '#1B65AD' },
        { nombre: 'Acción', hex: '#003D9B' },
        { nombre: 'Tinta', hex: '#001848' },
      ],
      tipografia: 'Inter',
      tipografiaNota: 'La misma familia en el panel, la app y el portal del cliente.',
      contrastes: [
        { texto: 'Texto sobre el fondo', fondo: '#EEF4FB', tinta: '#001848', ratio: '15,49:1' },
        { texto: 'Blanco sobre acción', fondo: '#003D9B', tinta: '#FFFFFF', ratio: '9,81:1' },
        { texto: 'Texto secundario', fondo: '#FFFFFF', tinta: '#4A5B72', ratio: '6,93:1' },
        { texto: 'Estado «completado»', fondo: '#E3F4EC', tinta: '#1B6B52', ratio: '5,63:1' },
      ],
    },
    garabatos: [
      { dibujo: 'ms-panel', nota: 'El día, de un vistazo' },
      { dibujo: 'ms-tareas', nota: 'Tarea a tarea' },
      { dibujo: 'ms-agenda', nota: 'Arrastrar y soltar' },
      { dibujo: 'ms-fotos', nota: 'Antes y después' },
    ],
    probado: [],
    resuelve: [
      'El horario deja el Excel: una sola agenda, sin formatos rotos ni errores.',
      'Está pensada para el móvil, que es donde trabajan las profesionales.',
      'Ya no hay que acordarse de rellenar el horario: el fichaje lo registra solo.',
      'Las fotos del antes y del después se quedan en cada servicio, no en el chat.',
      'Las incidencias llegan con foto y unidas a su servicio.',
      'Los códigos del manual y sus tareas van dentro de cada servicio.',
      'La CEO lo ve todo en un panel, sin buscar en Drive ni en WhatsApp.',
      'El cliente sigue su servicio y pide cambios desde su portal.',
      'El manual se consulta desde el móvil, en vez de buscar en un PDF.',
      'La factura sale de las horas de los servicios, sin pasar los datos a mano.',
    ],
    ia: {
      intro: 'Usé agentes de IA como herramienta para pasar antes del diseño a un prototipo que funciona. Las decisiones fueron mías: qué construir, cómo debía comportarse y qué había que corregir.',
      etiquetas: ['Agentes de IA', 'LLM', 'Contexto', 'Reglas de negocio', 'Revisión humana', 'Documentación'],
      pasos: [
        { titulo: 'Preparar el contexto', texto: 'Escribí las instrucciones con mi investigación, el sistema Suave y lo que necesitaba la empresa: los códigos del manual, las fotos del después y los tres perfiles.' },
        { titulo: 'Definir las reglas', texto: 'Fijé cómo funciona el negocio: el cierre en dos pasos, los choques de horario, las fotos para finalizar y quién marca las tareas.' },
        { titulo: 'Construir por partes', texto: 'Pedí cada parte por separado, panel, app y portal del cliente, y revisé cada pantalla antes de pasar a la siguiente.' },
        { titulo: 'Probar con la empresa', texto: 'Lo probé con la CEO y con profesionales del equipo antes de darlo por bueno.' },
        { titulo: 'Dejarlo listo', texto: 'Documenté rutas, datos y decisiones pendientes para la persona que desarrolla el backend.' },
      ],
    },
    alt: {
    manual: 'App: centro de conocimiento con buscador, MASS IA y categorías del manual',
    ficha: 'App: ficha del código 03MAS con tiempos, materiales y tareas',
    massia: 'App: asistente MASS IA con preguntas sugeridas sobre el manual',
    comparar: 'App: comparador de dos códigos de servicio',
    comolimpio: 'App: asistente «¿Cómo limpio esto?» con las superficies',
    aprende: 'App: Aprende MASS con tarjetas, casos y cuestionarios',
    'web-manual': 'Panel: listado de fichas del manual con su estado',
    'web-factura-detalle': 'Panel: factura de demostración con sus datos, acciones y resumen',
      'web-inicio': 'Panel de administración: inicio con los servicios de hoy, el estado de la jornada y lo que requiere atención',
      'web-agenda': 'Panel: agenda del día con columnas por profesional y el servicio seleccionado',
      'web-servicios': 'Panel: gestión de servicios con indicadores, pestañas y la lista filtrable',
      'web-detalle': 'Panel: detalle de un servicio con sus tareas, el personal asignado y el cierre',
      'web-equipo': 'Panel: equipo de profesionales con su situación y su carga del día',
      'web-informes': 'Panel: informes con servicios por día, horas por profesional y zonas',
      inicio: 'App del profesional: inicio con la jornada en curso, el resumen de hoy y el próximo servicio',
      detalle: 'App: detalle del servicio con dirección, contacto del cliente y nota de la oficina',
      tareas: 'App: lista de tareas del servicio con 8 de 10 completadas',
      fotos: 'App: fotos del antes y del después del servicio',
      revisar: 'App: revisar y finalizar, con las tareas y las fotos',
      completado: 'App: servicio completado, «¡Buen trabajo, María!»',
      'cliente-inicio': 'Portal del cliente: inicio con el servicio de hoy en curso y las tareas completadas',
      'cliente-seguimiento': 'Portal del cliente: seguimiento paso a paso del servicio con sus fotos',
      'cliente-cambio': 'Portal del cliente: pedir un cambio de hora, de día, instrucciones o cancelar',
      'cliente-valorar': 'Portal del cliente: valorar el servicio con estrellas y etiquetas',
      'cliente-servicios': 'Portal del cliente: lista de próximos servicios con su estado',
      'cliente-mensajes': 'Portal del cliente: conversación con atención al cliente',
    },
  },
}

export const es = { home, pistas, cards, pages, sobreMi, casos, contacto, ui, expedientes }
export type Textos = typeof es
