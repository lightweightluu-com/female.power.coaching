import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const pillars = [
  {
    title: 'Ketogene Ernährung',
    text: 'Alltagstaugliche Ernährung, die zu deinem Hormonhaushalt passt – mit konkreten Rezepten statt Verzicht und Theorie.'
  },
  {
    title: 'Bewegung & Training',
    text: 'Training, das zu deinem Alltag und deiner Ausgangslage passt, geplant von einer Trainerin mit langjähriger Erfahrung.'
  },
  {
    title: 'Erholung & Routinen',
    text: 'Ernährung, Bewegung und Erholung greifen ineinander. Kleine Routinen haben eine grosse Wirkung.'
  },
  {
    title: 'Enge Begleitung per App',
    text: 'Wöchentliche Check-ins mit deinen Körperdaten in der Nutrilize-App. So adjustieren wir deinen Weg Schritt für Schritt.'
  }
];

const principles = ['Klare Strategie & massgeschneiderter Fahrplan', 'Enge & persönliche Betreuung', 'Hormonell abgestimmt'];

export function Pillars() {
  return (
    <section id="coaching" aria-labelledby="coaching-title" className="px-5 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="coaching-title" eyebrow="Female Power Coaching">
          Kein Standard-Plan. Ein Fahrplan, der zu dir und deinen Hormonen passt.
        </SectionHeading>

        <Reveal delay={0.05}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {principles.map((p) => (
              <li key={p} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 grid gap-x-16 border-t border-line md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.06}>
              <article className="border-b border-line py-8">
                <p aria-hidden className="font-display text-sm tabular-nums text-muted">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{p.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
