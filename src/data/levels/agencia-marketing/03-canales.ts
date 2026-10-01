import type { LevelConfig } from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * BLOQUE · Canales
 * Perfil: Agencia de Marketing Digital y Diseño Web
 * Viene de: Propuesta de Valor · Desbloquea: Relación con Clientes
 * Fuente: canales-agencia-marketing-digital.md
 * ────────────────────────────────────────────────────────────── */

export const agenciaCanales = {
  id: 'agencia-marketing/channels',
  businessId: 'agencia-marketing',
  blockId: 'channels',
  title: 'Canales',
  subtitle: 'Puedes tener la mejor página del sitio, pero si no hay menú, enlaces ni rutas, nadie llega a ella.',

  /* ─── Fase 1 · Micro-learning ────────────────────────────── */
  theory: {
    title: 'Micro-learning: el user flow de tu cliente',
    concept: {
      headline: 'Puedes tener la mejor página del sitio, pero si no hay menú, enlaces ni rutas, nadie llega a ella.',
      paragraphs: [
        'Tu propuesta de valor es esa página brillante. Los Canales son el user flow completo que lleva al cliente hasta ella y más allá: cómo te descubre, cómo te evalúa, cómo te compra, cómo recibe tu trabajo y qué pasa después de la entrega.',
        'Cada fase del recorrido necesita una ruta que funcione. Si una se rompe, el cliente se encuentra con un 404 y abandona el viaje, aunque tu propuesta sea perfecta.',
      ],
      goldenRule:
        'Los canales no son "estar en redes sociales". Son todas las rutas por las que tu valor viaja desde tu agencia hasta tu cliente, ida y vuelta.',
    },
    phases: {
      intro: 'Piensa en esto como el user flow de tu cliente ideal. Cada fase es una pantalla que debe llevar a la siguiente.',
      items: [
        {
          id: 'fase-conocimiento',
          icon: '1️⃣',
          label: 'Conocimiento',
          question: '¿Cómo se entera de que existes?',
          example: 'Casos con métricas en el LinkedIn del fundador, newsletter de ecommerce de moda.',
          fail: 'Nadie de tu segmento te ha visto nunca.',
        },
        {
          id: 'fase-evaluacion',
          icon: '2️⃣',
          label: 'Evaluación',
          question: '¿Cómo decide si eres la agencia correcta?',
          example: 'Página de casos de estudio y auditoría de conversión gratuita de 20 minutos.',
          fail: 'Llega a tu web y solo ve un portafolio de shots bonitos.',
        },
        {
          id: 'fase-compra',
          icon: '3️⃣',
          label: 'Compra',
          question: '¿Qué tan fácil es contratarte?',
          example: 'Propuesta digital con firma electrónica y pago en línea en el mismo enlace.',
          fail: 'Un PDF por WhatsApp, tres correos de ida y vuelta y una transferencia que nunca llega.',
        },
        {
          id: 'fase-entrega',
          icon: '4️⃣',
          label: 'Entrega',
          question: '¿Cómo recibe tu trabajo?',
          example: 'Dashboard compartido, reporte semanal y reunión quincenal de 30 minutos.',
          fail: 'Avances perdidos en chats y archivos sin orden.',
        },
        {
          id: 'fase-postventa',
          icon: '5️⃣',
          label: 'Postventa',
          question: '¿Qué pasa después de entregar?',
          example: 'Reunión de resultados, propuesta del siguiente sprint y programa de referidos.',
          fail: '"Entregamos y chao": el cliente nunca vuelve ni te recomienda.',
        },
      ],
    },
    cards: [
      {
        id: 'propios',
        icon: '🏠',
        title: 'Propios',
        body: 'Canales que controlas tú. Tardan en crecer, pero no dependen de nadie.',
        example: 'Tu web, tu blog con SEO, tu newsletter, el LinkedIn del fundador.',
      },
      {
        id: 'socios',
        icon: '🤝',
        title: 'De Socios',
        body: 'Otros que ya tienen la confianza de tu segmento y te recomiendan.',
        example: 'Programas de partners de apps para Shopify, agencias más grandes que te subcontratan white-label.',
      },
      {
        id: 'pagados',
        icon: '💳',
        title: 'Pagados',
        body: 'Compras atención. Rápido de activar, pero se apaga cuando dejas de pagar.',
        example: 'Campañas en Meta o Google dirigidas a la auditoría gratuita.',
      },
      {
        id: 'ganados',
        icon: '🗣️',
        title: 'Ganados',
        body: 'Otros hablan de ti sin que pagues.',
        example: 'Charlas en eventos de ecommerce, entrevistas en podcasts, clientes que te recomiendan.',
      },
      {
        id: 'inbound',
        icon: '🎣',
        title: 'Inbound vs. Outbound',
        body: 'El cliente te busca a ti (inbound) o tú lo buscas a él (outbound).',
        example:
          'Inbound: newsletter y SEO. Outbound: mensaje personalizado a 10 tiendas del segmento con una mini auditoría de su checkout.',
      },
      {
        id: 'entrega',
        icon: '📦',
        title: 'Canales de Entrega',
        body: 'La ruta por la que entregas tu valor, no solo por la que vendes. Casi todas las agencias la olvidan.',
        example: 'Portal del cliente, dashboard en vivo, reportes automáticos.',
      },
    ],
    comparison: [
      {
        situation: 'Dónde estar',
        novice: '"Hay que estar en todas las redes."',
        pro: 'Está en 2 o 3 canales donde realmente vive su segmento.',
      },
      {
        situation: 'A quién le habla',
        novice: 'Sube shots a Dribbble que solo ven otros diseñadores.',
        pro: 'Publica casos con métricas donde están los dueños de ecommerce.',
      },
      {
        situation: 'Fuente de clientes',
        novice: 'Depende 100% del boca a boca. Si se corta, no hay ventas.',
        pro: 'Combina canales propios, de socios y referidos para tener un flujo predecible.',
      },
      { situation: 'Qué mide', novice: 'Likes y seguidores.', pro: 'Leads calificados por mes y costo de adquirir un cliente.' },
      {
        situation: 'Entrega',
        novice: 'WhatsApp a cualquier hora, archivos desordenados.',
        pro: 'Un portal o dashboard con todo el avance visible.',
      },
      {
        situation: 'Postventa',
        novice: 'Termina el proyecto y empieza a buscar al siguiente cliente desde cero.',
        pro: 'Cada proyecto terminado genera un testimonio, un referido o un nuevo sprint.',
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
    perfectBadgeId: 'cero-404',
    questions: [
      {
        id: 'q1',
        topic: 'Dónde vive tu segmento',
        prompt: 'Tus clientes ideales son fundadores de ecommerce de moda. ¿Dónde inviertes tus primeras horas de marketing?',
        options: [
          { id: 'a', text: 'Subiendo shots de diseño a Dribbble y Behance.' },
          { id: 'b', text: 'Publicando casos con métricas en LinkedIn y en comunidades de dueños de tiendas online.' },
          { id: 'c', text: 'Publicando el mismo post en Instagram, TikTok, X, LinkedIn y Pinterest para tener el máximo alcance.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Dribbble te aplauden tus colegas, no tus clientes. Y estar en todas partes con el mismo mensaje es no estar en ninguna.',
        relatedCardId: 'fase-conocimiento',
      },
      {
        id: 'q2',
        topic: 'Canal de socios',
        prompt: 'Una app de email marketing para Shopify tiene un programa de agencias partner que les refiere clientes. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Lo ignoras: no necesitas intermediarios para conseguir clientes.' },
          { id: 'b', text: 'Postulas y te certificas: esa app ya tiene la confianza de tu segmento.' },
          { id: 'c', text: 'Te inscribes en 10 programas de partners de todo tipo para multiplicar tu exposición.' },
        ],
        correctOptionId: 'b',
        explanation: 'Un buen socio te presta su confianza con tu segmento exacto. Diez socios al azar te piden tiempo y no te traen a nadie.',
        relatedCardId: 'socios',
      },
      {
        id: 'q3',
        topic: 'Fase de evaluación',
        prompt: 'Muchos visitantes del segmento llegan a tu web, pero casi nadie agenda una reunión. ¿Qué cambias?',
        options: [
          { id: 'a', text: 'Le agregas más animaciones y efectos al home para impresionar.' },
          { id: 'b', text: 'Sumas casos de estudio con métricas y una auditoría gratuita de 20 minutos para evaluar sin riesgo.' },
          { id: 'c', text: 'Pones un pop-up con un 30% de descuento para quien contrate hoy.' },
        ],
        correctOptionId: 'b',
        explanation: 'En la evaluación el cliente necesita pruebas y un primer paso fácil, no fuegos artificiales ni rebajas.',
        relatedCardId: 'fase-evaluacion',
      },
      {
        id: 'q4',
        topic: 'Fase de compra',
        prompt: 'Valentina ya dijo que sí. ¿Cómo cierras la contratación?',
        options: [
          { id: 'a', text: 'Le mandas un PDF por WhatsApp y esperas a que transfiera.' },
          { id: 'b', text: 'Le envías una propuesta digital con el alcance, firma electrónica y el primer pago en el mismo enlace.' },
          { id: 'c', text: 'Le pides que venga a la oficina a firmar en persona para crear una relación más cercana.' },
        ],
        correctOptionId: 'b',
        explanation:
          "Cada paso extra entre el 'sí' y el pago es una oportunidad de arrepentirse. Diseña la compra como diseñas un checkout.",
        relatedCardId: 'fase-compra',
      },
      {
        id: 'q5',
        topic: 'Fase de entrega',
        prompt: 'A mitad del proyecto, el cliente te escribe a cada rato: "¿Cómo vamos?" ¿Qué haces?',
        options: [
          { id: 'a', text: 'Le respondes por WhatsApp a cualquier hora para que se sienta atendido.' },
          { id: 'b', text: 'Le das acceso a un dashboard compartido, le envías un reporte semanal y fijan una reunión quincenal.' },
          { id: 'c', text: 'Lo llamas todos los días para mostrarle cercanía.' },
        ],
        correctOptionId: 'b',
        explanation:
          "Si el cliente pregunta '¿cómo vamos?', tu canal de entrega no le está mostrando el avance. Hazlo visible y recuperas tus horas.",
        relatedCardId: 'fase-entrega',
      },
      {
        id: 'q6',
        topic: 'Fase de postventa',
        prompt: 'El proyecto con Valentina terminó y su conversión subió un 120%. ¿Qué haces ahora?',
        options: [
          { id: 'a', text: 'Cierras el proyecto y te pones a buscar el siguiente cliente.' },
          { id: 'b', text: 'Haces una reunión de resultados, le propones el siguiente sprint y le pides un testimonio y un referido.' },
          { id: 'c', text: 'Le envías un regalo caro de agradecimiento y nada más, para no parecer interesado.' },
        ],
        correctOptionId: 'b',
        explanation:
          'El cliente más fácil de conseguir es el que ya tienes. Un proyecto exitoso sin postventa es un canal que cierras tú mismo.',
        relatedCardId: 'fase-postventa',
      },
      {
        id: 'q7',
        topic: 'Canal pagado',
        prompt: 'Tienes un presupuesto pequeño para tu primera campaña pagada. ¿Dónde lo pones?',
        options: [
          { id: 'a', text: 'Promocionas posts de Instagram con tu portafolio.' },
          { id: 'b', text: 'Haces una campaña dirigida a tu segmento que lleva a la auditoría gratuita, y mides el costo por lead calificado.' },
          { id: 'c', text: 'Compras en Google la palabra clave "agencia de marketing digital".' },
        ],
        correctOptionId: 'b',
        explanation:
          'Una palabra clave genérica es cara y atrae a cualquiera. Paga por llegar a tu segmento con una oferta concreta, y mide.',
        relatedCardId: 'pagados',
      },
    ],
  },

  /* ─── Fase 3 · Journey Board ─────────────────────────────── */
  simulation: {
    kind: 'journey',
    title: 'Journey Board',
    premise:
      'Valentina está feliz, pero tu agencia necesita 8 clientes como ella en los próximos 3 meses. Diseña el recorrido que los traerá, los convencerá y los hará volver.',
    goalClients: 8,
    swipeCards: [
      { id: 'c1', text: 'Casos con métricas en el LinkedIn del fundador', fits: true, why: 'Es donde están los dueños de ecommerce.' },
      { id: 'c2', text: 'Shots de diseño en Dribbble y Behance', fits: false, why: 'Audiencia de diseñadores, no de clientes.' },
      { id: 'c3', text: 'Programa de partners de una app de email para Shopify', fits: true, why: 'Socio con la confianza del segmento.' },
      {
        id: 'c4',
        text: 'Comprar una base de 5.000 correos y enviar campañas masivas',
        fits: false,
        trap: true,
        why: 'Carta trampa: daña tu reputación y puede ser ilegal.',
      },
      { id: 'c5', text: 'Newsletter "Ecommerce de moda que vende"', fits: true, why: 'Canal propio que educa y atrae a tu segmento.' },
      { id: 'c6', text: 'Hacer trends de baile en el TikTok de la agencia', fits: false, why: 'Entretiene, pero no le habla a quien te contrata.' },
      { id: 'c7', text: 'Auditoría de conversión gratuita de 20 minutos', fits: true, why: 'Primer paso de bajo riesgo para evaluar.' },
      { id: 'c8', text: 'Stand en una feria de emprendedores de moda', fits: true, why: 'Tu segmento está ahí en persona.' },
      {
        id: 'c9',
        text: 'Google Ads con la palabra clave "diseño web barato"',
        fits: false,
        trap: true,
        why: 'Carta trampa: atrae al segmento equivocado.',
      },
      { id: 'c10', text: 'Programa de referidos para clientes actuales', fits: true, why: 'Convierte la postventa en adquisición.' },
    ],
    phases: [
      { id: 'conocimiento', icon: '1️⃣', label: 'Conocimiento' },
      { id: 'evaluacion', icon: '2️⃣', label: 'Evaluación' },
      { id: 'compra', icon: '3️⃣', label: 'Compra' },
      { id: 'entrega', icon: '4️⃣', label: 'Entrega' },
      { id: 'postventa', icon: '5️⃣', label: 'Postventa' },
    ],
    // Costos de las cartas buenas, débiles y de proceso: tabla del documento.
    // Alcance/tasas: calibrados para que la configuración óptima dé 100 → 30 → 8 → 8 → 3 referidos + 4 sprints.
    // Las 4 cartas "no sirve" (b-dribbble, b-base, b-tiktok, b-gads) no están en el tablero del documento:
    // aparecen solo si el jugador las aprueba en el swipe, con costos y alcance definidos aquí.
    boardCards: [
      { id: 'b-linkedin', swipeId: 'c1', phaseId: 'conocimiento', text: 'Casos en el LinkedIn del fundador', coins: 0, hours: 10, quality: 'good', reach: 40, qualified: true, role: 'linkedin' },
      { id: 'b-partners', swipeId: 'c3', phaseId: 'conocimiento', text: 'Programa de partners de la app de email', coins: 0, hours: 5, quality: 'good', reach: 25, qualified: true, role: 'partners' },
      { id: 'b-newsletter', swipeId: 'c5', phaseId: 'conocimiento', text: 'Newsletter "Ecommerce de moda que vende"', coins: 100, hours: 8, quality: 'good', reach: 35, qualified: true },
      { id: 'b-feria', swipeId: 'c8', phaseId: 'conocimiento', text: 'Stand en feria de emprendedores de moda', coins: 1200, hours: 12, quality: 'balanced', reach: 45, qualified: true },
      { id: 'b-dribbble', swipeId: 'c2', phaseId: 'conocimiento', text: 'Shots en Dribbble y Behance', coins: 0, hours: 8, quality: 'useless', reach: 3, qualified: false },
      { id: 'b-base', swipeId: 'c4', phaseId: 'conocimiento', text: 'Base de 5.000 correos comprada', coins: 300, hours: 4, quality: 'trap', reach: 10, qualified: false },
      { id: 'b-tiktok', swipeId: 'c6', phaseId: 'conocimiento', text: 'Trends de baile en TikTok', coins: 0, hours: 12, quality: 'useless', reach: 6, qualified: false },
      { id: 'b-gads', swipeId: 'c9', phaseId: 'conocimiento', text: 'Google Ads "diseño web barato"', coins: 600, hours: 3, quality: 'trap', reach: 15, qualified: false },
      { id: 'b-auditoria', swipeId: 'c7', phaseId: 'evaluacion', text: 'Auditoría de conversión gratuita', coins: 0, hours: 10, quality: 'good', rate: 0.2 },
      { id: 'b-casos', phaseId: 'evaluacion', text: 'Página de casos de estudio con métricas', coins: 0, hours: 6, quality: 'good', rate: 0.1 },
      { id: 'b-propuesta', phaseId: 'compra', text: 'Propuesta digital + firma electrónica + pago en línea', coins: 50, hours: 2, quality: 'good', rate: 0.2 },
      { id: 'b-pdf', phaseId: 'compra', text: 'PDF por WhatsApp y transferencia manual', coins: 0, hours: 1, quality: 'weak', rate: 0.2 },
      { id: 'b-dashboard', phaseId: 'entrega', text: 'Dashboard compartido + reporte semanal + reunión quincenal', coins: 80, hours: 8, quality: 'good', role: 'dashboard' },
      { id: 'b-whatsapp', phaseId: 'entrega', text: 'WhatsApp a cualquier hora', coins: 0, hours: 20, quality: 'weak', role: 'whatsapp' },
      { id: 'b-reunion', phaseId: 'postventa', text: 'Reunión de resultados + propuesta del siguiente sprint', coins: 0, hours: 4, quality: 'good', role: 'results-meeting' },
      { id: 'b-referidos', swipeId: 'c10', phaseId: 'postventa', text: 'Programa de referidos', coins: 200, hours: 4, quality: 'good', role: 'referrals' },
    ],
    resources: { coins: 1500, hours: 60 },
    simulation: {
      months: 3,
      leadsLabel: 'leads potenciales',
      weakLeadLossPct: 30,
      weakHoursPenaltyPct: 15,
      linkedinDropPct: 50,
      partnerSigned: 2,
      urgentReportHours: 10,
      valentinaClients: 1,
      secondSprintRate: 0.5,
      referralRate: 0.375,
    },
    rewards: {
      perSwipe: 30,
      perTrapDiscarded: 60,
      noGaps: 100,
      multiAwareness: 80,
      perLeftover: 5,
      coinsPerClient: 500,
      perReferral: 200,
    },
    badges: {
      traps: 'reputacion-intacta',
      noGaps: 'user-flow-completo',
      multiAwareness: 'a-prueba-de-algoritmos',
      completion: 'growth-architect',
    },
    success: { minClients: 8, minAwarenessChannels: 2 },
    collapse: {
      minClients: 4,
      hint: 'Revisa qué columna está vacía o tiene una grieta. El cliente no puede saltarse una fase.',
    },
  },

  /* ─── Fase 4 · El reto final ─────────────────────────────── */
  build: {
    kind: 'lines',
    title: 'El reto final: dibuja el user flow de tu agencia',
    intro: 'Escribe 1 canal concreto por fase (máximo 8 palabras por línea).',
    groups: [
      {
        id: 'flow',
        title: 'Tu user flow',
        lines: [
          { id: 'conocimiento', icon: '1️⃣', label: 'Conocimiento', placeholder: 'Casos con métricas en LinkedIn del fundador', maxWords: 8 },
          { id: 'evaluacion', icon: '2️⃣', label: 'Evaluación', placeholder: 'Auditoría de conversión gratis de 20 minutos', maxWords: 8 },
          { id: 'compra', icon: '3️⃣', label: 'Compra', placeholder: 'Propuesta digital con firma y pago en línea', maxWords: 8 },
          { id: 'entrega', icon: '4️⃣', label: 'Entrega', placeholder: 'Dashboard compartido y reporte semanal', maxWords: 8 },
          { id: 'postventa', icon: '5️⃣', label: 'Postventa', placeholder: 'Reunión de resultados y programa de referidos', maxWords: 8 },
        ],
      },
      {
        id: 'focus',
        title: 'Tu foco',
        lines: [
          { id: 'principal', icon: '⭐', label: 'Mi canal principal para conseguir clientes es', placeholder: 'Programa de partners de apps Shopify', maxWords: 8 },
          { id: 'metrica', icon: '📏', label: 'Lo voy a medir con', placeholder: 'Leads calificados por mes', maxWords: 8 },
        ],
      },
    ],
    checkNote: '¿Cada canal está donde vive el segmento que definiste en tu media query? Si no, es un 404.',
    forbidden: [
      { word: 'redes sociales', reason: 'Nombra la red exacta y qué publicas.' },
      { word: 'boca a boca', reason: 'Si no tiene un sistema detrás, no es un canal: es suerte.' },
    ],
    reference: { blockId: 'customer-segments', label: 'Tu media query de Segmentos' },
  },
} satisfies LevelConfig;
