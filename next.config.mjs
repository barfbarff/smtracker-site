import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The site is static: `next build` writes plain files to out/, served as they are (GitHub Pages; see
// .github/workflows/pages.yml). On GitHub Pages a project site lives under /<repository>/, so the
// workflow passes that prefix in NEXT_PUBLIC_BASE_PATH; locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  // every page as <path>/index.html, which any static host serves without rewrites
  trailingSlash: true,
  basePath,
  // no image server on a static host
  images: { unoptimized: true },
};

export default withMDX(config);
