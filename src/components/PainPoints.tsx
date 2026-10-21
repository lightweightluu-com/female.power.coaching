import { Activity, BatteryLow, HeartCrack, Map, Repeat } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SpotlightCard } from '@/components/SpotlightCard';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

const pains = [
  {
    icon: Activity,
    title: 'Du gibst alles – und nichts passiert.',
    text: 'Du trainierst hart, isst «gesund», hältst dein Kaloriendefizit … und nimmst trotzdem nicht ab.',
    span: 'md:col-span-2'
  },
  {
    icon: BatteryLow,
    title: 'Müde, gestresst, im Heisshunger-Loop.',
    text: 'Energiecrashes und Stresshormone bestimmen deinen Tag, statt dass du ihn bestimmst.',
    span: ''
  },
  {
    icon: HeartCrack,
    title: 'Niemand nimmt dich ernst.',
    text: 'Zyklusschwankungen, PMOS – und von Ärzten kommt nur «leb halt damit» oder die Pille.',
    span: ''
  },
  {
    icon: Repeat,
    title: 'Pläne gespeichert. Nach drei Tagen verworfen.',
    text: 'Kalorien getrackt, Cardio gemacht, alles probiert – das Problem ist die Umsetzung im echten Leben.',
    span: ''
  },
  {
    icon: Map,
    title: 'Dir fehlt kein Wille. Dir fehlt ein GPS.',
    text: 'Eine Strategie, die dich durch das Informationschaos leitet und dir den richtigen Weg zeigt.',
    span: 'md:col-span-2'
  }
];

export function PainPoints() {
  return (
    <section id="kennst-du-das" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Kennst du das auch?</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Jahrelang <span className="italic">gekämpft</span> – und trotzdem nicht da, wo du hinwolltest.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Wenn du dich hier wiedererkennst: Du bist nicht allein. Ronja kennt dieses Gefühl aus eigener
            Erfahrung – sie war selbst von ihren PMOS-Symptomen gesteuert und blockiert.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className={cn(p.span)}>
              <SpotlightCard className="h-full">
                <span className="grid size-12 place-items-center rounded-2xl bg-sand text-accent">
                  <p.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}

          <Reveal delay={0.1} className="md:col-span-3">
            <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-bg sm:p-12">
              <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full bg-accent-soft/40 blur-[90px]" />
              <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-lime">Die gute Nachricht</p>
                  <h3 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                    Er arbeitet nicht gegen dich – er braucht nur den richtigen Treibstoff.
                  </h3>
                  <p className="mt-4 max-w-xl text-bg/75">
                    Statt Standard-Plan: eine Methode, die zu deinem Alltag und deinen Hormonen passt.
                    Packen wir es gemeinsam an der Wurzel an.
                  </p>
                </div>
                <div className="md:justify-self-end">
                  <Button asChild size="lg" className="w-full md:w-auto">
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                      Clarity Call buchen
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-bg/60">40 Min · unverbindlich</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
