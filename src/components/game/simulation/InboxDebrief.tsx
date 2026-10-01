'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { evaluateInbox, toActivityResult, type InboxClasses, type InboxComputed } from '@/lib/inbox';
import { formatCoins } from '@/lib/scoring';
import type { ActivityResult, InboxConfig, LeadClass } from '@/types/game';
import { ActivityOutcomeCard } from '../shared/ActivityOutcomeCard';
import { CLASS_META, CLASS_ORDER, FIT_META } from './inboxMeta';
import { T } from '@/components/glossary/Terms';

interface InboxDebriefProps {
  config: InboxConfig;
  computed: InboxComputed;
  classes: InboxClasses;
  onClassify: (leadId: string, value: LeadClass) => void;
  onBack: () => void;
  onRetry: () => void;
  onContinue: (result: ActivityResult) => void;
}

/** Pantalla final: fichas lado a lado, confirmación de la clasificación y resultado del pipeline. */
export function InboxDebrief({ config, computed, classes, onClassify, onBack, onRetry, onContinue }: InboxDebriefProps) {
  const [confirmed, setConfirmed] = useState(false);
  const evaluation = useMemo(() => evaluateInbox(config, computed, classes), [config, computed, classes]);


  return (
    <div className="space-y-5">
      <section className="flex items-start gap-3 rounded-[28px] bg-lavender p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl">🎯</span>
        <div>
          <p className="font-display text-lg font-bold">Tu segmento real</p>
          <p className="text-ink/75">
            &ldquo;<T>{config.segmentInsight}</T>&rdquo;
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {config.leads.map((lead) => {
          const data = computed.leads[lead.id];
          const fit = FIT_META[lead.fit];
          const chosen = classes[lead.id];
          const correct = evaluation.correctByLead[lead.id];
          return (
            <article key={lead.id} className={`${cardClass} flex flex-col p-4`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-2xl">{lead.avatar}</span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-tight">{lead.name}</p>
                  <p className="truncate text-xs text-muted">{lead.role}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {config.fields.map((field) => (
                  <li key={field.id} className="flex gap-2">
                    <span>{field.icon}</span>
                    <span className={data.unlocked.has(field.id) ? '' : 'text-muted/60'}>
                      {data.unlocked.has(field.id) ? lead.fiche[field.id] : '???'}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={`mt-3 rounded-xl px-3 py-1.5 text-center font-display text-sm font-bold ${data.ficheComplete ? `${fit.soft} ${fit.text}` : 'bg-surface text-muted'}`}>
                Encaje: {data.ficheComplete ? fit.label : '??? (ficha incompleta)'}
              </p>

              <div className="mt-auto grid grid-cols-3 gap-1.5 pt-3">
                {CLASS_ORDER.map((value) => {
                  const meta = CLASS_META[value];
                  const active = chosen === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={confirmed}
                      onClick={() => onClassify(lead.id, value)}
                      title={meta.label}
                      className={`rounded-xl py-2 text-xs font-semibold transition ${
                        active ? `${meta.soft} ring-2 ring-ink/80` : 'bg-surface ring-1 ring-line'
                      } ${confirmed && !active ? 'opacity-40' : ''}`}
                    >
                      {meta.icon}
                      <span className="block">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
              {confirmed && (
                <p className={`mt-2 text-center text-sm font-bold ${correct ? 'text-lime-strong' : 'text-pink-strong'}`}>
                  {correct
                    ? `✓ Bien clasificado · +${config.rewards.correctClass}`
                    : `✗ Era: ${CLASS_META[lead.correctClass].icon} ${CLASS_META[lead.correctClass].label}`}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {!confirmed ? (
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="soft" onClick={onBack}>
            ← Volver a la bandeja
          </Button>
          <Button variant="gradient" onClick={() => setConfirmed(true)}>
            Confirmar pipeline ✓
          </Button>
        </div>
      ) : (
        <ActivityOutcomeCard
          outcome={evaluation.outcome}
          copy={{
            totalTitle: '¡Pipeline impecable!',
            totalBody: 'Fichas completas, leads bien clasificados y tu equipo con horas y caja de sobra.',
            partialTitle: `${evaluation.correctClassifications}/${evaluation.totalLeads} bien clasificados`,
            partialBody:
              'Para el éxito total necesitas las 3 fichas completas, las 3 clasificaciones correctas y horas y presupuesto sobre el 70%.',
            collapseLabel: '💀 Pipeline colapsado',
            collapseTitle: 'Tu agencia está en números rojos 🔥',
          }}
          stats={[
            { label: '⏱️ Horas del equipo', value: `${evaluation.hours}/${config.initial.hours}` },
            { label: '💰 Presupuesto', value: formatCoins(evaluation.budget) },
          ]}
          breakdown={evaluation.breakdown}
          points={evaluation.points}
          badges={evaluation.badges}
          meterImpact={evaluation.meterImpact}
          hint={config.collapse.hint}
          onRetry={onRetry}
          onContinue={() => onContinue(toActivityResult(evaluation))}
        />
      )}
    </div>
  );
}
