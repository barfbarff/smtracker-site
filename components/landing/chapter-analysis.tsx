'use client';

// The pieces of the landing page's pictures (components/landing/landing.tsx): a print of the real app (Polaroid),
// the screen recordings on it (Recording), the stack of four analysis prints with its arrows (AnalysisStack), and
// the three cards of "From start to finish" (OverviewCards), each with a live demo from pipeline.tsx.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, type Transition } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { FlipButton, OutlinesBack, PlaybackBack } from '@/components/landing/polaroid-back';
// a real recording of SMTracker 3's track playback (macOS): its first frame, shown before the video plays
// and instead of it under reduced motion. The video itself is public/media/track-playback.mp4.
import playbackPoster from '@/components/landing/assets/track-playback-poster.jpg';
// a real recording of SMTracker 3's outline editing (macOS): the tool row, the image and the status line, cut from
// one screen recording and stacked; its first frame. The video itself is public/media/cell-outlines.mp4.
import outlinesPoster from '@/components/landing/assets/cell-outlines-poster.jpg';
import { AnalysisDemo, OutlinesDemo, PlaybackDemo } from '@/components/landing/pipeline';
import { ANALYSES, PrintBackPicture, PrintPicture, StackControls } from '@/components/landing/analysis-prints';

/* ---------- the real recordings ---------- */

/**
 * A screen recording of SMTracker 3, muted and looping (its last half second dissolves into its first, so the
 * loop has no jump): track playback (10 s) and outline editing (12 s). It loads only when first needed, plays
 * only while its print is in view, and under reduced motion stays on its first frame.
 */
