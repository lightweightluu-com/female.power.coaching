import { Dumbbell, GraduationCap, Medal } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const credentials = [
  { icon: Medal, text: 'Spezialistin für Bewegung & Gesundheitsförderung' },
  { icon: Dumbbell, text: 'Langjährige Erfahrung als Trainerin' },
  { icon: GraduationCap, text: 'Weiterbildungen in ketogener Ernährung und hormonellem Stoffwechsel' }
];

export function About() {
  return (
    <section id="ueber-ronja" aria-labelledby="about-title" className="bg-surface px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-line shadow-[0_2px_4px_rgba(43,19,23,0.06),0_12px_24px_rgba(43,19,23,0.08),0_32px_64px_-16px_rgba(43,19,23,0.2)]">
            <img
              src="/images/ronja-training.webp"
              alt="Ronja beim Training mit der Langhantel"
              width={900}
              height={733}
              loading="lazy"
              className="aspect-[4/4.2] size-full object-cover object-[50%_20%]"
            />
          </div>
        </Reveal>

        <div>
          <SectionHeading id="about-title" eyebrow="Über Ronja">
            Hi, ich bin Ronja – das Gesicht hinter Female Power Coaching.
          </SectionHeading>

          <Reveal delay={0.05} className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              Ich weiss genau, wie du dich gerade fühlst: Vor einigen Jahren war ich selbst regelrecht gesteuert
              und blockiert von meinen PMOS-Symptomen. Jahrelanger Frust mit Gewichtszunahme, Müdigkeit und
              Zyklusschwankungen prägten meinen Alltag – trotz Hyperfokus auf Sport und «gesunde» Ernährung.
            </p>
            <p>
              Erst die Umstellung auf eine ketogene Ernährung brachte den Durchbruch: Meine Symptome verschwanden,
              ich gewann meine Lebensqualität zurück und konnte endlich den körperlichen Fortschritt erreichen,
              für den ich so lange so hart trainiert habe.
            </p>
            <p>
              Heute verbinde ich meine persönliche Erfahrung mit fundiertem Fachwissen und zeige dir, wie du
              deinen Körper optimal unterstützt. Packen wir es gemeinsam an der Wurzel an!
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {credentials.map((c) => (
                <li key={c.text} className="flex items-start gap-3 font-medium">
                  <c.icon className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
                  {c.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
