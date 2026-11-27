import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl } from '@/lib/shared';
import { withoutStepHeadings } from '@/lib/toc';
import { PageRail } from '@/components/page-rail';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  // "On this page" lists sections, not the steps of a procedure
  const toc = withoutStepHeadings(page.data.toc, await page.data.getText('raw'));
  const railFooter = (
    <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-em-soft bg-em-softer p-3.5 text-[13px] leading-5">
      <span className="font-semibold text-em-strong">In the app</span>
      <span className="text-em-body">Help in the window&apos;s header opens this chapter.</span>
    </div>
  );
  // fetched by the button itself, so it needs the prefix the site is served under (next.config.mjs)
  const markdownUrl = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${getPageMarkdownUrl(page).url}`;

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      tableOfContent={{ component: <PageRail key={page.url} items={toc} footer={railFooter} /> }}
    >
      <DocsTitle className="text-[36px] leading-10 font-[650] tracking-[-0.025em]">
        {page.data.title}
      </DocsTitle>
      <DocsDescription className="mb-0 text-lg leading-[30px] text-fg-secondary">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
