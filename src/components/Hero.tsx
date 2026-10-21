import { motion } from 'framer-motion';
import { ArrowDown, Phone } from 'lucide-react';
import { BOOKING_URL, HERO_IMAGE } from '@/lib/config';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

const item = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.08 + i * 0.07, ease }
});

/**
 * Hero nach dem Vorbild der Referenz: vollflächiges Farbband, grosse Serif-Headline
 * links oben, Porträt rechts unten, überlappende Zitat-/CTA-Karte.
 * Farben sind bewusst fest (Marken-Band), damit der Hero in Hell und Dunkel gleich wirkt.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-[#efc3ae] text-[#1c1410]"
      style={{ backgroundImage: 'linear-gradient(160deg, #f4d0bd 0%, #e9ad93 100%)' }}
    >
      {/* Porträt – rechts unten verankert */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-full lg:block"
      >
        <img
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          width={572}
          height={646}
          fetchPriority="high"
          className={cn(
            'absolute bottom-0 right-0 h-full w-[52%] max-w-[46rem]',
            HERO_IMAGE.cutout
              ? 'object-contain object-bottom'
              : 'object-cover object-[50%_18%] [mask-image:linear-gradient(to_right,transparent,#000_30%)]'
          )}
        />
      </motion.div>

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-24 sm:pt-28 lg:min-h-[46rem] lg:pb-32 lg:pt-36">
        <div className="lg:max-w-[40rem]">
          <motion.h1
            {...item(0)}
            className="font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl"
          >
            Dein Körper arbeitet <span className="italic">nicht gegen dich!</span>
          </motion.h1>

          <motion.p {...item(1)} className="mt-5 max-w-lg text-lg leading-snug sm:text-xl">
            Ketogene Ernährung, hormonelle Balance und Coaching, das zu deinem Alltag passt –
            auch mit PMOS.
          </motion.p>
        </div>

        {/* Mobil: Porträt zwischen Text und Karte */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="relative -mx-5 mt-6 h-[22rem] overflow-hidden sm:mx-auto sm:max-w-md lg:hidden"
        >
          <img
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            width={572}
            height={646}
            fetchPriority="high"
            className={cn(
              'absolute inset-0 size-full',
              HERO_IMAGE.cutout
                ? 'object-contain object-bottom'
                : 'object-cover object-[50%_15%] [mask-image:linear-gradient(to_bottom,transparent,#000_22%)]'
            )}
          />
        </motion.div>

        {/* Zitat- und CTA-Karte */}
        <motion.div
          {...item(3)}
          className="relative -mt-16 overflow-hidden rounded-2xl shadow-[0_2px_4px_rgba(28,20,16,0.12),0_12px_24px_rgba(28,20,16,0.14),0_32px_64px_-12px_rgba(28,20,16,0.3)] lg:mt-10 lg:max-w-[42rem]"
        >
          <figure className="bg-[#fce8e2] px-6 py-4 text-center text-[0.95rem] leading-snug">
            <blockquote>
              „Ich sehe die Veränderungen nicht nur auf der Waage, sondern besonders an meiner Kleidung.“
            </blockquote>
            <figcaption className="mt-1 text-xs font-semibold text-[#6b5b50]">
              Francy, nach 8 Wochen Coaching
            </figcaption>
          </figure>
          <div className="bg-[#1c1410] p-5 text-center text-[#faf5ee] sm:p-6">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-lime text-lg font-bold text-[#1c1410] transition-all duration-150 active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_10px_30px_-8px_#e4f01c]"
            >
              <Phone className="size-5" aria-hidden /> Kostenlosen Clarity Call buchen
            </a>
            <p className="mt-3 text-sm text-[#faf5ee]/70">40 Min per Anruf · unverbindlich</p>
          </div>
        </motion.div>

        <motion.a
          {...item(4)}
          href="#kennst-du-das"
          className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Erkennst du dich wieder? <ArrowDown className="size-4" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}
