import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Results } from '@/components/Results';
import { PainPoints } from '@/components/PainPoints';
import { StickyCta } from '@/components/StickyCta';
import { Footer } from '@/components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Results />
        <PainPoints />
      </main>
      <Footer />
      <StickyCta />
    </MotionConfig>
  );
}
