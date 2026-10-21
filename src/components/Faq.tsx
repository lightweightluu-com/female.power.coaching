import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const faqs = [
  {
    q: 'Was passiert im Clarity Call?',
    a: 'Wir telefonieren 40 Minuten, unverbindlich. Wir klären, welches Angebot für dein Ziel passt und ob und wie ich dich dabei unterstützen kann.'
  },
  {
    q: 'Ist das Coaching ein Standardplan?',
    a: 'Nein. Ich biete kein One-Size-Fits-All Coaching an. Du bekommst eine klare Strategie und einen massgeschneiderten Fahrplan, der sich an deinen Alltag anpasst – zeiteffizient und zielführend.'
  },
  {
    q: 'Funktioniert das auch mit PMOS?',
    a: 'Genau dafür arbeite ich so: Wir richten Ernährung, Bewegung und Erholung auf die Ausgangslage mit PMOS und auf den weiblichen Hormonhaushalt aus, statt gegen ihn. Das Coaching ersetzt keine ärztliche Behandlung.'
  },
  {
    q: 'Wie eng werde ich betreut?',
    a: 'Persönlich und eng. Du bist nicht auf dich alleine gestellt: Wir adjustieren deinen Weg Schritt für Schritt, mit wöchentlichen Check-ins in der Nutrilize-App.'
  },
  {
    q: 'Was kostet das Coaching?',
    a: 'Das hängt vom Angebot ab, das zu dir und deinem Ziel passt. Im Clarity Call besprechen wir, was für dich sinnvoll ist.'
  },
  {
    q: 'Wie starte ich?',
    a: 'Buche einen Clarity Call. Alternativ schreib mir eine kurze Nachricht über den Link in meiner Instagram-Bio.'
  }
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id="faq-title" eyebrow="FAQ" className="lg:sticky lg:top-28 lg:self-start">
          Häufige Fragen.
        </SectionHeading>

        <Reveal>
          <Accordion.Root type="single" collapsible className="border-t border-line">
            {faqs.map((f) => (
              <Accordion.Item key={f.q} value={f.q} className="border-b border-line">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-xl font-semibold sm:text-2xl">
                    {f.q}
                    <ChevronDown
                      aria-hidden
                      className="size-5 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content overflow-hidden">
                  <p className="max-w-xl pb-6 leading-relaxed text-muted">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
