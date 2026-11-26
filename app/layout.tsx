import { Providers } from '@/components/providers';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './global.css';

// the site's text font: Inter 4.1, self-hosted so every OpenType feature is kept (Google Fonts' copy drops the
// stylistic sets), cut by scripts/cut-inter.py (SIL OFL 1.1, app/fonts/inter/LICENSE.txt). This is the core file
// (Latin, Latin-1, punctuation), preloaded; the rest of Inter's characters are "Inter Extended" in app/global.css,
// fetched only by a page that uses them. No metric-matched fallback here: it would stand in for those characters
// before Inter Extended could.
const inter = localFont({
  src: './fonts/inter/Inter-core.woff2',
  weight: '100 900',
  variable: '--font-inter',
  adjustFontFallback: false,
});
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
// only for the names on the landing page's tracker cards (components/landing/source-cards.tsx):
// Ioskeley Mono v2.2.0, Medium (SIL OFL 1.1, app/fonts/ioskeley-mono/LICENSE.txt)
const ioskeleyMono = localFont({
  src: './fonts/ioskeley-mono/IoskeleyMono-Medium.woff2',
  weight: '500',
  variable: '--font-ioskeley-mono',
});

// only for the footer's column labels: Oswald (The Oswald Project Authors, SIL OFL 1.1, app/fonts/oswald/LICENSE.txt),
// the variable font from Google Fonts' repository, weights 200 to 700, cut to the letters and the space (11 KB); not
// preloaded, as nothing above the fold uses it. (Bebas Neue, tried before it, stays in app/fonts/bebas-neue, unused.)
const oswald = localFont({
  src: './fonts/oswald/Oswald-letters.woff2',
  weight: '200 700',
  variable: '--font-oswald',
  preload: false,
});

// The site's public address (for share images and links): set by the Pages workflow from the repository's
// GitHub Pages URL; locally it is the dev server.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SMTracker',
    template: '%s | SMTracker',
  },
  description: 'Diffusive-state fractions from single-molecule tracks.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${ioskeleyMono.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
