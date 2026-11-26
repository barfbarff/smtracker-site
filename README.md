# SMTracker site

Landing page and manual for SMTracker, built on the **SMTracker design system** (shadcn neutral + the Emission accent, Inter and Geist Mono).

- `/` is the landing page (`app/(home)/page.tsx`).
- `/docs` is the manual, built with [Fumadocs](https://fumadocs.dev). Pages are MDX in `content/docs/`; the sidebar order is in each folder's `meta.json`.

All content is mock content: placeholders look like `[CONTENT]`, `[VERSION]` or `[CONFIRM …]`.

## Set up (everything stays in this folder)

The project brings its own Node. Nothing is installed globally and no shell profile is touched.

```bash
./bin/run node -v          # Node 24 from .toolchain/node
./bin/run npm install      # packages into ./node_modules, npm cache into .toolchain/npm-cache
./bin/run npm run dev      # then open http://localhost:3003
```

`bin/run` puts `.toolchain/node/bin` and `node_modules/.bin` first on `PATH` for that one command, and points npm's cache and prefix into `.toolchain/`.

If `.toolchain/node` is missing (fresh clone), download the Node 24 darwin-arm64 tarball from
https://nodejs.org/dist/latest-v24.x/, check it against that release's `SHASUMS256.txt`, and unpack it:

```bash
mkdir -p .toolchain/node && tar -xzf node-v24.*-darwin-arm64.tar.gz -C .toolchain/node --strip-components=1
```

Other commands: `./bin/run npm run build`, `./bin/run npm run types:check`, `./bin/run npm run lint`.

## Where things live

| What | Where |
| --- | --- |
| Theme tokens (neutral, Emission, illustration colours, Okabe-Ito) | `app/global.css` |
| Logo | `components/logo.tsx` |
| Illustrations (line drawings on the pixel grid) | `components/illustrations.tsx` |
| MDX components (`Callout`, `Files`, `Kbd`, `Keys`, `Status`, `Ui`, `IllustratedCard`, `Pipeline`, …) | `components/docs.tsx`, registered in `components/mdx.tsx` |
| Docs pages | `content/docs/**` |
| Toolchain (Node, npm cache) | `.toolchain/` (git-ignored) |

A live reference of every docs component is at `/docs/reference/components`.

## Publish on GitHub Pages

The site is fully static: `npm run build` writes plain files to `out/` (every page, the docs search index,
the share images and the docs' markdown versions). No server is needed, so GitHub Pages hosts it for free.

The workflow in `.github/workflows/pages.yml` is the whole CI/CD:

- **Every push and pull request:** lint, typecheck and a full build. A failure shows as a red ✗ on GitHub.
- **Every push to `main`:** the built site is published at `https://<owner>.github.io/<repository>/`.

One-time setup by the repository's owner (it must be a **public** repository on a free GitHub account):

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. Push to `main`. The **Actions** tab shows the run; when it is green, the address appears under **Settings → Pages**.

The workflow sets the address prefix itself (`NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_SITE_URL`), so the same
code works under `/<repository>/` on GitHub Pages and at `/` locally or on a custom domain.

To check the published build locally under a prefix, for example `/smtracker-site`:

```bash
NEXT_PUBLIC_BASE_PATH=/smtracker-site ./bin/run npm run build   # then serve out/ at /smtracker-site/
```

`bin/run` is only for local work; GitHub Actions brings its own Node 24.
