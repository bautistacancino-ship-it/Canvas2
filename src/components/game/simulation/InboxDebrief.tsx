'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BadgeChip } from '@/components/ui/BadgeChip';
import { Blob } from '@/components/ui/Blob';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import { evaluateInbox, type InboxClasses, type InboxComputed } from '@/lib/inbox';
import { formatCoins } from '@/lib/scoring';
import { BLOB_COLORS } from '@/lib/tones';
import type { InboxConfig, InboxResult, LeadClass } from '@/types/game';
import { CLASS_META, CLASS_ORDER, FIT_META } from './inboxMeta';

interface InboxDebriefProps {
  config: InboxConfig;
  computed: InboxComputed;
  classes: InboxClasses;
  onClassify: (leadId: string, value: LeadClass) => void;
  onBack: () => void;
  onRetry: () => void;
  onContinue: (result: InboxResult) => void;
}

/** Pantalla final: fichas lado a lado, confirmación de la clasificación y resultado del pipeline. */
export function InboxDebrief({ config, computed, classes, onClassify, onBack, onRetry, onContinue }: InboxDebriefProps) {
  const [confirmed, setConfirmed] = useState(false);
  const evaluation = useMemo(() => evaluateInbox(config, computed, classes), [config, computed, classes]);

  const toResult = (): InboxResult => ({
    outcome: evaluation.outcome,
    correctClassifications: evaluation.correctClassifications,
    totalLeads: evaluation.totalLeads,
    points: evaluation.points,
    hours: evaluation.hours,
    budget: evaluation.budget,
    badges: evaluation.badges,
    flags: evaluation.flags,
    meterImpact: evaluation.meterImpact,
  });

  return (
    <div className="space-y-5">
      <section className="flex items-start gap-3 rounded-[28px] bg-lavender p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl">🎯</span>
        <div>
          <p className="font-display text-lg font-bold">Tu segmento real</p>
          <p className="text-ink/75">&ldquo;{config.segmentInsight}&rdquo;</p>
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
        <Outcome
          config={config}
          evaluation={evaluation}
          onRetry={onRetry}
          onContinue={() => onContinue(toResult())}
        />
      )}
    </div>
  );
}

function Outcome({
  config,
  evaluation,
  onRetry,
  onContinue,
}: {
  config: InboxConfig;
  evaluation: ReturnType<typeof evaluateInbox>;
  onRetry: () => void;
  onContinue: () => void;
}) {
  const { outcome } = evaluation;

  if (outcome === 'collapse') {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-[32px] bg-linear-to-br from-pink-strong to-peach-strong p-6 text-center text-white shadow-float"
      >
        <div className="flex justify-center">
          <Blob color={BLOB_COLORS.ink} mood="sad" size={100} />
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/80">💀 Pipeline colapsado</p>
        <h3 className="font-display text-3xl font-bold">Tu agencia está en números rojos 🔥</h3>
        <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/20 p-3">
            <p className="font-display text-2xl font-bold">{formatCoins(evaluation.budget)}</p>
            <p className="text-xs">monedas en caja</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-3">
            <p className="font-display text-2xl font-bold">{evaluation.hours}</p>
            <p className="text-xs">horas del equipo</p>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-md rounded-2xl bg-white/15 p-3 font-medium">💡 Pista: {config.collapse.hint}</p>
        <Button variant="dark" size="lg" className="mt-5" onClick={onRetry}>
          Reintentar el Inbox ↻
        </Button>
      </motion.section>
    );
  }

  const total = outcome === 'total';
  const { rentabilidad = 0, reputacion = 0 } = evaluation.meterImpact;
  const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${cardClass} overflow-hidden`}
    >
      <div className={`flex flex-wrap items-center gap-4 p-5 ${total ? 'bg-lime' : 'bg-sun'}`}>
        <Blob color={total ? BLOB_COLORS.yellow : BLOB_COLORS.sky} mood={total ? 'excited' : 'thinking'} size={84} className="shrink-0" />
        <div className="min-w-0 flex-1 basis-56">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{total ? '🏆 Éxito total' : '⚠️ Éxito parcial'}</p>
          <h3 className="font-display text-2xl font-bold">
            {total ? '¡Pipeline impecable!' : `${evaluation.correctClassifications}/${evaluation.totalLeads} bien clasificados`}
          </h3>
          <p className="text-sm text-ink/70">
            {total
              ? 'Fichas completas, leads bien clasificados y tu equipo con horas y caja de sobra.'
              : 'Para el éxito total necesitas las 3 fichas completas, las 3 clasificaciones correctas y horas y presupuesto sobre el 70%.'}
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <p className="font-display font-bold">Puntos de la actividad</p>
          <ul className="mt-2 space-y-1 text-sm">
            {evaluation.breakdown.map((line) => (
              <li key={line.label} className="flex justify-between gap-3 rounded-xl bg-surface px-3 py-1.5">
                <span className="text-ink/75">{line.label}</span>
                <span className="font-display font-semibold">+{line.points}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3 rounded-xl bg-sun px-3 py-1.5 font-display font-bold">
              <span>Total</span>
              <span>★ {evaluation.points}</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-display font-bold">Estado de la agencia</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">⏱️ Horas del equipo</p>
                <p className="font-display text-xl font-bold">{evaluation.hours}/{config.initial.hours}</p>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">💰 Presupuesto</p>
                <p className="font-display text-xl font-bold">{formatCoins(evaluation.budget)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              Impacto en tus medidores: Rentabilidad {signed(rentabilidad)} · Reputación {signed(reputacion)}
            </p>
          </div>
          {evaluation.badges.length > 0 && (
            <div>
              <p className="font-display font-bold">Insignias ganadas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {evaluation.badges.map((id) => (
                  <BadgeChip key={id} id={id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-line p-4">
        {!total && (
          <Button variant="soft" onClick={onRetry}>
            Reintentar para el éxito total ↻
          </Button>
        )}
        <Button variant="gradient" onClick={onContinue}>
          Continuar al reto final →
        </Button>
      </div>
    </motion.section>
  );
}
