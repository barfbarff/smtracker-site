'use client';

// The download buttons, shared by the title page and the closing screen so the two stay one pair: the visitor's
// own system gets the filled button and goes first (macOS until we know), the other the outlined one beside it.

import { useEffect, useState } from 'react';
import { links } from '@/lib/shared';

export type Platform = 'macos' | 'windows';

/** which download to lead with: read after hydration, so the server and the first render agree (macOS) */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>('macos');
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const said = [nav.userAgentData?.platform, nav.platform, nav.userAgent].join(' ');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a one-off read of the browser, after hydration
    if (/windows|win32|win64/i.test(said)) setPlatform('windows');
  }, []);
  return platform;
}

// Platform marks for the download buttons (Simple Icons, CC0). Lucide has no brand logos.
export function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function WindowsMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
      <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
    </svg>
  );
}

/** the pair of download buttons, the same size, told apart by style alone */
export function DownloadButtons({ platform, stack = false }: { platform: Platform; stack?: boolean }) {
  const order: Platform[] = platform === 'windows' ? ['windows', 'macos'] : ['macos', 'windows'];
  return order.map((os, i) => (
    <a
      key={os}
      href={os === 'macos' ? links.downloadMac : links.download}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-primary active:scale-[0.97] ${
        stack ? 'max-sm:w-full sm:min-w-60' : 'sm:min-w-60'
      } ${
        i === 0
          ? 'bg-fd-primary text-fd-primary-foreground transition-[opacity,transform] duration-150 hover:opacity-90'
          : 'border border-fd-border bg-fd-background transition-[background-color,transform] duration-150 hover:bg-fd-accent'
      }`}
    >
      {os === 'macos' ? <AppleMark /> : <WindowsMark />}
      {os === 'macos' ? 'Download for macOS' : 'Download for Windows'}
    </a>
  ));
}

/** the pair for a server-rendered page (the closing screen): it reads the visitor's system itself */
export function PlatformDownloads({ stack = false }: { stack?: boolean }) {
  return <DownloadButtons platform={usePlatform()} stack={stack} />;
}
