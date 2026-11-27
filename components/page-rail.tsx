'use client';

import type { TOCItemType } from 'fumadocs-core/toc';
import { ChevronRight, Text } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface Group {
  id: string;
  item: TOCItemType;
  children: TOCItemType[];
}

const idOf = (item: TOCItemType) => decodeURIComponent(item.url.replace(/^#/, ''));

/** Sections (the shallowest headings) with the deeper headings that follow each one. */
function groupItems(items: TOCItemType[]): Group[] {
  if (items.length === 0) return [];
  const top = Math.min(...items.map((i) => i.depth));
  const groups: Group[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (item.depth > top && last) last.children.push(item);
    else groups.push({ id: idOf(item), item, children: [] });
  }
  return groups;
}

/** Where the reader is: the sections any part of which is on screen, and the heading they're reading. */
function useReading(groups: Group[]) {
  const [state, setState] = useState<{ visible: Set<string>; active: string | null }>({
    visible: new Set(),
    active: null,
  });

  useEffect(() => {
    const ids = groups.flatMap((g) => [g.id, ...g.children.map(idOf)]);
    let frame = 0;
    let timer = 0;

    const measure = () => {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
      frame = 0;
      timer = 0;
      const header = document.getElementById('nd-subnav')?.getBoundingClientRect().bottom ?? 0;
      const top = Math.max(header, 0);
      const bottom = window.innerHeight;
      // The heading being read is the last one that has reached a line just under the header, so a heading
      // clicked in the rail, which scrolls to the top, is the one marked.
      const line = top + 96;

      let active: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = id;
      }
      // At the very end of the page the last heading may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = ids.at(-1) ?? active;

      const article = document.getElementById('nd-page');
      const end = article ? article.getBoundingClientRect().bottom : bottom;
      const visible = new Set<string>();
      groups.forEach((g, i) => {
        const start = document.getElementById(g.id)?.getBoundingClientRect().top;
        if (start === undefined) return;
        const next = groups[i + 1] ? document.getElementById(groups[i + 1].id)?.getBoundingClientRect().top : end;
        const stop = next ?? end;
        if (start < bottom && stop > top) visible.add(g.id);
      });

      setState((prev) => {
        const same =
          prev.active === active && prev.visible.size === visible.size && [...visible].every((v) => prev.visible.has(v));
        return same ? prev : { visible, active };
      });
    };

    // On the next frame, or after a short wait where frames are throttled (a background tab).
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      if (!timer) timer = window.setTimeout(measure, 120);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    // Images, fonts and opened details move the headings without any scroll.
    const resize = new ResizeObserver(schedule);
    const article = document.getElementById('nd-page');
    if (article) resize.observe(article);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      resize.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [groups]);

  return state;
}

export function PageRail({ items, footer }: { items: TOCItemType[]; footer?: ReactNode }) {
  const groups = useMemo(() => groupItems(items), [items]);
  const { visible, active } = useReading(groups);
  // A section opened or closed by hand stays that way until it's clicked again.
  const [manual, setManual] = useState<Record<string, boolean>>({});

  const navRef = useRef<HTMLElement>(null);

  // Keep the heading being read in view when the rail itself scrolls.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !active) return;
    const link = nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(active)}"]`);
    if (!link) return;
    const n = nav.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    if (r.top < n.top || r.bottom > n.bottom) nav.scrollTop += r.top - n.top - n.height / 3;
  }, [active, visible]);

  const isOpen = useCallback(
    (g: Group) => manual[g.id] ?? visible.has(g.id),
    [manual, visible],
  );

  if (items.length === 0 && !footer) {
    return <div id="nd-toc-placeholder" className="hidden xl:layout:[--fd-toc-width:268px]" />;
  }

  return (
    <div
      id="nd-toc"
      className="sticky top-(--fd-docs-row-3) [grid-area:toc] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] flex flex-col w-(--fd-toc-width) pt-12 pe-4 pb-2 xl:layout:[--fd-toc-width:268px] max-xl:hidden"
    >
      <h3 id="toc-title" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
        <Text className="size-4" />
        On this page
      </h3>
      <nav ref={navRef} aria-label="On this page" className="sm-rail relative min-h-0 flex-1 overflow-y-auto py-3 ms-px">
        <ul className="m-0 list-none p-0">
          {groups.map((g) => {
            const open = isOpen(g);
            const inside = active !== null && (active === g.id || g.children.some((c) => idOf(c) === active));
            const listId = `sm-rail-${g.id}`;
            return (
              <li key={g.item.url} className="sm-rail-group" data-current={inside || undefined}>
                <div className="flex items-start">
                  <a
                    href={g.item.url}
                    className="sm-rail-link sm-rail-section min-w-0 flex-1"
                    data-active={active === g.id || undefined}
                    data-current={inside || undefined}
                    // Going to a section opens it, even one closed by hand.
                    onClick={() =>
                      setManual((m) => {
                        if (!(g.id in m)) return m;
                        const { [g.id]: _, ...rest } = m;
                        return rest;
                      })
                    }
                  >
                    {g.item.title}
                  </a>
                  {g.children.length > 0 && (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={listId}
                      aria-label={open ? 'Hide its subsections' : 'Show its subsections'}
                      onClick={() => setManual((m) => ({ ...m, [g.id]: !open }))}
                      className="sm-rail-toggle"
                    >
                      <ChevronRight className="size-3.5" data-open={open || undefined} />
                    </button>
                  )}
                </div>
                {g.children.length > 0 && (
                  <div className="sm-rail-fold" data-open={open || undefined} id={listId}>
                    <ul className="m-0 min-h-0 list-none overflow-hidden p-0" inert={!open}>
                      {g.children.map((c) => (
                        <li key={c.url}>
                          <a
                            href={c.url}
                            className="sm-rail-link sm-rail-sub"
                            data-depth={c.depth}
                            data-active={active === idOf(c) || undefined}
                          >
                            {c.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      {footer}
    </div>
  );
}
