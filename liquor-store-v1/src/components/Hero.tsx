import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../config/store';

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-0 items-center overflow-hidden bg-background py-12 sm:py-16 md:min-h-screen md:py-0 md:pt-20"
    >
      <div className="container relative z-10 mx-auto grid items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        <div className="max-w-2xl space-y-6 animate-in slide-in-from-left-8 duration-700 fade-in sm:space-y-8">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
            YOUR CITY&apos;S FINEST <span className="text-gold">SPIRITS</span>
          </h1>

          <p className="text-base leading-relaxed text-muted sm:text-lg md:text-xl">
            Premium wines, craft spirits, imported beers — curated for every
            occasion. Discover our exceptional collection today.
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
              className="flex min-h-[44px] w-full items-center justify-center rounded border border-gold px-8 py-4 text-center text-base font-bold text-gold transition-colors duration-300 hover:bg-gold/10 sm:w-auto sm:text-lg"
            >
              Call {STORE_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="relative h-64 w-full animate-in slide-in-from-right-8 duration-700 fade-in delay-200 sm:h-80 md:h-[500px] lg:h-[700px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold/20 to-transparent opacity-30 blur-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border shadow-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Premium liquor bottles arrangement"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
