'use client';

// The small live demos of chapter 1's "From start to finish" and the panels that zoom into it: track
// playback, the four outline edits (draw, split, merge, bend, each with a cursor doing it), and a loop
// through the analyses. All are drawn from the same sample tracks (lib/sample-tracks.ts) in the
// Illustrations board's style. Each loops only while `playing`; otherwise it shows its finished frame,
// which is also what reduced motion gets.

import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { FIELD, cells, dHistogram, jumpHistogram, msdCurves, tracks } from '@/lib/sample-tracks';

/** A 0..1 clock that runs round every `seconds` while playing, and rests at 1 (the finished frame) otherwise. */
function useLoop(seconds: number, playing: boolean, offset = 0) {
  // starts where it will play from, so a demo never flashes its finished frame first
  const t = useMotionValue(playing ? offset : 1);
  useEffect(() => {
    if (!playing) {
      t.set(1);
      return;
    }
    t.set(offset);
    const first = animate(t, 1, { duration: seconds * (1 - offset), ease: 'linear' });
    let loop: ReturnType<typeof animate> | undefined;
    first.then(() => {
      t.set(0);
      loop = animate(t, [0, 1], { duration: seconds, ease: 'linear', repeat: Infinity });
    });
    return () => {
      first.stop();
      loop?.stop();
    };
  }, [playing, seconds, offset, t]);
  return t;
}

const clamp = { clamp: true } as const;

/* ---------- track playback ---------- */

function PlayTrack({ tr, t }: { tr: (typeof tracks)[number]; t: MotionValue<number> }) {
  // the track grows with the movie, its spot at the head; the last fifth of the loop holds the full tracks
  const shown = useTransform(t, [0, 0.8], [0.02, 1], clamp);
  const n = tr.pts.length - 1;
  const cx = useTransform(shown, (v) => tr.pts[Math.round(v * n)][0]);
  const cy = useTransform(shown, (v) => tr.pts[Math.round(v * n)][1]);
  return (
    <g>
      <motion.path d={tr.d} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" style={{ pathLength: shown }} />
      <motion.circle cx={cx} cy={cy} r="7" fill="var(--ill-grid)" />
      <motion.circle cx={cx} cy={cy} r="3.5" fill="var(--ill-track)" />
    </g>
  );
}

