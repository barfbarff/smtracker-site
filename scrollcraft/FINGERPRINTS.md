# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| smtracker-landing | Chaptered editorial | No fixed bar: static masthead (wordmark, Docs, Changelog, Source) plus a vertical folio in the left margin (2xl+) naming the current chapter | Type-only title page with three parallax planes: outlined numeral far, headline mid, one real sample track near, drawing on once at load | Title page, then 3 chapters on hard-cut grounds (sidebar grey, white, black), ~8 vh: parallax, pin (sticky figure + prose steps, the peak), reveal + SVG draw-on, pinned horizontal pan + count | Still colophon: logo mark and one sentence with the downloads set as running-text links | The figure computes: a folder of frames becomes cells, tracks draw in, the field steps back into the first of four cards, and the other three (jump distances with fits, MSD, apparent D) are computed from those same tracks | SMTracker design system line drawings on the emission pixel grid; no photography | 3003 |


---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Chaptered editorial** with a vertical margin folio (smtracker-landing).
- **"The figure computes"**: analysis cards computed in-page from the tracks just shown (smtracker-landing).
- **Five chapters at about 8 vh** with a sticky-figure scrollytelling peak (smtracker-landing).
- **A letter of the product name flying from the title into the next chapter's heading** ("A for Adaptive", smtracker-landing revision 3).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
