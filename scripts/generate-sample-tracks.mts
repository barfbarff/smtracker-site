// Generates the landing page's sample dataset: simulated single-molecule tracks in three rod-shaped
// cells, and every analysis the page shows, computed from those tracks.
// Run with `./bin/run npm run data:sample`; it writes lib/sample-tracks.data.json.
// The page only reads that file: Math.cos / Math.exp differ in the last bits between Node and browsers,
// so computing at render time would make the server and the browser disagree.

/** Drawing units per camera pixel. The field is 600 × 360 units. */
export const UNITS_PER_PX = 8;
export const PIXEL_UM = 0.106; // 106 nm, the lab's setup
export const FRAME_S = 0.02; // 20 ms frame interval
export const FIELD = { w: 600, h: 360 };

export type Cell = { cx: number; cy: number; len: number; w: number; ang: number };
export type Track = { cell: number; slow: boolean; pts: [number, number][]; d: string };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(517); // mNeonGreen's emission peak, for luck
const gauss = () => {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export const cells: Cell[] = [
  { cx: 165, cy: 112, len: 250, w: 74, ang: -0.2 },
  { cx: 428, cy: 104, len: 232, w: 72, ang: 0.24 },
  { cx: 318, cy: 262, len: 262, w: 74, ang: -0.06 },
];

function toLocal(c: Cell, x: number, y: number) {
  const dx = x - c.cx;
  const dy = y - c.cy;
  const cos = Math.cos(c.ang);
  const sin = Math.sin(c.ang);
  return { u: dx * cos + dy * sin, v: -dx * sin + dy * cos };
}

function inside(c: Cell, x: number, y: number, margin = 6) {
  const { u, v } = toLocal(c, x, y);
  const r = c.w / 2 - margin;
  const half = c.len / 2 - c.w / 2;
  const du = Math.max(Math.abs(u) - half, 0);
  return du * du + v * v < r * r;
}

/** drawing units kept clear across the middle of a cell: each molecule stays on its own side (asked 26 Nov 2026) */
const GAP = 40;
const onSide = (c: Cell, side: number, x: number, y: number, room = 0) => toLocal(c, x, y).u * side >= GAP / 2 + room;

function startPoint(c: Cell, side: number, room: number): [number, number] {
  for (;;) {
    const u = (rng() - 0.5) * (c.len - 30);
    const v = (rng() - 0.5) * (c.w - 24);
    const x = c.cx + u * Math.cos(c.ang) - v * Math.sin(c.ang);
    const y = c.cy + u * Math.sin(c.ang) + v * Math.cos(c.ang);
    if (inside(c, x, y) && onSide(c, side, x, y, room)) return [x, y];
  }
}

/** Step sizes in camera pixels: a bound-like slow population and a free fast one. */
const SIGMA_PX = { slow: 0.32, fast: 1.35 };
// fast molecules leave the field of focus sooner, so their tracks are shorter
const STEPS = { slow: 34, fast: 16 };
// two molecules per cell, one slow and one fast (asked 26 Nov 2026), as in the title's drawing
const PLAN: boolean[][] = [
  [true, false],
  [false, true],
  [true, false],
];

export const tracks: Track[] = PLAN.flatMap((kinds, ci) =>
  kinds.map((slow, k) => {
    const c = cells[ci];
    const sigma = (slow ? SIGMA_PX.slow : SIGMA_PX.fast) * UNITS_PER_PX;
    // the cell's two molecules on opposite halves, so their tracks never cross
    const side = k === 0 ? -1 : 1;
    let [x, y] = startPoint(c, side, slow ? 20 : 0);
    const pts: [number, number][] = [[x, y]];
    for (let s = 0; s < (slow ? STEPS.slow : STEPS.fast); s++) {
      for (let t = 0; t < 12; t++) {
        const nx = x + gauss() * sigma;
        const ny = y + gauss() * sigma;
        if (inside(c, nx, ny) && onSide(c, side, nx, ny)) {
          x = nx;
          y = ny;
          break;
        }
      }
      pts.push([x, y]);
    }
    const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
    return { cell: ci, slow, pts, d };
  }),
);

/* ---------- the analyses, computed from the tracks above ---------- */

const um = (units: number) => (units / UNITS_PER_PX) * PIXEL_UM;

function jumps(t: Track) {
  return t.pts.slice(1).map(([x, y], i) => um(Math.hypot(x - t.pts[i][0], y - t.pts[i][1])));
}

const SLOW_MSD_UM2 = 0.01; // between the two populations' single-step MSD

/** Each track sorted by its own mean squared jump, as the analysis does (not by how it was made). */
export const classified = tracks.map((t) => {
  const j = jumps(t);
  const msd1 = j.reduce((s, r) => s + r * r, 0) / j.length;
  return { track: t, jumps: j, slow: msd1 < SLOW_MSD_UM2, d: msd1 / (4 * FRAME_S) };
});

export const slowFraction = classified.filter((c) => c.slow).length / classified.length;

/** Jump-distance histogram (density) and the two Rayleigh populations fitted to it. */
export const jumpHistogram = (() => {
  const all = classified.flatMap((c) => c.jumps);
  const max = 0.6;
  const bins = 15;
  const width = max / bins;
  const counts = Array.from({ length: bins }, () => 0);
  for (const r of all) counts[Math.min(bins - 1, Math.floor(r / width))]++;
  const density = counts.map((n) => n / (all.length * width));
  const pop = (slow: boolean) => {
    const rs = classified.filter((c) => c.slow === slow).flatMap((c) => c.jumps);
    const s2 = rs.reduce((s, r) => s + r * r, 0) / (2 * rs.length);
    const w = rs.length / all.length;
    return Array.from({ length: 61 }, (_, i) => {
      const r = (i / 60) * max;
      return [r, (w * r * Math.exp(-(r * r) / (2 * s2))) / s2] as [number, number];
    });
  };
  return { max, width, density, slow: pop(true), fast: pop(false) };
})();

/** Mean squared displacement against lag, per population. */
export const msdCurves = (() => {
  const lags = Array.from({ length: 10 }, (_, i) => i + 1);
  const curve = (slow: boolean) =>
    lags.map((lag) => {
      let sum = 0;
      let n = 0;
      for (const c of classified.filter((k) => k.slow === slow)) {
        const p = c.track.pts;
        for (let i = 0; i + lag < p.length; i++) {
          const dx = um(p[i + lag][0] - p[i][0]);
          const dy = um(p[i + lag][1] - p[i][1]);
          sum += dx * dx + dy * dy;
          n++;
        }
      }
      return [lag * FRAME_S * 1000, sum / n] as [number, number];
    });
  return { slow: curve(true), fast: curve(false) };
})();

/** One apparent D per track, binned on a log axis. */
export const dHistogram = (() => {
  const lo = -2.5;
  const hi = 1;
  const bins = 14;
  const width = (hi - lo) / bins;
  const counts = Array.from({ length: bins }, () => ({ slow: 0, fast: 0 }));
  for (const c of classified) {
    const b = Math.min(bins - 1, Math.max(0, Math.floor((Math.log10(c.d) - lo) / width)));
    counts[b][c.slow ? 'slow' : 'fast']++;
  }
  return { lo, hi, width, counts };
})();

export const stats = {
  tracks: tracks.length,
  cells: cells.length,
  jumps: classified.reduce((s, c) => s + c.jumps.length, 0),
};


/* ---------- write the rounded snapshot ---------- */

import { writeFileSync } from 'node:fs';
const r = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
const data = {
  field: FIELD,
  cells: cells.map((c) => ({ cx: c.cx, cy: c.cy, len: c.len, w: c.w, angDeg: r((c.ang * 180) / Math.PI, 3) })),
  tracks: classified.map((c) => ({
    cell: c.track.cell,
    slow: c.slow,
    d: r(c.d, 4),
    pts: c.track.pts.map(([x, y]) => [r(x), r(y)]),
  })),
  slowFraction: r(slowFraction, 4),
  jumpHistogram: {
    max: jumpHistogram.max,
    width: r(jumpHistogram.width, 6),
    density: jumpHistogram.density.map((v) => r(v, 4)),
    slow: jumpHistogram.slow.map(([a, b]) => [r(a, 4), r(b, 4)]),
    fast: jumpHistogram.fast.map(([a, b]) => [r(a, 4), r(b, 4)]),
  },
  msdCurves: {
    slow: msdCurves.slow.map(([a, b]) => [r(a, 2), r(b, 6)]),
    fast: msdCurves.fast.map(([a, b]) => [r(a, 2), r(b, 6)]),
  },
  dHistogram,
  stats,
};
writeFileSync(new URL('../lib/sample-tracks.data.json', import.meta.url), JSON.stringify(data) + '\n');
console.log('wrote lib/sample-tracks.data.json:', stats);
