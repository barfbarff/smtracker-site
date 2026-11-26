// The landing page's sample dataset, read from a generated snapshot (scripts/generate-sample-tracks.mts).
// Simulated single-molecule tracks in three rod-shaped cells, and every analysis the page shows,
// computed from those tracks. Labelled as sample data wherever it appears.
// Only plain arithmetic happens here, which every JavaScript engine does identically, so the server
// and the browser render the same figure.

import data from './sample-tracks.data.json';

type Pt = [number, number];

export const FIELD = data.field;

export const cells = data.cells;

export const tracks = data.tracks.map((t) => {
  const pts = t.pts as Pt[];
  return {
    cell: t.cell,
    slow: t.slow,
    /** apparent D of this track, µm²/s */
    dCoef: t.d,
    pts,
    d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '),
  };
});

export const slowFraction = data.slowFraction;

export const jumpHistogram = {
  ...data.jumpHistogram,
  slow: data.jumpHistogram.slow as Pt[],
  fast: data.jumpHistogram.fast as Pt[],
};

export const msdCurves = {
  slow: data.msdCurves.slow as Pt[],
  fast: data.msdCurves.fast as Pt[],
};

export const dHistogram = data.dHistogram;

export const stats = data.stats;
