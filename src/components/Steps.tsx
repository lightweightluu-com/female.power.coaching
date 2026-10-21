import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const steps = [
  {
    title: 'Clarity Call buchen',
    text: 'Such dir direkt einen Termin aus: 40 Minuten per Anruf, kostenlos und unverbindlich.'
  },
  {
    title: 'Dein Ziel klären',
    text: 'Wir sprechen über deine Ausgangslage und klären, welches Angebot zu deinem Ziel passt – und ob und wie ich dich unterstützen kann.'
  },
  {
    title: 'Umsetzen mit 1:1 Support',
    text: 'Du bekommst deinen individuellen Fahrplan. Wir adjustieren ihn Schritt für Schritt und ich halte dich motiviert.'
  }
];

export function Steps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="ablauf" aria-labelledby="steps-title" className="bg-surface px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="steps-title" eyebrow="Der Ablauf">
          In drei Schritten zu deinem individuellen Weg.
        </SectionHeading>

        <ol ref={ref} className="relative mt-12 max-w-2xl">
          <span aria-hidden className="absolute left-[1.375rem] top-2 h-[calc(100%-1rem)] w-px bg-line" />
          <motion.span
            aria-hidden
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-[1.375rem] top-2 h-[calc(100%-1rem)] w-px bg-ink"
          />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={0.04}>
              <li className="relative grid grid-cols-[2.75rem_1fr] gap-5 pb-12 last:pb-0">
                <span className="relative z-10 grid size-11 place-items-center rounded-full bg-ink font-display text-lg font-semibold text-bg">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-display text-2xl font-semibold sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
