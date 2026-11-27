import type { TOCItemType } from 'fumadocs-core/toc';

/**
 * The page's headings with the step titles left out.
 *
 * A heading inside `<Steps>` names one step of a procedure, not a section of the page, so it doesn't belong in
 * "On this page". The headings are read from the page's own MDX in order, skipping fenced code, and matched to the
 * table of contents one for one. If the two counts ever disagree, nothing is filtered.
 */
export function withoutStepHeadings(toc: TOCItemType[], raw: string): TOCItemType[] {
  const inSteps: boolean[] = [];
  let depth = 0;
  let fence: string | null = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    const fenceMatch = /^(```+|~~~+)/.exec(trimmed);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1];
      else if (trimmed.startsWith(fence)) fence = null;
      continue;
    }
    if (fence !== null) continue;

    depth += (trimmed.match(/<Steps[\s>]/g) ?? []).length;
    if (/^#{1,6}\s/.test(trimmed)) inSteps.push(depth > 0);
    depth -= (trimmed.match(/<\/Steps>/g) ?? []).length;
    if (depth < 0) depth = 0;
  }

  if (inSteps.length !== toc.length) return toc;
  return toc.filter((_, i) => !inSteps[i]);
}
