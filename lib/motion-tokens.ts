// Motion tokens for the whole site (ecc motion-foundations). Components import these; no inline timings.
export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
    crawl: 1.0,
  },
  easing: {
    /** the site's signature curve (motion-design "Premium"): smooth both ends, no overshoot */
    premium: [0.4, 0, 0.2, 1],
    /** exits: gentle start, quick departure (motion-design: exits accelerate) */
    exit: [0.3, 0, 1, 1],
    /** entrances: quick start, gentle landing (motion-design: entrances decelerate) */
    enter: [0.05, 0.7, 0.1, 1],
    smooth: [0.22, 1, 0.36, 1],
    sharp: [0.4, 0, 0.2, 1],
    linear: [0, 0, 1, 1],
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
  },
  scale: {
    subtle: 0.98,
    press: 0.97,
  },
  stagger: 0.08,
} as const;

export const springs = {
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  instant: { type: 'spring', stiffness: 600, damping: 35 },
  release: { type: 'spring', stiffness: 200, damping: 20, restDelta: 0.001 },
  /** Smooths a scroll-linked value so the figure settles instead of stepping with the wheel. */
  scroll: { stiffness: 140, damping: 30, restDelta: 0.0005 },
} as const;
