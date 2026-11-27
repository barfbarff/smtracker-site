'use client';

// The SMTracker 3 landing page, as one long page: a title, then a section for each thing SMTracker does, each its
// words beside its picture, then the colophon (app/(home)/page.tsx). The page scrolls like any other.
//
// One kind of motion, everywhere: as a section comes into view its words fade in and rise a little, and its
// picture fades in from a slight zoom just after (Reveal). Each plays once. The only other motion is what a
// visitor starts (turning a print over, leafing through the analyses) and the pictures' own life (the
// recordings and demos play while in view, the stamps float). Under reduced motion everything is simply there.

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { BookOpen, ChartColumn, FileJson, Route } from 'lucide-react';
import { motionTokens } from '@/lib/motion-tokens';
import { links } from '@/lib/shared';
import { Logo } from '@/components/logo';
import { AppleMark, DownloadButtons, usePlatform, WindowsMark } from '@/components/landing/downloads';
import { HeroCells } from '@/components/landing/hero-cells';
import { CARD_H, CARD_LAYOUT, CARD_W, SOURCES, TracksPlay } from '@/components/landing/source-cards';
import { StampFace } from '@/components/landing/stamp';
import { AnalysisStack, OverviewCards, Polaroid, Recording } from '@/components/landing/chapter-analysis';
import { GeneratorBack, OutlinesBack, TrackingBack } from '@/components/landing/polaroid-back';
import { ANALYSES } from '@/components/landing/analysis-prints';
// the recording's first frame, shown before it plays and instead of it under reduced motion
import outlinesPoster from '@/components/landing/assets/cell-outlines-poster.jpg';
// the Track page after a TrackMate run on simulated movies (rendered off screen, 26 Nov 2026)
import trackingApp from '@/components/landing/assets/tracking-app.webp';
// the simulated-data window on its three-state example, Where in the cell (rendered off screen, 26 Nov 2026), cut
// to the page under the title bar, without the rail of pages
import generatorApp from '@/components/landing/assets/generator-app.webp';

const navLinks = [
  { text: 'Docs', href: '/docs' },
  { text: 'Analyses', href: '/docs/analysis' },
  { text: 'Changelog', href: '/docs/changelog' },
  { text: 'Source', href: links.source },
];

/* ---------- the one entrance ---------- */

const REVEAL = {
  /** how much of it must be on screen before it plays */
  amount: 0.2,
  text: { duration: 0.6, rise: 16 },
  picture: { duration: 0.7, from: 0.96, after: 0.1 },
};

/**
 * Words fade in and rise 16 px; a picture fades in from a 0.96 zoom, a beat after the words. Once each, as it
 * comes into view; at once under reduced motion.
 */
