/* =====================================================================
   OH MY CAT · Prototipo interactivo (HTML + CSS + JavaScript nativo)
   Funciona abriendo index.html directamente (file://), sin servidor.

   Índice
   1. Configuración y contenidos (datos reales del Figma)
   2. Utilidades
   3. Estado y persistencia (localStorage, sin datos sensibles)
   4. Toasts
   5. Modal (dialog nativo)
   6. Calendario (componente reutilizable)
   7. Componentes de renderizado (tarjetas, stepper, campos…)
   8. Reserva rápida (hero)
   9. Flujo de reserva (3 pasos + confirmación)
   10. Mis reservas (modificar / cancelar)
   11. Gatos (carrusel + ficha)
   12. Colabora (solicitudes de demostración)
   13. Header, menú móvil y navegación por secciones
   14. Varios (compartir, legal, reinicio, aparición progresiva)
   15. Delegación de eventos e inicio
   ===================================================================== */
'use strict';

(() => {
  /* -------------------------------------------------------------------
     1. CONFIGURACIÓN Y CONTENIDOS
     ------------------------------------------------------------------- */
  const CONFIG = {
    storageKey: 'ohmycat.prototipo.v1',
    // Horario publicado en el Figma: «Mar - Dom: 10:00 - 21:00 · Lunes cerrado»
    closedWeekdays: [1],              // 0 = domingo, 1 = lunes
    openHour: 10,
    lastSlotHour: 20,                 // franjas de 1 h hasta el cierre (21:00)
    visitMinutes: 60,                 // duración de la cita según el Service Blueprint del Figma
    // Supuestos del prototipo (no son condiciones comerciales; ver README):
    bookingWindowDays: 60,
    minPeople: 1,
    maxPeople: 10,
    address: 'C/ Carmen Martínez Sancho, 14, Local 1b',
    // Redes sociales: el Figma muestra iconos sin enlaces. Se pintan solo si hay URL real.
    social: [
      // { label: 'Instagram', url: 'https://instagram.com/…', icon: 'external' },
    ],
  };

  // Descripciones de ejemplo para el portfolio (sustituir por las reales de la asociación).
  // status: 'adoption' (en adopción) | 'adopted' (adoptado: badge rojo y sin reserva para conocerlo)
  const CATS = [
    { id: 'coco',   name: 'Coco',   sex: 'Hembra', status: 'adoption', desc: 'Exploradora incansable: no hay estantería del café que no haya conquistado.', photo: 'assets/images/gato-coco.jpg', alt: 'Coco, gata atigrada de ojos verdes sentada entre plantas.' },
    { id: 'haru',   name: 'Haru',   sex: 'Hembra', status: 'adoption', desc: 'Tranquila y observadora, le encanta dormir al sol junto a la ventana.', photo: 'assets/images/gato-haru.jpg', alt: 'Haru, gata de pelaje claro con la cara y las orejas oscuras, de ojos azules.' },
    { id: 'leo',    name: 'Leo',    sex: 'Macho',  status: 'adoption', desc: 'Un bonachón muy sociable que siempre busca un regazo donde ronronear.', photo: 'assets/images/gato-leo.jpg', alt: 'Leo, gato de pelaje blanco, negro y canela sentado en la sala del café.' },
    { id: 'mimi',   name: 'Mimi',   sex: 'Hembra', status: 'adoption', desc: 'Juguetona y curiosa: pierde la cabeza por las plumas y las cajas de cartón.', photo: 'assets/images/gato-mimi.jpg', alt: 'Mimi sentada en la sala del café.' },
    { id: 'michu',  name: 'Michu',  sex: 'Hembra', status: 'adoption', desc: 'Algo tímida al principio, pero muy mimosa cuando coge confianza.', photo: 'assets/images/gato-michu.jpg', alt: 'Michu sentada en la sala del café.' },
    { id: 'misifu', name: 'Misifu', sex: 'Hembra', status: 'adopted',  desc: 'Ya disfruta de su hogar definitivo con su nueva familia. ¡Gracias a todas las personas que la visitasteis!', photo: 'assets/images/gato-misifu.jpg', alt: 'Misifu sentada en la sala del café.' },
  ];
  const isAdopted = (cat) => cat.status === 'adopted';
  const adoptableCats = () => CATS.filter((c) => !isAdopted(c));

  // Mascota original del Figma, separada en cola y cuerpo para animarla (cola que se balancea y parpadeo)
  const MASCOT_PATH = 'M42.6055 7.87207C36.6653 1.76017 27.8086 -1.10195 18.1055 0.388672C12.9761 1.1769 8.65988 4.46575 6.19922 6.62402C4.83397 7.82154 3.709 8.97088 2.9248 9.82031C2.52975 10.2482 2.21223 10.6096 1.98535 10.874C1.87195 11.0062 1.77983 11.1156 1.71191 11.1973L1.5791 11.3584C-0.887848 14.4119 -0.412628 18.8881 2.64062 21.3555C5.69112 23.8203 10.1618 23.3489 12.6309 20.3037C12.6321 20.3008 12.6372 20.2947 12.6436 20.2871C12.6671 20.2588 12.7121 20.2056 12.7754 20.1318C12.9027 19.9834 13.1054 19.7517 13.3711 19.4639C13.9092 18.881 14.6735 18.1008 15.5732 17.3115C17.6434 15.4957 19.3664 14.5787 20.2646 14.4404C25.9026 13.5744 30.0002 15.3009 32.4102 17.7803C34.8229 20.2628 36.1215 24.0737 35.083 28.6846C33.5669 35.415 29.4109 39.784 23.3848 45.793C17.6068 51.5544 10.2085 58.7554 6.94824 70.3887C3.89937 81.2683 7.60532 89.849 11.8301 95.3662C13.5971 97.6737 15.4756 99.4854 17.04 100.807C15.3882 106.656 14.5391 112.883 14.5391 119.343C14.5391 123.421 15.0129 127.372 15.9141 131.168H116.139C117.711 132.222 119.584 132.871 121.613 132.958C127.354 133.204 131.229 134.97 133.014 136.61C133.812 137.344 134.091 137.939 134.201 138.358C134.306 138.758 134.423 139.616 133.902 141.169C132.031 146.752 135.04 152.797 140.623 154.669C146.206 156.541 152.25 153.531 154.122 147.948C156.133 141.951 156.044 136.218 154.285 131.168H158.179C162.726 131.706 165.847 133.223 167.396 134.646C168.193 135.379 168.473 135.974 168.583 136.394C168.688 136.793 168.805 137.651 168.284 139.204C166.413 144.787 169.422 150.832 175.005 152.704C180.588 154.576 186.632 151.566 188.504 145.983C192.063 135.368 189.049 125.582 181.827 118.944C177.283 114.768 171.453 112.134 165.308 110.773C179.253 105.853 189.121 93.6883 189.121 79.4609C189.121 75.2748 188.265 71.2674 186.704 67.5703L185.904 42.6357C185.862 41.315 184.121 40.8691 183.304 41.9697L174.988 53.1729C169.163 49.0031 161.923 46.3521 154.014 45.8887L153.562 31.8174C153.52 30.4966 151.779 30.0507 150.962 31.1514L138.556 47.8662C128.234 51.2589 120.036 58.5874 116.231 67.8184C104.202 61.6009 91.0936 57.834 78.4248 57.834C52.2978 57.834 33.2592 69.3356 23.0586 86.6416C20.7765 83.6292 19.1284 79.6154 20.6387 74.2256C22.7668 66.632 27.451 61.8152 33.4229 55.8604C39.1467 50.1528 46.4088 43.1035 48.9531 31.8086C50.9901 22.7648 48.5427 13.9811 42.6055 7.87207Z';
  let mascotCount = 0;
  function mascotSVG() {
    const n = ++mascotCount;
    return `<svg viewBox="0 0 190 155" focusable="false" aria-hidden="true">
      <defs>
        <!-- Corte solo por el cuello de la cola (y = 82); el resto del borde pasa por zonas vacías.
             La cola se dibuja debajo con 5 unidades de solape para que no se vea la unión. -->
        <clipPath id="mascot-tail-${n}"><polygon points="-10,-10 56,-10 56,52 40,62 30,70 26,76 23.5,82 23.8,87 -10,87"/></clipPath>
        <clipPath id="mascot-body-${n}"><polygon points="-10,82 23.5,82 26,76 30,70 40,62 56,52 56,-10 210,-10 210,170 -10,170"/></clipPath>
      </defs>
      <g class="mascot__tail" clip-path="url(#mascot-tail-${n})"><path d="${MASCOT_PATH}" fill="#319A37"/></g>
      <g clip-path="url(#mascot-body-${n})"><path d="${MASCOT_PATH}" fill="#319A37"/></g>
      <ellipse class="mascot__eye" cx="171.65" cy="80.7" rx="5.37" ry="4.81" fill="#fff"/>
      <ellipse class="mascot__eye" cx="150.15" cy="71.09" rx="5.37" ry="4.81" fill="#fff"/>
    </svg>`;
  }

  const COLLAB = [
    { type: 'dona',          title: 'Dona',         icon: 'heart-handshake', desc: 'Con tu aportación podemos cubrir alimentación, cuidados veterinarios y mucho más.', cta: 'Hacer una donación', label: 'Donación' },
    { type: 'acoge',         title: 'Acoge',        icon: 'house-heart',     desc: 'Dale un hogar temporal mientras encuentra una familia definitiva: tú pones el cariño, nosotros el apoyo.', cta: 'Quiero acoger', label: 'Casa de acogida' },
    { type: 'voluntariado',  title: 'Voluntariado', icon: 'users-round',     desc: 'Tu tiempo también salva vidas: ayuda en el café, eventos u organización. ¡Todo suma!', cta: 'Quiero ayudar', label: 'Voluntariado' },
  ];

  // Normas y pasos de la visita (Figma · «Pasos físicos. Visita Oh My Cat»)
  const RULES = [
    'Al llegar, desinfección de manos y calzado en la entrada.',
    'Confirma tu reserva en el mostrador diciendo tu nombre.',
    'Respeta el comportamiento de cada gato: si no quiere contacto, déjale espacio.',
    'Una voluntaria te avisará 10 minutos antes de que termine la cita.',
  ];

  const LEGAL = {
    privacidad: { title: 'Política de privacidad', text: 'El texto legal definitivo debe facilitarlo Oh My Cat / Asociación Ghato Verde. En este prototipo los datos que escribes en los formularios se guardan únicamente en el almacenamiento local de tu navegador (localStorage) y no se envían a ningún servidor. Puedes borrarlos con «Reiniciar demo».' },
    terminos:   { title: 'Términos de uso', text: 'Pendiente de redacción por el cliente. Este prototipo es una demostración de diseño e interacción: las reservas y solicitudes que hagas aquí no tienen validez ni generan ningún compromiso con el café.' },
  };

  /* -------------------------------------------------------------------
     2. UTILIDADES
     ------------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const pad = (n) => String(n).padStart(2, '0');

  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const fmtLong = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtFull = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtShort = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const longDate = (iso) => fmtLong.format(fromISO(iso));

  const isClosedDay = (d) => CONFIG.closedWeekdays.includes(d.getDay());
  const isBookableDay = (d) => {
    const today = startOfToday();
    return d >= today && d <= addDays(today, CONFIG.bookingWindowDays) && !isClosedDay(d) && slotsFor(toISO(d)).some((s) => s.available);
  };
  function slotsFor(iso) {
    const now = new Date();
    const isToday = iso === toISO(now);
    const slots = [];
    for (let h = CONFIG.openHour; h <= CONFIG.lastSlotHour; h++) {
      // Hoy: solo franjas que empiezan al menos 30 min después de ahora
      const available = !isToday || (h * 60) >= (now.getHours() * 60 + now.getMinutes() + 30);
      slots.push({ time: `${pad(h)}:00`, available });
    }
    return slots;
  }
  function firstBookableDay() {
    let d = startOfToday();
    for (let i = 0; i <= CONFIG.bookingWindowDays; i++, d = addDays(d, 1)) if (isBookableDay(d)) return d;
    return startOfToday();
  }
  const catById = (id) => CATS.find((c) => c.id === id) || null;
  const newCode = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    return `OMC-${code}`;
  };

  /* -------------------------------------------------------------------
     3. ESTADO Y PERSISTENCIA
     ------------------------------------------------------------------- */
  const seed = () => ({ v: 1, bookings: [], requests: [] });
  let state = seed();

  function loadState() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && saved.v === 1 && Array.isArray(saved.bookings)) state = Object.assign(seed(), saved);
    } catch (err) {
      state = seed(); // almacenamiento bloqueado o corrupto: la demo sigue en memoria
    }
  }
  function saveState() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); }
    catch (err) { toast('No se ha podido guardar en este navegador (modo privado). La demo sigue funcionando en memoria.', 'error'); }
  }
  const activeBookings = () => state.bookings.filter((b) => b.status === 'confirmed' && fromISO(b.date) >= startOfToday());

  function updateBookingsBadge(bump = false) {
    const n = activeBookings().length;
    $$('[data-bookings-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
      if (bump && n) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    $$('.my-bookings-btn').forEach((b) => b.setAttribute('aria-label', n ? `Mis reservas (${n} activa${n === 1 ? '' : 's'})` : 'Mis reservas'));
  }

  /* -------------------------------------------------------------------
     4. TOASTS
     ------------------------------------------------------------------- */
  let toastRegion = null;
  function toast(message, tone = 'success', ms = 4200) {
    const region = toastRegion;
    if (!region) return;
    const el = document.createElement('div');
    el.className = `toast toast--${tone}`;
    el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    el.innerHTML = `${icon(tone === 'error' ? 'alert' : 'circle-check')}<span>${esc(message)}</span>`;
    region.appendChild(el);
    while (region.children.length > 3) region.firstElementChild.remove();
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 300);
    }, ms);
  }

  /* -------------------------------------------------------------------
     5. MODAL (dialog nativo: foco atrapado, Esc y capa superior)
     ------------------------------------------------------------------- */
  const modal = {
    el: null,
    opener: null,
    onClose: null,
    open(html, { size = '', label = '', onClose = null } = {}) {
      const d = this.el;
      if (!d.open) this.opener = document.activeElement;
      this.onClose = onClose;
      d.className = `modal ${size ? 'modal--' + size : ''}`;
      if (label) d.setAttribute('aria-label', label); else d.removeAttribute('aria-label');
      d.innerHTML = html;
      this.adoptToasts();
      if (!d.open) {
        d.showModal();
        document.body.classList.add('is-locked');
      }
      this.focusFirst();
    },
    set(html) {
      this.el.innerHTML = html;
      this.adoptToasts();
      this.focusFirst();
    },
    // El dialog modal vive en la capa superior y vuelve inerte el resto de la página:
    // la región de toasts se mueve dentro del dialog mientras está abierto.
    adoptToasts() { if (toastRegion) this.el.appendChild(toastRegion); },
    focusFirst() {
      const target = $('[autofocus], .modal__body [data-focus-first]', this.el) || $('.modal__title', this.el);
      if (target) {
        if (!target.hasAttribute('tabindex') && !/^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
      const body = $('.modal__body', this.el);
      if (body) body.scrollTop = 0;
    },
    close() {
      const d = this.el;
      if (!d.open || d.classList.contains('is-closing')) return;
      const finish = () => {
        d.classList.remove('is-closing');
        if (toastRegion) document.body.appendChild(toastRegion);
        d.close();
        d.innerHTML = '';
        document.body.classList.remove('is-locked');
        const cb = this.onClose; this.onClose = null;
        if (cb) cb();
        if (this.opener && document.contains(this.opener)) this.opener.focus({ preventScroll: true });
      };
      if (reducedMotion()) { finish(); return; }
      d.classList.add('is-closing');
      let done = false;
      const once = () => { if (!done) { done = true; finish(); } };
      d.addEventListener('animationend', once, { once: true });
      setTimeout(once, 400);
    },
    init() {
      this.el = $('[data-modal]');
      this.el.addEventListener('cancel', (e) => { e.preventDefault(); this.close(); });
      // Clic en el fondo (fuera del contenido) cierra
      this.el.addEventListener('mousedown', (e) => { if (e.target === this.el) this.close(); });
    },
  };

  const modalHeader = (title, subtitle = '') => `
    <header class="modal__header">
      <div>
        <h2 class="modal__title" id="modal-title">${title}</h2>
        ${subtitle ? `<p class="modal__subtitle">${subtitle}</p>` : ''}
      </div>
      <button type="button" class="icon-btn modal__close" data-action="modal-close" aria-label="Cerrar">${icon('x')}</button>
    </header>`;

  /* -------------------------------------------------------------------
     6. CALENDARIO
     Reutilizable: popover en la reserva rápida e inline en el diálogo.
     Lunes y días fuera de ventana deshabilitados; navegación por teclado.
     ------------------------------------------------------------------- */
  function createCalendar(root, { selected = '', onSelect, inline = false, label = 'Calendario' }) {
    const today = startOfToday();
    const maxDay = addDays(today, CONFIG.bookingWindowDays);
    let sel = selected;
    let focusISO = sel || toISO(firstBookableDay());
    let view = fromISO(focusISO); view.setDate(1);

    const minView = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxView = new Date(maxDay.getFullYear(), maxDay.getMonth(), 1);

    function dayButton(d) {
      const iso = toISO(d);
      const bookable = isBookableDay(d);
      const reason = isClosedDay(d) ? ', cerrado' : (!bookable ? ', no disponible' : '');
      return `<button type="button" class="cal__day" data-date="${iso}"
        aria-label="${fmtFull.format(d)}${reason}"
        ${iso === sel ? 'aria-selected="true"' : 'aria-selected="false"'}
        ${iso === toISO(today) ? 'aria-current="date"' : ''}
        ${bookable ? '' : 'disabled'}
        tabindex="${iso === focusISO ? '0' : '-1'}">${d.getDate()}</button>`;
    }

    function render(moveFocus = false) {
      const first = new Date(view.getFullYear(), view.getMonth(), 1);
      const offset = (first.getDay() + 6) % 7; // semana empieza en lunes
      const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      // Si el día enfocado no está en el mes visible o no es reservable, enfocar el primero reservable del mes
      const focusDate = fromISO(focusISO);
      if (focusDate.getMonth() !== view.getMonth() || focusDate.getFullYear() !== view.getFullYear() || !isBookableDay(focusDate)) {
        for (let i = 1; i <= daysInMonth; i++) {
          const d = new Date(view.getFullYear(), view.getMonth(), i);
          if (isBookableDay(d)) { focusISO = toISO(d); break; }
        }
      }
      let cells = '';
      for (let i = 0; i < offset; i++) cells += '<span aria-hidden="true"></span>';
      for (let i = 1; i <= daysInMonth; i++) cells += dayButton(new Date(view.getFullYear(), view.getMonth(), i));

      root.innerHTML = `
        <div class="datepicker ${inline ? 'datepicker--inline' : ''}" role="group" aria-label="${esc(label)}">
          <div class="cal__head">
            <p class="cal__title" aria-live="polite">${cap(fmtMonth.format(view))}</p>
            <div class="cal__nav">
              <button type="button" class="icon-btn" data-cal="prev" aria-label="Mes anterior" ${view <= minView ? 'disabled' : ''}>${icon('chevron-left')}</button>
              <button type="button" class="icon-btn" data-cal="next" aria-label="Mes siguiente" ${view >= maxView ? 'disabled' : ''}>${icon('chevron-right')}</button>
            </div>
          </div>
          <div class="cal__grid">
            ${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => `<abbr class="cal__dow" title="${['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][i]}">${d}</abbr>`).join('')}
            ${cells}
          </div>
          <p class="cal__legend">Los lunes el café está cerrado.</p>
        </div>`;
      if (moveFocus) { const b = $(`[data-date="${focusISO}"]`, root); if (b) b.focus(); }
    }

    function shiftMonth(delta) {
      const next = new Date(view.getFullYear(), view.getMonth() + delta, 1);
      if (next < minView || next > maxView) return;
      view = next;
      render();
      const nav = $(`[data-cal="${delta < 0 ? 'prev' : 'next'}"]`, root);
      if (nav && !nav.disabled) nav.focus(); else { const b = $(`[data-date="${focusISO}"]`, root); if (b) b.focus(); }
    }

    root.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-cal]');
      if (nav) { shiftMonth(nav.dataset.cal === 'prev' ? -1 : 1); return; }
      const day = e.target.closest('.cal__day');
      if (day && !day.disabled) {
        sel = focusISO = day.dataset.date;
        render(true);
        popOnce($(`[data-date="${sel}"]`, root));
        if (onSelect) onSelect(sel);
      }
    });

    root.addEventListener('keydown', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day) return;
      const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (!(e.key in moves) && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      let d = fromISO(day.dataset.date);
      if (e.key === 'Home') d = addDays(d, -((d.getDay() + 6) % 7));
      else if (e.key === 'End') d = addDays(d, 6 - ((d.getDay() + 6) % 7));
      else {
        const step = moves[e.key];
        // Saltar días no reservables en la misma dirección
        for (let i = 0; i < 60; i++) {
          d = addDays(d, step);
          if (d < startOfToday() || d > maxDay) { d = fromISO(day.dataset.date); break; }
          if (isBookableDay(d)) break;
        }
      }
      if (!isBookableDay(d)) return;
      focusISO = toISO(d);
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(true);
    });

    render();
    return {
      focus() { const b = $(`[data-date="${focusISO}"]`, root); if (b) b.focus(); },
    };
  }

  /* -------------------------------------------------------------------
     7. COMPONENTES DE RENDERIZADO
     ------------------------------------------------------------------- */
  const sexIcon = (sex) => (sex === 'Macho' ? 'mars' : 'venus');

  const statusBadge = (cat) => (isAdopted(cat)
    ? `<span class="badge badge--adopted">${icon('heart')}Adoptado</span>`
    : `<span class="badge">${icon('paw')}En adopción</span>`);

  function renderCatCard(cat, i = 0) {
    const adopted = isAdopted(cat);
    return `
      <li style="--i:${i}">
        <article class="cat-card ${adopted ? 'is-adopted' : ''}" aria-labelledby="cat-${cat.id}-name">
          <div class="cat-card__media">
            <img src="${cat.photo}" alt="${esc(cat.alt)}" width="720" height="580" loading="lazy" decoding="async">
            ${statusBadge(cat)}
          </div>
          <div class="cat-card__body">
            <h3 class="cat-card__name" id="cat-${cat.id}-name">${esc(cat.name)}</h3>
            <p class="cat-card__desc">${esc(cat.desc)}</p>
            <div class="cat-card__meta"><span class="chip">${icon(sexIcon(cat.sex))}${esc(cat.sex)}</span></div>
            <button type="button" class="btn btn--secondary btn--block" data-action="open-cat" data-id="${cat.id}">
              ${adopted ? 'Ver su historia' : `Conoce a ${esc(cat.name)}`} ${icon('arrow-right')}
            </button>
          </div>
        </article>
      </li>`;
  }

  /** Reinicia una animación CSS de «pop» en un elemento (selección de día u hora) */
  function popOnce(el) {
    if (!el || reducedMotion()) return;
    el.classList.remove('is-popping'); void el.offsetWidth; el.classList.add('is-popping');
    el.addEventListener('animationend', () => el.classList.remove('is-popping'), { once: true });
  }

  /** Rastro de huellas decorativo para las pantallas de éxito */
  const pawTrail = () => `<div class="paw-trail" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<span style="--i:${i}">${icon('paw')}</span>`).join('')}</div>`;
  /** Check que se dibuja (trazo inline para poder animarlo) */
  const drawnCheck = () => '<svg class="success__check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function renderCollabCard(c, i = 0) {
    return `
      <li class="reveal" style="--i:${i}">
        <article class="collab-card" aria-labelledby="collab-${c.type}">
          <span class="collab-card__icon">${icon(c.icon)}</span>
          <h3 class="collab-card__title" id="collab-${c.type}">${esc(c.title)}</h3>
          <p class="collab-card__desc">${esc(c.desc)}</p>
          <button type="button" class="btn btn--primary" data-action="collab" data-type="${c.type}">${esc(c.cta)} ${icon('arrow-right')}</button>
        </article>
      </li>`;
  }

  function stepperHTML(id, value, labelId) {
    return `
      <div class="stepper" data-stepper role="group" aria-labelledby="${labelId}">
        <button type="button" class="stepper__btn" data-step="-1" aria-label="Quitar una persona" ${value <= CONFIG.minPeople ? 'disabled' : ''}>${icon('minus')}</button>
        <output class="stepper__value" id="${id}" aria-live="polite"><span class="stepper__num" data-stepper-value>${value}</span> <span data-stepper-unit>${value === 1 ? 'persona' : 'personas'}</span></output>
        <button type="button" class="stepper__btn" data-step="1" aria-label="Añadir una persona" ${value >= CONFIG.maxPeople ? 'disabled' : ''}>${icon('plus')}</button>
      </div>`;
  }

  /** Actualiza un stepper existente en el DOM y devuelve el nuevo valor */
  function stepStepper(stepper, delta) {
    const valueEl = $('[data-stepper-value]', stepper);
    const previous = Number(valueEl.textContent);
    const value = Math.min(CONFIG.maxPeople, Math.max(CONFIG.minPeople, previous + delta));
    valueEl.textContent = value;
    // El número «rueda» hacia arriba o hacia abajo según se sume o se reste
    if (value !== previous && !reducedMotion()) {
      valueEl.classList.remove('roll-up', 'roll-down'); void valueEl.offsetWidth;
      valueEl.classList.add(value > previous ? 'roll-up' : 'roll-down');
    }
    $('[data-stepper-unit]', stepper).textContent = value === 1 ? 'persona' : 'personas';
    const [minus, plus] = $$('.stepper__btn', stepper);
    minus.disabled = value <= CONFIG.minPeople;
    plus.disabled = value >= CONFIG.maxPeople;
    // Si el botón pulsado se deshabilita, mantener el foco dentro del stepper
    if (document.activeElement && document.activeElement.disabled) (minus.disabled ? plus : minus).focus();
    return value;
  }

  function textField({ id, label, type = 'text', value = '', autocomplete = 'off', optional = false, help = '', inputmode = '', span2 = false, textarea = false }) {
    const describedBy = `${id}-error${help ? ` ${id}-help` : ''}`;
    const control = textarea
      ? `<textarea class="field__input" id="${id}" name="${id}" data-bind="${id}" rows="3" aria-describedby="${describedBy}">${esc(value)}</textarea>`
      : `<input class="field__input" id="${id}" name="${id}" data-bind="${id}" type="${type}" value="${esc(value)}" autocomplete="${autocomplete}" ${inputmode ? `inputmode="${inputmode}"` : ''} ${optional ? '' : 'aria-required="true"'} aria-describedby="${describedBy}">`;
    return `
      <div class="field ${span2 ? 'span-2' : ''}" data-field="${id}">
        <label class="field__label" for="${id}">${esc(label)}${optional ? ' <span class="optional">(opcional)</span>' : ''}</label>
        <div class="field__control">${control}</div>
        ${help ? `<p class="field__help" id="${id}-help">${esc(help)}</p>` : ''}
        <p class="field__error" id="${id}-error"></p>
      </div>`;
  }

  function setFieldError(root, id, message) {
    const field = $(`[data-field="${id}"]`, root);
    if (!field) return;
    field.classList.toggle('has-error', !!message);
    const err = $(`#${id}-error`, field) || $('.field__error', field);
    if (err) err.textContent = message || '';
    const input = $('.field__input, input', field);
    if (input) {
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message && !reducedMotion()) {
        input.classList.remove('is-shaking'); void input.offsetWidth; input.classList.add('is-shaking');
        input.addEventListener('animationend', () => input.classList.remove('is-shaking'), { once: true });
      }
    }
  }

  const validators = {
    required: (v) => (String(v || '').trim().length >= 2),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()),
    phone: (v) => /^(\+34)?[6789]\d{8}$/.test(String(v || '').replace(/[\s.-]/g, '')),
  };

  /* -------------------------------------------------------------------
     7b. DESPLEGABLES CON EL ESTILO DE LA WEB
     El <select> nativo se queda (guarda el valor y lanza «change»), pero
     oculto: se ve un botón como el del día y una lista como el calendario.
     Las horas se muestran como las franjas del diálogo de reserva.
     ------------------------------------------------------------------- */
  let openSelect = null;
  let selectSeq = 0;

  function closeSelect(returnFocus = false) {
    if (!openSelect) return;
    const { trigger, list } = openSelect;
    list.remove();
    trigger.setAttribute('aria-expanded', 'false');
    openSelect = null;
    if (returnFocus) trigger.focus();
  }

  function syncSelect(select) {
    const trigger = select._trigger;
    if (!trigger) return;
    const opt = select.selectedOptions[0];
    const filled = !!(opt && opt.value);
    const text = opt ? opt.textContent.split(' · ')[0] : '';
    $('[data-placeholder]', trigger).textContent = text;
    trigger.classList.toggle('is-filled', filled);
  }

  function openSelectList(select) {
    const trigger = select._trigger;
    if (openSelect) { const same = openSelect.select === select; closeSelect(same); if (same) return; }
    // «Selecciona…» es solo el texto de ayuda; «A todos, sin preferencia» sí es una opción
    const opts = Array.from(select.options).filter((o) => o.value || !/^Selecciona/.test(o.textContent));
    const isTime = opts.length && opts.every((o) => /^\d{2}:\d{2}/.test(o.textContent));
    const list = document.createElement('div');
    list.className = `select-list ${isTime ? 'select-list--slots' : ''}`;
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    list.id = `${trigger.id}-list`;
    list.setAttribute('aria-labelledby', trigger.getAttribute('aria-labelledby').split(' ')[0]);
    list.innerHTML = opts.map((o, i) => {
      const [main, note] = o.textContent.split(' · ');
      return `<div class="select-list__option" role="option" id="${list.id}-${i}" data-value="${esc(o.value)}"
        aria-selected="${o.selected}" ${o.disabled ? 'aria-disabled="true"' : ''}>${esc(main)}${note ? `<span class="${isTime ? 'sr-only' : 'select-list__note'}"> · ${esc(note)}</span>` : ''}</div>`;
    }).join('');
    trigger.closest('.field__control').after(list);
    trigger.setAttribute('aria-expanded', 'true');
    openSelect = { select, trigger, list };
    const enabled = $$('.select-list__option:not([aria-disabled])', list);
    setActive(enabled.find((el) => el.getAttribute('aria-selected') === 'true') || enabled[0]);
    list.focus();

    list.addEventListener('click', (e) => {
      const el = e.target.closest('.select-list__option');
      if (el && !el.hasAttribute('aria-disabled')) choose(el);
    });
    list.addEventListener('keydown', (e) => {
      const items = $$('.select-list__option:not([aria-disabled])', list);
      const cur = items.indexOf($('.is-active', list));
      const cols = isTime ? getComputedStyle(list).gridTemplateColumns.split(' ').length : 1;
      const move = { ArrowDown: cols, ArrowUp: -cols, ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (move) { e.preventDefault(); setActive(items[Math.min(items.length - 1, Math.max(0, cur + move))]); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); setActive(items[e.key === 'Home' ? 0 : items.length - 1]); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (items[cur]) choose(items[cur]); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeSelect(true); }
      else if (e.key === 'Tab') closeSelect();
    });

    function setActive(el) {
      if (!el) return;
      $$('.is-active', list).forEach((x) => x.classList.remove('is-active'));
      el.classList.add('is-active');
      list.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({ block: 'nearest' });
    }
    function choose(el) {
      select.value = el.dataset.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      syncSelect(select);
      closeSelect(true);
    }
  }

  function enhanceSelect(select) {
    if (select._trigger) return;
    const field = select.closest('.field');
    const label = field && $('.field__label', field);
    if (label && !label.id) label.id = `${select.id || `sel-${++selectSeq}`}-label`;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'field__input field__input--button';
    trigger.id = `${select.id || `sel-${++selectSeq}`}-btn`;
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-labelledby', `${label ? label.id + ' ' : ''}${trigger.id}`);
    if (select.hasAttribute('aria-describedby')) trigger.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    trigger.innerHTML = '<span data-placeholder></span>';
    select.before(trigger);
    select.classList.add('select-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select._trigger = trigger;
    // El código existente enfoca el <select> al mostrar errores: pasamos el foco al botón
    select.addEventListener('focus', () => trigger.focus());
    trigger.addEventListener('click', () => openSelectList(select));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openSelectList(select); }
    });
    // Las opciones se rehacen (p. ej. al cambiar de día): mantener el texto al día
    new MutationObserver(() => syncSelect(select)).observe(select, { childList: true, subtree: true, attributes: true });
    select.addEventListener('change', () => syncSelect(select));
    syncSelect(select);
  }

  function initSelects() {
    $$('select.field__input').forEach(enhanceSelect);
    // Los diálogos pintan sus formularios después: también se mejoran
    new MutationObserver(() => $$('select.field__input:not(.select-native)').forEach(enhanceSelect))
      .observe(document.body, { childList: true, subtree: true });
    document.addEventListener('mousedown', (e) => {
      if (openSelect && !openSelect.list.contains(e.target) && !openSelect.trigger.contains(e.target)) closeSelect();
    });
  }

  /* -------------------------------------------------------------------
     8. RESERVA RÁPIDA (hero)
     ------------------------------------------------------------------- */
  const quick = { date: '', time: '', people: 2, popover: null };

  function fillTimeSelect(select, iso, current) {
    const slots = iso ? slotsFor(iso) : slotsFor('');
    select.innerHTML = '<option value="">Selecciona una hora</option>' +
      slots.map((s) => `<option value="${s.time}" ${s.available ? '' : 'disabled'} ${s.time === current && s.available ? 'selected' : ''}>${s.time}${s.available ? '' : ' · no disponible'}</option>`).join('');
    const stillValid = slots.some((s) => s.time === current && s.available);
    return stillValid ? current : '';
  }

  function closeQuickPicker(returnFocus = false) {
    if (!quick.popover) return;
    quick.popover.remove();
    quick.popover = null;
    const trigger = $('#qb-date');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }

  function openQuickPicker() {
    const trigger = $('#qb-date');
    if (quick.popover) { closeQuickPicker(true); return; }
    const holder = document.createElement('div');
    trigger.closest('.field').appendChild(holder);
    quick.popover = holder;
    trigger.setAttribute('aria-expanded', 'true');
    const cal = createCalendar(holder, {
      selected: quick.date,
      label: 'Elige el día de tu visita',
      onSelect(iso) {
        quick.date = iso;
        $('[data-placeholder]', trigger).textContent = fmtShort.format(fromISO(iso));
        trigger.classList.add('is-filled');
        quick.time = fillTimeSelect($('#qb-time'), iso, quick.time);
        setFieldError(document, 'qb-date', '');
        closeQuickPicker(true);
      },
    });
    cal.focus();
  }

  function initQuickBooking() {
    const form = $('[data-quick-booking]');
    if (!form) return;
    fillTimeSelect($('#qb-time'), '', '');
    $('#qb-date').addEventListener('click', openQuickPicker);
    $('#qb-time').addEventListener('change', (e) => { quick.time = e.target.value; setFieldError(document, 'qb-time', ''); });
    $('[data-stepper]', form).addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (b && !b.disabled) quick.people = stepStepper(b.closest('[data-stepper]'), Number(b.dataset.step));
    });
    // Cerrar popover al hacer clic fuera o con Esc
    document.addEventListener('mousedown', (e) => {
      if (quick.popover && !quick.popover.contains(e.target) && !e.target.closest('#qb-date')) closeQuickPicker();
    });
    form.addEventListener('keydown', (e) => { if (e.key === 'Escape' && quick.popover) { e.stopPropagation(); closeQuickPicker(true); } });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = [];
      if (!quick.date) { setFieldError(document, 'qb-date', 'Selecciona un día para continuar.'); errors.push('qb-date'); }
      if (!quick.time) { setFieldError(document, 'qb-time', 'Selecciona una hora para continuar.'); errors.push('qb-time'); }
      if (errors.length) { $('#' + errors[0]).focus(); return; }
      openBookingFlow({ date: quick.date, time: quick.time, people: quick.people }, quick.date && quick.time ? 2 : 1);
    });
  }

  /* -------------------------------------------------------------------
     9. FLUJO DE RESERVA
     Paso 1 Tu visita · Paso 2 Tus datos · Paso 3 Revisa y confirma · Éxito
     ------------------------------------------------------------------- */
  const STEP_NAMES = ['Tu visita', 'Tus datos', 'Confirmación'];
  let flow = null;

  function openBookingFlow(prefill = {}, step = 1, editId = null) {
    const base = editId ? state.bookings.find((b) => b.id === editId) : null;
    flow = {
      step,
      editId,
      draft: Object.assign({ date: '', time: '', people: 2, cat: '', name: '', surname: '', phone: '', email: '', notes: '', rules: false }, base || {}, prefill),
    };
    if (base) flow.draft.rules = true;
    // Si el día precargado ya no es válido, volver al paso 1
    if (flow.draft.date && !isBookableDay(fromISO(flow.draft.date))) { flow.draft.date = ''; flow.draft.time = ''; flow.step = 1; }
    renderFlow(true);
  }

  function progressHTML() {
    return `<ol class="progress" aria-label="Pasos de la reserva">${STEP_NAMES.map((n, i) => {
      const idx = i + 1;
      const cls = idx < flow.step ? 'is-done' : '';
      return `<li class="progress__step ${cls}" ${idx === flow.step ? 'aria-current="step"' : ''}>${idx}. ${n}${idx < flow.step ? '<span class="sr-only"> (completado)</span>' : ''}</li>`;
    }).join('')}</ol>`;
  }

  function slotsHTML() {
    const d = flow.draft;
    if (!d.date) return '<p class="slots-empty">Elige primero un día para ver las horas.</p>';
    const slots = slotsFor(d.date);
    if (d.time && !slots.some((s) => s.time === d.time && s.available)) d.time = '';
    return `<div class="slots" role="radiogroup" aria-labelledby="bk-time-label">${slots.map((s) => `
      <button type="button" class="slot" role="radio" data-slot="${s.time}" aria-checked="${s.time === d.time}" ${s.available ? '' : 'disabled aria-disabled="true"'}
        tabindex="${s.time === d.time || (!d.time && s === slots.find((x) => x.available)) ? '0' : '-1'}">${s.time}${s.available ? '' : '<span class="sr-only"> no disponible</span>'}</button>`).join('')}
    </div>`;
  }

  function renderFlow(first = false) {
    const d = flow.draft;
    const editing = !!flow.editId;
    const title = editing ? `Modificar reserva ${esc(d.code || '')}` : 'Reserva tu visita';
    let body = '';
    let footer = '';

    if (flow.step === 1) {
      body = `
        <section class="form-section" aria-labelledby="bk-date-label">
          <h3 class="form-section__title" id="bk-date-label">${icon('calendar')}Elige el día</h3>
          <div class="field" data-field="bk-date">
            <div class="panel" data-cal-inline></div>
            <p class="field__error" id="bk-date-error" role="alert"></p>
          </div>
        </section>
        <section class="form-section">
          <h3 class="form-section__title" id="bk-time-label">${icon('clock')}Elige la hora</h3>
          <div class="field" data-field="bk-time">
            <div data-slots>${slotsHTML()}</div>
            <p class="field__help">Las visitas duran unos ${CONFIG.visitMinutes} minutos.</p>
            <p class="field__error" id="bk-time-error" role="alert"></p>
          </div>
        </section>
        <section class="form-section">
          <h3 class="form-section__title" id="bk-people-label">${icon('users')}¿Cuántas personas venís?</h3>
          <div class="field" data-field="bk-people">
            ${stepperHTML('bk-people', d.people, 'bk-people-label')}
            <p class="field__help">Una única reserva para todo el grupo. Límite del prototipo: ${CONFIG.maxPeople} personas.</p>
          </div>
        </section>
        <section class="form-section">
          <div class="field" data-field="bk-cat">
            <label class="field__label" for="bk-cat">¿Te gustaría conocer a algún gato? <span class="optional">(opcional)</span></label>
            <div class="field__control">
              <select class="field__input" id="bk-cat" data-bind="cat">
                <option value="">A todos, sin preferencia</option>
                ${adoptableCats().map((c) => `<option value="${c.id}" ${c.id === d.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
              </select>
              ${icon('chevron-down', 'field__chevron')}
            </div>
            <p class="field__help">Se lo indicaremos a las voluntarias para que te lo presenten.</p>
          </div>
        </section>`;
      footer = `<button type="button" class="btn btn--ghost" data-action="modal-close">Cancelar</button><span class="spacer"></span>
        <button type="button" class="btn btn--primary" data-action="bk-next">Continuar ${icon('arrow-right')}</button>`;
    }

    if (flow.step === 2) {
      body = `
        <div class="notice notice--info" style="margin-bottom:var(--space-5)">${icon('calendar')}<span><strong>${esc(cap(longDate(d.date)))}</strong> · ${esc(d.time)} · ${plural(d.people, 'persona', 'personas')}
          <button type="button" class="link-btn" data-action="bk-goto" data-step="1">Cambiar</button></span></div>
        <form class="form-grid form-grid--2" data-bk-form novalidate>
          ${textField({ id: 'name', label: 'Nombre', value: d.name, autocomplete: 'given-name' })}
          ${textField({ id: 'surname', label: 'Apellidos', value: d.surname, autocomplete: 'family-name' })}
          ${textField({ id: 'phone', label: 'Teléfono', type: 'tel', value: d.phone, autocomplete: 'tel', inputmode: 'tel', help: 'Ej.: 612 345 678' })}
          ${textField({ id: 'email', label: 'Email', type: 'email', value: d.email, autocomplete: 'email', inputmode: 'email' })}
          ${textField({ id: 'notes', label: 'Comentarios', value: d.notes, optional: true, span2: true, textarea: true })}
          <div class="field span-2" data-field="rules">
            <div class="panel">
              <h3 class="form-section__title">${icon('info')}Antes de tu visita</h3>
              <ul class="rules">${RULES.map((r) => `<li>${icon('check')}<span>${esc(r)}</span></li>`).join('')}</ul>
              <label class="check"><input type="checkbox" id="rules" data-bind="rules" ${d.rules ? 'checked' : ''} aria-describedby="rules-error"> <span>He leído las normas de la visita y las acepto.</span></label>
            </div>
            <p class="field__error" id="rules-error"></p>
          </div>
        </form>`;
      footer = `<button type="button" class="btn btn--ghost" data-action="bk-goto" data-step="1">${icon('arrow-left')} Atrás</button><span class="spacer"></span>
        <button type="button" class="btn btn--primary" data-action="bk-next">Revisar reserva ${icon('arrow-right')}</button>`;
    }

    if (flow.step === 3) {
      const cat = catById(d.cat);
      body = `
        <div class="panel">
          <dl class="summary">
            <div class="summary__row"><dt>Día</dt><dd>${esc(cap(longDate(d.date)))}</dd></div>
            <div class="summary__row"><dt>Hora</dt><dd>${esc(d.time)} (unos ${CONFIG.visitMinutes} min)</dd></div>
            <div class="summary__row"><dt>Personas</dt><dd>${plural(d.people, 'persona', 'personas')} · una sola reserva</dd></div>
            <div class="summary__row"><dt>Quieres conocer a</dt><dd>${cat ? esc(cat.name) : 'A todos'}</dd></div>
            <div class="summary__row"><dt>A nombre de</dt><dd>${esc(d.name)} ${esc(d.surname)}</dd></div>
            <div class="summary__row"><dt>Contacto</dt><dd>${esc(d.phone)}<br>${esc(d.email)}</dd></div>
            ${d.notes ? `<div class="summary__row"><dt>Comentarios</dt><dd>${esc(d.notes)}</dd></div>` : ''}
          </dl>
          <p style="margin-top:var(--space-3)"><button type="button" class="link-btn" data-action="bk-goto" data-step="2">${icon('pencil', 'icon--xs')} Editar datos</button></p>
        </div>
        <div class="notice notice--warning">${icon('info')}<span><strong>Reserva de demostración.</strong> Se guardará solo en este navegador; no se envía al café ni a ningún sistema de reservas.</span></div>`;
      footer = `<button type="button" class="btn btn--ghost" data-action="bk-goto" data-step="2">${icon('arrow-left')} Atrás</button><span class="spacer"></span>
        <button type="button" class="btn btn--primary" data-action="bk-confirm"><span class="btn__label">${editing ? 'Guardar cambios' : 'Confirmar reserva'}</span></button>`;
    }

    const html = `${modalHeader(title, editing ? 'Cambia lo que necesites; el código de reserva se mantiene.' : 'Elige día y hora, déjanos tus datos y listo.')}
      ${progressHTML()}
      <div class="modal__body view-anim" aria-live="polite">${body}</div>
      <footer class="modal__footer">${footer}</footer>`;

    if (first || !modal.el.open) modal.open(html, { size: 'wide' });
    else modal.set(html);

    if (flow.step === 1) {
      createCalendar($('[data-cal-inline]', modal.el), {
        selected: d.date,
        inline: true,
        label: 'Día de la visita',
        onSelect(iso) {
          flow.draft.date = iso;
          setFieldError(modal.el, 'bk-date', '');
          $('[data-slots]', modal.el).innerHTML = slotsHTML();
        },
      });
    }
    // El foco va al título del diálogo (anuncia el paso a lectores de pantalla)
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function validateStep() {
    const d = flow.draft;
    const root = modal.el;
    if (flow.step === 1) {
      let firstBad = null;
      if (!d.date) { setFieldError(root, 'bk-date', 'Selecciona un día para continuar.'); firstBad = firstBad || $('.cal__day[tabindex="0"]', root); }
      if (!d.time) { setFieldError(root, 'bk-time', d.date ? 'Selecciona una hora para continuar.' : 'Elige un día y después una hora.'); firstBad = firstBad || $('.slot:not([disabled])', root); }
      if (firstBad) { firstBad.focus(); return false; }
      return true;
    }
    if (flow.step === 2) {
      const checks = [
        ['name', validators.required(d.name), 'Escribe tu nombre.'],
        ['surname', validators.required(d.surname), 'Escribe tus apellidos.'],
        ['phone', validators.phone(d.phone), 'Escribe un teléfono válido de 9 cifras (puedes añadir +34).'],
        ['email', validators.email(d.email), 'Escribe un email válido, por ejemplo nombre@correo.com.'],
        ['rules', d.rules, 'Necesitamos que aceptes las normas de la visita para continuar.'],
      ];
      let firstBad = null;
      checks.forEach(([id, ok, msg]) => {
        setFieldError(root, id, ok ? '' : msg);
        if (!ok && !firstBad) firstBad = $('#' + id, root);
      });
      if (firstBad) { firstBad.focus(); return false; }
      return true;
    }
    return true;
  }

  function confirmBooking(btn) {
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    const d = flow.draft;
    // Simulación local: pequeña espera para mostrar el estado de carga
    setTimeout(() => {
      const record = {
        id: flow.editId || `bk_${Date.now()}`,
        code: d.code || newCode(),
        status: 'confirmed',
        date: d.date, time: d.time, people: d.people, cat: d.cat,
        name: d.name.trim(), surname: d.surname.trim(), phone: d.phone.trim(), email: d.email.trim(), notes: d.notes.trim(),
        createdAt: d.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const idx = state.bookings.findIndex((b) => b.id === record.id);
      if (idx >= 0) state.bookings[idx] = record; else state.bookings.push(record);
      saveState();
      updateBookingsBadge(true);
      const editing = !!flow.editId;
      flow = null;
      renderBookingSuccess(record, editing);
      toast(editing ? `Reserva ${record.code} modificada` : `Reserva ${record.code} guardada`);
    }, reducedMotion() ? 200 : 900);
  }

  function renderBookingSuccess(b, edited) {
    const cat = catById(b.cat);
    modal.set(`${modalHeader(edited ? 'Reserva modificada' : '¡Reserva guardada!')}
      <div class="modal__body view-anim">
        <div class="success">
          ${pawTrail()}
          <div class="success__icon">${drawnCheck()}</div>
          <p>Tu código de reserva es</p>
          <p class="success__code" aria-label="Código de reserva ${esc(b.code.split('').join(' '))}">${esc(b.code)}</p>
          <div class="panel">
            <dl class="summary">
              <div class="summary__row"><dt>Día</dt><dd>${esc(cap(longDate(b.date)))}</dd></div>
              <div class="summary__row"><dt>Hora</dt><dd>${esc(b.time)}</dd></div>
              <div class="summary__row"><dt>Grupo</dt><dd>${plural(b.people, 'persona', 'personas')} · ${esc(b.name)}</dd></div>
              ${cat ? `<div class="summary__row"><dt>Quieres conocer a</dt><dd>${esc(cat.name)}</dd></div>` : ''}
            </dl>
          </div>
          <div class="notice notice--info" style="text-align:left">${icon('info')}<span>Al llegar, di tu nombre en el mostrador. Recuerda: desinfección de manos y calzado en la entrada. <strong>Demo:</strong> no se ha enviado ningún email de confirmación.</span></div>
        </div>
      </div>
      <footer class="modal__footer">
        <button type="button" class="btn btn--secondary" data-action="bk-ics" data-id="${b.id}">${icon('download')} Añadir al calendario</button>
        <span class="spacer"></span>
        <button type="button" class="btn btn--ghost" data-action="open-bookings">Ver mis reservas</button>
        <button type="button" class="btn btn--primary" data-action="modal-close" autofocus>Listo</button>
      </footer>`);
  }

  function downloadICS(b) {
    const start = `${b.date.replace(/-/g, '')}T${b.time.replace(':', '')}00`;
    const endDate = fromISO(b.date);
    const [h, m] = b.time.split(':').map(Number);
    endDate.setHours(h, m + CONFIG.visitMinutes, 0, 0);
    const end = `${toISO(endDate).replace(/-/g, '')}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const escICS = (s) => String(s).replace(/([,;\\])/g, '\\$1');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Oh My Cat//Prototipo//ES', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${b.code}@ohmycat.prototipo`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escICS(`Visita a Oh My Cat · ${b.code} (prototipo)`)}`,
      `LOCATION:${escICS(CONFIG.address)}`,
      `DESCRIPTION:${escICS(`Reserva de demostración para ${b.people} persona(s) a nombre de ${b.name}. Generada por el prototipo: no confirma plaza en el café.`)}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    try {
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url; a.download = `ohmycat-${b.code}.ics`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Archivo de calendario (.ics) descargado');
    } catch (err) {
      toast('No se ha podido generar el archivo de calendario.', 'error');
    }
  }

  /* -------------------------------------------------------------------
     10. MIS RESERVAS
     ------------------------------------------------------------------- */
  function bookingItemHTML(b) {
    const past = fromISO(b.date) < startOfToday();
    const cancelled = b.status === 'cancelled';
    const cat = catById(b.cat);
    const badge = cancelled ? '<span class="badge badge--muted">Cancelada</span>' : past ? '<span class="badge badge--muted">Pasada</span>' : '<span class="badge badge--success">' + icon('check') + 'Activa</span>';
    const actions = cancelled || past
      ? `<button type="button" class="btn btn--ghost btn--sm" data-action="bk-delete" data-id="${b.id}">${icon('trash')} Quitar del historial</button>`
      : `<button type="button" class="btn btn--secondary btn--sm" data-action="bk-edit" data-id="${b.id}">${icon('pencil')} Modificar</button>
         <button type="button" class="btn btn--ghost btn--sm" data-action="bk-ics" data-id="${b.id}">${icon('download')} Calendario</button>
         <button type="button" class="btn btn--ghost btn--sm" data-action="bk-cancel" data-id="${b.id}" style="color:var(--color-error-text)">${icon('x')} Cancelar</button>`;
    return `
      <li class="booking-item ${cancelled ? 'is-cancelled' : ''}">
        <div class="booking-item__top"><span class="booking-item__code">${esc(b.code)}</span>${badge}</div>
        <p class="booking-item__when">${esc(longDate(b.date))} · ${esc(b.time)}</p>
        <div class="booking-item__meta">
          <span class="chip">${icon('users')}${plural(b.people, 'persona', 'personas')}</span>
          <span class="chip">${icon('ticket')}${esc(b.name)} ${esc(b.surname)}</span>
          ${cat ? `<span class="chip">${icon('paw')}${esc(cat.name)}</span>` : ''}
        </div>
        <div class="booking-item__actions">${actions}</div>
      </li>`;
  }

  function openMyBookings(noticeHTML = '') {
    const list = [...state.bookings].sort((a, b) => {
      const rank = (x) => (x.status === 'cancelled' ? 2 : fromISO(x.date) < startOfToday() ? 1 : 0);
      return rank(a) - rank(b) || (a.date + a.time).localeCompare(b.date + b.time);
    });
    const body = list.length
      ? `${noticeHTML}<ul class="booking-list">${list.map(bookingItemHTML).join('')}</ul>`
      : `${noticeHTML}<div class="empty"><img src="assets/icons/mascota.svg" alt="" width="110" height="90"><h3>Aún no tienes reservas</h3><p>Elige día y hora y ven a conocer a los gatos.</p></div>`;
    const html = `${modalHeader('Mis reservas', 'Cada grupo tiene un único código: al cancelar, se cancela la reserva completa.')}
      <div class="modal__body view-anim">${body}</div>
      <footer class="modal__footer"><button type="button" class="btn btn--ghost" data-action="modal-close">Cerrar</button><span class="spacer"></span><button type="button" class="btn btn--primary" data-action="open-booking">Nueva reserva</button></footer>`;
    if (modal.el.open) modal.set(html); else modal.open(html, { size: 'wide' });
  }

  function askCancel(id) {
    const b = state.bookings.find((x) => x.id === id);
    if (!b) return;
    modal.set(`${modalHeader('¿Cancelar esta reserva?')}
      <div class="modal__body view-anim">
        <div class="panel">
          <dl class="summary">
            <div class="summary__row"><dt>Código</dt><dd>${esc(b.code)}</dd></div>
            <div class="summary__row"><dt>Día y hora</dt><dd>${esc(cap(longDate(b.date)))} · ${esc(b.time)}</dd></div>
            <div class="summary__row"><dt>Se cancelan</dt><dd>${plural(b.people, 'plaza', 'plazas')} (toda la reserva del grupo)</dd></div>
          </dl>
        </div>
        <div class="notice notice--error">${icon('alert')}<span>Esta acción no se puede deshacer. Si solo quieres cambiar la hora o el número de personas, usa «Modificar».</span></div>
      </div>
      <footer class="modal__footer">
        <button type="button" class="btn btn--ghost" data-action="open-bookings" autofocus>Volver</button><span class="spacer"></span>
        <button type="button" class="btn btn--secondary" data-action="bk-edit" data-id="${b.id}">Modificar</button>
        <button type="button" class="btn btn--danger" data-action="bk-cancel-confirm" data-id="${b.id}">Sí, cancelar reserva</button>
      </footer>`);
  }

  function cancelBooking(id) {
    const b = state.bookings.find((x) => x.id === id);
    if (!b) return;
    b.status = 'cancelled';
    b.updatedAt = new Date().toISOString();
    saveState();
    updateBookingsBadge();
    toast(`Reserva ${b.code} cancelada`);
    openMyBookings(`<div class="notice notice--success" style="margin-bottom:var(--space-4)">${icon('circle-check')}<span>Has cancelado la reserva <strong>${esc(b.code)}</strong> del ${esc(longDate(b.date))} (${plural(b.people, 'persona', 'personas')}).</span></div>`);
  }

  /* -------------------------------------------------------------------
     11. GATOS: carrusel accesible + ficha
     ------------------------------------------------------------------- */
  function initCarousel(root) {
    const viewport = $('[data-carousel-viewport]', root);
    const track = $('[data-cats-track]', root);
    const prev = $('[data-carousel-prev]', root);
    const next = $('[data-carousel-next]', root);
    const dotsEl = $('[data-carousel-dots]', root);
    track.innerHTML = CATS.map(renderCatCard).join('');
    const items = $$(':scope > li', track);

    const metrics = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const w = items[0].getBoundingClientRect().width + gap;
      const perView = Math.max(1, Math.round((viewport.clientWidth + gap) / w));
      const pages = Math.max(1, Math.ceil((items.length - perView) / perView) + 1);
      return { w, perView, pages };
    };
    let lastPages = 0;

    function update() {
      const { w, perView, pages } = metrics();
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      const atStart = viewport.scrollLeft <= 2;
      const atEnd = viewport.scrollLeft >= maxScroll - 2;
      prev.disabled = atStart;
      next.disabled = atEnd;
      if (pages !== lastPages) {
        dotsEl.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" class="carousel__dot" data-page="${i}" aria-label="Página ${i + 1} de ${pages}"></button>`).join('');
        lastPages = pages;
      }
      const current = atEnd ? pages - 1 : Math.min(pages - 1, Math.round(viewport.scrollLeft / (w * perView)));
      $$('.carousel__dot', dotsEl).forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
      root.classList.toggle('is-static', pages === 1);
      prev.hidden = next.hidden = dotsEl.hidden = pages === 1;
      // Elementos fuera de la vista no se enfocan con Tab
      const vr = viewport.getBoundingClientRect();
      items.forEach((li) => {
        const r = li.getBoundingClientRect();
        const visible = r.left >= vr.left - 4 && r.right <= vr.right + 4;
        li.toggleAttribute('inert', !visible);
        li.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });
    }
    const go = (dir) => {
      const { w, perView } = metrics();
      viewport.scrollBy({ left: dir * w * perView, behavior: reducedMotion() ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    dotsEl.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-page]');
      if (!dot) return;
      const { w, perView } = metrics();
      viewport.scrollTo({ left: Number(dot.dataset.page) * perView * w, behavior: reducedMotion() ? 'auto' : 'smooth' });
    });
    viewport.addEventListener('keydown', (e) => {
      if (e.target !== viewport) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    viewport.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Al terminar de desplazarse, actualizar (por si scroll-snap ajusta)
    viewport.addEventListener('scrollend', schedule);
    update();
  }

  function openCat(id) {
    const cat = catById(id);
    if (!cat) return;
    const adopted = isAdopted(cat);
    const note = adopted
      ? `<div class="notice notice--success" style="margin-top:var(--space-5)">${icon('heart')}<span>${esc(cat.name)} ya vive con su familia adoptiva, así que no está en el café. Hay otros gatos esperando su oportunidad.</span></div>`
      : `<div class="notice notice--info" style="margin-top:var(--space-5)">${icon('info')}<span>La adopción de los gatos acogidos es el objetivo de la Asociación Ghato Verde. Reserva una visita para conocer a ${esc(cat.name)} y pregunta por su historia a las voluntarias.</span></div>`;
    const action = adopted
      ? '<a class="btn btn--primary" href="#gatos" data-action="modal-close">Ver gatos en adopción</a>'
      : `<button type="button" class="btn btn--primary" data-action="open-booking" data-cat="${cat.id}">Reservar visita para conocer a ${esc(cat.name)}</button>`;
    modal.open(`${modalHeader(adopted ? `La historia de ${esc(cat.name)}` : `Conoce a ${esc(cat.name)}`)}
      <div class="modal__body view-anim">
        <div class="cat-detail ${adopted ? 'is-adopted' : ''}">
          <img class="cat-detail__photo" src="${cat.photo}" alt="${esc(cat.alt)}" width="720" height="580">
          <div>
            <div class="cat-detail__head"><h3 class="cat-detail__name">${esc(cat.name)}</h3>${statusBadge(cat)}</div>
            <p class="cat-detail__desc">${esc(cat.desc)}</p>
            <div class="cat-card__meta" style="margin-top:var(--space-4)"><span class="chip">${icon(sexIcon(cat.sex))}${esc(cat.sex)}</span></div>
            ${note}
          </div>
        </div>
      </div>
      <footer class="modal__footer">
        <button type="button" class="btn btn--ghost" data-action="modal-close">Cerrar</button><span class="spacer"></span>
        ${action}
      </footer>`, { size: 'wide' });
  }

  /* -------------------------------------------------------------------
     12. COLABORA
     ------------------------------------------------------------------- */
  let collabDraft = null;
  function openCollab(type) {
    const c = COLLAB.find((x) => x.type === type) || COLLAB[0];
    collabDraft = { type: c.type, name: '', email: '', phone: '', message: '', consent: false };
    const donationNote = c.type === 'dona'
      ? `<div class="notice notice--warning" style="margin-bottom:var(--space-5)">${icon('info')}<span>Este prototipo <strong>no procesa pagos</strong>. Los datos para donar debe facilitarlos la Asociación Ghato Verde; aquí puedes dejar tu contacto para que te los envíen.</span></div>`
      : '';
    modal.open(`${modalHeader(esc(c.title), esc(c.desc))}
      <div class="modal__body view-anim">
        ${donationNote}
        <form class="form-grid form-grid--2" data-collab-form novalidate>
          <div class="field span-2" data-field="ctype">
            <label class="field__label" for="ctype">¿Cómo quieres colaborar?</label>
            <div class="field__control">
              <select class="field__input" id="ctype" data-cbind="type">
                ${COLLAB.map((x) => `<option value="${x.type}" ${x.type === c.type ? 'selected' : ''}>${esc(x.label)}</option>`).join('')}
              </select>${icon('chevron-down', 'field__chevron')}
            </div>
          </div>
          ${textField({ id: 'cname', label: 'Nombre', autocomplete: 'name' }).replace('data-bind="cname"', 'data-cbind="name"')}
          ${textField({ id: 'cemail', label: 'Email', type: 'email', autocomplete: 'email', inputmode: 'email' }).replace('data-bind="cemail"', 'data-cbind="email"')}
          ${textField({ id: 'cphone', label: 'Teléfono', type: 'tel', autocomplete: 'tel', inputmode: 'tel', optional: true, span2: true }).replace('data-bind="cphone"', 'data-cbind="phone"')}
          ${textField({ id: 'cmessage', label: 'Cuéntanos algo más', optional: true, span2: true, textarea: true }).replace('data-bind="cmessage"', 'data-cbind="message"')}
          <div class="field span-2" data-field="cconsent">
            <label class="check"><input type="checkbox" id="cconsent" data-cbind="consent" aria-describedby="cconsent-error"> <span>Acepto que la asociación use estos datos para contactarme sobre mi solicitud.</span></label>
            <p class="field__help">Demo: los datos se guardan solo en este navegador y puedes borrarlos con «Reiniciar demo».</p>
            <p class="field__error" id="cconsent-error"></p>
          </div>
        </form>
      </div>
      <footer class="modal__footer">
        <button type="button" class="btn btn--ghost" data-action="modal-close">Cancelar</button><span class="spacer"></span>
        <button type="button" class="btn btn--primary" data-action="collab-submit"><span class="btn__label">Enviar solicitud</span></button>
      </footer>`, { size: '' });
  }

  function submitCollab(btn) {
    const d = collabDraft;
    const root = modal.el;
    const checks = [
      ['cname', validators.required(d.name), 'Escribe tu nombre.'],
      ['cemail', validators.email(d.email), 'Escribe un email válido, por ejemplo nombre@correo.com.'],
      ['cphone', !d.phone || validators.phone(d.phone), 'Si añades teléfono, que tenga 9 cifras.'],
      ['cconsent', d.consent, 'Marca la casilla para que podamos contactarte.'],
    ];
    let firstBad = null;
    checks.forEach(([id, ok, msg]) => { setFieldError(root, id, ok ? '' : msg); if (!ok && !firstBad) firstBad = $('#' + id, root); });
    if (firstBad) { firstBad.focus(); return; }
    btn.classList.add('is-loading');
    setTimeout(() => {
      const c = COLLAB.find((x) => x.type === d.type);
      state.requests.push({ id: `rq_${Date.now()}`, type: d.type, name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), message: d.message.trim(), createdAt: new Date().toISOString() });
      saveState();
      modal.set(`${modalHeader('¡Gracias por querer ayudar!')}
        <div class="modal__body view-anim"><div class="success">
          ${pawTrail()}
          <div class="success__icon">${icon('heart-handshake')}</div>
          <p><strong>${esc(d.name.trim())}</strong>, hemos registrado tu interés en <strong>${esc(c.label.toLowerCase())}</strong>.</p>
          <div class="notice notice--warning" style="text-align:left;margin-top:var(--space-5)">${icon('info')}<span><strong>Demo:</strong> la solicitud se ha guardado solo en este navegador. En la web real se enviaría a la Asociación Ghato Verde.</span></div>
        </div></div>
        <footer class="modal__footer"><span class="spacer"></span><button type="button" class="btn btn--primary" data-action="modal-close" autofocus>Cerrar</button></footer>`);
      toast('Solicitud de colaboración guardada (demo)');
    }, reducedMotion() ? 200 : 700);
  }

  /* -------------------------------------------------------------------
     13. HEADER, MENÚ MÓVIL Y NAVEGACIÓN POR SECCIONES
     ------------------------------------------------------------------- */
  function setMenu(open) {
    const toggle = $('.menu-toggle');
    const menu = $('[data-mobile-menu]');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    if (open) { const first = $('a, button', menu); if (first) first.focus(); }
  }

  function initHeader() {
    const header = $('[data-header]');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('[data-mobile-menu]').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('[data-mobile-menu]').hidden) { setMenu(false); $('.menu-toggle').focus(); }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    // Resaltar la sección activa en la navegación
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav-link, .mobile-nav-link');
    const sections = ['gatos', 'visita', 'ghato-verde', 'colabora'].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
    // Al volver al hero, ningún enlace activo
    const heroIO = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', 'false'));
    }, { rootMargin: '-45% 0px -50% 0px' });
    heroIO.observe($('#inicio'));
    initHeaderCta(header);
  }

  // «Reservar» del header: solo cuando el panel de reserva del hero no se ve (evita dos CTA iguales a la vez)
  function initHeaderCta(header) {
    const cta = $('[data-header-cta]');
    const panel = $('[data-quick-booking]');
    if (!cta || !panel) return;
    const set = (show) => {
      header.classList.toggle('show-cta', show);
      cta.toggleAttribute('inert', !show);
    };
    set(false);
    const io = new IntersectionObserver(([entry]) => set(!entry.isIntersecting), {
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    });
    io.observe(panel);
  }

  // Mascotas: SVG inline (no <img>) para poder animar la cola y el parpadeo
  function renderMascots() {
    $$('[data-mascot]').forEach((el) => { el.innerHTML = mascotSVG(); });
  }

  // Enlaces internos: mover el foco al destino (accesibilidad de anclas)
  function focusSection(hash) {
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const heading = $('h1, h2', target) || target;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    setTimeout(() => heading.focus({ preventScroll: true }), reducedMotion() ? 0 : 450);
  }

  /* -------------------------------------------------------------------
     14. VARIOS
     ------------------------------------------------------------------- */
  async function share() {
    const data = { title: 'Oh My Cat · Cat café en Sevilla', text: 'Café y bigotes, plan prrrfecto!', url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(location.href); toast('Enlace copiado al portapapeles'); return; }
      throw new Error('sin API');
    } catch (err) {
      if (err && err.name === 'AbortError') return; // el usuario cerró el diálogo de compartir
      const ta = document.createElement('textarea');
      ta.value = location.href; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) { toast('Enlace copiado al portapapeles'); return; }
      // Último recurso: mostrar el enlace para copiarlo a mano
      modal.open(`${modalHeader('Compartir Oh My Cat')}
        <div class="modal__body"><div class="field" data-field="share-url">
          <label class="field__label" for="share-url">Copia este enlace</label>
          <div class="field__control"><input class="field__input" id="share-url" readonly value="${esc(location.href)}" autofocus onfocus="this.select()"></div>
        </div></div>
        <footer class="modal__footer"><span class="spacer"></span><button type="button" class="btn btn--primary" data-action="modal-close">Cerrar</button></footer>`, { size: 'sm' });
    }
  }

  function openLegal(doc) {
    const l = LEGAL[doc];
    if (!l) return;
    const html = `${modalHeader(esc(l.title))}
      <div class="modal__body view-anim"><div class="notice notice--warning">${icon('info')}<span>Contenido pendiente de facilitar por el cliente.</span></div><p style="margin-top:var(--space-4)">${esc(l.text)}</p></div>
      <footer class="modal__footer"><span class="spacer"></span><button type="button" class="btn btn--primary" data-action="modal-close" autofocus>Entendido</button></footer>`;
    modal.open(html, { size: 'sm' });
  }

  function askReset() {
    modal.open(`${modalHeader('¿Reiniciar la demo?')}
      <div class="modal__body"><p>Se borrarán de este navegador las reservas (${state.bookings.length}) y solicitudes de colaboración (${state.requests.length}) creadas en el prototipo.</p></div>
      <footer class="modal__footer"><button type="button" class="btn btn--ghost" data-action="modal-close" autofocus>Volver</button><span class="spacer"></span><button type="button" class="btn btn--danger" data-action="reset-confirm">Borrar datos de la demo</button></footer>`, { size: 'sm' });
  }

  function initReveal() {
    const els = $$('.reveal');
    if (reducedMotion() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  function renderSocial() {
    const box = $('[data-social]');
    CONFIG.social.filter((s) => s.url).forEach((s) => {
      box.insertAdjacentHTML('beforeend', `<a class="icon-btn icon-btn--outline" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)} (abre en una pestaña nueva)">${icon(s.icon || 'external')}</a>`);
    });
  }

  /* -------------------------------------------------------------------
     15. DELEGACIÓN DE EVENTOS E INICIO
     ------------------------------------------------------------------- */
  function onClick(e) {
    // Enlaces de ancla internos
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href').length > 1) {
      if (modal.el.open) modal.close();
      focusSection(anchor.getAttribute('href'));
    }

    const el = e.target.closest('[data-action], [data-slot], [data-step]');
    if (!el) return;

    // Slots de hora dentro del diálogo
    if (el.dataset.slot && flow && !el.disabled) {
      flow.draft.time = el.dataset.slot;
      $$('.slot', modal.el).forEach((s) => { s.setAttribute('aria-checked', String(s === el)); s.tabIndex = s === el ? 0 : -1; });
      popOnce(el);
      setFieldError(modal.el, 'bk-time', '');
      return;
    }
    // Stepper dentro del diálogo
    if (el.dataset.step && el.closest('.modal [data-stepper]') && flow) {
      if (!el.disabled) flow.draft.people = stepStepper(el.closest('[data-stepper]'), Number(el.dataset.step));
      return;
    }

    const action = el.dataset.action;
    const id = el.dataset.id;
    switch (action) {
      case 'toggle-menu': setMenu($('.menu-toggle').getAttribute('aria-expanded') !== 'true'); break;
      case 'open-booking': {
        setMenu(false);
        const cat = catById(el.dataset.cat);
        openBookingFlow(cat && !isAdopted(cat) ? { cat: cat.id } : {}, 1);
        break;
      }
      case 'open-bookings': setMenu(false); openMyBookings(); break;
      case 'modal-close': modal.close(); break;
      case 'bk-next':
        if (validateStep()) { flow.step += 1; renderFlow(); }
        break;
      case 'bk-goto': flow.step = Number(el.dataset.step); renderFlow(); break;
      case 'bk-confirm': confirmBooking(el); break;
      case 'bk-edit': openBookingFlow({}, 1, id); break;
      case 'bk-cancel': askCancel(id); break;
      case 'bk-cancel-confirm': cancelBooking(id); break;
      case 'bk-delete':
        state.bookings = state.bookings.filter((b) => b.id !== id); saveState(); updateBookingsBadge(); openMyBookings(); toast('Reserva quitada del historial');
        break;
      case 'bk-ics': { const b = state.bookings.find((x) => x.id === id); if (b) downloadICS(b); break; }
      case 'open-cat': openCat(id); break;
      case 'collab': openCollab(el.dataset.type); break;
      case 'collab-submit': submitCollab(el); break;
      case 'share': share(); break;
      case 'legal': openLegal(el.dataset.doc); break;
      case 'reset-demo': askReset(); break;
      case 'reset-confirm':
        try { localStorage.removeItem(CONFIG.storageKey); } catch (err) { /* sin almacenamiento */ }
        state = seed(); updateBookingsBadge(); modal.close(); toast('Datos de la demo borrados');
        break;
      default: break;
    }
  }

  function onInput(e) {
    const t = e.target;
    if (flow && t.dataset.bind) {
      flow.draft[t.dataset.bind] = t.type === 'checkbox' ? t.checked : t.value;
      const field = t.closest('[data-field]');
      if (field && field.classList.contains('has-error')) setFieldError(modal.el, field.dataset.field, '');
    }
    if (collabDraft && t.dataset.cbind) {
      collabDraft[t.dataset.cbind] = t.type === 'checkbox' ? t.checked : t.value;
      const field = t.closest('[data-field]');
      if (field && field.classList.contains('has-error')) setFieldError(modal.el, field.dataset.field, '');
    }
  }

  // Navegación con flechas en el grupo de horas (patrón radiogroup)
  function onKeydown(e) {
    const slot = e.target.closest('.slot');
    if (!slot || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const slots = $$('.slot:not([disabled])', modal.el);
    const i = slots.indexOf(slot);
    const next = slots[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + slots.length) % slots.length];
    next.focus();
    next.click();
  }

  function onSubmit(e) {
    // Enter dentro de los formularios del diálogo = botón principal
    if (e.target.matches('[data-bk-form]')) { e.preventDefault(); const b = $('[data-action="bk-next"]', modal.el); if (b) b.click(); }
    if (e.target.matches('[data-collab-form]')) { e.preventDefault(); const b = $('[data-action="collab-submit"]', modal.el); if (b) b.click(); }
  }

  function init() {
    document.documentElement.classList.add('js');
    loadState();
    toastRegion = $('[data-toasts]');
    modal.init();
    // Al cerrar el modal, olvidar borradores
    modal.el.addEventListener('close', () => { flow = null; collabDraft = null; });

    $('[data-collab-grid]').innerHTML = COLLAB.map(renderCollabCard).join('');
    renderMascots();
    initCarousel($('[data-carousel]'));
    initQuickBooking();
    initSelects();
    initHeader();
    renderSocial();
    initReveal();
    updateBookingsBadge();
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onInput);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('submit', onSubmit);
  }

  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  } catch (err) {
    // Si algo falla, la página sigue siendo legible (contenido estático en el HTML)
    console.error('Oh My Cat · error al iniciar el prototipo', err);
  }
})();
