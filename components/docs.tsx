// The MDX pieces the manual needs, styled to sit on Fumadocs' defaults (Components board of the design canvas).
import Link from 'next/link';
import { useId, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { AppWindow, Ban, File as FileIcon, Folder as FolderIcon, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  AnalysisIllustration,
  CellOutlinesIllustration,
  FiguresIllustration,
  FoldersIllustration,
  SpotIllustration,
  TrackingIllustration,
} from '@/components/illustrations';

/* ---------- Callout ---------- */

type CalloutType = 'note' | 'app' | 'check' | 'refused';
const calloutAliases: Record<string, CalloutType> = {
  info: 'note',
  tip: 'app',
  warn: 'check',
  warning: 'check',
  error: 'refused',
};

const calloutStyles: Record<CalloutType, { box: string; icon: ReactNode; label: string }> = {
  note: {
    box: 'border-fd-border bg-sidebar',
    icon: <Info className="size-5 text-fg-secondary" />,
    label: 'Note.',
  },
  app: {
    box: 'border-em-border bg-em-softer text-em-callout-text',
    icon: <AppWindow className="size-5 text-em-text" />,
    label: 'In the app.',
  },
  check: {
    box: 'border-amber-border bg-amber-bg text-[#3d2a05] dark:text-amber-fg',
    icon: <TriangleAlert className="size-5 text-amber-icon" />,
    label: 'Check this.',
  },
  refused: {
    box: 'border-red-200 bg-red-50 text-[#450a0a] dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
    icon: <Ban className="size-5 text-red-700 dark:text-red-400" />,
    label: 'Refused.',
  },
};

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType | keyof typeof calloutAliases;
  /** Bold lead-in. Defaults to the type's label; pass false to omit. */
  title?: ReactNode | false;
  children: ReactNode;
}) {
  const kind = (calloutAliases[type] ?? type) as CalloutType;
  const s = calloutStyles[kind] ?? calloutStyles.note;
  const lead = title === false ? null : (title ?? s.label);
  return (
    <div
      role="note"
      className={cn(
        'not-prose my-6 flex gap-3 rounded-xl border px-4 py-3.5 text-[15px] leading-6',
        kind === 'note' && 'text-fd-foreground',
        s.box,
      )}
    >
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {s.icon}
      </span>
      <div className="min-w-0 [&_code]:font-mono [&_code]:text-[14px] [&>p]:m-0 [&>p+p]:mt-2">
        {lead ? <b className="font-semibold">{lead} </b> : null}
        {children}
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

/** Numbered steps on an emission-200 rule (Docs board, "Save before you track"). */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="sm-steps not-prose my-6 ml-3.5 flex list-none flex-col border-l border-em-border p-0">{children}</ol>;
}

export function Step({ children }: { children: ReactNode }) {
  return (
    <li className="sm-step relative pb-6 pl-8 text-base leading-7 last:pb-0 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_p]:m-0 [&_p+p]:mt-2 [&_code]:rounded-[5px] [&_code]:bg-fd-muted [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:text-sm">
      {children}
    </li>
  );
}

/* ---------- Keys ---------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-b-2 border-fd-border bg-fd-secondary px-1.5 align-[1px] font-mono text-xs font-normal text-fd-foreground">
      {children}
    </kbd>
  );
}

/** A two-column table of keys and what they do. */
export function Keys({ items }: { items: [string | string[], ReactNode][] }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border text-sm leading-[22px]">
      {items.map(([keys, desc], i) => (
        <div
          key={i}
          className="grid grid-cols-[120px_minmax(0,1fr)] border-fd-border not-last:border-b sm:grid-cols-[140px_minmax(0,1fr)]"
        >
          <div className="flex gap-1 px-4 py-2.5">
            {(Array.isArray(keys) ? keys : [keys]).map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </div>
          <div className="px-4 py-2.5 text-fd-muted-foreground">{desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Status and UI names ---------- */

const statusStyles = {
  clean: { pill: 'bg-em-soft text-em-text', dot: 'bg-emission-600 dark:bg-emission-300' },
  flagged: { pill: 'bg-amber-bg text-amber-fg', dot: 'bg-amber-600' },
  'low yield': { pill: 'bg-fd-secondary text-fd-secondary-foreground', dot: 'bg-fd-muted-foreground' },
} as const;

export function Status({ type, children }: { type: keyof typeof statusStyles; children?: ReactNode }) {
  const s = statusStyles[type] ?? statusStyles['low yield'];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 align-[1px] text-[13px] font-medium',
        s.pill,
      )}
    >
      <span className={cn('size-1.5 rounded-full', s.dot)} />
      {children ?? type}
    </span>
  );
}

export function ExampleData({ children = 'Example data' }: { children?: ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-amber-border bg-amber-bg px-2 py-0.5 align-[1px] text-xs font-medium text-amber-fg">
      {children}
    </span>
  );
}

/** A button named in the manual looks like the button in the app. */
export function Ui({ children, variant = 'primary' }: { children: ReactNode; variant?: 'primary' | 'outline' }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-md px-2 align-[1px] text-[13px] leading-none font-medium',
        variant === 'primary'
          ? 'bg-fd-primary text-fd-primary-foreground'
          : 'border border-fd-border text-fd-foreground',
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Folder tree ---------- */

export function Files({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-xl border border-fd-border p-4 font-mono text-[13px] leading-[26px]">{children}</div>
      {caption ? (
        <figcaption className="mt-2 text-[13px] leading-5 text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Note({ written, children }: { written?: boolean; children?: ReactNode }) {
  if (!children) return null;
  return (
    <span className={cn('ml-2 font-sans text-xs', written ? 'text-em-text' : 'text-fd-muted-foreground')}>
      {children}
    </span>
  );
}

/** `written`: SMTracker created it, drawn in emission so the reader sees at a glance what was added. */
export function Folder({
  name,
  note,
  written,
  children,
}: {
  name: string;
  note?: ReactNode;
  written?: boolean;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <FolderIcon
          className={cn(
            'size-4 shrink-0',
            written ? 'fill-em-soft text-em-text' : 'text-fd-muted-foreground',
          )}
          strokeWidth={1.75}
        />
        {name}
        <Note written={written}>{note}</Note>
      </div>
      {children ? (
        <div className="ml-[7px] flex flex-col border-l border-fd-border pl-6">{children}</div>
      ) : null}
    </div>
  );
}

export function File({ name, note, written }: { name: string; note?: ReactNode; written?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <FileIcon
        className={cn('size-4 shrink-0', written ? 'fill-em-soft text-em-text' : 'text-fd-muted-foreground')}
        strokeWidth={1.75}
      />
      {name}
      <Note written={written}>{note}</Note>
    </div>
  );
}

/* ---------- Illustrated cards ---------- */

const art = {
  tracking: TrackingIllustration,
  outlines: CellOutlinesIllustration,
  analysis: AnalysisIllustration,
  folders: FoldersIllustration,
  figures: FiguresIllustration,
  spot: SpotIllustration,
} satisfies Record<string, ComponentType<{ title?: string }>>;

export function IllustratedCards({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

export function IllustratedCard({
  href,
  title,
  description,
  illustration,
}: {
  href: string;
  title: string;
  description?: ReactNode;
  illustration: keyof typeof art;
}) {
  const Art = art[illustration];
  return (
    <Link href={href} data-card className="group flex flex-col gap-2.5 no-underline">
      <span className="overflow-hidden rounded-2xl ring-1 ring-transparent transition group-hover:ring-em-border">
        <Art title="" />
      </span>
      <span className="text-base font-semibold text-fd-foreground">{title}</span>
      {description ? (
        <span className="text-sm leading-[22px] text-fd-muted-foreground">{description}</span>
      ) : null}
    </Link>
  );
}

/** A single illustration with a caption, for the top of a chapter. */
export function Illustration({ name, caption }: { name: keyof typeof art; caption?: ReactNode }) {
  const Art = art[name];
  return (
    <figure className="not-prose my-6">
      <div className="overflow-hidden rounded-[20px]">
        <Art title="" />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[13px] leading-5 text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/* ---------- Pipeline ---------- */
// Pipeline board: emission-50 ground under a dashed 24 px pixel grid, white boxes with a 1.25 px emission-600
// line and a 36 px icon tile, emission-600 connectors with filled heads. The input is dashed (never changed);
// the analysis, where the branches meet, is filled emission-100.

/** The illustration ground: emission-50 under a 24 px grid dashed 2 3 in emission-200. */
export function GridGround({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full', className)}>
      <defs>
        <pattern id={`${id}-g`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="var(--ill-ground)" />
      <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
    </svg>
  );
}

const tileGlyph = {
  folder: (
    <path
      d="M26 26a2 2 0 0 0 2-2V14a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L15.6 9.9A2 2 0 0 0 13.93 9H10a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      strokeLinejoin="round"
    />
  ),
  film: (
    <>
      <rect x="9" y="9" width="18" height="18" rx="2" />
      <path d="M13 9v18M23 9v18M9 14h4M9 22h4M23 14h4M23 22h4" />
    </>
  ),
  cell: <rect x="7" y="13" width="22" height="10" rx="5" transform="rotate(-20 18 18)" />,
  pulse: <path d="M28 18h-4l-3 9-6-18-3 9H8" strokeLinejoin="round" strokeLinecap="round" />,
  layout: (
    <>
      <rect x="9" y="9" width="18" height="18" rx="2" />
      <path d="M9 15h18M15 27V15" />
    </>
  ),
};

function Tile({ glyph, lit }: { glyph: keyof typeof tileGlyph; lit?: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="8"
        fill={lit ? 'var(--ill-paper)' : 'var(--ill-ground)'}
        stroke={lit ? 'var(--ill-spot)' : 'var(--ill-grid)'}
      />
      <g fill="none" stroke="var(--ill-track)" strokeWidth="1.5">
        {tileGlyph[glyph]}
      </g>
    </svg>
  );
}

function Box({
  glyph,
  title,
  body,
  variant = 'solid',
  className,
}: {
  glyph: keyof typeof tileGlyph;
  title: string;
  body: string;
  variant?: 'input' | 'solid' | 'focus';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 rounded-xl border-[1.25px] border-(--ill-line) p-4 text-[13px] leading-[19px] @6xl:flex-row @6xl:items-center',
        variant === 'input' && 'border-dashed',
        variant === 'focus' ? 'bg-(--ill-fill) text-em-body' : 'bg-(--ill-paper) text-fg-secondary',
        className,
      )}
    >
      <Tile glyph={glyph} lit={variant === 'focus'} />
      <span>
        <b className="block text-[15px] leading-[21px] font-semibold text-fd-foreground">{title}</b>
        {body}
      </span>
    </div>
  );
}

function Writes({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('block font-mono text-xs leading-[18px] text-em-text', className)}>{children}</span>;
}

/* Connector strokes: 2 px emission-600, drawn with positioned rules so they follow the boxes at any width. */
const rule = 'absolute bg-(--ill-line)';
function Head({ style }: { style: CSSProperties }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className="absolute -translate-y-1/2" style={style}>
      <path d="M0 0 L8 4 L0 8 Z" fill="var(--ill-line)" />
    </svg>
  );
}
// Two equal rows with a 16 px gap; each branch box leaves 48 px below it for its "writes" label.
const Y1 = 'calc((100% - 16px) / 4 - 24px)';
const Y2 = 'calc((100% - 16px) * 0.75 + 16px - 24px)';
const MID = 'calc((100% - 48px) / 2)';

function Fork() {
  return (
    <div aria-hidden="true" className="relative row-span-2">
      <span className={rule} style={{ left: 0, width: '50%', top: MID, height: 2, marginTop: -1 }} />
      <span className={rule} style={{ left: 'calc(50% - 1px)', width: 2, top: Y1, bottom: `calc(100% - ${Y2})` }} />
      <span className={rule} style={{ left: '50%', right: 6, top: Y1, height: 2, marginTop: -1 }} />
      <span className={rule} style={{ left: '50%', right: 6, top: Y2, height: 2, marginTop: -1 }} />
      <Head style={{ right: 0, top: Y1 }} />
      <Head style={{ right: 0, top: Y2 }} />
    </div>
  );
}

function Merge() {
  return (
    <div aria-hidden="true" className="relative row-span-2">
      <span className={rule} style={{ left: 0, width: '50%', top: Y1, height: 2, marginTop: -1 }} />
      <span className={rule} style={{ left: 0, width: '50%', top: Y2, height: 2, marginTop: -1 }} />
      <span className={rule} style={{ left: 'calc(50% - 1px)', width: 2, top: Y1, bottom: `calc(100% - ${Y2})` }} />
      <span className={rule} style={{ left: '50%', right: 6, top: MID, height: 2, marginTop: -1 }} />
      <Head style={{ right: 0, top: MID }} />
    </div>
  );
}

function Straight() {
  return (
    <div aria-hidden="true" className="relative row-span-2">
      <span className={rule} style={{ left: 0, right: 6, top: MID, height: 2, marginTop: -1 }} />
      <Head style={{ right: 0, top: MID }} />
    </div>
  );
}

function Down() {
  return (
    <svg aria-hidden="true" width="12" height="28" viewBox="0 0 12 28" className="mx-auto block">
      <path d="M6 0V20" stroke="var(--ill-line)" strokeWidth="2" />
      <path d="M1 19 L6 28 L11 19 Z" fill="var(--ill-line)" />
    </svg>
  );
}

const stages = {
  input: { glyph: 'folder', title: 'Your condition folder', body: 'movies and phase snapshots, never changed', writes: 'series001.nd2\nseries001.tif', variant: 'input' },
  tracking: { glyph: 'film', title: 'Image preparation + Tracking', body: 'crop, calibrate, detect and link, in Fiji or MATLAB', writes: 'writes bleaching/, sum/, trackmate/' },
  outlines: { glyph: 'cell', title: 'Cell outlines', body: 'find the cells, then correct them by hand', writes: 'writes cell_meshes/' },
  analysis: { glyph: 'pulse', title: 'Analysis', body: 'only tracks lying wholly inside a cell', writes: 'writes day_map.json, .smtracker_warm/', variant: 'focus' },
  figures: { glyph: 'layout', title: 'Figures', body: 'panels put together in the Composer' },
} as const satisfies Record<string, { glyph: keyof typeof tileGlyph; title: string; body: string; writes?: string; variant?: 'input' | 'focus' }>;

type StageKey = keyof typeof stages;

/** A box in a branch row: fills its row, leaving 48 px for the label. */
function BranchCell({ k }: { k: StageKey }) {
  const st = stages[k];
  return (
    <div className="relative flex min-w-0 flex-col pb-12">
      <Box {...st} className="flex-1" />
      {'writes' in st ? <Writes className="absolute bottom-0 left-0 h-12 pt-2">{st.writes}</Writes> : null}
    </div>
  );
}

/** A box between the branches: centered on the midpoint of the two branch boxes. */
function SingleCell({ k }: { k: StageKey }) {
  const st = stages[k];
  return (
    <div className="row-span-2 flex min-w-0 flex-col justify-center pb-12">
      <div className="relative">
        <Box {...st} />
        {'writes' in st ? (
          <Writes className="absolute top-full left-0 pt-2 whitespace-pre-line">{st.writes}</Writes>
        ) : null}
      </div>
    </div>
  );
}

function StackCell({ k }: { k: StageKey }) {
  const st = stages[k];
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Box {...st} />
      {'writes' in st ? <Writes className="whitespace-pre-line">{st.writes}</Writes> : null}
    </div>
  );
}

/** From a movie to fractions: two branches meet in the analysis. */
export function Pipeline({
  title = 'From a movie to fractions',
  description = 'Two branches meet in the analysis: the tracks come from the movies, the outlines from the phase snapshots.',
}: {
  title?: string | false;
  description?: string;
}) {
  return (
    <figure className="not-prose @container my-8">
      {title ? (
        <figcaption className="mb-5 flex flex-col gap-1">
          <span className="text-2xl leading-8 font-semibold tracking-[-0.02em]">{title}</span>
          {description ? <span className="text-[15px] leading-[22px] text-fd-muted-foreground">{description}</span> : null}
        </figcaption>
      ) : null}
      <div className="relative isolate overflow-hidden rounded-[20px] p-6 @3xl:px-8 @3xl:pt-8 @3xl:pb-4">
        <GridGround className="-z-10" />
        {/* Wide: the branching layout of the board */}
        <div className="hidden grid-cols-[minmax(0,1fr)_40px_minmax(0,1.1fr)_40px_minmax(0,1fr)_40px_minmax(0,1fr)] grid-rows-[1fr_1fr] gap-y-4 @3xl:grid">
          <SingleCell k="input" />
          <Fork />
          <BranchCell k="tracking" />
          <Merge />
          <SingleCell k="analysis" />
          <Straight />
          <SingleCell k="figures" />
          <BranchCell k="outlines" />
        </div>
        {/* Narrow: one column, the two branches side by side */}
        <div className="flex flex-col gap-3 @3xl:hidden">
          <StackCell k="input" />
          <Down />
          <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
            <StackCell k="tracking" />
            <StackCell k="outlines" />
          </div>
          <Down />
          <StackCell k="analysis" />
          <Down />
          <StackCell k="figures" />
        </div>
      </div>
    </figure>
  );
}
