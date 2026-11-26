// The landing page's frame. Its masthead lives in the opening (components/landing/opening.tsx), fixed over
// every panel. The page is always light: see components/providers.tsx. Its Inter text uses the stylistic sets in
// app/global.css (.landing-type), and its illustrations the ink palette (.ill-ink).
export default function Layout({ children }: LayoutProps<'/'>) {
  return <div className="landing-type ill-ink flex flex-1 flex-col bg-fd-background text-fd-foreground">{children}</div>;
}
