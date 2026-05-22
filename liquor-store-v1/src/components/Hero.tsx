import React from 'react';
import { Link } from 'react-router-dom';
import { HERO_IMAGE_ALT, HERO_IMAGE_URL } from '../config/storeBranding';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../config/store';

export function Hero(): JSX.Element {
  return (
    <section
      id="home"
      className="relative flex min-h-0 items-center overflow-hidden bg-background py-12 sm:py-16 md:min-h-[calc(100dvh-5rem-env(safe-area-inset-top,0px))] md:py-0"
    >
      <div className="container relative z-10 mx-auto grid min-w-0 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="min-w-0 max-w-2xl space-y-6 animate-in slide-in-from-left-8 duration-700 fade-in sm:space-y-8">
          <h1 className="font-display text-[1.75rem] font-bold leading-[1.15] sm:text-4xl md:text-5xl lg:text-7xl">
            YOUR CITY&apos;S FINEST <span className="text-gold">SPIRITS</span>
          </h1>

          <p className="text-base leading-relaxed text-muted sm:text-lg md:text-xl">
            Premium wines, craft spirits, and beer — visit us in New Lenox or call to
            check availability.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
            <Link
              to="/shop"
              className="flex min-h-[44px] w-full items-center justify-center rounded bg-gold px-8 py-4 text-center text-base font-bold text-background transition-colors duration-300 hover:bg-gold-hover sm:w-auto sm:text-lg"
            >
              Shop Now
            </Link>
            <a
              href={STORE_PHONE_TEL}
              className="flex min-h-[44px] w-full touch-manipulation items-center justify-center rounded border border-gold px-6 py-4 text-center text-base font-bold text-gold transition-colors duration-300 hover:bg-gold/10 sm:w-auto sm:px-8 sm:text-lg"
              aria-label={`Call ${STORE_PHONE_DISPLAY}`}
            >
              <span className="sm:hidden">Call us</span>
              <span className="hidden sm:inline">Call {STORE_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="relative w-full min-w-0 aspect-[4/3] animate-in slide-in-from-right-8 duration-700 fade-in delay-200">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold/20 to-transparent opacity-30 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <img
              src={HERO_IMAGE_URL}
              alt={HERO_IMAGE_ALT}
              className="h-full w-full object-cover object-[center_35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
