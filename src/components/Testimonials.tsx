import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BeforeAfter } from '@/components/BeforeAfter';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

interface Testimonial {
  id: string;
  name: string;
  result: string;
  text: string;
  before: string;
  after: string;
}

/** Erfahrungsberichte aus dem Admin. Ohne veröffentlichte Berichte bleibt die Sektion unsichtbar. */
export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/testimonials', { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Testimonial[]>) : []))
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  if (items.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section id="erfahrungen" aria-labelledby="exp-title" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading id="exp-title" eyebrow="Erfahrungen">
            Das sagen Frauen, die ihren Weg gegangen sind.
          </SectionHeading>
          {items.length > 1 && (
            <div className="hidden gap-2 sm:flex">
              <button type="button" onClick={() => scrollBy(-1)} aria-label="Vorheriger Bericht" className="grid size-12 cursor-pointer place-items-center rounded-full border border-line hover:bg-bg"><ArrowLeft className="size-5" aria-hidden /></button>
              <button type="button" onClick={() => scrollBy(1)} aria-label="Nächster Bericht" className="grid size-12 cursor-pointer place-items-center rounded-full border border-line hover:bg-bg"><ArrowRight className="size-5" aria-hidden /></button>
            </div>
          )}
        </div>
      </div>

      <Reveal>
        <div
          ref={track}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          role="region"
          aria-label="Erfahrungsberichte, seitlich scrollbar"
        >
          {items.map((t) => (
            <article key={t.id} className="w-[85%] shrink-0 snap-center rounded-3xl border border-line bg-bg p-4 sm:w-[23rem] sm:snap-start sm:p-5">
              <BeforeAfter before={t.before} after={t.after} name={t.name} />
              {t.result && <p className="mt-5 font-display text-3xl font-semibold leading-tight">{t.result}</p>}
              {t.text && <p className="mt-3 leading-relaxed text-muted">«{t.text}»</p>}
              <p className="mt-4 text-sm font-semibold">{t.name}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
