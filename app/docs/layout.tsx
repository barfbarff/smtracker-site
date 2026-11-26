import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { Logo } from '@/components/logo';

// Docs board: one bar across the top (logo + version, search, Changelog, theme), the chapter list below it on the
// left: one list, each chapter a collapsible group with its icon (content/docs, meta.json). The sidebar has no
// collapse button: on narrow windows it folds into the menu by itself.
export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        mode: 'top',
        url: '/',
        title: (
          <span className="inline-flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="rounded-md border border-fd-border px-1.5 py-px text-xs font-normal text-fd-muted-foreground">
              v3
            </span>
          </span>
        ),
      }}
      themeSwitch={{ mode: 'light-dark' }}
      sidebar={{ collapsible: false }}
      links={[{ text: 'Changelog', url: '/docs/changelog', active: 'url' }]}
    >
      {children}
    </DocsLayout>
  );
}
