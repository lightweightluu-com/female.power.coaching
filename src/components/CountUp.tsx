import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

type Props = { to: number; from?: number; decimals?: number; className?: string };

const fmt = (v: number, decimals: number) => v.toFixed(decimals).replace('.', ',');

/** Zählt beim Eintritt in den Viewport von `from` nach `to`; mit reduced-motion direkt der Endwert. */
export function CountUp({ to, from = 0, decimals = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : from);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setValue
    });
    return () => controls.stop();
  }, [inView, reduce, from, to]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{fmt(to, decimals)}</span>
      <span aria-hidden>{fmt(value, decimals)}</span>
    </span>
  );
}
