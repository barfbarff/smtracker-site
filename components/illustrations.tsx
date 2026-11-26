// Ported from the SMTracker design canvas (Illustrations + Landing boards).
// Colors are CSS variables (see app/global.css) so dark mode swaps five values; the drawing never changes.
import { useId, type SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { title?: string };

function Frame({ viewBox, title, children, className, ...rest }: Props & { viewBox: string }) {
  return (
    <svg
      viewBox={viewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={['illustration block h-auto w-full', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function TrackingIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "A stack of movie frames with a particle track drawn across the top frame"} {...props}>
      
<defs><pattern id={`${uid}-gA`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gA)`}/>
<g fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25" strokeLinejoin="round">
<polygon points="300,108 447,193 317,268 170,183"/>
<polygon points="300,92 447,177 317,252 170,167"/>
<polygon points="300,76 447,161 317,236 170,151"/>
<polygon points="300,60 447,145 317,220 170,135"/>
</g>
<g stroke="var(--ill-grid)" strokeWidth="1">
<line x1="267.5" y1="78.75" x2="414.5" y2="163.75"/><line x1="235" y1="97.5" x2="382" y2="182.5"/><line x1="202.5" y1="116.25" x2="349.5" y2="201.25"/>
<line x1="336.75" y1="81.25" x2="206.75" y2="156.25"/><line x1="373.5" y1="102.5" x2="243.5" y2="177.5"/><line x1="410.25" y1="123.75" x2="280.25" y2="198.75"/>
</g>
<polygon points="271.75,118.75 308.5,140 276,158.75 239.25,137.5" fill="var(--ill-fill)"/>
<polygon points="341,121.25 377.75,142.5 345.25,161.25 308.5,140" fill="var(--ill-spot)"/>
<polygon points="300,60 447,145 317,220 170,135" fill="none" stroke="var(--ill-line)" strokeWidth="1.25" strokeLinejoin="round"/>
<polyline points="296,88 298.6,111.75 341.7,141.2 324.9,164.5 321,192.25" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
<g fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25"><circle cx="296" cy="88" r="2.75"/><circle cx="298.6" cy="111.75" r="2.75"/><circle cx="324.9" cy="164.5" r="2.75"/><circle cx="321" cy="192.25" r="2.75"/></g>
<circle cx="341.7" cy="141.2" r="3.5" fill="var(--ill-track)"/>
<line x1="170" y1="135" x2="170" y2="183" stroke="var(--ill-line)" strokeWidth="1.25" strokeDasharray="3 3"/>
<line x1="447" y1="145" x2="447" y2="193" stroke="var(--ill-line)" strokeWidth="1.25" strokeDasharray="3 3"/>

    </Frame>
  );
}

export function CellOutlinesIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "Rod-shaped bacteria with outlines, one being drawn by hand"} {...props}>
      
<defs><pattern id={`${uid}-gB`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gB)`}/>
<rect x="150" y="120" width="220" height="64" rx="32" transform="rotate(-14 260 152)" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="250" y="180" width="200" height="60" rx="30" transform="rotate(10 350 210)" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="90" y="210" width="150" height="56" rx="28" transform="rotate(-4 165 238)" fill="var(--ill-paper)" fillOpacity="0.6" stroke="var(--ill-track)" strokeWidth="1.25" strokeDasharray="4 4"/>
<g><circle cx="226" cy="160" r="11" fill="var(--ill-grid)"/><circle cx="226" cy="160" r="5" fill="var(--ill-spot)"/><circle cx="304" cy="138" r="11" fill="var(--ill-grid)"/><circle cx="304" cy="138" r="5" fill="var(--ill-spot)"/><circle cx="388" cy="214" r="11" fill="var(--ill-grid)"/><circle cx="388" cy="214" r="5" fill="var(--ill-spot)"/></g>
<g fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25"><rect x="362.7" y="121.4" width="8" height="8" rx="1.5"/><rect x="149.3" y="174.6" width="8" height="8" rx="1.5"/></g>
<g stroke="var(--ill-track)" strokeWidth="1.25" fill="none"><circle cx="240" cy="233" r="8"/><line x1="240" y1="219" x2="240" y2="227"/><line x1="240" y1="239" x2="240" y2="247"/><line x1="226" y1="233" x2="234" y2="233"/><line x1="246" y1="233" x2="254" y2="233"/></g>
<g stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round"><line x1="462" y1="96" x2="474" y2="108"/><line x1="474" y1="96" x2="462" y2="108"/><line x1="122" y1="102" x2="132" y2="112"/><line x1="132" y1="102" x2="122" y2="112"/></g>

    </Frame>
  );
}

export function AnalysisIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "A window with a jump-distance histogram split into a slow and a fast population"} {...props}>
      
<defs><pattern id={`${uid}-gC`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gC)`}/>
<rect x="140" y="62" width="300" height="200" rx="12" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<g fill="var(--ill-line)"><circle cx="416" cy="78" r="2.2"/><circle cx="424" cy="78" r="2.2"/><circle cx="408" cy="78" r="2.2"/></g>
<rect x="186" y="96" width="300" height="200" rx="12" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<line x1="186" y1="124" x2="486" y2="124" stroke="var(--ill-grid)"/>
<g fill="var(--ill-line)"><circle cx="462" cy="110" r="2.2"/><circle cx="470" cy="110" r="2.2"/><circle cx="454" cy="110" r="2.2"/></g>
<rect x="202" y="106" width="56" height="8" rx="4" fill="var(--ill-fill)"/>
<g fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1">
<rect x="210" y="258" width="14" height="18"/><rect x="228" y="214" width="14" height="62"/><rect x="246" y="184" width="14" height="92"/><rect x="264" y="206" width="14" height="70"/><rect x="282" y="232" width="14" height="44"/><rect x="300" y="240" width="14" height="36"/><rect x="318" y="238" width="14" height="38"/><rect x="336" y="240" width="14" height="36"/><rect x="354" y="246" width="14" height="30"/><rect x="372" y="252" width="14" height="24"/><rect x="390" y="258" width="14" height="18"/><rect x="408" y="264" width="14" height="12"/><rect x="426" y="268" width="14" height="8"/><rect x="444" y="271" width="14" height="5"/>
</g>
<line x1="204" y1="276" x2="468" y2="276" stroke="var(--ill-line)" strokeWidth="1.25"/>
<path d="M210 274 C 232 236, 242 188, 253 188 C 266 188, 280 238, 304 268 C 316 274, 340 276, 466 276" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M210 276 C 260 268, 300 246, 336 244 C 380 244, 420 266, 466 273" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>

    </Frame>
  );
}

export function FoldersIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "Two project folders with movie files inside"} {...props}>
      
<defs><pattern id={`${uid}-gD`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gD)`}/>
<rect x="170" y="70" width="64" height="24" rx="6" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="170" y="84" width="230" height="156" rx="10" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="226" y="98" width="190" height="60" rx="6" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="234" y="88" width="190" height="60" rx="6" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="210" y="110" width="64" height="24" rx="6" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="210" y="124" width="240" height="156" rx="10" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<g fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"><rect x="232" y="150" width="22" height="22" rx="4"/><rect x="232" y="186" width="22" height="22" rx="4"/><rect x="232" y="222" width="22" height="22" rx="4"/></g>
<g fill="var(--ill-spot)"><circle cx="243" cy="161" r="4"/><circle cx="243" cy="197" r="4"/></g>
<circle cx="243" cy="233" r="4" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1"/>
<g fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1"><rect x="266" y="157" width="132" height="8" rx="4"/><rect x="266" y="193" width="108" height="8" rx="4"/><rect x="266" y="229" width="120" height="8" rx="4"/></g>

    </Frame>
  );
}

