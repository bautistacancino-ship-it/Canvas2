import { cardClass } from '@/components/ui/Card';
import type { MonthReport } from '@/lib/accounts';
import { formatCoins } from '@/lib/scoring';
import type { AccountsConfig } from '@/types/game';
import { T } from '@/components/glossary/Terms';

/** Informe al cerrar un mes: cómo cambió la salud de cada cliente y por qué. */
export function MonthReportView({ config, report, revealHints }: { config: AccountsConfig; report: MonthReport; revealHints: boolean }) {
  return (
    <div className="space-y-4">
      {report.eventText && (
        <p className={`rounded-2xl p-3 text-sm ${report.eventCorrect ? 'bg-lime' : 'bg-pink'}`}>
          <b>{report.eventCorrect ? '💚 +' + config.rewards.perCorrectEvent + ' Lealtad' : '✗'}</b> · <T>{report.eventText}</T> → <T>{report.eventOutcome}</T>
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {config.clients.map((c) => {
          const r = report.clients[c.id];
          const delta = r.end - r.start;
          return (
            <section key={c.id} className={`${cardClass} p-4 ${r.lost ? 'opacity-60' : ''}`}>
              <p className="font-display text-lg font-bold">
                {c.avatar} {c.name}
              </p>
              <p className="font-display text-3xl font-bold tabular-nums">
                {r.start} → {r.lost ? '0' : r.end}{' '}
                <span className={`text-lg ${delta >= 0 ? 'text-lime-strong' : 'text-pink-strong'}`}>({delta >= 0 ? `+${delta}` : delta})</span>
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {r.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-2 rounded-lg bg-surface px-2 py-1">
                    <span className="text-ink/70">{item.label}</span>
                    <span className={`font-semibold ${item.delta >= 0 ? 'text-lime-strong' : 'text-pink-strong'}`}>{item.delta > 0 ? `+${item.delta}` : item.delta}</span>
                  </li>
                ))}
              </ul>
              {r.red && <p className="mt-2 text-xs font-bold text-pink-strong">⚠️ Terminó el mes en rojo</p>}
              {r.costAlert && <p className="mt-1 text-xs font-bold text-sun-strong">💸 Te costó más de lo que paga</p>}
            </section>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-white px-3 py-1 font-semibold shadow-soft">⏱️ {report.hoursUsed}/{report.hoursAvailable} h usadas</span>
        <span className="rounded-full bg-white px-3 py-1 font-semibold shadow-soft">🔋 Energía {report.energy}%</span>
        <span className="rounded-full bg-white px-3 py-1 font-semibold shadow-soft">💵 Ingreso mensual {formatCoins(report.mrr)}</span>
      </div>
      {report.notes.map((n) => (
        <p key={n} className="rounded-2xl bg-sun p-3 text-sm">
          📌 <T>{n}</T>
        </p>
      ))}
      {revealHints && (
        <section className="rounded-[28px] bg-sky p-4">
          <p className="font-display font-bold">🔍 Pistas: ya sabes qué valora cada cliente</p>
          <ul className="mt-2 space-y-1 text-sm">
            {config.clients.map((c) => (
              <li key={c.id}>
                {c.avatar} <b>{c.name}</b> ({c.plan}, {formatCoins(c.fee)}/mes): <T>{c.values}</T>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
