# SMTracker 3 landing page: brief

Interviewed. The user's answers are quoted; anything not quoted is a decision proposed in the
conversation and approved by the user ("Okay, so the plan is…").

## The eight topics

1. **Vibe.** "Scientific Application, Single Molecule Tracker". References: none given.
2. **Journey, in their words.**
   - First: "Maybe Welcome to SMTracker v3? This is because this is the documentation for the third version of the same program"
   - Second: "An animation illustrating SMTracker takes a folder of microscope movies and analyze them so that the user could either view the movements of the tracks within different cells, and view the analyses. I'm thinking of having different functionalities as different cards - Viewing movement in one card, SQD in one card, MSD in one card, etc"
   - Third: "the older version only worked rigidly with cells automatically found from phase contrast or fluorescence, but the new version allows the users to correct them: draw, split, merge, bend"
   - Fourth: "the new version works with many data sources: u-track, TrackMate, trackpy, MOSAIC ParticleTracker, TrackIt, Spot-On, and evalSPT / SLIMfast instead of just u-track and TrackMate in the older version"
3. **Energy.** "I think it should feel calm, as the application targets scientific researchers."
4. **Feeling and the one moment.** "the visitor should feel amazed, but not overwhelmed. And they still retain information easily. I think the second action is the most important action as highlights the main purposes of the application."
5. **The thing no other site does.** "I'm not sure, buddy". Proposed and approved: the analysis cards are computed from the very tracks the visitor just watched being drawn.
6. **Range.** "Perhaps premium-minimal?"
7. **World.** "Separate chapters."
8. **Assets.** "I don't have any assets … I'm just a dev." So: no photography, no generation spend. The world is the design system's own line drawings (it is genuinely an illustrated brand: the SMTracker Illustrations board).

Also: "Report the fractions" belongs in the docs, not the landing page ("the landing page should highlights features of the application rather than technical details"). The app ships for **macOS and Windows**.

## What the visitor must believe by the end

SMTracker 3 takes me from a folder of movies to every analysis, with outlines I can correct and tracks from the tool I already use.

**The one action:** download (for macOS or for Windows). Labels: "Download for macOS", "Download for Windows". Secondary: "Read the manual".

## Grammar

**Chaptered editorial.** Separate chapters (topic 7), calm (3), information that stays (4), a research audience reading rather than watching. Why the others lost:

- Filmic one-shot and Continuous world: both are one unbroken flow; the user asked for chapters.
- Live surface: forbids a title hero and marketing chrome; the user wants "Welcome to SMTracker v3" and four distinct chapters, not one operating surface.
- Typographic poster: the asset here is a workflow, not a sentence.
- Gallery / catalog: a range of variants; this is an argument in four steps.
- Split stage: only one chapter (outlines, v2 vs v3) has two sides.
- Rhythmic cutlist: energy brands; the brief says calm.

Consequences: no fixed bar (a folio in the margin says which chapter you are in); title page with type only above the fold; hard cuts between chapter grounds; figures in their own column with a caption; colophon close with the download set in running text. No scrub, spotlight or magnet.

## Feeling curve

| Chapter | Feeling | What causes it |
|---|---|---|
| Title page | Calm confidence | "SMTracker 3" set large on white; a tall outlined 3 recedes behind a single molecule's track as you start to scroll |
| (silence) | Anticipation | The chapter opens on its heading and a quiet stack of movie frames. Authored, not dead scroll |
| 1. One folder, every analysis **(peak)** | Wonder that still makes sense | The stack of frames becomes cells; tracks draw themselves in; the field steps back and becomes the first of four cards, the other three computed from the same tracks |
| 2. Outlines you can correct | Relief, control | Four outlines are drawn under the reader's eye: draw, split, merge, bend |
| 3. Tracks from any tracker | Reassurance | The two trackers SMTracker 2 read stay put while five more slide in; the count goes from 2 to 7 |
| Close | Resolve | A still colophon: one sentence with the downloads in it, the mark, nothing moving |

**The peak**, as a visitor would say it: "the tracks drew themselves into the cells, and then the charts were made from those same tracks." Chapter 1.

**Tell-someone sentence:** It's the site where a folder of movies turns into tracks inside cells, and every chart you scroll past is computed from those very tracks.

**Authored silence:** the top of chapter 1 (heading plus the still frame stack) before the field resolves.

## Score

| Chapter | Device | Why this one | Span (viewport heights, desktop) |
|---|---|---|---|
| Title page | `parallax` (three planes: outlined numeral far, headline mid, track near) | Depth from type and one drawn line, the only media an editorial title page allows | ~1 |
| 1. One folder, every analysis | `pin` (sticky figure column, prose steps beside it) | The figure has to hold still while its state advances; that is the argument | ~3.2, the largest |
| 2. Outlines you can correct | `reveal` + SVG draw-on | Each correction is a change of state, shown once as it enters | ~1.3 |
| 3. Tracks from any tracker | `pan` (+ `count` of real numbers, 2 to 7) | Sideways travel reads as range, which is what this chapter is | ~1.6 |
| Close | `flow` | Small type, running text, holds still | ~0.8 |

Five chapters, about 8 viewport heights; four device families (parallax, pin, reveal, pan, flow); no family twice in a row; one pin-heavy peak with the most room. Outside the 6–7 acts at 13.6–13.8 vh band.

