import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { PainPoints } from '@/components/PainPoints';
import { StickyCta } from '@/components/StickyCta';
import { Footer } from '@/components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
      </main>
      <Footer />
      <StickyCta />
    </MotionConfig>
  );
}
