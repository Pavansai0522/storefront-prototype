type StoreLogoMarkProps = {
  size?: number;
  className?: string;
};

/** PR mark from official store logo (`public/prlogo3.png`, transparent). */
export function StoreLogoMark({ size = 44, className = '' }: StoreLogoMarkProps): JSX.Element {
  return (
    <img
      src="/prlogo3.png"
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
