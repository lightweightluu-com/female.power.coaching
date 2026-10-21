import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

type Props = { text: string; id: string; className?: string };

/** Überschrift, deren Wörter beim Scrollen nacheinander von blass zu voll werden. */
export function TextReveal({ text, id, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const words = text.split(' ');

  return (
    <h2 ref={ref} id={id} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 2 / words.length);
        return reduce ? (
          <span key={i} aria-hidden className="mr-[0.25em] inline-block">{w}</span>
        ) : (
          <span key={i} aria-hidden>
            <Word word={w} progress={scrollYProgress} range={[start, end]} />
          </span>
        );
      })}
    </h2>
  );
}
