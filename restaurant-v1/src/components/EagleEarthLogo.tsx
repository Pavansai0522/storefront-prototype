import { clientConfig } from '../config/client-config';

const BRAND_LOGO_SRC = '/brand/arunas-eagle-logo.png';

type EagleEarthLogoProps = {
  size?: number;
  className?: string;
  /** Gentle pulse on loader / hero. */
  animated?: boolean;
  title?: string;
  src?: string;
};

/** Official brand mark — eagle on globe (PNG from listing). */
export function EagleEarthLogo({
  size = 48,
  className = '',
  animated = false,
  title = "Aruna's Eagle",
  src,
}: EagleEarthLogoProps): JSX.Element {
  const logoSrc = src ?? clientConfig.logo ?? BRAND_LOGO_SRC;
  const animClass = animated ? 'eagle-earth-logo--animated' : '';

  return (
    <img
      src={logoSrc}
      alt={title}
      width={size}
      height={size}
      className={`eagle-earth-logo object-contain ${animClass} ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
}
