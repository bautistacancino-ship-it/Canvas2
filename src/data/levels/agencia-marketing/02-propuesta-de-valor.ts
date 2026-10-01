import type { LevelConfig } from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * BLOQUE · Propuesta de Valor
 * Perfil: Agencia de Marketing Digital y Diseño Web
 * Viene de: Segmentos de Clientes · Desbloquea: Canales
 * Fuente: propuesta-de-valor-agencia-marketing-digital.md
 * ────────────────────────────────────────────────────────────── */

const FORMULA_PARTS = [
  'Ayudamos a ',
  { id: 'segmento', label: 'tu segmento', placeholder: 'ecommerce de moda en Shopify' },
  ' a ',
  { id: 'resultado', label: 'resultado medible', placeholder: 'duplicar su conversión en 90 días' },
  ' sin ',
  { id: 'dolor', label: 'su dolor principal', placeholder: 'subir su inversión en ads' },
  ', gracias a ',
  { id: 'metodo', label: 'tu método o diferenciador', placeholder: 'sprints de optimización basados en datos' },
  '.',
];

export const agenciaPropuestaDeValor = {
  id: 'agencia-marketing/value-propositions',
  businessId: 'agencia-marketing',
  blockId: 'value-propositions',
  title: 'Propuesta de Valor',
  subtitle: 'Tienes 5 segundos above the fold. Si el visitante no entiende qué gana, rebota.',

  /* ─── Fase 1 · Micro-learning ────────────────────────────── */
  theory: {
    title: 'Micro-learning: tu propuesta es tu above the fold',
    concept: {
      headline: 'Tienes 5 segundos above the fold. Si en ese tiempo el visitante no entiende qué gana, rebota.',
      paragraphs: [
        'Lo sabes mejor que nadie: el hero section de una landing no está para mostrar lo que la empresa hace, sino para responder la única pregunta que tiene el visitante: "¿Y yo qué gano?"',
        'La Propuesta de Valor es el above the fold de tu agencia. Es el conjunto de beneficios que hace que tu segmento te elija a ti y no a otra agencia. No describe tus servicios: describe el problema que resuelves y el resultado que entregas.',
        'Y funciona como un componente en un design system: tiene que encajar exacto en el lugar donde va. Una propuesta brillante para el segmento equivocado es un botón precioso que nadie presiona.',
      ],
      goldenRule: 'Tu cliente no compra una web. Compra lo que la web le permite lograr.',
    },
    fitMap: {
      intro:
        'La propuesta de valor se construye conectando dos lados. A la izquierda está tu cliente (lo que ya descubriste en Segmentos). A la derecha, lo que tu agencia ofrece.',
      exampleClient: 'Ecommerce de moda en Shopify',
      rows: [
        {
          icon: '🎯',
          profileLabel: 'Trabajos',
          profileHint: 'Lo que intenta lograr',
          profileExample: 'Vender más online sin contratar un equipo interno.',
          valueLabel: 'Productos y Servicios',
          valueExample: 'Plan Growth de 3 meses con fee mensual.',
        },
        {
          icon: '😖',
          profileLabel: 'Dolores',
          profileHint: 'Lo que le molesta o frena',
          profileExample: 'El 78% abandona el carrito. Gasta en ads sin saber qué funciona.',
          valueLabel: 'Aliviadores de Dolor',
          valueExample: 'Rediseño del checkout. Dashboard semanal de conversión.',
        },
        {
          icon: '😊',
          profileLabel: 'Alegrías',
          profileHint: 'Lo que sueña obtener',
          profileExample: 'Ver subir las ventas sin trabajar más horas.',
          valueLabel: 'Creadores de Alegría',
          valueExample: 'Emails automáticos de carrito abandonado que venden solos.',
        },
      ],
      note: 'Fit = cada dolor importante tiene un aliviador y cada alegría clave tiene un creador. Si un servicio tuyo no conecta con nada del lado izquierdo, es decoración.',
    },
    cards: [
      {
        id: 'desempeno',
        icon: '📈',
        title: 'Desempeño',
        body: 'Mejoras un resultado medible.',
        example: '"Subimos tu tasa de conversión del 0,9% al 2% en 90 días."',
      },
      {
        id: 'costos',
        icon: '💸',
        title: 'Reducción de Costos',
        body: 'El cliente gasta menos para lograr lo mismo.',
        example: '"Bajamos tu costo por venta optimizando la landing, no subiendo el presupuesto de ads."',
      },
      {
        id: 'riesgo',
        icon: '🛡️',
        title: 'Reducción de Riesgo',
        body: 'Le quitas el miedo a equivocarse contigo.',
        example: 'Pagos por hito, metas por contrato y reportes cada semana.',
      },
      {
        id: 'personalizacion',
        icon: '🎯',
        title: 'Personalización',
        body: 'Lo adaptas a su caso, no le entregas una plantilla.',
        example: 'Estrategia basada en el catálogo y los datos de su tienda, no un "pack" genérico.',
      },
      {
        id: 'comodidad',
        icon: '🛋️',
        title: 'Comodidad',
        body: 'Le haces la vida más fácil.',
        example: 'Un solo equipo para web, campañas y email. Reuniones de 30 minutos, no de 2 horas.',
      },
      {
        id: 'diseno',
        icon: '🎨',
        title: 'Diseño',
        body: 'La estética como herramienta, no como fin.',
        example: 'Un design system que hace que su marca se vea a la altura de las grandes y genere confianza para comprar.',
      },
      {
        id: 'precio',
        icon: '🏷️',
        title: 'Precio ⚠️',
        body: 'Competir por ser el más barato.',
        example:
          'Tarjeta trampa: para una agencia de servicios, es la guerra que siempre pierdes. Úsala solo si tu modelo es de volumen.',
        trap: true,
      },
    ],
    formula: {
      parts: FORMULA_PARTS,
      example: {
        segmento: 'ecommerce de moda en Shopify',
        resultado: 'duplicar su conversión en 90 días',
        dolor: 'subir su inversión en ads',
        metodo: 'sprints de optimización basados en datos',
      },
    },
    comparison: [
      {
        situation: 'El mensaje',
        novice: '"Hacemos webs creativas, modernas y responsive."',
        pro: '"Convertimos el tráfico que ya pagas en ventas."',
      },
      {
        situation: 'Habla de...',
        novice: 'Sus herramientas: Figma, Webflow, IA, las últimas tendencias.',
        pro: 'El resultado del cliente: más ventas, menos abandono, menos costo por venta.',
      },
      {
        situation: 'El diferenciador',
        novice: '"Somos un equipo joven y apasionado."',
        pro: 'Un método propio, un nicho dominado y casos con métricas.',
      },
      { situation: 'Ante la competencia', novice: 'Baja el precio.', pro: 'Sube la especificidad.' },
      {
        situation: 'Cantidad de promesas',
        novice: 'Promete todo: web, redes, branding, SEO, video.',
        pro: 'Ataca 1 o 2 dolores críticos y los resuelve de forma brillante.',
      },
      {
        situation: 'Prueba',
        novice: '"Confía en nosotros."',
        pro: 'Testimonio con número, meta por contrato y pagos por hito.',
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
    perfectBadgeId: 'above-the-fold',
    questions: [
      {
        id: 'q1',
        topic: 'El titular del hero',
        prompt: 'Estás rediseñando la web de tu agencia. ¿Qué titular va above the fold?',
        options: [
          { id: 'a', text: '"Diseño web creativo, moderno y 100% responsive."' },
          { id: 'b', text: '"Más ventas para tu tienda Shopify de moda, con el tráfico que ya pagas."' },
          { id: 'c', text: '"La agencia digital con los precios más bajos del mercado."' },
        ],
        correctOptionId: 'b',
        explanation:
          'Responsive es el mínimo, no un beneficio. Y ser el más barato no es una propuesta: es una carrera hacia el fondo.',
        relatedCardId: 'precio',
      },
      {
        id: 'q2',
        topic: 'Características vs. beneficios',
        prompt: 'Valentina te pregunta: "¿Por qué debería elegirlos a ustedes?" ¿Qué respondes?',
        options: [
          { id: 'a', text: '"Trabajamos con Figma, Webflow y las herramientas más avanzadas."' },
          { id: 'b', text: '"Tus clientes van a llegar al pago en 2 clics menos. Eso significa menos carritos abandonados."' },
          { id: 'c', text: '"Somos un equipo joven, creativo y muy apasionado por lo que hacemos."' },
        ],
        correctOptionId: 'b',
        explanation: 'Tus herramientas y tu pasión son tuyas. El beneficio es de ella. Vende lo que ella gana.',
        relatedCardId: 'desempeno',
      },
      {
        id: 'q3',
        topic: 'Qué dolor atacar',
        prompt:
          'En la reunión de descubrimiento, el cliente menciona 3 problemas: su logo se ve anticuado, el 78% abandona el carrito y su Instagram está poco activo. ¿Dónde pones el foco de tu propuesta?',
        options: [
          { id: 'a', text: 'En el logo: es lo más visible y lo que mejor sabes hacer.' },
          { id: 'b', text: 'En el abandono del carrito: es el dolor que le está costando dinero hoy.' },
          { id: 'c', text: 'En los 3 a la vez, con un "Pack Integral 360°".' },
        ],
        correctOptionId: 'b',
        explanation: 'Ataca el dolor que más dinero le cuesta. Resolver uno de forma brillante vale más que tocar tres a medias.',
        relatedCardId: 'desempeno',
      },
      {
        id: 'q4',
        topic: 'Reducción de riesgo',
        prompt: 'El cliente te dice: "Ya me quemé con dos agencias que cobraron y desaparecieron." ¿Qué le ofreces?',
        options: [
          { id: 'a', text: '"Tranquilo, nosotros no somos así. Confía en nosotros."' },
          { id: 'b', text: 'Pagos por hito, un reporte semanal y una meta de conversión escrita en el contrato.' },
          { id: 'c', text: 'Un mes completamente gratis para que pruebe sin compromiso.' },
        ],
        correctOptionId: 'b',
        explanation:
          'La confianza no se pide, se diseña. El trabajo gratis no elimina el riesgo: solo le baja el valor a tu trabajo.',
        relatedCardId: 'riesgo',
      },
      {
        id: 'q5',
        topic: 'Diferenciarse de la competencia',
        prompt: 'Un cliente potencial te dice que otra agencia le ofrece "lo mismo" por un 30% menos. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Igualas el precio para no perder el proyecto.' },
          {
            id: 'b',
            text: 'Le muestras lo que la otra agencia no tiene: tu especialización en su rubro, tus casos con métricas y tu método por sprints.',
          },
          { id: 'c', text: 'Mantienes el precio, pero le sumas gratis la gestión de redes y un rediseño de logo.' },
        ],
        correctOptionId: 'b',
        explanation: 'Si el cliente cree que es "lo mismo", tu propuesta no está clara. Sube la especificidad, no el regalo.',
        relatedCardId: 'personalizacion',
      },
      {
        id: 'q6',
        topic: 'El servicio que amas vs. el que necesitan',
        prompt:
          'A tu equipo le encanta hacer animaciones 3D de producto, pero tu segmento necesita, sobre todo, mejorar su conversión. ¿Qué haces con ese servicio?',
        options: [
          { id: 'a', text: 'Lo pones al centro de la propuesta: es lo que los diferencia y lo hacen increíble.' },
          {
            id: 'b',
            text: 'Lo dejas como complemento opcional, solo cuando ayude a convertir (por ejemplo, en la ficha de producto).',
          },
          { id: 'c', text: 'Rediriges toda la agencia hacia el 3D porque es tendencia.' },
        ],
        correctOptionId: 'b',
        explanation: 'Un servicio que no conecta con un dolor del cliente es decoración. El Fit manda, no tus gustos.',
        relatedCardId: 'diseno',
      },
      {
        id: 'q7',
        topic: 'Escribir la propuesta en el Canvas',
        prompt: '¿Cuál de estas frases es una propuesta de valor bien escrita?',
        options: [
          { id: 'a', text: '"Hacemos webs increíbles con mucha pasión y dedicación."' },
          {
            id: 'b',
            text: '"Ayudamos a ecommerce de moda en Shopify a duplicar su conversión en 90 días sin subir su inversión en ads."',
          },
          { id: 'c', text: '"Soluciones digitales integrales 360° de alta calidad e innovación."' },
        ],
        correctOptionId: 'b',
        explanation: 'Si tu propuesta podría estar en la web de cualquier otra agencia, no es una propuesta: es relleno.',
        relatedCardId: 'desempeno',
      },
    ],
  },

  /* ─── Fase 3 · Fit Lab ───────────────────────────────────── */
  simulation: {
    kind: 'fit-lab',
    title: 'Fit Lab',
    premise:
      'Valentina (tu Cliente Ideal del bloque anterior) firmó. Antes de empezar, quiere ver cómo vas a presentar tu propuesta en la landing de tu agencia, para mostrársela a su socio. Primero tienes que entender su Fit.',
    clientName: 'Valentina',
    initial: { hours: 100, budget: 10000 },
    needs: [
      { id: 'n1', type: 'dolor', text: 'El 78% abandona el carrito.', serviceId: 's1' },
      { id: 'n2', type: 'dolor', text: 'Gasto en ads y no sé qué funciona.', serviceId: 's2' },
      { id: 'n3', type: 'dolor', text: 'Las agencias anteriores desaparecían después de cobrar.', serviceId: 's3' },
      { id: 'n4', type: 'dolor', text: 'Las fotos no muestran la textura de mis cremas.', serviceId: 's4' },
      { id: 'n5', type: 'alegria', text: 'Ver subir las ventas sin trabajar más horas.', serviceId: 's5' },
      { id: 'n6', type: 'alegria', text: 'Que mi marca se vea a la altura de las grandes.', serviceId: 's6' },
      { id: 'n7', type: 'trabajo', text: 'Vender más online sin contratar un equipo interno.', serviceId: 's7' },
    ],
    services: [
      { id: 's1', text: 'Rediseño del checkout en 3 pasos' },
      { id: 's2', text: 'Dashboard semanal de conversión y retorno por campaña' },
      { id: 's3', text: 'Pagos por hito + reunión quincenal de 30 minutos' },
      { id: 's4', text: 'Fichas de producto con video corto y zoom' },
      { id: 's5', text: 'Emails automáticos de carrito abandonado' },
      { id: 's6', text: 'Design system de tienda alineado a su marca' },
      { id: 's7', text: 'Plan Growth: equipo externo con fee mensual' },
      { id: 't1', text: 'Animaciones parallax en el home', trap: true },
      { id: 't2', text: 'Rediseño completo del logo', trap: true },
      { id: 't3', text: 'Publicación diaria en TikTok', trap: true },
      { id: 't4', text: 'Migración de Shopify a una plataforma hecha a medida', trap: true },
    ],
    // El documento define reacciones para h1/h3, p1, c1 y v1. Las de u1, u3, p3, c3 y v3 se agregaron
    // para que toda opción incorrecta tenga su reacción en el test de 5 segundos.
    slots: [
      {
        id: 'headline',
        label: 'Titular',
        options: [
          { id: 'h1', text: 'Diseño web creativo y moderno', reaction: '¿Qué hacen exactamente? No entendí.' },
          { id: 'h2', text: 'Más ventas para tu Shopify de moda, con el tráfico que ya pagas', correct: true },
          { id: 'h3', text: 'Somos la agencia #1 en innovación digital', reaction: '¿Qué hacen exactamente? No entendí.' },
        ],
      },
      {
        id: 'subtitle',
        label: 'Subtítulo',
        options: [
          { id: 'u1', text: 'Ofrecemos soluciones integrales 360°', reaction: 'Suena a lo que dicen todas las agencias.' },
          {
            id: 'u2',
            text: 'Sprints de optimización de 90 días: checkout, fichas de producto y email, medidos cada semana',
            correct: true,
          },
          { id: 'u3', text: 'Más de 10 años de experiencia en el mundo digital', reaction: 'Ok, pero ¿qué van a hacer por mi tienda?' },
        ],
      },
      {
        id: 'proof',
        label: 'Prueba social',
        options: [
          { id: 'p1', text: 'Logos de 12 clientes de rubros distintos', art: 'logos', reaction: '¿Trabajan con tiendas como la mía?' },
          {
            id: 'p2',
            text: "Valentina, fundadora de una marca de cosmética: 'Pasamos de 0,9% a 2,1% de conversión en 3 meses'",
            art: 'testimonial',
            correct: true,
            bonusPoints: 50,
            badgeId: 'los-numeros-hablan',
          },
          { id: 'p3', text: 'Ganadores de un premio de diseño', art: 'award', reaction: 'Un premio no me dice si voy a vender más.' },
        ],
      },
      {
        id: 'cta',
        label: 'Llamado a la acción',
        options: [
          { id: 'c1', text: 'Contáctanos', reaction: 'Me da flojera escribir un formulario largo.' },
          { id: 'c2', text: 'Agenda tu auditoría de conversión gratis (20 min)', correct: true },
          { id: 'c3', text: 'Ver nuestro portafolio', reaction: 'Me fui a mirar el portafolio y me perdí.' },
        ],
      },
      {
        id: 'visual',
        label: 'Visual',
        options: [
          { id: 'v1', text: 'Render abstracto en 3D', art: 'abstract3d', reaction: 'Se ve bonito... pero ¿esto qué es?' },
          { id: 'v2', text: 'Mockup de dashboard con la conversión subiendo', art: 'dashboard', correct: true },
          { id: 'v3', text: 'Foto del equipo en la oficina', art: 'team', reaction: 'Lindo equipo, pero ¿qué resultados tienen?' },
        ],
      },
    ],
    testUsers: 10,
    testSeconds: 5,
    testTable: [
      { minCorrect: 5, comprehension: 90, ctr: 6.2 },
      { minCorrect: 4, comprehension: 75, ctr: 3.5 },
      { minCorrect: 3, comprehension: 55, ctr: 1.8 },
      { minCorrect: 0, comprehension: 20, ctr: 0.3 },
    ],
    happyReaction: '¡Esto es justo lo que necesito! Agendo la auditoría.',
    rewards: {
      perConnection: 40,
      perTrashed: 50,
      trapHoursPenalty: 10,
      fitPerfectBonus: 100,
      perSlot: 30,
      ctrThreshold: 4,
      ctrBudgetBonus: 2000,
    },
    fitPerfectBadgeId: 'pixel-perfect-fit',
    completionBadgeId: 'value-architect',
    success: { minComprehension: 80, minCtr: 4 },
    partial: { minFitPct: 70, minSlots: 3 },
    collapse: {
      minTrapsConnected: 2,
      minComprehension: 50,
      hint: 'Lee tu titular como si fueras Valentina. ¿Te dice qué ganas?',
    },
  },

  /* ─── Fase 4 · El reto final ─────────────────────────────── */
  build: {
    kind: 'value-formula',
    title: 'El reto final: escribe el above the fold de tu agencia',
    intro: 'Tu propuesta en una frase. Usa la media query que escribiste en Segmentos.',
    parts: FORMULA_PARTS,
    maxWords: 25,
    readingSeconds: 5,
    linesTitle: 'Tu Fit en 3 líneas',
    lines: [
      {
        id: 'dolorAlivio',
        icon: '😖',
        label: 'Dolor que alivias',
        placeholder: 'El 78% abandona el carrito',
        how: { id: 'dolorComo', placeholder: 'checkout rediseñado en 3 pasos' },
      },
      {
        id: 'alegria',
        icon: '😊',
        label: 'Alegría que creas',
        placeholder: 'Ver subir las ventas sin trabajar más',
        how: { id: 'alegriaComo', placeholder: 'emails automáticos que venden solos' },
      },
      { id: 'porQue', icon: '🏆', label: 'Por qué tú y no otra agencia', placeholder: 'Solo trabajamos con ecommerce de moda y medimos cada semana' },
    ],
    forbiddenWords: ['calidad', 'innovación', 'pasión', 'soluciones integrales', '360°'],
    reference: { blockId: 'customer-segments', fieldId: 'rubro', targetId: 'segmento', label: 'Usar mi rubro de Segmentos' },
  },
} satisfies LevelConfig;
