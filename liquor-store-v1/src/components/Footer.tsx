import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StoreBrandLogo } from './StoreBrandLogo';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';

const footerLinkClass =
  'inline-block py-2 text-muted transition-colors hover:text-gold';

const socialLinkClass =
  'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-card text-muted transition-colors hover:border-gold hover:text-gold';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-footer pb-8 pt-16 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 md:mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-flex max-w-full min-w-0">
              <StoreBrandLogo textClassName="text-xl font-display font-bold tracking-wider md:text-2xl" />
            </Link>
            <p className="max-w-xs text-muted">
              Your Premier Spirits Destination. Curating the finest selection of
              beverages for our community since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className={socialLinkClass} aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className={socialLinkClass} aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className={socialLinkClass} aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:flex md:justify-center">
            <div>
              <h4 className="mb-4 text-lg font-bold text-foreground md:mb-6">Quick Links</h4>
              <ul className="space-y-1">
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
                  <Link to="/spirits" className={footerLinkClass}>
                    Spirits
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
                <li>
                  <Link to="/#visit-us" className={footerLinkClass}>
                    Visit Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold text-foreground md:mb-6">Contact Us</h4>
            <ul className="space-y-3 text-muted">
              <li>
                {STORE_ADDRESS_LINE1}
                <br />
                {STORE_ADDRESS_LINE2}
              </li>
              {STORE_HOURS.map((row) => (
                <li key={row.label}>
                  {row.label}: {row.time}
                </li>
              ))}
              <li>
                <a href={STORE_PHONE_TEL} className={`${footerLinkClass} !py-1`}>
                  {STORE_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@unitedliquors.com"
                  className={`${footerLinkClass} break-all !py-1`}
                >
                  info@unitedliquors.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gold/20 pt-8 text-center text-sm text-muted/60 md:flex-row md:text-left">
          <p>© 2026 United Liquors. All Rights Reserved.</p>
          <p className="font-medium text-gold/60">Must be 21+ to purchase alcohol.</p>
        </div>
      </div>
    </footer>
  );
}
