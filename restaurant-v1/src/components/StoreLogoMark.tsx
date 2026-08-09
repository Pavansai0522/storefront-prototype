import { EagleEarthLogo } from './EagleEarthLogo';

type StoreLogoMarkProps = {
  size?: number;
  className?: string;
};

/** Official eagle-on-globe brand mark. */
export function StoreLogoMark({ size = 40, className = '' }: StoreLogoMarkProps): JSX.Element {
  return <EagleEarthLogo size={size} className={className} />;
}
