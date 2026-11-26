import { cn } from '@/lib/cn';

/** The mark: a rod-shaped cell, a molecule's jumps inside it, and the molecule, the only filled shape. */
export function LogoMark({
  className,
  tone = 'auto',
  title,
}: {
  className?: string;
  /** auto: follows the theme. onDark: white lines, emission-300 molecule. */
  tone?: 'auto' | 'onDark';
  title?: string;
}) {
  const line = tone === 'onDark' ? '#fafafa' : 'currentColor';
  const dot = tone === 'onDark' ? '#b5da55' : 'var(--logo-dot, currentColor)';
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x="5" y="16" width="54" height="32" rx="16" fill="none" stroke={line} strokeWidth="5" />
      <polyline
        points="17,37 24,27 31,36 38,27"
        fill="none"
        stroke={line}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="32" r="5" fill={dot} />
    </svg>
  );
}

/** App-icon tile with the wordmark, as used in the nav bars. */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-fd-foreground', className)}>
      <span
        className={cn(
          'flex items-center justify-center bg-[#171717] dark:ring-1 dark:ring-white/15',
          size === 'sm' ? 'size-7 rounded-[7px]' : 'size-[30px] rounded-lg',
        )}
      >
        <LogoMark tone="onDark" className={size === 'sm' ? 'size-5' : 'size-[22px]'} />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.01em]">SMTracker</span>
    </span>
  );
}
