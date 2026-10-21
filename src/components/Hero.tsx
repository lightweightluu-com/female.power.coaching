import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Clock, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/lib/config';

const ease = [0.22, 1, 0.36, 1] as const;

const item = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease }
});

function RotatingBadge() {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      aria-hidden
      className="size-24 sm:size-28"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
    >
      <defs>
        <path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--lime)" />
      <text fontSize="10" fontWeight="800" letterSpacing="3.4" fill="#1c1410" fontFamily="var(--font-sans)">
        <textPath href="#circ">FEMALE POWER · HORMONE · </textPath>
      </text>
      <circle cx="60" cy="60" r="5" fill="#1c1410" />
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  return (
    <section id="top" ref={ref} className="grain relative isolate overflow-hidden pt-24 sm:pt-28">
      {/* Glow-Hintergrund */}
      <motion.div aria-hidden style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-10 size-[28rem] rounded-full bg-accent-soft/30 blur-[110px]" />
        <div className="absolute -left-32 top-[26rem] size-[22rem] rounded-full bg-lime/30 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-24">
        <div>
          <motion.p
            {...item(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden /> Coaching für Frauen
          </motion.p>

          <motion.h1
            {...item(1)}
            className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Dein Körper arbeitet <span className="marker italic">nicht gegen dich.</span>
          </motion.h1>

          <motion.p {...item(2)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Ketogene Ernährung, hormonelle Balance und ein Coaching, das zu deinem Alltag passt –
            auch mit PMOS. Er braucht nur den richtigen Treibstoff.
          </motion.p>

          <motion.div {...item(3)} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Clarity Call buchen
                <motion.span aria-hidden animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                  →
                </motion.span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#kennst-du-das">
                Kennst du das? <ArrowDown className="size-4" aria-hidden />
              </a>
            </Button>
          </motion.div>

          <motion.ul {...item(4)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
            <li className="flex items-center gap-1.5"><Clock className="size-4 text-accent" aria-hidden /> 40 Min Gespräch</li>
            <li className="flex items-center gap-1.5"><Flame className="size-4 text-accent" aria-hidden /> Kostenlos &amp; unverbindlich</li>
          </motion.ul>
        </div>

        {/* Porträt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-[22rem] lg:max-w-md"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-b-[8rem] border border-line shadow-[0_40px_80px_-30px_rgba(28,20,16,0.55)] lg:rounded-b-[10rem]">
            <motion.img
              src="/images/ronja-hero.webp"
              alt="Ronja, Coach hinter Female Power Coaching, lächelt mit Shaker im Gym"
              width={572}
              height={646}
              style={{ y: imgY, scale: imgScale }}
              className="absolute inset-0 size-full object-cover object-[50%_20%]"
            />
          </div>

          <div className="absolute -right-3 -top-8 sm:-right-8">
            <RotatingBadge />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.7, ease }}
            className="absolute -left-3 bottom-16 rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-10"
          >
            <p className="font-display text-lg font-semibold leading-tight">Kein One-Size-Fits-All</p>
            <p className="text-xs text-muted">Individuelles 1:1 Coaching</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
