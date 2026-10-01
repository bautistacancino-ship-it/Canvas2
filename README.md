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
