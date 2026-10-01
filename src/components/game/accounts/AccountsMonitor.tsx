'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import {
  emptyPlan,
  evaluateAccounts,
  monthContext,
  mrrOf,
  playMonths,
  toAccountsResult,
  type MonthPlan,
} from '@/lib/accounts';
import { formatCoins } from '@/lib/scoring';
import { BLOB_COLORS } from '@/lib/tones';
import type { AccountsConfig, ActivityResult } from '@/types/game';
import { ActivityOutcomeCard } from '../shared/ActivityOutcomeCard';
import { CardHand } from './CardHand';
import { ClientCard } from './ClientCard';
import { LeakyBucket } from './LeakyBucket';
import { MonthReportView } from './MonthReportView';
import { T } from '@/components/glossary/Terms';
import { TutorialGate } from '@/components/tutorial/TutorialGate';

type View = 'intro' | 'event' | 'plan' | 'report' | 'final';

/** Fase 3 · Account Health Monitor: 6 meses cuidando una cartera de 3 clientes. */
export function AccountsMonitor({ config, onComplete }: { config: AccountsConfig; onComplete: (result: ActivityResult) => void }) {
  const [view, setView] = useState<View>('intro');
  const [history, setHistory] = useState<MonthPlan[]>([]);
  const [draft, setDraft] = useState<MonthPlan>(emptyPlan);
  const [selected, setSelected] = useState<string | null>(null);

  const state = useMemo(() => playMonths(config, history), [config, history]);
  const ctx = monthContext(config, state, draft);
  const month = state.month;
  const done = month > config.months;
  const evaluation = useMemo(() => (done ? evaluateAccounts(config, state) : null), [config, state, done]);
  const hoursLeft = ctx.hoursAvailable - ctx.hoursUsed;
  const selectedCard = config.cards.find((c) => c.id === selected);

  const reset = () => {
    setHistory([]);
    setDraft(emptyPlan());
    setSelected(null);
    setView('event');
  };

  const closeCurrentMonth = () => {
    setHistory((h) => [...h, draft]);
    setDraft(emptyPlan());
    setSelected(null);
    setView('report');
  };

  if (view === 'intro') {
    return (
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mx-auto max-w-xl overflow-hidden`}>
        <div className="relative h-40 bg-linear-to-b from-pink via-lavender to-white">
          <Blob color={BLOB_COLORS.pink} mood="happy" size={88} className="absolute bottom-0 left-6" />
          <Blob color={BLOB_COLORS.yellow} mood="excited" size={64} delay={0.3} className="absolute right-24 top-6" />
          <Blob color={BLOB_COLORS.sky} mood="happy" size={72} delay={0.6} className="absolute bottom-2 right-6" />
        </div>
        <div className="p-6 text-center">
          <h3 className="font-display text-2xl font-bold">{config.title}</h3>
          <p className="mt-2 text-ink/75">
            &ldquo;<T>{config.premise}</T>&rdquo;
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-left text-sm">
            {[
              ['⏱️', 'Horas', `${config.hoursPerMonth} al mes (no se acumulan)`],
              ['🔋', 'Energía', 'Parte en 100%'],
              ['💵', 'Ingreso', `${formatCoins(config.clients.reduce((a, c) => a + c.fee, 0))}/mes`],
            ].map(([icon, title, body]) => (
              <div key={title} className="rounded-2xl bg-surface p-3">
                <p className="font-display font-semibold">
                  {icon} {title}
                </p>
                <p className="text-xs text-muted">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">Cada mes: un evento para decidir, luego repartes cartas de relación entre tus clientes.</p>
          <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={() => setView('event')}>
            Empezar el mes 1 📅
          </Button>
        </div>
      </motion.section>
    );
  }

  /* ── Barra de estado ── */
  const statusBar = (
    <section data-tour="accounts-status" className={`${cardClass} flex flex-wrap items-center gap-x-6 gap-y-2 p-4`}>
      <span className="font-display text-xl font-bold">📅 Mes {Math.min(month, config.months)}/{config.months}</span>
      {!done && view === 'plan' && (
        <span className={`font-display font-semibold ${hoursLeft < 0 ? 'text-pink-strong' : ''}`}>
          ⏱️ {ctx.hoursUsed}/{ctx.hoursAvailable} h
          {ctx.hoursAvailable < config.hoursPerMonth && (
            <span className="ml-1 text-xs text-muted">({config.hoursPerMonth - ctx.hoursAvailable} h se fueron en eventos y compromisos)</span>
          )}
        </span>
      )}
      <span className="font-display font-semibold">🔋 {state.energy}%</span>
      <span className="font-display font-semibold">💵 {formatCoins(mrrOf(state))}/mes</span>
    </section>
  );

  /* ── Evento del mes ── */
  if (view === 'event' && ctx.event) {
    const option = ctx.option;
    return (
      <div className="space-y-4">
        {statusBar}
        <motion.section key={month} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mx-auto max-w-2xl p-6`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Evento del mes {month}</p>
          <p className="mt-2 font-display text-2xl font-bold">
            {ctx.event.icon} <T>{ctx.event.text}</T>
          </p>
          <div className="mt-4 space-y-2">
            {ctx.event.options.map((o, i) => (
              <button
                key={o.id}
                type="button"
                disabled={Boolean(option)}
                onClick={() => setDraft((d) => ({ ...d, eventOptionId: o.id }))}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  option?.id === o.id ? 'bg-lavender ring-2 ring-lavender-strong' : option ? 'bg-surface opacity-50' : 'bg-surface ring-1 ring-line hover:bg-white hover:ring-lavender-strong/40'
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white font-display font-bold text-lavender-strong">
                  {String.fromCharCode(65 + i)}
                </span>
                {o.text}
              </button>
            ))}
          </div>
          {option && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <p className="rounded-2xl bg-sky p-3 text-sm">
                <b>Resultado:</b> <T>{option.outcome}</T>
                {option.hours ? ` (cuesta ${option.hours} h este mes)` : ''}
              </p>
              <Button variant="gradient" className="w-full" onClick={() => setView('plan')}>
                Repartir las cartas del mes →
              </Button>
            </motion.div>
          )}
        </motion.section>
      </div>
    );
  }

  /* ── Planificación del mes ── */
  if (view === 'plan' || (view === 'event' && !ctx.event)) {
    const assign = (clientId: string) => {
      if (!selectedCard) return;
      setDraft((d) => ({ ...d, assignments: { ...d.assignments, [clientId]: [...(d.assignments[clientId] ?? []), selectedCard.id] } }));
      setSelected(null);
    };
    return (
      <TutorialGate mechanic="turnos">
        {() => (
      <div className="space-y-4">
        {statusBar}
        <div className="grid gap-3 lg:grid-cols-3" data-tour="accounts-clients">
          {config.clients.map((client) => {
            const assigned = (draft.assignments[client.id] ?? []).map((id) => config.cards.find((c) => c.id === id)!);
            const automatic = config.cards.filter(
              (c) =>
                (c.billing === 'install' && (state.installed.includes(`${c.id}:${client.id}`) || state.installed.includes(c.id))) ||
                (c.billing === 'quarter' && ctx.communityActive),
            );
            const already = selectedCard ? (draft.assignments[client.id] ?? []).includes(selectedCard.id) : false;
            const reason = selectedCard ? ctx.blockedReason(selectedCard, client.id) ?? (already ? 'Ya asignada este mes' : null) : null;
            const tooExpensive = selectedCard ? ctx.cardCost(selectedCard, client.id) > hoursLeft : false;
            const effect = selectedCard?.effects[client.id] ?? 0;
            const preview = selectedCard
              ? `❤️ ${effect > 0 ? '+' : ''}${effect}${selectedCard.billing === 'install' ? ' cada mes' : ''}`
              : undefined;
            return (
              <ClientCard
                key={client.id}
                client={client}
                state={state.clients[client.id]}
                riskThreshold={config.riskThreshold}
                hintRevealed={month > 1}
                assigned={assigned}
                automatic={automatic}
                hours={ctx.clientHours[client.id]}
                costAlert={ctx.costAlert[client.id]}
                canDrop={Boolean(selectedCard) && !reason && !tooExpensive}
                dropPreview={preview}
                dropReason={selectedCard ? reason ?? (tooExpensive ? 'No te alcanzan las horas' : null) : null}
                onDrop={() => assign(client.id)}
                onRemove={(cardId) =>
                  setDraft((d) => ({ ...d, assignments: { ...d.assignments, [client.id]: (d.assignments[client.id] ?? []).filter((x) => x !== cardId) } }))
                }
              />
            );
          })}
        </div>

        <section data-tour="accounts-hand">
          <p className="mb-2 font-display text-lg font-bold">🃏 Cartas de relación</p>
          <CardHand
            cards={config.cards}
            selected={selected}
            activeGlobals={draft.globals}
            ctx={ctx}
            hoursLeft={hoursLeft}
            onSelect={setSelected}
            onToggleGlobal={(id) =>
              setDraft((d) => ({ ...d, globals: d.globals.includes(id) ? d.globals.filter((x) => x !== id) : [...d.globals, id] }))
            }
          />
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <span className="text-sm text-muted">Al cerrar el mes se aplican las cartas y el desgaste de cada cliente.</span>
          <Button data-tour="accounts-close" variant="gradient" size="lg" disabled={hoursLeft < 0} onClick={closeCurrentMonth}>
            Cerrar el mes {month} →
          </Button>
        </div>
      </div>
        )}
      </TutorialGate>
    );
  }

  /* ── Informe del mes ── */
  if (view === 'report') {
    const report = state.reports[state.reports.length - 1];
    return (
      <div className="space-y-4">
        {statusBar}
        <h3 className="font-display text-2xl font-bold">Informe del mes {report.month}</h3>
        <MonthReportView config={config} report={report} revealHints={report.month === 1} />
        <div className="flex justify-end">
          <Button variant="gradient" size="lg" onClick={() => setView(done ? 'final' : 'event')}>
            {done ? 'Ver el reporte de retención 📋' : `Empezar el mes ${month} →`}
          </Button>
        </div>
      </div>
    );
  }

  /* ── Reporte de retención final ── */
  if (!evaluation) return null;
  const lost = config.clients.filter((c) => state.clients[c.id].lost);
  return (
    <div className="space-y-5">
      <h3 className="font-display text-2xl font-bold">📋 Reporte de Retención</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="✅ Clientes retenidos" value={`${evaluation.retained}/${config.clients.length}`} good={evaluation.retained === config.clients.length} />
        <Tile label="❤️ Salud promedio" value={String(evaluation.avgHealth)} good={evaluation.avgHealth >= config.success.minHealth} />
        <Tile
          label="💵 Ingreso mensual"
          value={formatCoins(evaluation.mrr)}
          sub={`antes ${formatCoins(evaluation.initialMrr)}`}
          good={evaluation.mrr >= config.success.minMrr}
        />
        <Tile label="🔋 Energía del equipo" value={`${evaluation.energy}%`} good={evaluation.energy >= config.success.minEnergy} />
        <Tile label="📈 Ventas adicionales" value={String(evaluation.extraSales.length)} sub={evaluation.extraSales.join(' · ') || 'ninguna'} good={evaluation.extraSales.length > 0} />
      </div>

      {evaluation.outcome === 'collapse' && lost.length > 0 && <LeakyBucket lost={lost} />}

      <ActivityOutcomeCard
        outcome={evaluation.outcome}
        copy={{
          totalTitle: '¡Cero churn!',
          totalBody: 'Los 3 clientes sanos, el equipo con energía, ventas adicionales y más ingreso mensual que al inicio.',
          partialTitle: 'Retuviste a los 3 clientes',
          partialBody: `Para el éxito total: salud ≥ ${config.success.minHealth} en todos, energía ≥ ${config.success.minEnergy}%, al menos 1 venta adicional e ingreso ≥ ${formatCoins(config.success.minMrr)}.`,
          collapseLabel: '🪣 Balde roto',
          collapseTitle: lost.length ? `Se fue ${lost.map((c) => c.name).join(' y ')}` : 'Burnout: el equipo renunció',
        }}
        stats={[
          { label: '✅ Retenidos', value: `${evaluation.retained}/${config.clients.length}` },
          { label: '💵 Ingreso mensual', value: formatCoins(evaluation.mrr) },
          { label: '❤️ Salud promedio', value: String(evaluation.avgHealth) },
          { label: '🔋 Energía', value: `${evaluation.energy}%` },
        ]}
        breakdown={evaluation.breakdown}
        points={evaluation.points}
        badges={evaluation.badges}
        meterImpact={evaluation.meterImpact}
        hint={config.collapse.hint}
        onRetry={reset}
        onContinue={() => onComplete(toAccountsResult(evaluation))}
      />
    </div>
  );
}

function Tile({ label, value, sub, good }: { label: string; value: string; sub?: string; good: boolean }) {
  return (
    <div className={`rounded-3xl p-4 ${good ? 'bg-lime' : 'bg-pink'}`}>
      <p className="text-xs font-semibold text-ink/60">{label}</p>
      <p className={`font-display text-2xl font-bold ${good ? 'text-lime-strong' : 'text-pink-strong'}`}>{value}</p>
      {sub && <p className="text-[11px] text-ink/50">{sub}</p>}
    </div>
  );
}
