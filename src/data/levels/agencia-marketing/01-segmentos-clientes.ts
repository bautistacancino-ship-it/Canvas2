import type { LevelConfig } from '@/types/game';

/* ──────────────────────────────────────────────────────────────
 * BLOQUE · Segmentos de Clientes
 * Perfil: Agencia de Marketing Digital y Diseño Web
 * Desbloquea: Propuesta de Valor
 * Fuente: segmentos-de-clientes-agencia-marketing-digital.md
 * ────────────────────────────────────────────────────────────── */

export const agenciaSegmentosClientes = {
  id: 'agencia-marketing/customer-segments',
  businessId: 'agencia-marketing',
  blockId: 'customer-segments',
  title: 'Segmentos de Clientes',
  subtitle: 'Un sitio que intenta verse igual en todas las pantallas termina roto en todas.',

  /* ─── Fase 1 · Micro-learning ────────────────────────────── */
  theory: {
    title: 'Micro-learning: segmentos en tu idioma',
    concept: {
      headline: 'Un sitio que intenta verse igual en todas las pantallas termina roto en todas.',
      paragraphs: [
        'Por eso existen los breakpoints y las media queries. Defines para qué pantalla diseñas y entregas a cada una el layout que necesita.',
        'Los Segmentos de Clientes son las media queries de tu agencia. Definen para qué grupos específicos de empresas o personas existe tu negocio, y cada segmento recibe su propio mensaje, su propio servicio y su propio precio.',
        'Lo irónico es que las agencias le arman buyer personas a todos sus clientes, pero casi nunca definen la suya.',
      ],
      code: `@media (rubro: ecommerce-moda) and (madurez-digital: ya-vende-online) {
  .agencia { mensaje: "más conversión"; precio: retainer; }
}`,
      goldenRule: '"Agencia 360 para todo tipo de empresas" no es un segmento. Es un sitio sin CSS responsive.',
    },
    cards: [
      {
        id: 'masas',
        icon: '🌊',
        title: 'Mercado de Masas',
        body: 'Una oferta estándar para muchísima gente con necesidades parecidas.',
        example: 'Plantillas de Shopify o WordPress vendidas en un marketplace a cualquier emprendedor.',
      },
      {
        id: 'nicho',
        icon: '🔬',
        title: 'Nicho',
        body: 'Un grupo muy específico con un dolor muy concreto. Menos clientes, más valor por cliente.',
        example: 'Web + SEO local + Google Ads exclusivamente para clínicas veterinarias.',
      },
      {
        id: 'segmentado',
        icon: '🎚️',
        title: 'Segmentado',
        body: 'Un mismo mercado dividido en subgrupos con necesidades distintas.',
        example:
          'Ecommerce que recién parte (setup de tienda + primeras campañas) vs. ecommerce consolidado (CRO, email automation, retención).',
      },
      {
        id: 'diversificado',
        icon: '🔀',
        title: 'Diversificado',
        body: 'Dos segmentos sin relación, atendidos con las mismas capacidades.',
        example: 'Servicios para pymes + un curso o kit de Figma para diseñadores junior.',
      },
      {
        id: 'multilateral',
        icon: '🔗',
        title: 'Plataforma Multilateral',
        body: 'Dos segmentos que se necesitan entre sí para que el modelo funcione.',
        example:
          'Un newsletter o directorio de tu industria: los lectores atraen a los anunciantes, y los anunciantes financian el contenido gratis.',
      },
      {
        id: 'cliente-del-cliente',
        icon: '👤',
        title: 'Tu cliente ≠ el cliente de tu cliente',
        body: 'Quien navega el sitio no es quien te paga. Y en B2B, quien te elige no siempre es quien firma.',
        example:
          'El usuario es el comprador en la tienda online. Tu cliente es el dueño. Y a veces el gerente de marketing te elige pero el de finanzas aprueba. Le hablas a los dos.',
      },
    ],
    comparison: [
      {
        situation: '¿Quién es tu cliente?',
        novice: '"Cualquier empresa que necesite presencia digital."',
        pro: '"Ecommerce de moda y belleza en Shopify que ya venden, pero convierten bajo el 1,5%."',
      },
      {
        situation: 'El portafolio',
        novice: 'Una landing de abogados, un restaurante, una minera, una ONG.',
        pro: 'Casos del mismo segmento con KPIs: "+38% en tasa de conversión en 90 días".',
      },
      {
        situation: 'Los servicios',
        novice: 'Hace de todo: web, redes, branding, video, SEO, impresos.',
        pro: 'Un servicio estrella diseñado para el dolor del segmento.',
      },
      {
        situation: 'El mensaje',
        novice: '"Hacemos webs bonitas y modernas."',
        pro: '"Te ayudamos a vender más con el tráfico que ya pagas."',
      },
      {
        situation: 'Decir que no',
        novice: 'Acepta el "favor" del primo y el proyecto de 120 días de pago.',
        pro: 'Califica cada lead antes de cotizar. Un mal cliente le roba horas al ideal.',
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
    perfectBadgeId: 'cero-rebote',
    questions: [
      {
        id: 'q1',
        topic: 'Encontrar tu segmento',
        prompt:
          'De tus 10 clientes, los 3 que más rinden (mejores KPIs, pagan retainer, renuevan) son ecommerce de moda. ¿Qué haces con el mensaje de tu agencia?',
        options: [
          { id: 'a', text: 'Mantienes "Agencia 360 para todo tipo de empresas": no quieres cerrarte puertas.' },
          { id: 'b', text: 'Te posicionas como agencia de crecimiento para ecommerce de moda, con esos 3 casos y sus métricas al frente.' },
          { id: 'c', text: 'Lanzas un "Pack Web + Redes" a precio bajo para que cualquier pyme pueda contratarte.' },
        ],
        correctOptionId: 'b',
        explanation: 'Tus mejores clientes ya te dijeron cuál es tu segmento. La especialización vende más caro que la versatilidad.',
        relatedCardId: 'nicho',
      },
      {
        id: 'q2',
        topic: 'Tu cliente ≠ el cliente de tu cliente',
        prompt: 'Vas a presentarle una propuesta al fundador de una tienda Shopify. ¿Con qué abres?',
        options: [
          { id: 'a', text: '"Vamos a diseñar una experiencia que va a encantar a tus visitantes."' },
          { id: 'b', text: '"Vamos a subir tu tasa de conversión y tu ticket promedio con el tráfico que ya pagas."' },
          { id: 'c', text: '"Usamos las últimas tendencias de UI y ganamos dos premios de diseño este año."' },
        ],
        correctOptionId: 'b',
        explanation: 'El visitante usa la web, pero quien firma es el fundador. Y al fundador le importan sus ventas, no tus premios.',
        relatedCardId: 'cliente-del-cliente',
      },
      {
        id: 'q3',
        topic: 'Mercado segmentado',
        prompt: 'Tienes clientes ecommerce que recién parten y otros que ya facturan fuerte. ¿Cómo los atiendes?',
        options: [
          { id: 'a', text: 'Con la misma propuesta y el mismo precio para todos: así es más simple.' },
          {
            id: 'b',
            text: 'Con dos ofertas: un plan Starter (setup de tienda y primeras campañas) y un plan Growth (CRO, email automation, retención).',
          },
          { id: 'c', text: 'Les das a los nuevos el servicio premium con descuento para fidelizarlos desde el inicio.' },
        ],
        correctOptionId: 'b',
        explanation: 'Mismo rubro, distinta etapa, distinto dolor. Un segmento dividido en subgrupos merece ofertas distintas.',
        relatedCardId: 'segmentado',
      },
      {
        id: 'q4',
        topic: 'Saber decir que no',
        prompt:
          'Una multinacional te invita a una licitación: 40 páginas de requisitos y pago a 120 días. Tu equipo es de 4 personas.',
        options: [
          { id: 'a', text: 'Aceptas sin pensarlo: el logo en tu portafolio vale más que cualquier cosa.' },
          {
            id: 'b',
            text: 'Declinas, o propones un alcance acotado con pagos por hito: hoy no encaja con tu capacidad ni tu flujo de caja.',
          },
          { id: 'c', text: 'Aceptas y subcontratas casi todo para escalar rápido.' },
        ],
        correctOptionId: 'b',
        explanation: 'Un cliente grande que no puedes sostener no es una oportunidad: es un riesgo con un logo bonito.',
        relatedCardId: 'nicho',
      },
      {
        id: 'q5',
        topic: 'Plataforma multilateral',
        prompt: 'Lanzaste un newsletter gratuito sobre ecommerce de moda y ya tiene 5.000 suscriptores. ¿Quién es tu segmento?',
        options: [
          { id: 'a', text: 'Solo los lectores: son los que abren el correo.' },
          {
            id: 'b',
            text: 'Los lectores y los anunciantes (apps de Shopify, empresas de logística): dos segmentos que se necesitan mutuamente.',
          },
          { id: 'c', text: 'Solo los anunciantes: los lectores son tráfico y los que pagan son las marcas.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Sin lectores no hay anunciantes, y sin anunciantes no hay newsletter gratis. En una plataforma multilateral, atiendes a ambos lados.',
        relatedCardId: 'multilateral',
      },
      {
        id: 'q6',
        topic: 'Quién decide vs. quién paga',
        prompt: 'La gerenta de marketing ama tu propuesta, pero lleva 3 semanas trabada en el área de finanzas. ¿Qué haces?',
        options: [
          { id: 'a', text: 'Le mandas a la gerenta de marketing más mockups y referencias visuales para que insista.' },
          { id: 'b', text: 'Preparas un resumen de una página para finanzas, con retorno esperado, costos y plazos.' },
          { id: 'c', text: 'Bajas el precio un 30% para destrabar la aprobación rápido.' },
        ],
        correctOptionId: 'b',
        explanation: 'En B2B, tu segmento tiene más de una cabeza. Quien te elige y quien aprueba el pago necesitan argumentos distintos.',
        relatedCardId: 'cliente-del-cliente',
      },
      {
        id: 'q7',
        topic: 'El tamaño correcto del nicho',
        prompt: 'Tienes que escribir tu segmento en el Canvas. ¿Cuál es la mejor definición?',
        options: [
          { id: 'a', text: '"Pymes que necesitan presencia digital."' },
          { id: 'b', text: '"Ecommerce de moda y belleza en Shopify que ya venden y quieren mejorar su conversión."' },
          { id: 'c', text: '"Tiendas online de calcetines veganos de una sola comuna."' },
        ],
        correctOptionId: 'b',
        explanation:
          'Muy amplio y tu mensaje no le habla a nadie. Muy estrecho y no hay suficientes clientes para pagar tu arriendo. Busca el punto medio.',
        relatedCardId: 'nicho',
      },
    ],
  },

  /* ─── Fase 3 · Inbox de Leads ────────────────────────────── */
  simulation: {
    title: 'Inbox de Leads',
    premise: 'Tus clientes más rentables son ecommerce de moda y belleza que ya venden online. Hoy tienes 3 mensajes nuevos.',
    initial: { trust: 50, hours: 100, budget: 10000 },
    fields: [
      { id: 'rubro', icon: '🏢', label: 'Rubro' },
      { id: 'plataforma', icon: '🛒', label: 'Plataforma' },
      { id: 'etapa', icon: '📈', label: 'Etapa digital' },
      { id: 'dolor', icon: '😖', label: 'Dolor' },
      { id: 'decide', icon: '✍️', label: 'Quién decide' },
      { id: 'pago', icon: '💰', label: 'Capacidad de pago' },
    ],
    segmentInsight: 'Ecommerce de moda y belleza que ya vende online, con un fundador o socio que decide por números.',
    rewards: { perField: 40, ficheComplete: 100, correctClass: 80 },
    success: { minHours: 70, minBudget: 7000 },
    collapse: {
      budgetBelow: 4000,
      flags: ['accepted-tender'],
      hint: 'Pregunta antes de cotizar. Un lead sin ficha es un lead sin segmento.',
    },
    completionBadgeId: 'growth-strategist',
    leads: [
      {
        id: 'valentina',
        name: 'Valentina',
        role: 'Fundadora · Tienda de cosmética natural',
        avatar: '👩',
        fiche: {
          rubro: 'Cosmética natural (belleza)',
          plataforma: 'Shopify',
          etapa: 'Vende online hace 2 años',
          dolor: 'Tiene tráfico, pero casi nadie compra',
          decide: 'Valentina + su socio (finanzas)',
          pago: 'Fee mensual: plan Growth',
        },
        knownFields: [],
        fit: 'alto',
        fitNote: 'Ecommerce de belleza que ya vende y cuyo socio decide por números.',
        correctClass: 'ideal',
        decisions: [
          {
            id: 'v1',
            message: '¡Hola! Vi su web. Necesito rediseñar mi tienda, ¿cuánto cuesta?',
            options: [
              {
                id: 'v1a',
                text: '¡Hola! Una web completa te sale tanto, te mando la cotización.',
                reaction: 'Ok... lo voy a comparar con otras 4 agencias.',
                effects: { trust: -20 },
                tag: 'Ficha sin datos',
              },
              {
                id: 'v1b',
                text: '¡Hola, Valentina! Antes de cotizar: ¿cuánto vendes hoy online y qué te gustaría mejorar?',
                reaction: 'Vendemos hace 2 años en Shopify. Tenemos tráfico, pero casi nadie compra.',
                effects: { trust: 20 },
                unlocks: ['rubro', 'plataforma', 'etapa', 'dolor'],
              },
              {
                id: 'v1c',
                text: '¡Hola! Te mando nuestro portafolio completo para que veas todo lo que hacemos.',
                reaction: 'Wow, hacen de todo... ¿tienen algo de cosmética?',
                effects: { trust: -10 },
                tag: '🎯 Tu portafolio no le habla a su rubro',
              },
            ],
          },
          {
            id: 'v2',
            message: 'Me encanta la idea, pero tengo que verlo con mi socio. Él lleva las finanzas.',
            options: [
              {
                id: 'v2a',
                text: '¡Perfecto! Avísame cuando decidan.',
                reaction: 'Silencio durante 2 semanas…',
                isEvent: true,
                effects: { trust: -15 },
                tag: 'El lead se enfría ❄️',
              },
              {
                id: 'v2b',
                text: 'Mientras tanto, preparo un resumen de una página con el retorno esperado para tu socio. ¿Lo vemos los tres el jueves?',
                reaction: '¡Buenísimo! Él siempre me pide números.',
                effects: { trust: 20 },
                unlocks: ['decide'],
                bonusPoints: 60,
                badgeId: 'habla-idioma',
                tag: 'Hablaste el idioma del que firma',
              },
              {
                id: 'v2c',
                text: 'Si cierras hoy, te hago un 20% de descuento.',
                reaction: 'Mmm, déjame ver... ¿y si espero, me haces un 30%?',
                effects: { budget: -1000 },
                tag: 'Te posicionas como agencia barata',
              },
            ],
          },
          {
            id: 'v3',
            message: 'Ok, ¿qué nos propones?',
            options: [
              {
                id: 'v3a',
                text: 'Un rediseño completo, con animaciones y una estética premium.',
                reaction: 'Se ve lindo, pero ¿eso me va a hacer vender más?',
                effects: { trust: -10 },
              },
              {
                id: 'v3b',
                text: 'Un plan Growth de 3 meses: optimizamos la ficha de producto y el checkout con una meta concreta de conversión. Fee mensual.',
                reaction: '¡Eso es justo lo que necesito! ¿Dónde firmo?',
                effects: { trust: 30, budget: 3000 },
                unlocks: ['pago'],
              },
              {
                id: 'v3c',
                text: 'Te hacemos web, redes, branding y video. Todo incluido.',
                reaction: '¡Uf, me encanta! Pero... ¿cuánto sale todo eso?',
                effects: { hours: -25 },
                tag: 'Alcance inflado',
              },
            ],
          },
        ],
      },
      {
        id: 'rodrigo',
        name: 'Rodrigo',
        role: 'Gerente de marketing · Multinacional',
        avatar: '👨‍💼',
        fiche: {
          rubro: 'Corporativo multinacional',
          plataforma: 'Portal regional a medida',
          etapa: 'Licitación formal: plazo de 6 semanas',
          dolor: 'Lanzar su nuevo portal regional',
          decide: 'Comité de licitación',
          pago: 'Pago a 120 días, 6 personas dedicadas',
        },
        knownFields: ['rubro', 'plataforma', 'dolor'],
        fit: 'bajo',
        fitNote: 'Es un gran cliente, pero no es tu segmento ni cabe en tu capacidad.',
        correctClass: 'discard',
        decisions: [
          {
            id: 'r1',
            message:
              'Buenas tardes. Estamos invitando a agencias a licitar nuestro nuevo portal regional. Les adjunto las bases (40 páginas).',
            options: [
              {
                id: 'r1a',
                text: '¡Increíble! Nos encantaría. Partimos hoy mismo con la propuesta.',
                reaction: 'Perfecto, el plazo de entrega es el lunes.',
                effects: { hours: -20 },
                tag: 'El equipo pierde el fin de semana leyendo bases',
              },
              {
                id: 'r1b',
                text: 'Gracias, Rodrigo. Para saber si somos el equipo indicado: ¿plazos, forma de pago y tamaño del equipo que necesitan?',
                reaction: 'Plazo de 6 semanas, pago a 120 días y 6 personas dedicadas.',
                effects: { trust: 10 },
                unlocks: ['etapa', 'pago', 'decide'],
              },
              {
                id: 'r1c',
                text: 'Claro, enviamos propuesta. No tenemos experiencia corporativa, pero aprendemos en el camino.',
                reaction: 'Entiendo... requerimos casos comparables, en todo caso.',
                effects: { trust: -15 },
              },
            ],
          },
          {
            id: 'r2',
            message: 'Entonces, ¿participan?',
            options: [
              {
                id: 'r2a',
                text: '¡Sin problema! Nos adaptamos.',
                reaction: 'Evento simulado: mes 3, la agencia se queda sin caja para pagar sueldos.',
                isEvent: true,
                effects: { budget: -5000, hours: -40 },
                tag: '⚠️ Crisis de flujo',
                flags: ['accepted-tender'],
              },
              {
                id: 'r2b',
                text: 'Hoy no somos el partner correcto para este alcance. Si más adelante necesitan un módulo de ecommerce acotado, nos encantaría conversar.',
                reaction: 'Valoro la honestidad. Quedan en mi radar.',
                effects: { trust: 20 },
                bonusPoints: 100,
                badgeId: 'flujo-caja',
                tag: 'Rechazo con elegancia 🛡️',
              },
              {
                id: 'r2c',
                text: 'Aceptamos y subcontratamos al resto del equipo.',
                reaction: 'Evento simulado: un freelancer abandona en la semana 4.',
                isEvent: true,
                effects: { budget: -3000, trust: -30 },
                tag: 'Subcontratación fallida',
                flags: ['accepted-tender'],
              },
            ],
          },
        ],
      },
      {
        id: 'camila',
        name: 'Camila',
        role: 'Fundadora · Joyería artesanal',
        avatar: '👩‍🎨',
        fiche: {
          rubro: 'Joyería artesanal (moda y accesorios)',
          plataforma: 'Instagram + un Shopify pequeño',
          etapa: 'Vende poco, pero duplicó sus ventas el último mes',
          dolor: 'Quiere crecer y vivir de su marca',
          decide: 'Camila (dueña)',
          pago: 'Poco presupuesto por ahora',
        },
        knownFields: ['rubro', 'plataforma', 'decide', 'pago'],
        fit: 'medio',
        fitNote: 'Encaja con el rubro, pero aún no tiene la madurez para un retainer.',
        correctClass: 'nurture',
        decisions: [
          {
            id: 'c1',
            message:
              '¡Hola! Tengo una joyería artesanal. Vendo por Instagram y tengo un Shopify chiquito. Me encantaría trabajar con ustedes, pero tengo poco presupuesto 🙈',
            options: [
              {
                id: 'c1a',
                text: '¡Tranqui! Te lo hacemos todo a mitad de precio.',
                reaction: '¡Siii, gracias!',
                effects: { budget: -2000, hours: -20 },
                tag: 'Trabajas a pérdida',
              },
              {
                id: 'c1b',
                text: '¡Gracias por escribir! ¿Cuánto vendes hoy online y cuál es tu meta para este año?',
                reaction: 'Vendo poquito, pero el mes pasado dupliqué. Quiero vivir de esto.',
                effects: { trust: 20 },
                unlocks: ['etapa', 'dolor'],
              },
              {
                id: 'c1c',
                text: 'Lo siento, solo trabajamos con marcas grandes.',
                reaction: 'Ah... ok, gracias igual.',
                effects: { trust: -30 },
                tag: 'Descartaste a un futuro cliente ideal',
              },
            ],
          },
          {
            id: 'c2',
            message: '¿Entonces cómo podríamos trabajar juntas?',
            options: [
              {
                id: 'c2a',
                text: 'Te sumo al retainer mensual igual. Después vemos cómo lo pagas.',
                reaction: 'Evento simulado: a los 2 meses, Camila no puede pagar.',
                isEvent: true,
                effects: { budget: -2500 },
                tag: 'Cuenta por cobrar incobrable',
              },
              {
                id: 'c2b',
                text: 'Hoy un retainer no te conviene. Te propongo nuestro plan Starter y te sumo a nuestro newsletter de ecommerce de moda. Cuando tus ventas crezcan, conversamos el plan Growth.',
                reaction: '¡Me encanta! Me siento acompañada sin endeudarme.',
                effects: { trust: 25, budget: 500 },
                badgeId: 'nutridor',
                flags: ['nurtured-camila'],
              },
              {
                id: 'c2c',
                text: 'Te mando la cotización completa igual, por si acaso.',
                reaction: 'Uf... no me alcanza 😔',
                effects: { trust: -10 },
                tag: 'Lead perdido',
              },
            ],
          },
        ],
      },
    ],
  },

  /* ─── Fase 4 · El reto final ─────────────────────────────── */
  build: {
    kind: 'media-query',
    title: 'El reto final: escribe la media query de tu cliente',
    intro: 'Completa solo los espacios en blanco. Esta será la definición de tu segmento principal en el Canvas.',
    fileName: 'segmentos.css',
    conditions: [
      { id: 'rubro', prop: 'rubro', placeholder: 'ecommerce de moda y belleza' },
      { id: 'tamano', prop: 'tamaño', placeholder: 'equipos de 2 a 15 personas' },
      { id: 'madurez', prop: 'madurez-digital', placeholder: 'ya vende online en Shopify' },
    ],
    declarations: [
      { id: 'dolor', prop: 'dolor', hint: '¿Qué problema digital le quita el sueño?', placeholder: 'tráfico que no convierte' },
      { id: 'decide', prop: 'decide', hint: 'Cargo de quien firma', placeholder: 'fundador o socio de finanzas' },
      {
        id: 'paga',
        prop: 'paga',
        hint: 'Proyecto único o retainer mensual',
        placeholder: '',
        options: ['proyecto único', 'retainer mensual', 'mixto'],
      },
    ],
    allowSecondary: true,
    forbiddenWords: ['todos', 'cualquier empresa', 'pymes en general'],
  },
} satisfies LevelConfig;
