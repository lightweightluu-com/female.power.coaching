import { Reveal } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';

const stats = [
  { to: 5, prefix: '−', unit: 'kg', label: 'Körpergewicht' },
  { to: 5, prefix: '−', unit: 'cm', label: 'Taille & Bauch' },
  { to: 56, prefix: '', unit: 'Tage', label: 'Coaching-Zeit' }
];

/** Zähler-Karte direkt unter dem Hero (überlappt das Farbband). */
export function Results() {
  return (
    <section aria-labelledby="results-title" className="relative z-10 -mt-16 px-5">
      <Reveal className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-line bg-surface p-6 text-center shadow-[0_2px_4px_rgba(28,20,16,0.06),0_12px_24px_rgba(28,20,16,0.08),0_32px_64px_-16px_rgba(28,20,16,0.2)] sm:p-10">
          <h2 id="results-title" className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Francys Ergebnis in 8 Wochen Coaching
          </h2>
          <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-4xl font-semibold tabular-nums sm:text-6xl">
                  {s.prefix}
                  <CountUp to={s.to} />
                  <span className="ml-1 text-lg font-medium text-muted sm:text-2xl">{s.unit}</span>
                </dd>
                <dt className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-muted">Individuelles Ergebnis, 6 Wochen davon im Kaloriendefizit. Es gibt keine Garantie.</p>
        </div>
      </Reveal>
    </section>
  );
}
