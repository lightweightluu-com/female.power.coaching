import { Phone } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { BOOKING_URL } from '@/lib/config';

const pains = [
  {
    title: 'Du gibst alles – und nichts passiert.',
    text: 'Du trainierst hart, isst «gesund», hältst dein Kaloriendefizit … und nimmst trotzdem nicht ab.'
  },
  {
    title: 'Müde, gestresst, im Heisshunger-Loop.',
    text: 'Energiecrashes und Stresshormone bestimmen deinen Tag, statt dass du ihn bestimmst.'
  },
  {
    title: 'Niemand nimmt dich ernst.',
    text: 'Zyklusschwankungen, PMOS – und von Ärzten kommt nur «leb halt damit» oder die Pille.'
  },
  {
    title: 'Pläne gespeichert. Nach drei Tagen verworfen.',
    text: 'Kalorien getrackt, Cardio gemacht, alles probiert. Das Problem ist die Umsetzung im echten Leben.'
  },
  {
    title: 'Dir fehlt kein Wille. Dir fehlt ein GPS.',
    text: 'Eine Strategie, die dich durch das Informationschaos leitet und dir den richtigen Weg zeigt.'
  }
];

export function PainPoints() {
  return (
    <section id="kennst-du-das" aria-labelledby="pain-title" className="px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Kennst du das auch?</p>
          <h2 id="pain-title" className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
            Jahrelang gekämpft – und trotzdem <span className="italic">nicht da</span>, wo du hinwolltest.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Ronja kennt dieses Gefühl aus eigener Erfahrung: Sie war selbst von ihren PMOS-Symptomen gesteuert
            und blockiert.
          </p>
        </Reveal>

        <ol className="border-t border-line">
          {pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <li className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9">
                <span aria-hidden className="font-display text-2xl tabular-nums text-muted sm:text-3xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{p.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-muted">{p.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-bg sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bg/70">Die gute Nachricht</p>
                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                  Er arbeitet nicht gegen dich – er braucht nur den richtigen Treibstoff.
                </h3>
                <p className="mt-4 max-w-xl text-bg/75">
                  Statt Standard-Plan: eine Methode, die zu deinem Alltag und deinen Hormonen passt. Packen wir
                  es gemeinsam an der Wurzel an.
                </p>
              </div>
              <div className="md:justify-self-end">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-bg px-7 text-lg font-bold text-ink transition-all duration-150 active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-0.5 md:w-auto"
                >
                  <Phone className="size-5" aria-hidden /> Clarity Call buchen
                </a>
                <p className="mt-3 text-center text-xs text-bg/60">40 Min per Anruf · unverbindlich</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