function Reveal({
  kind = 'text',
  delay = 0,
  className = '',
  children,
}: {
  kind?: 'text' | 'picture';
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const picture = kind === 'picture';
  return (
    <motion.div
      initial={{ opacity: 0, y: picture ? 0 : REVEAL.text.rise, scale: picture ? REVEAL.picture.from : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: REVEAL.amount }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: picture ? REVEAL.picture.duration : REVEAL.text.duration,
              delay: delay + (picture ? REVEAL.picture.after : 0),
              ease: motionTokens.easing.premium,
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** true while a good part of the element is on screen: the pictures inside play only then */
function useShown<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const shown = useInView(ref, { amount: 0.3 });
  return [ref, shown] as const;
}

/* ---------- a section: its words beside its picture ---------- */

const h2Class = 'font-display text-[34px] leading-[38px] text-balance md:text-[40px] md:leading-[44px] lg:text-[52px] lg:leading-[56px]';
const bodyClass = 'max-w-[46ch] text-[17px] leading-7 font-[425] text-pretty text-(--landing-body)';

function Words({ title, children, link }: { title: string; children: ReactNode; link?: ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-3">
      <h2 className={h2Class}>{title}</h2>
      <p className={`mt-1 ${bodyClass}`}>{children}</p>
      {/* 16 px above the link's 44 px tap area: about 41 px to its words, as to a row of buttons */}
      {link ? <div className="mt-1">{link}</div> : null}
    </Reveal>
  );
}

/**
 * A section of the page: words on one side, picture on the other, swapping sides from one section to the next
 * (`flip`). Side by side only from laptop width (1024 px): on tablets the words' column would be too narrow to read
 * well, so there, as on phones, the words come first and the picture under them.
 */
function Section({
  id,
  words,
  picture,
  flip = false,
  pictureRef,
}: {
  id: string;
  words: ReactNode;
  picture: ReactNode;
  flip?: boolean;
  pictureRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <section id={id} className="scroll-mt-[65px]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-14 md:py-[72px] lg:grid-cols-12 lg:gap-x-16 lg:py-[88px]">
        <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>{words}</div>
        <div ref={pictureRef} className={`@container mx-auto w-full max-w-[600px] lg:col-span-7 lg:max-w-none ${flip ? 'lg:order-1' : ''}`}>
          <Reveal kind="picture">{picture}</Reveal>
        </div>
      </div>
    </section>
  );
}

const linkWithIcon = 'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium hover:text-em-text';
const underline = 'underline decoration-emission-500 decoration-2 underline-offset-4';

/* ---------- the page ---------- */

export function Landing() {
  const reduce = !!useReducedMotion();
  const platform = usePlatform();

  // the scroll prompt shows only at the very top of the page: once the visitor scrolls, it has done its job
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const check = () => setAtTop(window.scrollY < 24);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  // the title's cells stop drawing once they are scrolled away
  const [heroRef, heroShown] = useShown<HTMLElement>();
  const [stampsRef, stampsShown] = useShown<HTMLDivElement>();
  const [overviewRef, overviewShown] = useShown<HTMLDivElement>();
  const [outlinesRef, outlinesShown] = useShown<HTMLDivElement>();
  const [analysisRef, analysisShown] = useShown<HTMLDivElement>();

  // the stamps' tracks draw themselves in the first time the stamps are seen, then stay
  const [stampsSeen, setStampsSeen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- latches the first sighting
    if (stampsShown) setStampsSeen(true);
  }, [stampsShown]);

  // the three prints: each turns over on its own
  const [trackingFlipped, setTrackingFlipped] = useState(false);
  const [outlinesFlipped, setOutlinesFlipped] = useState(false);
  const [generatorFlipped, setGeneratorFlipped] = useState(false);

  // "Built-in analysis": which print is on top. While the stack is in view it turns slowly on its own, until someone
  // leafs through it or turns a print over; then it is theirs (and under reduced motion it never turns by itself)
  const [print, setPrint] = useState(0);
  const [held, setHeld] = useState(false);
  const [analysisFlipped, setAnalysisFlipped] = useState(false);
  useEffect(() => {
    if (!analysisShown || reduce || held) return;
    const turn = setInterval(() => {
      setPrint((k) => (k + 1) % ANALYSES.length);
      setAnalysisFlipped(false);
    }, 4500);
    return () => clearInterval(turn);
  }, [analysisShown, reduce, held]);

  return (
    <>
      {/* the masthead, fixed over the whole page, so the docs, the source and the download are always one click
          away. The landing page is always light (components/providers.tsx), so it has no theme switch. */}
      <nav aria-label="Main" className="fixed inset-x-0 top-0 z-40 h-[65px] border-b border-fd-border bg-fd-background">
        <div className="mx-auto flex max-w-[1200px] items-center gap-x-3 px-6 py-3.5 md:gap-x-8">
          {/* under 360 px wide only the mark, so the bar keeps one row with the download button */}
          <Link href="/" aria-label="SMTracker home" className="shrink-0 max-[359px]:[&>span>span:last-child]:hidden">
            <Logo />
          </Link>
          {/* all four links from tablet width; on phones only Docs, so the bar stays one row */}
          <div className="flex flex-auto justify-end gap-1 md:justify-start">
            {navLinks.map((l) => (
              <Link
                key={l.text}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm text-fg-secondary transition-colors hover:bg-fd-muted hover:text-fd-foreground ${l.text === 'Docs' ? '' : 'hidden md:inline-flex'}`}
              >
                {l.text}
              </Link>
            ))}
          </div>
          {/* the page's one action, the only dark thing in the bar: the visitor's own system */}
          <a
            href={platform === 'windows' ? links.download : links.downloadMac}
            aria-label={platform === 'windows' ? 'Download for Windows' : 'Download for macOS'}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-fd-primary px-3.5 text-sm font-medium text-fd-primary-foreground transition-[opacity,transform] duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary active:scale-[0.97]"
          >
            {platform === 'windows' ? <WindowsMark /> : <AppleMark />}
            Download
          </a>
        </div>
      </nav>

      {/* ---------- the title ---------- */}
      <section ref={heroRef} className="relative flex min-h-svh flex-col overflow-hidden pt-[65px]">
        {/* the three cells, floating. On short phones (up to 800 px tall) they are smaller and higher, and the
            title moves up under them, so the screen holds both. */}
        <div
          aria-hidden="true"
          className="absolute top-[121px] right-[4%] aspect-[44/40] w-[44%] max-sm:[@media(max-height:800px)]:top-[77px] max-sm:[@media(max-height:800px)]:w-[38%] sm:top-auto sm:-right-[6%] sm:-bottom-[12%] sm:w-[56%] sm:opacity-70 md:top-[calc(65px+16%)] md:right-[2%] md:bottom-auto md:w-[34%] md:opacity-100 lg:top-[calc(65px+18%)] lg:right-[3.5%] lg:w-[35%]"
        >
          <Reveal kind="picture" className="size-full">
            <div className="sm-cluster-x size-full">
              {/* paper-colored cells: a printed figure, where the warm molecules are the signal */}
              <div className="sm-cluster-y size-full" style={{ '--ill-fill': '#f1f3ea' } as CSSProperties}>
                <HeroCells paused={!heroShown} />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 items-center px-6 py-16 max-sm:items-start max-sm:pt-[220px] max-sm:[@media(max-height:800px)]:pt-[150px] lg:grid-cols-12">
          <Reveal className="flex flex-col gap-7 max-sm:[@media(max-height:800px)]:gap-5 lg:col-span-7">
            <h1 className="font-display text-[52px] leading-[0.94] whitespace-nowrap min-[400px]:text-[60px] sm:text-[104px] md:text-[80px] lg:text-[min(128px,9.5vw)]">
              SMTracker 3
            </h1>
            <p className="max-w-[30ch] text-xl leading-8 font-[425] text-balance text-(--landing-body) sm:text-[22px] sm:leading-[34px]">
              Single-molecule tracking, from raw movies to figures.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {/* the visitor's own system gets the primary button and goes first (macOS until we know) */}
              <DownloadButtons platform={platform} />
              <Link href="/docs" className={`ml-1 ${linkWithIcon}`}>
                <BookOpen aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                {/* only the words are underlined, not the icon */}
                <span className={underline}>Read the manual</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* the scroll prompt: also a link, for keyboards and anyone who would rather click. It fades out as soon as the
            page scrolls and back in at the top (and, faded, it is out of the tab order) */}
        <motion.div
          initial={false}
          animate={{ opacity: atTop ? 1 : 0, y: atTop ? 0 : 6 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: motionTokens.easing.premium }}
          inert={!atTop}
          className="relative mx-auto w-full max-w-[1200px] px-6 pb-8 max-sm:[@media(max-height:709px)]:hidden"
        >
          <a
            href="#trackers"
            className="group inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-fd-muted-foreground transition-colors duration-150 hover:text-fd-foreground"
          >
            Scroll to learn more
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-y-0.5"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </motion.div>
      </section>

      {/* ---------- Tracks from any tracker: every tracker's tracks ---------- */}
      <Section
        id="trackers"
        pictureRef={stampsRef}
        words={
          <Words
            title="Tracks from any tracker"
            link={
              // as "Read the manual" on the title: the icon leads, only the words are underlined
              <Link href="/docs/other-tools" className={linkWithIcon}>
                <FileJson aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                <span className={underline}>How to bring your own table</span>
              </Link>
            }
          >
            SMTracker 3 is tracker-agnostic! It supports a wide range of trackers. Using something else? Describe your
            table in a small JSON file, and you’re good to go.
          </Words>
        }
        picture={
          // the eight stamps, loose on the page, each at its own place and tilt, floating slowly
          <TracksPlay.Provider value={stampsSeen}>
            {/* the stamps leave an empty strip under them in their box: trimmed, so this section sits as close to
                the next as the others do */}
            <div className="relative -mb-[10%] aspect-[10/9] w-full">
              {SOURCES.map((s, i) => (
                <div
                  key={s.name}
                  className="absolute"
                  style={{
                    left: `${CARD_LAYOUT[i].left}%`,
                    top: `${CARD_LAYOUT[i].top}%`,
                    width: `${CARD_W}%`,
                    height: `${CARD_H}%`,
                  }}
                >
                  <StampFace s={s} i={i} float />
                </div>
              ))}
            </div>
          </TracksPlay.Provider>
        }
      />

      {/* ---------- From start to finish: the three cards, under their words ---------- */}
      <section id="pipeline" className="scroll-mt-[65px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-14 md:py-[72px] lg:gap-12 lg:py-[88px]">
          <Reveal className="flex flex-col gap-3">
            <h2 className={h2Class}>From start to finish</h2>
            <p className={`mt-1 ${bodyClass} md:max-w-[60ch]`}>
              SMTracker has your back for the whole pipeline! From tracking your movies with TrackMate or u-track, to
              correcting the cell outlines, to analyzing the result.
            </p>
          </Reveal>
          <div ref={overviewRef}>
            <Reveal kind="picture">
              <OverviewCards playing={overviewShown && !reduce} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tracking built in: a print of the real preparation window ---------- */}
      <Section
        id="tracking"
        flip
        words={
          <Words
            title="Tracking built in"
            link={
              <Link href="/docs/tracking" className={linkWithIcon}>
                <Route aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                <span className={underline}>How tracking works</span>
              </Link>
            }
          >
            Crop and calibrate your raw movies (.nd2, .stk or TIFF), then track them with TrackMate or u-track without leaving
            SMTracker. One condition at a time, or many folders overnight.
          </Words>
        }
        picture={
          <Polaroid
            place="relative mx-auto"
            width="w-[min(88%,500px)]"
            reduce={reduce}
            landed
            caption={
              <>
                Simulated data<span className="hidden @[17rem]:inline"> · a TrackMate run</span>
              </>
            }
            back={<TrackingBack />}
            backLabel="Also in tracking"
            flipped={trackingFlipped}
            onFlip={setTrackingFlipped}
          >
            <Image
              src={trackingApp}
              alt="SMTracker 3's Track page after a TrackMate run on simulated movies: the tracker switch between TrackMate (Fiji) and u-track (MATLAB), the Fiji it found, two conditions tracked, and the run's summary and log"
              sizes="(min-width: 768px) 500px, 88vw"
              className="block h-auto w-full"
            />
          </Polaroid>
        }
      />

      {/* ---------- Outlines you can correct: a print of the real outline editor, tilted the other way ---------- */}
      <Section
        id="outlines"
        pictureRef={outlinesRef}
        words={
          <Words title="Outlines you can correct">
            {/* as the app has it: Segment (a trained model or the classical segmenter, in batch overnight),
                Edit outlines, and Train a model on the corrected outlines */}
            SMTracker finds the cells for you, from phase contrast or fluorescence. Not quite right? Worry not! Draw,
            bend, split and merge them, and train the model on your corrections, so the next run gets them right.
          </Words>
        }
        picture={
          <Polaroid
            place="relative mx-auto"
            width="w-[min(94%,560px)]"
            reduce={reduce}
            landed
            tilt={2}
            landscape
            back={<OutlinesBack />}
            backLabel="Also in the editor"
            flipped={outlinesFlipped}
            onFlip={setOutlinesFlipped}
            caption={
              <>
                Real data<span className="hidden @[17rem]:inline"> · draw, bend, split, merge</span>
              </>
            }
          >
            <Recording
              src="cell-outlines.mp4"
              poster={outlinesPoster}
              label="SMTracker 3 editing a cell outline on a real phase-contrast image: an outline is drawn over a curved cell, bent along it, split in two and merged back, with the Select, Draw, Split, Merge, Delete and Add bend tools above and the app's status line below"
              playing={outlinesShown && !reduce && !outlinesFlipped}
            />
          </Polaroid>
        }
      />

      {/* ---------- Built-in analysis: the stack of five real figures, with its arrows ---------- */}
      <Section
        id="analysis"
        flip
        pictureRef={analysisRef}
        words={
          <Words
            title="Built-in analysis"
            link={
              // like the other section links: the icon leads, a 44 px tap area, only the words underlined
              <Link href="/docs/analysis" className={linkWithIcon}>
                <ChartColumn aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                <span className={underline}>See all analyses in the docs</span>
              </Link>
            }
          >
            SQD, MSD, Apparent Diffusion, HMM, Spatial Map, Kinetics and Clustering, with QC first and settings for every
            computation. Export the figures and the data when you’re done.
          </Words>
        }
        picture={
          // the stack sizes its prints to its own room (a little taller than wide, the arrows under it)
          <div className="relative mx-auto aspect-[10/9] w-full max-w-[640px]">
            <AnalysisStack
              top={print}
              onTop={(i) => {
                setPrint(i);
                setHeld(true);
                setAnalysisFlipped(false);
              }}
              landed
              reduce={reduce}
              flipped={analysisFlipped}
              onFlip={(v) => {
                setAnalysisFlipped(v);
                setHeld(true);
              }}
            />
          </div>
        }
      />

      {/* ---------- Data with a known truth: a print of the simulated-data window ---------- */}
      <Section
        id="simulated"
        words={
          <Words title="Data with a known truth">
            {/* as the window has it: populations, where in the cell, switching, kinetics, cells, camera, build; tracks
                or movies; the truth written beside the set */}
            Describe the populations, where in the cell they live, how they switch and what an addition changes.
            SMTracker writes the tracks, or whole movies from a measured camera, with every molecule’s truth recorded.
            Analyze them like your own and see what comes back.
          </Words>
        }
        picture={
          <Polaroid
            place="relative mx-auto"
            width="w-[min(94%,560px)]"
            reduce={reduce}
            landed
            landscape
            caption={
              <>
                Simulated data<span className="hidden @[17rem]:inline"> · three states</span>
              </>
            }
            back={<GeneratorBack />}
            backLabel="Also in the generator"
            flipped={generatorFlipped}
            onFlip={setGeneratorFlipped}
          >
            <Image
              src={generatorApp}
              alt="SMTracker 3's simulated-data window on its three-state example, Where in the cell: where each population lives, the sizes of the places in the cell, and one cell drawn by the generator with bound and scanning molecules in the nucleoid and free ones across the cell"
              sizes="(min-width: 768px) 560px, 94vw"
              className="block h-auto w-full"
            />
          </Polaroid>
        }
      />
    </>
  );
}
