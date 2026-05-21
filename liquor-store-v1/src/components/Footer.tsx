import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { StoreBrandLogo } from './StoreBrandLogo';
import { clientConfig } from '../config/client-config';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';

const footerLinkClass =
  'inline-block py-1 text-sm text-muted transition-colors hover:text-gold';

const footerHeadingClass =
  'mb-3 text-center text-sm font-bold uppercase tracking-wide text-foreground md:mb-4 md:text-base md:normal-case';

export function Footer(): JSX.Element {
  const { clientConfig: store } = useStoreData();
  const email = store.email || clientConfig.email;

  return (
    <footer className="mt-auto border-t border-border bg-footer pt-12 pb-6 pb-safe md:pt-16 md:pb-8">
      <div className="container mx-auto">
        <div className="mb-8 grid grid-cols-1 gap-8 md:mb-12 md:grid-cols-3 md:gap-x-10 md:gap-y-8 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center md:items-center md:gap-4">
            <Link to="/" className="inline-flex justify-center">
              <StoreBrandLogo
                className="justify-center"
                textClassName="text-lg font-display font-bold tracking-wider md:text-2xl"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {store.tagline || clientConfig.tagline}
            </p>
          </div>

          {/* Quick Links + Contact — two columns on mobile; separate grid cells from md up */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:contents">
            <div className="min-w-0 text-center md:flex md:justify-center">
              <div>
                <h4 className={footerHeadingClass}>Quick Links</h4>
                <ul className="space-y-0.5 md:hidden">
                  <li>
                    <Link to="/" className={footerLinkClass}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className={footerLinkClass}>
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link to="/wine" className={footerLinkClass}>
                      Wine
                    </Link>
                  </li>
                  <li>
                    <Link to="/beer" className={footerLinkClass}>
                      Beer
                    </Link>
                  </li>
                </ul>
                <ul className="hidden space-y-2 md:block">
                  <li className="flex justify-center gap-5">
                    <Link to="/" className={footerLinkClass}>
                      Home
                    </Link>
                    <Link to="/shop" className={footerLinkClass}>
                      Shop
                    </Link>
                  </li>
                  <li className="flex justify-center gap-5">
                    <Link to="/wine" className={footerLinkClass}>
                      Wine
                    </Link>
                    <Link to="/beer" className={footerLinkClass}>
                      Beer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="min-w-0 text-center md:text-center">
              <h4 className={footerHeadingClass}>Contact Us</h4>
              <ul className="space-y-2 text-sm leading-snug text-muted">
                <li>
                  {STORE_ADDRESS_LINE1}
                  <br />
                  {STORE_ADDRESS_LINE2}
                </li>
                <li>
                  <a href={STORE_PHONE_TEL} className={`${footerLinkClass} !py-0`}>
                    {STORE_PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className={`${footerLinkClass} break-all !py-0`}>
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gold/20 pt-6 text-center text-xs text-muted/60 sm:text-sm md:flex-row md:gap-4 md:pt-8 md:text-left">
          <p className="max-w-full px-1">© {new Date().getFullYear()} {store.storeName}. All Rights Reserved.</p>
          <p className="max-w-xs font-medium text-gold/60 md:max-w-none">
            Must be 21+ to purchase alcohol.
          </p>
        </div>
      </div>
    </footer>
  );
}