**Signature move:** the figure computes. Chapter 1's cards (movement, jump distances, MSD, apparent D) are calculated in the page from one labelled sample dataset of tracks, the same tracks drawn in the cells moments earlier. Seeded, so the server and the browser draw the same thing.

**Implementation note.** This is a Next.js page, so motion runs on `motion/react` (per the ecc motion-foundations / motion-patterns / motion-advanced skills) instead of the scroll-craft engine, which is for standalone HTML. Reduced motion: every chapter shows its finished state, without pinned scroll.

## Feel check (cold scroll, after build)

| Chapter | Intended | Felt |
|---|---|---|
| Title page | Calm confidence | Calm, confident |
| 1. One folder, every analysis | Wonder that makes sense | "Oh, that's clever": clearly the peak |
| 2. Outlines you can correct | Relief, control | Tidy, clear |
| 3. Tracks from any tracker | Reassurance | Reassured; a little empty below the strip on tall screens |
| Close | Resolve | Settled |

Changed after the first pass: fast sample tracks shortened (16 steps) and gentled (σ 1.35 px) because they read as knots; the tracker strip now pans past the screen edge instead of clipping at the column; phone step text stays at full strength; one-line title on phones; short card titles on phones.

Not verified: prefers-reduced-motion (the browser pane cannot emulate it; the code pins progress to 1 and drops sticky/min-heights under `motion-reduce:`), and a real phone (touch scrolling, iOS Safari).

## Revision 2 (user feedback)

- "I think the track in the first action is kinda unnecessary": the title page's near plane (the hero track) is removed. Depth now comes from the receding outlined numeral behind the headline; the numeral settling in is the one load moment.
- "it would be great if there is a 'Scroll to learn more'": added as the user asked, overriding the skill's no-scroll-cue default. It is quiet (small muted text at the bottom left), arrives after the numeral, is also a button that jumps to chapter 1, and fades on the first scroll.
- "treat one scroll as a chain of animations instead of forcing the user to scroll continuously": the page now snaps one screen at a time (native CSS `scroll-snap-type: y mandatory`, `snap-stop: always`, on the landing page only). Steps: title page; chapter 1 in three screens; chapter 2; chapter 3 in two screens; the colophon. Arriving at a step plays its change out in full over a fixed time (`lib/use-steps.ts`): 1.1 s for figure changes, 1.43 s for the pan (longer travel), 0.5 s for the step's copy rising into focus, all on the signature curve cubic-bezier(0.4, 0, 0.2, 1) (motion-design "Premium"). No step can be left half-played.

## Revision 3 (user feedback): "A for Adaptive"

- "One folder, every analysis" was "quite hard to understand". The user wanted a hook that highlights the many data sources, shown with "cards, or dots".
- Marketing pass (marketing:content-creation): benefit first, under ten words, speak to the reader. The user found the plain options "dry" and proposed "Adaptive!"; the agreed treatment is the user's own idea: the "a" of "SMTracker" flies from the title page and lands as the capital "A" of **"A for Adaptive"**, with the line under it saying what adapts: "Tracker-agnostic. SMTracker 3 reads tracks from u-track, TrackMate, trackpy, MOSAIC ParticleTracker, TrackIt, Spot-On and evalSPT / SLIMfast, so you keep the tracker you like. Using something else? Describe your table in a small JSON file, and you're good to go." (Corrected from "convert it to JSON": per the manual the table stays as it is and track_tables/format.json describes it.)
- Chapter 1's three steps: eight tracker cards (labels only as the manual supports: "read by SMTracker 2", "new in SMTracker 3", "described in format.json"); the cards gather into dots that fly into the cells and become the same tracks; the four computed analysis cards.
- Chapter 3 ("Tracks from any tracker") is folded into chapter 1 and removed; the page is two screens shorter.
- Signature move now: **the flying letter** (components/landing/flying-a.tsx), played once per direct step, reversible, absent under reduced motion; the computed cards remain.

## Revision 4 (user feedback): the hand-off

- The flying letter was "too abrupt". The user's own direction: "When the user scrolls, everything besides 'a' gradually fades while a becoming 'A'. 'A' then moves to the left, and everything in Chapter 1 then appears."
- Structure: the title page and chapter 1 are now one pinned stage (components/landing/opening.tsx), four snap screens long; the stage never scrolls, only its content changes. The nav lives on the stage and fades with the title.
- Choreography (anthropic-skills:motion-design, ecc motion-foundations; tokens in lib/motion-tokens.ts, handoff), one timeline of 2.2 s in four phases, one thing at a time: clear (everything but the "a" leaves; exit curve, quicker), become ("a" turns into "A" in place, a 5 % breath of scale, no overshoot), move ("A" glides into the heading and settles at its size), build ("for Adaptive", the copy, the link, then the eight cards in a cascade 20 ms of timeline apart). Reverse on scrolling back. Reduced motion: each step simply appears.
- The separate flying copy (components/landing/flying-a.tsx) is gone; the letter now travels on the stage itself and hands over exactly onto the heading's "A".
- Follow-up: the hand-off was "quite slow", now 1.4 s (from 2.2 s), same four phases. The chapter is text left, figure right from 768 px wide ("I prefer the previous layout (Text on the left, image on the right)"); phones keep the stacked layout. Tablet widths got their own title layout (smaller headline, cells beside it) after the cells were found covering the buttons. The opening's four snap points are now ordinary in-flow blocks under the pinned stage, after a report that one scroll jumped straight to chapter 2.
