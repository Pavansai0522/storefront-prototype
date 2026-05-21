type StoreLogoMarkProps = {
  size?: number;
  className?: string;
};

/** United Liquors monogram mark (`public/logo-mark.svg`). */
export function StoreLogoMark({ size = 40, className = '' }: StoreLogoMarkProps): JSX.Element {
  return (
    <img
      src="/logo-mark.svg"
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