export function FiguresIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "A figure sheet with three panels and a palette of condition colors"} {...props}>
      
<defs><pattern id={`${uid}-gE`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gE)`}/>
<rect x="196" y="44" width="240" height="236" rx="8" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="180" y="58" width="240" height="236" rx="8" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<g fill="var(--ill-ground)" stroke="var(--ill-line)" strokeWidth="1"><rect x="196" y="74" width="100" height="84" rx="4"/><rect x="304" y="74" width="100" height="84" rx="4"/><rect x="196" y="166" width="208" height="112" rx="4"/></g>
<g fill="var(--ill-track)" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600"><text x="202" y="88" className="font-mono">A</text><text x="310" y="88" className="font-mono">B</text><text x="202" y="180" className="font-mono">C</text></g>
<g fill="var(--ill-spot)"><circle cx="224" cy="132" r="3"/><circle cx="236" cy="120" r="3"/><circle cx="248" cy="126" r="3"/><circle cx="258" cy="110" r="3"/><circle cx="270" cy="104" r="3"/><circle cx="280" cy="96" r="3"/></g>
<g fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1"><rect x="322" y="118" width="14" height="30"/><rect x="342" y="100" width="14" height="48"/><rect x="362" y="126" width="14" height="22"/><rect x="382" y="110" width="14" height="38"/></g>
<path d="M210 260 C 250 252, 270 210, 300 206 C 330 202, 360 236, 392 230" fill="none" stroke="var(--ill-track)" strokeWidth="1.5"/>
<path d="M210 264 C 250 262, 280 240, 310 236 C 340 232, 370 250, 392 248" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeDasharray="4 3"/>
<rect x="436" y="196" width="92" height="36" rx="18" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<circle cx="458" cy="214" r="8" fill="#e69f00"/><circle cx="482" cy="214" r="8" fill="#56b4e9"/><circle cx="506" cy="214" r="8" fill="#009e73"/>

    </Frame>
  );
}

export function SpotIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 600 336" title={props.title ?? "A single-molecule spot as a five by five block of lit pixels, with a fitted circle and its track leaving to the right"} {...props}>
      
<defs><pattern id={`${uid}-gF`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="600" height="336" fill="var(--ill-ground)"/><rect width="600" height="336" fill={`url(#${uid}-gF)`}/>
<g>
<rect x="216" y="96" width="24" height="24" fill="var(--ill-fill)"/><rect x="240" y="96" width="24" height="24" fill="var(--ill-fill)"/><rect x="264" y="96" width="24" height="24" fill="var(--ill-fill)"/>
<rect x="192" y="120" width="24" height="24" fill="var(--ill-fill)"/><rect x="216" y="120" width="24" height="24" fill="var(--ill-grid)"/><rect x="240" y="120" width="24" height="24" fill="var(--ill-spot)"/><rect x="264" y="120" width="24" height="24" fill="var(--ill-grid)"/><rect x="288" y="120" width="24" height="24" fill="var(--ill-fill)"/>
<rect x="192" y="144" width="24" height="24" fill="var(--ill-fill)"/><rect x="216" y="144" width="24" height="24" fill="var(--ill-spot)"/><rect x="240" y="144" width="24" height="24" fill="var(--ill-spot-strong)"/><rect x="264" y="144" width="24" height="24" fill="var(--ill-spot)"/><rect x="288" y="144" width="24" height="24" fill="var(--ill-fill)"/>
<rect x="192" y="168" width="24" height="24" fill="var(--ill-fill)"/><rect x="216" y="168" width="24" height="24" fill="var(--ill-grid)"/><rect x="240" y="168" width="24" height="24" fill="var(--ill-spot)"/><rect x="264" y="168" width="24" height="24" fill="var(--ill-grid)"/><rect x="288" y="168" width="24" height="24" fill="var(--ill-fill)"/>
<rect x="216" y="192" width="24" height="24" fill="var(--ill-fill)"/><rect x="240" y="192" width="24" height="24" fill="var(--ill-fill)"/><rect x="264" y="192" width="24" height="24" fill="var(--ill-fill)"/>
</g>
<circle cx="252" cy="156" r="34" fill="none" stroke="var(--ill-track)" strokeWidth="1.25"/>
<g stroke="var(--ill-track)" strokeWidth="1.25"><line x1="246" y1="156" x2="258" y2="156"/><line x1="252" y1="150" x2="252" y2="162"/></g>
<polyline points="286,156 330,134 372,152 404,126 452,140" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="1 0"/>
<g stroke="var(--ill-track)" strokeWidth="1.25"><circle cx="330" cy="134" r="7" fill="var(--ill-grid)"/><circle cx="372" cy="152" r="6" fill="var(--ill-fill)"/><circle cx="404" cy="126" r="5" fill="var(--ill-ground)"/><circle cx="452" cy="140" r="4" fill="var(--ill-paper)"/></g>

    </Frame>
  );
}

