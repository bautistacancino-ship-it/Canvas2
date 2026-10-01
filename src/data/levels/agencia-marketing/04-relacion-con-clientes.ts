import type { LevelConfig } from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * BLOQUE · Relación con Clientes
 * Perfil: Agencia de Marketing Digital y Diseño Web
 * Viene de: Canales · Desbloquea: Fuentes de Ingreso
 * Fuente: relacion-con-clientes-agencia-marketing-digital.md
 * ────────────────────────────────────────────────────────────── */

export const agenciaRelacionClientes = {
  id: 'agencia-marketing/customer-relationships',
  businessId: 'agencia-marketing',
  blockId: 'customer-relationships',
  title: 'Relación con Clientes',
  subtitle: 'Conseguir un cliente es la descarga de la app. La relación es todo lo que hace que no la desinstale.',

  /* ─── Fase 1 · Micro-learning ────────────────────────────── */
  theory: {
    title: 'Micro-learning: la UX de tu servicio',
    concept: {
      headline: 'Conseguir un cliente es la descarga de la app. La relación es todo lo que hace que no la desinstale.',
      paragraphs: [
        'Cualquier product designer sabe que una app con miles de descargas y cero usuarios activos es un fracaso. Lo que importa es la retención: el onboarding que engancha, las notificaciones útiles, la experiencia que mejora con el uso.',
        'La Relación con Clientes es la UX de tu servicio. Define qué tipo de vínculo construyes con cada segmento para conseguirlo, mantenerlo y hacerlo crecer. Y como en cualquier producto digital, no todos los usuarios reciben la misma experiencia: un plan premium tiene soporte dedicado, un plan básico tiene un buen centro de ayuda.',
      ],
      goldenRule:
        'Una agencia que consigue clientes pero no los retiene es un balde con agujeros: por más que llenes, siempre está vacío.',
    },
    fitMap: {
      stepLabel: 'Los 3 objetivos',
      badge: '🎯 Los 3 objetivos de la relación',
      intro: 'Cada objetivo tiene un equivalente en producto digital. Conecta cada uno con lo que hace tu agencia.',
      leftTitle: '📱 Objetivo · equivalente en producto digital',
      rightTitle: '🛠️ Qué hace tu agencia',
      revealLabel: '¿Qué hace tu agencia? Conectar →',
      rows: [
        {
          id: 'captacion',
          icon: '🧲',
          profileLabel: 'Captación',
          profileHint: 'Onboarding',
          profileExample: 'El onboarding de los primeros días.',
          valueLabel: 'Tu agencia',
          valueExample: 'Kickoff estructurado, checklist de accesos y metas acordadas en la primera semana.',
        },
        {
          id: 'fidelizacion',
          icon: '🔁',
          profileLabel: 'Fidelización',
          profileHint: 'Retención',
          profileExample: 'La retención mes a mes (evitar el churn).',
          valueLabel: 'Tu agencia',
          valueExample: 'Reportes claros, reuniones con propósito y avisos antes de que el cliente pregunte.',
        },
        {
          id: 'estimulacion',
          icon: '📈',
          profileLabel: 'Estimulación de ventas',
          profileHint: 'Upgrade',
          profileExample: 'El upgrade al plan superior.',
          valueLabel: 'Tu agencia',
          valueExample: 'Proponer el siguiente sprint o un servicio complementario basado en los resultados.',
        },
      ],
    },
    cards: [
      {
        id: 'asistencia',
        icon: '👤',
        title: 'Asistencia Personal',
        body: 'El cliente habla con personas del equipo, pero no siempre con la misma.',
        example: 'Soporte por email o chat atendido por turnos.',
        tag: 'Ideal para: plan intermedio',
      },
      {
        id: 'dedicada',
        icon: '💎',
        title: 'Asistencia Personal Dedicada',
        body: 'Una persona asignada que conoce el negocio del cliente a fondo.',
        example: 'Un account manager exclusivo para Valentina, con reunión quincenal.',
        tag: 'Ideal para: clientes de alto valor',
      },
      {
        id: 'autoservicio',
        icon: '📚',
        title: 'Autoservicio',
        body: 'Le das las herramientas para que resuelva solo.',
        example: 'Centro de ayuda con tutoriales en video para editar su tienda Shopify.',
        tag: 'Ideal para: plan básico',
      },
      {
        id: 'automatizados',
        icon: '🤖',
        title: 'Servicios Automatizados',
        body: 'Autoservicio personalizado con tecnología.',
        example: 'Reporte semanal automático y alertas cuando la conversión cae.',
        tag: 'Ideal para: todos los planes',
      },
      {
        id: 'comunidades',
        icon: '👥',
        title: 'Comunidades',
        body: 'Conectas a tus clientes entre sí.',
        example: 'Grupo privado de fundadores de ecommerce de moda y un encuentro trimestral.',
        tag: 'Ideal para: fidelizar y generar referidos',
      },
      {
        id: 'cocreacion',
        icon: '🧪',
        title: 'Co-creación',
        body: 'El cliente participa en crear el valor contigo.',
        example: 'Workshops para definir juntos los experimentos del próximo sprint.',
        tag: 'Ideal para: clientes estratégicos',
      },
    ],
    cardsNote:
      'La clave: el nivel de atención debe ser proporcional al valor del cliente. Si le das atención dedicada a un cliente de plan básico, ese cliente te cuesta más de lo que te paga.',
    comparison: [
      {
        situation: 'Nivel de atención',
        novice: 'WhatsApp 24/7 para todos los clientes por igual.',
        pro: 'Cada plan tiene un nivel de servicio claro y definido desde la propuesta.',
      },
      {
        situation: 'Los primeros días',
        novice: 'Firma y empieza a diseñar al día siguiente, sin orden.',
        pro: 'Onboarding de 30 días con kickoff, accesos, metas e hitos.',
      },
      {
        situation: 'Comunicación',
        novice: 'Aparece solo cuando el cliente reclama.',
        pro: 'Es proactiva: avisa del problema antes de que el cliente lo note.',
      },
      {
        situation: 'Cambios fuera del alcance',
        novice: 'Dice que sí a todo para mantener feliz al cliente.',
        pro: 'Agradece, explica el alcance y propone el cambio como un adicional.',
      },
      {
        situation: 'Medición',
        novice: '"Creo que está contento."',
        pro: 'Encuesta de satisfacción trimestral y vigilancia de señales de abandono.',
      },
      {
        situation: 'Crecimiento',
        novice: 'Espera que el cliente pida más.',
        pro: 'Propone el siguiente paso con datos en la reunión de resultados.',
      },
    ],
  },

  /* ─── Fase 2 · Quiz de urgencia (7 × 15 s) ───────────────── */
  quiz: {
    title: 'Quiz de urgencia: 7 preguntas × 15 segundos',
    timeLimitSec: 15,
    correctPoints: 20,
    fastBonus: 10,
    fastWithinSec: 7,
    passThreshold: 5,
    shuffleOptions: true,
    perfectBadgeId: 'cero-churn',
    questions: [
      {
        id: 'q1',
        topic: 'Nivel de atención según el plan',
        prompt:
          'Camila tiene el plan Starter (el más económico) y te pide reuniones semanales, como las que tiene Valentina en su plan premium. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Se las das igual: un cliente feliz es lo más importante.' },
          { id: 'b', text: 'Le ofreces tutoriales, un reporte automático y acceso a la comunidad de clientes, que está incluida en su plan.' },
          { id: 'c', text: 'Le das reuniones semanales, pero de solo 15 minutos, para ahorrar tiempo.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Cada plan tiene su nivel de servicio. Si a todos les das lo máximo, terminas trabajando gratis para tus clientes más pequeños.',
        relatedCardId: 'autoservicio',
      },
      {
        id: 'q2',
        topic: 'Onboarding',
        prompt: 'Tomás acaba de firmar el plan Growth. ¿Cómo empiezas?',
        options: [
          { id: 'a', text: 'Empiezas a diseñar al día siguiente: el cliente quiere ver avances rápido.' },
          { id: 'b', text: 'Haces un onboarding: kickoff, checklist de accesos, metas acordadas y calendario de hitos en la primera semana.' },
          { id: 'c', text: 'Le envías un regalo de bienvenida y un video sobre la historia de tu agencia.' },
        ],
        correctOptionId: 'b',
        explanation: 'El onboarding es la primera pantalla de la relación. Si empieza en desorden, todo lo que viene después cuesta el doble.',
        relatedCardId: 'captacion',
      },
      {
        id: 'q3',
        topic: 'Comunicación proactiva',
        prompt:
          'Una app instalada en la tienda de Valentina tuvo un error y su conversión cayó un 15% esta semana. Ella todavía no se ha dado cuenta. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Esperas a ver si lo nota: a lo mejor se recupera solo.' },
          { id: 'b', text: 'Le avisas tú primero, con el diagnóstico y el plan para solucionarlo.' },
          { id: 'c', text: 'Lo arreglas en silencio, sin contarle, para que no se preocupe.' },
        ],
        correctOptionId: 'b',
        explanation: 'Una mala noticia que das tú, con un plan, genera confianza. La misma noticia descubierta por el cliente la destruye.',
        relatedCardId: 'fidelizacion',
      },
      {
        id: 'q4',
        topic: 'Cambios fuera del alcance',
        prompt:
          'Valentina te escribe: "¿Me puedes hacer un cambio chiquito? Necesito una landing nueva para el Cyber." No está en el contrato. ¿Qué respondes?',
        options: [
          { id: 'a', text: 'La haces gratis para mantenerla contenta.' },
          { id: 'b', text: 'Le agradeces, le explicas que está fuera del alcance actual y le envías una mini propuesta para hacerla como adicional.' },
          { id: 'c', text: 'La haces y se la cobras después en la factura, sin avisarle antes.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Decir que sí a todo no es buen servicio: es enseñarle al cliente que tu trabajo no tiene límites ni valor. Y una sorpresa en la factura rompe cualquier relación.',
        relatedCardId: 'estimulacion',
      },
      {
        id: 'q5',
        topic: 'Señales de abandono',
        prompt: 'Tomás dejó de abrir los reportes y canceló las dos últimas reuniones. Sigue pagando. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Nada: mientras pague, todo está bien.' },
          { id: 'b', text: 'Le propones una llamada corta para revisar cómo va la cuenta, preguntarle qué cambió y reajustar los objetivos.' },
          { id: 'c', text: 'Le ofreces un descuento preventivo para que no se vaya.' },
        ],
        correctOptionId: 'b',
        explanation:
          'El cliente que se va rara vez avisa: primero se desconecta. Detecta la señal y pregunta antes de que llegue el correo de cancelación.',
        relatedCardId: 'fidelizacion',
      },
      {
        id: 'q6',
        topic: 'Comunidades',
        prompt: 'Ya tienes 8 clientes que son ecommerce de moda. ¿Qué haces con ellos?',
        options: [
          { id: 'a', text: 'Los mantienes separados, no vaya a ser que comparen precios entre ellos.' },
          { id: 'b', text: 'Creas un grupo privado y un encuentro trimestral donde comparten aprendizajes.' },
          { id: 'c', text: 'Abres un grupo público en redes para cualquier emprendedor, y así haces crecer la comunidad más rápido.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Una comunidad de clientes del mismo segmento genera fidelidad y referidos. Si la abres a cualquiera, pierde lo que la hacía valiosa.',
        relatedCardId: 'comunidades',
      },
      {
        id: 'q7',
        topic: 'Estimulación de ventas',
        prompt: 'Después de 3 meses, la conversión de Valentina subió un 120%. ¿Cómo propones seguir creciendo juntos?',
        options: [
          { id: 'a', text: 'Esperas a que ella te pida algo más.' },
          {
            id: 'b',
            text: 'En la reunión de resultados, le presentas el siguiente experimento con un dato concreto: "Con emails de recompra podrías sumar un 15% de ventas a clientes actuales."',
          },
          { id: 'c', text: 'Le envías el catálogo completo con todos los servicios de la agencia.' },
        ],
        correctOptionId: 'b',
        explanation:
          'El mejor momento para proponer el siguiente paso es cuando el cliente está viendo los resultados. Una propuesta con dato vende; un catálogo, no.',
        relatedCardId: 'estimulacion',
      },
    ],
  },

  /* ─── Fase 3 · Account Health Monitor ────────────────────── */
  simulation: {
    kind: 'accounts',
    title: 'Account Health Monitor',
    premise:
      'Ya tienes 3 clientes. Ahora el desafío no es conseguir más, sino que ninguno se vaya. Cada mes, sus barras de salud bajan. Tú decides cómo cuidar a cada uno.',
    months: 6,
    hoursPerMonth: 40,
    // Supuesto (no está en el documento): valor de una hora del equipo para la alerta 💸.
    // Con 40 monedas/h, el account manager (12 h) en Camila (fee 400) dispara la alerta, como indica el documento.
    hourValue: 40,
    riskThreshold: 30,
    clients: [
      { id: 'valentina', name: 'Valentina', avatar: '👩', business: 'Cosmética natural', plan: 'Growth Premium', fee: 3000, health: 80, decay: 15, values: 'Atención dedicada y participar en las decisiones.' },
      { id: 'tomas', name: 'Tomás', avatar: '👨', business: 'Marca de calzado', plan: 'Growth', fee: 2000, health: 60, decay: 20, values: 'Datos claros, pocas reuniones. Es muy ocupado.' },
      { id: 'camila', name: 'Camila', avatar: '👩‍🎨', business: 'Joyería artesanal', plan: 'Starter', fee: 400, health: 70, decay: 10, values: 'Aprender a hacerlo ella misma y sentirse acompañada.' },
    ],
    cards: [
      { id: 'am', icon: '💎', name: 'Account manager dedicado', hours: 12, scope: 'client', billing: 'monthly', effects: { valentina: 30, tomas: 10, camila: 25 }, note: 'Cuesta 12 h cada mes que lo asignas.' },
      { id: 'reunion', icon: '📞', name: 'Reunión quincenal de 30 min', hours: 4, scope: 'client', billing: 'monthly', effects: { valentina: 15, tomas: 15, camila: 10 } },
      { id: 'reporte', icon: '🤖', name: 'Reporte automático + alertas', hours: 3, scope: 'client', billing: 'install', effects: { valentina: 5, tomas: 25, camila: 15 }, note: 'Se instala una vez y funciona solo todos los meses.' },
      { id: 'centro', icon: '📚', name: 'Centro de ayuda con tutoriales', hours: 6, scope: 'global', billing: 'install', effects: { valentina: 5, tomas: 5, camila: 20 }, note: 'Una sola vez. Sirve para todos los clientes, todos los meses.' },
      { id: 'comunidad', icon: '👥', name: 'Comunidad de clientes', hours: 5, scope: 'global', billing: 'quarter', effects: { valentina: 10, tomas: 5, camila: 20 }, note: 'Afecta a todos a la vez. Dura un trimestre (3 meses).' },
      { id: 'workshop', icon: '🧪', name: 'Workshop de co-creación', hours: 8, scope: 'client', billing: 'monthly', effects: { valentina: 30, tomas: -5, camila: 10 }, note: 'Tomás: "¿Otra reunión?"' },
      { id: 'onboarding', icon: '🚀', name: 'Onboarding de 30 días', hours: 6, scope: 'client', billing: 'oneshot', effects: { tomas: 30 }, onlyClients: ['tomas'], onlyMonths: [1], bonusPoints: 60, badgeId: 'primera-impresion', note: 'Solo el mes 1, para Tomás, que es nuevo.' },
      { id: 'whatsapp', icon: '💬', name: 'WhatsApp 24/7', hours: 10, scope: 'global', billing: 'monthly', effects: { valentina: 10, tomas: 10, camila: 10 }, energyPerMonth: 15, note: 'Cada mes activo: 🔋 −15% de Energía del Equipo.' },
    ],
    events: [
      {
        month: 1,
        icon: '🚀',
        text: 'Tomás firmó ayer y pregunta cuándo empiezan.',
        options: [
          { id: 'a', text: 'Empezar a diseñar mañana', health: { tomas: -15 }, outcome: 'Tomás se siente perdido: nadie le explicó cómo trabajarán.' },
          { id: 'b', text: 'Activar el onboarding de 30 días', correct: true, health: { tomas: 30 }, usesCard: { card: 'onboarding', client: 'tomas' }, outcome: 'Kickoff, accesos y metas claras: Tomás parte con confianza.' },
          { id: 'c', text: 'Enviarle un regalo de bienvenida', health: { tomas: 5 }, outcome: 'Lindo gesto, pero Tomás sigue sin saber cuándo empiezan.' },
        ],
      },
      {
        month: 2,
        icon: '🐛',
        text: 'Una app falló y la conversión de Valentina bajó un 15%. Ella aún no lo sabe.',
        options: [
          { id: 'a', text: 'Esperar a ver si se recupera', health: { valentina: -30 }, outcome: 'Valentina lo descubrió sola y está furiosa.' },
          { id: 'b', text: 'Avisarle primero, con diagnóstico y plan', correct: true, health: { valentina: 20 }, hours: 2, bonusPoints: 80, badgeId: 'malas-noticias', outcome: 'Avisaste primero: la confianza sube.' },
          {
            id: 'c',
            text: 'Arreglarlo en silencio',
            later: [{ month: 4, client: 'valentina', health: -25, note: 'Valentina descubrió el error que arreglaste en silencio' }],
            outcome: 'Parece que nadie se dio cuenta… por ahora.',
          },
        ],
      },
      {
        month: 3,
        icon: '📅',
        text: 'Camila pide reuniones semanales, como Valentina.',
        options: [
          { id: 'a', text: 'Aceptar', health: { camila: 15 }, hoursDrainFromNow: 8, outcome: 'Camila feliz, pero desde ahora pierdes 8 h cada mes.' },
          { id: 'b', text: 'Invitarla a la comunidad y enviarle los tutoriales', correct: true, health: { camila: 15 }, outcome: 'Camila se siente acompañada, sin costarte horas extra.' },
          { id: 'c', text: 'Ignorar el mensaje', health: { camila: -20 }, outcome: 'Camila se siente abandonada.' },
        ],
      },
      {
        month: 4,
        icon: '👻',
        text: 'Tomás no abre los reportes y canceló dos reuniones.',
        options: [
          { id: 'a', text: 'No hacer nada', health: { tomas: -30 }, outcome: 'Tomás se está desconectando en silencio.' },
          { id: 'b', text: 'Llamada corta de revisión de la cuenta', correct: true, health: { tomas: 25 }, hours: 2, outcome: 'Reajustaron objetivos: Tomás vuelve a enganchar.' },
          { id: 'c', text: 'Ofrecerle un 20% de descuento', health: { tomas: 5 }, feeChange: { client: 'tomas', fee: 1600 }, outcome: 'Tomás acepta el descuento, pero el problema sigue ahí y su fee baja a 1.600.' },
        ],
      },
      {
        month: 5,
        icon: '🛒',
        text: 'Valentina pide "un cambio chiquito": una landing para el Cyber.',
        options: [
          {
            id: 'a',
            text: 'Hacerla gratis',
            hours: 12,
            laterHours: [{ month: 6, hours: 12, note: 'Valentina pide otro "cambio chiquito"' }],
            outcome: '−12 h este mes… y ya aprendió que los cambios son gratis.',
          },
          { id: 'b', text: 'Mini propuesta como adicional', correct: true, oneTimeIncome: 1200, health: { valentina: 5 }, extraSale: 'Landing del Cyber (+1.200)', outcome: 'Valentina acepta: +1.200 de ingreso único.' },
          { id: 'c', text: 'Hacerla y cobrarla sin avisar', health: { valentina: -40 }, outcome: 'Sorpresa en la factura: Valentina se siente engañada.' },
        ],
      },
      {
        month: 6,
        icon: '📊',
        text: 'Reunión de resultados con Valentina: su conversión subió un 120%.',
        options: [
          { id: 'a', text: 'Esperar a que pida más', outcome: 'La reunión termina sin próximos pasos.' },
          {
            id: 'b',
            text: 'Proponer el siguiente experimento con un dato',
            correct: true,
            feeChange: { client: 'valentina', fee: 4000 },
            extraSale: 'Segundo sprint (+1.000/mes)',
            badgeId: 'upgrade-desbloqueado',
            outcome: 'Valentina contrata un segundo sprint: +1.000 de fee mensual.',
          },
          { id: 'c', text: 'Enviarle el catálogo completo', outcome: 'Valentina lo mira por encima y no responde.' },
        ],
      },
    ],
    rewards: { perCorrectEvent: 50, perSafeMonth: 30, proportionalBonus: 100, lostClientPenalty: 150 },
    badges: { proportional: 'servicio-a-la-medida', completion: 'retention-master' },
    success: { minHealth: 60, minEnergy: 50, minExtraSales: 1, minMrr: 6400 },
    collapse: { hint: 'No le des a todos lo mismo. Mira qué valora cada cliente y cuánto paga.' },
  },

  /* ─── Fase 4 · El reto final ─────────────────────────────── */
  build: {
    kind: 'lines',
    title: 'El reto final: diseña el sistema de relación de tu agencia',
    intro: 'Para el segmento principal que definiste en tu media query. Una línea por ítem, máximo 12 palabras cada una.',
    groups: [
      {
        id: 'tipo',
        title: 'Tu tipo de relación',
        lines: [
          {
            id: 'tipo',
            icon: '🏷️',
            label: 'Tipo de relación principal (elige 1 o 2)',
            placeholder: '',
            options: ['Asistencia Personal', 'Asistencia Personal Dedicada', 'Autoservicio', 'Servicios Automatizados', 'Comunidades', 'Co-creación'],
            maxSelect: 2,
          },
        ],
      },
      {
        id: 'sistema',
        title: 'Tu sistema',
        lines: [
          { id: 'captacion', icon: '🧲', label: 'Captación (primeros 30 días)', placeholder: 'Kickoff, checklist de accesos y metas en la semana 1', maxWords: 12 },
          { id: 'fidelizacion', icon: '🔁', label: 'Fidelización (cada mes)', placeholder: 'Reporte automático semanal y reunión quincenal de 30 minutos', maxWords: 12 },
          { id: 'estimulacion', icon: '📈', label: 'Estimulación (cómo creces con él)', placeholder: 'Proponer el siguiente sprint con datos en la reunión trimestral', maxWords: 12 },
          { id: 'senal', icon: '🚨', label: 'Señal de abandono que vas a vigilar', placeholder: 'Deja de abrir los reportes por dos semanas', maxWords: 12 },
        ],
      },
    ],
    checkNote: '🎚️ ¿El nivel de atención que propones es sostenible con lo que este segmento paga? Si no, ajústalo.',
    forbidden: [
      { word: 'atención personalizada', reason: 'Sin decir cómo, no significa nada.' },
      { word: 'excelente servicio', reason: 'Todos lo dicen.' },
      { word: 'siempre disponible', reason: '"Estar siempre disponibles" no es una relación: es burnout programado.' },
    ],
    reference: { blockId: 'customer-segments', label: 'Tu media query de Segmentos' },
  },
} satisfies LevelConfig;
