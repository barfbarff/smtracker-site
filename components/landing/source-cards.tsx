'use client';

// Chapter 1's first state: eight trackers, as stamps loose on the page (components/landing/stamp.tsx). Each is
// tilted its own way and floats on its own slow loop (CARD_LAYOUT; still under reduced motion), and each has
// its own small picture. The pictures are original and only decorative: different kinds of movement drawn
// in the site's spot-and-track style, not claims about what each tracker does. Each draws its track once,
// as the stamps arrive (TracksPlay), then keeps it.
//
// The pictures are computed once from a seeded generator, with only exact arithmetic (no trig, no
// logarithms), so the server and the browser draw the same numbers.

import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

type Kind = 'gap' | 'detections' | 'free' | 'crowd' | 'directed' | 'confined' | 'cloud' | 'table';

export type Source = {
  name: string;
  /** the name on the smallest cards, where the full one does not fit */
  tag?: string;
  kind: Kind;
  /** read by SMTracker 2 already (everything else is new in SMTracker 3, your own table too) */
  v2?: boolean;
  /** the open slot: your own table, described in a small JSON file */
  own?: boolean;
};

export const SOURCES: Source[] = [
  { name: 'u-track', kind: 'gap', v2: true },
  { name: 'TrackMate', kind: 'detections', v2: true },
  { name: 'trackpy', kind: 'free' },
  { name: 'MOSAIC ParticleTracker', tag: 'MOSAIC', kind: 'crowd' },
  { name: 'TrackIt', kind: 'directed' },
  { name: 'Spot-On', kind: 'confined' },
  { name: 'evalSPT / SLIMfast', tag: 'evalSPT', kind: 'cloud' },
  { name: 'your own table', tag: 'your table', kind: 'table', own: true },
];

/**
 * Where each card sits, in % of the figure (which is 10 : 9), and how it floats: two loose rows of four,
 * every card a little off the line and tilted its own way. `r` tilt in degrees; `fx`/`fy`/`fr` how far
 * the float takes it; `t` the float's period in seconds; `d` its phase (a negative delay).
 */
export const CARD_LAYOUT = [
  { left: 3, top: 15, r: -7, fx: 4, fy: -9, fr: 1.5, t: 4.7, d: -1.0 },
  { left: 27, top: 9, r: 4, fx: -5, fy: -7, fr: -1.2, t: 5.6, d: -3.1 },
  { left: 51.5, top: 13, r: -3, fx: 3, fy: -10, fr: 1, t: 4.2, d: -1.7 },
  { left: 76.5, top: 11, r: 5, fx: -4, fy: -8, fr: -1.5, t: 5.1, d: -4.0 },
  { left: 5, top: 52, r: 3, fx: 5, fy: -8, fr: -1, t: 5.3, d: -2.5 },
  { left: 28.5, top: 56, r: -5, fx: -3, fy: -10, fr: 1.4, t: 4.4, d: -0.4 },
  { left: 52.5, top: 50, r: 6, fx: 4, fy: -7, fr: -1.2, t: 4.9, d: -3.5 },
  { left: 76, top: 54, r: -3, fx: -5, fy: -9, fr: 1, t: 5.8, d: -2.2 },
];
export const CARD_W = 20.5; // % of the figure's width
export const CARD_H = 30; // % of its height (the cards are about 3 : 4)

/* ---------- the pictures ---------- */

type Pt = [number, number];
const S = 40; // the picture's own units, 40 × 40

