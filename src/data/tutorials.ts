import raw from './tutorials.json';

/* ──────────────────────────────────────────────────────────────
 * Mini tutoriales. Fuente: instrucciones-terminos-y-tutoriales.md
 * (sección 5), copiada tal cual en tutorials.json.
 *
 * STEP_OVERRIDES ajusta algunos pasos para que describan cómo funciona
 * de verdad cada mecánica en el juego (el documento pide no modificar
 * las actividades ya implementadas). Cada ajuste explica el motivo.
 * ────────────────────────────────────────────────────────────── */

export type MechanicId =
  | 'terminos'
  | 'quiz'
  | 'chat'
  | 'reto'
  | 'nodos'
  | 'arrastrar'
  | 'test5'
  | 'swipe'
  | 'recursos'
  | 'simulacion'
  | 'turnos';

export interface Tutorial {
  id: string;
  mecanica: MechanicId;
  tipo: 'completo' | 'express';
  titulo: string;
  bloque: string;
  momento: string;
  duracion_seg: number;
  ya_conocido?: string;
  pasos: string[];
  practica_guiada: string | null;
  completado_cuando: string;
}

const STEP_OVERRIDES: Partial<Record<MechanicId, Record<number, string>>> = {
  quiz: {
    // El temporizador del juego es un reloj circular, no una barra.
    0: '⏱️ Cada pregunta tiene un reloj de 15 segundos. Si se vacía, la pregunta cuenta como no respondida.',
  },
  nodos: {
    // El Mapa de Fit se juega tocando (o arrastrando) y cada necesidad tiene un solo intento: no hay líneas que borrar.
    0: '👆 Toca una tarjeta del cliente (izquierda) y luego el servicio que la resuelve (derecha). En computador también puedes arrastrar el servicio sobre la necesidad.',
    1: '➰ Se dibuja una línea: verde si encaja (el medidor de Fit sube) y rosada si no.',
    2: '☝️ Cada necesidad tiene un solo intento. Si te equivocas, el juego te muestra la respuesta correcta para que aprendas.',
    3: '🗑️ Los servicios que no resuelven nada van a la papelera: selecciónalos y toca el botón, o arrástralos.',
  },
  arrastrar: {
    // El Hero Builder se arma tocando un espacio y eligiendo un módulo del panel.
    1: '👆 Toca un espacio del boceto y elige su módulo en el panel. Cada espacio acepta un solo módulo.',
    2: '🔄 Para cambiarlo, toca el espacio otra vez y elige otro módulo: el anterior vuelve al panel.',
  },
  test5: {
    // No hay "Volver a editar" con reintentos: el resultado ofrece reintentar el Fit Lab completo.
    3: '🔁 Al final verás tu resultado. Si no te convence, puedes reintentar el Fit Lab completo.',
  },
  swipe: {
    // Los botones del juego dicen "👈 No sirve" y "Sirve 👉".
    2: '⌨️ En computador, también puedes usar las flechas del teclado o los botones 👈 No sirve y Sirve 👉.',
  },
  turnos: {
    // Las cartas se asignan tocando: primero la carta, luego el cliente. El botón se llama "Cerrar el mes".
    2: '🃏 Toca una carta y luego un cliente. Antes de asignarla verás cuánto subirá su barra.',
    3: '⏭️ Cuando termines de repartir, toca **Cerrar el mes**. Las barras bajan y llega un nuevo evento.',
  },
};

/** Elemento de la interfaz que resalta cada paso (atributo data-tour). Sin anclaje, el globo va centrado. */
export const STEP_ANCHORS: Partial<Record<MechanicId, (string | null)[]>> = {
  terminos: ['term', 'term', 'nav-dictionary'],
  quiz: ['quiz-timer', 'quiz-options', null, 'quiz-timer'],
  chat: ['inbox-list', 'inbox-chat', 'inbox-fiche', 'inbox-list'],
  reto: ['build-form', null, 'build-forbidden', null],
  nodos: ['fitmap-needs', 'fitmap-board', 'fitmap-needs', 'fitmap-trash'],
  arrastrar: ['hero-preview', 'hero-panel', 'hero-panel', 'hero-publish'],
  test5: ['hero-preview', 'hero-preview', null, null],
  swipe: ['swipe-card', 'swipe-card', 'swipe-buttons', 'swipe-undo'],
  recursos: ['journey-resources', 'journey-board', 'journey-board'],
  simulacion: ['funnel', 'funnel', 'funnel-events', 'funnel-speed'],
  turnos: ['accounts-status', 'accounts-clients', 'accounts-hand', 'accounts-close'],
};

export const TUTORIALS: Record<MechanicId, Tutorial> = Object.fromEntries(
  (raw as Tutorial[]).map((t) => {
    const overrides = STEP_OVERRIDES[t.mecanica] ?? {};
    return [t.mecanica, { ...t, pasos: t.pasos.map((p, i) => overrides[i] ?? p) }];
  }),
) as Record<MechanicId, Tutorial>;
