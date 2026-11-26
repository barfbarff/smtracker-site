'use client';

// The backs of the three prints of the real app (components/landing/chapter-analysis.tsx): turn a print over and
// it shows the window, with four numbered notes on what else it does. Tracking: the preparation window's
// Detect & link page. Outlines: the outline editor. Simulated data: the generator's Kinetics page.
//
// To remove them: set PRINT_BACKS to false in chapter-analysis.tsx (both prints go back to one side), or delete
// this file, its screenshots (assets/detect-link-app.webp, assets/edit-outlines-app.webp) and the lines marked
// "the back".

import Image from 'next/image';
import { forwardRef } from 'react';
// screenshots of SMTracker 3 (light): the preparation window's Detect & link page on simulated movies (Windows,
// rendered off screen, 26 Nov 2026), and the outline editor, one field (macOS)
import detectApp from '@/components/landing/assets/detect-link-app.webp';
import editorApp from '@/components/landing/assets/edit-outlines-app.webp';
// the generator's Kinetics page, its own example (rendered off screen, 26 Nov 2026), cut to the page's two cards
import generatorKineticsApp from '@/components/landing/assets/generator-kinetics-app.webp';

type Note = { x: number; y: number; title: string; line: string };

/** where each note's pin sits, in % of the screenshot (2000 × 940): in the space beside its control, never on its words */
const TRACKING_NOTES: Note[] = [
  { x: 76, y: 10.1, title: 'Tracker', line: 'TrackMate in Fiji, or u-track in MATLAB, run for you.' },
  { x: 42.5, y: 30.6, title: 'Threshold', line: 'Measured from each movie\u2019s own noise.' },
  { x: 62, y: 26.2, title: 'Linking radius', line: 'With the fastest\u00a0D it can still measure.' },
  { x: 6.25, y: 35, title: 'Batch', line: 'Many folders overnight, with a report.' },
];

/** the outline editor's notes, in % of its screenshot (2000 × 1160), each pin just after its control's words */
const EDITOR_NOTES: Note[] = [
  { x: 72.3, y: 8.5, title: 'Tools', line: 'Draw, split, merge, bend or straighten a cell.' },
  { x: 46.8, y: 13.5, title: 'View', line: 'Phase, sum or overlay, with tint and contrast.' },
  { x: 8.9, y: 9.8, title: 'Fields', line: 'Every field of a condition, and how many are done.' },
  { x: 8.2, y: 48.6, title: 'Cells', line: 'Each cell\u2019s length, width and shape as you edit.' },
];

/** the generator's Kinetics page, in % of its screenshot (1140 × 522), each pin in the space beside its control */
const GENERATOR_NOTES: Note[] = [
  { x: 44.3, y: 45, title: 'Movie times', line: 'Each movie at its own time since the addition.' },
  { x: 23.1, y: 60.5, title: 'Delay and half-time', line: 'How fast the change comes, spread over replicates and cells.' },
  { x: 36, y: 93.9, title: 'Mock', line: 'An addition that changes nothing, on the same schedule.' },
  { x: 89.8, y: 70.9, title: 'Response', line: 'Every population’s D and share, from before to after.' },
];

function Pin({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <span
      aria-hidden
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute flex size-[clamp(15px,3.2cqw,19px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--print-ink) font-card text-[clamp(10px,2cqw,11px)] text-(--print-paper) shadow-[0_0_0_2px_var(--print-paper),0_2px_6px_rgb(0_0_0/0.25)]"
    >
      {n}
    </span>
  );
}

/** the turn icon on both sides' buttons */
export function FlipIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-[1.1em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 8a5 5 0 1 1-1.6-3.7" />
      <path d="M13 2.5v2.6h-2.6" />
    </svg>
  );
}

/**
 * the button on either side: "Flip to learn more" on the front, "Flip back" on the back. It has no click
 * handler of its own: its click (mouse, Enter or Space) bubbles up to the print, which does the turning.
 */
export const FlipButton = forwardRef<HTMLButtonElement, { children: React.ReactNode; label: string }>(
  function FlipButton({ children, label }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-(--print-edge) px-2.5 py-1 font-card text-(--print-ink-soft) transition-colors hover:bg-black/[0.04] hover:text-(--print-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--print-ink)"
      >
        <FlipIcon />
        {children}
      </button>
    );
  },
);

/** a back's content: the screenshot with its numbered pins, and the notes underneath */
function PrintBack({ image, alt, notes }: { image: typeof detectApp; alt: string; notes: Note[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* never shrunk: the notes take only the room left under it, so the pins stay on their controls */}
      <div className="relative shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10">
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 768px) 620px, 86vw"
          className="block h-auto w-full dark:brightness-[0.88]"
        />
        {notes.map((note, i) => (
          <Pin key={note.title} n={i + 1} x={note.x} y={note.y} />
        ))}
      </div>
      <ol className="my-auto grid grid-cols-2 gap-x-[6%] gap-y-[1.2em] px-[1%] py-[3%] text-(--landing-body)">
        {notes.map((note, i) => (
          <li key={note.title} className="flex gap-[0.5em] text-[clamp(12px,2.8cqw,15.5px)] leading-snug text-balance">
            <span className="font-card text-(--print-ink)">{i + 1}</span>
            <span>
              <span className="font-semibold text-(--print-ink)">{note.title}</span>
              <span className="hidden @sm:inline"> · {note.line}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** the back of the tracking print */
export function TrackingBack() {
  return (
    <PrintBack
      image={detectApp}
      notes={TRACKING_NOTES}
      alt="SMTracker 3's Detect & link page on simulated movies: the tracker switch between TrackMate (Fiji) and u-track (MATLAB), a row per condition with its measured detection threshold, spot radius, linking radius and frame gap, and a chart of how the threshold stands against one movie's noise"
    />
  );
}

/** the back of the simulated-data print */
export function GeneratorBack() {
  return (
    <PrintBack
      image={generatorKineticsApp}
      notes={GENERATOR_NOTES}
      alt="SMTracker 3's simulated-data Kinetics page: a condition with a change after an addition, its movie times, delay, half-time and onset spreads, the mock switch, and the response curve with each movie's time marked"
    />
  );
}

/** the back of the outlines print */
export function OutlinesBack() {
  return (
    <PrintBack
      image={editorApp}
      notes={EDITOR_NOTES}
      alt="SMTracker 3's outline editor: the field list and the cells with their sizes on the left, the editing tools and view options above a phase-contrast image with its cell outlines, and the list of keys below"
    />
  );
}