function rng(seed: number) {
  // a Lehmer generator; small seeds start with tiny values, so it is spread and warmed up first
  let s = (seed * 48271) % 2147483647;
  for (let k = 0; k < 8; k++) s = (s * 16807) % 2147483647;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
const r1 = (v: number) => Math.round(v * 10) / 10;
const clampTo = (v: number, lo = 5, hi = S - 5) => Math.min(hi, Math.max(lo, v));

/** a random walk: `step` long steps, a `drift` per step, and a pull back to `home` when `hold` > 0 */
function walk(seed: number, n: number, start: Pt, step: number, drift: Pt = [0, 0], hold = 0): Pt[] {
  const next = rng(seed);
  const pts: Pt[] = [start];
  let [x, y] = start;
  for (let k = 1; k < n; k++) {
    x = clampTo(x + (next() * 2 - 1) * step + drift[0] + (start[0] - x) * hold);
    y = clampTo(y + (next() * 2 - 1) * step + drift[1] + (start[1] - y) * hold);
    pts.push([r1(x), r1(y)]);
  }
  return pts;
}
const pathOf = (pts: Pt[]) => pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x} ${y}`).join(' ');

/** a camera spot: a soft lit square under a bright one, as in the title cells */
function Spot({ at, big = false }: { at: Pt; big?: boolean }) {
  const a = big ? 3.2 : 2.4;
  return (
    <g>
      <rect x={at[0] - a} y={at[1] - a} width={a * 2} height={a * 2} rx="0.6" fill="var(--ill-grid)" />
      <rect x={at[0] - a / 2} y={at[1] - a / 2} width={a} height={a} rx="0.3" fill="var(--ill-spot-strong)" />
    </g>
  );
}

/** true while the cards are on screen: their tracks draw in (once), and again whenever the cards come back */
export const TracksPlay = createContext(false);

/** a track that draws itself in once (.sm-draw) while TracksPlay is on; `t`/`d` its duration and delay */
function Track({ pts, t, d, dashed = false, thin = false }: { pts: Pt[]; t: number; d: number; dashed?: boolean; thin?: boolean }) {
  const play = useContext(TracksPlay);
  if (dashed) {
    return <path d={pathOf(pts)} fill="none" stroke="var(--ill-line)" strokeWidth="0.9" strokeDasharray="1.4 1.6" strokeLinecap="round" />;
  }
  return (
    <path
      d={pathOf(pts)}
      pathLength={1}
      fill="none"
      stroke="var(--ill-track)"
      strokeWidth={thin ? 1 : 1.4}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={play ? 'sm-draw' : undefined}
      style={{ '--t': `${t}s`, '--d': `${d}s` } as CSSProperties}
    />
  );
}

const Cell = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={Math.min(w, h) / 2} fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="0.8" />
);

// every picture, computed once
const free = walk(11, 16, [12, 26], 4.2);
const gapA = walk(23, 7, [7, 30], 3.4, [1.2, -0.8]);
const gapB = walk(29, 7, [24, 17], 3.4, [1.1, -0.6]);
const detections = walk(37, 6, [9, 12], 3, [4.2, 3.6]);
const crowd = [
  [10, 11],
  [27, 9],
  [17, 20],
  [31, 24],
  [9, 29],
  [22, 32],
].map(([x, y], k) => walk(41 + k * 7, 5, [x, y], 2.6));
const directed = walk(53, 12, [6, 32], 2.2, [2.6, -2.1]);
const confined = walk(61, 26, [20, 20], 2.4, [0, 0], 0.35);
const cloudNext = rng(71);
const cloud: Pt[] = [
  [13, 15],
  [27, 13],
  [20, 27],
].flatMap(([cx, cy]) =>
  Array.from({ length: 14 }, (): Pt => {
    // a sum of three uniforms: roughly normal, without logarithms
    const gx = (cloudNext() + cloudNext() + cloudNext() - 1.5) * 4;
    const gy = (cloudNext() + cloudNext() + cloudNext() - 1.5) * 4;
    return [r1(clampTo(cx + gx, 3, 37)), r1(clampTo(cy + gy, 3, 37))];
  }),
);
const cloudTrack = walk(79, 6, [16, 18], 2.4);

export function Picture({ kind, i }: { kind: Kind; i: number }) {
  const t = 1.1 + (i % 3) * 0.2; // each picture draws on its own beat, just after its card has arrived
  const d = 1.05 + i * 0.08; // after its stamp has been dealt and landed (DEAL in chapter-analysis.tsx)
  const last = (pts: Pt[]) => pts[pts.length - 1];
  let body: ReactNode = null;
  switch (kind) {
    case 'free':
      body = (
        <>
          <Track pts={free} t={t} d={d} />
          <Spot at={last(free)} big />
        </>
      );
      break;
    case 'gap':
      // a track, a frame or two where the spot is lost, and the same track again
      body = (
        <>
          <Track pts={gapA} t={t} d={d} />
          <Track pts={[last(gapA), gapB[0]]} t={t} d={d} dashed />
          <Track pts={gapB} t={t} d={d + t * 0.8} />
          <Spot at={last(gapB)} big />
        </>
      );
      break;
    case 'detections':
      body = (
        <>
          <Track pts={detections} t={t} d={d} />
          {detections.map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r="2.6" fill="none" stroke="var(--ill-line)" strokeWidth="0.7" />
          ))}
          <Spot at={last(detections)} />
        </>
      );
      break;
    case 'crowd':
      body = (
        <>
          {crowd.map((pts, k) => (
            <g key={k}>
              <Track pts={pts} t={t * 0.7} d={d + k * 0.08} thin />
              <Spot at={last(pts)} />
            </g>
          ))}
        </>
      );
      break;
    case 'directed':
      body = (
        <>
          <Cell x={3} y={10} w={34} h={20} />
          <Track pts={directed.map(([x, y]): Pt => [x, clampTo(y, 13, 27)])} t={t} d={d} />
          <Spot at={[last(directed)[0], clampTo(last(directed)[1], 13, 27)]} big />
        </>
      );
      break;
    case 'confined':
      body = (
        <>
          <Cell x={6} y={9} w={28} h={22} />
          <Track pts={confined} t={t} d={d} thin />
          <Spot at={last(confined)} big />
        </>
      );
      break;
    case 'cloud':
      body = (
        <>
          {cloud.map(([x, y], k) => (
            <rect key={k} x={x - 0.6} y={y - 0.6} width="1.2" height="1.2" fill="var(--ill-spot-strong)" opacity="0.75" />
          ))}
          <Track pts={cloudTrack} t={t} d={d} />
        </>
      );
      break;
    case 'table':
      // a small table of numbers: the columns your file has, named in format.json
      body = (
        <g fill="none" stroke="var(--ill-line)" strokeWidth="0.8">
          <rect x="7" y="8" width="26" height="24" rx="2" fill="var(--ill-paper)" />
          <path d="M7 14H33M7 20H33M7 26H33M15.5 8V32M24.5 8V32" />
          <path d="M9 11H13.5M18 11H22.5M27 11H31" stroke="var(--ill-track)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
      break;
  }
  return (
    <svg viewBox={`0 0 ${S} ${S}`} aria-hidden="true" className="block size-full">
      <defs>
        <pattern id={`sm-px-${i}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M4 0V4M0 4H4" fill="none" stroke="var(--ill-grid)" strokeWidth="0.25" />
        </pattern>
      </defs>
      <rect width={S} height={S} fill="var(--ill-ground)" />
      <rect width={S} height={S} fill={`url(#sm-px-${i})`} />
      {body}
    </svg>
  );
}
