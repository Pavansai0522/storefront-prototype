import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, UtensilsCrossed } from 'lucide-react';
import { btnPrimary, btnSecondary } from '../constants/buttonStyles';
import { STORE_PHONE_PRIMARY_DISPLAY, STORE_PHONE_PRIMARY_TEL } from '../config/store';
import { HERO_IMAGE_ALT, HERO_IMAGE_URL } from '../config/storeBranding';

export function Hero(): JSX.Element {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden bg-maroon-deep py-12 sm:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(204,159,63,.08) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />
      <div className="container relative z-10 mx-auto grid min-w-0 items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="min-w-0 max-w-2xl space-y-6 text-center md:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            Chilakaluripeta · Family Restaurant
          </p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            Aruna&apos;s Eagle
            <span className="mt-3 block font-serif text-lg italic text-gold sm:text-xl">
              Dine in · Takeaway · Celebrations
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            A warm family kitchen known for Andhra non-veg, dum biryani, and tandoori — served fresh
            from our dining room every day.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/menu" className={btnPrimary}>
              <UtensilsCrossed className="h-4 w-4" aria-hidden />
              See Food Menu
            </Link>
            <a href={STORE_PHONE_PRIMARY_TEL} className={btnSecondary}>
              <Phone className="h-4 w-4" aria-hidden />
              Call {STORE_PHONE_PRIMARY_DISPLAY}
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden border border-gold/30 shadow-2xl">
          <img
            src={HERO_IMAGE_URL}
            alt={HERO_IMAGE_ALT}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
