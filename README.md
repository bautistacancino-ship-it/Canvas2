# CanvasLab

Juego web para que estudiantes de diseño gráfico y animación construyan su Business Model Canvas haciendo.
Next.js 16 (App Router) · Tailwind CSS 4 · Zustand 5 (persistido en `localStorage`) · Framer Motion.

```bash
npm install
npm run dev
```

## Arquitectura

```
src/
├── app/
│   ├── layout.tsx                 # <html> + <StoreHydrator/>
│   └── (game)/                    # route group: todas comparten el HUD
│       ├── layout.tsx             # <GameHUD/> + <BottomNav/> (móvil)
│       ├── page.tsx               # Elegir Core Business  →  mapa de niveles
│       ├── play/[blockId]/page.tsx# Un nivel = un bloque del Canvas (SSG ×9)
│       └── canvas/page.tsx        # Tablero final con los 9 bloques
├── components/
│   ├── game/
│   │   ├── LevelRunner.tsx        # Orquestador del Core Loop (máquina de fases)
│   │   ├── theory/                # Fase 1: TheoryModule (concepto → tarjetas → novato vs. pro)
│   │   ├── quiz/                  # Fase 2: QuizPhase (intentos, repaso) + TimedQuiz + CircularTimer
│   │   ├── simulation/            # Fase 3: InboxSimulator, LeadChat, LeadFiche, InboxDebrief
│   │   └── build/                 # Fase 4: MediaQueryBuilder (y CanvasBlockForm genérico)
│   ├── hud/  ·  home/  ·  canvas/  ·  ui/  ·  providers/
├── data/
│   ├── badges.ts                  # Insignias
│   ├── businesses.ts · canvasBlocks.ts
│   └── levels/agencia-marketing/01-segmentos-clientes.ts
├── lib/
│   ├── inbox.ts                   # Motor puro del Inbox de Leads (computeInbox / evaluateInbox)
│   ├── mediaQuery.ts              # Palabras prohibidas y segmento secundario
│   ├── scoring.ts · progress.ts · tones.ts
├── store/useGameStore.ts          # Zustand + persist (versión 2)
└── types/game.ts                  # Modelo de dominio
```

### Principios

- **Contenido separado de los componentes.** Un nivel es un objeto `LevelConfig`; textos, puntajes, umbrales,
  efectos y recompensas viven en el archivo del nivel, no en la UI.
- **Componentes de fase "tontos".** Cada fase recibe su config por props y avisa con un callback.
  Solo `LevelRunner` conoce el store.
- **Estado mínimo, todo lo demás derivado.** El Inbox guarda solo las elecciones y clasificaciones; medidores,
  fichas, puntos e insignias se calculan con funciones puras en `lib/inbox.ts`.
- **Hidratación segura.** El store usa `skipHydration` y se rehidrata en `<StoreHydrator/>`.

### Store (`useGameStore`)

`profile`, `score`, `streak`, `meters` (rentabilidad/reputación), `progress` por bloque (fase, resultado del quiz y
del inbox), `canvas` (respuestas por bloque), `badges`, `flags` (eventos narrativos futuros, ej. `nurtured-camila`).

Acciones: `startGame`, `setPhase`, `registerQuizAnswer`, `completeQuiz`, `completeInbox`, `saveCanvasDraft`,
`completeLevel`, `resetGame`. Reintentar o recargar nunca regala puntos dos veces.

## Regla de desbloqueo

Un bloque se desbloquea al completar el anterior. La actividad de la Fase 3 debe terminar en **éxito total o
parcial**: el parcial basta para avanzar; el colapso obliga a reintentar. El éxito total solo agrega su insignia.

## Nivel 1 · Segmentos de Clientes (Agencia de Marketing Digital y Diseño Web)

