import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const rows = [
  { label: 'Körpergewicht', from: '66 kg', to: '61,1 kg' },
  { label: 'Taillenumfang', from: '86 cm', to: '81 cm' },
  { label: 'Bauchumfang', from: '93 cm', to: '88 cm' }
];

const before = ['Störendes Rumpffett', 'Fehlende Motivation', 'Hohes Stresspensum', 'Verspannungen & Müdigkeit'];
const after = ['Voller Energie im Alltag', 'Spürbar gesenkter Stress', '5 cm weniger Taille & Bauch', '5 kg weniger Körpergewicht'];

const quotes = [
  'Obwohl diese Woche emotional wie auch körperlich sehr anstrengend war (PMS, super erschöpft), habe ich es trotzdem durchgezogen. Ich glaube, normalerweise wäre dies der Zeitpunkt, wo ich einfach aufgeben würde. Das finde ich sehr positiv!!',
  'Ich sehe die Veränderungen nicht nur auf der Waage, sondern besonders an meiner Kleidung. Ausserdem fangen auch schon andere Leute an zu bemerken, dass ich abgenommen habe. Und durch das Training habe ich sogar weniger Kreuzschmerzen!'
];

export function Proof() {
  return (
    <section id="ergebnisse" aria-labelledby="proof-title" className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="proof-title" eyebrow="Ergebnisse">
          Francy: «Ich schaffe es nicht, etwas durchzuziehen!» – 56 Tage später.
        </SectionHeading>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-[0_2px_4px_rgba(43,19,23,0.05),0_12px_24px_rgba(43,19,23,0.07)] sm:p-9">
              <p className="text-sm font-semibold text-muted">Körperdaten aus der App · 15.6. → 9.8.2026</p>
              <table className="mt-4 w-full text-left">
                <caption className="sr-only">Francys Körperdaten zu Beginn und nach 56 Tagen</caption>
                <thead className="sr-only">
                  <tr><th>Messwert</th><th>Start</th><th>Nach 56 Tagen</th></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th scope="row" className="py-4 pr-2 text-sm font-medium sm:text-base">{r.label}</th>
                      <td className="py-4 text-right tabular-nums text-muted line-through decoration-muted/50">{r.from}</td>
                      <td className="w-8 py-4 text-center text-muted"><ArrowRight className="mx-auto size-4" aria-label="auf" /></td>
                      <td className="py-4 text-right font-display text-xl font-semibold tabular-nums sm:text-2xl">{r.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Vorher</p>
                  <ul className="mt-2 space-y-1.5 text-sm">{before.map((b) => <li key={b}>– {b}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Nachher</p>
                  <ul className="mt-2 space-y-1.5 text-sm font-medium">{after.map((a) => <li key={a}>+ {a}</li>)}</ul>
                </div>
              </div>
              <p className="mt-auto pt-6 text-xs text-muted">
                8 Wochen Coaching, davon 6 Wochen im Kaloriendefizit. Individuelles Ergebnis, es gibt keine Garantie.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6">
            {quotes.map((q, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <figure className="flex h-full flex-col justify-between rounded-3xl bg-ink p-6 text-bg sm:p-9">
                  <blockquote className="font-display text-xl leading-snug sm:text-2xl">«{q}»</blockquote>
                  <figcaption className="mt-5 text-sm text-bg/70">Francy · Wöchentlicher Win im Coaching</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
