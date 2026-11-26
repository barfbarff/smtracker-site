'use client';

// "Built-in analysis": four real figures from SMTracker 3, as a stack of prints on the page
// (the stack itself is in components/landing/chapter-analysis.tsx, AnalysisStack). Each print's front is one
// analysis across the conditions; its back, the same analysis looked at more closely. The figures are SMTracker's
// own exports (their "Test Data" titles cut off), in components/landing/assets/analyses. Under the stack, arrows
// leaf through it (StackControls), and on touch screens a swipe does the same.

import Image, { type StaticImageData } from 'next/image';
import hmmBack from '@/components/landing/assets/analyses/hmm-back.webp';
import hmmFront from '@/components/landing/assets/analyses/hmm-front.webp';
import msdBack from '@/components/landing/assets/analyses/msd-back.webp';
import msdFront from '@/components/landing/assets/analyses/msd-front.webp';
import spatialBack from '@/components/landing/assets/analyses/spatial-back.webp';
import spatialFront from '@/components/landing/assets/analyses/spatial-front.webp';
import sqdBack from '@/components/landing/assets/analyses/sqd-back.webp';
import sqdFront from '@/components/landing/assets/analyses/sqd-front.webp';

export type AnalysisPrint = {
  /** its short name, read out with its place in the stack */
  label: string;
  /** what the print shows, after its name in the caption (left out where the print is narrow) */
  detail: string;
  front: StaticImageData;
  frontAlt: string;
  back: StaticImageData;
  backAlt: string;
  /** the words at the foot of its back */
  backLabel: string;
  /** its own resting tilt on the page, in degrees */
  tilt: number;
};

export const ANALYSES: AnalysisPrint[] = [
  {
    label: 'SQD',
    detail: 'populations per condition',
    front: sqdFront,
    frontAlt:
      'SQD populations for two simulated conditions, Condition 1 and Condition 2: a bubble for each population at its diffusion coefficient on a log axis, sized by its share, with the share and its spread written underneath',
    back: sqdBack,
    backAlt:
      'SQD fit for Condition 1: the jump-distance histogram with three fitted populations and their sum, the Pearson residuals per bin, and the model minus the empirical cumulative distribution',
    backLabel: 'SQD · the fit, Condition 1',
    tilt: -2,
  },
  {
    label: 'MSD',
    detail: 'every condition',
    front: msdFront,
    frontAlt:
      'Ensemble MSD curves for Condition 1 and Condition 2 against lag time, the first four lags fitted by a line, with D for each condition',
    back: msdBack,
    backAlt:
      'MSD for Condition 1: the ensemble curve over every single-track curve, and the curve of each replicate against all replicates pooled',
    backLabel: 'MSD · every track and replicate, Condition 1',
    tilt: 2.5,
  },
  {
    label: 'HMM',
    detail: 'the slow state, per condition',
    front: hmmFront,
    frontAlt:
      'Hidden Markov model across conditions: slow-state occupancy, the rates into and out of the slow state, and the slow state’s apparent D, each replicate and their mean for Condition 1 and Condition 2',
    back: hmmBack,
    backAlt:
      'Hidden Markov model for Condition 1 with three states, slow, middle and fast: the switching rates between them, and each state’s D, dwell time and share of molecules',
    backLabel: 'HMM · three states, Condition 1',
    tilt: -1.5,
  },
  {
    label: 'Spatial map',
    detail: 'where molecules move',
    front: spatialFront,
    frontAlt:
      'Jump-density maps in a normalized cell for Condition 1 and Condition 2: all jumps, short, middle and long jumps, with the number of steps under each and a color scale',
    back: spatialBack,
    backAlt:
      'Jump-density maps for Condition 1, one row per replicate: all jumps, short, middle and long jumps',
    backLabel: 'Spatial map · per replicate, Condition 1',
    tilt: 3,
  },
];

/** a figure on a print: white like the export, fitted whole into the print's frame */
// (the figure is laid inside the frame, not in its flow: a squarer figure, like HMM's, would otherwise stretch the
// frame taller than 4:3 and push the print's foot down onto the arrows)
export function PrintPicture({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className="relative aspect-[4/3] bg-white">
      <Image src={src} alt={alt} sizes="(min-width: 768px) 600px, 86vw" className="absolute inset-[3%] size-[94%] object-contain" />
    </div>
  );
}

/** the back of an analysis print: the closer look, fitted into the room above its footer */
export function PrintBackPicture({ print }: { print: AnalysisPrint }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[2px] bg-white px-[9%] py-[7%] ring-1 ring-black/10">
      <Image
        src={print.back}
        alt={print.backAlt}
        sizes="(min-width: 768px) 600px, 86vw"
        className="block h-auto max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}

/** a chevron for the stack's arrows, drawn like the page's other icons (1.5 stroke) */
function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={back ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'} />
    </svg>
  );
}

/**
 * Under the stack: previous and next, with where you are between them ("2 / 4"). Like leafing through a pile of
 * prints: the caption on the top print says which analysis it is.
 */
export function StackControls({ top, onPrev, onNext }: { top: number; onPrev: () => void; onNext: () => void }) {
  const n = ANALYSES.length;
  const arrow =
    'flex size-11 cursor-pointer items-center justify-center rounded-full border border-(--print-edge) bg-(--print-paper) text-(--print-ink) shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-colors hover:border-(--print-ink-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--print-ink) md:size-9';
  return (
    <div className="flex items-center justify-center gap-4">
      <button type="button" aria-label="Previous analysis" onClick={onPrev} className={arrow}>
        <Chevron back />
      </button>
      <span aria-live="polite" className="min-w-[3.5em] text-center font-card text-[13px] tabular-nums text-(--print-ink-soft)">
        <span className="sr-only">{ANALYSES[top].label}, </span>
        {top + 1}
        <span aria-hidden> / </span>
        <span className="sr-only"> of </span>
        {n}
      </span>
      <button type="button" aria-label="Next analysis" onClick={onNext} className={arrow}>
        <Chevron />
      </button>
    </div>
  );
}
