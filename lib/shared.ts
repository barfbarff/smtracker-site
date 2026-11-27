import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'SMTracker';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Mock links until the real ones exist. */
export const links = {
  source: 'https://github.com/longestgiraffe/smtracker',
  /** the newest release: the Windows installer and zip */
  download: 'https://github.com/longestgiraffe/smtracker/releases/latest',
  /** the same release holds the Mac installer (Apple silicon) */
  downloadMac: 'https://github.com/longestgiraffe/smtracker/releases/latest',
  cite: '#',
  lab: 'https://www.uni-marburg.de/en/fb15/researchgroups/ag-graumann', // the AG Graumann page at Synmikro
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
