import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Phone } from 'lucide-react';
import { MagneticLink } from '@/components/MagneticLink';
import { BOOKING_URL, HERO_IMAGE } from '@/lib/config';

const ease = [0.22, 1, 0.36, 1] as const;

const item = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.45 + i * 0.07, ease }
});

/** Headline: jedes Wort fährt aus einer Maske nach oben. */
function Headline() {
  const lines = [
    { words: ['Dein', 'Körper', 'arbeitet'], italic: false },
    { words: ['nicht', 'gegen', 'dich!'], italic: true }
  ];
  let n = 0;
  return (
    <h1 className="font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
      {lines.map((l) => (
        <span key={l.words[0]} className={l.italic ? 'block font-script text-[1.5em] font-normal leading-[0.95] tracking-normal' : 'block'}>
          {l.words.map((w) => (
            <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + n++ * 0.06, ease }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/**
 * Hero nach dem Vorbild der Referenz: vollflächiges Farbband, grosse Serif-Headline
 * links oben, freigestelltes Porträt rechts unten, überlappende Zitat-/CTA-Karte.
 * Dazu Tiefe: grosse Schrift hinter dem Cutout, Parallax beim Scrollen.
 * Farben sind bewusst fest (Marken-Band), damit der Hero in Hell und Dunkel gleich wirkt.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  const photo = (
    <img
      src={HERO_IMAGE.src}
      alt={HERO_IMAGE.alt}
      width={HERO_IMAGE.width}
      height={HERO_IMAGE.height}
      fetchPriority="high"
      className="size-full object-contain object-bottom lg:object-right-bottom"
    />
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate overflow-hidden text-[#2b1317]"
      style={{ backgroundImage: 'linear-gradient(135deg, #d3a89c 0%, #c4958a 100%)' }}
    >
      {/* Grosse Schrift hinter dem Cutout: erzeugt Tiefe */}
      <motion.p
        aria-hidden
        style={{ y: wordY }}
        className="pointer-events-none absolute -right-[3%] top-[20%] -z-20 select-none font-script text-[clamp(8rem,26vw,24rem)] font-normal leading-none text-[#fbebe7]/30 sm:top-[8%]"
      >
        Power
      </motion.p>

      {/* Desktop: Porträt rechts unten verankert */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        style={{ y: photoY }}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden h-[92%] w-[54%] max-w-[52rem] lg:block"
      >
        {photo}
      </motion.div>

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-24 sm:pt-28 lg:min-h-[46rem] lg:pb-32 lg:pt-36">
        <div className="lg:max-w-[40rem]">
          <Headline />
          <motion.p {...item(0)} className="mt-5 max-w-lg text-lg leading-snug sm:text-xl">
            Ketogene Ernährung, hormonelle Balance und Coaching, das zu deinem Alltag passt –
            auch mit PMOS.
          </motion.p>
        </div>

        {/* Mobil: Porträt zwischen Text und Karte */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="-mx-5 mt-4 h-[23rem] sm:mx-auto sm:max-w-md lg:hidden"
        >
          {photo}
        </motion.div>

        {/* Zitat- und CTA-Karte */}
        <motion.div
          {...item(2)}
          className="surface-dark relative -mt-14 overflow-hidden rounded-2xl shadow-[0_2px_4px_rgba(43,19,23,0.12),0_12px_24px_rgba(43,19,23,0.14),0_32px_64px_-12px_rgba(43,19,23,0.3)] lg:mt-10 lg:max-w-[42rem]"
        >
          <figure className="bg-[#fbebe7] px-6 py-4 text-center text-[0.95rem] leading-snug">
            <blockquote>
              „Ich sehe die Veränderungen nicht nur auf der Waage, sondern besonders an meiner Kleidung.“
            </blockquote>
            <figcaption className="mt-1 text-xs font-semibold text-[#6e5156]">
              Francy, nach 8 Wochen Coaching
            </figcaption>
          </figure>
          <div className="bg-[#2b1317] p-5 text-center text-[#fbebe7] sm:p-6">
            <MagneticLink
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#fbebe7] text-lg font-bold text-[#2b1317] transition-colors duration-150 active:scale-[0.98] hover:bg-white"
            >
              <Phone className="size-5" aria-hidden /> Kostenlosen Clarity Call buchen
            </MagneticLink>
            <p className="mt-3 text-sm text-[#fbebe7]/70">40 Min per Anruf · unverbindlich</p>
          </div>
        </motion.div>

        <motion.a
          {...item(3)}
          href="#kennst-du-das"
          className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Erkennst du dich wieder? <ArrowDown className="size-4" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}
