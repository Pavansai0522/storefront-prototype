export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<SpinnerSize, { outer: string; inner: string }> = {
  sm: { outer: 'h-5 w-5', inner: 'inset-[3px]' },
  md: { outer: 'h-10 w-10', inner: 'inset-[5px]' },
  lg: { outer: 'h-14 w-14', inner: 'inset-[6px]' },
};

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps): JSX.Element {
  const { outer, inner } = SIZE_MAP[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      className={`flex shrink-0 items-center justify-center ${className}`}
    >
      <div className={`relative ${outer}`}>
        <div className="absolute inset-0 rounded-full border-2 border-gold/30" aria-hidden />
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold motion-reduce:animate-none"
          aria-hidden
        />
        <div className={`absolute ${inner} rounded-full bg-background`} aria-hidden />
      </div>
    </div>
  );
}