export function Recording({
  src,
  poster,
  label,
  playing,
}: {
  /** the file in public/media */
  src: string;
  poster: { src: string; width: number; height: number };
  label: string;
  playing: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <video
      ref={video}
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/media/${src}`}
      poster={poster.src}
      width={poster.width}
      height={poster.height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="block h-auto w-full dark:brightness-[0.88]"
    />
  );
}

/**
 * A print of the real app: a white frame with the deeper strip at the bottom that holds the caption, laid
 * on the page at a slight tilt (the tracker cards' tilt) with a layered shadow, a soft wide one for depth
 * and a tight one for contact. On desktop it tilts a few degrees toward the pointer and settles back when
 * the pointer leaves; touch screens and reduced motion get the plain tilted print.
 *
 * It is sized by height, since the recording is portrait: on phones it stays inside the figure, from
 * tablet width it may use most of the height under the masthead (centered on the figure, beyond its edges).
 */
// The print's shadow resting on the page, and lifted just before it lands (softer, wider, further down).
const RESTING =
  '0 1px 1px rgb(0 0 0 / 0.08), 0 2px 6px rgb(0 0 0 / 0.06), 0 14px 28px -8px rgb(0 0 0 / 0.22), 0 34px 70px -24px rgb(0 0 0 / 0.3)';
const LIFTED =
  '0 1px 1px rgb(0 0 0 / 0.02), 0 6px 14px rgb(0 0 0 / 0.04), 0 28px 48px -8px rgb(0 0 0 / 0.16), 0 60px 110px -24px rgb(0 0 0 / 0.24)';

// The settle's timing: it starts with the zoom and eases in and out, so the tilt changes gradually,
// slow at first, through the middle, and slow again as it comes to rest (no jump at the start).
const SETTLE = { delay: 0.15, duration: 1.1, ease: [0.45, 0, 0.25, 1] as const };
// ...and leaving, it lifts back just as smoothly, over the panel's own zoom-out, so nothing snaps.
const UNSETTLE = { duration: 0.7, ease: [0.45, 0, 0.25, 1] as const };

// the back: turning the print over (see components/landing/polaroid-back.tsx)
const FLIP = { duration: 0.7, ease: [0.45, 0, 0.25, 1] as const };

export function Polaroid({
  caption,
  reduce,
  landed,
  children,
  back,
  flipped = false,
  onFlip,
  tilt = -2,
  landscape = false,
  backLabel = 'Also in playback',
  width,
  place = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}: {
  caption: ReactNode;
  reduce: boolean;
  /** true on its step: the print settles onto the page, once, like one tossed onto a table */
  landed: boolean;
  children: ReactNode;
  /** the back: when given, a button under the caption turns the print over to show it */
  back?: ReactNode;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** its resting tilt in degrees: the playback print leans left (-2), the outlines print right (2), a pair */
  tilt?: number;
  /** a wider-than-tall picture (the outlines recording): sized by width as well as by height */
  landscape?: boolean;
  /** the words at the foot of the back, beside "Flip back" */
  backLabel?: string;
  /** its width, in place of the ones from the screen's height (the analysis stack sizes its prints to its own room) */
  width?: string;
  /** where it sits: centered over its box (the analysis stack), or `relative` in the page's flow */
  place?: string;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 18 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 8); // degrees: toward the pointer, at most 4 each way
    rx.set(-y * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  // the back: turned with the keyboard, the other side's button takes the focus (so Enter turns it back,
  // with its focus ring). Clicked or tapped, nothing is focused, so no ring appears.
  const frontButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const turn = (to: boolean, fromKeys: boolean) => {
    onFlip?.(to);
    if (fromKeys) requestAnimationFrame(() => (to ? backButton : frontButton).current?.focus({ preventScroll: true }));
  };
  const shown = flipped && back != null;
  // the back is visible only while shown (it is hidden by its back face anyway, mid-turn it switches at the
  // start or the end). Under reduced motion the print turns at once and the back fades in.
  const backFade = reduce
    ? { duration: 0.25 }
    : shown
      ? { duration: 0 }
      : { duration: 0, delay: FLIP.duration };
  const settle = reduce ? { duration: 0 } : landed ? SETTLE : UNSETTLE;
  return (
    // the pointer and the click are caught here, on the flat box around the print: WebKit's hit-testing through
    // the turned, tilted 3D layers inside can miss them (a click on the print would sometimes do nothing).
    // A button's click (mouse, Enter or Space) bubbles up to here too.
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      // a click from Enter or Space has no pointer behind it (detail 0)
      // the size of the caption strip, set here once: the front's caption and the back's footer inherit it, so the
      // strip keeps its size when the print turns over (each side's own frame is a different width)
      onClick={back != null ? (e) => turn(!shown, e.detail === 0) : undefined}
      className={`${place} text-[clamp(11px,2.1cqw,13px)] [perspective:1100px] ${width ?? (landscape ? 'w-[86%] md:w-[min(96%,calc((100svh-65px)*0.8))]' : 'w-[72%] md:w-[min(96%,calc((100svh-65px)*0.8/1.2))]')}${back != null ? ' cursor-pointer select-none' : ''}`}
    >
      {/* the settle: it arrives 4° more tilted and a little larger, then eases onto the page as its shadow
          tightens. Leaving, it lifts back the same way while the panel zooms out, ready to land again. */}
      <motion.div
        initial={false}
        animate={landed ? { rotate: 0, scale: 1 } : { rotate: tilt * 2, scale: 1.04 }}
        transition={settle}
        className="[transform-style:preserve-3d]"
      >
        <motion.div style={{ rotateX, rotateY, rotateZ: tilt }} className="[transform-style:preserve-3d]">
          <motion.div
            initial={false}
            animate={{ rotateY: shown ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : FLIP}
            className="relative [transform-style:preserve-3d]"
          >
            <motion.figure
              inert={shown}
              initial={false}
              animate={{ boxShadow: landed ? RESTING : LIFTED }}
              transition={settle}
              className="m-0 rounded-[4px] bg-(--print-paper) p-[5%] pb-0 [backface-visibility:hidden]"
            >
              <div className="overflow-hidden rounded-[2px] ring-1 ring-black/10">{children}</div>
              {back != null ? (
                <figcaption className="@container flex items-center justify-between gap-3 py-[3.2%] font-card text-(--print-ink-soft)">
                  <span className="min-w-0 truncate">{caption}</span>
                  <FlipButton ref={frontButton} label="Flip to learn more">
                    Flip<span className="hidden @sm:inline"> to learn more</span>
                  </FlipButton>
                </figcaption>
              ) : (
                <figcaption className="@container py-[4.5%] text-center font-card text-(--print-ink-soft)">
                  {caption}
                </figcaption>
              )}
            </motion.figure>
            {back != null ? (
              <motion.div
                inert={!shown}
                initial={false}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={backFade}
                style={{ transform: 'rotateY(180deg)', boxShadow: RESTING }}
                className="@container absolute inset-0 flex flex-col overflow-hidden rounded-[4px] bg-(--print-paper) p-[5%] pb-0 [backface-visibility:hidden]"
              >
                {back}
                <div className="flex items-center justify-between gap-3 py-[3.2%] font-card text-(--print-ink-soft)">
                  <span className="min-w-0 truncate">{backLabel}</span>
                  <FlipButton ref={backButton} label="Flip back">
                    Flip back
                  </FlipButton>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- every analysis: a stack of prints ---------- */

/** where a print lies in the stack, by its depth (0 on top): each further back a little off, turned and smaller */
// (the ones behind rise and shrink, so only their top edges show above the top print, never their captions)
const STACK_POSE = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 4, y: -6, rotate: 3, scale: 0.95 },
  { x: -4, y: -10, rotate: -3, scale: 0.9 },
  { x: 5, y: -13, rotate: 4, scale: 0.85 },
];
/**
 * Leafing through the stack, one way each time, so a print never crosses the pile half seen. Next: the top print
 * slides out to the right, whole and over the pile, uncovering the one under it; out at the side it fades away, and
 * it fades back in at the back of the pile (where only its top edge shows) while the others rise a place. Previous:
 * the thin edge of the print at the back fades, and that print comes in from the left, over the pile from the start,
 * fading in while it is still mostly out at the side, and lands on top while the others step back a place.
 */
const LEAF = {
  /** the whole move of the print that changes place, in seconds: previous, which slows into place on top */
  duration: 0.65,
  /** ...and next, an exit, a touch quicker */
  exit: 0.55,
  /** next: when it is out at the side and gone, as a share of the move (it goes to the back then, unseen). Next
   *  is an exit, with nowhere to land in sight: it sets off gently, speeds away and fades as it goes, so it never
   *  lingers at the side. (Previous has a place to land, the top of the pile, so it slows into it.) */
  away: 0.7,
  /** previous: when it has left the back, unseen, and starts in from the side */
  enter: 0.14,
  /** how far out to the side it goes, as a share of the stack's width */
  out: 64,
};

/**
 * The four analysis prints (ANALYSES), stacked on the page, with previous and next under them. The one on top is
 * whole: its caption, its tilt to the pointer and its back. Next: the top print slides out to the side and tucks
 * in at the back while the others move up a place. Previous: the print at the back slides out from behind and
 * lands on top. On touch screens a sideways swipe on the stack does the same (a tap still turns a print over).
 */
export function AnalysisStack({
  top,
  onTop,
  landed,
  reduce,
  flipped,
  onFlip,
}: {
  top: number;
  /** bring another print to the top (a person did: the stack stops turning on its own) */
  onTop: (i: number) => void;
  landed: boolean;
  reduce: boolean;
  flipped: boolean;
  onFlip: (flipped: boolean) => void;
}) {
  const n = ANALYSES.length;
  const next = () => onTop((top + 1) % n);
  const prev = () => onTop((top + n - 1) % n);
  // which print moved last, and which way: the one that went to the back (next), or came from it (previous)
  // `turned`: the moving print has gone unseen and changed layer (over the pile to behind it, or the other way)
  const [shown, setShown] = useState({ top, moved: -1, way: 1, turned: true });
  if (shown.top !== top) {
    const way = (top - shown.top + n) % n === n - 1 ? -1 : 1;
    setShown({ top, moved: way === 1 ? shown.top : top, way, turned: reduce });
  }
  // a sideways swipe on a touch screen (vertical movement stays the page's scroll)
  const swipe = useRef<{ x: number; y: number } | null>(null);
  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        className="relative min-h-0 flex-1 touch-pan-y [container-type:size]"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const from = swipe.current;
          swipe.current = null;
          if (!from) return;
          const dx = e.clientX - from.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - from.y)) {
            if (dx < 0) next();
            else prev();
          }
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        {ANALYSES.map((a, i) => {
          const depth = (i - top + n) % n;
          const pose = STACK_POSE[depth];
          const to = { x: `${pose.x}%`, y: `${pose.y}%`, rotate: pose.rotate, scale: pose.scale, opacity: 1 };
          const back = STACK_POSE[n - 1];
          const moving = !reduce && i === shown.moved;
          const P = (q: { x: number; y: number }) => [`${q.x}%`, `${q.y}%`];
          const [toX, toY] = P(pose);
          const [backX, backY] = P(back);
          const animate = !moving
            ? to
            : shown.way === 1
              ? // next: out to the right, whole; then, unseen, to the back, and in sight again there
                {
                  x: ['0%', `${LEAF.out}%`, backX, backX],
                  y: ['0%', '-2%', backY, backY],
                  rotate: [0, 7, back.rotate, back.rotate],
                  scale: [1, 0.97, back.scale, back.scale],
                  opacity: [1, 1, 0, 0, 1],
                }
              : // previous: the edge at the back fades; then, unseen, out to the left, and in on top from there
                {
                  x: [backX, backX, `${-LEAF.out}%`, toX],
                  y: [backY, backY, '-2%', toY],
                  rotate: [back.rotate, back.rotate, -7, pose.rotate],
                  scale: [back.scale, back.scale, 0.97, pose.scale],
                  opacity: [1, 0, 0, 1, 1],
                };
          const out = [0.3, 0, 0.2, 1] as const;
          const transition: Transition = reduce
            ? { duration: 0 }
            : moving
              ? shown.way === 1
                ? {
                    duration: LEAF.exit,
                    times: [0, LEAF.away, LEAF.away + 0.02, 1],
                    // an exit's curve: a gentle start, then away quickly (no slowing down at the side)
                    ease: [motionTokens.easing.exit, 'linear', 'linear'],
                    // whole while it starts to uncover the next print, then fading as it speeds away, gone as it
                    // reaches the side; then a quick fade in at the back, where only its top edge shows
                    opacity: {
                      duration: LEAF.exit,
                      times: [0, 0.3, LEAF.away, LEAF.away + 0.04, 1],
                      ease: 'linear',
                    },
                  }
                : {
                    duration: LEAF.duration,
                    times: [0, LEAF.enter - 0.02, LEAF.enter, 1],
                    ease: ['linear', 'linear', out],
                    // (whole again within a tenth of a second: it is half seen only out at the edge of the pile)
                    opacity: { duration: LEAF.duration, times: [0, LEAF.enter - 0.04, LEAF.enter, 0.26, 1], ease: 'linear' },
                  }
              : // the rest move a place as the top print slides off (next), or as the new one comes in
                shown.way === 1
                ? { duration: 0.45, delay: LEAF.exit * 0.05, ease: out }
                : { duration: 0.4, delay: LEAF.duration * 0.1, ease: out };
          // its layer: the moving print stays over the pile (next) or behind it (previous) until it is unseen
          const z = moving && !shown.turned ? (shown.way === 1 ? n + 1 : 0) : n - depth;
          return (
            <motion.div
              key={a.label}
              inert={depth !== 0}
              initial={false}
              animate={animate}
              transition={transition}
              style={{ zIndex: z }}
              // the layer changes on the move's own clock, in the frame its print is first unseen (a timer beside the
              // animation could fire a frame late, once the fade back in had begun, and show it over the pile)
              onUpdate={
                moving && !shown.turned
                  ? (latest) => {
                      if (Number(latest.opacity) < 0.01) setShown((s) => (s.turned ? s : { ...s, turned: true }));
                    }
                  : undefined
              }
              aria-hidden={depth !== 0}
              className="absolute inset-0"
            >
              <Polaroid
                reduce={reduce}
                landed={landed}
                tilt={a.tilt}
                // as wide as the room under the masthead and over the arrows lets it be, caption and all
                width="w-[min(86cqw,calc((100cqh-32px)*1.3))] md:w-[min(96cqw,calc((100cqh-48px)*1.25))]"
                caption={
                  <>
                    {a.label}
                    <span className="hidden @[17rem]:inline"> · {a.detail}</span>
                  </>
                }
                back={<PrintBackPicture print={a} />}
                backLabel={a.backLabel}
                flipped={depth === 0 && flipped}
                onFlip={onFlip}
              >
                <PrintPicture src={a.front} alt={a.frontAlt} />
              </Polaroid>
            </motion.div>
          );
        })}
      </div>
      <div className="relative z-10 shrink-0 pt-3">
        <StackControls top={top} onPrev={prev} onNext={next} />
      </div>
    </div>
  );
}

/* ---------- "From start to finish": three cards ---------- */

const OVERVIEW = [
  {
    title: 'Track playback',
    line: 'Play your tracks back over the movie, or open them in napari without loading them again.',
  },
  {
    title: 'Cell outlines',
    line: 'Unhappy with an outline? Draw, split, merge or bend it.',
  },
  {
    title: 'Analyses',
    line: 'SQD, MSD, Apparent D and more, from the same tracks.',
  },
];

// The cards are prints like the tracker cards (.sm-card in app/global.css) but stay still (.sm-card-still):
// their demos are the motion here, and one moving thing per card is enough.

/**
 * "From start to finish": the three cards, each with its live demo on top and its words below; in a row from
 * tablet width, one under another on phones. The demos play while `playing` (the section is in view).
 */
export function OverviewCards({ playing }: { playing: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
      {OVERVIEW.map((o, i) => (
        <div key={o.title} className="sm-card sm-card-still @container flex h-full flex-col border px-[6%] pt-[6%] pb-[3%]">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-(--ill-ground) p-2">
            {i === 0 ? <PlaybackDemo playing={playing} /> : null}
            {i === 1 ? <OutlinesDemo playing={playing} /> : null}
            {i === 2 ? <AnalysisDemo playing={playing} /> : null}
          </div>
          {/* the caption: room below the picture, title and line kept as a pair */}
          <div className="flex flex-col gap-2 px-1 pt-5 pb-2 lg:pt-6">
            <span className="font-display text-[18px] leading-tight lg:text-[20px]">{o.title}</span>
            <span className="text-[13px] leading-snug font-[425] text-(--landing-body) lg:text-[14px]">{o.line}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
