import { useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

type Props = { before: string; after: string; name: string };

/** Vorher/Nachher-Vergleich: Der Regler lässt sich ziehen oder mit den Pfeiltasten bedienen. */
export function BeforeAfter({ before, after, name }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[4/5] select-none overflow-hidden rounded-2xl bg-line has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-ink">
      <img src={after} alt={`${name}: Nachher`} loading="lazy" draggable={false} className="absolute inset-0 size-full object-cover" />
      <img
        src={before} alt={`${name}: Vorher`} loading="lazy" draggable={false}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-bg">Vorher</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-bg">Nachher</span>

      <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(43,19,23,0.25)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#2b1317] shadow-lg">
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>

      <input
        type="range" min={0} max={100} step={1} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Vorher-Nachher-Vergleich von ${name}`}
        aria-valuetext={`${pos} Prozent Vorher sichtbar`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        style={{ touchAction: 'pan-y' }}
      />
    </div>
  );
}