| Fase | Mecánica |
| --- | --- |
| 1 · Micro-learning | Concepto con *media queries* → 6 tarjetas volteables → 5 interruptores "Novato vs. Pro" |
| 2 · Quiz | 7 preguntas × 15 s, opciones en orden aleatorio. +20 por acierto, +10 si respondes en < 7 s. Umbral 5/7; si no, repaso de las tarjetas relacionadas y reintento. 7/7 → ⚡ *Cero Rebote* |
| 3 · Inbox de Leads | 3 chats (Valentina, Rodrigo, Camila). Ficha del lead que se desbloquea con preguntas de descubrimiento; medidores de Confianza, Horas (100), Presupuesto (10.000) y Encaje. Clasificación 🟢/🟡/🔴 y debrief |
| 4 · Reto final | Escribir la *media query* del cliente principal (+ secundaria opcional). Bloquea "todos", "cualquier empresa", "pymes en general" |

**Recompensas del Inbox:** +40 por dato descubierto · +100 por ficha completa · +80 por clasificación correcta ·
+60 hablarle al decisor con números (✍️) · +100 rechazar a Rodrigo con elegancia (🛡️) · 🌱 *Nutridor de Leads*.

**Resultados:** 🏆 *Éxito total* (3 fichas completas, 3 clasificaciones correctas, horas y presupuesto ≥ 70%) →
🎖️ *Growth Strategist* · ⚠️ *Éxito parcial* (puede continuar o reintentar) · 💀 *Pipeline colapsado*
(aceptó la licitación de Rodrigo o presupuesto < 40%) → reintento obligatorio con pista.

Al cerrar el Inbox, el resultado impacta los medidores globales: Rentabilidad según presupuesto y horas finales,
Reputación según la confianza promedio (máx. ±30). Completar el nivel suma +250.

## Nivel 2 · Propuesta de Valor (Agencia de Marketing Digital y Diseño Web)

| Fase | Mecánica |
| --- | --- |
| 1 · Micro-learning | Concepto *above the fold* → El Encaje (perfil ↔ mapa de valor) → 7 tipos de valor (Precio es tarjeta trampa) → La fórmula → Novato vs. Pro |
| 2 · Quiz | Mismas reglas que el Nivel 1. 7/7 → ⚡ *Above the Fold* |
| 3 · Fit Lab | **A** Mapa de Fit: conectar 7 necesidades de Valentina con servicios (un intento cada una) y mandar las 4 trampas a la papelera. **B** Hero Builder: 5 slots above the fold. **C** Test de 5 segundos: mapa de calor, comprensión, CTR y reacciones de 10 usuarios |
| 4 · Reto final | "Ayudamos a ___ a ___ sin ___, gracias a ___" (máx. 25 palabras, test de lectura de 5 s) + el Fit en 3 líneas. Puede traer el rubro escrito en Segmentos |

**Recompensas:** +40 por conexión correcta · +50 por trampa a la papelera · −10 horas por trampa conectada ·
+100 Fit al 100% (🧩 *Pixel Perfect Fit*) · +30 por slot correcto · +50 testimonio con métrica (📊 *Los números hablan*) ·
+2.000 monedas si CTR ≥ 4% · 🎖️ *Value Architect* con éxito total.

**Resultados:** 🏆 total (7 conexiones, 4 trampas en la papelera, 5 slots) · ⚠️ parcial (Fit ≥ 70% y ≥ 3 slots) ·
💀 rebote total (2+ trampas conectadas, titular genérico, comprensión < 50%, o no alcanza el parcial).

La Fase 3 de cada nivel es intercambiable (`simulation.kind`: `inbox` | `fit-lab` | `journey` | `accounts`), igual que la Fase 4 (`build.kind`:
`media-query` | `value-formula` | `lines` | `fields`). La lógica de cada actividad vive en `lib/` como funciones puras.

## Nivel 3 · Canales (Agencia de Marketing Digital y Diseño Web)

