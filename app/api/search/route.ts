import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static search: the index is written once at build time, and the docs' search box downloads it and
// searches in the browser (see the search options in app/layout.tsx). No server needed.
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source);
