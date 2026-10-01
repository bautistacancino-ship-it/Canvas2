'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { MeterGauge } from '@/components/hud/MeterGauge';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { computeInbox, type InboxClasses, type InboxPicks } from '@/lib/inbox';
import { formatCoins } from '@/lib/scoring';
import { BLOB_COLORS } from '@/lib/tones';
import type { ActivityResult, InboxConfig, LeadClass } from '@/types/game';
import { CLASS_META, FIT_META } from './inboxMeta';
import { InboxDebrief } from './InboxDebrief';
import { LeadChat } from './LeadChat';
import { LeadFiche } from './LeadFiche';
import { T } from '@/components/glossary/Terms';
import { TutorialGate } from '@/components/tutorial/TutorialGate';

const FAKE_TIMES = ['09:12', '10:47', '11:30', '12:05'];

interface InboxSimulatorProps {
  config: InboxConfig;
  onComplete: (result: ActivityResult) => void;
}

/**
 * Fase 3 · Inbox de Leads. El estado es mínimo (elecciones y clasificaciones);
 * medidores, fichas y puntos se derivan con `computeInbox`.
 */
export function InboxSimulator({ config, onComplete }: InboxSimulatorProps) {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<InboxPicks>({});
  const [classes, setClasses] = useState<InboxClasses>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDebrief, setShowDebrief] = useState(false);

  const computed = useMemo(() => computeInbox(config, picks), [config, picks]);
  const allClassified = config.leads.every((l) => classes[l.id]);
  const active = activeId ? computed.leads[activeId] : null;

  const classify = (leadId: string, value: LeadClass) => setClasses((c) => ({ ...c, [leadId]: value }));
  const reset = () => {
    setPicks({});
    setClasses({});
    setActiveId(null);
    setShowDebrief(false);
    setRound((r) => r + 1);
  };

  if (!started) {
    return (
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mx-auto max-w-xl overflow-hidden`}>
        <div className="relative h-40 bg-linear-to-b from-sky via-lavender to-white">
          <Blob color={BLOB_COLORS.yellow} mood="happy" size={96} className="absolute bottom-0 left-6" />
          <Blob color={BLOB_COLORS.pink} mood="excited" size={70} delay={0.4} className="absolute right-8 top-6" />
          <span className="absolute bottom-6 right-24 rounded-full bg-pink-strong px-2.5 py-1 font-display text-sm font-bold text-white shadow-soft">
            {config.leads.length} nuevos
          </span>
        </div>
        <div className="p-6 text-center">
          <h3 className="font-display text-2xl font-bold">{config.title}</h3>
          <p className="mt-2 text-ink/75">
            &ldquo;<T>{config.premise}</T>&rdquo;
          </p>
          <p className="mt-3 text-sm text-muted">
            El objetivo no es cerrar todas las ventas, sino descubrir si cada lead pertenece a tu segmento y decidir qué hacer con él.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-left text-sm sm:grid-cols-4">
            {[
              ['🤝', 'Confianza', 'por chat'],
              ['⏱️', 'Horas', String(config.initial.hours)],
              ['💰', 'Presupuesto', formatCoins(config.initial.budget)],
              ['🎯', 'Encaje', 'oculto'],
            ].map(([icon, label, value]) => (
              <div key={label} className="rounded-2xl bg-surface p-2.5">
                <p className="text-xs text-muted">
                  {icon} {label}
                </p>
                <p className="font-display font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={() => setStarted(true)}>
            Abrir bandeja de entrada 📥
          </Button>
        </div>
      </motion.section>
    );
  }

  if (showDebrief) {
    return (
      <InboxDebrief
        key={round}
        config={config}
        computed={computed}
        classes={classes}
        onClassify={classify}
        onBack={() => setShowDebrief(false)}
        onRetry={reset}
        onContinue={onComplete}
      />
    );
  }

  const fit = active ? FIT_META[active.lead.fit] : null;

  return (
    <TutorialGate mechanic="chat">
      {() => (
    <div className="space-y-4">
      {/* Medidores */}
      <section className={`${cardClass} grid grid-cols-2 gap-x-5 gap-y-3 p-4 md:grid-cols-4`}>
        {active ? (
          // key: al cambiar de conversación el medidor se reinicia (sin "deltas" falsos).
          <MeterGauge key={active.lead.id} label={`Confianza · ${active.lead.name}`} icon="🤝" value={active.trust} />
        ) : (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-muted">🤝 Confianza</p>
            <p className="font-display text-lg font-bold text-muted">—</p>
          </div>
        )}
        <MeterGauge label="Horas del equipo" icon="⏱️" value={computed.hours} max={config.initial.hours} />
        <MeterGauge label="Presupuesto" icon="💰" value={computed.budget} max={config.initial.budget} format={formatCoins} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-muted">🎯 Encaje</p>
          <p className={`truncate font-display text-lg font-bold ${active?.ficheComplete && fit ? fit.text : 'text-muted'}`}>
            {active ? (active.ficheComplete && fit ? fit.label : '???') : '—'}
          </p>
        </div>
      </section>

      <div key={round} className="grid h-[min(720px,calc(100dvh-14rem))] min-h-[520px] grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* Bandeja */}
        <aside data-tour="inbox-list" className={`${cardClass} flex min-h-0 flex-col overflow-hidden ${activeId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="border-b border-line p-4">
            <p className="font-display text-lg font-bold">📥 Bandeja de entrada</p>
            <p className="text-xs text-muted">{config.premise}</p>
          </div>
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
            {config.leads.map((lead, i) => {
              const data = computed.leads[lead.id];
              const cls = classes[lead.id];
              const isNew = data.chosen.length === 0;
              const last = data.chosen.at(-1);
              const preview = last ? last.reaction.replace(/^Evento simulado:\s*/i, '⏳ ') : lead.decisions[0].message;
              return (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(lead.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl p-2.5 text-left transition ${
                      activeId === lead.id ? 'bg-sky' : 'hover:bg-surface'
                    }`}
                  >
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-2xl">
                      {lead.avatar}
                      {isNew && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-pink-strong ring-2 ring-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-display font-semibold">{lead.name}</span>
                        <span className="shrink-0 text-[10px] text-muted">{FAKE_TIMES[i % FAKE_TIMES.length]}</span>
                      </span>
                      <span className="block truncate text-xs text-muted">{lead.role}</span>
                      <span className={`mt-0.5 block truncate text-xs ${isNew ? 'font-semibold text-ink' : 'text-muted'}`}>{preview}</span>
                      {cls && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${CLASS_META[cls].soft}`}>
                          {CLASS_META[cls].icon} {CLASS_META[cls].label}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line p-3">
            <Button variant="gradient" size="sm" className="w-full" disabled={!allClassified} onClick={() => setShowDebrief(true)}>
              {allClassified ? 'Ver debrief del pipeline →' : `Clasifica los ${config.leads.length} leads`}
            </Button>
          </div>
        </aside>

        {/* Conversación */}
        <div data-tour="inbox-chat" className={`min-h-0 ${activeId ? 'block' : 'hidden lg:block'}`}>
          {active ? (
            <LeadChat
              key={active.lead.id}
              data={active}
              fields={config.fields}
              classification={classes[active.lead.id]}
              onChoose={(optionId) =>
                setPicks((p) => ({ ...p, [active.lead.id]: [...(p[active.lead.id] ?? []), optionId] }))
              }
              onClassify={(value) => classify(active.lead.id, value)}
              onBack={() => setActiveId(null)}
            />
          ) : (
            <div className={`${cardClass} grid h-full place-items-center p-8 text-center`}>
              <div>
                <div className="flex justify-center">
                  <Blob color={BLOB_COLORS.lavender} mood="thinking" size={96} />
                </div>
                <p className="mt-3 font-display text-xl font-bold">Elige una conversación</p>
                <p className="text-sm text-muted">Pregunta antes de cotizar: cada buen dato completa la ficha.</p>
              </div>
            </div>
          )}
        </div>

        {/* Ficha (desktop) */}
        <div data-tour="inbox-fiche" className="hidden min-h-0 overflow-y-auto lg:block">
          {active ? (
            <LeadFiche data={active} fields={config.fields} />
          ) : (
            <div className="rounded-[28px] border-2 border-dashed border-line p-5 text-center text-sm text-muted">
              📋 La ficha del lead aparece aquí y se completa solo cuando haces buenas preguntas.
            </div>
          )}
        </div>
      </div>

      {allClassified && (
        <div className="lg:hidden">
          <Button variant="gradient" size="lg" className="w-full" onClick={() => setShowDebrief(true)}>
            Ver debrief del pipeline →
          </Button>
        </div>
      )}
    </div>
      )}
    </TutorialGate>
  );
}
