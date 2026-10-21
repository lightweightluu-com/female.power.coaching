import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart } from 'lucide-react';
import { BOOKING_URL } from '@/lib/config';

/** Mobiler Sticky-CTA am unteren Bildschirmrand, erscheint nach dem Hero. */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden"
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-accent text-base font-semibold text-on-accent shadow-[0_14px_40px_-8px_rgba(0,0,0,0.45)] active:scale-[0.98]"
          >
            <CalendarHeart className="size-5" aria-hidden />
            Clarity Call buchen · unverbindlich
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
