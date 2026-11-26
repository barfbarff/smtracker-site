'use client';

// The tracker cards of "Tracks from any tracker", as postage stamps: a perforated paper edge (.sm-stamp in app/global.css), a
// hairline frame inside it, the picture in ink, and the tracker's name with its number in the series underneath. On
// the page each lies tilted and floats slowly, as the cards did (CARD_LAYOUT; still under reduced motion).

import type { CSSProperties } from 'react';
import { CARD_LAYOUT, Picture, type Source } from '@/components/landing/source-cards';

export function StampFace({ s, i, float = false }: { s: Source; i: number; float?: boolean }) {
  const l = CARD_LAYOUT[i];
  return (
    <div
      className={`sm-stamp-shadow size-full ${float ? 'sm-stamp-float' : ''}`}
      style={
        float
          ? ({
              '--r': `${l.r}deg`,
              '--fx': `${l.fx}px`,
              '--fy': `${l.fy}px`,
              '--fr': `${l.fr}deg`,
              '--t': `${l.t}s`,
              '--d': `${l.d}s`,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="sm-stamp @container size-full">
        <div className="flex size-full flex-col border border-(--print-edge) px-[7%] pt-[6%] pb-[5%] @max-[3rem]:px-[2%]">
          {/* under 48 px inside (the smallest phones) a stamp keeps only its name: the picture would be a speck */}
          <div className="ill-ink stamp-picture aspect-square w-full overflow-hidden @max-[3rem]:hidden">
            <Picture kind={s.kind} i={i} />
          </div>
          <div className="mt-auto flex flex-col items-center pt-[5%] text-center @max-[3rem]:my-auto @max-[3rem]:pt-0">
            {/* the full name where it fits on one or two lines; the short one for the long names, and on phones */}
            <span className="font-display text-[clamp(11px,10cqw,22px)] leading-tight text-(--print-ink) @max-[6.5rem]:hidden">
              {s.tag && s.name.length > 16 ? s.tag : s.name}
            </span>
            <span className="hidden font-display text-[11px] leading-tight text-(--print-ink) @max-[6.5rem]:inline @max-[3rem]:text-[clamp(8.5px,16cqw,10px)] @max-[3rem]:whitespace-nowrap">
              {s.tag ?? s.name}
            </span>
            {/* the number only where there is room for it and the picture (from 104 px wide) */}
            <span className="mt-[2%] font-card text-[clamp(10px,4.6cqw,11px)] tracking-[0.1em] text-(--print-ink-soft) uppercase @max-[6.5rem]:hidden">
              No. {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
