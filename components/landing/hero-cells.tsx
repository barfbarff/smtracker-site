'use client';

// The title page's drawing: three cells as a camera sees them. A fixed grid of camera pixels (not drawn;
// the ground stays the page's own), three rod-shaped cells drifting very slightly across it, and in each
// cell two molecules drawn as small spots of lit pixels (asked 26 Nov 2026: two per cell, as sparse as a real
// single-molecule movie). The slow one hovers near one place, like the bound population, and the fast one
// roams. Each keeps to its own half of the cell, with a gap between the halves, so the two never overlap
// (asked the same day). Each leaves a short track that fades: a tight knot for the slow one, an open path
// for the fast one.
// Pixels are the camera data, the smooth outline is the cell SMTracker found, the line is its track.
//
// Canvas, drawn only in the browser (the server renders an empty canvas, so nothing can mismatch).
// 15 camera frames per second; pauses off-screen and in background tabs; one still frame under reduced motion.

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

const COLS = 44; // camera pixels across the drawing (fewer = more zoomed in)
const ROWS = 40;
const FPS = 15;
const TAIL = 14; // positions in each molecule's track (about a second)
const PSF = 0.75; // spot width, in camera pixels

type Cell = { cx: number; cy: number; len: number; w: number; ang: number; phase: number };
type Mol = { cell: number; u: number; v: number; vu: number; vv: number; au: number; av: number; fast: boolean; side: number; tail: [number, number][] };

// in camera pixels; three cells packed close, like a small colony. The nearest gaps between outlines
// stay at least 0.6 px (top/middle) and 0.46 px (middle/bottom) through the drift: checked over ten
// minutes of movie, and no cell ever leaves the drawing.
const CELLS: Cell[] = [
  { cx: 17, cy: 10.5, len: 27, w: 9.5, ang: -0.3, phase: 0 },
  { cx: 27.2, cy: 23.2, len: 28, w: 9.5, ang: 0.22, phase: 2.1 },
  { cx: 16.4, cy: 33.6, len: 25, w: 9, ang: -0.08, phase: 4.2 },
];
const DRIFT = 0.18; // camera pixels; each cell moves at most this far, so two can close a gap by 0.36 at most
/** camera pixels kept clear across the middle of a cell: each molecule stays on its own side of it */
const GAP = 6;
/** a molecule's own half of its cell (`side` -1 or 1 along the cell's long axis), the middle band left clear */
const onSide = (side: number, u: number, room = 0) => u * side >= GAP / 2 + room;

function inside(c: Cell, u: number, v: number, pad = 1.6) {
  const r = c.w / 2 - pad;
  const half = c.len / 2 - c.w / 2;
  const du = Math.max(Math.abs(u) - half, 0);
  return du * du + v * v < r * r;
}

const gauss = () => {
  const a = Math.max(Math.random(), 1e-9);
  return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * Math.random());
};

function spawn(cell: number, fast: boolean, side: number): Mol {
  const c = CELLS[cell];
  let u = 0;
  let v = 0;
  // the slow one's place sits a little further from the middle, so its knot stays on its side too
  do {
    u = (Math.random() - 0.5) * c.len;
    v = (Math.random() - 0.5) * c.w;
  } while (!inside(c, u, v) || !onSide(side, u, fast ? 0 : 1.5));
  return { cell, u, v, vu: 0, vv: 0, au: u, av: v, fast, side, tail: [] };
}