/** The sample movie: three cells, and the tracks playing back over it. `scrubber` adds the timeline. */
export function PlaybackDemo({ playing, scrubber = false }: { playing: boolean; scrubber?: boolean }) {
  const t = useLoop(6, playing);
  const head = useTransform(t, [0, 0.8], ['0%', '100%'], clamp);
  return (
    <div className="flex size-full flex-col gap-[3%]">
      <svg viewBox={`0 0 ${FIELD.w} ${FIELD.h}`} className="sm-redraw min-h-0 w-full flex-1" role="img" aria-label="Sample tracks playing back over three cells">
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.cx - c.len / 2}
            y={c.cy - c.w / 2}
            width={c.len}
            height={c.w}
            rx={c.w / 2}
            transform={`rotate(${c.angDeg} ${c.cx} ${c.cy})`}
            fill="var(--ill-fill)"
            stroke="var(--ill-line)"
            strokeWidth="1.5"
          />
        ))}
        {tracks.map((tr, i) => (
          <PlayTrack key={i} tr={tr} t={t} />
        ))}
      </svg>
      {scrubber ? (
        <div className="flex items-center gap-2" aria-hidden="true">
          <svg viewBox="0 0 10 10" className="size-2.5 shrink-0 fill-(--ill-track)">
            <path d="M1 0.5 9 5 1 9.5Z" />
          </svg>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-(--ill-fill)">
            <motion.div style={{ width: head }} className="absolute inset-y-0 left-0 rounded-full bg-(--ill-track)" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The sample tracks, finished and still (the Movement card). */
export function FieldStill() {
  return (
    <svg viewBox={`0 0 ${FIELD.w} ${FIELD.h}`} className="size-full" role="img" aria-label="The sample tracks inside three cells">
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.cx - c.len / 2}
          y={c.cy - c.w / 2}
          width={c.len}
          height={c.w}
          rx={c.w / 2}
          transform={`rotate(${c.angDeg} ${c.cx} ${c.cy})`}
          fill="var(--ill-fill)"
          stroke="var(--ill-line)"
          strokeWidth="1.5"
        />
      ))}
      {tracks.map((tr, i) => (
        <path key={i} d={tr.d} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* ---------- cell outlines: four edits, each done by a cursor ---------- */

export type OutlineOp = 'draw' | 'split' | 'merge' | 'bend';
export const OUTLINE_OPS: { op: OutlineOp; name: string; key?: string }[] = [
  { op: 'draw', name: 'Draw', key: 'D' },
  { op: 'split', name: 'Split', key: 'X' },
  { op: 'merge', name: 'Merge' },
  { op: 'bend', name: 'Bend' },
];

const CELL = { fill: 'var(--ill-fill)', opacity: 0.75 };
const OUT = { fill: 'none', stroke: 'var(--ill-track)', strokeWidth: 1.75 };

/** The pointer, its tip at (0, 0), with a ring that pulses when it clicks. */
function Cursor({ x, y, click, show }: { x: MotionValue<number>; y: MotionValue<number>; click: MotionValue<number>; show: MotionValue<number> }) {
  const ringR = useTransform(click, [0, 1], [2, 9]);
  const ringO = useTransform(click, [0, 0.2, 1], [0, 0.9, 0]);
  return (
    <motion.g style={{ x, y, opacity: show }}>
      <motion.circle r={ringR} fill="none" stroke="var(--ill-track)" strokeWidth="1.25" style={{ opacity: ringO }} />
      <path d="M0 0 L0 13 L3.6 9.8 L6.2 15 L8.4 14 L5.9 8.9 L10.5 8.6 Z" fill="var(--color-fd-foreground)" stroke="var(--color-fd-background)" strokeWidth="1" strokeLinejoin="round" />
    </motion.g>
  );
}

/** A moment in the loop when the cursor clicks: 0 → 1 over a short pulse after `at`. */
const useClick = (t: MotionValue<number>, ...at: number[]) =>
  useTransform(t, (v) => {
    for (const a of at) if (v >= a && v < a + 0.12) return (v - a) / 0.12;
    return 0;
  });

/** Walks the cursor through `stops` ([time, x, y]) and fades it out at the end of the loop. */
function usePath(t: MotionValue<number>, stops: [number, number, number][]) {
  const x = useTransform(t, stops.map((s) => s[0]), stops.map((s) => s[1]), clamp);
  const y = useTransform(t, stops.map((s) => s[0]), stops.map((s) => s[1 + 1]), clamp);
  const show = useTransform(t, [0, 0.05, 0.86, 0.95], [0, 1, 1, 0], clamp);
  return { x, y, show };
}

function Handle({ x, y, on }: { x: number; y: number; on: MotionValue<number> }) {
  return <motion.rect x={x - 3.5} y={y - 3.5} width="7" height="7" rx="1.5" fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25" style={{ opacity: on }} />;
}

function DrawEdit({ t }: { t: MotionValue<number> }) {
  // click one pole, drag to the other: the outline grows until it fits the faded cell
  const c = usePath(t, [[0, 150, 98], [0.15, 40, 55], [0.22, 40, 55], [0.6, 160, 55], [1, 160, 55]]);
  const click = useClick(t, 0.17, 0.6);
  const width = useTransform(t, [0.22, 0.6], [36, 156], clamp);
  const drawn = useTransform(t, [0.18, 0.2], [0, 1], clamp);
  const end = useTransform(t, [0.6, 0.62], [0, 1], clamp);
  return (
    <>
      <rect x="22" y="37" width="156" height="36" rx="18" {...CELL} />
      <motion.rect x="22" y="37" height="36" rx="18" {...OUT} style={{ width, opacity: drawn }} />
      <Handle x={40} y={55} on={drawn} />
      <Handle x={160} y={55} on={end} />
      <Cursor {...c} click={click} />
    </>
  );
}

function SplitEdit({ t }: { t: MotionValue<number> }) {
  // two cells inside one outline that hugs them both: a click at the waist cuts it in two. The two halves
  // keep the outline's own outer edges (nothing resizes or snaps); only the waist closes up.
  const c = usePath(t, [[0, 160, 98], [0.25, 100, 55], [1, 100, 55]]);
  const click = useClick(t, 0.28);
  const cut = useTransform(t, [0.3, 0.45], [0, 1], clamp);
  // the cut line exists only while it is being drawn (its round tip would otherwise show as a dot)
  const cutOn = useTransform(t, [0.29, 0.31, 0.48, 0.55], [0, 1, 1, 0], clamp);
  const one = useTransform(t, [0.48, 0.55], [1, 0], clamp);
  const two = useTransform(t, [0.48, 0.55], [0, 1], clamp);
  return (
    <>
      <rect x="30" y="37" width="68" height="36" rx="18" {...CELL} />
      <rect x="102" y="37" width="68" height="36" rx="18" {...CELL} />
      <motion.rect x="27" y="34" width="146" height="42" rx="21" {...OUT} style={{ opacity: one }} />
      <motion.path d="M100 28 V82" {...OUT} strokeLinecap="round" style={{ pathLength: cut, opacity: cutOn }} />
      <motion.g style={{ opacity: two }}>
        <rect x="27" y="34" width="72" height="42" rx="21" {...OUT} />
        <rect x="101" y="34" width="72" height="42" rx="21" {...OUT} />
      </motion.g>
      <Cursor {...c} click={click} />
    </>
  );
}

function MergeEdit({ t }: { t: MotionValue<number> }) {
  // one cell cut in two by mistake: click both halves, and they become one outline
  const c = usePath(t, [[0, 100, 100], [0.18, 60, 50], [0.3, 60, 50], [0.42, 140, 50], [1, 140, 50]]);
  const click = useClick(t, 0.2, 0.44);
  const pickA = useTransform(t, [0.2, 0.22], [0, 1], clamp);
  const pickB = useTransform(t, [0.44, 0.46], [0, 1], clamp);
  const two = useTransform(t, [0.55, 0.62], [1, 0], clamp);
  const one = useTransform(t, [0.55, 0.62], [0, 1], clamp);
  const litA = useTransform(pickA, [0, 1], [0, 0.3]);
  const litB = useTransform(pickB, [0, 1], [0, 0.3]);
  return (
    <>
      <rect x="22" y="37" width="156" height="36" rx="18" {...CELL} />
      <motion.g style={{ opacity: two }}>
        <rect x="19" y="34" width="80" height="42" rx="21" {...OUT} strokeDasharray="5 4" />
        <rect x="101" y="34" width="80" height="42" rx="21" {...OUT} strokeDasharray="5 4" />
        <motion.rect x="19" y="34" width="80" height="42" rx="21" fill="var(--ill-spot)" style={{ opacity: litA }} />
        <motion.rect x="101" y="34" width="80" height="42" rx="21" fill="var(--ill-spot)" style={{ opacity: litB }} />
      </motion.g>
      <motion.rect x="19" y="34" width="162" height="42" rx="21" {...OUT} style={{ opacity: one }} />
      <Cursor {...c} click={click} />
    </>
  );
}

// A rod-shaped outline whose top and bottom edges bend on their own: each edge leaves its end caps level
// (so there is no kink) and passes through its own midpoint (`top`, `bot`: the y of each edge's middle).
const rod = (top: number, bot: number) =>
  `M40 37 C64 37 76 ${top} 100 ${top} C124 ${top} 136 37 160 37 A18 18 0 0 1 160 73 ` +
  `C136 73 124 ${bot} 100 ${bot} C76 ${bot} 64 73 40 73 A18 18 0 0 1 40 37 Z`;
// the curved cell, where both edges end up after the two drags
const CURVED = rod(23, 57);

function BendEdit({ t }: { t: MotionValue<number> }) {
  // A curved cell and a straight outline. The outline bends one edge at a time, as in the editor: the
  // cursor grabs the top edge's handle and pulls it up, then the bottom edge's, until the outline fits.
  const c = usePath(t, [
    [0, 165, 100],
    [0.12, 100, 37],
    [0.16, 100, 37],
    [0.38, 100, 23],
    [0.48, 100, 73],
    [0.52, 100, 73],
    [0.76, 100, 57],
    [1, 100, 57],
  ]);
  const click = useClick(t, 0.13, 0.49);
  const top = useTransform(t, [0.16, 0.38], [37, 23], clamp);
  const bot = useTransform(t, [0.52, 0.76], [73, 57], clamp);
  const d = useTransform([top, bot], ([a, b]: number[]) => rod(a, b));
  const handleOn = useTransform(t, [0.05, 0.1, 0.8, 0.84], [0, 1, 1, 0], clamp);
  const topY = useTransform(top, (v) => v - 3.5);
  const botY = useTransform(bot, (v) => v - 3.5);
  return (
    <>
      <path d={CURVED} {...CELL} />
      <motion.path d={d} {...OUT} strokeLinejoin="round" />
      {/* the two edge handles, riding on the edges they move */}
      <motion.rect x="96.5" y={topY} width="7" height="7" rx="1.5" fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25" style={{ opacity: handleOn }} />
      <motion.rect x="96.5" y={botY} width="7" height="7" rx="1.5" fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25" style={{ opacity: handleOn }} />
      <Cursor {...c} click={click} />
    </>
  );
}

const EDITS = { draw: DrawEdit, split: SplitEdit, merge: MergeEdit, bend: BendEdit };

/** One outline edit, looping while `playing` (offset staggers it against its neighbors). */
export function OutlineEdit({ op, playing, offset = 0 }: { op: OutlineOp; playing: boolean; offset?: number }) {
  const t = useLoop(3.4, playing, offset);
  const Edit = EDITS[op];
  return (
    <svg viewBox="0 0 200 110" className="sm-redraw size-full" role="img" aria-label={`Cell outline edit: ${op}`}>
      <Edit t={t} />
    </svg>
  );
}

/** The four edits one after another on one clock, each named as it plays. */
export function OutlinesDemo({ playing }: { playing: boolean }) {
  const t = useLoop(3.4, playing);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let prev = t.get();
    // each time the clock comes round, the next edit starts
    return t.on('change', (v) => {
      if (v < prev - 0.5) setI((k) => (k + 1) % OUTLINE_OPS.length);
      prev = v;
    });
  }, [playing, t]);
  // at rest (and under reduced motion) it shows the finished first edit
  const cur = OUTLINE_OPS[playing ? i : 0];
  const Edit = EDITS[cur.op];
  return (
    <div className="@container relative size-full">
      <svg viewBox="0 0 200 110" className="sm-redraw size-full" role="img" aria-label={`Cell outline edit: ${cur.name}`}>
        <Edit key={cur.op} t={t} />
      </svg>
      <span className="absolute top-[3%] left-[3%] font-card text-[clamp(11px,4.4cqw,14px)] text-em-text">{cur.name}</span>
    </div>
  );
}

/* ---------- analyses: a loop through three of them ---------- */

const ANALYSES = ['Jump distances (SQD)', 'MSD', 'Apparent D'] as const;

function Sqd() {
  const W = 200;
  const H = 100;
  const d = jumpHistogram.density;
  const peak = Math.max(...d, ...jumpHistogram.slow.map((q) => q[1]), ...jumpHistogram.fast.map((q) => q[1]));
  const x = (r: number) => (r / jumpHistogram.max) * W;
  const y = (v: number) => H - (v / peak) * (H - 8);
  const line = (pts: [number, number][]) => pts.map(([r, v], i) => `${i ? 'L' : 'M'}${x(r).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <>
      <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} style={{ originY: 1 }}>
        {d.map((v, i) => (
          <rect key={i} x={x(i * jumpHistogram.width) + 1} y={y(v)} width={x(jumpHistogram.width) - 2} height={H - y(v)} fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="0.75" />
        ))}
      </motion.g>
      <motion.path d={line(jumpHistogram.slow)} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
      <motion.path d={line(jumpHistogram.fast)} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
    </>
  );
}

function Msd() {
  const W = 200;
  const H = 100;
  const maxT = msdCurves.fast[msdCurves.fast.length - 1][0];
  const maxY = Math.max(...msdCurves.fast.map((q) => q[1]));
  const x = (v: number) => (v / maxT) * (W - 8) + 4;
  const y = (v: number) => H - 4 - (v / maxY) * (H - 12);
  const line = (pts: [number, number][]) => `M${x(0)} ${y(0)} ` + pts.map(([a, b]) => `L${x(a).toFixed(1)} ${y(b).toFixed(1)}`).join(' ');
  return (
    <>
      <path d={`M4 4V${H - 4}H${W}`} fill="none" stroke="var(--ill-line)" strokeWidth="1" />
      <motion.path d={line(msdCurves.fast)} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
      <motion.path d={line(msdCurves.slow)} fill="none" stroke="var(--ill-track)" strokeWidth="1.75" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
    </>
  );
}

function ApparentD() {
  const W = 200;
  const H = 100;
  const n = dHistogram.counts.length;
  const peak = Math.max(...dHistogram.counts.map((c) => c.slow + c.fast));
  const bw = W / n;
  return (
    <motion.g initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} style={{ originY: 1 }}>
      {dHistogram.counts.map((c, i) => {
        const hs = (c.slow / peak) * (H - 8);
        const hf = (c.fast / peak) * (H - 8);
        return (
          <g key={i}>
            {c.slow ? <rect x={i * bw + 1.5} y={H - hs} width={bw - 3} height={hs} fill="var(--ill-track)" /> : null}
            {c.fast ? <rect x={i * bw + 1.5} y={H - hs - hf} width={bw - 3} height={hf} fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="0.75" /> : null}
          </g>
        );
      })}
    </motion.g>
  );
}

const CHARTS = [Sqd, Msd, ApparentD];

/** SQD, MSD and Apparent D of the sample tracks, one after another, each named. */
export function AnalysisDemo({ playing }: { playing: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setI((k) => (k + 1) % CHARTS.length), 3200);
    return () => clearInterval(id);
  }, [playing]);
  const k = playing ? i : 0;
  const Chart = CHARTS[k];
  return (
    <div className="@container relative size-full">
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="sm-redraw absolute top-[24%] left-[4%] h-[68%] w-[92%] overflow-visible" role="img" aria-label={ANALYSES[k]}>
        <Chart key={`${k}-${playing}`} />
        {/* MSD draws its own axes; the others stand on this baseline */}
        {Chart !== Msd ? (
          <line x1="0" y1="100" x2="200" y2="100" stroke="var(--ill-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ) : null}
      </svg>
      <span className="absolute top-[3%] left-[3%] font-card text-[clamp(11px,4.4cqw,14px)] text-em-text">{ANALYSES[k]}</span>
    </div>
  );
}
