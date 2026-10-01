'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cardClass } from '@/components/ui/Card';
import type { FitMapState } from '@/lib/fitLab';
import { shuffle } from '@/lib/scoring';
import type { FitLabConfig, FitNeedType } from '@/types/game';
import { T } from '@/components/glossary/Terms';

const NEED_META: Record<FitNeedType, { icon: string; label: string; bg: string }> = {
  dolor: { icon: '😖', label: 'Dolor', bg: 'bg-pink' },
  alegria: { icon: '😊', label: 'Alegría', bg: 'bg-sun' },
  trabajo: { icon: '🎯', label: 'Trabajo', bg: 'bg-sky' },
};

type Point = { x: number; y: number };
type Line = { key: string; from: Point; to: Point; kind: 'correct' | 'trap' | 'reveal' };
type Flash = { tone: 'good' | 'bad'; text: string } | null;

interface FitMapProps {
  config: FitLabConfig;
  state: FitMapState;
  onChange: (state: FitMapState) => void;
  onContinue: () => void;
}

/** Etapa A: conectar cada necesidad del cliente con el servicio que la resuelve; las trampas van a la papelera. */
export function FitMap({ config, state, onChange, onContinue }: FitMapProps) {
  const [serviceOrder] = useState(() => shuffle(config.services));
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [flash, setFlash] = useState<Flash>(null);
  const [lines, setLines] = useState<Line[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const needRefs = useRef<Record<string, HTMLElement | null>>({});
  const serviceRefs = useRef<Record<string, HTMLElement | null>>({});

  // Estado derivado de cada servicio.
  const connectedServices = new Set(Object.values(state.connections).filter((c) => c.correct || c.trap).map((c) => c.serviceId));
  const revealedServices = new Set(
    config.needs.filter((n) => state.connections[n.id] && !state.connections[n.id].correct).map((n) => n.serviceId),
  );
  const isFree = (id: string) => !connectedServices.has(id) && !revealedServices.has(id) && !state.trashed.includes(id);
  const freeServices = serviceOrder.filter((s) => isFree(s.id));
  const allNeedsDone = config.needs.every((n) => state.connections[n.id]);
  const canContinue = allNeedsDone && freeServices.length === 0;

  const connect = (needId: string, serviceId: string) => {
    const need = config.needs.find((n) => n.id === needId)!;
    const service = config.services.find((s) => s.id === serviceId)!;
    if (state.connections[needId] || !isFree(serviceId)) return;
    const correct = need.serviceId === serviceId;
    const trap = Boolean(service.trap);
    onChange({
      connections: { ...state.connections, [needId]: { serviceId, correct, trap } },
      // Si el servicio correcto estaba en la papelera, se rescata al revelarlo.
      trashed: state.trashed.filter((id) => id !== need.serviceId),
    });
    const answer = config.services.find((s) => s.id === need.serviceId)!.text;
    setFlash(
      correct
        ? { tone: 'good', text: `🧲 ¡Encaja! +${config.rewards.perConnection} pts de Fit` }
        : trap
          ? { tone: 'bad', text: `🪤 Trampa: es trabajo que nadie pidió (−${config.rewards.trapHoursPenalty} horas). Lo que sí resolvía esto: «${answer}».` }
          : { tone: 'bad', text: `✗ No encaja. Lo que resuelve esto es: «${answer}».` },
    );
    setSelectedNeed(null);
    setSelectedService(null);
  };

  const trash = (serviceId: string) => {
    if (!isFree(serviceId)) return;
    const service = config.services.find((s) => s.id === serviceId)!;
    onChange({ ...state, trashed: [...state.trashed, serviceId] });
    setSelectedService(null);
    setFlash(service.trap ? { tone: 'good', text: '🧹 A la papelera. Bien: nadie pidió eso.' } : { tone: 'bad', text: '🗑️ Enviado a la papelera. ¿Seguro que no resuelve nada?' });
  };

  const restore = (serviceId: string) => onChange({ ...state, trashed: state.trashed.filter((id) => id !== serviceId) });

  const pickNeed = (needId: string) => {
    if (state.connections[needId]) return;
    if (selectedService) connect(needId, selectedService);
    else setSelectedNeed((cur) => (cur === needId ? null : needId));
  };

  const pickService = (serviceId: string) => {
    if (!isFree(serviceId)) return;
    if (selectedNeed) connect(selectedNeed, serviceId);
    else setSelectedService((cur) => (cur === serviceId ? null : serviceId));
  };

  // Líneas SVG entre tarjetas conectadas (se recalculan al cambiar el estado o el tamaño).
  const measure = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const anchor = (el: HTMLElement | null | undefined, side: 'right' | 'left'): Point | null => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: (side === 'right' ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top };
    };
    const next: Line[] = [];
    for (const need of config.needs) {
      const c = state.connections[need.id];
      if (!c) continue;
      const from = anchor(needRefs.current[need.id], 'right');
      if (!from) continue;
      if (c.correct || c.trap) {
        const to = anchor(serviceRefs.current[c.serviceId], 'left');
        if (to) next.push({ key: `${need.id}-${c.serviceId}`, from, to, kind: c.correct ? 'correct' : 'trap' });
      }
      if (!c.correct) {
        const to = anchor(serviceRefs.current[need.serviceId], 'left');
        if (to) next.push({ key: `${need.id}-reveal`, from, to, kind: 'reveal' });
      }
    }
    setLines(next);
  }, [config.needs, state.connections]);

  useLayoutEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, state.trashed]);

  const correctCount = Object.values(state.connections).filter((c) => c.correct).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Toca una necesidad de {config.clientName} y luego el servicio que la resuelve (o arrástralo). Los servicios que no conectan con nada
        van a la 🗑️ papelera. <b className="text-ink">Cada necesidad tiene un solo intento.</b>
      </p>

      <div ref={containerRef} data-tour="fitmap-board" className="relative grid grid-cols-2 gap-x-8 gap-y-2 sm:gap-x-16">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {lines.map((l) => {
            const mid = (l.from.x + l.to.x) / 2;
            return (
              <motion.path
                key={l.key}
                d={`M ${l.from.x} ${l.from.y} C ${mid} ${l.from.y}, ${mid} ${l.to.y}, ${l.to.x} ${l.to.y}`}
                fill="none"
                stroke={l.kind === 'correct' ? '#6fae12' : l.kind === 'trap' ? '#ff4f8b' : '#b8b5c9'}
                strokeWidth={l.kind === 'reveal' ? 2 : 3}
                strokeDasharray={l.kind === 'reveal' ? '6 6' : undefined}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        <p className="text-xs font-bold uppercase tracking-wider text-muted">👤 Perfil de {config.clientName}</p>
        <p className="text-xs font-bold uppercase tracking-wider text-muted">🛠️ Servicios de tu agencia</p>

        <div className="space-y-2" data-tour="fitmap-needs">
          {config.needs.map((need) => {
            const meta = NEED_META[need.type];
            const c = state.connections[need.id];
            const selected = selectedNeed === need.id;
            return (
              <button
                key={need.id}
                ref={(el) => {
                  needRefs.current[need.id] = el;
                }}
                type="button"
                onClick={() => pickNeed(need.id)}
                onDragOver={(e) => !c && e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) connect(need.id, id);
                }}
                className={`relative z-10 block w-full rounded-2xl p-2.5 text-left text-xs transition sm:p-3 sm:text-sm ${meta.bg} ${
                  selected ? 'ring-2 ring-ink' : ''
                } ${c ? (c.correct ? 'ring-2 ring-lime-strong' : 'opacity-70 ring-2 ring-pink-strong') : 'hover:ring-2 hover:ring-ink/30'}`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wide text-ink/50">
                  {meta.icon} {meta.label} {c && (c.correct ? '· ✓' : '· ✗')}
                </span>
                {need.text}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {serviceOrder.map((service) => {
            if (state.trashed.includes(service.id)) return null;
            const used = connectedServices.has(service.id);
            const revealed = revealedServices.has(service.id);
            const trapUsed = used && service.trap;
            const selected = selectedService === service.id;
            const free = isFree(service.id);
            return (
              <button
                key={service.id}
                ref={(el) => {
                  serviceRefs.current[service.id] = el;
                }}
                type="button"
                draggable={free}
                onDragStart={(e) => e.dataTransfer.setData('text/plain', service.id)}
                onClick={() => pickService(service.id)}
                className={`relative z-10 block w-full rounded-2xl bg-white p-2.5 text-left text-xs shadow-soft transition sm:p-3 sm:text-sm ${
                  selected ? 'ring-2 ring-ink' : 'ring-1 ring-ink/5'
                } ${trapUsed ? 'bg-pink! ring-2! ring-pink-strong!' : used ? 'bg-lime!' : revealed ? 'bg-surface! text-muted' : 'cursor-grab hover:ring-2 hover:ring-lavender-strong/40'}`}
              >
                {trapUsed && <span className="block text-[10px] font-bold uppercase text-pink-strong">🪤 Trabajo que nadie pidió</span>}
                {revealed && <span className="block text-[10px] font-bold uppercase text-muted">💡 Respuesta</span>}
                {service.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Papelera */}
      <div
        data-tour="fitmap-trash"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/plain');
          if (id) trash(id);
        }}
        className={`${cardClass} flex flex-wrap items-center gap-2 p-3 ${selectedService ? 'ring-2 ring-pink-strong' : ''}`}
      >
        <button
          type="button"
          disabled={!selectedService}
          onClick={() => selectedService && trash(selectedService)}
          className="rounded-full bg-ink px-4 py-2 font-display text-sm font-semibold text-white disabled:opacity-40"
        >
          🗑️ {selectedService ? 'Enviar a la papelera' : 'Papelera'}
        </button>
        {state.trashed.length === 0 && <span className="text-xs text-muted">Arrastra aquí (o selecciona y toca el botón) lo que no conecta con nada.</span>}
        {state.trashed.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => restore(id)}
            title="Sacar de la papelera"
            className="rounded-full bg-surface px-3 py-1 text-xs text-ink/60 line-through hover:no-underline"
          >
            {config.services.find((s) => s.id === id)?.text} ↺
          </button>
        ))}
      </div>

      <AnimatePresence>
        {flash && (
          <motion.p
            key={flash.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-3 text-sm font-medium ${flash.tone === 'good' ? 'bg-lime' : 'bg-pink'}`}
          >
            <T>{flash.text}</T>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {!canContinue && (
          <span className="text-sm text-muted">
            {!allNeedsDone
              ? `Conecta las ${config.needs.length} necesidades (${Object.keys(state.connections).length}/${config.needs.length})`
              : `Quedan ${freeServices.length} servicios sin usar: ¿son trampas?`}
          </span>
        )}
        <Button variant="gradient" disabled={!canContinue} onClick={onContinue}>
          Fit {Math.round((correctCount / config.needs.length) * 100)}% · Ir al Hero Builder →
        </Button>
      </div>
    </div>
  );
}
