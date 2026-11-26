// Explanatory diagrams for the manual, drawn by the Illustrations board's rules:
// emission-50 ground under a 24-unit grid dashed 2 3 in emission-200; 1.25 lines in emission-600 for objects,
// 1.5 in emission-700 for tracks and fits; emission-300 only where light is. No words inside a drawing except
// panel letters and the odd number; the caption under it carries the meaning.
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const LINE = 'var(--ill-line)';
const TRACK = 'var(--ill-track)';
const FILL = 'var(--ill-fill)';
const PAPER = 'var(--ill-paper)';
const GRID = 'var(--ill-grid)';
const SPOT = 'var(--ill-spot)';
const SPOT_STRONG = 'var(--ill-spot-strong)';

function Diagram({
  width,
  height,
  label,
  caption,
  children,
}: {
  width: number;
  height: number;
  label: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <figure className="not-prose my-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="block h-auto w-full overflow-hidden rounded-[20px]"
      >
        <defs>
          <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0V24M0 24H24" fill="none" stroke={GRID} strokeWidth="1" strokeDasharray="2 3" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="var(--ill-ground)" />
        <rect width={width} height={height} fill={`url(#${id}-grid)`} />
        {children}
      </svg>
      {caption ? (
        <figcaption className="mt-2 text-[13px] leading-5 text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Panel letter, the only word a drawing may carry. */
function Letter({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <text x={x} y={y} className="font-mono" fontSize="13" fontWeight="500" fill={TRACK}>
      {children}
    </text>
  );
}

function Num({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} className="font-mono" fontSize="12" fill={TRACK} textAnchor={anchor}>
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* Movies & crop: the three panels of the chart, and where the cut falls */

export function CropChartDiagram() {
  const x0 = 72;
  const x1 = 552;
  const cut = 216;
  const panel = (y: number, h: number) => (
    <rect x={48} y={y} width={528} height={h} rx="8" fill={PAPER} stroke={LINE} strokeWidth="1.25" />
  );
  return (
    <Diagram
      width={600}
      height={336}
      label="Three stacked panels: frame mean falling to a plateau, spots per frame settling, and the bar of frames kept, all cut at the same frame"
      caption="A frame mean, B spots per frame, C the frames kept. While the field is still bleaching down to single molecules, both curves fall; the movie becomes usable once they run flat (the shaded band in A). Everything left of the dashed line is cut away."
    >
      {/* A: frame mean */}
      {panel(24, 88)}
      <rect x={cut} y={86} width={x1 - cut} height={14} fill={FILL} />
      <path d={`M${x0} 38 C 120 44, 160 82, ${cut} 92 S 400 94, ${x1} 93`} fill="none" stroke={TRACK} strokeWidth="1.5" strokeLinecap="round" />
      <Letter x={58} y={42}>A</Letter>
      {/* B: spots per frame */}
      {panel(124, 88)}
      <path
        d={`M${x0} 142 L 88 150 L 104 146 L 120 160 L 136 156 L 152 170 L 168 176 L 184 182 L 200 186 L ${cut} 190 L 248 188 L 280 191 L 312 189 L 344 190 L 376 188 L 408 191 L 440 189 L 472 190 L 504 188 L ${x1} 190`}
        fill="none"
        stroke={TRACK}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Letter x={58} y={142}>B</Letter>
      {/* C: frames kept */}
      {panel(224, 88)}
      <rect x={x0} y={256} width={cut - x0} height={24} rx="4" fill="none" stroke={LINE} strokeWidth="1.25" strokeDasharray="4 3" />
      <rect x={cut} y={256} width={x1 - cut} height={24} rx="4" fill={FILL} stroke={LINE} strokeWidth="1.25" />
      <rect x={cut - 4} y={250} width={8} height={36} rx="2" fill={PAPER} stroke={TRACK} strokeWidth="1.25" />
      <rect x={x1 - 4} y={250} width={8} height={36} rx="2" fill={PAPER} stroke={TRACK} strokeWidth="1.25" />
      <Letter x={58} y={242}>C</Letter>
      {/* the cut, through all three */}
      <line x1={cut} y1={24} x2={cut} y2={312} stroke={TRACK} strokeWidth="1.25" strokeDasharray="4 3" />
    </Diagram>
  );
}

/* Three ways to give every movie the same range */

export function CropModesDiagram() {
  // frames → x: 0..2400 frames over 96..552
  const fx = (f: number) => 96 + f * 0.19;
  const movies = [
    { len: 2000, start: 380 },
    { len: 1600, start: 520 },
    { len: 2400, start: 450 },
  ];
  const row = (y: number, len: number, a: number, b: number, key: string) => (
    <g key={key}>
      <rect x={fx(0)} y={y} width={fx(len) - fx(0)} height={18} rx="4" fill={PAPER} stroke={GRID} strokeWidth="1.25" />
      <rect x={fx(a)} y={y} width={fx(Math.min(b, len)) - fx(a)} height={18} rx="4" fill={FILL} stroke={LINE} strokeWidth="1.25" />
      <circle cx={fx(a)} cy={y + 9} r="3" fill={TRACK} />
    </g>
  );
  return (
    <Diagram
      width={600}
      height={312}
      label="Two panels of three movies each. In A every movie keeps frames 500 to 1500. In B each movie keeps its own start and the same number of frames after it."
      caption="Three movies of different lengths (outline) with the frames kept (filled; the dot is where each range starts). A Every movie starts at 500 and ends at 1500: one range for all. B Track N frames: each movie keeps its own start and ends N frames later, so all ranges are equally long but sit in different places."
    >
      <Letter x={40} y={44}>A</Letter>
      {movies.map((m, i) => row(32 + i * 32, m.len, 500, 1500, `a${i}`))}
      <line x1={fx(500)} y1={22} x2={fx(500)} y2={134} stroke={TRACK} strokeWidth="1.25" strokeDasharray="4 3" />
      <line x1={fx(1500)} y1={22} x2={fx(1500)} y2={134} stroke={TRACK} strokeWidth="1.25" strokeDasharray="4 3" />
      <Num x={fx(500)} y={150}>500</Num>
      <Num x={fx(1500)} y={150}>1500</Num>

      <Letter x={40} y={196}>B</Letter>
      {movies.map((m, i) => row(184 + i * 32, m.len, m.start, m.start + 1000, `b${i}`))}
      {movies.map((m, i) => (
        <g key={`n${i}`}>
          <line x1={fx(m.start)} y1={184 + i * 32 - 5} x2={fx(m.start + 1000)} y2={184 + i * 32 - 5} stroke={TRACK} strokeWidth="1" />
        </g>
      ))}
      <Num x={fx(1520) + 40} y={296} anchor="start">N = 1000</Num>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ */
/* Replicates from series numbers: blocks of ten, numbered in order, gaps allowed */

export function ReplicateBlocksDiagram() {
  const present = new Set<number>([
    ...range(1, 8),
    ...range(11, 17),
    ...range(31, 36),
  ]);
  const cell = 12;
  const step = 13;
  const x0 = 40;
  const y = 92;
  const blocks = [
    { from: 1, rep: '1' },
    { from: 11, rep: '2' },
    { from: 21, rep: null },
    { from: 31, rep: '3' },
  ];
  return (
    <Diagram
      width={600}
      height={216}
      label="Forty series numbers in four blocks of ten. Three blocks hold movies and become replicates 1, 2 and 3; the empty third block is skipped."
      caption="Series 001–040, one square each; filled squares are movies in the folder. Each block of ten that holds movies is one replicate, numbered in the order the blocks occur: 031–036 is replicate 3 because 021–030 is empty."
    >
      {blocks.map((b) => {
        const bx = x0 + (b.from - 1) * step + Math.floor((b.from - 1) / 10) * 10;
        return (
          <g key={b.from}>
            <Num x={bx} y={y - 16} anchor="start">{String(b.from).padStart(3, '0')}</Num>
            {range(b.from, b.from + 9).map((n) => (
              <rect
                key={n}
                x={bx + (n - b.from) * step}
                y={y}
                width={cell}
                height={cell}
                rx="2"
                fill={present.has(n) ? FILL : 'none'}
                stroke={present.has(n) ? LINE : GRID}
                strokeWidth="1.25"
                strokeDasharray={present.has(n) ? undefined : '2 2'}
              />
            ))}
            {b.rep ? (
              <>
                <path
                  d={`M${bx} ${y + 24} v6 H${bx + 9 * step + cell} v-6`}
                  fill="none"
                  stroke={TRACK}
                  strokeWidth="1.25"
                />
                <circle cx={bx + (9 * step + cell) / 2} cy={y + 56} r="13" fill={PAPER} stroke={TRACK} strokeWidth="1.25" />
                <Num x={bx + (9 * step + cell) / 2} y={y + 60}>{b.rep}</Num>
              </>
            ) : null}
          </g>
        );
      })}
    </Diagram>
  );
}

function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

/* ------------------------------------------------------------------ */
/* The frame interval is the camera's: exposure inside a longer frame period */

export function FrameTimingDiagram() {
  const x0 = 48;
  const period = 128;
  const exposure = 104; // gap drawn wider than life so it can be seen
  const y = 120;
  return (
    <Diagram
      width={600}
      height={240}
      label="Four frames on a time line. Each frame period is slightly longer than its exposure."
      caption="Four frames in time. a The exposure, 20 ms: the number u-track is often given. b The frame interval, 20.47 or 25 ms: how often the camera actually took a frame. SMTracker uses b, read from the camera file. (The gap between exposures is drawn wider than it is.)"
    >
      <line x1={x0 - 16} y1={y + 48} x2={x0 + 4 * period + 16} y2={y + 48} stroke={LINE} strokeWidth="1.25" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={x0 + i * period} y={y} width={exposure} height={40} rx="4" fill={FILL} stroke={LINE} strokeWidth="1.25" />
          <line x1={x0 + i * period} y1={y + 44} x2={x0 + i * period} y2={y + 54} stroke={LINE} strokeWidth="1.25" />
        </g>
      ))}
      <line x1={x0 + 4 * period} y1={y + 44} x2={x0 + 4 * period} y2={y + 54} stroke={LINE} strokeWidth="1.25" />
      {/* a: exposure */}
      <path d={`M${x0} ${y - 10} v-6 H${x0 + exposure} v6`} fill="none" stroke={TRACK} strokeWidth="1.25" />
      <Letter x={x0 + exposure / 2 - 4} y={y - 24}>a</Letter>
      {/* b: frame interval */}
      <path d={`M${x0 + period} ${y + 64} v6 H${x0 + 2 * period} v-6`} fill="none" stroke={TRACK} strokeWidth="1.5" />
      <Letter x={x0 + period + period / 2 - 4} y={y + 90}>b</Letter>
      {/* a lit spot in each exposure: what the frame records */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={`s${i}`} cx={x0 + i * period + exposure / 2} cy={y + 20} r="5" fill={SPOT} />
      ))}
    </Diagram>
  );
}

/* ------------------------------------------------------------------ */
/* Linking radius: the furthest a molecule may move between frames */

export function LinkingRadiusDiagram() {
  // one grid square is one camera pixel (24 units); a radius of 5 px is 120 units
  const gx = 8;
  const gy = 7;
  const cx = gx * 24 + 12;
  const cy = gy * 24 + 12;
  const r = 120;
  const px = (x: number, y: number, fill: string) => (
    <rect key={`${x}-${y}`} x={x * 24} y={y * 24} width="24" height="24" fill={fill} />
  );
  return (
    <Diagram
      width={600}
      height={360}
      label="A molecule on the pixel grid with a circle of five pixels around it. A jump that lands inside the circle is linked; a jump that lands outside is not."
      caption="One grid square is one camera pixel. The circle is a linking radius of 5 px around a molecule (the lit pixels). Its next positions inside the circle are linked into the track (solid). A jump that lands outside is not (dashed), so the fastest molecules break into short pieces or are lost. That is why the radius sets the fastest D that can be measured."
    >
      {/* the molecule in frame t: a spot of lit pixels, brightest at its center */}
      {px(gx - 1, gy, GRID)}
      {px(gx + 1, gy, GRID)}
      {px(gx, gy - 1, GRID)}
      {px(gx, gy + 1, GRID)}
      {px(gx, gy, SPOT_STRONG)}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE} strokeWidth="1.25" strokeDasharray="5 4" />
      <line x1={cx} y1={cy} x2={cx} y2={cy + r} stroke={LINE} strokeWidth="1.25" />
      <Num x={cx + 8} y={cy + r / 2 + 30} anchor="start">5 px</Num>
      {/* linked: two short jumps inside the radius */}
      <polyline
        points={`${cx},${cy} ${cx + 48},${cy - 60} ${cx + 92},${cy - 30}`}
        fill="none"
        stroke={TRACK}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={cx + 48} cy={cy - 60} r="3.5" fill={PAPER} stroke={TRACK} strokeWidth="1.25" />
      <circle cx={cx + 92} cy={cy - 30} r="4" fill={TRACK} />
      {/* too far: not linked */}
      <line x1={cx} y1={cy} x2={cx + 228} y2={cy + 96} stroke={TRACK} strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
      <circle cx={cx + 228} cy={cy + 96} r="4" fill={PAPER} stroke={TRACK} strokeWidth="1.25" />
      <g stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round">
        <line x1={cx + 166} y1={cy + 64} x2={cx + 178} y2={cy + 76} />
        <line x1={cx + 178} y1={cy + 64} x2={cx + 166} y2={cy + 76} />
      </g>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ */
/* Flow: a row of boxes joined by arrows (the Pipeline board's boxes, without the branches) */

export function Flow({
  steps,
  caption,
}: {
  steps: { title: string; body?: string; mono?: string; focus?: boolean; dashed?: boolean }[];
  caption?: ReactNode;
}) {
  return (
    <figure className="not-prose @container my-6">
      <div className="relative isolate overflow-hidden rounded-[20px] p-5 @2xl:p-6">
        <FlowGround />
        <ol className="flex flex-col items-stretch gap-2 @2xl:flex-row @2xl:items-center @2xl:gap-0">
          {steps.map((s, i) => (
            <li key={s.title} className="flex min-w-0 flex-1 flex-col items-stretch @2xl:flex-row @2xl:items-center">
              {i > 0 ? <Arrow /> : null}
              <div
                className={cn(
                  'min-w-0 flex-1 rounded-xl border-[1.25px] border-(--ill-line) p-3.5 text-[13px] leading-[19px]',
                  s.dashed && 'border-dashed',
                  s.focus ? 'bg-(--ill-fill) text-em-body' : 'bg-(--ill-paper) text-fg-secondary',
                )}
              >
                <b className="block text-[15px] leading-[21px] font-semibold text-fd-foreground">{s.title}</b>
                {s.body}
                {s.mono ? <span className="mt-1 block font-mono text-xs leading-[18px] text-em-text">{s.mono}</span> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[13px] leading-5 text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function FlowGround() {
  const id = useId().replace(/:/g, '');
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 size-full">
      <defs>
        <pattern id={`${id}-g`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0V24M0 24H24" fill="none" stroke={GRID} strokeWidth="1" strokeDasharray="2 3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="var(--ill-ground)" />
      <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
    </svg>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center justify-center py-1 @2xl:w-9 @2xl:py-0">
      <svg width="24" height="24" viewBox="0 0 24 24" className="rotate-90 @2xl:rotate-0">
        <path d="M2 12H17" stroke={LINE} strokeWidth="2" />
        <path d="M15 7 L23 12 L15 17 Z" fill={LINE} />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers for pages */

/** Two things side by side on wide screens (folder layouts, before and after). */
export function Columns({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 [&>figure]:my-0">{children}</div>;
}

/** A condition row as the preparation window's sidebar shows it. */
export function ConditionRow({
  name,
  progress,
  status,
}: {
  name: string;
  progress: number;
  status: string;
}) {
  return (
    <figure className="not-prose my-6 max-w-sm">
      <div className="flex flex-col gap-2 rounded-xl border border-fd-border bg-sidebar p-3.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-fd-muted">
          <span className="block h-full rounded-full bg-emission-600 dark:bg-emission-300" style={{ width: `${progress}%` }} />
        </span>
        <span className="font-mono text-xs text-fd-muted-foreground">{status}</span>
      </div>
      <figcaption className="mt-2 text-[13px] leading-5 text-fd-muted-foreground">
        A condition in the sidebar: its progress and a status line.
      </figcaption>
    </figure>
  );
}
