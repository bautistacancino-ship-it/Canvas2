'use client';

import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import type { MechanicId } from '@/data/tutorials';

/* ──────────────────────────────────────────────────────────────
 * Prácticas guiadas de los mini tutoriales. Son escenarios de prueba
 * autocontenidos: no leen ni escriben el store, así que no cambian
 * puntos, presupuesto ni horas.
 * ────────────────────────────────────────────────────────────── */

type PracticeProps = { onDone: () => void };

function Done({ text, onDone }: { text: string; onDone: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
      <p className="rounded-2xl bg-lime p-3 text-sm font-semibold">✅ {text}</p>
      <Button variant="gradient" className="w-full" onClick={onDone}>
        ¡Listo, a jugar! →
      </Button>
    </motion.div>
  );
}

function PracticeQuiz({ onDone }: PracticeProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const options = [
    { id: 'a', text: 'Todo el mundo' },
    { id: 'b', text: 'Tiendas online de moda que ya venden', correct: true },
    { id: 'c', text: 'Cualquier pyme' },
  ];
  return (
    <div>
      <p className="font-display text-lg font-bold">¿Cuál de estas opciones es un segmento de clientes?</p>
      <div className="mt-3 space-y-2">
        {options.map((o, i) => {
          const state = !answer ? 'idle' : o.correct ? 'correct' : answer === o.id ? 'wrong' : 'dim';
          return (
            <button
              key={o.id}
              type="button"
              disabled={Boolean(answer)}
              onClick={() => setAnswer(o.id)}
              className={`flex w-full items-center gap-3 rounded-2xl p-2 pr-4 text-left text-sm ${
                { idle: 'bg-surface ring-1 ring-line hover:bg-white', correct: 'bg-lime ring-2 ring-lime-strong', wrong: 'bg-pink ring-2 ring-pink-strong', dim: 'bg-surface opacity-50' }[state]
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white font-display font-bold">{String.fromCharCode(65 + i)}</span>
              {o.text}
            </button>
          );
        })}
      </div>
      {answer && <Done text="Así funciona: tu respuesta queda fija al instante y ves el feedback. (Esta práctica no suma puntos.)" onDone={onDone} />}
    </div>
  );
}

function PracticeChat({ onDone }: PracticeProps) {
  const [picked, setPicked] = useState<'good' | 'bad' | null>(null);
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-surface p-3">
        <p className="w-fit max-w-[85%] rounded-3xl rounded-bl-lg bg-white px-4 py-2 text-sm shadow-soft">☕ Pepe, dueño de una cafetería: «¡Hola! ¿Hacen páginas web?»</p>
        {picked && (
          <>
            <p className="ml-auto mt-2 w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-linear-to-br from-sky-strong to-lavender-strong px-4 py-2 text-sm text-white">
              {picked === 'good' ? '¡Hola, Pepe! ¿Qué te gustaría lograr con tu web?' : '¡Hola! Sí, te mando la cotización.'}
            </p>
            <p className="mt-2 w-fit max-w-[85%] rounded-3xl rounded-bl-lg bg-white px-4 py-2 text-sm shadow-soft">
              {picked === 'good' ? 'Quiero que la gente reserve mesa desde el celular.' : 'Ok…'}
            </p>
          </>
        )}
      </div>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-line">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">📋 Ficha del lead · 🏢 Rubro</p>
        <AnimatePresence mode="wait">
          <motion.p key={picked === 'good' ? 'on' : 'off'} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-sm font-semibold">
            {picked === 'good' ? '🔓 Cafetería' : '🔒 ???'}
          </motion.p>
        </AnimatePresence>
      </div>
      {picked !== 'good' && (
        <div className="space-y-2">
          {picked === 'bad' && <p className="text-sm text-pink-strong">La ficha no se llenó: prueba con una pregunta de descubrimiento.</p>}
          <button type="button" onClick={() => setPicked('bad')} className="block w-full rounded-2xl bg-surface p-3 text-left text-sm ring-1 ring-line hover:bg-white">
            A · ¡Hola! Sí, te mando la cotización.
          </button>
          <button type="button" onClick={() => setPicked('good')} className="block w-full rounded-2xl bg-surface p-3 text-left text-sm ring-1 ring-line hover:bg-white">
            B · ¡Hola, Pepe! ¿Qué te gustaría lograr con tu web?
          </button>
        </div>
      )}
      {picked === 'good' && <Done text="¡Un dato nuevo en la ficha! Las buenas preguntas la van llenando." onDone={onDone} />}
    </div>
  );
}

function PracticeNodes({ onDone }: PracticeProps) {
  const [needSelected, setNeedSelected] = useState(false);
  const [connected, setConnected] = useState(false);
  const [umbrellaSelected, setUmbrellaSelected] = useState(false);
  const [trashed, setTrashed] = useState(false);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => !connected && setNeedSelected(true)}
          className={`rounded-2xl bg-pink p-3 text-left text-sm ${needSelected ? 'ring-2 ring-ink' : ''} ${connected ? 'ring-2 ring-lime-strong' : ''}`}
        >
          😖 Dolor: tengo hambre {connected && '· ✓'}
        </button>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => needSelected && !connected && setConnected(true)}
            className={`block w-full rounded-2xl p-3 text-left text-sm shadow-soft ${connected ? 'bg-lime' : 'bg-white ring-1 ring-line'}`}
          >
            🍕 Servicio: pizza a domicilio
          </button>
          {!trashed && (
            <button
              type="button"
              onClick={() => setUmbrellaSelected((v) => !v)}
              className={`block w-full rounded-2xl bg-white p-3 text-left text-sm shadow-soft ${umbrellaSelected ? 'ring-2 ring-ink' : 'ring-1 ring-line'}`}
            >
              ☂️ Servicio: paraguas para el sol
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        disabled={!umbrellaSelected || trashed}
        onClick={() => setTrashed(true)}
        className="rounded-full bg-ink px-4 py-2 font-display text-sm font-semibold text-white disabled:opacity-40"
      >
        🗑️ {trashed ? 'Paraguas en la papelera' : 'Enviar a la papelera'}
      </button>
      <p className="text-xs text-muted">
        {!connected ? '1) Toca «tengo hambre» y luego la pizza.' : !trashed ? '2) Selecciona el paraguas y mándalo a la papelera.' : ''}
      </p>
      {connected && trashed && <Done text="Conectaste una necesidad y usaste la papelera." onDone={onDone} />}
    </div>
  );
}

function PracticeDrag({ onDone }: PracticeProps) {
  const [slot, setSlot] = useState<string | null>(null);
  const [replaced, setReplaced] = useState(false);
  const choose = (text: string) => {
    if (slot && slot !== text) setReplaced(true);
    setSlot(text);
  };
  return (
    <div className="space-y-3">
      <div className={`rounded-2xl p-4 ${slot ? 'bg-white ring-2 ring-sky-strong' : 'border-2 border-dashed border-line'}`}>
        {slot ? <p className="font-display text-xl font-bold">{slot}</p> : <p className="text-sm text-muted">1 · Titular (vacío)</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Titular de prueba', 'Otro titular de prueba'].map((t) => (
          <button key={t} type="button" onClick={() => choose(t)} className={`rounded-2xl p-3 text-left text-sm ${slot === t ? 'bg-sky ring-2 ring-sky-strong' : 'bg-surface ring-1 ring-line hover:bg-white'}`}>
            {t}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{!slot ? 'Elige un módulo para el espacio 1.' : !replaced ? 'Ahora reemplázalo por el otro.' : ''}</p>
      {replaced && <Done text="Pusiste un módulo y lo reemplazaste." onDone={onDone} />}
    </div>
  );
}

function PracticeSwipe({ onDone }: PracticeProps) {
  const [result, setResult] = useState<'left' | 'right' | null>(null);
  const swipe = (dir: 'left' | 'right') => setResult(dir);
  return (
    <div className="space-y-3">
      {result !== 'left' && (
        <motion.div
          drag="x"
          dragSnapToOrigin
          onDragEnd={(_: unknown, info: PanInfo) => {
            if (info.offset.x < -90) swipe('left');
            if (info.offset.x > 90) swipe('right');
          }}
          className="cursor-grab rounded-3xl bg-white p-6 text-center shadow-float ring-1 ring-ink/5 active:cursor-grabbing"
        >
          <p className="text-3xl">🐧</p>
          <p className="mt-2 font-display text-lg font-bold">Repartir volantes a pingüinos en la Antártica</p>
        </motion.div>
      )}
      {result === 'right' && <p className="text-sm text-pink-strong">¿Pingüinos? No son tu segmento. Desliza a la izquierda 👈</p>}
      {result !== 'left' && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="soft" onClick={() => swipe('left')}>
            👈 No sirve
          </Button>
          <Button variant="dark" onClick={() => swipe('right')}>
            Sirve 👉
          </Button>
        </div>
      )}
      {result === 'left' && <Done text="¡Bien! Ese canal no le habla a tu segmento." onDone={onDone} />}
    </div>
  );
}

function PracticeMonth({ onDone }: PracticeProps) {
  const [selected, setSelected] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [health, setHealth] = useState(60);
  const [closed, setClosed] = useState(false);
  const close = () => {
    setHealth(75);
    setTimeout(() => setHealth(55), 700);
    setClosed(true);
  };
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-ink/5">
        <p className="font-display font-bold">👨 Tomás · mes de prueba</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-line">
          <motion.div className="h-full rounded-full bg-linear-to-r from-[#ffd76a] to-sun-strong" animate={{ width: `${health}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted">❤️ {health} · desgaste −20 por mes</p>
        {assigned && <p className="mt-2 w-fit rounded-full bg-lavender px-2.5 py-1 text-xs font-semibold text-lavender-strong">📞 Reunión quincenal</p>}
        {!assigned && (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setAssigned(true)}
            className="mt-3 w-full rounded-2xl border-2 border-dashed border-lavender-strong px-3 py-2 text-sm font-semibold text-lavender-strong disabled:border-line disabled:text-muted"
          >
            {selected ? '＋ Asignar aquí · ❤️ +15' : 'Selecciona una carta'}
          </button>
        )}
      </div>
      {!assigned && (
        <button type="button" onClick={() => setSelected(true)} className={`w-full rounded-2xl p-3 text-left text-sm ${selected ? 'bg-lavender ring-2 ring-lavender-strong' : 'bg-white shadow-soft ring-1 ring-ink/5'}`}>
          📞 Reunión quincenal de 30 min · ⏱️ 4 h
        </button>
      )}
      {assigned && !closed && (
        <Button variant="gradient" className="w-full" onClick={close}>
          Cerrar el mes →
        </Button>
      )}
      {closed && <Done text="+15 de la reunión y −20 de desgaste: 60 → 55. Así se juega cada mes." onDone={onDone} />}
    </div>
  );
}

export const PRACTICES: Partial<Record<MechanicId, (props: PracticeProps) => ReactNode>> = {
  quiz: PracticeQuiz,
  chat: PracticeChat,
  nodos: PracticeNodes,
  arrastrar: PracticeDrag,
  swipe: PracticeSwipe,
  turnos: PracticeMonth,
};
