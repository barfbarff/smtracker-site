// The SMTracker 3 landing page: one long page (components/landing/landing.tsx), the title and a section for each
// thing SMTracker does, then the colophon: the last call to download and the footer.

import Link from 'next/link';
import { Landing } from '@/components/landing/landing';
import { LogoMark } from '@/components/logo';
import { links } from '@/lib/shared';

/** the footer's link columns: only places that exist (the downloads, the manual, the source), in three short groups */
const FOOTER_COLUMNS: { title: string; links: { text: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Get it',
    links: [
      { text: 'Download for macOS', href: links.downloadMac },
      { text: 'Download for Windows', href: links.download, external: true },
      { text: 'Changelog', href: '/docs/changelog' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { text: 'Manual', href: '/docs' },
      { text: 'Analyses', href: '/docs/analysis' },
    ],
  },
  {
    title: 'Project',
    links: [
      { text: 'Source on GitHub', href: links.source, external: true },
      { text: 'Cite SMTracker', href: links.cite, external: true },
      { text: 'AG Graumann lab', href: links.lab, external: true },
    ],
  },
];

// the footer's column labels in Oswald: the one place it appears, a quiet sign that the page has ended (the rest of
// the page is Inter and Ioskeley Mono). At 550, between Medium and SemiBold, so its thin strokes (the N's right stem)
// hold up on the dark band; a narrow face in capitals, so spaced out a little to breathe.
const labelClass = 'font-label text-[16px] leading-none font-[550] tracking-[0.1em] text-neutral-200 uppercase';

// on the dark band: links light gray (#a3a3a3 on #171717, about 7:1), white on hover and focus
const bandLink =
  'rounded-sm text-[15px] leading-6 text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

function Colophon() {
  return (
    // the one dark band on the page, the sign-off: the mark, the tagline the page opened with, and where else to
    // go. (Downloading needs no last call here: the masthead's button stays on screen all the way down, and the band
    // lists both downloads.)
    <footer className="bg-[#171717] text-neutral-400">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-8 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <LogoMark tone="onDark" className="size-8" />
              <span className="text-[20px] font-semibold tracking-[-0.01em]">SMTracker</span>
            </Link>
            {/* the line the title page opens with, so the page ends where it began */}
            <p className="mt-3 max-w-[30ch] text-[17px] leading-7 text-neutral-300">
              Single-molecule tracking, from raw movies to figures.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:col-span-7">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                {/* a drawer label, in Oswald (labelClass) */}
                <h2 className={labelClass}>{col.title}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.text}>
                      {l.external ? (
                        <a href={l.href} className={bandLink}>
                          {l.text}
                        </a>
                      ) : (
                        <Link href={l.href} className={bandLink}>
                          {l.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-[13px] leading-5 text-neutral-400">
          Developed by AG Graumann at Synmikro, the Center for Synthetic Microbiology, University of Marburg · Version
          3.0.0 · Free and open source under the GNU GPL 3.0
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <Landing />
      <Colophon />
    </main>
  );
}