export function HeroIllustration(props: Props) {
  const uid = useId().replace(/:/g, '');
  return (
    <Frame viewBox="0 0 640 440" title={props.title ?? "A rod-shaped bacterium on a camera pixel grid with three molecule tracks: one confined, two moving freely, and a 1 micrometer scale bar"} {...props}>
      
<defs><pattern id={`${uid}-hero-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0V24M0 24H24" fill="none" stroke="var(--ill-grid)" strokeWidth="1" strokeDasharray="2 3"/></pattern></defs>
<rect width="640" height="440" fill="var(--ill-ground)"/><rect width="640" height="440" fill={`url(#${uid}-hero-grid)`}/>
<rect x="430" y="340" width="300" height="120" rx="60" transform="rotate(6 580 400)" fill="var(--ill-paper)" stroke="var(--ill-line)" strokeWidth="1.25"/>
<rect x="80" y="130" width="480" height="180" rx="90" transform="rotate(-8 320 220)" fill="var(--ill-fill)" stroke="var(--ill-line)" strokeWidth="1.5"/>
<g>
<rect x="216" y="192" width="24" height="24" fill="var(--ill-grid)"/><rect x="192" y="216" width="24" height="24" fill="var(--ill-grid)"/><rect x="216" y="216" width="24" height="24" fill="var(--ill-spot)"/><rect x="240" y="216" width="24" height="24" fill="var(--ill-grid)"/><rect x="216" y="240" width="24" height="24" fill="var(--ill-grid)"/>
<rect x="456" y="144" width="24" height="24" fill="var(--ill-grid)"/><rect x="432" y="168" width="24" height="24" fill="var(--ill-grid)"/><rect x="456" y="168" width="24" height="24" fill="var(--ill-spot-strong)"/><rect x="480" y="168" width="24" height="24" fill="var(--ill-grid)"/><rect x="456" y="192" width="24" height="24" fill="var(--ill-grid)"/>
</g>
<polyline points="232,222 222,234 214,224 226,216 236,230 220,240 212,230 228,228" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
<polyline points="292,256 330,222 366,246 398,198 436,222 468,180" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
<polyline points="140,252 164,222 152,198 188,184" fill="none" stroke="var(--ill-track)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3"/>
<g fill="var(--ill-paper)" stroke="var(--ill-track)" strokeWidth="1.25"><circle cx="292" cy="256" r="3"/><circle cx="330" cy="222" r="3"/><circle cx="366" cy="246" r="3"/><circle cx="398" cy="198" r="3"/><circle cx="436" cy="222" r="3"/><circle cx="140" cy="252" r="3"/><circle cx="164" cy="222" r="3"/><circle cx="152" cy="198" r="3"/><circle cx="188" cy="184" r="3"/></g>
<circle cx="468" cy="180" r="4" fill="var(--ill-ink)"/><circle cx="228" cy="228" r="4" fill="var(--ill-ink)"/>
<line x1="48" y1="400" x2="274" y2="400" stroke="var(--ill-track)" strokeWidth="3" strokeLinecap="butt"/>
<text x="48" y="388" fontFamily="Geist Mono, monospace" fontSize="13" fill="var(--ill-track)" className="font-mono">1 µm</text>

    </Frame>
  );
}