| Fase | Mecánica |
| --- | --- |
| 1 · Micro-learning | Concepto (user flow) → Las 5 fases del canal, cada una con su ruta buena y su 404 típico → 6 tipos de canal → Novato vs. Pro |
| 2 · Quiz | Mismas reglas. Si repruebas, repasas la fase o tarjeta relacionada. 7/7 → ⚡ *Cero 404* |
| 3 · Journey Board | **A** Swipe de 10 cartas (👉 sirve · 👈 no sirve; arrastre, botones o flechas). **B** Tablero de 5 columnas con 1.500 monedas y 60 horas al mes; columna vacía = 404; no se puede lanzar si te pasas. **C** Simulación de 3 meses: embudo con partículas, grietas en cartas débiles y 4 eventos |
| 4 · Reto final | 1 canal concreto por fase (máx. 8 palabras) + canal principal + métrica. Prohibido "redes sociales" y "boca a boca". Muestra tu media query de Segmentos como referencia |

**Embudo:** la configuración óptima del documento (430 monedas, 57 horas) produce 100 → 30 → 8 → 8 → 3 referidos + 4 segundos
sprints (+1 cliente por la recomendación de Valentina). Sumar la feria obliga a sacrificar otras cartas (te pasas de horas).

**Recompensas:** +30 por swipe correcto · +60 por trampa descartada (🛡️ *Reputación intacta* si descartas ambas) ·
+100 sin 404 (🗺️ *User Flow Completo*) · +80 con 2+ canales de conocimiento (🔀 *A prueba de algoritmos*) ·
+5 por hora o 100 monedas sobrantes · +200 por referido · +500 monedas por cliente · 🎖️ *Growth Architect* con éxito total.

**Resultados:** 🏆 total (8+ clientes, cartas buenas en las 5 fases, recursos que alcanzan, 2+ canales de conocimiento) ·
⚠️ parcial · 🚫 Error 404 (fase vacía, carta trampa en el tablero o menos de 4 clientes).

## Nivel 4 · Relación con Clientes (Agencia de Marketing Digital y Diseño Web)

| Fase | Mecánica |
| --- | --- |
| 1 · Micro-learning | Concepto (la UX de tu servicio) → Los 3 objetivos (captación, fidelización, estimulación) ↔ producto digital → 6 tipos de relación con "Ideal para" → Novato vs. Pro |
| 2 · Quiz | Mismas reglas. 7/7 → ⚡ *Cero Churn* |
| 3 · Account Health Monitor | 6 meses con 3 clientes (Valentina, Tomás, Camila). Cada mes: un evento con 3 respuestas y luego repartir cartas de relación con 40 horas. Barras de salud con desgaste, ⚠️ riesgo bajo 30, 💸 si un cliente cuesta más de lo que paga, 🔋 energía del equipo y 💵 ingreso recurrente. Informe por mes y reporte de retención al final |
| 4 · Reto final | Tipo de relación (chips, 1 o 2) + captación, fidelización, estimulación y señal de abandono (máx. 12 palabras). Prohibido "atención personalizada", "excelente servicio" y "siempre disponibles" |

**Supuesto:** la alerta 💸 usa un valor de 40 monedas por hora del equipo (el account manager de 12 h en Camila, que paga 400, la dispara, como dice el documento).

**Recompensas:** +50 por evento bien resuelto · +30 por mes sin clientes en rojo · +60 onboarding en el mes 1 (🚀 *Primera Impresión*) ·
+80 avisar primero del error (📣 *Malas noticias, buen manejo*) · +100 sin alertas 💸 en 6 meses (🎚️ *Servicio a la Medida*) ·
segundo sprint +1.000/mes (📈 *Upgrade Desbloqueado*) · −150 por cliente perdido · 🎖️ *Retention Master* con éxito total.

**Resultados:** 🏆 total (3 clientes con salud ≥ 60, energía ≥ 50%, 1+ venta adicional, ingreso ≥ 6.400) · ⚠️ parcial ·
🪣 balde roto (se fue un cliente o la energía llegó a 0).
