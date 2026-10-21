import { useRef, type AnchorHTMLAttributes, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Props = AnchorHTMLAttributes<HTMLAnchorElement>;

/** Link, der sich auf Geräten mit Maus leicht zum Zeiger hin bewegt. Touch bleibt unberührt. */
export function MagneticLink({ children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} {...(rest as object)}>
      {children}
    </motion.a>
  );
}