function hexRgb(h: string): [number, number, number] {
  const s = h.trim().replace('#', '');
  const full = s.length === 3 ? s.split('').map((x) => x + x).join('') : s;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** the colors, read where the canvas sits (so a wrapper that sets its own --ill-* palette is followed) */
function palette(el?: Element | null) {
  const cs = getComputedStyle(el ?? document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const fill = v('--ill-fill', '#e6f3c2');
  const grid = v('--ill-grid', '#d2e99a');
  const spot = v('--ill-spot', '#b5da55');
  const strong = v('--ill-spot-strong', '#7fa81c');
  // lit-pixel colors: from the cell's own fill up to the brightest spot
  const stops: [number, [number, number, number]][] = [
    [0, hexRgb(fill)],
    [0.35, hexRgb(grid)],
    [0.7, hexRgb(spot)],
    [1, hexRgb(strong)],
  ];
  const lut = Array.from({ length: 48 }, (_, k) => {
    const t = k / 47;
    let i = 0;
    while (i < stops.length - 2 && t > stops[i + 1][0]) i++;
    const [ta, a] = stops[i];
    const [tb, b] = stops[i + 1];
    const f = (t - ta) / (tb - ta);
    return `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * f)).join(',')})`;
  });
  // tracks: the dark track green on light grounds; in the dark the brighter spot green, so they glow too
  const dark = document.documentElement.classList.contains('dark');
  const track = dark ? spot : v('--ill-track', '#4a6810');
  return { fill, line: v('--ill-line', '#5f8412'), track, lut };
}

export function HeroCells({ paused = false }: { paused?: boolean }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // stop drawing the cells while they are scrolled out of view
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let colors = palette(canvasRef.current);
    let px = 8; // css pixels per camera pixel
    const mols: Mol[] = CELLS.flatMap((_, i) => {
      const side = Math.random() < 0.5 ? -1 : 1;
      return [spawn(i, false, side), spawn(i, true, -side)];
    });
    const light = new Float32Array(COLS * ROWS);
    let t = 0; // seconds of movie

    const size = () => {
      const w = canvas.clientWidth;
      px = w / COLS;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(px * ROWS * dpr);
      canvas.style.height = `${px * ROWS}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // a cell's drift: a fraction of a camera pixel, slow, each on its own phase
    const pose = (c: Cell) => ({
      cx: c.cx + Math.sin(t * 0.31 + c.phase) * DRIFT,
      cy: c.cy + Math.sin(t * 0.23 + c.phase * 1.7) * DRIFT,
      ang: c.ang + Math.sin(t * 0.17 + c.phase) * 0.004,
    });
    const toCamera = (m: Mol) => {
      const p = pose(CELLS[m.cell]);
      const cos = Math.cos(p.ang);
      const sin = Math.sin(p.ang);
      return [p.cx + m.u * cos - m.v * sin, p.cy + m.u * sin + m.v * cos] as [number, number];
    };

    const step = () => {
      t += 1 / FPS;
      for (const m of mols) {
        const c = CELLS[m.cell];
        if (m.fast) {
          // a smoothed random walk across its half of the cell
          m.vu = m.vu * 0.55 + gauss() * 0.55;
          m.vv = m.vv * 0.55 + gauss() * 0.55;
        } else {
          // bound-like: a small wander held near its own place
          // (wide enough that its knot shows around the spot, still held to one place)
          m.vu = m.vu * 0.5 + gauss() * 0.24 + (m.au - m.u) * 0.06;
          m.vv = m.vv * 0.5 + gauss() * 0.24 + (m.av - m.v) * 0.06;
        }
        const nu = m.u + m.vu;
        const nv = m.v + m.vv;
        if (inside(c, nu, nv) && onSide(m.side, nu)) {
          m.u = nu;
          m.v = nv;
        } else {
          m.vu = -m.vu;
          m.vv = -m.vv;
        }
        // every molecule leaves a short track: slow ones a tight knot in place, fast ones an open path
        m.tail.push(toCamera(m));
        if (m.tail.length > TAIL) m.tail.shift();
      }
    };

    const draw = () => {
      const W = COLS * px;
      const H = ROWS * px;
      ctx.clearRect(0, 0, W, H);

      // the cells: fill first, so the lit pixels sit on it
      const shape = (c: Cell) => {
        const p = pose(c);
        ctx.save();
        ctx.translate(p.cx * px, p.cy * px);
        ctx.rotate(p.ang);
        ctx.beginPath();
        ctx.roundRect((-c.len / 2) * px, (-c.w / 2) * px, c.len * px, c.w * px, (c.w / 2) * px);
        ctx.restore();
      };
      ctx.fillStyle = colors.fill;
      for (const c of CELLS) {
        shape(c);
        ctx.fill();
      }

      // the camera image: each molecule spreads its light over the pixels around it
      light.fill(0);
      for (const m of mols) {
        const [x, y] = toCamera(m);
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        for (let j = y0 - 2; j <= y0 + 2; j++) {
          if (j < 0 || j >= ROWS) continue;
          for (let i = x0 - 2; i <= x0 + 2; i++) {
            if (i < 0 || i >= COLS) continue;
            const dx = i + 0.5 - x;
            const dy = j + 0.5 - y;
            light[j * COLS + i] += Math.exp(-(dx * dx + dy * dy) / (2 * PSF * PSF));
          }
        }
      }
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const v = Math.min(1, light[j * COLS + i] * 1.25);
          if (v < 0.12) continue;
          ctx.fillStyle = colors.lut[Math.round(v * 47)];
          // a hair smaller than the pixel, so neighboring lit pixels read as pixels
          ctx.fillRect(i * px + 0.5, j * px + 0.5, px - 1, px - 1);
        }
      }

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1.5;
      for (const c of CELLS) {
        shape(c);
        ctx.stroke();
      }

      // the tracks: short, fading toward their old end
      ctx.strokeStyle = colors.track;
      ctx.lineWidth = 1.75;
      ctx.lineCap = 'round';
      for (const m of mols) {
        for (let k = 1; k < m.tail.length; k++) {
          ctx.globalAlpha = (k / m.tail.length) * 0.9;
          ctx.beginPath();
          ctx.moveTo(m.tail[k - 1][0] * px, m.tail[k - 1][1] * px);
          ctx.lineTo(m.tail[k][0] * px, m.tail[k][1] * px);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    size();
    // a few frames in, so the first picture already has its short tracks
    for (let k = 0; k < TAIL; k++) step();
    draw();

    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      colors = palette(canvasRef.current);
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    if (reduce) {
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
    });
    io.observe(canvas);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || pausedRef.current) return;
      if (now - last < 1000 / FPS) return;
      last = now;
      step();
      draw();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />;
}
