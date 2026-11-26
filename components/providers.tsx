'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// the prefix the site is served under (see next.config.mjs), for the search index's address
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Fumadocs' provider (theme, search) for the whole site, with one exception: the landing page is always light.
 * Its look is paper, prints and a light table, and has no dark version. The docs follow the visitor's system
 * setting, or the choice they make with the docs' own switch, as before.
 *
 * To give the landing page dark mode back: drop `forcedTheme` (and put the switch back in its masthead,
 * components/landing/opening.tsx).
 */
export function Providers({ children }: { children: ReactNode }) {
  const landing = usePathname() === '/';
  return (
    <RootProvider
      theme={{ forcedTheme: landing ? 'light' : undefined }}
      search={{ options: { type: 'static', api: `${basePath}/api/search` } }}
    >
      {children}
    </RootProvider>
  );
}
