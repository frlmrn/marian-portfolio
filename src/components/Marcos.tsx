/*
 * Marcos de dispositivo en SVG, los únicos de la web: todos los móviles y
 * portátiles son iguales. La pantalla (imagen o iframe) va debajo y el marco
 * encima, sin capturar los clics. Las medidas de la pantalla están en
 * Expediente.module.css (.pantallaMovil y .portatilPantalla).
 */

/** Móvil de 414 × 868: pantalla de 390 × 844 con un marco de 12 por igual (sin isla: taparía la cabecera). */
export function MarcoMovil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 414 868" aria-hidden="true">
      <path d="M-2 170h2v44h-2zM-2 232h2v74h-2zM-2 322h2v74h-2zM414 262h2v110h-2z" fill="#3a3836" />
      <path
        fillRule="evenodd"
        fill="#1b1a19"
        d="M58 0h298a58 58 0 0 1 58 58v752a58 58 0 0 1-58 58H58a58 58 0 0 1-58-58V58A58 58 0 0 1 58 0ZM58 12a46 46 0 0 0-46 46v752a46 46 0 0 0 46 46h298a46 46 0 0 0 46-46V58a46 46 0 0 0-46-46Z"
      />
      <rect x="1" y="1" width="412" height="866" rx="57" fill="none" stroke="#55524e" strokeWidth="2" />
    </svg>
  )
}

/** Portátil de 1640 × 985: pantalla de 1440 × 900 y la base debajo. */
export function MarcoPortatil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1640 985" aria-hidden="true">
      <path
        fillRule="evenodd"
        fill="#1b1a19"
        d="M88 0h1464a28 28 0 0 1 28 28v917H60V28A28 28 0 0 1 88 0ZM100 30v900h1440V30Z"
      />
      <path d="M88 1h1464a27 27 0 0 1 27 27" fill="none" stroke="#55524e" strokeWidth="2" />
      <path d="M61 28A27 27 0 0 1 88 1" fill="none" stroke="#55524e" strokeWidth="2" />
      <path d="M0 945h1640v10a30 30 0 0 1-30 30H30a30 30 0 0 1-30-30Z" fill="#bdb8b1" />
      <path d="M0 945h1640v6H0Z" fill="#d9d5cf" />
      <path d="M720 945h200v6a10 10 0 0 1-10 10H730a10 10 0 0 1-10-10Z" fill="#a7a29b" />
    </svg>
  )
}
