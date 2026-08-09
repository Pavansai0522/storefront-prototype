import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { clientConfig } from '../config/client-config';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_PHONE_PRIMARY_DISPLAY,
  STORE_PHONE_PRIMARY_TEL,
  STORE_PHONE_SECONDARY_DISPLAY,
  STORE_PHONE_SECONDARY_TEL,
  STORE_WHATSAPP_HREF,
} from '../config/store';
import { LEGAL_FOOTER_LINKS } from '../data/legalPolicies';
import { StoreBrandLogo } from './StoreBrandLogo';

export function Footer(): JSX.Element {
  const { clientConfig: store } = useStoreData();

  return (
    <footer className="mt-auto border-t border-gold/20 bg-footer pt-12 pb-6 pb-safe md:pt-16">
      <div className="container mx-auto">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div className="text-center md:text-left">
            <StoreBrandLogo textClassName="text-xl md:text-2xl" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {store.tagline || clientConfig.tagline}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/" className="transition hover:text-gold">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="transition hover:text-gold">
                  Food Menu
                </Link>
              </li>
              <li>
                <Link to="/function-hall" className="transition hover:text-gold">
                  Function Hall
                </Link>
              </li>
              <li>
                <Link to="/residence" className="transition hover:text-gold">
                  Guest Rooms
                </Link>
              </li>
              <li>
                <Link to="/#visit-us" className="transition hover:text-gold">
                  Visit Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                {STORE_ADDRESS_LINE1}
                <br />
                {STORE_ADDRESS_LINE2}
              </li>
              <li>
                <a href={STORE_PHONE_PRIMARY_TEL} className="font-semibold tabular-nums text-gold hover:underline">
                  {STORE_PHONE_PRIMARY_DISPLAY}
                </a>
                <span className="mx-2 text-muted">·</span>
                <a href={STORE_PHONE_SECONDARY_TEL} className="tabular-nums transition hover:text-gold">
                  {STORE_PHONE_SECONDARY_DISPLAY}
                </a>
              </li>
              <li>
                <a href={STORE_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                  WhatsApp
                </a>
              </li>
              <li>Proprietor: {clientConfig.proprietor}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/15 pt-6 text-center text-xs text-muted/70 md:flex md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} {store.storeName}. All rights reserved.</p>
          <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 md:mt-0" aria-label="Legal">
            {LEGAL_FOOTER_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className="transition hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
