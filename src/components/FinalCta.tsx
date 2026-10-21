import { Phone } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { BOOKING_URL, HERO_IMAGE } from '@/lib/config';

/** Abschluss-CTA im selben Farbband wie das Hero. */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-title"
      className="relative isolate overflow-hidden text-[#2b1317]"
      style={{ backgroundImage: 'linear-gradient(135deg, #d3a89c 0%, #c4958a 100%)' }}
    >
      <img
        src={HERO_IMAGE.src}
        alt=""
        width={HERO_IMAGE.width}
        height={HERO_IMAGE.height}
        loading="lazy"
        className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden h-[88%] w-auto max-w-[50%] object-contain object-right-bottom lg:block"
      />
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal className="max-w-xl">
          <h2 id="final-title" className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Bereit für echte Ergebnisse statt der nächsten Theorie?
          </h2>
          <p className="mt-5 text-lg leading-snug sm:text-xl">
            Wir schauen gemeinsam, wie dein individueller Weg aussehen kann.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2b1317] px-8 text-lg font-bold text-[#fbebe7] transition-all duration-150 active:scale-[0.98] sm:w-auto [@media(hover:hover)]:hover:-translate-y-0.5"
          >
            <Phone className="size-5" aria-hidden /> Kostenlosen Clarity Call buchen
          </a>
          <p className="mt-3 text-sm">40 Min per Anruf · unverbindlich</p>
        </Reveal>
      </div>
    </section>
  );
}
